/**
 * @fileoverview Kanban backlog compiler tests
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { scaffoldKanban } = require('../dist/backlog/scaffold');
const { syncBacklog, readKanbanConfig } = require('../dist/backlog/compiler');
const { parseTaskMd } = require('../dist/backlog/parser');

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

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kanban-test-'));
const agentic = path.join(tmp, 'agentic-sdlc');
const backlogDir = path.join(agentic, 'backlog-demo', 'mvp');
const planned = path.join(backlogDir, 'tasks', 'planned');

fs.mkdirSync(planned, { recursive: true });
fs.writeFileSync(
  path.join(backlogDir, 'base.md'),
  `# Base: AWP Project Foundation Agreement

**Problem:** Users cannot find products
**Primary User:** Shopper
**Core User Journey:** Search and buy

## 1. Essential MVP Features

1. Search
2. Checkout

## 4. Key Technologies

1. React
2. Node

## 9. Project Phases (MVP)

1. Setup
2. Core feature
`
);

fs.writeFileSync(
  path.join(planned, 'task-1.0.md'),
  `# Task ID: 1.0
# Title: Setup project
# Status: [ ] Pending
# Priority: high
# Owner: Dev Team

## Description
Initialize repository.

## Dependencies
- None

## Activity
- 2026-06-24 10:00 — Created task
`
);

fs.writeFileSync(
  path.join(planned, 'task-1.1.md'),
  `# Task ID: 1.1
# Title: Core API
# Status: [~] In Progress
# Priority: critical
# Owner: Backend

## Description
Build the API layer.

## Dependencies
- [ ] Task ID: 1.0
`
);

let passed = 0;
if (test('parseTaskMd infers in progress', () => {
  const p = parseTaskMd(fs.readFileSync(path.join(planned, 'task-1.1.md'), 'utf8'), 'task-1.1.md');
  assert(p.status === 'in_progress', 'expected in_progress');
})) passed++;

if (test('parseTaskMd reads acceptance criteria list', () => {
  const content = `# Task ID: 2.0
# Title: Map tab
## Acceptance Criteria
- [ ] Map renders facility markers
- [ ] User can tap a marker for details
`;
  const p = parseTaskMd(content, 'task-2.0.md');
  assert(p.acceptanceCriteria.length === 2, 'two criteria');
  assert(p.acceptanceCriteria[0].includes('Map renders'));
})) passed++;

if (test('createInitialTasks includes acceptance criteria', () => {
  const { createInitialTasks } = require('../dist/utils/helpers');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tasks-init-'));
  createInitialTasks(dir, ['Goal A'], ['1. Scaffold app', '2. Add map'], ['React'], ['Works end to end'], 'poc');
  const md = fs.readFileSync(path.join(dir, 'task-1.0.md'), 'utf8');
  assert(md.includes('## Acceptance Criteria'), 'has section');
  const parsed = parseTaskMd(md, 'task-1.0.md');
  assert(parsed.acceptanceCriteria.length >= 4, 'has criteria bullets');
  assert(parsed.id === '1.0', 'task id is 1.0');
})) passed++;

if (test('scaffoldKanban creates kanban dir', () => {
  scaffoldKanban(agentic, 'demo', 'mvp', { appDir: tmp });
  assert(fs.existsSync(path.join(agentic, 'kanban', 'index.html')));
  assert(fs.existsSync(path.join(agentic, 'kanban', 'backlog.json')));
  assert(fs.existsSync(path.join(agentic, 'kanban', 'package.json')));
  assert(fs.existsSync(path.join(agentic, 'kanban', 'runner', 'cli.js')));
  assert(fs.existsSync(path.join(agentic, 'kanban', 'KANBAN.md')));
  const cfg = readKanbanConfig(path.join(agentic, 'kanban'));
  assert(path.resolve(cfg.appDir) === path.resolve(tmp), 'appDir stored in config');
})) passed++;

const { execSync } = require('child_process');

if (test('in-repo runner sync works without project root package.json', () => {
  const syncTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kanban-sync-'));
  const syncAgentic = path.join(syncTmp, 'agentic-sdlc');
  const syncBacklogDir = path.join(syncAgentic, 'backlog-sync', 'mvp');
  fs.mkdirSync(path.join(syncBacklogDir, 'tasks', 'planned'), { recursive: true });
  fs.writeFileSync(
    path.join(syncBacklogDir, 'base.md'),
    '# Base\n\n**Problem:** x\n**Primary User:** y\n**Core User Journey:** z\n\n## 1. Essential MVP Features\n\n1. A\n'
  );
  scaffoldKanban(syncAgentic, 'sync', 'mvp', { appDir: syncTmp });
  const out = execSync('node runner/cli.js sync', {
    cwd: path.join(syncAgentic, 'kanban'),
    encoding: 'utf8',
  });
  assert(out.includes('Synced backlog.json'), 'sync output');
  assert(!fs.existsSync(path.join(syncTmp, 'package.json')), 'no root package.json');
})) passed++;

if (test('compileBacklog splits columns', () => {
  const snap = syncBacklog(agentic);
  assert(snap.columns.planned.length === 1, 'one planned');
  assert(snap.columns.inProgress.length === 1, 'one in progress');
  assert(snap.contract.content.includes('Foundation Agreement'));
  assert(snap.summary.problem.includes('find products'));
  const cfg = readKanbanConfig(path.join(agentic, 'kanban'));
  assert(cfg.disclaimer.includes('Total Energiees'));
  assert(path.resolve(snap.config.appDir) === path.resolve(tmp), 'snapshot includes appDir');
})) passed++;

console.log(`\n${passed}/6 backlog tests passed`);
process.exit(passed === 6 ? 0 : 1);
