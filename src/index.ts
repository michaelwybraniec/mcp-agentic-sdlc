#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Create MCP server with the init_sldc tool
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
        name: "init_sldc",
        description: "Creates 'agentic-sldc' folder in the app directory with a README.md",
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

  if (name === "init_sldc") {
    const appDir = (args?.appDir as string) || process.cwd();
    const targetDir = path.join(appDir, 'agentic-sldc');
    const readmePath = path.join(targetDir, 'README.md');

    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(readmePath, 'Hello from ONE-FRONT\n');
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully created agentic-sldc/README.md in ${targetDir}`,
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