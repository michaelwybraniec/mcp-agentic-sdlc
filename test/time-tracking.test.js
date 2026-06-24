/**
 * @fileoverview Time tracking for Kanban tasks
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  inferTimeActor,
  loadTimeTracking,
  updateTimeTracking,
  enrichSnapshotWithTime,
  formatDuration,
  computeTaskTotals,
} = require('../dist/backlog/timeTracking');
const { syncBacklog } = require('../dist/backlog/compiler');

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

test('inferTimeActor detects human vs agent', () => {
  assert(inferTimeActor(['Handoff to human (Human)']) === 'human');
  assert(inferTimeActor(['Started task via awp auto (AI)']) === 'agent');
  assert(inferTimeActor(['backlog_sync started task']) === 'agent');
});

test('formatDuration formats minutes and hours', () => {
  assert(formatDuration(0) === '<1m');
  assert(formatDuration(120000) === '2m');
  assert(formatDuration(3660000) === '1h 1m');
});

test('updateTimeTracking records session on in progress', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'time-track-'));
  const kanbanDir = path.join(tmp, 'kanban');
  fs.mkdirSync(kanbanDir, { recursive: true });

  const prev = {
    tasks: {
      '1.0': { id: '1.0', title: 'A', status: 'pending', column: 'planned' },
    },
    boardHealth: { inProgressIds: [] },
  };
  const next = {
    tasks: {
      '1.0': {
        id: '1.0',
        title: 'A',
        status: 'in_progress',
        column: 'inProgress',
        activity: [{ message: 'Started task (AI)' }],
      },
    },
    boardHealth: { inProgressIds: ['1.0'] },
  };

  const store = updateTimeTracking(kanbanDir, prev, next);
  assert(store.active['1.0'], 'should have active session');
  assert(store.tasks['1.0'].sessions.length === 1);
  assert(store.tasks['1.0'].sessions[0].actor === 'agent');

  const ended = {
    tasks: {
      '1.0': {
        id: '1.0',
        title: 'A',
        status: 'completed',
        column: 'completed',
        activity: [{ message: 'Completed (AI)' }],
      },
    },
    boardHealth: { inProgressIds: [] },
  };
  updateTimeTracking(kanbanDir, next, ended);
  const loaded = loadTimeTracking(kanbanDir);
  assert(!loaded.active['1.0'], 'session should end');
  assert(loaded.tasks['1.0'].sessions[0].endedAt, 'session should have end time');
});

test('enrichSnapshotWithTime adds timeSpent to tasks', () => {
  const rec = {
    taskId: '1.0',
    title: 'A',
    sessions: [
      {
        taskId: '1.0',
        startedAt: new Date(Date.now() - 60000).toISOString(),
        endedAt: new Date().toISOString(),
        actor: 'agent',
      },
    ],
    totalsMs: { agent: 0, human: 0, combined: 0 },
  };
  const store = {
    version: 1,
    updatedAt: new Date().toISOString(),
    active: {},
    tasks: { '1.0': rec },
    summary: { agentMs: 0, humanMs: 0, combinedMs: 0 },
  };
  const snapshot = { tasks: { '1.0': { id: '1.0', title: 'A' } } };
  enrichSnapshotWithTime(snapshot, store);
  assert(snapshot.tasks['1.0'].timeSpent);
  assert(snapshot.tasks['1.0'].timeSpent.agentMs >= 59000);
  assert(snapshot.timeDashboard.combinedMs >= 59000);
});

test('syncBacklog writes time-tracking.json', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'time-sync-'));
  const agentic = path.join(tmp, 'agentic-sdlc');
  const backlogDir = path.join(agentic, 'backlog-demo', 'mvp');
  const planned = path.join(backlogDir, 'tasks', 'planned');
  const kanban = path.join(agentic, 'kanban');
  fs.mkdirSync(planned, { recursive: true });
  fs.mkdirSync(kanban, { recursive: true });

  fs.writeFileSync(
    path.join(backlogDir, 'base.md'),
    '# Base\n**Problem:** x\n**Primary User:** u\n**Core User Journey:** j\n## 1. Essential MVP Features\n1. A\n## 4. Key Technologies\n1. T\n## 9. Project Phases (MVP)\n1. P\n'
  );
  fs.writeFileSync(
    path.join(planned, 'task-1.0.md'),
    `# Task ID: 1.0
# Title: Task one
# Status: [/] In Progress
# Priority: high

## Description
Do work.

## Dependencies
- None

## Activity
- 2026-06-24 — Started (AI)
`
  );
  fs.writeFileSync(
    path.join(kanban, '.kanban-config.json'),
    JSON.stringify({
      backlogPath: 'backlog-demo/mvp',
      appDir: tmp,
      port: 4173,
      projectType: 'poc',
    })
  );

  const snap = syncBacklog(agentic);
  const ttPath = path.join(kanban, 'time-tracking.json');
  assert(fs.existsSync(ttPath), 'time-tracking.json should exist');
  assert(snap.tasks['1.0'].timeSpent, 'snapshot should include timeSpent');
  assert(snap.timeDashboard, 'snapshot should include timeDashboard');
});
