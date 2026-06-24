import * as fs from 'fs';
import * as path from 'path';
import { getAgenticSdlcDir } from '../backlog/compiler.js';

export function getBacklogResources(baseDir?: string): Array<{
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}> {
  const appDir = baseDir || process.cwd();
  const agenticDir = getAgenticSdlcDir(appDir);
  const kanbanDir = path.join(agenticDir, 'kanban');
  const resources: Array<{ uri: string; name: string; description: string; mimeType: string }> = [];

  if (!fs.existsSync(kanbanDir)) return resources;

  const configPath = path.join(kanbanDir, '.kanban-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const name = config.backlogName || 'default';
      resources.push({
        uri: `backlog://${name}/snapshot`,
        name: `Backlog snapshot: ${name}`,
        description: 'Current compiled Kanban JSON snapshot from markdown backlog files',
        mimeType: 'application/json',
      });
    } catch {
      // ignore
    }
  }

  return resources;
}

export function handleBacklogUri(uri: string, baseDir?: string): { contents: Array<{ uri: string; mimeType: string; text: string }> } | null {
  const match = uri.match(/^backlog:\/\/([^/]+)\/snapshot$/);
  if (!match) return null;

  const appDir = baseDir || process.cwd();
  const backlogPath = path.join(getAgenticSdlcDir(appDir), 'kanban', 'backlog.json');

  if (!fs.existsSync(backlogPath)) {
    throw new Error(`Backlog snapshot not found. Run init or backlog_sync first. Expected: ${backlogPath}`);
  }

  const text = fs.readFileSync(backlogPath, 'utf8');
  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text,
      },
    ],
  };
}
