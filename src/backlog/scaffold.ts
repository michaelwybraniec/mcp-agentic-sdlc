import * as fs from 'fs';
import * as path from 'path';
import { syncBacklog, writeKanbanConfig } from './compiler.js';
import { KanbanConfig } from './types.js';

const DEFAULT_DISCLAIMER =
  'Demo prepared for Total Energiees by CoE (AWP - Author: Michael Wybraniec - all rights reserved) Confidential.';

export function getTemplatesDir(): string {
  return path.join(__dirname, '..', 'templates', 'kanban');
}

function copyDirRecursive(src: string, dest: string): void {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function scaffoldKanban(
  agenticSdlcDir: string,
  backlogName: string,
  projectType: string,
  options?: { disclaimer?: string; port?: number; appDir?: string }
): string {
  const kanbanDir = path.join(agenticSdlcDir, 'kanban');
  const templatesDir = getTemplatesDir();
  const backlogPath = `backlog-${backlogName}/${projectType}`;
  const appDir = path.resolve(options?.appDir ?? path.dirname(agenticSdlcDir));

  if (!fs.existsSync(kanbanDir)) {
    fs.mkdirSync(kanbanDir, { recursive: true });
  }

  const indexSrc = path.join(templatesDir, 'index.html');
  const indexDest = path.join(kanbanDir, 'index.html');
  if (fs.existsSync(indexSrc)) {
    fs.copyFileSync(indexSrc, indexDest);
  }

  const runnerSrc = path.join(templatesDir, 'runner');
  const runnerDest = path.join(kanbanDir, 'runner');
  copyDirRecursive(runnerSrc, runnerDest);

  const packageSrc = path.join(templatesDir, 'package.json');
  if (fs.existsSync(packageSrc)) {
    fs.copyFileSync(packageSrc, path.join(kanbanDir, 'package.json'));
  }

  const kanbanMdSrc = path.join(templatesDir, 'KANBAN.md');
  if (fs.existsSync(kanbanMdSrc)) {
    fs.copyFileSync(kanbanMdSrc, path.join(kanbanDir, 'KANBAN.md'));
  }

  const config: KanbanConfig = {
    appDir,
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
