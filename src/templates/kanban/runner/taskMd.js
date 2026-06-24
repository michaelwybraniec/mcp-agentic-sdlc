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
exports.findTaskMarkdownFile = findTaskMarkdownFile;
exports.appendActivityLine = appendActivityLine;
exports.setTaskStatusInMarkdown = setTaskStatusInMarkdown;
exports.updateTaskMarkdownFile = updateTaskMarkdownFile;
exports.moveTaskMarkdownFile = moveTaskMarkdownFile;
exports.applyTaskLifecycle = applyTaskLifecycle;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const taskStatus_js_1 = require("./taskStatus.js");
const parser_js_1 = require("./parser.js");
const STATUS_LINE = {
    pending: `# Status: ${taskStatus_js_1.TASK_STATUS.pending}`,
    in_progress: `# Status: ${taskStatus_js_1.TASK_STATUS.inProgress}`,
    completed: `# Status: ${taskStatus_js_1.TASK_STATUS.completed}`,
};
function findTaskMarkdownFile(tasksDir, taskId) {
    for (const folder of ['planned', 'completed', 'unplanned']) {
        const dir = path.join(tasksDir, folder);
        if (!fs.existsSync(dir))
            continue;
        for (const file of fs.readdirSync(dir)) {
            if (!file.endsWith('.md'))
                continue;
            if ((0, parser_js_1.taskIdFromFilename)(file) === taskId) {
                return { absPath: path.join(dir, file), folder };
            }
        }
    }
    return null;
}
function appendActivityLine(content, line) {
    const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const entry = `- ${stamp} — ${line}`;
    if (/## Activity\b/i.test(content)) {
        return content.replace(/(## Activity\s*\n)/i, `$1${entry}\n`);
    }
    return content.trimEnd() + `\n\n## Activity\n${entry}\n`;
}
function setTaskStatusInMarkdown(content, status) {
    const line = STATUS_LINE[status];
    if (/^# Status:/im.test(content)) {
        return content.replace(/^# Status:.*$/im, line);
    }
    if (/^# Title:/im.test(content)) {
        return content.replace(/^(# Title:.*\n)/im, `$1${line}\n`);
    }
    return `${line}\n${content}`;
}
function updateTaskMarkdownFile(filePath, status, activityLine) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = setTaskStatusInMarkdown(content, status);
    if (activityLine) {
        content = appendActivityLine(content, activityLine);
    }
    fs.writeFileSync(filePath, content);
}
function moveTaskMarkdownFile(filePath, tasksDir, targetFolder) {
    const fileName = path.basename(filePath);
    const destDir = path.join(tasksDir, targetFolder);
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, fileName);
    if (path.resolve(filePath) !== path.resolve(dest)) {
        fs.renameSync(filePath, dest);
    }
    return dest;
}
/** Update markdown so Kanban columns match AWP workflow (agents call via backlog_sync). */
function applyTaskLifecycle(tasksDir, options) {
    const results = [];
    const activity = options.activity;
    if (options.startTaskId) {
        const id = options.startTaskId;
        const plannedDir = path.join(tasksDir, 'planned');
        if (fs.existsSync(plannedDir)) {
            for (const file of fs.readdirSync(plannedDir).filter((f) => f.endsWith('.md'))) {
                const otherId = (0, parser_js_1.taskIdFromFilename)(file);
                if (!otherId || otherId === id)
                    continue;
                const abs = path.join(plannedDir, file);
                const raw = fs.readFileSync(abs, 'utf8');
                if (/^# Status:.*\[~\]/im.test(raw) || /\bin progress\b/i.test(raw)) {
                    updateTaskMarkdownFile(abs, 'pending', `Status reset — task ${id} started`);
                    results.push({ taskId: otherId, action: 'demoted', path: abs });
                }
            }
        }
        const found = findTaskMarkdownFile(tasksDir, id);
        if (!found) {
            throw new Error(`Task ${id} not found under tasks/`);
        }
        let abs = found.absPath;
        if (found.folder !== 'planned') {
            abs = moveTaskMarkdownFile(abs, tasksDir, 'planned');
        }
        updateTaskMarkdownFile(abs, 'in_progress', activity || `Started task ${id}`);
        results.push({ taskId: id, action: 'started', path: abs });
    }
    if (options.completeTaskId) {
        const id = options.completeTaskId;
        const found = findTaskMarkdownFile(tasksDir, id);
        if (!found) {
            throw new Error(`Task ${id} not found under tasks/`);
        }
        updateTaskMarkdownFile(found.absPath, 'completed', activity || `Completed task ${id}`);
        const abs = moveTaskMarkdownFile(found.absPath, tasksDir, 'completed');
        results.push({ taskId: id, action: 'completed', path: abs });
    }
    return results;
}
