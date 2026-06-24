/**
 * Map user.md content onto phase-level tasks and optional subtasks.
 */

export interface TaskPlanningOptions {
  userMdContent?: string;
  goals?: string[];
}

export interface TaskPlanningResult {
  parentCount: number;
  subtaskCount: number;
  usedUserMd: boolean;
  comprehensiveUserMd: boolean;
}

export function stripUserMdHeader(userMd: string): string {
  const idx = userMd.indexOf('\n---\n');
  if (userMd.startsWith('# User Source Material') && idx !== -1) {
    return userMd.slice(idx + 5).trim();
  }
  return userMd.trim();
}

function normalizeItem(line: string): string {
  return line
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[-*+]\s*/, '')
    .replace(/^\[[ x]\]\s*/i, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
}

/** Extract actionable lines from user.md (bullets, numbered lists). */
export function extractWorkItems(userMd: string): string[] {
  const body = stripUserMdHeader(userMd);
  const items: string[] = [];
  const seen = new Set<string>();
  let currentSection = '';

  const add = (raw: string, section?: string) => {
    const t = normalizeItem(raw);
    if (t.length < 8 || t.length > 600) return;
    const key = t.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const prefix = section && !t.toLowerCase().includes(section.toLowerCase().slice(0, 12))
      ? `${section}: `
      : '';
    items.push(prefix + t);
  };

  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const heading = trimmed.match(/^#{1,3}\s+(.+)/);
    if (heading) {
      currentSection = heading[1].replace(/[#*]/g, '').trim();
      continue;
    }
    if (/^[-*+]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      add(trimmed, currentSection || undefined);
    }
  }

  return items.slice(0, 48);
}

export function isComprehensiveUserMd(userMd: string): boolean {
  const body = stripUserMdHeader(userMd);
  const words = body.split(/\s+/).filter(Boolean).length;
  const items = extractWorkItems(userMd);
  return words >= 120 || items.length >= 5;
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function scoreItemForPhase(item: string, phaseTitle: string, goals: string[]): number {
  const itemTokens = tokenize(item);
  const phaseTokens = tokenize(phaseTitle);
  let score = 0;
  for (const t of itemTokens) {
    if (phaseTokens.has(t)) score += 2;
  }
  for (const g of goals) {
    for (const t of tokenize(g)) {
      if (itemTokens.has(t)) score += 1;
    }
  }
  return score;
}

/** Assign user work items to phase indices (0-based). */
export function assignItemsToPhases(
  items: string[],
  phases: string[],
  goals: string[] = []
): Map<number, string[]> {
  const map = new Map<number, string[]>();
  for (let i = 0; i < phases.length; i++) map.set(i, []);

  if (!items.length || !phases.length) return map;

  for (const item of items) {
    let bestIdx = 0;
    let bestScore = -1;
    for (let i = 0; i < phases.length; i++) {
      const title = phases[i].replace(/^\d+\.\s*/, '');
      const s = scoreItemForPhase(item, title, goals);
      if (s > bestScore) {
        bestScore = s;
        bestIdx = i;
      }
    }
    if (bestScore === 0 && phases.length > 1) {
      const shortest = map.get(0)!;
      let minLen = shortest.length;
      bestIdx = 0;
      for (let i = 1; i < phases.length; i++) {
        const len = map.get(i)!.length;
        if (len < minLen) {
          minLen = len;
          bestIdx = i;
        }
      }
    }
    map.get(bestIdx)!.push(item);
  }

  return map;
}

export function titleFromItem(item: string, maxLen = 72): string {
  const first = item.split(/[.!?\n]/)[0]?.trim() || item;
  if (first.length <= maxLen) return first;
  return first.slice(0, maxLen - 1) + '…';
}

export function criteriaFromItem(item: string): string {
  return `- [ ] ${item}`;
}
