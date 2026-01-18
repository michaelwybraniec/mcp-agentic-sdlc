import * as fs from 'fs';
import * as path from 'path';
import { extractTemplateFromRecipe, populateTemplate, createProjectBacklog, createInitialTasks, parseBaseMd } from '../utils/helpers.js';

export async function handleInitTool(args: any) {
  // Use the appDir parameter if provided, otherwise use current working directory
  const appDir = (args?.appDir as string) || process.cwd();
  const backlogName = args?.backlogName as string;
  const projectType = (args?.projectType as string)?.toLowerCase();

  if (!backlogName || !projectType) {
    return {
      content: [
        {
          type: "text",
          text: "ERROR: You must provide backlog name and project type!\n\nRequired: backlog name, project type (mvp/poc/pro).\n\nNote: This tool reads base.md (created by base tool) and uses recipe methodology to generate files.",
        },
      ],
    };
  }

  if (!['mvp', 'poc', 'pro'].includes(projectType)) {
    return {
      content: [
        {
          type: "text",
          text: "ERROR: Invalid project type. Must be 'mvp', 'poc', or 'pro'.",
        },
      ],
      isError: true,
    };
  }

  // Check if base.md exists and read it
  const targetDir = path.join(appDir, 'agentic-sdlc');
  const backlogDir = path.join(targetDir, `backlog-${backlogName}`);
  const typeDir = path.join(backlogDir, projectType);
  const basePath = path.join(typeDir, 'base.md');

  if (!fs.existsSync(basePath)) {
    return {
      content: [
        {
          type: "text",
          text: `ERROR: base.md not found at ${basePath}\n\nPlease call the 'base' tool first with all parameters to create base.md before calling init.\n\nThe workflow is:\n1. Call base tool (no params) → Get questions\n2. Discuss with user → Collect all answers\n3. Call base tool (with all params) → Creates base.md\n4. Review base.md\n5. Call init tool → Generates files using recipe methodology`,
        },
      ],
      isError: true,
    };
  }

  // Read base.md to get agreed information
  let baseContent = '';
  try {
    baseContent = fs.readFileSync(basePath, 'utf8');
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `ERROR: Failed to read base.md: ${error.message}`,
        },
      ],
      isError: true,
    };
  }

  // Parse base.md using the helper function
  const parsedData = parseBaseMd(baseContent, projectType);

  // Read full recipes (methodology sections 1-8) - these guide content generation
  const requirementsRecipePath = path.join(__dirname, "..", "recipes", `${projectType}-requirements-recipe.md`);
  const backlogRecipePath = path.join(__dirname, "..", "recipes", `${projectType}-backlog-recipe.md`);
  const techSpecsRecipePath = path.join(__dirname, "..", "recipes", `${projectType}-tech-specs-recipe.md`);

  let requirementsRecipe = '';
  let backlogRecipe = '';
  let techSpecsRecipe = '';

  try {
    requirementsRecipe = fs.readFileSync(requirementsRecipePath, 'utf8');
    backlogRecipe = fs.readFileSync(backlogRecipePath, 'utf8');
    techSpecsRecipe = fs.readFileSync(techSpecsRecipePath, 'utf8');
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `ERROR: Failed to read recipes: ${error.message}\n\nRequired recipes:\n- ${requirementsRecipePath}\n- ${backlogRecipePath}\n- ${techSpecsRecipePath}\n\nThe init tool uses full recipe methodology (sections 1-8) to guide content generation, then templates (section 9) for file structure.`,
        },
      ],
      isError: true,
    };
  }

  // Extract methodology sections (everything before "Template Section")
  // These sections guide how to create content, not just fill templates
  const extractMethodology = (recipe: string): string => {
    const templateMatch = recipe.match(/##\s+\d+\.\s+Template Section\s+\[FOR FILE GENERATION\]/);
    if (templateMatch) {
      return recipe.substring(0, templateMatch.index).trim();
    }
    return recipe; // If no template section, return full recipe
  };

  const requirementsMethodology = extractMethodology(requirementsRecipe);
  const backlogMethodology = extractMethodology(backlogRecipe);
  const techSpecsMethodology = extractMethodology(techSpecsRecipe);

  // Note: The AI agent should have already validated completeness using recipe methodology
  // before calling init. The init tool now uses:
  // 1. base.md (agreed information)
  // 2. Recipe methodology (sections 1-8) - guides content generation
  // 3. Recipe templates (section 9) - provides file structure

  // Extract type-specific parameters from parsed base.md
  let phases: string[] = [];
  let technologies: string[] = [];
  let requirementsContent = '';
  let techSpecsContent = '';
  let backlogContent = '';

  if (projectType === 'mvp') {
    const mvpCoreValue = parsedData.mvpCoreValue || { problem: 'Not specified', primaryUser: 'Not specified', coreUserJourney: 'Not specified' };
    const mvpFeatures = parsedData.mvpFeatures || [];
    const mvpOutOfScope = parsedData.mvpOutOfScope || [];
    const mvpSuccessCriteria = parsedData.mvpSuccessCriteria || [];
    const mvpNonFunctional = parsedData.mvpNonFunctional || [];
    const mvpTech = parsedData.mvpTech || [];
    const mvpArchitecture = parsedData.mvpArchitecture || 'To be defined';
    const mvpDataModels = parsedData.mvpDataModels || 'To be defined';
    phases = parsedData.phases || [];

    if (!mvpCoreValue || !mvpFeatures.length || !mvpTech.length || !phases.length) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: Missing required MVP information in base.md!\n\nRequired: Core Value Proposition, Essential Features, Technologies, and MVP Phases.\n\nPlease review base.md and ensure all sections are complete.",
          },
        ],
        isError: true,
      };
    }

    // Create MVP requirements content using recipe template
    try {
      const recipePath = path.join(__dirname, "..", "recipes", "mvp-requirements-recipe.md");
      const recipe = fs.readFileSync(recipePath, 'utf8');
      const template = extractTemplateFromRecipe(recipe);
      
      if (template) {
        // Prepare placeholder values
        const featuresList = mvpFeatures.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n');
        const functionalRequirementsList = mvpFeatures.map((f: string, i: number) => `### FR-${i + 1}: ${f}\nDescription: ${f}`).join('\n\n');
        const nonFunctionalList = mvpNonFunctional.length > 0 
          ? mvpNonFunctional.map((nfr: string, i: number) => `${i + 1}. ${nfr}`).join('\n') 
          : 'To be defined';
        const outOfScopeList = mvpOutOfScope.length > 0 
          ? mvpOutOfScope.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') 
          : 'None specified';
        const successCriteriaList = mvpSuccessCriteria.length > 0 
          ? mvpSuccessCriteria.map((criteria: string, i: number) => `${i + 1}. ${criteria}`).join('\n') 
          : 'To be defined';
        
        requirementsContent = populateTemplate(template, {
          'PROBLEM': mvpCoreValue.problem || 'Not specified',
          'PRIMARY_USER': mvpCoreValue.primaryUser || 'Not specified',
          'CORE_USER_JOURNEY': mvpCoreValue.coreUserJourney || 'Not specified',
          'FEATURES_LIST': featuresList,
          'FUNCTIONAL_REQUIREMENTS_LIST': functionalRequirementsList,
          'NON_FUNCTIONAL_REQUIREMENTS_LIST': nonFunctionalList,
          'OUT_OF_SCOPE_LIST': outOfScopeList,
          'SUCCESS_CRITERIA_LIST': successCriteriaList,
        });
      } else {
        // Fallback to hardcoded template if recipe template section not found
        requirementsContent = `# MVP Requirements

## MVP Overview

### Core Value Proposition
**Problem:** ${mvpCoreValue.problem || 'Not specified'}
**Primary User:** ${mvpCoreValue.primaryUser || 'Not specified'}
**Core User Journey:** ${mvpCoreValue.coreUserJourney || 'Not specified'}

## MVP Core Objectives
${mvpFeatures.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n')}

## MVP Target Users
${mvpCoreValue.primaryUser || 'Not specified'}

## MVP Functional Requirements
${mvpFeatures.map((f: string, i: number) => `### FR-${i + 1}: ${f}\nDescription: ${f}`).join('\n\n')}

## MVP Non-Functional Requirements
${mvpNonFunctional.length > 0 ? mvpNonFunctional.map((nfr: string, i: number) => `${i + 1}. ${nfr}`).join('\n') : 'To be defined'}

## Out of MVP Scope
${mvpOutOfScope.length > 0 ? mvpOutOfScope.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') : 'None specified'}

## MVP Success Criteria
${mvpSuccessCriteria.length > 0 ? mvpSuccessCriteria.map((criteria: string, i: number) => `${i + 1}. ${criteria}`).join('\n') : 'To be defined'}

## MVP User Flow
${mvpCoreValue.coreUserJourney || 'To be defined'}

---
*Created using mvp-requirements-recipe.md*
`;
      }
    } catch (error: any) {
      // Fallback to hardcoded template on error
      requirementsContent = `# MVP Requirements\n\nError loading template: ${error.message}\n\n*Created using mvp-requirements-recipe.md*\n`;
    }

    // Create MVP tech specs content using recipe template
    try {
      const techSpecsRecipePath = path.join(__dirname, "..", "recipes", "mvp-tech-specs-recipe.md");
      const techSpecsRecipe = fs.readFileSync(techSpecsRecipePath, 'utf8');
      const techSpecsTemplate = extractTemplateFromRecipe(techSpecsRecipe);
      
      if (techSpecsTemplate) {
        const technologyList = mvpTech.map((tech: string, i: number) => `${i + 1}. ${tech}`).join('\n');
        
        techSpecsContent = populateTemplate(techSpecsTemplate, {
          'TECHNOLOGY_LIST': technologyList,
          'ARCHITECTURE_APPROACH': mvpArchitecture || 'To be defined',
          'DATA_MODELS': mvpDataModels || 'To be defined',
        });
      } else {
        // Fallback to hardcoded template
        techSpecsContent = `# MVP Tech Specs

## MVP Technical Context

### Technology Stack
${mvpTech.map((tech: string, i: number) => `${i + 1}. ${tech}`).join('\n')}

### Technology Decisions
${mvpArchitecture || 'To be defined'}

## MVP Implementation Approach

### Architecture Pattern
${mvpArchitecture || 'To be defined'}

### Key Design Decisions
${mvpArchitecture || 'To be defined'}

## MVP Data Models

### Core Data Structures
${mvpDataModels || 'To be defined'}

---
*Created using mvp-tech-specs-recipe.md*
`;
      }
    } catch (error: any) {
      // Fallback to hardcoded template on error
      techSpecsContent = `# MVP Tech Specs\n\nError loading template: ${error.message}\n\n*Created using mvp-tech-specs-recipe.md*\n`;
    }

    // Create MVP backlog
    backlogContent = createProjectBacklog(mvpFeatures, phases, mvpTech, mvpSuccessCriteria, 'mvp');

  } else if (projectType === 'poc') {
    const pocCoreConcept = parsedData.pocCoreConcept || { hypothesis: 'Not specified', technicalFeasibility: 'Not specified' };
    const pocProofPoints = parsedData.pocProofPoints || [];
    const pocOutOfScope = parsedData.pocOutOfScope || [];
    const pocSuccessCriteria = parsedData.pocSuccessCriteria || [];
    const pocTech = parsedData.pocTech || [];
    const pocArchitecture = parsedData.pocArchitecture || 'To be defined';
    phases = parsedData.phases || [];

    if (!pocCoreConcept || !pocProofPoints.length || !pocTech.length || !phases.length) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: Missing required POC information in base.md!\n\nRequired: Core Concept, Essential Proof Points, Technologies, and POC Phases.\n\nPlease review base.md and ensure all sections are complete.",
          },
        ],
        isError: true,
      };
    }

    // Create POC requirements content using recipe template
    try {
      const pocRequirementsRecipePath = path.join(__dirname, "..", "recipes", "poc-requirements-recipe.md");
      const pocRequirementsRecipe = fs.readFileSync(pocRequirementsRecipePath, 'utf8');
      const pocRequirementsTemplate = extractTemplateFromRecipe(pocRequirementsRecipe);
      
      if (pocRequirementsTemplate) {
        const proofPointsList = pocProofPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n');
        const proofPointsDetailedList = pocProofPoints.map((p: string, i: number) => `### PP-${i + 1}: ${p}\nDescription: ${p}`).join('\n\n');
        const outOfScopeList = pocOutOfScope.length > 0 
          ? pocOutOfScope.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') 
          : 'None specified';
        const successCriteriaList = pocSuccessCriteria.length > 0 
          ? pocSuccessCriteria.map((criteria: string, i: number) => `${i + 1}. ${criteria}`).join('\n') 
          : 'To be defined';
        
        requirementsContent = populateTemplate(pocRequirementsTemplate, {
          'HYPOTHESIS': pocCoreConcept.hypothesis || 'Not specified',
          'TECHNICAL_FEASIBILITY': pocCoreConcept.technicalFeasibility || 'Not specified',
          'PROOF_POINTS_LIST': proofPointsList,
          'PROOF_POINTS_DETAILED_LIST': proofPointsDetailedList,
          'OUT_OF_SCOPE_LIST': outOfScopeList,
          'SUCCESS_CRITERIA_LIST': successCriteriaList,
        });
      } else {
        // Fallback to hardcoded template
        requirementsContent = `# POC Requirements

## POC Overview

### Core Concept
**Hypothesis:** ${pocCoreConcept.hypothesis || 'Not specified'}
**Technical Feasibility:** ${pocCoreConcept.technicalFeasibility || 'Not specified'}

## POC Core Objectives
${pocProofPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

## POC Proof Points
${pocProofPoints.map((p: string, i: number) => `### PP-${i + 1}: ${p}\nDescription: ${p}`).join('\n\n')}

## Out of POC Scope
${pocOutOfScope.length > 0 ? pocOutOfScope.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') : 'None specified'}

## POC Success Criteria
${pocSuccessCriteria.length > 0 ? pocSuccessCriteria.map((criteria: string, i: number) => `${i + 1}. ${criteria}`).join('\n') : 'To be defined'}

## POC Proof Flow
To be defined based on proof points.

---
*Created using poc-requirements-recipe.md*
`;
      }
    } catch (error: any) {
      // Fallback to hardcoded template on error
      requirementsContent = `# POC Requirements\n\nError loading template: ${error.message}\n\n*Created using poc-requirements-recipe.md*\n`;
    }

    // Create POC tech specs content using recipe template
    try {
      const pocTechSpecsRecipePath = path.join(__dirname, "..", "recipes", "poc-tech-specs-recipe.md");
      const pocTechSpecsRecipe = fs.readFileSync(pocTechSpecsRecipePath, 'utf8');
      const pocTechSpecsTemplate = extractTemplateFromRecipe(pocTechSpecsRecipe);
      
      if (pocTechSpecsTemplate) {
        const technologyList = pocTech.map((tech: string, i: number) => `${i + 1}. ${tech}`).join('\n');
        
        techSpecsContent = populateTemplate(pocTechSpecsTemplate, {
          'TECHNOLOGY_LIST': technologyList,
          'ARCHITECTURE_APPROACH': pocArchitecture || 'To be defined',
        });
      } else {
        // Fallback to hardcoded template
        techSpecsContent = `# POC Tech Specs

## POC Technical Context

### Technology Stack
${pocTech.map((tech: string, i: number) => `${i + 1}. ${tech}`).join('\n')}

### Technology Decisions
${pocArchitecture || 'To be defined'}

## POC Implementation Approach

### Architecture Pattern
${pocArchitecture || 'To be defined (simplified for proof)'}

### Key Design Decisions
${pocArchitecture || 'To be defined'}

---
*Created using poc-tech-specs-recipe.md*
`;
      }
    } catch (error: any) {
      // Fallback to hardcoded template on error
      techSpecsContent = `# POC Tech Specs\n\nError loading template: ${error.message}\n\n*Created using poc-tech-specs-recipe.md*\n`;
    }

    // Create POC backlog
    backlogContent = createProjectBacklog(pocProofPoints, phases, pocTech, pocSuccessCriteria, 'poc');

  } else if (projectType === 'pro') {
    const proObjectives = parsedData.proObjectives || [];
    const proTargetUsers = parsedData.proTargetUsers || [];
    const proFunctional = parsedData.proFunctional || [];
    const proNonFunctional = parsedData.proNonFunctional || [];
    const proOutOfScope = parsedData.proOutOfScope || [];
    const proTech = parsedData.proTech || [];
    const proArchitecture = parsedData.proArchitecture || 'To be defined';
    const proDataModels = parsedData.proDataModels || 'To be defined';
    phases = parsedData.phases || [];

    if (!proObjectives.length || !proTech.length || !phases.length) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: Missing required Pro information in base.md!\n\nRequired: Core Objectives, Technologies, and Project Phases.\n\nPlease review base.md and ensure all sections are complete.",
          },
        ],
        isError: true,
      };
    }

    // Create Pro requirements content using recipe template
    try {
      const proRequirementsRecipePath = path.join(__dirname, "..", "recipes", "pro-requirements-recipe.md");
      const proRequirementsRecipe = fs.readFileSync(proRequirementsRecipePath, 'utf8');
      const proRequirementsTemplate = extractTemplateFromRecipe(proRequirementsRecipe);
      
      if (proRequirementsTemplate) {
        const coreObjectivesList = proObjectives.map((obj: string, i: number) => `${i + 1}. ${obj}`).join('\n');
        const targetUsersList = proTargetUsers.length > 0 
          ? proTargetUsers.map((user: string, i: number) => `${i + 1}. ${user}`).join('\n') 
          : 'To be defined';
        const functionalRequirementsList = proFunctional.length > 0 
          ? proFunctional.map((fr: string, i: number) => `${i + 1}. ${fr}`).join('\n') 
          : 'To be defined';
        const nonFunctionalList = proNonFunctional.length > 0 
          ? proNonFunctional.map((nfr: string, i: number) => `${i + 1}. ${nfr}`).join('\n') 
          : 'To be defined';
        const outOfScopeList = proOutOfScope.length > 0 
          ? proOutOfScope.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') 
          : 'None specified';
        
        requirementsContent = populateTemplate(proRequirementsTemplate, {
          'CORE_OBJECTIVES_LIST': coreObjectivesList,
          'TARGET_USERS_LIST': targetUsersList,
          'FUNCTIONAL_REQUIREMENTS_LIST': functionalRequirementsList,
          'NON_FUNCTIONAL_REQUIREMENTS_LIST': nonFunctionalList,
          'OUT_OF_SCOPE_LIST': outOfScopeList,
        });
      } else {
        // Fallback to hardcoded template
        requirementsContent = `# Pro Requirements

## Overview

### Project Purpose
To be defined based on core objectives.

## Core Objectives
${proObjectives.map((obj: string, i: number) => `${i + 1}. ${obj}`).join('\n')}

## Target Users
${proTargetUsers.length > 0 ? proTargetUsers.map((user: string, i: number) => `${i + 1}. ${user}`).join('\n') : 'To be defined'}

## Functional Requirements
${proFunctional.length > 0 ? proFunctional.map((fr: string, i: number) => `### FR-${i + 1}: ${fr}\nDescription: ${fr}`).join('\n\n') : 'To be defined'}

## Non-Functional Requirements
${proNonFunctional.length > 0 ? proNonFunctional.map((nfr: string, i: number) => `${i + 1}. ${nfr}`).join('\n') : 'To be defined'}

## Out of Scope
${proOutOfScope.length > 0 ? proOutOfScope.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') : 'None specified'}

## Success Criteria
To be defined.

## Implementation Assumptions
To be defined.

---
*Created using pro-requirements-recipe.md*
`;
      }
    } catch (error: any) {
      // Fallback to hardcoded template on error
      requirementsContent = `# Pro Requirements\n\nError loading template: ${error.message}\n\n*Created using pro-requirements-recipe.md*\n`;
    }

    // Create Pro tech specs content using recipe template
    try {
      const proTechSpecsRecipePath = path.join(__dirname, "..", "recipes", "pro-tech-specs-recipe.md");
      const proTechSpecsRecipe = fs.readFileSync(proTechSpecsRecipePath, 'utf8');
      const proTechSpecsTemplate = extractTemplateFromRecipe(proTechSpecsRecipe);
      
      if (proTechSpecsTemplate) {
        const technologyList = proTech.map((tech: string, i: number) => `${i + 1}. ${tech}`).join('\n');
        
        techSpecsContent = populateTemplate(proTechSpecsTemplate, {
          'TECHNOLOGY_LIST': technologyList,
          'ARCHITECTURE_APPROACH': proArchitecture || 'To be defined',
          'DATA_MODELS': proDataModels || 'To be defined',
        });
      } else {
        // Fallback to hardcoded template
        techSpecsContent = `# Pro Tech Specs

## Technical Context

### Technology Stack
${proTech.map((tech: string, i: number) => `${i + 1}. ${tech}`).join('\n')}

### Technology Decisions
${proArchitecture || 'To be defined'}

## Implementation Approach

### Architecture Pattern
${proArchitecture || 'To be defined'}

### Key Design Decisions
${proArchitecture || 'To be defined'}

## Data Models

### Core Data Structures
${proDataModels || 'To be defined'}

---
*Created using pro-tech-specs-recipe.md*
`;
      }
    } catch (error: any) {
      // Fallback to hardcoded template on error
      techSpecsContent = `# Pro Tech Specs\n\nError loading template: ${error.message}\n\n*Created using pro-tech-specs-recipe.md*\n`;
    }

    // Create Pro backlog
    backlogContent = createProjectBacklog(proObjectives, phases, proTech, [], 'pro');
  }

  // Now create directory structure and files (targetDir, backlogDir, typeDir already defined earlier)
  const tasksDir = path.join(typeDir, 'tasks');
  const plannedDir = path.join(tasksDir, 'planned');
  const unplannedDir = path.join(tasksDir, 'unplanned');
  const completedDir = path.join(tasksDir, 'completed');
  
  const readmePath = path.join(targetDir, 'README.md');
  const asdlcPath = path.join(targetDir, 'ASDLC.md');
  const awpPath = path.join(targetDir, 'AWP.md');
  
  // Type-specific file paths
  const requirementsPath = path.join(typeDir, 'requirements.md');
  const backlogPath = path.join(typeDir, 'backlog.md');
  const techSpecsPath = path.join(typeDir, 'tech-specs.md');
  // base.md already exists (created by base tool), don't overwrite it

  try {
    // Create directory structure
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    if (!fs.existsSync(backlogDir)) {
      fs.mkdirSync(backlogDir, { recursive: true });
    }
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
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
    
    // Create base project files
    const readmeTemplate = fs.readFileSync(path.join(__dirname, "..", "templates", "readme_template.md"));
    fs.writeFileSync(readmePath, readmeTemplate);
    fs.copyFileSync(path.join(__dirname, "..", "templates", "commitStandard.md"), path.join(targetDir, 'commitStandard.md'))
    fs.writeFileSync(asdlcPath, 'Work in progres - overvibing.com\n');
    
    // Write type-specific files with collected information
    // Note: base.md already exists (created by base tool), don't overwrite it
    fs.writeFileSync(requirementsPath, requirementsContent);
    fs.writeFileSync(techSpecsPath, techSpecsContent);
    fs.writeFileSync(backlogPath, backlogContent);

    // Create initial task files based on the phases
    // Use parsed data from base.md
    const featuresForTasks = projectType === 'mvp' 
      ? (parsedData.mvpFeatures || [])
      : projectType === 'poc'
      ? (parsedData.pocProofPoints || [])
      : (parsedData.proObjectives || []);
    
    const techForTasks = projectType === 'mvp'
      ? (parsedData.mvpTech || [])
      : projectType === 'poc'
      ? (parsedData.pocTech || [])
      : (parsedData.proTech || []);
    
    const successForTasks = projectType === 'mvp'
      ? (parsedData.mvpSuccessCriteria || [])
      : projectType === 'poc'
      ? (parsedData.pocSuccessCriteria || [])
      : [];
    
    createInitialTasks(plannedDir, featuresForTasks, phases, techForTasks, successForTasks, projectType);

    // Create AWP.md with populated content and backlog reference using recipe
    const joinArr = (arr: Array<string>) => arr.map((e: string, index: number) => `${index + 1}. ${e}`).join('\n');
    const awpRecipePath = path.join(__dirname, "..", "recipes", "awp-recipe.md");
    const awpRecipe = fs.readFileSync(awpRecipePath, 'utf8');
    const awpTemplate = extractTemplateFromRecipe(awpRecipe);
    
    if (!awpTemplate) {
      throw new Error('Failed to extract AWP template from awp-recipe.md. Please ensure the recipe file contains a valid Template Section.');
    }
    
    const awpContent = populateTemplate(awpTemplate, {
      'GOAL': joinArr(featuresForTasks),
      'OVERVIEW': joinArr(phases),
      'TECHNOLOGY': joinArr(techForTasks),
      'OUTCOME': joinArr(successForTasks),
      'BACKLOG_REFERENCE': `See [${projectType.toUpperCase()} Backlog](backlog-${backlogName}/${projectType}/backlog.md) for detailed task breakdown and individual task files.`
    });
    fs.writeFileSync(awpPath, awpContent);

    return {
      content: [
        {
          type: "text",
          text: `Successfully created agentic-sdlc folder with complete project structure in ${targetDir}\n\nCreated:\n- README.md\n- commitStandard.md\n- ASDLC.md\n- AWP.md\n- backlog-${backlogName}/${projectType}/\n  - base.md (reference document with all agreed information from base tool)\n  - requirements.md (populated with collected information)\n  - backlog.md (populated with phases and features)\n  - tech-specs.md (populated with technologies and architecture)\n  - tasks/\n    - planned/ (with initial task files)\n    - unplanned/ (empty)\n    - completed/ (empty)\n\nProject Details:\n- Backlog Name: ${backlogName}\n- Project Type: ${projectType.toUpperCase()}\n- Features/Objectives: ${featuresForTasks.join(', ')}\n- Phases: ${phases.join(', ')}\n- Technologies: ${techForTasks.join(', ')}\n\nThe project structure has been created using the ${projectType}-backlog-recipe.md, ${projectType}-requirements-recipe.md, ${projectType}-tech-specs-recipe.md, and awp-recipe.md methodologies.\n\nThe base.md file contains a complete record of all information agreed upon during project setup.\n\nYou can now work on multiple backlogs by creating additional backlog-<name>/ directories.`,
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
