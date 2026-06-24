import * as fs from 'fs';
import * as path from 'path';
import { ActivityEntry, BacklogSnapshot, TaskCard } from './types.js';

const MAX_EVENTS = 50;
const MAX_TASK_ACTIVITY = 20;

export function loadActivityLog(kanbanDir: string): ActivityEntry[] {
  const p = path.join(kanbanDir, 'activity.json');
  if (!fs.existsSync(p)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    return Array.isArray(data.events) ? data.events : [];
  } catch {
    return [];
  }
}

export function saveActivityLog(kanbanDir: string, events: ActivityEntry[]): void {
  const trimmed = events.slice(0, MAX_EVENTS);
  fs.writeFileSync(path.join(kanbanDir, 'activity.json'), JSON.stringify({ events: trimmed }, null, 2));
}

function taskSnapshotKey(t: TaskCard): string {
  return JSON.stringify({
    title: t.title,
    status: t.status,
    column: t.column,
    priority: t.priority,
    owner: t.owner,
  });
}

export function diffTasks(
  prev: BacklogSnapshot | null,
  next: BacklogSnapshot,
  changedTaskIds: string[]
): { events: ActivityEntry[]; messages: Map<string, string> } {
  const now = new Date().toISOString();
  const events: ActivityEntry[] = [];
  const messages = new Map<string, string>();

  for (const taskId of changedTaskIds) {
    const prevTask = prev?.tasks[taskId];
    const nextTask = next.tasks[taskId];

    if (!nextTask) {
      const msg = `Task ${taskId} removed from board`;
      events.push({ at: now, message: msg });
      messages.set(taskId, msg);
      continue;
    }

    if (!prevTask) {
      const msg = `Task ${taskId} added: ${nextTask.title}`;
      events.push({ at: now, message: msg });
      messages.set(taskId, msg);
      continue;
    }

    const parts: string[] = [];
    if (prevTask.column !== nextTask.column) {
      parts.push(`Moved to ${formatColumn(nextTask.column)}`);
    }
    if (prevTask.status !== nextTask.status) {
      parts.push(`Status → ${formatStatus(nextTask.status)}`);
    }
    if (prevTask.title !== nextTask.title) {
      parts.push('Title updated');
    }

    const msg = parts.length ? parts.join(', ') : `Task ${taskId} updated`;
    events.push({ at: now, message: `${taskId}: ${msg}` });
    messages.set(taskId, msg);
  }

  return { events, messages };
}

function formatColumn(col: string): string {
  const map: Record<string, string> = {
    unplanned: 'Unplanned',
    planned: 'Planned',
    inProgress: 'In Progress',
    completed: 'Completed',
  };
  return map[col] || col;
}

function formatStatus(s: string): string {
  const map: Record<string, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
  };
  return map[s] || s;
}

export function mergeTaskActivity(
  task: TaskCard,
  mdLines: string[],
  diffMessage?: string
): ActivityEntry[] {
  const fromMd: ActivityEntry[] = mdLines.slice(-5).map((line) => ({
    at: '',
    message: line,
  }));

  const fromDiff: ActivityEntry[] = diffMessage
    ? [{ at: new Date().toISOString(), message: diffMessage }]
    : [];

  const combined = [...fromDiff, ...fromMd];
  return combined.slice(0, MAX_TASK_ACTIVITY);
}

export function appendGlobalEvents(
  kanbanDir: string,
  newEvents: ActivityEntry[],
  prev: BacklogSnapshot | null,
  next: BacklogSnapshot,
  changedFiles: string[]
): BacklogSnapshot {
  const global = loadActivityLog(kanbanDir);
  const merged = [...newEvents, ...global].slice(0, MAX_EVENTS);
  saveActivityLog(kanbanDir, merged);

  const recentEvents = newEvents.map((e, i) => {
    const file = changedFiles[i] || changedFiles[0] || '';
    const taskId = extractTaskIdFromPath(file) || '';
    return {
      at: e.at || new Date().toISOString(),
      taskId,
      path: file,
      type: 'change',
      message: e.message,
    };
  });

  next.recentEvents = [...recentEvents, ...(prev?.recentEvents || [])].slice(0, MAX_EVENTS);
  return next;
}

function extractTaskIdFromPath(filePath: string): string {
  const base = path.basename(filePath, '.md');
  const m = base.match(/^task-(.+)$/);
  return m ? m[1] : '';
}
