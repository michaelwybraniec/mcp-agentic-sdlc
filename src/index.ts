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
          STEP 2: Create the complete Agentic SDLC project structure with README.md, ASDLC.md, and AWP.md files. 
          This tool requires the project details collected from the 'base' tool. 
          Use this ONLY IF the 'base' tool has been called.
          Use this ONLY IF you have collected user requirements.`,
        inputSchema: {
          type: "object",
          properties: {
            appDir: {
              type: "string",
              description: "Directory where to create the agentic-sldc folder (defaults to current directory)",
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

**Workflow:** base → collect answers → init → project created

Please provide your answers to these 4 questions.`,
        },
      ],
    };
  }

  if (name === "init") {
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

    const targetDir = path.join(appDir, 'agentic-sldc');
    const readmePath = path.join(targetDir, 'README.md');
    const asdlcPath = path.join(targetDir, 'ASDLC.md');
    const awpPath = path.join(targetDir, 'AWP.md');

    try {
      // Ensure target directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Create README.md
      const readmeTemplate = `# 🚀 Welcome to Your Agentic SDLC Project

Hello!  
This project is powered by the [OVERVIBING.COM](https://overvibing.com) community.  
We work together—humans and AI agents—to build a better, more collaborative, and transparent future for software development.

Authored by [ONE-FRONT.COM](https://one-front.com)

---

## 🌟 What is Agentic SDLC?

Agentic SDLC (Software Development Lifecycle) is a modern, collaborative approach to building software, where both humans and AI agents work together at every stage.  
It emphasizes clarity, traceability, and continuous improvement, ensuring that all contributors—human or AI—are always in sync.

---

## 🧠 What is the Agentic Workflow Protocol (AWP)?

AWP is a protocol and template for managing project tasks, ownership, and progress.  
It provides a clear structure for onboarding, collaboration, and handoff between humans and AI agents, making your project future-proof and easy to maintain.

---

## 📂 Project Structure

- 'README.md' - This file. Project overview, philosophy, and quickstart.
- 'ASDLC.md' - Agentic SDLC plan and lifecycle documentation.
- 'AWP.md' - Agentic Workflow Protocol template for your project.
- 'src/' - Source code for your project.
- 'agentic-sldc/' - Generated folder for SDLC and workflow docs.

---

## �� Getting Started

1. Read through this README.md to understand the project's philosophy.
2. Review ASDLC.md for the lifecycle plan and key milestones.
3. Fill out AWP.md to define your workflow, roles, and steps.
4. Sync with your team and AI agents - keep docs and code up to date!
5. Use the commit standard (see AWP.md) for all changes.

---

## 🤖 Human + AI Collaboration

- Clear roles: Both humans and AI agents have defined responsibilities.
- Transparent workflow: Every step, handoff, and decision is documented.
- Continuous improvement: Regularly review and update docs and code.

---

## 💡 Best Practices

- Keep README.md, ASDLC.md, and AWP.md in sync with your codebase.
- Reference step numbers in every commit message.
- Use the procedures in AWP.md for updates, commits, and handoffs.
- Encourage feedback and document blockers or suggestions.

---

## 🌐 Learn More

- https://overvibing.com - Community, resources, and more.
- https://one-front.com - Authorship and project leadership.

---

Happy building!  
_The OVERVIBING.COM & ONE-FRONT.COM Team_
`;
      fs.writeFileSync(readmePath, readmeTemplate);
      
      // Create ASDLC.md
      fs.writeFileSync(asdlcPath, 'Work in progres - overvibing.com\n');
      
      // Ensure all inputs are arrays
      const goalArray = Array.isArray(goal) ? goal : [goal];
      const overviewArray = Array.isArray(overview) ? overview : [overview];
      const technologyArray = Array.isArray(technology) ? technology : [technology];
      const outcomeArray = Array.isArray(outcome) ? outcome : [outcome];
      
      // Create AWP.md with populated content
      const awpTemplate = `# Agentic Workflow Protocol (AWP)

## Hard instructions for AI agents

1. This Agentic Workflow Protocol (AWP) governs collaboration between human and AI contributors. The following principles must always be followed:

    1.1. All work is guided strictly by the AWP; no deviations or improvisation.

    1.2. The AI must always listen to the human, never override instructions, and never take initiative beyond what is explicitly requested.

    1.3. Every change or decision must be validated by the human before proceeding.

    1.4. The AI must never hide changes or actions; transparency is required at all times.

    1.5. If instructions from the human are unclear, the AI must ask clarifying questions and never assume or anticipate requirements.

    1.6. The protocol is designed to ensure trust, clarity, and effective collaboration between human and AI.

    1.7. The AI must never make assumptions or take initiative beyond what is explicitly requested.

    1.8. Always use the commit standard for all changes.

    1.9. Never override the human's instructions, or any content in this AWP.

    1.10. Use numbers to reference changes in this AWP. Format 1.1, 1.2, 1.3, etc.

    1.11. Never use the word "AI" in any commit message.

    1.12 Read this AWP.md and if exists the main README.md to understand the workflow and project goal.

    1.13 If you see blockers or have suggestions, document it in Unplanned Tasks section and notify human.

    1.14 Always respect human oversight and approval gates
    
    1.15. Never make critical business decisions without human approval

    1.16. Always document your reasoning and decisions

    1.17. Follow the commit standard and reference step numbers

    1.18. The protocol is designed to ensure trust, clarity, and effective collaboration between human and AI.

    
## Author

Michael Wybraniec (ONE-FRONT.COM, OVERVIBING.COM)

## Goal

${goalArray.map((g: string, index: number) => `${index + 1}. ${g}`).join('\n')}

## Overview

${overviewArray.map((phase: string, index: number) => `${index + 1}. ${phase}`).join('\n')}

## Technology

${technologyArray.map((tech: string, index: number) => `${index + 1}. ${tech}`).join('\n')}

## Outcome

${outcomeArray.map((o: string, index: number) => `${index + 1}. ${o}`).join('\n')}

## Collaboration

- **ai_agent_senior_developer:**  Senior Developer (AI Agent)
- **ai_agent_junior_developer:**  Junior Developer (AI Agent)
- **ai_agent_designer:**  Designer (AI Agent)
- **ai_agent_tester:**  Tester (AI Agent)
- **ai_agent_documentation:**  Documentation (AI Agent)
- **ai_agent_project_manager:**  Project Manager (AI Agent)
- **ai_agent_product_owner:**  Product Owner (AI Agent)
- **ai_agent_scrum_master:**  Scrum Master (AI Agent)
- **human_developer:**  Developer (Human)
- **human_designer:**  Designer (Human)
- **human_tester:**  Tester (Human)
- **human_documentation:**  Documentation (Human)
- **human_project_manager:**  Project Manager (Human)
- **human_product_owner:**  Product Owner (Human)
- **human_scrum_master:**  Scrum Master (Human)
- **approver:** Human Only (Human)
- **approval_timeout:**  10 minutes
- **auto_handoff:**  true

## Project Backlog

### 1. Main task, Name, Title, Description, etc.
- [ ] 1.1: Subtask, Name, Title, Description, etc.
- [ ] 1.2: Subtask, Name, Title, Description, etc.

### 2. Main task, Name, Title, Description, etc.
- [ ] 2.1: Subtask, Name, Title, Description, etc.
- [ ] 2.2: Subtask, Name, Title, Description, etc.

### 3. Main task, Name, Title, Description, etc.
- [ ] 3.1: Subtask, Name, Title, Description, etc.

### 4. Main task, Name, Title, Description, etc.
- [ ] 4.1: Subtask, Name, Title, Description, etc.

### 5. Main task, Name, Title, Description, etc.
- [ ] 5.1: Subtask, Name, Title, Description, etc.

## Unplanned Tasks

- [ ] 1.1: Unplanned task, Name, Title, Description, etc.
- [ ] 1.2: Unplanned task, Name, Title, Description, etc.


## Procedures

1. **update**

    1.1. Review README.md and AWP.md after each step.

    1.2. Update README.md to reflect the current state

    1.3. We review AWP.md to understand next actions.

    1.4. Check for blockers, if any we notify humans.

    1.5. Ensure docs and code are aligned, of not, notify humans.

    1.6. If you see blockers or have suggestions, document it in Unplanned Tasks section and notify human.

    1.7. If you see that you are not able to complete the task, notify human.

    1.8. If at the step you were working on something new, unplanned, updating anything, or fixing bug, remember always add it to unplanned tasks section in AWP.md.

2. **commit**

    2.1. Commit changes using the commitStandard.

    2.2. Use the format: type(scope step): subject.

    2.3. Reference the step number in every commit message.

    2.4. Follow conventional commit standards.

    2.5. Include relevant files.

3. **next**

    3.1. Move to the next actionable step only after update and commit are complete.

    3.2. Identify the next actionable step and begin work.

    3.3. Check for blockers before proceeding, and confirm additional plan with human.

    3.4. Mark the current step 'check' [ ] as done before you start.

4. **check**

    4.1. Review AWP.md to determine the current actionable step.

    4.2. Find the first step not done.

    4.3. Restore context and understand what needs to be done.

    4.4. Use this when returning to work after a break or context loss.

5. **handoff**

    5.1. Transfer task ownership between human and AI.

    5.2. Package current context and deliverables.

    5.3. Notify receiving party with clear expectations.

    5.4. Set timeout for response and escalation rules.

## Human Notes
1. Reference the step in every commit.
2. Update this file as the project progresses.
3. Check off each item as you complete it.
4. Respect human-AI collaboration boundaries.

## Commit Standard
- **format:** type(scope step): subject
- **types:** feat, fix, docs, test, chore
- **rules:**
  - Reference the step in every commit.
  - Use imperative mood.
  - Keep messages concise and descriptive.
- **examples:**
  - feat(api 3.1): add API endpoint
  - docs(readme 5.1): expand documentation

## Human Notes

## Unplanned tasks standard
 standard (This is to start measuring what was 'overvibed', it would require some standards)
`;
      fs.writeFileSync(awpPath, awpTemplate);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully created agentic-sldc folder with README.md, ASDLC.md, and AWP.md in ${targetDir}\n\nProject Details:\n- Goal: ${goalArray.join(', ')}\n- Overview: ${overviewArray.join(', ')}\n- Technology: ${technologyArray.join(', ')}\n- Outcome: ${outcomeArray.join(', ')}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating agentic-sldc folder: ${error.message}`,
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