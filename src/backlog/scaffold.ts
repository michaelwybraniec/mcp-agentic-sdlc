import * as fs from 'fs';
import * as path from 'path';
import { syncBacklog, writeKanbanConfig } from './compiler.js';
import { KanbanConfig } from './types.js';

const DEFAULT_DISCLAIMER =
  'Demo prepared for Total Energiees by CoE (AWP - Author: Michael Wybraniec - all rights reserved) Confidential.';

export function getTemplatesDir(): string {
  return path.join(__dirname, '..', 'templates', 'kanban');
}

export function scaffoldKanban(
  agenticSdlcDir: string,
  backlogName: string,
  projectType: string,
  options?: { disclaimer?: string; port?: number }
): string {
  const kanbanDir = path.join(agenticSdlcDir, 'kanban');
  const templatesDir = getTemplatesDir();
  const backlogPath = `backlog-${backlogName}/${projectType}`;

  if (!fs.existsSync(kanbanDir)) {
    fs.mkdirSync(kanbanDir, { recursive: true });
  }

  const indexSrc = path.join(templatesDir, 'index.html');
  const indexDest = path.join(kanbanDir, 'index.html');
  if (fs.existsSync(indexSrc)) {
    fs.copyFileSync(indexSrc, indexDest);
  }

  const config: KanbanConfig = {
    backlogPath,
    backlogName,
    projectType,
    port: options?.port ?? 4173,
    disclaimer: options?.disclaimer ?? DEFAULT_DISCLAIMER,
  };
  writeKanbanConfig(kanbanDir, config);

  syncBacklog(agenticSdlcDir);
  return kanbanDir;
}
