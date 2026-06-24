import * as path from 'path';
import * as fs from 'fs';
import { getAgenticSdlcDir, readKanbanConfig, syncBacklog } from '../backlog/compiler.js';
import { scaffoldKanban } from '../backlog/scaffold.js';
import { applyTaskLifecycle, findInProgressTaskId, firstPlannedTaskId } from '../backlog/taskMd.js';
import { ensureRunAppScript, formatCompletionRunBlock } from '../backlog/appRun.js';
import { ensureKanbanAppDir } from '../resources/backlog.js';

export async function handleBacklogSyncTool(args: Record<string, unknown>) {
  const appDir = (args?.appDir as string) || process.cwd();
  const agenticDir = getAgenticSdlcDir(appDir);
  const kanbanDir = path.join(agenticDir, 'kanban');

  if (!fs.existsSync(kanbanDir)) {
    const backlogName = args?.backlogName as string;
    const projectType = (args?.projectType as string)?.toLowerCase();
    if (backlogName && projectType) {
      scaffoldKanban(agenticDir, backlogName, projectType, { appDir });
    } else {
      return {
        content: [
          {
            type: 'text',
            text: `ERROR: kanban/ not found at ${kanbanDir}. Run init first or provide backlogName and projectType.`,
          },
        ],
        isError: true,
      };
    }
  }

  ensureKanbanAppDir(agenticDir, appDir);

  let startTaskId = args?.startTaskId as string | undefined;
  const completeTaskId = args?.completeTaskId as string | undefined;
  let activity = args?.activity as string | undefined;
  const autoStart = args?.autoStart !== false;
  const lifecycleLines: string[] = [];

  const config = fs.existsSync(path.join(kanbanDir, '.kanban-config.json'))
    ? readKanbanConfig(kanbanDir)
    : null;

  if (!startTaskId && !completeTaskId && autoStart && config) {
    const tasksDir = path.join(agenticDir, config.backlogPath, 'tasks');
    if (!findInProgressTaskId(tasksDir)) {
      const first = firstPlannedTaskId(tasksDir);
      if (first) {
        startTaskId = first;
        activity = activity || 'Task started (backlog_sync)';
      }
    }
  }

  if (startTaskId || completeTaskId) {
    if (!config) {
      return {
        content: [{ type: 'text', text: 'ERROR: missing .kanban-config.json' }],
        isError: true,
      };
    }
    const tasksDir = path.join(agenticDir, config.backlogPath, 'tasks');
    try {
      const results = applyTaskLifecycle(tasksDir, {
        startTaskId,
        completeTaskId,
        activity,
      });
      for (const r of results) {
        lifecycleLines.push(`${r.action}: ${r.taskId} → ${r.path}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `ERROR: ${message}` }],
        isError: true,
      };
    }
  }

  try {
    const snapshot = syncBacklog(agenticDir);
    const port = snapshot.config.port || 4173;
    const warnBlock = snapshot._warnings.length
      ? `\n\nBoard status:\n${snapshot._warnings.map((w) => `- ${w}`).join('\n')}`
      : '';
    const lifeBlock = lifecycleLines.length
      ? `\n\nTask markdown updated:\n${lifecycleLines.map((l) => `- ${l}`).join('\n')}`
      : '';

    let reportBlock = '';
    if (completeTaskId && snapshot.tasks[completeTaskId]) {
      const task = snapshot.tasks[completeTaskId];
      const appRun = snapshot.appRun || ensureRunAppScript(snapshot.config.appDir);
      const prog = snapshot.boardProgress;
      const ts = task.timeSpent;
      const timeLine = ts
        ? `Time on task: Agent ${Math.round(ts.agentMs / 60000)}m · Human ${Math.round(ts.humanMs / 60000)}m · Total ${Math.round(ts.combinedMs / 60000)}m`
        : '';
      reportBlock = `

## Completion report — ${completeTaskId}: ${task.title}

Progress: ${prog?.completed ?? '?'}/${prog?.total ?? '?'} tasks (${prog?.percent ?? 0}%)
${timeLine}
Kanban report: http://localhost:${port}/?completed=${completeTaskId}
Time dashboard: http://localhost:${port}/?dashboard=1

${formatCompletionRunBlock(appRun, port).replace(`?completed=`, `?completed=${completeTaskId}`)}`;
    }

    return {
      content: [
        {
          type: 'text',
          text: `Synced kanban/backlog.json\n\nTasks: ${Object.keys(snapshot.tasks).length}\nIn Progress: ${snapshot.boardHealth.inProgressIds.join(', ') || 'none'}\nSource: ${snapshot.meta.sourcePath}\nApp dir: ${snapshot.config.appDir}${lifeBlock}${warnBlock}${reportBlock}\n\nawp start / awp next / awp auto: backlog_sync with startTaskId (and completeTaskId when advancing).\nRun Kanban: cd agentic-sdlc/kanban && npm run watch\nURL: http://localhost:${port}`,
        },
      ],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `ERROR: ${message}` }],
      isError: true,
    };
  }
}
