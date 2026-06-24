/**
 * @fileoverview gitCommits loader tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { loadAgentCommits, loadGitCommits, isBatchStepCommit } = require('../dist/backlog/gitCommits');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (e) {
    console.error(`✗ ${name}`);
    console.error(`  ${e.message}`);
    return false;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'git-commits-'));
execSync('git init', { cwd: tmp });
execSync('git config user.email "agent@test.com"', { cwd: tmp });
execSync('git config user.name "Agent"', { cwd: tmp });
fs.writeFileSync(path.join(tmp, 'readme.txt'), 'x');
execSync('git add readme.txt', { cwd: tmp });
execSync('git commit -m "feat(scaffold 1.0): initial setup"', { cwd: tmp });
execSync('git commit --allow-empty -m "chore: non-awp commit"', { cwd: tmp });
execSync('git commit --allow-empty -m "docs(awp 1.2): update workflow"', { cwd: tmp });

let passed = 0;

if (test('loadGitCommits returns recent commits', () => {
  const all = loadGitCommits(tmp, 10);
  assert(all.length >= 2, 'expected commits');
})) passed++;

if (test('loadAgentCommits filters AWP commitStandard only', () => {
  const agent = loadAgentCommits(tmp, 10);
  assert(agent.length >= 2, 'expected awp commits');
  assert(agent.every((c) => c.isAwp), 'all flagged awp');
  assert(!agent.some((c) => c.subject === 'chore: non-awp commit'), 'excludes non-awp');
})) passed++;

if (test('loadAgentCommits excludes batch step ranges', () => {
  execSync('git commit --allow-empty -m "feat(console 1.0-9.0): deliver POC via awp auto"', { cwd: tmp });
  assert(isBatchStepCommit('feat(console 1.0-9.0): deliver POC via awp auto'));
  const agent = loadAgentCommits(tmp, 5);
  assert(!agent.some((c) => c.subject.includes('1.0-9.0')), 'batch commit excluded');
})) passed++;

const monoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'git-mono-'));
const monoApp = path.join(monoRoot, 'projects', 'demo-app');
fs.mkdirSync(monoApp, { recursive: true });
execSync('git init', { cwd: monoRoot });
execSync('git config user.email "agent@test.com"', { cwd: monoRoot });
execSync('git config user.name "Agent"', { cwd: monoRoot });
fs.writeFileSync(path.join(monoRoot, 'other.txt'), 'other');
execSync('git add other.txt', { cwd: monoRoot });
execSync('git commit -m "chore: root only"', { cwd: monoRoot });
fs.writeFileSync(path.join(monoApp, 'app.txt'), 'app');
execSync('git add projects/demo-app/app.txt', { cwd: monoRoot });
execSync('git commit -m "feat(demo 1.0): scaffold subproject"', { cwd: monoRoot });

if (test('loadGitCommits works when .git is only on parent repo', () => {
  assert(!fs.existsSync(path.join(monoApp, '.git')), 'subdir has no .git');
  const all = loadGitCommits(monoApp, 10);
  assert(all.some((c) => c.subject.includes('scaffold subproject')), 'finds commits via parent git');
  const agent = loadAgentCommits(monoApp, 10);
  assert(agent.some((c) => c.subject.includes('feat(demo 1.0)')), 'awp commits in subdir');
})) passed++;

console.log(`\n${passed}/4 gitCommits tests passed`);
process.exit(passed === 4 ? 0 : 1);
