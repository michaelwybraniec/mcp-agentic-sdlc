/**
 * @fileoverview activity diff and filtering tests
 */

const { diffTasks, taskIdsFromChangedFiles } = require('../dist/backlog/activity');
const { isTaskMarkdownFile, taskIdFromFilename } = require('../dist/backlog/parser');

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

const task = (id, title, column, status = 'pending') => ({
  id,
  title,
  column,
  status,
  priority: 'medium',
  owner: '',
  description: '',
  descriptionPeek: '',
  dependencies: [],
  dependencyCount: 0,
  acceptanceCriteria: [],
  notes: '',
  risk: '',
  activity: [],
  activityPeek: '',
  lastUpdated: new Date().toISOString(),
  sourcePath: `tasks/planned/task-${id}.md`,
});

const snapshot = (tasks) => ({
  meta: {},
  config: {},
  summary: {},
  contract: {},
  columns: {},
  tasks: Object.fromEntries(tasks.map((t) => [t.id, t])),
  recentEvents: [],
  _warnings: [],
});

let passed = 0;

if (
  test('isTaskMarkdownFile ignores base.md and backlog.md', () => {
    assert(isTaskMarkdownFile('task-1.0.md'));
    assert(!isTaskMarkdownFile('base.md'));
    assert(!isTaskMarkdownFile('backlog.md'));
    assert(!isTaskMarkdownFile('completed'));
  })
)
  passed++;

if (
  test('taskIdFromFilename returns empty for non-task files', () => {
    assert(taskIdFromFilename('base.md') === '');
    assert(taskIdFromFilename('task-1.0.md') === '1.0');
  })
)
  passed++;

if (
  test('taskIdsFromChangedFiles filters non-task paths', () => {
    const ids = taskIdsFromChangedFiles(['base.md', 'task-2.0.md', 'backlog.md']);
    assert(ids.length === 1 && ids[0] === '2.0');
  })
)
  passed++;

if (
  test('first sync emits single backlog loaded event', () => {
    const next = snapshot([task('1.0', 'Phase 1', 'planned')]);
    const { events } = diffTasks(null, next, ['1.0']);
    assert(events.length === 1);
    assert(events[0].kind === 'sync');
    assert(events[0].message.includes('1 task'));
  })
)
  passed++;

if (
  test('move to completed uses moved kind', () => {
    const prev = snapshot([task('1.0', 'Phase 1', 'inProgress', 'in_progress')]);
    const next = snapshot([task('1.0', 'Phase 1', 'completed', 'completed')]);
    const { events } = diffTasks(prev, next, ['1.0']);
    assert(events[0].kind === 'moved');
    assert(events[0].message.includes('Completed'));
    assert(events[0].message.includes('Phase 1'));
  })
)
  passed++;

console.log(`\n${passed}/5 activity tests passed`);
process.exit(passed === 5 ? 0 : 1);
