import * as fs from 'fs';
import * as path from 'path';
import { parseBaseMd } from './parseBaseMd.js';
import {
  appendGlobalEvents,
  contractChangeEvent,
  diffTasks,
  mergeTaskActivity,
  taskIdsFromChangedFiles,
} from './activity.js';
import { parseTaskMd, peek } from './parser.js';
import { resolveTaskColumn, validateTaskBoard, applyInProgressInference, inferActiveTaskId } from './taskStatus.js';
import { loadAgentCommits, taskIdFromCommitSubject } from './gitCommits.js';
import { BacklogSnapshot, KanbanConfig, TaskCard, TaskColumn } from './types.js';

export function readKanbanConfig(kanbanDir: string): KanbanConfig | null {
  const configPath = path.join(kanbanDir, '.kanban-config.json');
  if (!fs.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8')) as KanbanConfig;
  } catch {
    return null;
  }
}

export function writeKanbanConfig(kanbanDir: string, config: KanbanConfig): void {
  fs.writeFileSync(path.join(kanbanDir, '.kanban-config.json'), JSON.stringify(config, null, 2));
}

/** Resolve user project root from config, env, or fallback cwd. */
export function resolveAppDir(config: KanbanConfig | null, fallback?: string): string {
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

export interface KanbanContext {
  appDir: string;
  kanbanDir: string;
  config: KanbanConfig;
}

/** Locate kanban config from explicit dir, cwd, or AGENTIC_SDLC_APP_DIR. */
export function discoverKanbanContext(baseDir?: string): KanbanContext | null {
  const candidates: string[] = [];
  if (baseDir) candidates.push(path.resolve(baseDir));
  candidates.push(process.cwd());
  if (process.env.AGENTIC_SDLC_APP_DIR) {
    candidates.push(path.resolve(process.env.AGENTIC_SDLC_APP_DIR));
  }

  const seen = new Set<string>();
  for (const candidate of candidates) {
    if (seen.has(candidate)) continue;
    seen.add(candidate);

    const kanbanDir = path.join(getAgenticSdlcDir(candidate), 'kanban');
    const config = readKanbanConfig(kanbanDir);
    if (!config) continue;

    const appDir = resolveAppDir(config, candidate);
    return {
      appDir,
      kanbanDir: path.join(getAgenticSdlcDir(appDir), 'kanban'),
      config: { ...config, appDir },
    };
  }
  return null;
}

function resolveColumn(folder: string, status: string): TaskColumn {
  return resolveTaskColumn(folder, status);
}

function buildSummary(parsed: Record<string, unknown>, projectType: string): BacklogSnapshot['summary'] {
  const summary: BacklogSnapshot['summary'] = {
    problem: '',
    goals: [],
    technologies: [],
    phases: (parsed.phases as string[]) || [],
    successCriteria: [],
  };

  if (projectType === 'mvp') {
    const cvp = parsed.mvpCoreValueProposition as { problem?: string } | undefined;
    summary.problem = cvp?.problem || '';
    summary.goals = (parsed.mvpFeatures as string[]) || [];
    summary.technologies = (parsed.mvpTech as string[]) || [];
    summary.successCriteria = (parsed.mvpSuccessCriteria as string[]) || [];
  } else if (projectType === 'poc') {
    const cc = parsed.pocCoreConcept as { hypothesis?: string } | undefined;
    summary.problem = cc?.hypothesis || '';
    summary.goals = (parsed.pocProofPoints as string[]) || [];
    summary.technologies = (parsed.pocTech as string[]) || [];
    summary.successCriteria = (parsed.pocSuccessCriteria as string[]) || [];
  } else {
    summary.goals = (parsed.proObjectives as string[]) || [];
    summary.technologies = (parsed.proTech as string[]) || [];
    summary.successCriteria = (parsed.proSuccessCriteria as string[]) || [];
  }

  return summary;
}

function readTasksFromFolder(
  tasksDir: string,
  folder: string,
  sourcePathPrefix: string,
  warnings: string[]
): TaskCard[] {
  const dir = path.join(tasksDir, folder);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f.startsWith('task-'));
  const cards: TaskCard[] = [];

  for (const file of files.sort()) {
    const abs = path.join(dir, file);
    const content = fs.readFileSync(abs, 'utf8');
    const parsed = parseTaskMd(content, file);
    const stat = fs.statSync(abs);
    const relSource = path.join(sourcePathPrefix, 'tasks', folder, file).replace(/\\/g, '/');
    const column = resolveColumn(folder, parsed.status);

    if (folder === 'planned' && parsed.status === 'completed') {
      warnings.push(
        `Task ${parsed.id}: Completed status in planned/ — move to tasks/completed/ when done`
      );
    }

    if (folder === 'completed' && parsed.status !== 'completed') {
      warnings.push(
        `Task ${parsed.id}: in completed/ but # Status is not [x] Completed — update header`
      );
    }

    const card: TaskCard = {
      id: parsed.id,
      title: parsed.title,
      status: parsed.status,
      column,
      priority: parsed.priority,
      owner: parsed.owner,
      description: parsed.description,
      descriptionPeek: peek(parsed.description),
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

export function compileBacklog(
  agenticSdlcDir: string,
  config: KanbanConfig,
  options?: { changedFiles?: string[]; prevSnapshot?: BacklogSnapshot | null }
): BacklogSnapshot {
  const kanbanDir = path.join(agenticSdlcDir, 'kanban');
  const backlogDir = path.join(agenticSdlcDir, config.backlogPath);
  const warnings: string[] = [];
  const sourcePathPrefix = config.backlogPath.replace(/\\/g, '/');

  const basePath = path.join(backlogDir, 'base.md');
  let contract = {
    title: 'AWP Project Foundation Agreement',
    path: path.join(sourcePathPrefix, 'base.md').replace(/\\/g, '/'),
    lastUpdated: '',
    content: '',
  };

  let summary: BacklogSnapshot['summary'] = {
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
    const parsed = parseBaseMd(baseContent, config.projectType);
    summary = buildSummary(parsed, config.projectType);
  } else {
    warnings.push(`base.md not found at ${basePath}`);
  }

  const tasksDir = path.join(backlogDir, 'tasks');
  const unplanned = readTasksFromFolder(tasksDir, 'unplanned', sourcePathPrefix, warnings);
  const plannedRaw = readTasksFromFolder(tasksDir, 'planned', sourcePathPrefix, warnings);
  const completed = readTasksFromFolder(tasksDir, 'completed', sourcePathPrefix, warnings);

  const planned = plannedRaw.filter((t) => t.column === 'planned');
  const inProgress = plannedRaw.filter((t) => t.column === 'inProgress');

  const tasks: Record<string, TaskCard> = {};
  for (const list of [unplanned, planned, inProgress, completed]) {
    for (const t of list) {
      tasks[t.id] = t;
    }
  }

  const snapshot: BacklogSnapshot = {
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
    boardHealth: validateTaskBoard({ tasks, columns: { unplanned, planned, inProgress, completed } }),
    _warnings: warnings,
  };

  snapshot._warnings = [...warnings, ...snapshot.boardHealth.warnings];

  const appDir = config.appDir ? path.resolve(config.appDir) : '';
  if (appDir) {
    const latest = loadAgentCommits(appDir, 1)[0];
    let inferredId = latest ? taskIdFromCommitSubject(latest.subject) : '';
    if (!inferredId || !snapshot.tasks[inferredId]) {
      inferredId = inferActiveTaskId(snapshot) || '';
    }
    if (inferredId && applyInProgressInference(snapshot, inferredId)) {
      snapshot._warnings.push(
        `Task ${inferredId} shown In Progress (inferred) — call backlog_sync with startTaskId: "${inferredId}" to persist`
      );
      snapshot.boardHealth = validateTaskBoard(snapshot);
    }
  }

  const prev = options?.prevSnapshot ?? loadPreviousSnapshot(kanbanDir);
  const changedTaskIds = options?.changedFiles?.length
    ? taskIdsFromChangedFiles(options.changedFiles)
    : detectChangedTaskIds(prev, snapshot);

  const contractChanged = options?.changedFiles?.some(
    (f) => path.basename(f).toLowerCase() === 'base.md'
  );

  if (changedTaskIds.length > 0 || !prev || contractChanged) {
    const { events, messages } = diffTasks(prev, snapshot, changedTaskIds);
    if (contractChanged && prev) {
      events.unshift(contractChangeEvent());
    }
    for (const id of Object.keys(tasks)) {
      const t = tasks[id];
      const diffMsg = messages.get(id);
      t.activity = mergeTaskActivity(t, t.activity.map((a) => a.message), diffMsg);
      t.activityPeek =
        t.activity.find((a) => a.at)?.message ||
        t.activity[t.activity.length - 1]?.message ||
        t.activityPeek;
    }
    return appendGlobalEvents(
      kanbanDir,
      events,
      prev,
      snapshot,
      options?.changedFiles || []
    );
  }

  snapshot.recentEvents = prev?.recentEvents || [];
  return snapshot;
}

function loadPreviousSnapshot(kanbanDir: string): BacklogSnapshot | null {
  const p = path.join(kanbanDir, 'backlog.json');
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8')) as BacklogSnapshot;
  } catch {
    return null;
  }
}

function detectChangedTaskIds(prev: BacklogSnapshot | null, next: BacklogSnapshot): string[] {
  if (!prev) return Object.keys(next.tasks);
  const ids = new Set([...Object.keys(prev.tasks), ...Object.keys(next.tasks)]);
  const changed: string[] = [];
  for (const id of ids) {
    const a = prev.tasks[id];
    const b = next.tasks[id];
    if (!a || !b) {
      changed.push(id);
      continue;
    }
    if (
      a.title !== b.title ||
      a.status !== b.status ||
      a.column !== b.column ||
      a.lastUpdated !== b.lastUpdated ||
      a.sourcePath !== b.sourcePath
    ) {
      changed.push(id);
    }
  }
  return changed;
}

export function syncBacklog(agenticSdlcDir: string, changedFiles?: string[]): BacklogSnapshot {
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

export function getAgenticSdlcDir(appDir: string): string {
  return path.join(appDir, 'agentic-sdlc');
}

/** Resolve project root for Kanban CLI when --appDir is omitted. */
export function detectAppDirForCli(explicitAppDir?: string): string {
  if (explicitAppDir) {
    return path.resolve(explicitAppDir);
  }

  const kanbanCandidates: string[] = [];

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
