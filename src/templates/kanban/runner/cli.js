#!/usr/bin/env node
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
exports.main = main;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const compiler_js_1 = require("./compiler.js");
const server_js_1 = require("./server.js");
const parser_js_1 = require("./parser.js");
function parseArgs(argv) {
    const out = { command: argv[0] || 'sync' };
    for (let i = 1; i < argv.length; i++) {
        if (argv[i] === '--appDir' && argv[i + 1]) {
            out.appDir = argv[++i];
        }
        else if (argv[i] === '--port' && argv[i + 1]) {
            out.port = argv[++i];
        }
        else if (argv[i] === '--no-open') {
            out.noOpen = true;
        }
    }
    return out;
}
function getDirs(appDir) {
    const base = (0, compiler_js_1.detectAppDirForCli)(appDir);
    const agentic = (0, compiler_js_1.getAgenticSdlcDir)(base);
    const kanban = path.join(agentic, 'kanban');
    return { agentic, kanban };
}
function runSync(appDir) {
    const { agentic } = getDirs(appDir);
    if (!fs.existsSync(agentic)) {
        console.error(`agentic-sdlc not found at ${agentic}`);
        process.exit(1);
    }
    const snapshot = (0, compiler_js_1.syncBacklog)(agentic);
    console.log(`Synced backlog.json (${Object.keys(snapshot.tasks).length} tasks)`);
}
function watchWithFs(watchPaths, onChange) {
    const watched = new Set();
    for (const watchPath of watchPaths) {
        if (!fs.existsSync(watchPath))
            continue;
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
                if (filename)
                    onChange(path.join(watchPath, filename));
            });
        }
        else {
            watched.add(watchPath);
            fs.watch(watchPath, () => onChange(watchPath));
        }
    }
}
function runWatch(appDir, portOverride, openBrowser = true) {
    const { agentic, kanban } = getDirs(appDir);
    if (!fs.existsSync(kanban)) {
        console.error(`kanban/ not found at ${kanban}. Run init first.`);
        process.exit(1);
    }
    const configPath = path.join(kanban, '.kanban-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const backlogDir = path.join(agentic, config.backlogPath);
    const port = portOverride ?? (0, server_js_1.readPortFromConfig)(kanban);
    (0, compiler_js_1.syncBacklog)(agentic);
    (0, server_js_1.startKanbanServer)(kanban, port, { openBrowser });
    const watchPaths = [
        path.join(backlogDir, 'tasks'),
        path.join(backlogDir, 'base.md'),
        path.join(backlogDir, 'backlog.md'),
    ];
    let debounce = null;
    watchWithFs(watchPaths, (filePath) => {
        if (debounce)
            clearTimeout(debounce);
        debounce = setTimeout(() => {
            const rel = path.relative(agentic, filePath).replace(/\\/g, '/');
            const changedFiles = [path.basename(filePath)];
            const taskIds = changedFiles.map((f) => (0, parser_js_1.taskIdFromFilename)(f)).filter(Boolean);
            (0, compiler_js_1.syncBacklog)(agentic, changedFiles);
            (0, server_js_1.broadcastSse)({
                type: 'backlog_updated',
                changedFiles,
                taskIds,
            });
            console.log(`Updated: ${rel}`);
        }, 200);
    });
    console.log(`Watching ${backlogDir}`);
}
function runServe(appDir, portOverride, openBrowser = false) {
    const { agentic, kanban } = getDirs(appDir);
    const port = portOverride ?? (0, server_js_1.readPortFromConfig)(kanban);
    (0, compiler_js_1.syncBacklog)(agentic);
    (0, server_js_1.startKanbanServer)(kanban, port, { openBrowser });
}
function main(argv) {
    const args = parseArgs(argv);
    const cmd = args.command;
    if (cmd === 'sync') {
        runSync(args.appDir);
    }
    else if (cmd === 'watch') {
        const openBrowser = !args.noOpen;
        runWatch(args.appDir, args.port ? parseInt(args.port, 10) : undefined, openBrowser);
    }
    else if (cmd === 'serve') {
        runServe(args.appDir, args.port ? parseInt(args.port, 10) : undefined, !args.noOpen);
    }
    else {
        console.log('Usage: backlog <sync|watch|serve> [--appDir path] [--port 4173] [--no-open]');
        process.exit(1);
    }
}
if (require.main === module) {
    main(process.argv.slice(2));
}
