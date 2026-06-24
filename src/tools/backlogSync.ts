import * as path from 'path';
import * as fs from 'fs';
import { getAgenticSdlcDir, readKanbanConfig, syncBacklog } from '../backlog/compiler.js';
import { scaffoldKanban } from '../backlog/scaffold.js';
import { applyTaskLifecycle } from '../backlog/taskMd.js';
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

  const startTaskId = args?.startTaskId as string | undefined;
  const completeTaskId = args?.completeTaskId as string | undefined;
  const activity = args?.activity as string | undefined;
  const lifecycleLines: string[] = [];

  if (startTaskId || completeTaskId) {
    const config = readKanbanConfig(kanbanDir);
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
    return {
      content: [
        {
          type: 'text',
          text: `Synced kanban/backlog.json\n\nTasks: ${Object.keys(snapshot.tasks).length}\nIn Progress: ${snapshot.boardHealth.inProgressIds.join(', ') || 'none'}\nSource: ${snapshot.meta.sourcePath}\nApp dir: ${snapshot.config.appDir}${lifeBlock}${warnBlock}\n\nOn awp next: call backlog_sync with startTaskId (and completeTaskId for the previous task).\nRun: cd agentic-sdlc/kanban && npm run watch\nURL: http://localhost:${port}`,
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
