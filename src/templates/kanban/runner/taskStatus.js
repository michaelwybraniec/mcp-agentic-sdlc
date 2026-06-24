"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_STATUS = void 0;
exports.resolveTaskColumn = resolveTaskColumn;
exports.validateTaskBoard = validateTaskBoard;
exports.formatStatusLine = formatStatusLine;
exports.applyInProgressInference = applyInProgressInference;
/** Canonical status lines agents should write in task .md files. */
exports.TASK_STATUS = {
    pending: '[ ] Pending',
    inProgress: '[~] In Progress',
    completed: '[x] Completed',
};
function resolveTaskColumn(folder, status) {
    if (folder === 'unplanned')
        return 'unplanned';
    if (folder === 'completed')
        return 'completed';
    if (folder === 'planned') {
        if (status === 'in_progress')
            return 'inProgress';
        return 'planned';
    }
    return 'planned';
}
/** Validate board status vs folders; surface agent-fixable warnings. */
function validateTaskBoard(snapshot) {
    const warnings = [];
    const tasks = Object.values(snapshot.tasks);
    const inProgress = tasks.filter((t) => t.column === 'inProgress');
    const inProgressIds = inProgress.map((t) => t.id);
    const pendingPlanned = snapshot.columns.planned.map((t) => t.id);
    const completedIds = [
        ...snapshot.columns.completed.map((t) => t.id),
        ...tasks.filter((t) => t.status === 'completed' && t.column === 'planned').map((t) => t.id),
    ];
    for (const t of tasks) {
        const folder = folderFromSourcePath(t.sourcePath);
        if (folder === 'planned' && t.status === 'completed') {
            warnings.push(`Task ${t.id}: status is Completed but file is still in tasks/planned/ — move to tasks/completed/ or set ${exports.TASK_STATUS.pending}`);
        }
        if (folder === 'completed' && t.status !== 'completed') {
            warnings.push(`Task ${t.id}: file is in tasks/completed/ but # Status is not Completed — set \`# Status: ${exports.TASK_STATUS.completed}\``);
        }
        if (folder === 'planned' && t.status === 'in_progress' && t.column !== 'inProgress') {
            warnings.push(`Task ${t.id}: could not place in In Progress — check # Status line format`);
        }
    }
    if (inProgressIds.length > 1) {
        warnings.push(`Multiple In Progress tasks (${inProgressIds.join(', ')}) — only one should be \`# Status: ${exports.TASK_STATUS.inProgress}\` at a time`);
    }
    if (inProgressIds.length === 0 && pendingPlanned.length > 0) {
        const suggested = pendingPlanned[0];
        if (completedIds.length > 0) {
            warnings.push(`No task In Progress — set \`# Status: ${exports.TASK_STATUS.inProgress}\` on the active task (e.g. task-${suggested}.md) or call backlog_sync with startTaskId`);
        }
        else {
            warnings.push(`No task marked In Progress — when starting task ${suggested}, set \`# Status: ${exports.TASK_STATUS.inProgress}\` or call backlog_sync with startTaskId: "${suggested}"`);
        }
    }
    return {
        inProgressIds,
        pendingPlannedIds: pendingPlanned,
        completedIds,
        warnings,
        suggestedNextTaskId: inProgressIds.length === 0 && pendingPlanned.length > 0 ? pendingPlanned[0] : undefined,
    };
}
function folderFromSourcePath(sourcePath) {
    const m = sourcePath.match(/tasks\/(planned|completed|unplanned)\//);
    return m ? m[1] : 'planned';
}
function formatStatusLine(status) {
    return exports.TASK_STATUS[status];
}
/** Promote a planned task to In Progress in the snapshot when inferred from git (display only). */
function applyInProgressInference(snapshot, inferredTaskId) {
    if (!inferredTaskId || snapshot.columns.inProgress.length > 0)
        return false;
    const task = snapshot.tasks[inferredTaskId];
    if (!task || task.column !== 'planned')
        return false;
    task.column = 'inProgress';
    task.inferredInProgress = true;
    const planned = snapshot.columns.planned.filter((t) => t.id !== inferredTaskId);
    const inProgress = [...snapshot.columns.inProgress, task];
    snapshot.columns.planned = planned;
    snapshot.columns.inProgress = inProgress;
    return true;
}
