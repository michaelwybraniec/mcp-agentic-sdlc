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
        name: "init",
        description: "Creates 'agentic-sldc' folder with README.md, ASDLC.md, and AWP.md",
        inputSchema: {
          type: "object",
          properties: {
            appDir: {
              type: "string",
              description: "Directory where to create the agentic-sldc folder (defaults to current directory)",
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "init") {
    const appDir = (args?.appDir as string) || process.cwd();
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

## 🚦 Getting Started

1. Read through this README.md to understand the project’s philosophy.
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
      
      // Always write the Markdown template for AWP.md
      const awpTemplate = `# Agentic Workflow Protocol (AWP)

## Init

<!-- Onboarding instructions for new contributors or agents -->

## Author

<!-- Your Name (Your Org) -->

## Goal

<!-- What is the main objective of this project? -->

## Overview

<!-- List the main phases or milestones of your project -->
- 
- 
- 
- 
- 

## Outcome

<!-- What does success look like? -->
1. A fully-tested, documented, and production-ready project

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

## Steps

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

## Procedures

### update
<!-- Review README.md and AWP.md after each step. Mark the current step as done. Update docs to reflect the current state and next actions. Check for blockers. Ensure docs and code are aligned. -->

### commit
<!-- Commit changes using the commitStandard. Use the format: type(scope step): subject. Reference the step number in every commit message. Follow conventional commit standards. Include relevant files. -->

### next
<!-- Move to the next actionable step only after update and commit are complete. Identify the next actionable step and begin work. Check for blockers before proceeding. -->

### check
<!-- Review AWP.md to determine the current actionable step. Find the first step not done. Restore context and understand what needs to be done. Use this when returning to work after a break or context loss. -->

### handoff
<!-- Transfer task ownership between human and AI. Package current context and deliverables. Notify receiving party with clear expectations. Set timeout for response and escalation rules. -->

## Notes
- 
- 
- 
- 

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
`;
      fs.writeFileSync(awpPath, awpTemplate);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully created agentic-sldc folder with README.md, ASDLC.md, and AWP.md in ${targetDir}`,
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
  console.error("Agentic SLDC MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
}); 