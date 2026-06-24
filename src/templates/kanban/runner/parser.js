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
exports.taskIdFromFilename = taskIdFromFilename;
exports.parseTaskStatus = parseTaskStatus;
exports.parseTaskMd = parseTaskMd;
exports.peek = peek;
const path = __importStar(require("path"));
function headerValue(content, key) {
    const re = new RegExp(`^#\\s+${key}:\\s*(.+)$`, 'im');
    const m = content.match(re);
    return m ? m[1].trim() : '';
}
function sectionContent(content, heading) {
    const re = new RegExp(`##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const m = content.match(re);
    return m ? m[1].trim() : '';
}
function parseListSection(text) {
    return text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('-'))
        .map((l) => l.replace(/^-\s*(\[[ x~]\]\s*)?/, '').trim())
        .filter(Boolean);
}
function taskIdFromFilename(filename) {
    const base = path.basename(filename, '.md');
    const m = base.match(/^task-(.+)$/);
    return m ? m[1] : base;
}
function parseTaskStatus(statusRaw) {
    const s = statusRaw.toLowerCase();
    if (s.includes('in progress') || s.includes('[~]'))
        return 'in_progress';
    if (s.includes('completed') || s.includes('[x]'))
        return 'completed';
    return 'pending';
}
function parseTaskMd(content, filePath) {
    const id = headerValue(content, 'Task ID') || taskIdFromFilename(filePath);
    const statusRaw = headerValue(content, 'Status');
    const activitySection = sectionContent(content, 'Activity');
    const activityLines = activitySection
        ? activitySection
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l.startsWith('-'))
            .map((l) => l.replace(/^-\s*/, ''))
        : [];
    const depsSection = sectionContent(content, 'Dependencies');
    const dependencies = depsSection
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => /Task ID:/i.test(l))
        .map((l) => {
        const m = l.match(/Task ID:\s*([^\s\]]+)/i);
        return m ? m[1].trim() : '';
    })
        .filter(Boolean);
    return {
        id,
        title: headerValue(content, 'Title') || id,
        statusRaw,
        status: parseTaskStatus(statusRaw),
        priority: headerValue(content, 'Priority') || 'medium',
        owner: headerValue(content, 'Owner') || '',
        description: sectionContent(content, 'Description'),
        dependencies,
        acceptanceCriteria: parseListSection(sectionContent(content, 'Acceptance Criteria')),
        notes: sectionContent(content, 'Notes'),
        risk: sectionContent(content, 'Risk Assessment'),
        activityLines,
    };
}
function peek(text, max = 80) {
    const one = text.replace(/\s+/g, ' ').trim();
    if (one.length <= max)
        return one;
    return one.slice(0, max - 1) + '…';
}
