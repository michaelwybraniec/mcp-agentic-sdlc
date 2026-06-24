import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/** Matches commitStandard: type(scope step): subject */
const AWP_COMMIT_PATTERN =
  /^(feat|fix|docs|test|chore|refactor)(\([^)]+\s+\d+(?:\.\d+)*\)):\s+.+/;

export interface AgentCommit {
  hash: string;
  shortHash: string;
  date: string;
  author: string;
  subject: string;
  isAwp: boolean;
}

export function loadGitCommits(appDir: string, limit = 30): AgentCommit[] {
  const gitDir = path.join(appDir, '.git');
  if (!fs.existsSync(gitDir)) return [];

  try {
    const out = execSync(
      `git log -n ${limit} --pretty=format:%H%x1f%ai%x1f%an%x1f%s`,
      { cwd: appDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
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

/** Commits matching AWP commitStandard (agent workflow commits). */
export function loadAgentCommits(appDir: string, limit = 30): AgentCommit[] {
  return loadGitCommits(appDir, limit).filter((c) => c.isAwp);
}
