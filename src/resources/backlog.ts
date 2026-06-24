import * as fs from 'fs';
import * as path from 'path';
import {
  discoverKanbanContext,
  getAgenticSdlcDir,
  readKanbanConfig,
  writeKanbanConfig,
} from '../backlog/compiler.js';

export function getBacklogResources(baseDir?: string): Array<{
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}> {
  const ctx = discoverKanbanContext(baseDir);
  if (!ctx) return [];

  const { config } = ctx;
  const name = config.backlogName || 'default';
  return [
    {
      uri: `backlog://${name}/snapshot`,
      name: `Backlog snapshot: ${name}`,
      description: 'Current compiled Kanban JSON snapshot from markdown backlog files',
      mimeType: 'application/json',
    },
  ];
}

export function handleBacklogUri(
  uri: string,
  baseDir?: string
): { contents: Array<{ uri: string; mimeType: string; text: string }> } | null {
  const match = uri.match(/^backlog:\/\/([^/]+)\/snapshot$/);
  if (!match) return null;

  const uriName = match[1];
  const ctx = discoverKanbanContext(baseDir);
  if (!ctx) {
    throw new Error(
      'Backlog snapshot not found. Set AGENTIC_SDLC_APP_DIR to your project root, run init, or call backlog_sync with appDir.'
    );
  }

  const { config, kanbanDir } = ctx;
  if (config.backlogName !== uriName) {
    console.error(
      `Warning: backlog URI name "${uriName}" does not match config backlogName "${config.backlogName}"`
    );
  }

  const backlogPath = path.join(kanbanDir, 'backlog.json');
  if (!fs.existsSync(backlogPath)) {
    throw new Error(`Backlog snapshot not found at ${backlogPath}. Run init or backlog_sync first.`);
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

/** Ensure .kanban-config.json includes appDir after backlog_sync. */
export function ensureKanbanAppDir(agenticDir: string, appDir: string): void {
  const kanbanDir = path.join(agenticDir, 'kanban');
  const config = readKanbanConfig(kanbanDir);
  if (!config) return;
  const resolved = path.resolve(appDir);
  if (config.appDir !== resolved) {
    config.appDir = resolved;
    writeKanbanConfig(kanbanDir, config);
  }
}
