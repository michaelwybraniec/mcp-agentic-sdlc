import * as path from 'path';
import { ParsedTaskMd, TaskStatus } from './types.js';

function headerValue(content: string, key: string): string {
  const re = new RegExp(`^#\\s+${key}:\\s*(.+)$`, 'im');
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function sectionContent(content: string, heading: string): string {
  const re = new RegExp(`##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function parseListSection(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
    .map((l) => l.replace(/^-\s*(\[[ x~]\]\s*)?/, '').trim())
    .filter(Boolean);
}

export function isTaskMarkdownFile(filename: string): boolean {
  return /^task-.+\.md$/i.test(path.basename(filename));
}

export function taskIdFromFilename(filename: string): string {
  const base = path.basename(filename, '.md');
  const m = base.match(/^task-(.+)$/i);
  return m ? m[1] : '';
}

export function parseTaskStatus(statusRaw: string): TaskStatus {
  const s = statusRaw.toLowerCase().trim();
  if (!s) return 'pending';
  if (s.includes('[~]') || /\bin[- ]?progress\b/.test(s) || s === 'wip') return 'in_progress';
  if (s.includes('[x]') || /\bcompleted?\b/.test(s) || /\bdone\b/.test(s)) return 'completed';
  return 'pending';
}

export function parseTaskMd(content: string, filePath: string): ParsedTaskMd {
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

export function peek(text: string, max = 80): string {
  const one = text.replace(/\s+/g, ' ').trim();
  if (one.length <= max) return one;
  return one.slice(0, max - 1) + '…';
}
