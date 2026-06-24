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
exports.loadTimeTracking = loadTimeTracking;
exports.saveTimeTracking = saveTimeTracking;
exports.inferTimeActor = inferTimeActor;
exports.computeTaskTotals = computeTaskTotals;
exports.recalculateSummary = recalculateSummary;
exports.updateTimeTracking = updateTimeTracking;
exports.enrichSnapshotWithTime = enrichSnapshotWithTime;
exports.formatDuration = formatDuration;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const FILE_NAME = 'time-tracking.json';
function loadTimeTracking(kanbanDir) {
    const p = path.join(kanbanDir, FILE_NAME);
    if (!fs.existsSync(p))
        return emptyStore();
    try {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (raw.version !== 1)
            return emptyStore();
        return {
            version: 1,
            updatedAt: raw.updatedAt || new Date().toISOString(),
            active: raw.active || {},
            tasks: raw.tasks || {},
            summary: raw.summary || { agentMs: 0, humanMs: 0, combinedMs: 0 },
        };
    }
    catch {
        return emptyStore();
    }
}
function saveTimeTracking(kanbanDir, store) {
    fs.writeFileSync(path.join(kanbanDir, FILE_NAME), JSON.stringify(store, null, 2));
}
function emptyStore() {
    return {
        version: 1,
        updatedAt: new Date().toISOString(),
        active: {},
        tasks: {},
        summary: { agentMs: 0, humanMs: 0, combinedMs: 0 },
    };
}
/** Infer who started work from recent activity / sync messages. */
function inferTimeActor(messages) {
    const text = messages.filter(Boolean).join(' ').toLowerCase();
    if (/\(human\)|\bhuman\s*only\b|handoff|awaiting human/i.test(text))
        return 'human';
    if (/\(ai\)|awp auto|backlog_sync|started task|task started|project started|via awp/i.test(text)) {
        return 'agent';
    }
    return 'agent';
}
function isTaskActive(task) {
    if (!task)
        return false;
    return task.status === 'in_progress' || task.column === 'inProgress';
}
function ensureTaskRecord(store, taskId, title) {
    if (!store.tasks[taskId]) {
        store.tasks[taskId] = {
            taskId,
            title,
            sessions: [],
            totalsMs: { agent: 0, human: 0, combined: 0 },
        };
    }
    else if (title) {
        store.tasks[taskId].title = title;
    }
    return store.tasks[taskId];
}
function startSession(store, taskId, title, at, actor) {
    if (store.active[taskId])
        return;
    store.active[taskId] = { startedAt: at, actor, title };
    const rec = ensureTaskRecord(store, taskId, title);
    rec.sessions.push({
        taskId,
        title,
        startedAt: at,
        endedAt: null,
        actor,
    });
}
function endSession(store, taskId, at) {
    const active = store.active[taskId];
    if (!active)
        return;
    const rec = store.tasks[taskId];
    const open = rec?.sessions.find((s) => !s.endedAt);
    if (open)
        open.endedAt = at;
    delete store.active[taskId];
}
function sessionDurationMs(session, nowMs) {
    const start = Date.parse(session.startedAt);
    const end = session.endedAt ? Date.parse(session.endedAt) : nowMs;
    if (Number.isNaN(start) || Number.isNaN(end) || end < start)
        return 0;
    return end - start;
}
function computeTaskTotals(record, now = Date.now()) {
    let agent = 0;
    let human = 0;
    for (const s of record.sessions) {
        const ms = sessionDurationMs(s, now);
        if (s.actor === 'human')
            human += ms;
        else
            agent += ms;
    }
    const isActive = record.sessions.some((s) => !s.endedAt);
    return { agentMs: agent, humanMs: human, combinedMs: agent + human, isActive };
}
function recalculateSummary(store, now = Date.now()) {
    let agentMs = 0;
    let humanMs = 0;
    for (const rec of Object.values(store.tasks)) {
        const t = computeTaskTotals(rec, now);
        rec.totalsMs = { agent: t.agentMs, human: t.humanMs, combined: t.combinedMs };
        agentMs += t.agentMs;
        humanMs += t.humanMs;
    }
    store.summary = { agentMs, humanMs, combinedMs: agentMs + humanMs };
}
function updateTimeTracking(kanbanDir, prev, next) {
    const store = loadTimeTracking(kanbanDir);
    const now = new Date().toISOString();
    const allIds = new Set([
        ...Object.keys(prev?.tasks || {}),
        ...Object.keys(next.tasks),
    ]);
    for (const taskId of allIds) {
        const prevTask = prev?.tasks[taskId];
        const nextTask = next.tasks[taskId];
        const wasActive = isTaskActive(prevTask);
        const isActive = isTaskActive(nextTask);
        if (!wasActive && isActive && nextTask) {
            const msgs = [
                ...(nextTask.activity || []).map((a) => a.message),
            ];
            const actor = inferTimeActor(msgs);
            startSession(store, taskId, nextTask.title, now, actor);
        }
        else if (wasActive && !isActive) {
            endSession(store, taskId, now);
        }
        else if (!nextTask && store.active[taskId]) {
            endSession(store, taskId, now);
        }
    }
    for (const taskId of next.boardHealth.inProgressIds) {
        const t = next.tasks[taskId];
        if (t && !store.active[taskId]) {
            const actor = inferTimeActor((t.activity || []).map((a) => a.message));
            startSession(store, taskId, t.title, now, actor);
        }
    }
    recalculateSummary(store, Date.now());
    store.updatedAt = now;
    saveTimeTracking(kanbanDir, store);
    return store;
}
function enrichSnapshotWithTime(snapshot, store, now = Date.now()) {
    recalculateSummary(store, now);
    for (const task of Object.values(snapshot.tasks)) {
        const rec = store.tasks[task.id];
        task.timeSpent = rec
            ? computeTaskTotals(rec, now)
            : { agentMs: 0, humanMs: 0, combinedMs: 0, isActive: !!store.active[task.id] };
    }
    snapshot.timeDashboard = {
        ...store.summary,
        updatedAt: store.updatedAt,
        taskCount: Object.keys(store.tasks).length,
        activeTaskIds: Object.keys(store.active),
    };
}
function formatDuration(ms) {
    if (!ms || ms < 1000)
        return '<1m';
    const totalMin = Math.floor(ms / 60000);
    if (totalMin < 60)
        return `${totalMin}m`;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
}
