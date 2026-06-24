/**
 * @fileoverview task markdown lifecycle updates
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { applyTaskLifecycle, findInProgressTaskId, firstPlannedTaskId } = require('../dist/backlog/taskMd');

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

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'task-md-'));
const tasksDir = path.join(tmp, 'tasks', 'planned');
fs.mkdirSync(tasksDir, { recursive: true });
fs.writeFileSync(
  path.join(tasksDir, 'task-1.0.md'),
  `# Task ID: 1.0
# Title: Phase 1
# Status: [ ] Pending

## Activity
- 2026-06-24 10:00 — Task created
`
);

let passed = 0;

if (
  test('startTaskId sets in progress status', () => {
    applyTaskLifecycle(path.join(tmp, 'tasks'), { startTaskId: '1.0', activity: 'Started' });
    const content = fs.readFileSync(path.join(tasksDir, 'task-1.0.md'), 'utf8');
    assert(content.includes('[~] In Progress'));
    assert(content.includes('Started'));
  })
)
  passed++;

if (
  test('firstPlannedTaskId returns lowest id', () => {
    fs.writeFileSync(path.join(tasksDir, 'task-2.0.md'), '# Task ID: 2.0\n# Status: [ ] Pending\n');
    assert(firstPlannedTaskId(path.join(tmp, 'tasks')) === '1.0');
    assert(findInProgressTaskId(path.join(tmp, 'tasks')) === '1.0');
  })
)
  passed++;

console.log(`\n${passed}/2 taskMd tests passed`);
process.exit(passed === 2 ? 0 : 1);
