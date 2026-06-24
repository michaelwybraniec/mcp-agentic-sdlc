import * as fs from 'fs';
import * as path from 'path';
import { TASK_STATUS } from './taskStatus.js';
import { taskIdFromFilename } from './parser.js';

export type TaskMdStatus = 'pending' | 'in_progress' | 'completed';

const STATUS_LINE: Record<TaskMdStatus, string> = {
  pending: `# Status: ${TASK_STATUS.pending}`,
  in_progress: `# Status: ${TASK_STATUS.inProgress}`,
  completed: `# Status: ${TASK_STATUS.completed}`,
};

export function findTaskMarkdownFile(
  tasksDir: string,
  taskId: string
): { absPath: string; folder: string } | null {
  for (const folder of ['planned', 'completed', 'unplanned'] as const) {
    const dir = path.join(tasksDir, folder);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      if (taskIdFromFilename(file) === taskId) {
        return { absPath: path.join(dir, file), folder };
      }
    }
  }
  return null;
}

export function appendActivityLine(content: string, line: string): string {
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const entry = `- ${stamp} — ${line}`;
  if (/## Activity\b/i.test(content)) {
    return content.replace(/(## Activity\s*\n)/i, `$1${entry}\n`);
  }
  return content.trimEnd() + `\n\n## Activity\n${entry}\n`;
}

export function setTaskStatusInMarkdown(content: string, status: TaskMdStatus): string {
  const line = STATUS_LINE[status];
  if (/^# Status:/im.test(content)) {
    return content.replace(/^# Status:.*$/im, line);
  }
  if (/^# Title:/im.test(content)) {
    return content.replace(/^(# Title:.*\n)/im, `$1${line}\n`);
  }
  return `${line}\n${content}`;
}

export function updateTaskMarkdownFile(
  filePath: string,
  status: TaskMdStatus,
  activityLine?: string
): void {
  let content = fs.readFileSync(filePath, 'utf8');
  content = setTaskStatusInMarkdown(content, status);
  if (activityLine) {
    content = appendActivityLine(content, activityLine);
  }
  fs.writeFileSync(filePath, content);
}

export function moveTaskMarkdownFile(
  filePath: string,
  tasksDir: string,
  targetFolder: 'planned' | 'completed' | 'unplanned'
): string {
  const fileName = path.basename(filePath);
  const destDir = path.join(tasksDir, targetFolder);
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, fileName);
  if (path.resolve(filePath) !== path.resolve(dest)) {
    fs.renameSync(filePath, dest);
  }
  return dest;
}

export interface TaskLifecycleResult {
  taskId: string;
  action: 'started' | 'completed' | 'demoted';
  path: string;
}

/** Update markdown so Kanban columns match AWP workflow (agents call via backlog_sync). */
export function applyTaskLifecycle(
  tasksDir: string,
  options: {
    startTaskId?: string;
    completeTaskId?: string;
    activity?: string;
  }
): TaskLifecycleResult[] {
  const results: TaskLifecycleResult[] = [];
  const activity = options.activity;

  if (options.startTaskId) {
    const id = options.startTaskId;
    const plannedDir = path.join(tasksDir, 'planned');
    if (fs.existsSync(plannedDir)) {
      for (const file of fs.readdirSync(plannedDir).filter((f) => f.endsWith('.md'))) {
        const otherId = taskIdFromFilename(file);
        if (!otherId || otherId === id) continue;
        const abs = path.join(plannedDir, file);
        const raw = fs.readFileSync(abs, 'utf8');
        if (/^# Status:.*\[~\]/im.test(raw) || /\bin progress\b/i.test(raw)) {
          updateTaskMarkdownFile(abs, 'pending', `Status reset — task ${id} started`);
          results.push({ taskId: otherId, action: 'demoted', path: abs });
        }
      }
    }

    const found = findTaskMarkdownFile(tasksDir, id);
    if (!found) {
      throw new Error(`Task ${id} not found under tasks/`);
    }
    let abs = found.absPath;
    if (found.folder !== 'planned') {
      abs = moveTaskMarkdownFile(abs, tasksDir, 'planned');
    }
    updateTaskMarkdownFile(
      abs,
      'in_progress',
      activity || `Started task ${id}`
    );
    results.push({ taskId: id, action: 'started', path: abs });
  }

  if (options.completeTaskId) {
    const id = options.completeTaskId;
    const found = findTaskMarkdownFile(tasksDir, id);
    if (!found) {
      throw new Error(`Task ${id} not found under tasks/`);
    }
    updateTaskMarkdownFile(
      found.absPath,
      'completed',
      activity || `Completed task ${id}`
    );
    const abs = moveTaskMarkdownFile(found.absPath, tasksDir, 'completed');
    results.push({ taskId: id, action: 'completed', path: abs });
  }

  return results;
}
