export type TaskColumn = 'unplanned' | 'planned' | 'inProgress' | 'completed';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type ActivityKind =
  | 'added'
  | 'removed'
  | 'moved'
  | 'status'
  | 'updated'
  | 'sync'
  | 'contract';

export interface ActivityEntry {
  at: string;
  message: string;
  kind?: ActivityKind;
  taskId?: string;
  title?: string;
}

export interface TaskCard {
  id: string;
  title: string;
  status: TaskStatus;
  column: TaskColumn;
  priority: string;
  owner: string;
  description: string;
  descriptionPeek: string;
  dependencies: string[];
  dependencyCount: number;
  acceptanceCriteria: string[];
  notes: string;
  risk: string;
  activity: ActivityEntry[];
  activityPeek: string;
  lastUpdated: string;
  sourcePath: string;
}

export interface KanbanConfig {
  appDir: string;
  backlogPath: string;
  backlogName: string;
  projectType: string;
  port: number;
  disclaimer?: string;
}

export interface BacklogSnapshot {
  meta: {
    name: string;
    type: string;
    generatedAt: string;
    sourcePath: string;
  };
  config: KanbanConfig;
  summary: {
    problem: string;
    goals: string[];
    technologies: string[];
    phases: string[];
    successCriteria: string[];
  };
  contract: {
    title: string;
    path: string;
    lastUpdated: string;
    content: string;
  };
  columns: {
    unplanned: TaskCard[];
    planned: TaskCard[];
    inProgress: TaskCard[];
    completed: TaskCard[];
  };
  tasks: Record<string, TaskCard>;
  recentEvents: Array<{
    at: string;
    taskId: string;
    path: string;
    type: ActivityKind | string;
    kind?: ActivityKind;
    title?: string;
    message?: string;
  }>;
  _warnings: string[];
}

export interface ParsedTaskMd {
  id: string;
  title: string;
  statusRaw: string;
  status: TaskStatus;
  priority: string;
  owner: string;
  description: string;
  dependencies: string[];
  acceptanceCriteria: string[];
  notes: string;
  risk: string;
  activityLines: string[];
}
