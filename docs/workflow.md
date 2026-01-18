# How the MCP Agentic SDLC Server Works

## 1. Architecture Overview

The server is an **MCP (Model Context Protocol) server** that exposes tools and resources to AI assistants (like Claude in Cursor). It provides a structured way to set up and manage software development projects using AI-human collaboration.

```
┌──────────────────────────────────────────────────────────┐
│                    MCP Server (index.ts)                 │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │ List Tools   │  │ List Resources│  │ Handle Calls  │  │
│  └──────────────┘  └───────────────┘  └───────────────┘  │
└──────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌───────────────┐     ┌───────────────┐     ┌──────────────┐
│   Tools/      │     │   Resources/  │     │   Utils/     │
│  - base.ts    │     │  recipes.ts   │     │ helpers.ts   │
│  - init.ts    │     │               │     │              │
│  - recommend  │     │               │     │              │
└───────────────┘     └───────────────┘     └──────────────┘
```

## 2. Core Components

### A. Tools (User-Callable Actions)

#### 1. `base` Tool (`src/tools/base.ts`)
- **Purpose**: Collect project requirements
- **Two Modes**:
  - **MODE 1**: No params → Returns questions to ask
  - **MODE 2**: With params → Creates `base.md` file
- **Flow**:
  ```
  User → "base" (no params) → AI gets questions
  AI → asks user questions
  User → provides answers
  AI → "base" (with params) → creates base.md
  ```

#### 2. `recommend` Tool (`src/tools/recommend.ts`)
- **Purpose**: Generate AI recommendations for missing elements
- **When**: User says "I don't know" or "AI"
- **How**: Uses foundational info + best practices to suggest:
  - Features
  - Technologies
  - Architecture approaches
  - Success criteria

#### 3. `init` Tool (`src/tools/init.ts`)
- **Purpose**: Create complete project structure
- **Reads**: `base.md` (created by `base` tool)
- **Generates**:
  - `requirements.md` (from recipe template)
  - `backlog.md` (from recipe template)
  - `tech-specs.md` (from recipe template)
  - `tasks/` directory structure
  - `AWP.md` (from AWP recipe)

### B. Resources (Read-Only Content)

**Recipe Resources** (`src/resources/recipes.ts`)
- 10 recipe files accessible via URIs:
  - `recipe://mvp-backlog-recipe`
  - `recipe://mvp-requirements-recipe`
  - `recipe://mvp-tech-specs-recipe`
  - (same for POC and Pro)
  - `recipe://awp-recipe`
- **Accessed via**:
  - **Tools**: `get_mvp_backlog_recipe` (returns recipe content)
  - **Resources**: `recipe://mvp-backlog-recipe` (direct URI access)

### C. Helper Functions (`src/utils/helpers.ts`)

- `extractTemplateFromRecipe()` - Extracts template section from recipe
- `populateTemplate()` - Replaces placeholders with actual data
- `createProjectBacklog()` - Generates backlog markdown
- `createInitialTasks()` - Creates task files
- `parseBaseMd()` - Parses `base.md` to extract data

## 3. Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Project Discovery (base tool - MODE 1)              │
└─────────────────────────────────────────────────────────────┘
User: "I want to start a project"
AI: Calls base tool (no params)
    ↓
base.ts returns questions:
  - "What's the backlog name?"
  - "What's the project type? (MVP/POC/Pro)"
  - [Type-specific questions]

┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Collect Answers                                      │
└─────────────────────────────────────────────────────────────┘
AI: Asks questions one by one
User: Provides answers OR says "I don't know" / "AI"

┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Generate Recommendations (if needed)                │
└─────────────────────────────────────────────────────────────┘
If user said "I don't know":
  AI: Calls recommend tool
      ↓
  recommend.ts:
    - Takes foundational info (what user knows)
    - Takes missing elements (what user doesn't know)
    - Generates intelligent recommendations
      ↓
  AI: Presents recommendations to user
  User: Reviews, accepts, or modifies

┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Create base.md (base tool - MODE 2)                  │
└─────────────────────────────────────────────────────────────┘
AI: Calls base tool (with all params)
    ↓
base.ts:
  - Creates directory: agentic-sdlc/backlog-<name>/<type>/
  - Creates base.md with all agreed information
  - Format: "Base: AWP Project Foundation Agreement"

┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Generate Project Files (init tool)                   │
└─────────────────────────────────────────────────────────────┘
AI: Calls init tool (backlogName, projectType)
    ↓
init.ts:
  1. Reads base.md
  2. Parses it using parseBaseMd()
  3. Reads recipes:
     - <type>-requirements-recipe.md
     - <type>-backlog-recipe.md
     - <type>-tech-specs-recipe.md
     - awp-recipe.md
  4. Extracts templates from recipes
  5. Populates templates with data from base.md
  6. Creates files:
     - requirements.md
     - backlog.md
     - tech-specs.md
     - AWP.md
     - tasks/planned/ (with initial tasks)
  7. Creates directory structure

┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Development (using recipes and AWP)                  │
└─────────────────────────────────────────────────────────────┘
User: Works on project following:
  - Recipe methodologies (from recipe resources)
  - AWP protocol (from AWP.md)
  - Task structure (from tasks/)
```

## 4. Recipe System

Each recipe has **two parts**:

1. **Methodology Sections (1-8)**: How to create the document
   - Guides AI thinking
   - Defines structure
   - Provides examples

2. **Template Section (9)**: File structure template
   - Markdown template with placeholders like `{{PROBLEM}}`
   - Used by `init` tool to generate files

**Example Flow**:
```
Recipe: mvp-requirements-recipe.md
  ↓
init.ts reads recipe
  ↓
Extracts template section (section 9)
  ↓
Populates placeholders:
  {{PROBLEM}} → "Users can't find products easily"
  {{FEATURES_LIST}} → "1. Search\n2. Filter\n3. Product details"
  ↓
Generates requirements.md file
```

## 5. Data Flow

```
User Input
    ↓
base tool (MODE 1) → Questions
    ↓
User Answers
    ↓
recommend tool (if needed) → Recommendations
    ↓
User Confirms
    ↓
base tool (MODE 2) → base.md
    ↓
init tool → Reads base.md
    ↓
init tool → Reads recipes
    ↓
init tool → Extracts templates
    ↓
init tool → Populates templates
    ↓
Generated Files (requirements.md, backlog.md, etc.)
```

## 6. Modular Architecture Benefits

- **Separation of Concerns**: Each tool in its own file
- **Reusability**: Helper functions shared across tools
- **Maintainability**: Easy to update individual tools
- **Testability**: Each module can be tested independently
- **Scalability**: Easy to add new tools or recipes

## 7. Key Design Decisions

1. **Single Source of Truth**: `base.md` contains all agreed information
2. **Recipe-Driven**: Templates embedded in recipes (no separate template files)
3. **Type-Specific**: Different questions/flows for MVP/POC/Pro
4. **Flexible**: "I don't know" → AI recommendations
5. **Framework-Agnostic**: Works with any development methodology

## 8. Example Interaction

```
User: "I want to build an MVP for an e-commerce site"

AI: Calls base tool (no params)
    → Gets questions

AI: "What's the backlog name?"
User: "ecommerce"

AI: "What's the project type?"
User: "MVP"

AI: "What problem does it solve?"
User: "Users can't easily find and buy products online"

AI: "What technologies will you use?"
User: "I don't know"

AI: Calls recommend tool
    → Generates: ["React", "Node.js", "PostgreSQL", "Stripe API"]
    → Presents to user

User: "Yes, those look good"

AI: Calls base tool (with all params)
    → Creates base.md

AI: Calls init tool
    → Generates complete project structure
```

## 9. File Structure

After initialization, your project will have:

```
agentic-sdlc/
├── backlog-<name>/
│   └── <type>/          # mvp, poc, or pro
│       ├── base.md              # AWP Project Foundation Agreement
│       ├── requirements.md      # Project requirements
│       ├── backlog.md           # Project backlog
│       ├── tech-specs.md        # Technical specifications
│       └── tasks/
│           ├── planned/         # Active tasks
│           ├── unplanned/       # Unplanned tasks (U- prefix)
│           └── completed/      # Completed tasks
├── README.md
├── ASDLC.md
├── AWP.md
└── commitStandard.md
```

## 10. Technical Details

### Server Setup
- Uses `@modelcontextprotocol/sdk` for MCP protocol
- Exposes tools via `ListToolsRequestSchema`
- Exposes resources via `ListResourcesRequestSchema`
- Handles requests via `CallToolRequestSchema` and `ReadResourceRequestSchema`

### Module Organization
- `src/index.ts` - Server setup and routing (553 lines)
- `src/tools/` - Tool handlers (base, init, recommend)
- `src/resources/` - Resource handlers (recipes)
- `src/utils/` - Shared helper functions
- `src/recipes/` - Recipe markdown files
- `src/templates/` - Template files (README, commitStandard)

### Recipe Access
- **As Tools**: `get_mvp_backlog_recipe` → Returns recipe content
- **As Resources**: `recipe://mvp-backlog-recipe` → Direct URI access
- Both methods return the same recipe content

---

This is how the MCP Agentic SDLC server works. It guides users through project setup, generates recommendations when needed, and creates a structured project foundation using recipe-driven templates.
