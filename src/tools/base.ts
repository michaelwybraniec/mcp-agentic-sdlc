import * as fs from 'fs';
import * as path from 'path';

export function handleBaseTool(args: any): any {
  // MODE 1: No parameters - return questions
  if (!args || Object.keys(args).length === 0 || !args.backlogName) {
    return {
      content: [
        {
          type: "text",
          text: `🚀 **Agentic SDLC Project Setup - STEP 1: Requirements Collection**

I need to collect 8 essential pieces of information to set up your Agentic SDLC project.

**Let's start with the backlog name and project type:**

**0. What should we name this backlog?** - Give it a descriptive name (e.g., "ecommerce", "crm", "mobile-app")
   → This will create a \`backlog-<name>/\` directory to organize your project work
   → You can have multiple backlogs: \`backlog-project1/\`, \`backlog-project2/\`, etc.

**1. What is the project type?**

Choose the option that best describes your project:

   📦 **MVP** (Minimum Viable Product)
      → Use this if: You want to build a production-ready product with only essential features
      → Focus: Core value delivery, production quality, real users
      → Example: "A working e-commerce site with just checkout and product listing"
      → Quality: Production-ready, but minimal scope
      → Time estimated (Classic Development): Typically 2-6 months
      → Time estimated (AWP-Enhanced): Typically 1-3 months
      → Human supervision: Medium to High (production quality requires oversight)

   🔬 **POC** (Proof of Concept)
      → Use this if: You need to prove a concept works before building the full product
      → Focus: Technical feasibility, concept validation, quick proof
      → Example: "Can we integrate AI into our workflow? Let's test it first"
      → Quality: Functional proof, not production-ready
      → Time estimated (Classic Development): Typically 1-4 weeks
      → Time estimated (AWP-Enhanced): Typically 3-10 days
      → Human supervision: Low to Medium (proof-focused, less oversight needed)

   🏗️ **Full/Pro** (Complete Project)
      → Use this if: You're building the complete product with all planned features
      → Focus: Full feature set, comprehensive solution, long-term development
      → Example: "Complete CRM system with all modules and integrations"
      → Quality: Production-ready, full scope
      → Time estimated (Classic Development): Typically 6+ months
      → Time estimated (AWP-Enhanced): Typically 3-6 months
      → Human supervision: High (complex project requires full human oversight)

**Quick decision guide:**
   • Not sure? Ask yourself: Do I need to prove it works first? → **POC**
   • Do I need it production-ready but minimal? → **MVP**
   • Do I need everything? → **Full/Pro**

**Which one matches your project?** (Just say: MVP, POC, or Full/Pro)

Once you tell me the project type, I'll ask only the critical questions needed to create your backlog, requirements, and tech specs.

**Note:** If you don't know the answer to a question, you can say "I don't know" or "AI" - I'll generate recommendations based on your foundational answers and best practices. I'll present all recommendations for your review before proceeding with project creation.

**If you choose MVP:**
1. **Core Value Proposition** (for MVP requirements):
   - What problem does the MVP solve?
   - Who is the primary user?
   - What is the core user journey? (step-by-step)
2. **Essential MVP Features** (for MVP requirements & backlog):
   - List ONLY the features necessary for core value delivery
   - Exclude all nice-to-haves and future phase features
3. **Out of MVP Scope** (for MVP requirements):
   - What features are explicitly excluded from MVP?
   - What will be deferred to Phase 2, Phase 3, or Future?
4. **MVP Success Criteria** (for MVP requirements):
   - What measurable conditions indicate MVP success?
   - How will you validate the MVP delivers core value?
5. **Non-Functional Requirements** (for MVP requirements):
   - What quality attributes are required? (performance, security, scalability, etc.)
   - What constraints must be met? (regulatory, technical, business)
6. **Technologies** (for MVP tech specs):
   - What technologies, frameworks, or tools will you use?
7. **Architecture Approach** (for MVP tech specs):
   - What architecture pattern will you use? (monolithic, microservices, serverless, etc.)
   - What are the key design decisions for MVP implementation?
8. **Data Models** (for MVP tech specs):
   - What are the core data structures/entities?
   - What are the key data relationships?
9. **MVP Phases** (for MVP backlog organization):
   - What are the key development phases for MVP delivery?

**If you choose POC:**
1. **Core Concept to Prove** (for POC requirements):
   - What hypothesis needs validation?
   - What technical feasibility needs proof?
2. **Essential Proof Points** (for POC requirements & backlog):
   - List ONLY the requirements necessary to prove the concept works
3. **Out of POC Scope** (for POC requirements):
   - What is explicitly excluded from POC?
   - What production features will be deferred?
4. **POC Success Criteria** (for POC requirements):
   - What measurable conditions indicate the concept is proven?
   - How will you validate the proof?
5. **Technologies** (for POC tech specs):
   - What technologies, frameworks, or tools will you use?
6. **Architecture Approach** (for POC tech specs):
   - What simplified architecture pattern will you use for proof?
   - What are the key design decisions for POC implementation?
7. **POC Phases** (for POC backlog organization):
   - What are the key phases to demonstrate proof?

**If you choose Full/Pro:**
1. **Core Objectives** (for Pro requirements):
   - What are the main goals this project must achieve?
2. **Target Users** (for Pro requirements):
   - Who will use or benefit from the system?
   - What are the user personas or user types?
3. **Functional Requirements** (for Pro requirements):
   - What are the main functional capabilities the system must provide?
   - What are the key features and functionalities?
4. **Non-Functional Requirements** (for Pro requirements):
   - What quality attributes are required? (performance, security, scalability, reliability, etc.)
   - What constraints must be met? (regulatory, technical, business)
5. **Out of Scope** (for Pro requirements):
   - What features or capabilities are explicitly excluded?
6. **Technologies** (for Pro tech specs):
   - What technologies, frameworks, or tools will you use?
7. **Architecture Approach** (for Pro tech specs):
   - What architecture pattern will you use? (monolithic, microservices, serverless, layered, etc.)
   - What are the key design decisions?
8. **Data Models** (for Pro tech specs):
   - What are the core data structures/entities?
   - What are the key data relationships and data flow?
9. **Project Phases** (for Pro backlog organization):
   - What are the key development phases or milestones?

**Next Step:**
After you provide all answers (backlog name + project type + remaining questions), I will use the 'init' tool to create your complete project structure with:
- README.md (project overview and philosophy)
- ASDLC.md (Agentic SDLC lifecycle plan)
- AWP.md (Agentic Workflow Protocol template)
- Project-specific structure based on type (MVP/POC/Full)
- tasks/ directory with project backlog and individual task files

**Workflow:** base → answer project type → answer remaining questions (tailored to your type) → init → project created
**Important:** The init tool will create the agentic-sdlc folder in your current working directory.

**Please start by telling me: What is the project type? (MVP, POC, or Full/Pro)**`,
        },
      ],
    };
  }

  // MODE 2: With parameters - create base.md
  const appDir = (args?.appDir as string) || process.cwd();
  const backlogName = args?.backlogName as string;
  const projectType = (args?.projectType as string)?.toLowerCase();

  if (!backlogName || !projectType) {
    return {
      content: [
        {
          type: "text",
          text: "ERROR: Missing required parameters!\n\nRequired: backlogName, projectType (mvp/poc/pro).\n\nOptional: appDir (defaults to current directory).",
        },
      ],
      isError: true,
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

  try {
    // Create directory structure
    const targetDir = path.join(appDir, 'agentic-sdlc');
    const backlogDir = path.join(targetDir, `backlog-${backlogName}`);
    const typeDir = path.join(backlogDir, projectType);
    
    // Ensure directories exist
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }

    // Create base.md content based on project type
    let baseContent = `# Base: AWP Project Foundation Agreement

**Backlog Name:** ${backlogName}
**Project Type:** ${projectType.toUpperCase()}

`;

    if (projectType === 'mvp') {
      const mvpCoreValue = args?.mvpCoreValueProposition as any;
      const mvpFeatures = args?.mvpEssentialFeatures as string[];
      const mvpOutOfScope = args?.mvpOutOfScope as string[];
      const mvpSuccess = args?.mvpSuccessCriteria as string[];
      const mvpTech = args?.mvpTechnologies as string[];
      const mvpArch = args?.mvpArchitectureApproach as string;
      const mvpNonFunc = args?.mvpNonFunctionalRequirements as string[];
      const mvpData = args?.mvpDataModels as string;
      const mvpPhases = args?.mvpPhases as string[];

      baseContent += `## 1. Core Value Proposition (User Provided)

**Problem:** ${mvpCoreValue?.problem || 'Not specified'}
**Primary User:** ${mvpCoreValue?.primaryUser || 'Not specified'}
**Core User Journey:** ${mvpCoreValue?.coreUserJourney || 'Not specified'}

## 2. Essential MVP Features

${(mvpFeatures || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 3. Out of MVP Scope

${(mvpOutOfScope || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 4. MVP Success Criteria

${(mvpSuccess || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 5. Key Technologies

${(mvpTech || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 6. Architecture Approach

${mvpArch || 'Not specified'}

## 7. Non-Functional Requirements

${(mvpNonFunc || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 8. Data Models

${mvpData || 'Not specified'}

## 9. Project Phases (${projectType.toUpperCase()})

${(mvpPhases || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}
`;

    } else if (projectType === 'poc') {
      const pocCoreConcept = args?.pocCoreConcept as any;
      const pocProofPoints = args?.pocEssentialProofPoints as string[];
      const pocOutOfScope = args?.pocOutOfScope as string[];
      const pocSuccess = args?.pocSuccessCriteria as string[];
      const pocTech = args?.pocTechnologies as string[];
      const pocArch = args?.pocArchitectureApproach as string;
      const pocPhases = args?.pocPhases as string[];

      baseContent += `## 1. Core Concept to Prove (User Provided)

**Hypothesis:** ${pocCoreConcept?.hypothesis || 'Not specified'}
**Technical Feasibility:** ${pocCoreConcept?.technicalFeasibility || 'Not specified'}

## 2. Essential Proof Points

${(pocProofPoints || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 3. Out of POC Scope

${(pocOutOfScope || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 4. POC Success Criteria

${(pocSuccess || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 5. Key Technologies

${(pocTech || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 6. Architecture Approach

${pocArch || 'Not specified'}

## 7. Project Phases (${projectType.toUpperCase()})

${(pocPhases || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}
`;

    } else if (projectType === 'pro') {
      const proObjectives = args?.proCoreObjectives as string[];
      const proTargetUsers = args?.proTargetUsers as string[];
      const proFunctional = args?.proFunctionalRequirements as string[];
      const proNonFunc = args?.proNonFunctionalRequirements as string[];
      const proOutOfScope = args?.proOutOfScope as string[];
      const proTech = args?.proTechnologies as string[];
      const proArch = args?.proArchitectureApproach as string;
      const proData = args?.proDataModels as string;
      const proPhases = args?.proPhases as string[];

      baseContent += `## 1. Core Objectives (User Provided)

${(proObjectives || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 2. Target Users

${(proTargetUsers || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 3. Functional Requirements

${(proFunctional || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 4. Non-Functional Requirements

${(proNonFunc || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 5. Out of Scope

${(proOutOfScope || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 6. Key Technologies

${(proTech || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}

## 7. Architecture Approach

${proArch || 'Not specified'}

## 8. Data Models

${proData || 'Not specified'}

## 9. Project Phases (${projectType.toUpperCase()})

${(proPhases || []).map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') || 'Not specified'}
`;
    }

    // Write base.md
    const basePath = path.join(typeDir, 'base.md');
    fs.writeFileSync(basePath, baseContent, 'utf8');

    return {
      content: [
        {
          type: "text",
          text: `✅ **base.md created successfully!**

**Location:** ${basePath}

This file contains all the agreed-upon project foundation information. Review it and then proceed with the 'init' tool to generate your complete project structure.

**Next Step:** Call the 'init' tool with:
- backlogName: "${backlogName}"
- projectType: "${projectType}"
- appDir: "${appDir}" (optional, defaults to current directory)`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `ERROR: Failed to create base.md: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
