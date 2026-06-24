import { execSync } from 'child_process';
import * as path from 'path';

/** Matches commitStandard: type(scope taskId): subject — taskId is 1.0 or U-1 */
const AWP_COMMIT_PATTERN =
  /^(feat|fix|docs|test|chore|refactor|perf|build|ci|revert)(\([^)]+\s+(?:\d+(?:\.\d+)*|U-\d+(?:\.\d+)*)\)):\s+.+/;

export interface AgentCommit {
  hash: string;
  shortHash: string;
  date: string;
  author: string;
  subject: string;
  isAwp: boolean;
}

export interface GitRepoContext {
  gitDir: string;
  logCwd: string;
  pathArgs: string[];
}

/** Locate git root for appDir (works when .git is only on a parent, e.g. monorepo). */
export function resolveGitRepo(appDir: string): GitRepoContext | null {
  const resolved = path.resolve(appDir);
  try {
    const top = execSync('git rev-parse --show-toplevel', {
      cwd: resolved,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    const gitDir = execSync('git rev-parse --absolute-git-dir', {
      cwd: resolved,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    const rel = path.relative(top, resolved);
    const pathArgs =
      rel && rel !== '.' && !rel.startsWith('..') ? ['--', rel.replace(/\\/g, '/')] : [];
    return { gitDir, logCwd: top, pathArgs };
  } catch {
    return null;
  }
}

export function loadGitCommits(appDir: string, limit = 30): AgentCommit[] {
  const ctx = resolveGitRepo(appDir);
  if (!ctx) return [];

  try {
    const pathSpec = ctx.pathArgs.length ? ` ${ctx.pathArgs.join(' ')}` : '';
    const out = execSync(`git log -n ${limit} --pretty=format:%H%x1f%ai%x1f%an%x1f%s${pathSpec}`, {
      cwd: ctx.logCwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return out
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [hash, date, author, subject] = line.split('\x1f');
        return {
          hash,
          shortHash: hash.slice(0, 7),
          date,
          author,
          subject,
          isAwp: AWP_COMMIT_PATTERN.test(subject),
        };
      });
  } catch {
    return [];
  }
}

/** Extract task/step id from commitStandard subject e.g. feat(scaffold 1.0): ... */
export function taskIdFromCommitSubject(subject: string): string {
  const m = subject.match(/\([^)]+\s+(\d+(?:\.\d+)*)\)/);
  return m ? m[1] : '';
}

/** Step range in commit scope e.g. (console 1.0-9.0) — invalid for awp auto loop. */
export function isBatchStepCommit(subject: string): boolean {
  return /\(\s*[^)]*\s+\d+(?:\.\d+)?\s*-\s*\d+/.test(subject);
}

/** Commits matching AWP commitStandard (agent workflow commits). Excludes batch step ranges. */
export function loadAgentCommits(appDir: string, limit = 30): AgentCommit[] {
  return loadGitCommits(appDir, limit).filter((c) => c.isAwp && !isBatchStepCommit(c.subject));
}
