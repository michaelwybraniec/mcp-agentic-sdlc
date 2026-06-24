import * as fs from 'fs';
import * as path from 'path';
import { BacklogSnapshot, TaskCard } from './types.js';

export type TimeActor = 'agent' | 'human';

export interface TimeSession {
  taskId: string;
  title?: string;
  startedAt: string;
  endedAt: string | null;
  actor: TimeActor;
}

export interface TaskTimeRecord {
  taskId: string;
  title: string;
  sessions: TimeSession[];
  totalsMs: { agent: number; human: number; combined: number };
}

export interface TimeTrackingStore {
  version: 1;
  updatedAt: string;
  /** Open in-progress sessions (taskId → session start metadata). */
  active: Record<string, { startedAt: string; actor: TimeActor; title: string }>;
  tasks: Record<string, TaskTimeRecord>;
  summary: { agentMs: number; humanMs: number; combinedMs: number };
}

export interface TaskTimeSpent {
  agentMs: number;
  humanMs: number;
  combinedMs: number;
  isActive: boolean;
}

const FILE_NAME = 'time-tracking.json';

export function loadTimeTracking(kanbanDir: string): TimeTrackingStore {
  const p = path.join(kanbanDir, FILE_NAME);
  if (!fs.existsSync(p)) return emptyStore();
  try {
    const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as TimeTrackingStore;
    if (raw.version !== 1) return emptyStore();
    return {
      version: 1,
      updatedAt: raw.updatedAt || new Date().toISOString(),
      active: raw.active || {},
      tasks: raw.tasks || {},
      summary: raw.summary || { agentMs: 0, humanMs: 0, combinedMs: 0 },
    };
  } catch {
    return emptyStore();
  }
}

export function saveTimeTracking(kanbanDir: string, store: TimeTrackingStore): void {
  fs.writeFileSync(path.join(kanbanDir, FILE_NAME), JSON.stringify(store, null, 2));
}

function emptyStore(): TimeTrackingStore {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    active: {},
    tasks: {},
    summary: { agentMs: 0, humanMs: 0, combinedMs: 0 },
  };
}

/** Infer who started work from recent activity / sync messages. */
export function inferTimeActor(messages: string[]): TimeActor {
  const text = messages.filter(Boolean).join(' ').toLowerCase();
  if (/\(human\)|\bhuman\s*only\b|handoff|awaiting human/i.test(text)) return 'human';
  if (
    /\(ai\)|awp auto|backlog_sync|started task|task started|project started|via awp/i.test(text)
  ) {
    return 'agent';
  }
  return 'agent';
}

function isTaskActive(task: TaskCard | undefined): boolean {
  if (!task) return false;
  return task.status === 'in_progress' || task.column === 'inProgress';
}

function ensureTaskRecord(store: TimeTrackingStore, taskId: string, title: string): TaskTimeRecord {
  if (!store.tasks[taskId]) {
    store.tasks[taskId] = {
      taskId,
      title,
      sessions: [],
      totalsMs: { agent: 0, human: 0, combined: 0 },
    };
  } else if (title) {
    store.tasks[taskId].title = title;
  }
  return store.tasks[taskId];
}

function startSession(
  store: TimeTrackingStore,
  taskId: string,
  title: string,
  at: string,
  actor: TimeActor
): void {
  if (store.active[taskId]) return;
  store.active[taskId] = { startedAt: at, actor, title };
  const rec = ensureTaskRecord(store, taskId, title);
  rec.sessions.push({
    taskId,
    title,
    startedAt: at,
    endedAt: null,
    actor,
  });
}

function endSession(store: TimeTrackingStore, taskId: string, at: string): void {
  const active = store.active[taskId];
  if (!active) return;

  const rec = store.tasks[taskId];
  const open = rec?.sessions.find((s) => !s.endedAt);
  if (open) open.endedAt = at;

  delete store.active[taskId];
}

function sessionDurationMs(session: TimeSession, nowMs: number): number {
  const start = Date.parse(session.startedAt);
  const end = session.endedAt ? Date.parse(session.endedAt) : nowMs;
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return end - start;
}

export function computeTaskTotals(record: TaskTimeRecord, now = Date.now()): TaskTimeSpent {
  let agent = 0;
  let human = 0;
  for (const s of record.sessions) {
    const ms = sessionDurationMs(s, now);
    if (s.actor === 'human') human += ms;
    else agent += ms;
  }
  const isActive = record.sessions.some((s) => !s.endedAt);
  return { agentMs: agent, humanMs: human, combinedMs: agent + human, isActive };
}

export function recalculateSummary(store: TimeTrackingStore, now = Date.now()): void {
  let agentMs = 0;
  let humanMs = 0;
  for (const rec of Object.values(store.tasks)) {
    const t = computeTaskTotals(rec, now);
    rec.totalsMs = { agent: t.agentMs, human: t.humanMs, combined: t.combinedMs };
    agentMs += t.agentMs;
    humanMs += t.humanMs;
  }
  store.summary = { agentMs, humanMs, combinedMs: agentMs + humanMs };
}

export function updateTimeTracking(
  kanbanDir: string,
  prev: BacklogSnapshot | null,
  next: BacklogSnapshot
): TimeTrackingStore {
  const store = loadTimeTracking(kanbanDir);
  const now = new Date().toISOString();
  const allIds = new Set([
    ...Object.keys(prev?.tasks || {}),
    ...Object.keys(next.tasks),
  ]);

  for (const taskId of allIds) {
    const prevTask = prev?.tasks[taskId];
    const nextTask = next.tasks[taskId];
    const wasActive = isTaskActive(prevTask);
    const isActive = isTaskActive(nextTask);

    if (!wasActive && isActive && nextTask) {
      const msgs = [
        ...(nextTask.activity || []).map((a) => a.message),
      ];
      const actor = inferTimeActor(msgs);
      startSession(store, taskId, nextTask.title, now, actor);
    } else if (wasActive && !isActive) {
      endSession(store, taskId, now);
    } else if (!nextTask && store.active[taskId]) {
      endSession(store, taskId, now);
    }
  }

  for (const taskId of next.boardHealth.inProgressIds) {
    const t = next.tasks[taskId];
    if (t && !store.active[taskId]) {
      const actor = inferTimeActor((t.activity || []).map((a) => a.message));
      startSession(store, taskId, t.title, now, actor);
    }
  }

  recalculateSummary(store, Date.now());
  store.updatedAt = now;
  saveTimeTracking(kanbanDir, store);
  return store;
}

export function enrichSnapshotWithTime(
  snapshot: BacklogSnapshot,
  store: TimeTrackingStore,
  now = Date.now()
): void {
  recalculateSummary(store, now);
  for (const task of Object.values(snapshot.tasks)) {
    const rec = store.tasks[task.id];
    task.timeSpent = rec
      ? computeTaskTotals(rec, now)
      : { agentMs: 0, humanMs: 0, combinedMs: 0, isActive: !!store.active[task.id] };
  }
  snapshot.timeDashboard = {
    ...store.summary,
    updatedAt: store.updatedAt,
    taskCount: Object.keys(store.tasks).length,
    activeTaskIds: Object.keys(store.active),
  };
}

export function formatDuration(ms: number): string {
  if (!ms || ms < 1000) return '<1m';
  const totalMin = Math.floor(ms / 60000);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
