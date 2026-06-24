import * as fs from 'fs';
import * as path from 'path';

export { parseBaseMd } from '../backlog/parseBaseMd.js';

// Helper function to extract template section from recipe
export function extractTemplateFromRecipe(recipeContent: string): string | null {
  // Look for "Template Section" heading (can be any section number)
  const templateMatch = recipeContent.match(/##\s+\d+\.\s+Template Section\s+\[FOR FILE GENERATION\]/);
  if (!templateMatch) return null;
  
  const templateStart = templateMatch.index!;
  const codeBlockStart = recipeContent.indexOf('```markdown', templateStart);
  if (codeBlockStart === -1) return null;
  
  const codeBlockEnd = recipeContent.indexOf('```', codeBlockStart + 11);
  if (codeBlockEnd === -1) return null;
  
  return recipeContent.substring(codeBlockStart + 11, codeBlockEnd).trim();
}

// Helper function to populate template with data
export function populateTemplate(template: string, placeholders: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// Helper function to create project backlog content using recipe template
export function createProjectBacklog(goals: string[], overview: string[], technology: string[], outcome: string[], projectType: string = 'pro'): string {
  // Read the type-specific backlog recipe
  const recipeFileName = `${projectType}-backlog-recipe.md`;
  const recipePath = path.join(__dirname, "..", "recipes", recipeFileName);
  
  try {
    const recipe = fs.readFileSync(recipePath, 'utf8');
    const template = extractTemplateFromRecipe(recipe);
  
    if (template) {
      // Create task links based on the overview phases
      const taskLinks = overview.map((phase: string, index: number) => {
        const taskId = index + 1;
        const taskTitle = phase.replace(/^\d+\.\s*/, ''); // Remove leading numbers
        return `- [ ] [Task ${taskId}: ${taskTitle}](tasks/planned/task-${taskId}.0.md)`;
      }).join('\n');

      return populateTemplate(template, {
        'TASK_LINKS': taskLinks,
        'GOALS_LIST': goals.join(', '),
        'TECHNOLOGY_LIST': technology.join(', '),
        'OUTCOME_LIST': outcome.join(', '),
      });
    }
  } catch (error: any) {
    // Fallback to hardcoded template on error
  }
  
  // Fallback to hardcoded template if recipe template not found
  const taskLinks = overview.map((phase: string, index: number) => {
    const taskId = index + 1;
    const taskTitle = phase.replace(/^\d+\.\s*/, '');
    return `- [ ] [Task ${taskId}: ${taskTitle}](tasks/planned/task-${taskId}.0.md)`;
  }).join('\n');

  return `# Project Backlog

## Planned Tasks

${taskLinks}

## Unplanned Tasks

*No unplanned tasks yet*

## Completed Tasks

*No completed tasks yet*

---

**Project Goals:** ${goals.join(', ')}
**Technology Stack:** ${technology.join(', ')}
**Success Criteria:** ${outcome.join(', ')}
**Location:** This backlog is located at \`backlog-<name>/<type>/backlog.md\``;
}

// Helper function to create initial task files using type-specific backlog recipe as guide
export function createInitialTasks(plannedDir: string, goals: string[], overview: string[], technology: string[], outcome: string[], projectType: string = 'pro'): void {
  const recipeFileName = `${projectType}-backlog-recipe.md`;
  const recipePath = path.join(__dirname, "..", "recipes", recipeFileName);
  fs.readFileSync(recipePath, 'utf8');

  let taskCounter = 1;

  overview.forEach((phase: string, index: number) => {
    const taskId = `${taskCounter}.0`;
    const taskTitle = phase.replace(/^\d+\.\s*/, '');
    const prevId = taskCounter === 1 ? null : `${taskCounter - 1}.0`;

    const acceptanceCriteria = buildAcceptanceCriteria(
      taskTitle,
      phase,
      index,
      overview.length,
      outcome,
      projectType
    );

    const task = `# Task ID: ${taskId}
# Title: ${taskTitle}
# Status: [ ] Pending
# Priority: ${index === 0 ? 'high' : index === overview.length - 1 ? 'medium' : 'high'}
# Owner: Dev Team
# Estimated Effort: ${index === 0 ? '4h' : index === overview.length - 1 ? '3h' : '6h'}
${projectType === 'poc' ? '# POC Scope: POC\n' : ''}
## Description
${phase} — This phase focuses on achieving the project goals: ${goals.join(', ')}. Technology stack: ${technology.join(', ')}.

## Dependencies
${prevId ? `- [ ] Task ID: ${prevId}` : '- None'}

## Testing Instructions
Verify that this phase meets the requirements and contributes to the success criteria: ${outcome.join(', ')}

## Security Review
Apply appropriate security measures for this phase

## Risk Assessment
Delays in this phase may impact overall project timeline

## Acceptance Criteria
${acceptanceCriteria}

## Definition of Done
- [ ] All acceptance criteria above are met
- [ ] Basic testing completed for this phase
- [ ] Changes committed with AWP commit standard referencing task ${taskId}

## Strengths
Essential for achieving project goals and success criteria

## Notes
Phase ${index + 1} of ${overview.length}: ${phase}

## Sub-tasks
- [ ] Analyze requirements for this phase
- [ ] Implement core functionality
- [ ] Test and validate implementation
- [ ] Document phase completion

## Activity
- ${new Date().toISOString().slice(0, 16).replace('T', ' ')} — Task created

## Completed
[ ] Pending`;

    fs.writeFileSync(path.join(plannedDir, `task-${taskId}.md`), task);
    taskCounter++;
  });
}

function buildAcceptanceCriteria(
  taskTitle: string,
  phase: string,
  index: number,
  totalPhases: number,
  outcome: string[],
  projectType: string
): string {
  const proof =
    projectType === 'poc'
      ? 'Concept is demonstrable (proof-of-concept, not production-hardened)'
      : 'Feature works as specified for this phase';

  const lines = [
    `- [ ] ${taskTitle}: deliverable for this phase is implemented`,
    `- [ ] ${proof}`,
    `- [ ] Dev build runs without errors introduced by this phase`,
    `- [ ] Testing instructions for this phase pass`,
  ];

  if (index > 0) {
    lines.push(`- [ ] Integrates with prior phase(s) without regressions`);
  }
  if (outcome.length > 0) {
    lines.push(`- [ ] Contributes to success criteria: ${outcome[0]}`);
  }
  if (index === totalPhases - 1) {
    lines.push(`- [ ] End-to-end flow for ${phase.replace(/^\d+\.\s*/, '')} is demonstrable`);
  }

  return lines.join('\n');
}

export interface UserSourceInput {
  userSource?: string;
  userSourceFile?: string;
  appDir: string;
}

const ROOT_MD_EXCLUDE = new Set([
  'readme.md',
  'changelog.md',
  'license.md',
  'contributing.md',
  'awp.md',
  'asdlc.md',
]);

/** Ranked list of likely user brief files at project root (relative paths). */
export function discoverUserSourceFileCandidates(appDir: string): string[] {
  if (!fs.existsSync(appDir)) return [];

  const rootMd: string[] = [];
  for (const entry of fs.readdirSync(appDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    if (ROOT_MD_EXCLUDE.has(entry.name.toLowerCase())) continue;
    if (entry.name.startsWith('.')) continue;
    rootMd.push(entry.name);
  }

  if (rootMd.length === 0) return [];

  const score = (name: string): number => {
    const lower = name.toLowerCase();
    if (/^idea\d*\.md$/.test(lower)) return 0;
    if (/^idea.*\.md$/.test(lower)) return 1;
    if (/^brief.*\.md$/.test(lower)) return 2;
    if (/^concept.*\.md$/.test(lower)) return 3;
    if (/^proposal.*\.md$/.test(lower)) return 4;
    return 10;
  };

  return rootMd.sort((a, b) => {
    const diff = score(a) - score(b);
    return diff !== 0 ? diff : a.localeCompare(b);
  });
}

export function discoverUserSourceFile(appDir: string): string | undefined {
  return discoverUserSourceFileCandidates(appDir)[0];
}

export function resolveUserSourceContent(input: UserSourceInput): {
  content: string;
  sourceFile?: string;
  warnings: string[];
  autoDetected?: boolean;
} {
  const warnings: string[] = [];
  const parts: string[] = [];
  let sourceFile: string | undefined;
  let autoDetected = false;

  const effectiveFile =
    input.userSourceFile || (!input.userSource?.trim() ? discoverUserSourceFile(input.appDir) : undefined);

  if (effectiveFile && !input.userSourceFile) {
    autoDetected = true;
  }

  if (effectiveFile) {
    const filePath = path.resolve(input.appDir, effectiveFile);
    if (fs.existsSync(filePath)) {
      parts.push(fs.readFileSync(filePath, 'utf8'));
      sourceFile = effectiveFile;
      if (autoDetected) {
        warnings.push(`Auto-detected user source from repo file: ${effectiveFile}`);
      }
    } else if (input.userSourceFile) {
      warnings.push(`userSourceFile not found: ${input.userSourceFile}`);
    }
  }

  if (input.userSource?.trim()) {
    if (parts.length > 0) {
      parts.push(`\n\n---\n\n## User message\n\n${input.userSource.trim()}`);
    } else {
      parts.push(input.userSource.trim());
    }
  }

  if (parts.length === 0) {
    warnings.push(
      'No userSource or userSourceFile provided, and no user brief file found in project root — user.md was not created'
    );
    return { content: '', warnings };
  }

  return { content: parts.join(''), sourceFile, warnings, autoDetected };
}

export function createUserMd(options: {
  content: string;
  sourceFile?: string;
  capturedAt?: string;
}): string {
  const capturedAt = options.capturedAt ?? new Date().toISOString();
  let header = `# User Source Material

Preserved before base.md was created. base.md is the structured AWP agreement; this file is the raw user input.

**Captured:** ${capturedAt}
`;
  if (options.sourceFile) {
    header += `**Source file:** ${options.sourceFile}\n`;
  }
  header += '\n---\n\n';
  return header + options.content;
}
