import * as fs from 'fs';
import * as path from 'path';

// Recipe metadata map - used by both tool handlers and resource URI handlers
export const recipeMap: Record<string, { file: string; title: string; description: string; uri: string; displayName: string }> = {
    'get_pro_backlog_recipe': {
      file: 'pro-backlog-recipe.md',
      title: 'Pro Backlog Recipe Resource',
      description: 'This is the complete pro backlog recipe for creating project backlogs using the Agentic SDLC methodology.',
      uri: 'recipe://pro-backlog-recipe',
      displayName: 'Pro Backlog Recipe',
    },
    'get_pro_requirements_recipe': {
      file: 'pro-requirements-recipe.md',
      title: 'Pro Requirements Recipe Resource',
      description: 'This is the complete pro requirements recipe for creating and structuring project requirements documents using the Agentic SDLC methodology.',
      uri: 'recipe://pro-requirements-recipe',
      displayName: 'Pro Requirements Recipe',
    },
    'get_mvp_backlog_recipe': {
      file: 'mvp-backlog-recipe.md',
      title: 'MVP Backlog Recipe Resource',
      description: 'This is the complete MVP backlog recipe for creating MVP-focused project backlogs using the Agentic SDLC methodology.',
      uri: 'recipe://mvp-backlog-recipe',
      displayName: 'MVP Backlog Recipe',
    },
    'get_mvp_requirements_recipe': {
      file: 'mvp-requirements-recipe.md',
      title: 'MVP Requirements Recipe Resource',
      description: 'This is the complete MVP requirements recipe for creating MVP requirements documents using the Agentic SDLC methodology.',
      uri: 'recipe://mvp-requirements-recipe',
      displayName: 'MVP Requirements Recipe',
    },
    'get_poc_backlog_recipe': {
      file: 'poc-backlog-recipe.md',
      title: 'POC Backlog Recipe Resource',
      description: 'This is the complete POC backlog recipe for creating POC-focused project backlogs using the Agentic SDLC methodology.',
      uri: 'recipe://poc-backlog-recipe',
      displayName: 'POC Backlog Recipe',
    },
    'get_poc_requirements_recipe': {
      file: 'poc-requirements-recipe.md',
      title: 'POC Requirements Recipe Resource',
      description: 'This is the complete POC requirements recipe for creating POC requirements documents using the Agentic SDLC methodology.',
      uri: 'recipe://poc-requirements-recipe',
      displayName: 'POC Requirements Recipe',
    },
    'get_pro_tech_specs_recipe': {
      file: 'pro-tech-specs-recipe.md',
      title: 'Pro Tech Specs Recipe Resource',
      description: 'This is the complete pro tech specs recipe for creating and structuring full technical specifications using the Agentic SDLC methodology.',
      uri: 'recipe://pro-tech-specs-recipe',
      displayName: 'Pro Tech Specs Recipe',
    },
    'get_mvp_tech_specs_recipe': {
      file: 'mvp-tech-specs-recipe.md',
      title: 'MVP Tech Specs Recipe Resource',
      description: 'This is the complete MVP tech specs recipe for creating MVP technical specifications using the Agentic SDLC methodology.',
      uri: 'recipe://mvp-tech-specs-recipe',
      displayName: 'MVP Tech Specs Recipe',
    },
    'get_poc_tech_specs_recipe': {
      file: 'poc-tech-specs-recipe.md',
      title: 'POC Tech Specs Recipe Resource',
      description: 'This is the complete POC tech specs recipe for creating POC technical specifications using the Agentic SDLC methodology.',
      uri: 'recipe://poc-tech-specs-recipe',
      displayName: 'POC Tech Specs Recipe',
    },
    'get_awp_recipe': {
      file: 'awp-recipe.md',
      title: 'AWP Recipe Resource',
      description: 'This is the complete AWP recipe for creating and structuring the Agentic Workflow Protocol (AWP) file using the Agentic SDLC methodology.',
      uri: 'recipe://awp-recipe',
      displayName: 'AWP Recipe',
    },
};

// Handle tool requests (CallToolRequestSchema) for recipe tools
export function handleRecipeResource(name: string): any {
  const recipeInfo = recipeMap[name];
  if (!recipeInfo) {
    return null;
  }

  try {
    const recipePath = path.join(__dirname, "..", "recipes", recipeInfo.file);
    const recipe = fs.readFileSync(recipePath, 'utf8');
    
    return {
      content: [
        {
          type: "text",
          text: `# ${recipeInfo.title}

${recipeInfo.description}

${recipe}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error reading ${recipeInfo.file}: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}

// Handle resource URI requests (ReadResourceRequestSchema)
export function handleRecipeUri(uri: string): any {
  // Find recipe by URI
  const recipeEntry = Object.entries(recipeMap).find(([_, info]) => info.uri === uri);
  
  if (!recipeEntry) {
    return null;
  }

  const recipeInfo = recipeEntry[1];

  try {
    const recipePath = path.join(__dirname, "..", "recipes", recipeInfo.file);
    const recipe = fs.readFileSync(recipePath, 'utf8');
    
    return {
      contents: [
        {
          uri: uri,
          mimeType: "text/markdown",
          text: recipe,
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to read ${recipeInfo.file}: ${error.message}`);
  }
}

// Get list of all recipe resources (for ListResourcesRequestSchema)
export function getRecipeResources(): Array<{ uri: string; name: string; description: string; mimeType: string }> {
  return Object.values(recipeMap).map(recipe => ({
    uri: recipe.uri,
    name: recipe.displayName,
    description: recipe.description,
    mimeType: "text/markdown",
  }));
}
