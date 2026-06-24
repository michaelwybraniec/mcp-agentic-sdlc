import * as fs from 'fs';
import * as path from 'path';
import { ActivityEntry, ActivityKind, BacklogSnapshot, TaskCard } from './types.js';
import { isTaskMarkdownFile, taskIdFromFilename } from './parser.js';

const MAX_EVENTS = 100;
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

export function taskIdsFromChangedFiles(changedFiles: string[]): string[] {
  const ids = new Set<string>();
  for (const file of changedFiles) {
    if (!isTaskMarkdownFile(file)) continue;
    const id = taskIdFromFilename(file);
    if (id) ids.add(id);
  }
  return [...ids];
}

export function diffTasks(
  prev: BacklogSnapshot | null,
  next: BacklogSnapshot,
  changedTaskIds: string[]
): { events: ActivityEntry[]; messages: Map<string, string> } {
  const now = new Date().toISOString();
  const events: ActivityEntry[] = [];
  const messages = new Map<string, string>();

  if (!prev) {
    const count = Object.keys(next.tasks).length;
    events.push({
      at: now,
      kind: 'sync',
      message: count ? `Backlog loaded · ${count} task${count === 1 ? '' : 's'}` : 'Backlog loaded',
    });
    return { events, messages };
  }

  const taskIds = changedTaskIds.filter((id) => id && (prev.tasks[id] || next.tasks[id]));

  for (const taskId of taskIds) {
    const prevTask = prev.tasks[taskId];
    const nextTask = next.tasks[taskId];

    if (!nextTask) {
      const msg = `Removed from board · ${prevTask?.title || taskId}`;
      events.push({
        at: now,
        kind: 'removed',
        taskId,
        title: prevTask?.title,
        message: msg,
      });
      messages.set(taskId, msg);
      continue;
    }

    if (!prevTask) {
      const col = formatColumn(nextTask.column);
      const msg = `Added to ${col} · ${nextTask.title}`;
      events.push({
        at: now,
        kind: 'added',
        taskId,
        title: nextTask.title,
        message: msg,
      });
      messages.set(taskId, msg);
      continue;
    }

    const parts: string[] = [];
    let kind: ActivityKind = 'updated';

    if (prevTask.column !== nextTask.column) {
      parts.push(`Moved to ${formatColumn(nextTask.column)}`);
      kind = 'moved';
    }
    if (prevTask.status !== nextTask.status) {
      parts.push(`Status → ${formatStatus(nextTask.status)}`);
      if (kind !== 'moved') kind = 'status';
    }
    if (prevTask.title !== nextTask.title) {
      parts.push('Title updated');
    }

    const msg = parts.length
      ? `${parts.join(' · ')} — ${nextTask.title}`
      : `Updated — ${nextTask.title}`;

    events.push({
      at: now,
      kind,
      taskId,
      title: nextTask.title,
      message: msg,
    });
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
    kind: 'updated',
  }));

  const fromDiff: ActivityEntry[] = diffMessage
    ? [{ at: new Date().toISOString(), message: diffMessage, kind: 'updated', taskId: task.id, title: task.title }]
    : [];

  const combined = [...fromDiff, ...fromMd];
  return combined.slice(0, MAX_TASK_ACTIVITY);
}

export function contractChangeEvent(): ActivityEntry {
  return {
    at: new Date().toISOString(),
    kind: 'contract',
    message: 'Foundation agreement updated (base.md)',
  };
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

  const recentEvents = newEvents.map((e) => {
    const file = changedFiles.find((f) => isTaskMarkdownFile(f)) || '';
    const taskId = e.taskId || (file ? taskIdFromFilename(file) : '');
    const kind = e.kind || 'updated';
    return {
      at: e.at || new Date().toISOString(),
      taskId,
      path: file,
      type: kind,
      kind,
      title: e.title,
      message: e.message,
    };
  });

  next.recentEvents = [...recentEvents, ...(prev?.recentEvents || [])].slice(0, MAX_EVENTS);
  return next;
}
