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
exports.readKanbanConfig = readKanbanConfig;
exports.writeKanbanConfig = writeKanbanConfig;
exports.resolveAppDir = resolveAppDir;
exports.discoverKanbanContext = discoverKanbanContext;
exports.compileBacklog = compileBacklog;
exports.syncBacklog = syncBacklog;
exports.getAgenticSdlcDir = getAgenticSdlcDir;
exports.detectAppDirForCli = detectAppDirForCli;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const parseBaseMd_js_1 = require("./parseBaseMd.js");
const activity_js_1 = require("./activity.js");
const parser_js_1 = require("./parser.js");
function readKanbanConfig(kanbanDir) {
    const configPath = path.join(kanbanDir, '.kanban-config.json');
    if (!fs.existsSync(configPath))
        return null;
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    catch {
        return null;
    }
}
function writeKanbanConfig(kanbanDir, config) {
    fs.writeFileSync(path.join(kanbanDir, '.kanban-config.json'), JSON.stringify(config, null, 2));
}
/** Resolve user project root from config, env, or fallback cwd. */
function resolveAppDir(config, fallback) {
    if (config?.appDir) {
        const resolved = path.resolve(config.appDir);
        if (fs.existsSync(path.join(resolved, 'agentic-sdlc', 'kanban'))) {
            return resolved;
        }
    }
    const envDir = process.env.AGENTIC_SDLC_APP_DIR;
    if (envDir) {
        const resolved = path.resolve(envDir);
        if (fs.existsSync(path.join(resolved, 'agentic-sdlc', 'kanban'))) {
            return resolved;
        }
    }
    return path.resolve(fallback || process.cwd());
}
/** Locate kanban config from explicit dir, cwd, or AGENTIC_SDLC_APP_DIR. */
function discoverKanbanContext(baseDir) {
    const candidates = [];
    if (baseDir)
        candidates.push(path.resolve(baseDir));
    candidates.push(process.cwd());
    if (process.env.AGENTIC_SDLC_APP_DIR) {
        candidates.push(path.resolve(process.env.AGENTIC_SDLC_APP_DIR));
    }
    const seen = new Set();
    for (const candidate of candidates) {
        if (seen.has(candidate))
            continue;
        seen.add(candidate);
        const kanbanDir = path.join(getAgenticSdlcDir(candidate), 'kanban');
        const config = readKanbanConfig(kanbanDir);
        if (!config)
            continue;
        const appDir = resolveAppDir(config, candidate);
        return {
            appDir,
            kanbanDir: path.join(getAgenticSdlcDir(appDir), 'kanban'),
            config: { ...config, appDir },
        };
    }
    return null;
}
function resolveColumn(folder, status) {
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
function buildSummary(parsed, projectType) {
    const summary = {
        problem: '',
        goals: [],
        technologies: [],
        phases: parsed.phases || [],
        successCriteria: [],
    };
    if (projectType === 'mvp') {
        const cvp = parsed.mvpCoreValueProposition;
        summary.problem = cvp?.problem || '';
        summary.goals = parsed.mvpFeatures || [];
        summary.technologies = parsed.mvpTech || [];
        summary.successCriteria = parsed.mvpSuccessCriteria || [];
    }
    else if (projectType === 'poc') {
        const cc = parsed.pocCoreConcept;
        summary.problem = cc?.hypothesis || '';
        summary.goals = parsed.pocProofPoints || [];
        summary.technologies = parsed.pocTech || [];
        summary.successCriteria = parsed.pocSuccessCriteria || [];
    }
    else {
        summary.goals = parsed.proObjectives || [];
        summary.technologies = parsed.proTech || [];
        summary.successCriteria = parsed.proSuccessCriteria || [];
    }
    return summary;
}
function readTasksFromFolder(tasksDir, folder, sourcePathPrefix, warnings) {
    const dir = path.join(tasksDir, folder);
    if (!fs.existsSync(dir))
        return [];
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f.startsWith('task-'));
    const cards = [];
    for (const file of files.sort()) {
        const abs = path.join(dir, file);
        const content = fs.readFileSync(abs, 'utf8');
        const parsed = (0, parser_js_1.parseTaskMd)(content, file);
        const stat = fs.statSync(abs);
        const relSource = path.join(sourcePathPrefix, 'tasks', folder, file).replace(/\\/g, '/');
        const column = resolveColumn(folder, parsed.status);
        if (folder === 'planned' && parsed.status === 'completed') {
            warnings.push(`Task ${parsed.id} has Completed status but is still in planned/`);
        }
        const card = {
            id: parsed.id,
            title: parsed.title,
            status: parsed.status,
            column,
            priority: parsed.priority,
            owner: parsed.owner,
            description: parsed.description,
            descriptionPeek: (0, parser_js_1.peek)(parsed.description),
            dependencies: parsed.dependencies,
            dependencyCount: parsed.dependencies.length,
            acceptanceCriteria: parsed.acceptanceCriteria,
            notes: parsed.notes,
            risk: parsed.risk,
            activity: parsed.activityLines.map((line) => ({ at: '', message: line })),
            activityPeek: parsed.activityLines.length
                ? parsed.activityLines[parsed.activityLines.length - 1]
                : '',
            lastUpdated: stat.mtime.toISOString(),
            sourcePath: relSource,
        };
        cards.push(card);
    }
    return cards;
}
function compileBacklog(agenticSdlcDir, config, options) {
    const kanbanDir = path.join(agenticSdlcDir, 'kanban');
    const backlogDir = path.join(agenticSdlcDir, config.backlogPath);
    const warnings = [];
    const sourcePathPrefix = config.backlogPath.replace(/\\/g, '/');
    const basePath = path.join(backlogDir, 'base.md');
    let contract = {
        title: 'AWP Project Foundation Agreement',
        path: path.join(sourcePathPrefix, 'base.md').replace(/\\/g, '/'),
        lastUpdated: '',
        content: '',
    };
    let summary = {
        problem: '',
        goals: [],
        technologies: [],
        phases: [],
        successCriteria: [],
    };
    if (fs.existsSync(basePath)) {
        const baseContent = fs.readFileSync(basePath, 'utf8');
        const stat = fs.statSync(basePath);
        contract.content = baseContent;
        contract.lastUpdated = stat.mtime.toISOString();
        const parsed = (0, parseBaseMd_js_1.parseBaseMd)(baseContent, config.projectType);
        summary = buildSummary(parsed, config.projectType);
    }
    else {
        warnings.push(`base.md not found at ${basePath}`);
    }
    const tasksDir = path.join(backlogDir, 'tasks');
    const unplanned = readTasksFromFolder(tasksDir, 'unplanned', sourcePathPrefix, warnings);
    const plannedRaw = readTasksFromFolder(tasksDir, 'planned', sourcePathPrefix, warnings);
    const completed = readTasksFromFolder(tasksDir, 'completed', sourcePathPrefix, warnings);
    const planned = plannedRaw.filter((t) => t.column === 'planned');
    const inProgress = plannedRaw.filter((t) => t.column === 'inProgress');
    const tasks = {};
    for (const list of [unplanned, planned, inProgress, completed]) {
        for (const t of list) {
            tasks[t.id] = t;
        }
    }
    const snapshot = {
        meta: {
            name: config.backlogName,
            type: config.projectType,
            generatedAt: new Date().toISOString(),
            sourcePath: sourcePathPrefix,
        },
        config,
        summary,
        contract,
        columns: { unplanned, planned, inProgress, completed },
        tasks,
        recentEvents: [],
        _warnings: warnings,
    };
    const prev = options?.prevSnapshot ?? loadPreviousSnapshot(kanbanDir);
    const changedTaskIds = options?.changedFiles
        ? options.changedFiles.map((f) => (0, parser_js_1.taskIdFromFilename)(path.basename(f)))
        : detectChangedTaskIds(prev, snapshot);
    if (changedTaskIds.length > 0 || !prev) {
        const { events, messages } = (0, activity_js_1.diffTasks)(prev, snapshot, changedTaskIds);
        for (const id of Object.keys(tasks)) {
            const t = tasks[id];
            const diffMsg = messages.get(id);
            t.activity = (0, activity_js_1.mergeTaskActivity)(t, t.activity.map((a) => a.message), diffMsg);
            t.activityPeek =
                t.activity.find((a) => a.at)?.message ||
                    t.activity[t.activity.length - 1]?.message ||
                    t.activityPeek;
        }
        return (0, activity_js_1.appendGlobalEvents)(kanbanDir, events, prev, snapshot, options?.changedFiles || []);
    }
    snapshot.recentEvents = prev?.recentEvents || [];
    return snapshot;
}
function loadPreviousSnapshot(kanbanDir) {
    const p = path.join(kanbanDir, 'backlog.json');
    if (!fs.existsSync(p))
        return null;
    try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
    catch {
        return null;
    }
}
function detectChangedTaskIds(prev, next) {
    if (!prev)
        return Object.keys(next.tasks);
    const ids = new Set([...Object.keys(prev.tasks), ...Object.keys(next.tasks)]);
    const changed = [];
    for (const id of ids) {
        const a = prev.tasks[id];
        const b = next.tasks[id];
        if (!a || !b) {
            changed.push(id);
            continue;
        }
        if (a.title !== b.title ||
            a.status !== b.status ||
            a.column !== b.column ||
            a.lastUpdated !== b.lastUpdated) {
            changed.push(id);
        }
    }
    return changed;
}
function syncBacklog(agenticSdlcDir, changedFiles) {
    const kanbanDir = path.join(agenticSdlcDir, 'kanban');
    const config = readKanbanConfig(kanbanDir);
    if (!config) {
        throw new Error(`Missing .kanban-config.json in ${kanbanDir}`);
    }
    const prev = loadPreviousSnapshot(kanbanDir);
    const snapshot = compileBacklog(agenticSdlcDir, config, {
        changedFiles,
        prevSnapshot: prev,
    });
    if (!fs.existsSync(kanbanDir)) {
        fs.mkdirSync(kanbanDir, { recursive: true });
    }
    fs.writeFileSync(path.join(kanbanDir, 'backlog.json'), JSON.stringify(snapshot, null, 2));
    return snapshot;
}
function getAgenticSdlcDir(appDir) {
    return path.join(appDir, 'agentic-sdlc');
}
/** Resolve project root for Kanban CLI when --appDir is omitted. */
function detectAppDirForCli(explicitAppDir) {
    if (explicitAppDir) {
        return path.resolve(explicitAppDir);
    }
    const kanbanCandidates = [];
    const cwdKanban = process.cwd();
    if (fs.existsSync(path.join(cwdKanban, '.kanban-config.json'))) {
        kanbanCandidates.push(cwdKanban);
    }
    const scriptKanban = path.join(__dirname, '..');
    if (fs.existsSync(path.join(scriptKanban, '.kanban-config.json'))) {
        kanbanCandidates.push(scriptKanban);
    }
    const nestedKanban = path.join(process.cwd(), 'agentic-sdlc', 'kanban');
    if (fs.existsSync(path.join(nestedKanban, '.kanban-config.json'))) {
        kanbanCandidates.push(nestedKanban);
    }
    for (const kanbanDir of kanbanCandidates) {
        const config = readKanbanConfig(kanbanDir);
        if (config?.appDir) {
            return path.resolve(config.appDir);
        }
    }
    return process.cwd();
}
