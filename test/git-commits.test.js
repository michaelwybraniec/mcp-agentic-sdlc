/**
 * @fileoverview gitCommits loader tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { loadAgentCommits, loadGitCommits } = require('../dist/backlog/gitCommits');

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

console.log(`\n${passed}/2 gitCommits tests passed`);
process.exit(passed === 2 ? 0 : 1);
