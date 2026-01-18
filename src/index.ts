#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import modules
import { handleBaseTool } from './tools/base.js';
import { handleRecommendTool } from './tools/recommend.js';
import { handleInitTool } from './tools/init.js';
import { handleRecipeResource, handleRecipeUri, getRecipeResources } from './resources/recipes.js';

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
      resources: {},
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
          STEP 1: Collect project requirements and create base.md agreement file.
          
          MODE 1 (Questions): Call with no parameters to get the list of questions to ask the user.
          
          MODE 2 (Create base.md): After collecting all answers through conversation, call with all parameters to create base.md file.
          
          This tool starts the Agentic SDLC project setup process. 
          Use this FIRST to gather project information and create the foundation agreement (base.md).
          
          Workflow:
          1. Call base tool (no params) → Get questions
          2. Discuss with user → Collect all answers
          3. Call base tool (with all params) → Creates base.md file
          4. Then proceed to init tool`,
        inputSchema: {
          type: "object",
          properties: {
            appDir: {
              type: "string",
              description: "Directory where to create the agentic-sdlc folder (required when creating base.md)",
            },
            backlogName: {
              type: "string",
              description: "Name for the backlog directory (required when creating base.md)",
            },
            projectType: {
              type: "string",
              description: "Project type: 'mvp', 'poc', or 'pro' (required when creating base.md)",
            },
            // MVP-specific parameters
            mvpCoreValueProposition: {
              type: "object",
              description: "MVP Core Value Proposition: {problem, primaryUser, coreUserJourney}",
            },
            mvpEssentialFeatures: {
              type: "array",
              items: { type: "string" },
              description: "Essential MVP Features",
            },
            mvpOutOfScope: {
              type: "array",
              items: { type: "string" },
              description: "Out of MVP Scope",
            },
            mvpSuccessCriteria: {
              type: "array",
              items: { type: "string" },
              description: "MVP Success Criteria",
            },
            mvpNonFunctionalRequirements: {
              type: "array",
              items: { type: "string" },
              description: "MVP Non-Functional Requirements",
            },
            mvpTechnologies: {
              type: "array",
              items: { type: "string" },
              description: "MVP Technologies",
            },
            mvpArchitectureApproach: {
              type: "string",
              description: "MVP Architecture Approach",
            },
            mvpDataModels: {
              type: "string",
              description: "MVP Data Models",
            },
            mvpPhases: {
              type: "array",
              items: { type: "string" },
              description: "MVP Phases",
            },
            // POC-specific parameters
            pocCoreConcept: {
              type: "object",
              description: "POC Core Concept: {hypothesis, technicalFeasibility}",
            },
            pocEssentialProofPoints: {
              type: "array",
              items: { type: "string" },
              description: "POC Essential Proof Points",
            },
            pocOutOfScope: {
              type: "array",
              items: { type: "string" },
              description: "Out of POC Scope",
            },
            pocSuccessCriteria: {
              type: "array",
              items: { type: "string" },
              description: "POC Success Criteria",
            },
            pocTechnologies: {
              type: "array",
              items: { type: "string" },
              description: "POC Technologies",
            },
            pocArchitectureApproach: {
              type: "string",
              description: "POC Architecture Approach",
            },
            pocPhases: {
              type: "array",
              items: { type: "string" },
              description: "POC Phases",
            },
            // Pro-specific parameters
            proCoreObjectives: {
              type: "array",
              items: { type: "string" },
              description: "Pro Core Objectives",
            },
            proTargetUsers: {
              type: "array",
              items: { type: "string" },
              description: "Pro Target Users",
            },
            proFunctionalRequirements: {
              type: "array",
              items: { type: "string" },
              description: "Pro Functional Requirements",
            },
            proNonFunctionalRequirements: {
              type: "array",
              items: { type: "string" },
              description: "Pro Non-Functional Requirements",
            },
            proOutOfScope: {
              type: "array",
              items: { type: "string" },
              description: "Pro Out of Scope",
            },
            proTechnologies: {
              type: "array",
              items: { type: "string" },
              description: "Pro Technologies",
            },
            proArchitectureApproach: {
              type: "string",
              description: "Pro Architecture Approach",
            },
            proDataModels: {
              type: "string",
              description: "Pro Data Models",
            },
            proPhases: {
              type: "array",
              items: { type: "string" },
              description: "Pro Phases",
            },
          },
        },
      },
      {
        name: "init",
        description: `
          STEP 2: Create requirements.md, backlog.md, tech-specs.md, and tasks/ using recipe methodology.
          
          This tool:
          1. Reads base.md (created by base tool)
          2. Reads full recipes (methodology sections 1-8, not just templates)
          3. Uses recipe methodology to ensure all questions are answered
          4. Validates completeness
          5. Generates files using recipe templates (section 9)
          6. Creates tasks/ directory
          
          Use this ONLY AFTER base.md has been created and reviewed.
          IMPORTANT: Specify the appDir parameter to indicate where the agentic-sdlc folder is located.`,
        inputSchema: {
          type: "object",
          properties: {
            appDir: {
              type: "string",
              description: "Directory where to create the agentic-sdlc folder (defaults to current directory)",
            },
            backlogName: {
              type: "string",
              description: "Name for the backlog directory (e.g., 'ecommerce', 'crm')",
            },
            projectType: {
              type: "string",
              description: "Project type: 'mvp', 'poc', or 'pro'",
            },
            // MVP-specific parameters
            mvpCoreValueProposition: {
              type: "object",
              description: "MVP Core Value Proposition: problem, primary user, core user journey",
              properties: {
                problem: { type: "string" },
                primaryUser: { type: "string" },
                coreUserJourney: { type: "string" },
              },
            },
            mvpEssentialFeatures: {
              type: "array",
              items: { type: "string" },
              description: "Essential MVP features (only core value delivery)",
            },
            mvpOutOfScope: {
              type: "array",
              items: { type: "string" },
              description: "Features explicitly excluded from MVP",
            },
            mvpSuccessCriteria: {
              type: "array",
              items: { type: "string" },
              description: "Measurable conditions for MVP success",
            },
            mvpNonFunctionalRequirements: {
              type: "array",
              items: { type: "string" },
              description: "Quality attributes and constraints for MVP",
            },
            mvpTechnologies: {
              type: "array",
              items: { type: "string" },
              description: "Technologies, frameworks, or tools for MVP",
            },
            mvpArchitectureApproach: {
              type: "string",
              description: "Architecture pattern and key design decisions for MVP",
            },
            mvpDataModels: {
              type: "string",
              description: "Core data structures/entities and key data relationships",
            },
            mvpPhases: {
              type: "array",
              items: { type: "string" },
              description: "Key development phases for MVP delivery",
            },
            // POC-specific parameters
            pocCoreConcept: {
              type: "object",
              description: "POC Core Concept: hypothesis and technical feasibility to prove",
              properties: {
                hypothesis: { type: "string" },
                technicalFeasibility: { type: "string" },
              },
            },
            pocEssentialProofPoints: {
              type: "array",
              items: { type: "string" },
              description: "Requirements necessary to prove the concept works",
            },
            pocOutOfScope: {
              type: "array",
              items: { type: "string" },
              description: "Features explicitly excluded from POC",
            },
            pocSuccessCriteria: {
              type: "array",
              items: { type: "string" },
              description: "Measurable conditions for POC success",
            },
            pocTechnologies: {
              type: "array",
              items: { type: "string" },
              description: "Technologies, frameworks, or tools for POC",
            },
            pocArchitectureApproach: {
              type: "string",
              description: "Simplified architecture pattern and key design decisions for POC",
            },
            pocPhases: {
              type: "array",
              items: { type: "string" },
              description: "Key phases to demonstrate proof",
            },
            // Pro-specific parameters
            proCoreObjectives: {
              type: "array",
              items: { type: "string" },
              description: "Main goals the project must achieve",
            },
            proTargetUsers: {
              type: "array",
              items: { type: "string" },
              description: "Who will use or benefit from the system",
            },
            proFunctionalRequirements: {
              type: "array",
              items: { type: "string" },
              description: "Main functional capabilities the system must provide",
            },
            proNonFunctionalRequirements: {
              type: "array",
              items: { type: "string" },
              description: "Quality attributes and constraints",
            },
            proOutOfScope: {
              type: "array",
              items: { type: "string" },
              description: "Features or capabilities explicitly excluded",
            },
            proTechnologies: {
              type: "array",
              items: { type: "string" },
              description: "Technologies, frameworks, or tools for the project",
            },
            proArchitectureApproach: {
              type: "string",
              description: "Architecture pattern and key design decisions",
            },
            proDataModels: {
              type: "string",
              description: "Core data structures/entities and key data relationships",
            },
            proPhases: {
              type: "array",
              items: { type: "string" },
              description: "Key development phases or milestones",
            },
          },
          required: ["backlogName", "projectType"],
        },
      },
      {
        name: "recommend",
        description: `
          Generate AI recommendations for missing project elements when user responds "I don't know" or "AI".
          
          This tool:
          1. Takes foundational information already collected
          2. Takes a list of missing elements
          3. Generates intelligent recommendations based on project type and best practices
          4. Returns recommendations for user review before proceeding with init
          
          Use this when the user doesn't know answers to specific questions during the base tool workflow.`,
        inputSchema: {
          type: "object",
          properties: {
            projectType: {
              type: "string",
              description: "Project type: 'mvp', 'poc', or 'pro'",
            },
            backlogName: {
              type: "string",
              description: "Name for the backlog directory",
            },
            foundationalInfo: {
              type: "object",
              description: "Foundational information already collected (e.g., core value proposition, problem statement)",
            },
            missingElements: {
              type: "object",
              description: "Object containing missing elements that need recommendations (e.g., {mvpEssentialFeatures: true, mvpTechnologies: true})",
            },
          },
          required: ["projectType", "backlogName", "foundationalInfo", "missingElements"],
        },
      },
      {
        name: "get_pro_backlog_recipe",
        description: `
          Get the pro backlog recipe resource for creating project-specific backlogs.
          This provides the complete methodology and guidance for backlog creation.
          Use this when you need to understand how to structure and create project backlogs.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_pro_requirements_recipe",
        description: `
          Get the pro requirements recipe resource for creating and structuring project requirements documents.
          This provides the complete methodology and guidance for requirements documentation.
          Use this when you need to understand how to structure and create requirements documents.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_mvp_backlog_recipe",
        description: `
          Get the MVP backlog recipe resource for creating MVP-focused project backlogs.
          This provides the complete methodology and guidance for MVP backlog creation.
          Use this when you need to understand how to structure and create MVP backlogs.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_mvp_requirements_recipe",
        description: `
          Get the MVP requirements recipe resource for creating MVP requirements documents.
          This provides the complete methodology and guidance for MVP requirements documentation.
          Use this when you need to understand how to structure and create MVP requirements.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_poc_backlog_recipe",
        description: `
          Get the POC backlog recipe resource for creating POC-focused project backlogs.
          This provides the complete methodology and guidance for POC backlog creation.
          Use this when you need to understand how to structure and create POC backlogs.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_poc_requirements_recipe",
        description: `
          Get the POC requirements recipe resource for creating POC requirements documents.
          This provides the complete methodology and guidance for POC requirements documentation.
          Use this when you need to understand how to structure and create POC requirements.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_pro_tech_specs_recipe",
        description: `
          Get the pro tech specs recipe resource for creating and structuring full technical specifications.
          This provides the complete methodology and guidance for full technical specification documentation.
          Use this when you need to understand how to create full technical specifications.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_mvp_tech_specs_recipe",
        description: `
          Get the MVP tech specs recipe resource for creating MVP technical specifications.
          This provides the complete methodology and guidance for MVP technical specification documentation.
          Use this when you need to understand how to create MVP technical specifications.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_poc_tech_specs_recipe",
        description: `
          Get the POC tech specs recipe resource for creating POC technical specifications.
          This provides the complete methodology and guidance for POC technical specification documentation.
          Use this when you need to understand how to create POC technical specifications.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_awp_recipe",
        description: `
          Get the AWP recipe resource for creating and structuring the Agentic Workflow Protocol (AWP) file.
          This provides the complete methodology and guidance for AWP file creation.
          Use this when you need to understand how to structure and create AWP.md files.`,
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: getRecipeResources(),
  };
});

// Handle resource requests
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  // Handle recipe URIs
  if (uri.startsWith("recipe://")) {
    const result = handleRecipeUri(uri);
    if (result) {
      return result;
    }
  }
  
  throw new Error(`Unknown resource: ${uri}`);
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "base") {
    return handleBaseTool(args || {});
  }

  // Recipe resource handlers (tools)
  const recipeHandlers = [
    'get_pro_backlog_recipe',
    'get_pro_requirements_recipe',
    'get_mvp_backlog_recipe',
    'get_mvp_requirements_recipe',
    'get_poc_backlog_recipe',
    'get_poc_requirements_recipe',
    'get_pro_tech_specs_recipe',
    'get_mvp_tech_specs_recipe',
    'get_poc_tech_specs_recipe',
    'get_awp_recipe',
  ];
  
  if (recipeHandlers.includes(name)) {
    const result = handleRecipeResource(name);
    if (result) return result;
  }

  if (name === "recommend") {
    return handleRecommendTool(args || {});
  }

  if (name === "init") {
    return handleInitTool(args || {});
  }

      return {
        content: [
          {
            type: "text",
        text: `ERROR: Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
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
