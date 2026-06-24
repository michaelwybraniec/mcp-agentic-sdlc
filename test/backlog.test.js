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

if (test('scaffoldKanban creates kanban dir', () => {
  scaffoldKanban(agentic, 'demo', 'mvp');
  assert(fs.existsSync(path.join(agentic, 'kanban', 'index.html')));
  assert(fs.existsSync(path.join(agentic, 'kanban', 'backlog.json')));
})) passed++;

if (test('compileBacklog splits columns', () => {
  const snap = syncBacklog(agentic);
  assert(snap.columns.planned.length === 1, 'one planned');
  assert(snap.columns.inProgress.length === 1, 'one in progress');
  assert(snap.contract.content.includes('Foundation Agreement'));
  assert(snap.summary.problem.includes('find products'));
  const cfg = readKanbanConfig(path.join(agentic, 'kanban'));
  assert(cfg.disclaimer.includes('Total Energiees'));
})) passed++;

console.log(`\n${passed}/3 backlog tests passed`);
process.exit(passed === 3 ? 0 : 1);
