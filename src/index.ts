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

// Helper function to create project backlog content using recipe structure
function createProjectBacklog(goals: string[], overview: string[], technology: string[], outcome: string[]): string {
  const backlogContent = `# Project Backlog

## Planned Tasks

### 1. Project Setup and Foundation
- [ ] [Task 1: Project Setup and Foundation](tasks/planned/task-1.md)
- [ ] [Task 1.1: Development Environment Setup](tasks/planned/task-1-1.md)

### 2. Core Implementation
- [ ] [Task 2: Core Implementation](tasks/planned/task-2.md)

### 3. Testing and Quality Assurance
- [ ] [Task 3: Testing and Quality Assurance](tasks/planned/task-3.md)

### 4. Documentation and Deployment
- [ ] [Task 4: Documentation and Deployment](tasks/planned/task-4.md)

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
  
  // Generate tasks based on the collected project information
  // Following the recipe's guidance for task creation
  
  // Task 1: Project Setup and Foundation
  const task1 = `# Task ID: 1
# Title: Project Setup and Foundation
# Status: [ ] Pending
# Priority: high
# Owner: Dev Team
# Estimated Effort: 4h

## Description
Set up the foundational project structure and initial configuration for: ${goals.join(', ')}. This includes repository setup, basic project structure, and initial configuration files.

## Dependencies
- None

## Testing Instructions
Verify project structure is created correctly and basic configuration works

## Security Review
Check repository permissions and initial security configurations

## Risk Assessment
Poor foundation setup may cause issues throughout the project lifecycle

## Strengths
Essential foundation for all subsequent development work

## Notes
Initial project setup phase

## Sub-tasks
- [ ] Create project repository structure
- [ ] Set up basic configuration files
- [ ] Initialize development environment
- [ ] Configure version control

## Completed
[ ] Pending / [x] Completed`;
  
  // Task 1.1: Development Environment Setup
  const task1_1 = `# Task ID: 1.1
# Title: Development Environment Setup
# Status: [ ] Pending
# Priority: high
# Owner: Dev Team
# Estimated Effort: 3h

## Description
Configure development environment with the specified technology stack: ${technology.join(', ')}. Set up build tools, dependencies, and development workflows.

## Dependencies
- [ ] Task ID: 1

## Testing Instructions
Verify all development tools are working and environment is properly configured

## Security Review
Ensure no sensitive information is hardcoded in configuration

## Risk Assessment
Misconfigured environment may block development progress

## Strengths
Enables efficient development workflow with proper tooling

## Notes
Technology stack: ${technology.join(', ')}

## Sub-tasks
- [ ] Install and configure ${technology.join(', ')}
- [ ] Set up build and development tools
- [ ] Configure environment variables
- [ ] Test development workflow

## Completed
[ ] Pending / [x] Completed`;
  
  // Task 2: Core Implementation
  const task2 = `# Task ID: 2
# Title: Core Implementation
# Status: [ ] Pending
# Priority: critical
# Owner: Dev Team
# Estimated Effort: 8h

## Description
Implement the core functionality to achieve project goals: ${goals.join(', ')}. This is the main development phase where the primary features are built.

## Dependencies
- [ ] Task ID: 1.1

## Testing Instructions
Implement comprehensive unit and integration tests for core functionality

## Security Review
Apply security best practices, validate inputs, prevent common vulnerabilities

## Risk Assessment
Core implementation is critical for project success; delays impact entire timeline

## Strengths
Delivers the primary value proposition of the project

## Notes
Main development phase for: ${goals.join(', ')}

## Sub-tasks
- [ ] Design core architecture
- [ ] Implement primary features
- [ ] Add error handling and logging
- [ ] Create comprehensive tests

## Completed
[ ] Pending / [x] Completed`;
  
  // Task 3: Testing and Quality Assurance
  const task3 = `# Task ID: 3
# Title: Testing and Quality Assurance
# Status: [ ] Pending
# Priority: high
# Owner: QA Team
# Estimated Effort: 6h

## Description
Implement comprehensive testing strategy including unit tests, integration tests, and quality assurance processes to ensure project meets success criteria: ${outcome.join(', ')}.

## Dependencies
- [ ] Task ID: 2

## Testing Instructions
Execute full test suite and validate all success criteria are met

## Security Review
Perform security testing and vulnerability assessment

## Risk Assessment
Insufficient testing may lead to production issues and failure to meet success criteria

## Strengths
Ensures project quality and meets defined success criteria

## Notes
Success criteria: ${outcome.join(', ')}

## Sub-tasks
- [ ] Implement unit test suite
- [ ] Create integration tests
- [ ] Perform security testing
- [ ] Validate success criteria

## Completed
[ ] Pending / [x] Completed`;
  
  // Task 4: Documentation and Deployment
  const task4 = `# Task ID: 4
# Title: Documentation and Deployment
# Status: [ ] Pending
# Priority: medium
# Owner: Dev Team
# Estimated Effort: 4h

## Description
Create comprehensive documentation and prepare for deployment. This includes user documentation, technical documentation, and deployment procedures.

## Dependencies
- [ ] Task ID: 3

## Testing Instructions
Verify documentation is complete and deployment procedures work correctly

## Security Review
Ensure deployment procedures follow security best practices

## Risk Assessment
Poor documentation may impact user adoption and maintenance

## Strengths
Enables successful project adoption and long-term maintenance

## Notes
Documentation and deployment preparation

## Sub-tasks
- [ ] Create user documentation
- [ ] Write technical documentation
- [ ] Prepare deployment procedures
- [ ] Test deployment process

## Completed
[ ] Pending / [x] Completed`;
  
  // Write task files following the recipe's structure
  fs.writeFileSync(path.join(plannedDir, 'task-1.md'), task1);
  fs.writeFileSync(path.join(plannedDir, 'task-1-1.md'), task1_1);
  fs.writeFileSync(path.join(plannedDir, 'task-2.md'), task2);
  fs.writeFileSync(path.join(plannedDir, 'task-3.md'), task3);
  fs.writeFileSync(path.join(plannedDir, 'task-4.md'), task4);
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
