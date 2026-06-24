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
exports.taskIdsFromChangedFiles = taskIdsFromChangedFiles;
exports.diffTasks = diffTasks;
exports.mergeTaskActivity = mergeTaskActivity;
exports.contractChangeEvent = contractChangeEvent;
exports.appendGlobalEvents = appendGlobalEvents;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const parser_js_1 = require("./parser.js");
const MAX_EVENTS = 100;
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
function taskIdsFromChangedFiles(changedFiles) {
    const ids = new Set();
    for (const file of changedFiles) {
        if (!(0, parser_js_1.isTaskMarkdownFile)(file))
            continue;
        const id = (0, parser_js_1.taskIdFromFilename)(file);
        if (id)
            ids.add(id);
    }
    return [...ids];
}
function diffTasks(prev, next, changedTaskIds) {
    const now = new Date().toISOString();
    const events = [];
    const messages = new Map();
    if (!prev) {
        const count = Object.keys(next.tasks).length;
        events.push({
            at: now,
            kind: 'sync',
            message: count ? `Backlog loaded · ${count} task${count === 1 ? '' : 's'}` : 'Backlog loaded',
        });
        return { events, messages };
    }
    const taskIds = changedTaskIds.filter((id) => id && (prev.tasks[id] || next.tasks[id]));
    for (const taskId of taskIds) {
        const prevTask = prev.tasks[taskId];
        const nextTask = next.tasks[taskId];
        if (!nextTask) {
            const msg = `Removed from board · ${prevTask?.title || taskId}`;
            events.push({
                at: now,
                kind: 'removed',
                taskId,
                title: prevTask?.title,
                message: msg,
            });
            messages.set(taskId, msg);
            continue;
        }
        if (!prevTask) {
            const col = formatColumn(nextTask.column);
            const msg = `Added to ${col} · ${nextTask.title}`;
            events.push({
                at: now,
                kind: 'added',
                taskId,
                title: nextTask.title,
                message: msg,
            });
            messages.set(taskId, msg);
            continue;
        }
        const parts = [];
        let kind = 'updated';
        if (prevTask.column !== nextTask.column) {
            parts.push(`Moved to ${formatColumn(nextTask.column)}`);
            kind = 'moved';
        }
        if (prevTask.status !== nextTask.status) {
            parts.push(`Status → ${formatStatus(nextTask.status)}`);
            if (kind !== 'moved')
                kind = 'status';
        }
        if (prevTask.title !== nextTask.title) {
            parts.push('Title updated');
        }
        const msg = parts.length
            ? `${parts.join(' · ')} — ${nextTask.title}`
            : `Updated — ${nextTask.title}`;
        events.push({
            at: now,
            kind,
            taskId,
            title: nextTask.title,
            message: msg,
        });
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
        kind: 'updated',
    }));
    const fromDiff = diffMessage
        ? [{ at: new Date().toISOString(), message: diffMessage, kind: 'updated', taskId: task.id, title: task.title }]
        : [];
    const combined = [...fromDiff, ...fromMd];
    return combined.slice(0, MAX_TASK_ACTIVITY);
}
function contractChangeEvent() {
    return {
        at: new Date().toISOString(),
        kind: 'contract',
        message: 'Foundation agreement updated (base.md)',
    };
}
function appendGlobalEvents(kanbanDir, newEvents, prev, next, changedFiles) {
    const global = loadActivityLog(kanbanDir);
    const merged = [...newEvents, ...global].slice(0, MAX_EVENTS);
    saveActivityLog(kanbanDir, merged);
    const recentEvents = newEvents.map((e, i) => {
        const file = changedFiles[i] || changedFiles.find((f) => (0, parser_js_1.isTaskMarkdownFile)(f)) || '';
        const taskId = e.taskId || (file ? (0, parser_js_1.taskIdFromFilename)(file) : '');
        const kind = e.kind || 'updated';
        return {
            at: e.at || new Date().toISOString(),
            taskId,
            path: file,
            type: kind,
            kind,
            title: e.title,
            message: e.message,
        };
    });
    next.recentEvents = [...recentEvents, ...(prev?.recentEvents || [])].slice(0, MAX_EVENTS);
    return next;
}
