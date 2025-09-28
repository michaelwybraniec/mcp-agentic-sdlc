#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

// Helper function to create project backlog content using template resource
function createProjectBacklog(goals: string[], overview: string[], technology: string[], outcome: string[]): string {
  // Read the backlog template to understand the structure
  const templatePath = path.join(__dirname, "resources/project-backlog-template.md");
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Create task links based on the overview phases
  const taskLinks = overview.map((phase, index) => {
    const taskId = index + 1;
    const taskTitle = phase.replace(/^\d+\.\s*/, ''); // Remove leading numbers
    return `- [ ] [Task ${taskId}: ${taskTitle}](tasks/planned/task-${taskId}.md)`;
  }).join('\n');

  // Generate backlog following the template structure
  const backlogContent = `# Project Backlog

## Planned Tasks

${taskLinks}

## Unplanned Tasks

*No unplanned tasks yet*

## Completed Tasks

*No completed tasks yet*

---

**Project Goals:** ${goals.join(', ')}
**Technology Stack:** ${technology.join(', ')}
**Success Criteria:** ${outcome.join(', ')}`;
  
  return backlogContent;
}

// Helper function to create initial task files using backlog-recipe.md as guide
function createInitialTasks(plannedDir: string, goals: string[], overview: string[], technology: string[], outcome: string[]): void {
  // Read the backlog recipe to understand how to create tasks
  const recipePath = path.join(__dirname, "recipes/backlog-recipe.md");
  const recipe = fs.readFileSync(recipePath, 'utf8');
  
  // The recipe instructs the LLM to create tasks based on the collected project information
  // Following the recipe's guidance: "Use AI to convert text descriptions into Markdown task files automatically"
  // and "AI can suggest task slicing or sub-tasks if description is large"
  
  // Create tasks based on the overview phases provided by the user
  // The recipe says to break tasks into smaller subtasks and use explicit dependencies
  
  let taskCounter = 1;
  const tasks: string[] = [];
  
  // Create tasks based on the overview phases
  overview.forEach((phase, index) => {
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
[ ] Pending / [x] Completed`;
    
    tasks.push(task);
    fs.writeFileSync(path.join(plannedDir, `task-${taskId}.md`), task);
    taskCounter++;
  });
}

/**
 * Create MCP server with the init tool
 */
const server = new Server(
  {
    name: "mcp-agentic-sdlc",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "base",
        description: `
          STEP 1: Collect project requirements by asking the user 4 essential questions. 
          This tool starts the Agentic SDLC project setup process. 
          Use this FIRST to gather project information before creating any files.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "init",
        description: `
          STEP 2: Create the complete Agentic SDLC project structure with README.md, ASDLC.md, AWP.md files, and project backlog. 
          This tool requires the project details collected from the 'base' tool. 
          Use this ONLY IF the 'base' tool has been called.
          Use this ONLY IF you have collected user requirements.
          IMPORTANT: Specify the appDir parameter to indicate where to create the agentic-sdlc folder.`,
        inputSchema: {
          type: "object",
          properties: {
            appDir: {
              type: "string",
              description: "Directory where to create the agentic-sdlc folder (defaults to current directory)",
            },
            goal: {
              type: "array",
              items: { type: "string" },
              description: "Project objectives from user",
            },
            overview: {
              type: "array",
              items: { type: "string" },
              description: "Project phases from user",
            },
            technology: {
              type: "array",
              items: { type: "string" },
              description: "Technologies from user",
            },
            outcome: {
              type: "array",
              items: { type: "string" },
              description: "Success criteria from user",
            },
          },
          required: ["goal", "overview", "technology", "outcome"],
        },
      },
      {
        name: "get_backlog_template",
        description: `
          Get the project backlog template resource for creating project-specific backlogs.
          This provides the template structure and guidance for backlog creation.
          Use this when you need to understand how to structure project backlogs.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "base") {
    return {
      content: [
        {
          type: "text",
          text: `🚀 **Agentic SDLC Project Setup - STEP 1: Requirements Collection**

I need to collect 4 essential pieces of information to set up your Agentic SDLC project:

**Please answer these questions:**

1. **What are the main objectives?** - What do you want to achieve with this project?
2. **What are the main phases?** - What are the key development phases or milestones?
3. **What technologies?** - What technologies, frameworks, or tools will you use?
4. **What does success look like?** - How will you know the project is successful?

**Next Step:**
After you provide all 4 answers, I will use the 'init' tool to create your complete project structure with:
- README.md (project overview and philosophy)
- ASDLC.md (Agentic SDLC lifecycle plan)
- AWP.md (Agentic Workflow Protocol template)
- tasks/ directory with project backlog and individual task files

**Workflow:** base → collect answers → init → project created
**Important:** The init tool will create the agentic-sdlc folder in your current working directory.

Please provide your answers to these 4 questions.`,
        },
      ],
    };
  }

  if (name === "get_backlog_template") {
    try {
      const templatePath = path.join(__dirname, "resources/project-backlog-template.md");
      const template = fs.readFileSync(templatePath, 'utf8');
      
      return {
        content: [
          {
            type: "text",
            text: `# Project Backlog Template Resource

This is the template resource for creating project backlogs using the Agentic SDLC methodology.

${template}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading backlog template: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (name === "init") {
    // Use the appDir parameter if provided, otherwise use current working directory
    // The client should specify the correct directory where they want the project created
    const appDir = (args?.appDir as string) || process.cwd();
    const goal = args?.goal;
    const overview = args?.overview;
    const technology = args?.technology;
    const outcome = args?.outcome;

    if (!goal || !overview || !technology || !outcome) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: You must ask the user for project details first!\n\n1. What are the main objectives?\n2. What are the main phases?\n3. What technologies?\n4. What does success look like?",
          },
        ],
        isError: true,
      };
    }

    const targetDir = path.join(appDir, 'agentic-sdlc');
    const readmePath = path.join(targetDir, 'README.md');
    const asdlcPath = path.join(targetDir, 'ASDLC.md');
    const awpPath = path.join(targetDir, 'AWP.md');
    const tasksDir = path.join(targetDir, 'tasks');
    const plannedDir = path.join(tasksDir, 'planned');
    const unplannedDir = path.join(tasksDir, 'unplanned');
    const completedDir = path.join(tasksDir, 'completed');
    const projectBacklogPath = path.join(tasksDir, 'project-backlog.md');

    try {
      // Create directory structure
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      if (!fs.existsSync(tasksDir)) {
        fs.mkdirSync(tasksDir, { recursive: true });
      }
      if (!fs.existsSync(plannedDir)) {
        fs.mkdirSync(plannedDir, { recursive: true });
      }
      if (!fs.existsSync(unplannedDir)) {
        fs.mkdirSync(unplannedDir, { recursive: true });
      }
      if (!fs.existsSync(completedDir)) {
        fs.mkdirSync(completedDir, { recursive: true });
      }
      const readmeTemplate = fs.readFileSync(path.join(__dirname, "templates/readme_template.md"));
      fs.writeFileSync(readmePath, readmeTemplate);
      fs.copyFileSync(path.join(__dirname, "templates/commitStandard.md"), path.join(targetDir, 'commitStandard.md'))
      fs.writeFileSync(asdlcPath, 'Work in progres - overvibing.com\n');
      const goalArray = Array.isArray(goal) ? goal : [goal];
      const overviewArray = Array.isArray(overview) ? overview : [overview];
      const technologyArray = Array.isArray(technology) ? technology : [technology];
      const outcomeArray = Array.isArray(outcome) ? outcome : [outcome];

      // Create initial project backlog based on the collected information
      const backlogContent = createProjectBacklog(goalArray, overviewArray, technologyArray, outcomeArray);
      fs.writeFileSync(projectBacklogPath, backlogContent);

      // Create initial task files based on the backlog
      createInitialTasks(plannedDir, goalArray, overviewArray, technologyArray, outcomeArray);

      // Create AWP.md with populated content and backlog reference
      const joinArr = (arr: Array<string>) => arr.map((e: string, index: number) => `${index + 1}. ${e}`).join('\n')
      const awpTemplate = fs.readFileSync(path.join(__dirname, "templates/AWP_template.md"))
        .toString()
        .replace("PLACEHOLDER_GOAL", joinArr(goalArray))
        .replace("PLACEHOLDER_OVERVIEW", joinArr(overviewArray))
        .replace("PLACEHOLDER_TECHNOLOGY", joinArr(technologyArray))
        .replace("PLACEHOLDER_OUTCOME", joinArr(outcomeArray))
        .replace("## Project Backlog\n\n### 1. Main task, Name, Title, Description, etc.\n- [ ] 1.1: Subtask, Name, Title, Description, etc.\n- [ ] 1.2: Subtask, Name, Title, Description, etc.\n\n### 2. Main task, Name, Title, Description, etc.\n- [ ] 2.1: Subtask, Name, Title, Description, etc.\n- [ ] 2.2: Subtask, Name, Title, Description, etc.\n\n### 3. Main task, Name, Title, Description, etc.\n- [ ] 3.1: Subtask, Name, Title, Description, etc.\n\n### 4. Main task, Name, Title, Description, etc.\n- [ ] 4.1: Subtask, Name, Title, Description, etc.\n\n### 5. Main task, Name, Title, Description, etc.\n- [ ] 5.1: Subtask, Name, Title, Description, etc.", "## Project Backlog\n\nSee [Project Backlog](tasks/project-backlog.md) for detailed task breakdown and individual task files.");
      fs.writeFileSync(awpPath, awpTemplate);

      return {
        content: [
          {
            type: "text",
            text: `Successfully created agentic-sdlc folder with complete project structure in ${targetDir}\n\nCreated:\n- README.md\n- commitStandard.md\n- ASDLC.md\n- AWP.md\n- tasks/project-backlog.md\n- tasks/planned/ (with initial task files)\n- tasks/unplanned/ (empty)\n- tasks/completed/ (empty)\n\nProject Details:\n- Goal: ${goalArray.join(', ')}\n- Overview: ${overviewArray.join(', ')}\n- Technology: ${technologyArray.join(', ')}\n- Outcome: ${outcomeArray.join(', ')}\n\nThe project backlog has been created using the backlog-recipe.md methodology.`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating agentic-sdlc folder: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Agentic SDLC MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
}); 
