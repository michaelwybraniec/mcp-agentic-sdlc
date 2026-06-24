#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import { detectAppDirForCli, getAgenticSdlcDir, syncBacklog } from './compiler.js';
import { broadcastSse, readPortFromConfig, startKanbanServer } from './server.js';
import { taskIdFromFilename } from './parser.js';

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

function watchWithFs(watchPaths: string[], onChange: (filePath: string) => void): void {
  const watched = new Set<string>();

  for (const watchPath of watchPaths) {
    if (!fs.existsSync(watchPath)) continue;

    const stat = fs.statSync(watchPath);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(watchPath)) {
        const child = path.join(watchPath, name);
        if (!watched.has(child)) {
          watched.add(child);
          fs.watch(child, () => onChange(child));
        }
      }
      fs.watch(watchPath, (_event, filename) => {
        if (filename) onChange(path.join(watchPath, filename));
      });
    } else {
      watched.add(watchPath);
      fs.watch(watchPath, () => onChange(watchPath));
    }
  }
}

function runWatch(appDir?: string, portOverride?: number, openBrowser = true): void {
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
  startKanbanServer(kanban, port, { openBrowser });

  const watchPaths = [
    path.join(backlogDir, 'tasks'),
    path.join(backlogDir, 'base.md'),
    path.join(backlogDir, 'backlog.md'),
  ];

  let debounce: ReturnType<typeof setTimeout> | null = null;

  watchWithFs(watchPaths, (filePath) => {
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
    }, 200);
  });

  console.log(`Watching ${backlogDir}`);
}

function runServe(appDir?: string, portOverride?: number, openBrowser = false): void {
  const { agentic, kanban } = getDirs(appDir);
  const port = portOverride ?? readPortFromConfig(kanban);
  syncBacklog(agentic);
  startKanbanServer(kanban, port, { openBrowser });
}

export function main(argv: string[]): void {
  const args = parseArgs(argv);
  const cmd = args.command;

  if (cmd === 'sync') {
    runSync(args.appDir as string | undefined);
  } else if (cmd === 'watch') {
    const openBrowser = !args.noOpen;
    runWatch(
      args.appDir as string | undefined,
      args.port ? parseInt(args.port as string, 10) : undefined,
      openBrowser
    );
  } else if (cmd === 'serve') {
    runServe(
      args.appDir as string | undefined,
      args.port ? parseInt(args.port as string, 10) : undefined,
      !args.noOpen
    );
  } else {
    console.log('Usage: backlog <sync|watch|serve> [--appDir path] [--port 4173] [--no-open]');
    process.exit(1);
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}
