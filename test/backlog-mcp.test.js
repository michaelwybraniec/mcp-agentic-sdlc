/**
 * @fileoverview Kanban MCP resource tests (appDir resolution)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { scaffoldKanban } = require('../dist/backlog/scaffold');
const { getBacklogResources, handleBacklogUri } = require('../dist/resources/backlog');

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

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kanban-mcp-'));
const agentic = path.join(tmp, 'agentic-sdlc');
const backlogDir = path.join(agentic, 'backlog-demo', 'mvp');
const planned = path.join(backlogDir, 'tasks', 'planned');

fs.mkdirSync(planned, { recursive: true });
fs.writeFileSync(
  path.join(backlogDir, 'base.md'),
  '# Base: AWP Project Foundation Agreement\n\n**Problem:** Test\n**Primary User:** U\n**Core User Journey:** J\n\n## 1. Essential MVP Features\n\n1. A\n\n## 4. Key Technologies\n\n1. React\n\n## 9. Project Phases (MVP)\n\n1. P1\n'
);
fs.writeFileSync(
  path.join(planned, 'task-1.0.md'),
  '# Task ID: 1.0\n# Title: T\n# Status: [ ] Pending\n# Priority: low\n# Owner: X\n\n## Description\nD\n\n## Dependencies\n- None\n'
);

scaffoldKanban(agentic, 'demo', 'mvp', { appDir: tmp });

const originalCwd = process.cwd();
const wrongDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kanban-wrong-cwd-'));
const prevEnv = process.env.AGENTIC_SDLC_APP_DIR;

let passed = 0;

if (test('getBacklogResources uses AGENTIC_SDLC_APP_DIR when cwd is wrong', () => {
  process.chdir(wrongDir);
  process.env.AGENTIC_SDLC_APP_DIR = tmp;
  try {
    const resources = getBacklogResources();
    assert(resources.length === 1, 'one resource');
    assert(resources[0].uri === 'backlog://demo/snapshot');
  } finally {
    process.chdir(originalCwd);
    if (prevEnv === undefined) delete process.env.AGENTIC_SDLC_APP_DIR;
    else process.env.AGENTIC_SDLC_APP_DIR = prevEnv;
  }
})) passed++;

if (test('handleBacklogUri reads snapshot via appDir from config', () => {
  process.chdir(wrongDir);
  process.env.AGENTIC_SDLC_APP_DIR = tmp;
  try {
    const result = handleBacklogUri('backlog://demo/snapshot');
    assert(result && result.contents.length === 1);
    const json = JSON.parse(result.contents[0].text);
    assert(json.meta.name === 'demo');
    assert(Object.keys(json.tasks).length >= 1);
  } finally {
    process.chdir(originalCwd);
    if (prevEnv === undefined) delete process.env.AGENTIC_SDLC_APP_DIR;
    else process.env.AGENTIC_SDLC_APP_DIR = prevEnv;
  }
})) passed++;

console.log(`\n${passed}/2 backlog MCP tests passed`);
process.exit(passed === 2 ? 0 : 1);
