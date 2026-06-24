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
exports.buildSimpleBrowserUri = buildSimpleBrowserUri;
exports.commandExists = commandExists;
exports.shouldTryEditorPreview = shouldTryEditorPreview;
exports.openInEditorSimpleBrowser = openInEditorSimpleBrowser;
exports.openInSystemBrowser = openInSystemBrowser;
exports.openKanbanInBrowser = openKanbanInBrowser;
exports.startKanbanWatchInBackground = startKanbanWatchInBackground;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/** Build Cursor/VS Code Simple Browser URI for localhost Kanban. */
function buildSimpleBrowserUri(url, scheme = 'cursor') {
    return `${scheme}://vscode.simple-browser/show?url=${encodeURIComponent(url)}`;
}
function commandExists(cmd) {
    try {
        if (process.platform === 'win32') {
            (0, child_process_1.execSync)(`where ${cmd}`, { stdio: 'ignore' });
        }
        else {
            (0, child_process_1.execSync)(`which ${cmd}`, { stdio: 'ignore' });
        }
        return true;
    }
    catch {
        return false;
    }
}
/** True when Cursor/VS Code preview is likely available. */
function shouldTryEditorPreview() {
    if (process.env.AWP_KANBAN_FORCE_BROWSER === '1')
        return false;
    if (process.env.TERM_PROGRAM === 'vscode')
        return true;
    if (process.env.VSCODE_IPC_HOOK || process.env.VSCODE_PID)
        return true;
    if (process.env.CURSOR_SESSION_ID || process.env.CURSOR_TRACE_ID)
        return true;
    if (commandExists('cursor') || commandExists('code'))
        return true;
    return false;
}
function editorSchemesToTry() {
    const schemes = [];
    if (commandExists('cursor'))
        schemes.push('cursor');
    if (commandExists('code'))
        schemes.push('vscode');
    if (schemes.length === 0 && shouldTryEditorPreview()) {
        schemes.push('cursor', 'vscode');
    }
    return schemes;
}
function openOSUri(uri) {
    try {
        if (process.platform === 'darwin') {
            (0, child_process_1.execSync)(`open "${uri.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
            return true;
        }
        if (process.platform === 'win32') {
            (0, child_process_1.spawn)('cmd', ['/c', 'start', '', uri], { detached: true, stdio: 'ignore' }).unref();
            return true;
        }
        (0, child_process_1.spawn)('xdg-open', [uri], { detached: true, stdio: 'ignore' }).unref();
        return true;
    }
    catch {
        return false;
    }
}
/** Open in Cursor/VS Code Simple Browser (integrated preview). */
function openInEditorSimpleBrowser(url) {
    for (const scheme of editorSchemesToTry()) {
        if (openOSUri(buildSimpleBrowserUri(url, scheme))) {
            return true;
        }
    }
    return false;
}
/** Open URL in the system default browser (best-effort, non-blocking). */
function openInSystemBrowser(url) {
    const platform = process.platform;
    let command;
    let args;
    if (platform === 'darwin') {
        command = 'open';
        args = [url];
    }
    else if (platform === 'win32') {
        command = 'cmd';
        args = ['/c', 'start', '', url];
    }
    else {
        command = 'xdg-open';
        args = [url];
    }
    try {
        const child = (0, child_process_1.spawn)(command, args, { detached: true, stdio: 'ignore' });
        child.unref();
    }
    catch {
        // Browser open is optional; server still runs.
    }
}
/**
 * Open Kanban URL: Cursor/VS Code Simple Browser when available, else system browser.
 * Set AWP_KANBAN_NO_OPEN=1 to disable. Set AWP_KANBAN_FORCE_BROWSER=1 to skip preview.
 */
function openKanbanInBrowser(url) {
    if (process.env.AWP_KANBAN_NO_OPEN === '1')
        return;
    if (shouldTryEditorPreview() && openInEditorSimpleBrowser(url)) {
        console.log(`Kanban preview: ${url} (Cursor/VS Code Simple Browser)`);
        return;
    }
    openInSystemBrowser(url);
    console.log(`Kanban board: ${url} (system browser)`);
}
/** Start in-repo Kanban watch process detached (opens preview/browser when ready). */
function startKanbanWatchInBackground(kanbanDir) {
    const cli = path.join(kanbanDir, 'runner', 'cli.js');
    if (!fs.existsSync(cli))
        return false;
    try {
        const child = (0, child_process_1.spawn)(process.execPath, [cli, 'watch'], {
            cwd: kanbanDir,
            detached: true,
            stdio: 'ignore',
            env: process.env,
        });
        child.unref();
        return true;
    }
    catch {
        return false;
    }
}
