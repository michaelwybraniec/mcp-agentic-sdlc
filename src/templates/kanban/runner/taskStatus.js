"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_STATUS = void 0;
exports.resolveTaskColumn = resolveTaskColumn;
exports.validateTaskBoard = validateTaskBoard;
exports.formatStatusLine = formatStatusLine;
exports.sortTaskIds = sortTaskIds;
exports.inferActiveTaskId = inferActiveTaskId;
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
    const pendingPlanned = sortTaskIds(snapshot.columns.planned.map((t) => t.id));
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
/** Sort task ids numerically (1.0 < 2.0 < 10.0). */
function sortTaskIds(ids) {
    return [...ids].sort((a, b) => {
        const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
        const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const d = (pa[i] || 0) - (pb[i] || 0);
            if (d !== 0)
                return d;
        }
        return a.localeCompare(b);
    });
}
/** Guess active task when markdown was not updated (display-only inference). */
function inferActiveTaskId(snapshot) {
    if (snapshot.columns.inProgress.some((t) => !t.inferredInProgress))
        return undefined;
    if (snapshot.columns.inProgress.length > 0)
        return undefined;
    const pending = sortTaskIds(snapshot.columns.planned.map((t) => t.id));
    if (!pending.length)
        return undefined;
    const hasCompleted = snapshot.columns.completed.length > 0 ||
        Object.values(snapshot.tasks).some((t) => t.status === 'completed');
    if (hasCompleted)
        return pending[0];
    return undefined;
}
/** Promote a planned task to In Progress in the snapshot (display only; does not edit .md). */
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
