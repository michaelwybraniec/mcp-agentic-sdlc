"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadActivityLog = loadActivityLog;
exports.saveActivityLog = saveActivityLog;
exports.diffTasks = diffTasks;
exports.mergeTaskActivity = mergeTaskActivity;
exports.appendGlobalEvents = appendGlobalEvents;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const MAX_EVENTS = 50;
const MAX_TASK_ACTIVITY = 20;
function loadActivityLog(kanbanDir) {
    const p = path.join(kanbanDir, 'activity.json');
    if (!fs.existsSync(p))
        return [];
    try {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        return Array.isArray(data.events) ? data.events : [];
    }
    catch {
        return [];
    }
}
function saveActivityLog(kanbanDir, events) {
    const trimmed = events.slice(0, MAX_EVENTS);
    fs.writeFileSync(path.join(kanbanDir, 'activity.json'), JSON.stringify({ events: trimmed }, null, 2));
}
function taskSnapshotKey(t) {
    return JSON.stringify({
        title: t.title,
        status: t.status,
        column: t.column,
        priority: t.priority,
        owner: t.owner,
    });
}
function diffTasks(prev, next, changedTaskIds) {
    const now = new Date().toISOString();
    const events = [];
    const messages = new Map();
    for (const taskId of changedTaskIds) {
        const prevTask = prev?.tasks[taskId];
        const nextTask = next.tasks[taskId];
        if (!nextTask) {
            const msg = `Task ${taskId} removed from board`;
            events.push({ at: now, message: msg });
            messages.set(taskId, msg);
            continue;
        }
        if (!prevTask) {
            const msg = `Task ${taskId} added: ${nextTask.title}`;
            events.push({ at: now, message: msg });
            messages.set(taskId, msg);
            continue;
        }
        const parts = [];
        if (prevTask.column !== nextTask.column) {
            parts.push(`Moved to ${formatColumn(nextTask.column)}`);
        }
        if (prevTask.status !== nextTask.status) {
            parts.push(`Status → ${formatStatus(nextTask.status)}`);
        }
        if (prevTask.title !== nextTask.title) {
            parts.push('Title updated');
        }
        const msg = parts.length ? parts.join(', ') : `Task ${taskId} updated`;
        events.push({ at: now, message: `${taskId}: ${msg}` });
        messages.set(taskId, msg);
    }
    return { events, messages };
}
function formatColumn(col) {
    const map = {
        unplanned: 'Unplanned',
        planned: 'Planned',
        inProgress: 'In Progress',
        completed: 'Completed',
    };
    return map[col] || col;
}
function formatStatus(s) {
    const map = {
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed',
    };
    return map[s] || s;
}
function mergeTaskActivity(task, mdLines, diffMessage) {
    const fromMd = mdLines.slice(-5).map((line) => ({
        at: '',
        message: line,
    }));
    const fromDiff = diffMessage
        ? [{ at: new Date().toISOString(), message: diffMessage }]
        : [];
    const combined = [...fromDiff, ...fromMd];
    return combined.slice(0, MAX_TASK_ACTIVITY);
}
function appendGlobalEvents(kanbanDir, newEvents, prev, next, changedFiles) {
    const global = loadActivityLog(kanbanDir);
    const merged = [...newEvents, ...global].slice(0, MAX_EVENTS);
    saveActivityLog(kanbanDir, merged);
    const recentEvents = newEvents.map((e, i) => {
        const file = changedFiles[i] || changedFiles[0] || '';
        const taskId = extractTaskIdFromPath(file) || '';
        return {
            at: e.at || new Date().toISOString(),
            taskId,
            path: file,
            type: 'change',
            message: e.message,
        };
    });
    next.recentEvents = [...recentEvents, ...(prev?.recentEvents || [])].slice(0, MAX_EVENTS);
    return next;
}
function extractTaskIdFromPath(filePath) {
    const base = path.basename(filePath, '.md');
    const m = base.match(/^task-(.+)$/);
    return m ? m[1] : '';
}
