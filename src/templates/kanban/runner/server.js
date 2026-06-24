"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPortInUse = isPortInUse;
exports.kanbanBoardUrl = kanbanBoardUrl;
exports.broadcastSse = broadcastSse;
exports.startKanbanServer = startKanbanServer;
exports.readPortFromConfig = readPortFromConfig;
const http = __importStar(require("http"));
const net = __importStar(require("net"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const compiler_js_1 = require("./compiler.js");
const launch_js_1 = require("./launch.js");
const gitCommits_js_1 = require("./gitCommits.js");
const activity_js_1 = require("./activity.js");
const timeTracking_js_1 = require("./timeTracking.js");
const watchGit_js_1 = require("./watchGit.js");
/** True if something is already listening on the port. */
function isPortInUse(port, host = '127.0.0.1') {
    return new Promise((resolve) => {
        const tester = net.createServer();
        tester.once('error', (err) => {
            resolve(err.code === 'EADDRINUSE');
        });
        tester.once('listening', () => {
            tester.close(() => resolve(false));
        });
        tester.listen(port, host);
    });
}
function kanbanBoardUrl(port) {
    return `http://localhost:${port}`;
}
let gitWatchStarted = false;
const sseClients = new Set();
function broadcastSse(payload) {
    const data = `data: ${JSON.stringify(payload)}\n\n`;
    for (const res of sseClients) {
        res.write(data);
    }
}
function startKanbanServer(kanbanDir, port, options) {
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
            let events = [];
            if (fs.existsSync(backlogPath)) {
                try {
                    const snap = JSON.parse(fs.readFileSync(backlogPath, 'utf8'));
                    events = snap.recentEvents || [];
                }
                catch {
                    events = [];
                }
            }
            if (!events.length) {
                events = (0, activity_js_1.loadActivityLog)(kanbanDir);
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
            const config = (0, compiler_js_1.readKanbanConfig)(kanbanDir);
            const appDir = config?.appDir ? path.resolve(config.appDir) : '';
            const agentOnly = !req.url?.includes('all=1');
            const commits = appDir
                ? agentOnly
                    ? (0, gitCommits_js_1.loadAgentCommits)(appDir)
                    : (0, gitCommits_js_1.loadGitCommits)(appDir)
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
            const store = (0, timeTracking_js_1.loadTimeTracking)(kanbanDir);
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
        const types = {
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
            (0, launch_js_1.openKanbanInBrowser)(url);
        }
        if (!gitWatchStarted) {
            const config = (0, compiler_js_1.readKanbanConfig)(kanbanDir);
            const appDir = config?.appDir ? path.resolve(config.appDir) : '';
            if (appDir) {
                (0, watchGit_js_1.watchGitHead)(appDir, () => broadcastSse({ type: 'commits_updated' }));
                gitWatchStarted = true;
            }
        }
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            const url = kanbanBoardUrl(port);
            console.log(`Port ${port} already in use — Kanban likely already running at ${url}`);
            if (options?.openBrowser !== false) {
                (0, launch_js_1.openKanbanInBrowser)(url);
            }
            return;
        }
        console.error(err);
        process.exit(1);
    });
    return server;
}
function readPortFromConfig(kanbanDir) {
    const p = path.join(kanbanDir, '.kanban-config.json');
    if (!fs.existsSync(p))
        return 4173;
    try {
        const c = JSON.parse(fs.readFileSync(p, 'utf8'));
        return c.port || 4173;
    }
    catch {
        return 4173;
    }
}
