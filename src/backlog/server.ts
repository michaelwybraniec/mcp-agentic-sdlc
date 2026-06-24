import * as http from 'http';
import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';
import { KanbanConfig } from './types.js';
import { readKanbanConfig } from './compiler.js';
import { openKanbanInBrowser } from './launch.js';
import { loadAgentCommits, loadGitCommits } from './gitCommits.js';
import { loadActivityLog } from './activity.js';
import { loadTimeTracking } from './timeTracking.js';
import { watchGitHead } from './watchGit.js';

export interface KanbanServerOptions {
  openBrowser?: boolean;
}

/** True if something is already listening on the port. */
export function isPortInUse(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', (err: NodeJS.ErrnoException) => {
      resolve(err.code === 'EADDRINUSE');
    });
    tester.once('listening', () => {
      tester.close(() => resolve(false));
    });
    tester.listen(port, host);
  });
}

export function kanbanBoardUrl(port: number): string {
  return `http://localhost:${port}`;
}

export type SsePayload = {
  type: string;
  changedFiles?: string[];
  taskIds?: string[];
};

let gitWatchStarted = false;

const sseClients = new Set<http.ServerResponse>();

export function broadcastSse(payload: SsePayload): void {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of sseClients) {
    res.write(data);
  }
}

export function startKanbanServer(
  kanbanDir: string,
  port: number,
  options?: KanbanServerOptions
): http.Server {
  const server = http.createServer((req, res) => {
    const url = req.url?.split('?')[0] || '/';

    if (url === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      res.write('data: {"type":"connected"}\n\n');
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    if (url === '/api/backlog.json') {
      const p = path.join(kanbanDir, 'backlog.json');
      if (!fs.existsSync(p)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'backlog.json not found' }));
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(fs.readFileSync(p, 'utf8'));
      return;
    }

    if (url === '/api/config.json') {
      const p = path.join(kanbanDir, '.kanban-config.json');
      if (!fs.existsSync(p)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'config not found' }));
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(fs.readFileSync(p, 'utf8'));
      return;
    }

    if (url === '/api/activity.json') {
      const backlogPath = path.join(kanbanDir, 'backlog.json');
      let events: unknown[] = [];
      if (fs.existsSync(backlogPath)) {
        try {
          const snap = JSON.parse(fs.readFileSync(backlogPath, 'utf8'));
          events = snap.recentEvents || [];
        } catch {
          events = [];
        }
      }
      if (!events.length) {
        events = loadActivityLog(kanbanDir);
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ events, generatedAt: new Date().toISOString() }));
      return;
    }

    if (url === '/api/commits.json') {
      const config = readKanbanConfig(kanbanDir);
      const appDir = config?.appDir ? path.resolve(config.appDir) : '';
      const agentOnly = !req.url?.includes('all=1');
      const commits = appDir
        ? agentOnly
          ? loadAgentCommits(appDir)
          : loadGitCommits(appDir)
        : [];
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ commits, appDir, generatedAt: new Date().toISOString() }));
      return;
    }

    if (url === '/api/time-tracking.json') {
      const store = loadTimeTracking(kanbanDir);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(store));
      return;
    }

    let filePath = url === '/' ? '/index.html' : url;
    const safe = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '');
    const abs = path.join(kanbanDir, safe);

    if (!abs.startsWith(kanbanDir) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(abs);
    const types: Record<string, string> = {
      '.html': 'text/html',
      '.json': 'application/json',
      '.css': 'text/css',
      '.js': 'application/javascript',
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(fs.readFileSync(abs));
  });

  server.listen(port, () => {
    const url = kanbanBoardUrl(port);
    console.log(`Kanban board: ${url}`);
    if (options?.openBrowser !== false) {
      openKanbanInBrowser(url);
    }

    if (!gitWatchStarted) {
      const config = readKanbanConfig(kanbanDir);
      const appDir = config?.appDir ? path.resolve(config.appDir) : '';
      if (appDir) {
        watchGitHead(appDir, () => broadcastSse({ type: 'commits_updated' }));
        gitWatchStarted = true;
      }
    }
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      const url = kanbanBoardUrl(port);
      console.log(`Port ${port} already in use — Kanban likely already running at ${url}`);
      if (options?.openBrowser !== false) {
        openKanbanInBrowser(url);
      }
      return;
    }
    console.error(err);
    process.exit(1);
  });

  return server;
}

export function readPortFromConfig(kanbanDir: string): number {
  const p = path.join(kanbanDir, '.kanban-config.json');
  if (!fs.existsSync(p)) return 4173;
  try {
    const c = JSON.parse(fs.readFileSync(p, 'utf8')) as KanbanConfig;
    return c.port || 4173;
  } catch {
    return 4173;
  }
}
