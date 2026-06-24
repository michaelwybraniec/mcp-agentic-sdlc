#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import { detectAppDirForCli, getAgenticSdlcDir, syncBacklog } from './compiler.js';
import { broadcastSse, isPortInUse, kanbanBoardUrl, readPortFromConfig, startKanbanServer } from './server.js';
import { openKanbanInBrowser } from './launch.js';
import { taskIdFromFilename } from './parser.js';
import { watchBacklogPaths } from './watchBacklog.js';

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = { command: argv[0] || 'sync' };
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === '--appDir' && argv[i + 1]) {
      out.appDir = argv[++i];
    } else if (argv[i] === '--port' && argv[i + 1]) {
      out.port = argv[++i];
    } else if (argv[i] === '--no-open') {
      out.noOpen = true;
    }
  }
  return out;
}

function getDirs(appDir?: string) {
  const base = detectAppDirForCli(appDir);
  const agentic = getAgenticSdlcDir(base);
  const kanban = path.join(agentic, 'kanban');
  return { agentic, kanban };
}

function runSync(appDir?: string): void {
  const { agentic } = getDirs(appDir);
  if (!fs.existsSync(agentic)) {
    console.error(`agentic-sdlc not found at ${agentic}`);
    process.exit(1);
  }
  const snapshot = syncBacklog(agentic);
  console.log(`Synced backlog.json (${Object.keys(snapshot.tasks).length} tasks)`);
}

async function runOpen(appDir?: string, portOverride?: number): Promise<void> {
  const { agentic, kanban } = getDirs(appDir);
  if (!fs.existsSync(kanban)) {
    console.error(`kanban/ not found at ${kanban}. Run init first.`);
    process.exit(1);
  }
  syncBacklog(agentic);
  const port = portOverride ?? readPortFromConfig(kanban);
  const url = kanbanBoardUrl(port);
  openKanbanInBrowser(url);
  console.log(`Opened Kanban preview: ${url}`);
}

async function runWatch(appDir?: string, portOverride?: number, openBrowser = true): Promise<void> {
  const { agentic, kanban } = getDirs(appDir);
  if (!fs.existsSync(kanban)) {
    console.error(`kanban/ not found at ${kanban}. Run init first.`);
    process.exit(1);
  }

  const configPath = path.join(kanban, '.kanban-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const backlogDir = path.join(agentic, config.backlogPath);
  const port = portOverride ?? readPortFromConfig(kanban);
  const url = kanbanBoardUrl(port);

  syncBacklog(agentic);

  const startWatcher = () => {
    watchBacklogPaths(backlogDir, (filePath) => {
      const changedFiles = filePath ? [path.basename(filePath)] : [];
      const taskIds = changedFiles.map((f) => taskIdFromFilename(f)).filter(Boolean);
      syncBacklog(agentic, changedFiles.length ? changedFiles : undefined);
      broadcastSse({ type: 'backlog_updated', changedFiles, taskIds });
      broadcastSse({ type: 'activity_updated' });
      broadcastSse({ type: 'time_updated' });
      if (filePath) {
        console.log(`Updated: ${path.relative(agentic, filePath).replace(/\\/g, '/')}`);
      }
    });
  };

  if (await isPortInUse(port)) {
    if (openBrowser) openKanbanInBrowser(url);
    startWatcher();
    console.log(`Kanban already running at ${url} — watching markdown for live updates`);
    return;
  }

  startKanbanServer(kanban, port, { openBrowser });
  startWatcher();
  console.log(`Watching ${backlogDir}`);
}

function runServe(appDir?: string, portOverride?: number, openBrowser = false): void {
  const { agentic, kanban } = getDirs(appDir);
  const port = portOverride ?? readPortFromConfig(kanban);
  syncBacklog(agentic);
  startKanbanServer(kanban, port, { openBrowser });
}

export async function main(argv: string[]): Promise<void> {
  const args = parseArgs(argv);
  const cmd = args.command;
  const port = args.port ? parseInt(args.port as string, 10) : undefined;

  if (cmd === 'sync') {
    runSync(args.appDir as string | undefined);
  } else if (cmd === 'open') {
    await runOpen(args.appDir as string | undefined, port);
  } else if (cmd === 'watch') {
    await runWatch(args.appDir as string | undefined, port, !args.noOpen);
  } else if (cmd === 'serve') {
    runServe(args.appDir as string | undefined, port, !args.noOpen);
  } else {
    console.log('Usage: backlog <sync|open|watch|serve> [--appDir path] [--port 4173] [--no-open]');
    process.exit(1);
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
