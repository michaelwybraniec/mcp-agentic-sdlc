import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/** Build Cursor/VS Code Simple Browser URI for localhost Kanban. */
export function buildSimpleBrowserUri(url: string, scheme: 'cursor' | 'vscode' = 'cursor'): string {
  return `${scheme}://vscode.simple-browser/show?url=${encodeURIComponent(url)}`;
}

export function commandExists(cmd: string): boolean {
  try {
    if (process.platform === 'win32') {
      execSync(`where ${cmd}`, { stdio: 'ignore' });
    } else {
      execSync(`which ${cmd}`, { stdio: 'ignore' });
    }
    return true;
  } catch {
    return false;
  }
}

/** True when Cursor/VS Code preview is likely available. */
export function shouldTryEditorPreview(): boolean {
  if (process.env.AWP_KANBAN_FORCE_BROWSER === '1') return false;
  if (process.env.TERM_PROGRAM === 'vscode') return true;
  if (process.env.VSCODE_IPC_HOOK || process.env.VSCODE_PID) return true;
  if (process.env.CURSOR_SESSION_ID || process.env.CURSOR_TRACE_ID) return true;
  if (commandExists('cursor') || commandExists('code')) return true;
  return false;
}

function editorSchemesToTry(): Array<'cursor' | 'vscode'> {
  const schemes: Array<'cursor' | 'vscode'> = [];
  if (commandExists('cursor')) schemes.push('cursor');
  if (commandExists('code')) schemes.push('vscode');
  if (schemes.length === 0 && shouldTryEditorPreview()) {
    schemes.push('cursor', 'vscode');
  }
  return schemes;
}

function openOSUri(uri: string): boolean {
  try {
    if (process.platform === 'darwin') {
      execSync(`open "${uri.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
      return true;
    }
    if (process.platform === 'win32') {
      spawn('cmd', ['/c', 'start', '', uri], { detached: true, stdio: 'ignore' }).unref();
      return true;
    }
    spawn('xdg-open', [uri], { detached: true, stdio: 'ignore' }).unref();
    return true;
  } catch {
    return false;
  }
}

/** Open in Cursor/VS Code Simple Browser (integrated preview). */
export function openInEditorSimpleBrowser(url: string): boolean {
  const schemes = editorSchemesToTry();
  if (schemes.length === 0) return false;
  // Use a single scheme — trying cursor and vscode both spawns duplicate Simple Browser tabs.
  const scheme = schemes[0];
  return openOSUri(buildSimpleBrowserUri(url, scheme));
}

/** Open URL in the system default browser (best-effort, non-blocking). */
export function openInSystemBrowser(url: string): void {
  const platform = process.platform;
  let command: string;
  let args: string[];

  if (platform === 'darwin') {
    command = 'open';
    args = [url];
  } else if (platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', url];
  } else {
    command = 'xdg-open';
    args = [url];
  }

  try {
    const child = spawn(command, args, { detached: true, stdio: 'ignore' });
    child.unref();
  } catch {
    // Browser open is optional; server still runs.
  }
}

/**
 * Open Kanban URL: Cursor/VS Code Simple Browser when available, else system browser.
 * Set AWP_KANBAN_NO_OPEN=1 to disable. Set AWP_KANBAN_FORCE_BROWSER=1 to skip preview.
 */
export function openKanbanInBrowser(url: string): void {
  if (process.env.AWP_KANBAN_NO_OPEN === '1') return;

  if (shouldTryEditorPreview() && openInEditorSimpleBrowser(url)) {
    console.log(`Kanban preview: ${url} (Cursor/VS Code Simple Browser)`);
    return;
  }

  openInSystemBrowser(url);
  console.log(`Kanban board: ${url} (system browser)`);
}

/** Start in-repo Kanban watch process detached (opens preview/browser when ready). */
export function startKanbanWatchInBackground(kanbanDir: string): boolean {
  const cli = path.join(kanbanDir, 'runner', 'cli.js');
  if (!fs.existsSync(cli)) return false;

  try {
    const child = spawn(process.execPath, [cli, 'watch'], {
      cwd: kanbanDir,
      detached: true,
      stdio: 'ignore',
      env: process.env,
    });
    child.unref();
    return true;
  } catch {
    return false;
  }
}
