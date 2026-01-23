import * as fs from 'fs';
import * as path from 'path';

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
  // Read the type-specific backlog recipe to understand how to create tasks
  const recipeFileName = `${projectType}-backlog-recipe.md`;
  const recipePath = path.join(__dirname, "..", "recipes", recipeFileName);
  const recipe = fs.readFileSync(recipePath, 'utf8');
  
  // The recipe instructs the LLM to create tasks based on the collected project information
  // Following the recipe's guidance: "Use AI to convert text descriptions into Markdown task files automatically"
  // and "AI can suggest task slicing or sub-tasks if description is large"
  
  // Create tasks based on the overview phases provided by the user
  // The recipe says to break tasks into smaller subtasks and use explicit dependencies
  
  let taskCounter = 1;
  const tasks: string[] = [];
  
  // Create tasks based on the overview phases
  overview.forEach((phase: string, index: number) => {
    const taskId = taskCounter;
    const taskTitle = phase.replace(/^\d+\.\s*/, ''); // Remove leading numbers
    
    const task = `# Task ID: ${taskId}
# Title: ${taskTitle}
# Status: [ ] Pending
# Priority: ${index === 0 ? 'high' : index === overview.length - 1 ? 'medium' : 'high'}
# Owner: Dev Team
# Estimated Effort: ${index === 0 ? '4h' : index === overview.length - 1 ? '3h' : '6h'}

## Description
${phase} - This phase focuses on achieving the project goals: ${goals.join(', ')}. Technology stack: ${technology.join(', ')}.

## Dependencies
${taskId === 1 ? '- None' : `- [ ] Task ID: ${taskId - 1}`}

## Testing Instructions
Verify that this phase meets the requirements and contributes to the success criteria: ${outcome.join(', ')}

## Security Review
Apply appropriate security measures for this phase

## Risk Assessment
Delays in this phase may impact overall project timeline

## Strengths
Essential for achieving project goals and success criteria

## Notes
Phase ${index + 1} of ${overview.length}: ${phase}

## Sub-tasks
- [ ] Analyze requirements for this phase
- [ ] Implement core functionality
- [ ] Test and validate implementation
- [ ] Document phase completion

## Completed
[ ] Pending`;
    
    tasks.push(task);
    // Use .0 suffix for top-level tasks to ensure correct alphabetical sorting
    fs.writeFileSync(path.join(plannedDir, `task-${taskId}.0.md`), task);
    taskCounter++;
  });
}

// Helper function to parse base.md and extract information
export function parseBaseMd(content: string, type: string): any {
  const data: any = {};
  
  if (type === 'mvp') {
    // Parse MVP base.md structure
    const problemMatch = content.match(/\*\*Problem:\*\*\s*(.+?)(?:\n|$)/);
    const primaryUserMatch = content.match(/\*\*Primary User:\*\*\s*(.+?)(?:\n|$)/);
    const coreUserJourneyMatch = content.match(/\*\*Core User Journey:\*\*\s*(.+?)(?:\n|$)/);
    
    if (problemMatch && primaryUserMatch && coreUserJourneyMatch) {
      data.mvpCoreValueProposition = {
        problem: problemMatch[1].trim(),
        primaryUser: primaryUserMatch[1].trim(),
        coreUserJourney: coreUserJourneyMatch[1].trim(),
      };
    }
    
    const featuresMatch = content.match(/##\s+\d+\.\s+Essential MVP Features\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (featuresMatch) {
      data.mvpFeatures = featuresMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const outOfScopeMatch = content.match(/##\s+\d+\.\s+Out of MVP Scope\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (outOfScopeMatch) {
      data.mvpOutOfScope = outOfScopeMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const successMatch = content.match(/##\s+\d+\.\s+MVP Success Criteria\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (successMatch) {
      data.mvpSuccessCriteria = successMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const techMatch = content.match(/##\s+\d+\.\s+Key Technologies\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (techMatch) {
      data.mvpTech = techMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const archMatch = content.match(/##\s+\d+\.\s+Architecture Approach\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (archMatch) {
      data.mvpArchitectureApproach = archMatch[1].trim();
    }
    
    const nonFuncMatch = content.match(/##\s+\d+\.\s+Non-Functional Requirements\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (nonFuncMatch) {
      data.mvpNonFunctional = nonFuncMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const dataModelsMatch = content.match(/##\s+\d+\.\s+Data Models\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (dataModelsMatch) {
      data.mvpDataModels = dataModelsMatch[1].trim();
    }
    
    const phasesMatch = content.match(/##\s+\d+\.\s+Project Phases\s*\(MVP\)\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (phasesMatch) {
      data.phases = phasesMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
  } else if (type === 'poc') {
    // Parse POC base.md structure
    const hypothesisMatch = content.match(/\*\*Hypothesis:\*\*\s*(.+?)(?:\n|$)/);
    const technicalFeasibilityMatch = content.match(/\*\*Technical Feasibility:\*\*\s*(.+?)(?:\n|$)/);
    
    if (hypothesisMatch && technicalFeasibilityMatch) {
      data.pocCoreConcept = {
        hypothesis: hypothesisMatch[1].trim(),
        technicalFeasibility: technicalFeasibilityMatch[1].trim(),
      };
    }
    
    const proofPointsMatch = content.match(/##\s+\d+\.\s+Essential Proof Points\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (proofPointsMatch) {
      data.pocProofPoints = proofPointsMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const outOfScopeMatch = content.match(/##\s+\d+\.\s+Out of POC Scope\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (outOfScopeMatch) {
      data.pocOutOfScope = outOfScopeMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const successMatch = content.match(/##\s+\d+\.\s+POC Success Criteria\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (successMatch) {
      data.pocSuccessCriteria = successMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const techMatch = content.match(/##\s+\d+\.\s+Key Technologies\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (techMatch) {
      data.pocTech = techMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const archMatch = content.match(/##\s+\d+\.\s+Architecture Approach\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (archMatch) {
      data.pocArchitecture = archMatch[1].trim();
    }
    
    const phasesMatch = content.match(/##\s+\d+\.\s+Project Phases\s*\(POC\)\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (phasesMatch) {
      data.phases = phasesMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
  } else if (type === 'pro') {
    // Parse Pro base.md structure
    const objectivesMatch = content.match(/##\s+\d+\.\s+Core Objectives\s*\(User Provided\)\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (objectivesMatch) {
      data.proObjectives = objectivesMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const targetUsersMatch = content.match(/##\s+\d+\.\s+Target Users\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (targetUsersMatch) {
      data.proTargetUsers = targetUsersMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const functionalMatch = content.match(/##\s+\d+\.\s+Functional Requirements\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (functionalMatch) {
      data.proFunctional = functionalMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const nonFuncMatch = content.match(/##\s+\d+\.\s+Non-Functional Requirements\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (nonFuncMatch) {
      data.proNonFunctional = nonFuncMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const outOfScopeMatch = content.match(/##\s+\d+\.\s+Out of Scope\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (outOfScopeMatch) {
      data.proOutOfScope = outOfScopeMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const techMatch = content.match(/##\s+\d+\.\s+Key Technologies\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (techMatch) {
      data.proTech = techMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
    
    const archMatch = content.match(/##\s+\d+\.\s+Architecture Approach\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (archMatch) {
      data.proArchitecture = archMatch[1].trim();
    }
    
    const dataModelsMatch = content.match(/##\s+\d+\.\s+Data Models\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (dataModelsMatch) {
      data.proDataModels = dataModelsMatch[1].trim();
    }
    
    const phasesMatch = content.match(/##\s+\d+\.\s+Project Phases\s*\(PRO\)\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (phasesMatch) {
      data.phases = phasesMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
  }
  
  return data;
}
