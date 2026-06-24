import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { KanbanConfig } from './types.js';

export type SsePayload = {
  type: string;
  changedFiles?: string[];
  taskIds?: string[];
};

const sseClients = new Set<http.ServerResponse>();

export function broadcastSse(payload: SsePayload): void {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of sseClients) {
    res.write(data);
  }
}

export function startKanbanServer(
  kanbanDir: string,
  port: number
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
    console.log(`Kanban board: http://localhost:${port}`);
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
