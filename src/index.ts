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

    const targetDir = path.join(appDir, 'agentic-sdlc');
    const readmePath = path.join(targetDir, 'README.md');
    const asdlcPath = path.join(targetDir, 'ASDLC.md');
    const awpPath = path.join(targetDir, 'AWP.md');

    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const readmeTemplate = fs.readFileSync(path.join(__dirname, "templates/readme_template.md"));
      fs.writeFileSync(readmePath, readmeTemplate);
      fs.copyFileSync(path.join(__dirname, "templates/commitStandard.md"), path.join(targetDir, 'commitStandard.md'))
      fs.writeFileSync(asdlcPath, 'Work in progres - overvibing.com\n');
      const goalArray = Array.isArray(goal) ? goal : [goal];
      const overviewArray = Array.isArray(overview) ? overview : [overview];
      const technologyArray = Array.isArray(technology) ? technology : [technology];
      const outcomeArray = Array.isArray(outcome) ? outcome : [outcome];

      // Create AWP.md with populated content
      const joinArr = (arr: Array<string>) => arr.map((e: string, index: number) => `${index + 1}. ${e}`).join('\n')
      const awpTemplate = fs.readFileSync("./templates/AWP_template.md")
        .toString()
        .replace("PLACEHOLDER_GOAL", joinArr(goalArray))
        .replace("PLACEHOLDER_OVERVIEW", joinArr(overviewArray))
        .replace("PLACEHOLDER_TECHNOLOGY", joinArr(technologyArray))
        .replace("PLACEHOLDER_OUTCOME", joinArr(outcomeArray));
      fs.writeFileSync(awpPath, awpTemplate);

      return {
        content: [
          {
            type: "text",
            text: `Successfully created agentic-sdlc folder with README.md, commitStandard.yaml, ASDLC.md, and AWP.md in ${targetDir}\n\nProject Details:\n- Goal: ${goalArray.join(', ')}\n- Overview: ${overviewArray.join(', ')}\n- Technology: ${technologyArray.join(', ')}\n- Outcome: ${outcomeArray.join(', ')}`,
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
