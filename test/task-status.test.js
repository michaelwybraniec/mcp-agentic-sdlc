/**
 * @fileoverview task board status validation
 */

const { validateTaskBoard, resolveTaskColumn, TASK_STATUS } = require('../dist/backlog/taskStatus');
const { parseTaskStatus } = require('../dist/backlog/parser');

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

const task = (id, column, status, sourcePath) => ({
  id,
  title: `Task ${id}`,
  column,
  status,
  sourcePath: sourcePath || `backlog/poc/tasks/${column === 'completed' ? 'completed' : 'planned'}/task-${id}.md`,
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
});

let passed = 0;

if (
  test('parseTaskStatus accepts common variants', () => {
    assert(parseTaskStatus('[~] In Progress') === 'in_progress');
    assert(parseTaskStatus('In Progress') === 'in_progress');
    assert(parseTaskStatus('[x] Completed') === 'completed');
    assert(parseTaskStatus('[ ] Pending') === 'pending');
  })
)
  passed++;

if (
  test('resolveTaskColumn uses planned + in_progress for In Progress column', () => {
    assert(resolveTaskColumn('planned', 'in_progress') === 'inProgress');
    assert(resolveTaskColumn('planned', 'pending') === 'planned');
    assert(resolveTaskColumn('completed', 'pending') === 'completed');
  })
)
  passed++;

if (
  test('validateTaskBoard warns when no in progress after completed work', () => {
    const t1 = task('1.0', 'completed', 'completed', 'backlog/poc/tasks/completed/task-1.0.md');
    const t2 = task('2.0', 'planned', 'pending');
    const snap = {
      tasks: { '1.0': t1, '2.0': t2 },
      columns: { unplanned: [], planned: [t2], inProgress: [], completed: [t1] },
    };
    const health = validateTaskBoard(snap);
    assert(health.inProgressIds.length === 0);
    assert(health.warnings.some((w) => w.includes('No task In Progress')));
    assert(health.suggestedNextTaskId === '2.0');
  })
)
  passed++;

if (
  test('validateTaskBoard warns on fresh backlog with no in progress', () => {
    const t1 = task('1.0', 'planned', 'pending');
    const snap = {
      tasks: { '1.0': t1 },
      columns: { unplanned: [], planned: [t1], inProgress: [], completed: [] },
    };
    const health = validateTaskBoard(snap);
    assert(health.warnings.some((w) => w.includes('No task marked In Progress')));
  })
)
  passed++;

if (
  test('validateTaskBoard warns on multiple in progress', () => {
    const t1 = task('1.0', 'inProgress', 'in_progress');
    const t2 = task('2.0', 'inProgress', 'in_progress');
    const snap = {
      tasks: { '1.0': t1, '2.0': t2 },
      columns: { unplanned: [], planned: [], inProgress: [t1, t2], completed: [] },
    };
    const health = validateTaskBoard(snap);
    assert(health.warnings.some((w) => w.includes('Multiple In Progress')));
  })
)
  passed++;

console.log(`\n${passed}/5 taskStatus tests passed`);
process.exit(passed === 5 ? 0 : 1);
