/**
 * @fileoverview Task planning from user.md
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  extractWorkItems,
  assignItemsToPhases,
  isComprehensiveUserMd,
} = require('../dist/utils/taskPlanning');
const { createInitialTasks } = require('../dist/utils/helpers');
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

const userMd = `# User Source Material

---

## Features

- Build a methane monitoring dashboard with live map
- Add alert thresholds for sensor readings
- Export CSV reports for compliance
- User authentication with SSO
- Admin panel for device configuration

## Non-goals

- Production HA deployment
`;

test('extractWorkItems pulls bullets from user.md', () => {
  const items = extractWorkItems(userMd);
  assert(items.length >= 4, 'at least 4 items');
  assert(items.some((i) => /dashboard/i.test(i)));
});

test('isComprehensiveUserMd detects rich briefs', () => {
  assert(isComprehensiveUserMd(userMd));
  assert(!isComprehensiveUserMd('short brief'));
});

test('assignItemsToPhases maps items to phases', () => {
  const items = extractWorkItems(userMd);
  const phases = ['1. Scaffold dashboard', '2. Add alerts and export', '3. Auth and admin'];
  const map = assignItemsToPhases(items, phases, ['monitoring']);
  const phase0 = map.get(0) || [];
  assert(phase0.some((i) => /dashboard/i.test(i)), 'dashboard item in phase 0');
});

test('createInitialTasks creates subtasks from comprehensive user.md', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'plan-tasks-'));
  const result = createInitialTasks(
    dir,
    ['Monitoring'],
    ['1. Scaffold dashboard', '2. Alerts and export'],
    ['React'],
    ['Demo works'],
    'poc',
    { userMdContent: userMd, goals: ['Monitoring'] }
  );
  assert(result.usedUserMd);
  assert(result.comprehensiveUserMd);
  assert(fs.existsSync(path.join(dir, 'task-1.0.md')));
  const hasChild = fs.existsSync(path.join(dir, 'task-1.1.md'));
  assert(hasChild || fs.readFileSync(path.join(dir, 'task-1.0.md'), 'utf8').includes('user.md'), 'subtasks or enriched parent');
  if (hasChild) {
    const child = parseTaskMd(fs.readFileSync(path.join(dir, 'task-1.1.md'), 'utf8'), 'task-1.1.md');
    assert(child.acceptanceCriteria.length >= 2);
    assert(result.subtaskCount >= 1);
  }
});
