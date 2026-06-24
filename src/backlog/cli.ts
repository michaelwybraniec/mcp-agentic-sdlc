#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import chokidar from 'chokidar';
import { getAgenticSdlcDir, syncBacklog } from './compiler.js';
import { broadcastSse, readPortFromConfig, startKanbanServer } from './server.js';
import { taskIdFromFilename } from './parser.js';

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = { command: argv[0] || 'sync' };
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === '--appDir' && argv[i + 1]) {
      out.appDir = argv[++i];
    } else if (argv[i] === '--port' && argv[i + 1]) {
      out.port = argv[++i];
    }
  }
  return out;
}

function getDirs(appDir?: string) {
  const base = appDir ? path.resolve(appDir) : process.cwd();
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

function runWatch(appDir?: string, portOverride?: number): void {
  const { agentic, kanban } = getDirs(appDir);
  if (!fs.existsSync(kanban)) {
    console.error(`kanban/ not found at ${kanban}. Run init first.`);
    process.exit(1);
  }

  const configPath = path.join(kanban, '.kanban-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const backlogDir = path.join(agentic, config.backlogPath);
  const port = portOverride ?? readPortFromConfig(kanban);

  syncBacklog(agentic);
  startKanbanServer(kanban, port);

  const watchPaths = [
    path.join(backlogDir, 'tasks'),
    path.join(backlogDir, 'base.md'),
    path.join(backlogDir, 'backlog.md'),
  ];

  let debounce: ReturnType<typeof setTimeout> | null = null;

  const watcher = chokidar.watch(watchPaths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 200 },
  });

  watcher.on('all', (_event, filePath) => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      const rel = path.relative(agentic, filePath).replace(/\\/g, '/');
      const changedFiles = [path.basename(filePath)];
      const taskIds = changedFiles.map((f) => taskIdFromFilename(f)).filter(Boolean);

      syncBacklog(agentic, changedFiles);
      broadcastSse({
        type: 'backlog_updated',
        changedFiles,
        taskIds,
      });
      console.log(`Updated: ${rel}`);
    }, 150);
  });

  console.log(`Watching ${backlogDir}`);
}

function runServe(appDir?: string, portOverride?: number): void {
  const { agentic, kanban } = getDirs(appDir);
  const port = portOverride ?? readPortFromConfig(kanban);
  syncBacklog(agentic);
  startKanbanServer(kanban, port);
}

export function main(argv: string[]): void {
  const args = parseArgs(argv);
  const cmd = args.command;

  if (cmd === 'sync') {
    runSync(args.appDir);
  } else if (cmd === 'watch') {
    runWatch(args.appDir, args.port ? parseInt(args.port, 10) : undefined);
  } else if (cmd === 'serve') {
    runServe(args.appDir, args.port ? parseInt(args.port, 10) : undefined);
  } else {
    console.log('Usage: backlog <sync|watch|serve> [--appDir path] [--port 4173]');
    process.exit(1);
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}
