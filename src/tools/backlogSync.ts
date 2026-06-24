import * as path from 'path';
import * as fs from 'fs';
import { getAgenticSdlcDir, syncBacklog } from '../backlog/compiler.js';
import { scaffoldKanban } from '../backlog/scaffold.js';

export async function handleBacklogSyncTool(args: Record<string, unknown>) {
  const appDir = (args?.appDir as string) || process.cwd();
  const agenticDir = getAgenticSdlcDir(appDir);
  const kanbanDir = path.join(agenticDir, 'kanban');

  if (!fs.existsSync(kanbanDir)) {
    const backlogName = args?.backlogName as string;
    const projectType = (args?.projectType as string)?.toLowerCase();
    if (backlogName && projectType) {
      scaffoldKanban(agenticDir, backlogName, projectType);
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

  try {
    const snapshot = syncBacklog(agenticDir);
    const port = snapshot.config.port || 4173;
    return {
      content: [
        {
          type: 'text',
          text: `Synced kanban/backlog.json\n\nTasks: ${Object.keys(snapshot.tasks).length}\nSource: ${snapshot.meta.sourcePath}\n\nRun: npm run backlog:watch -- --appDir ${appDir}\nOpen: http://localhost:${port}`,
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
