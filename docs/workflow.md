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
  - **MODE 2**: With params → Creates `user.md` and `base.md` files
- **Optional param**: `appDir` — directory where `agentic-sdlc/` is created (defaults to current working directory)
- **Flow**:
  ```
  User → "base" (no params) → AI gets questions
  AI → asks user questions
  User → provides answers
  AI → "base" (with params) → creates user.md + base.md
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
- **Reads**: `base.md` (created by `base` tool; not overwritten)
- **Optional param**: `appDir` — directory containing `agentic-sdlc/` (defaults to current working directory)
- **Generates**:
  - `requirements.md` (from recipe template)
  - `backlog.md` (from recipe template)
  - `tech-specs.md` (from recipe template)
  - `tasks/` directory structure
  - `AWP.md` (from AWP recipe)
  - Root files: `README.md`, `commitStandard.md`, `ASDLC.md`

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
- `createInitialTasks()` - Creates task files (top-level tasks use `task-{id}.0.md` for correct sort order)
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
│ STEP 4: Create user.md + base.md (base tool - MODE 2)        │
└─────────────────────────────────────────────────────────────┘
AI: Calls base tool (with all params)
    ↓
base.ts:
  - Creates directory: agentic-sdlc/backlog-<name>/<type>/
  - Agent passes userSource and/or userSourceFile (first message or repo file)
  - Creates user.md with raw user input
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
  - Unplanned task rules (see **Unplanned Tasks (AI Instructions)** under section 9)
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
base tool (MODE 2) → user.md + base.md
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
│       ├── user.md              # Raw user input (before base.md)
│       ├── base.md              # AWP Project Foundation Agreement
│       ├── requirements.md      # Project requirements
│       ├── backlog.md           # Project backlog
│       ├── tech-specs.md        # Technical specifications
│       └── tasks/
│           ├── planned/         # task-1.0.md, task-1.1.md, task-1.2.1.md (flat layout)
│           ├── unplanned/       # Unplanned tasks (U- prefix)
│           └── completed/      # Completed tasks
├── README.md
├── ASDLC.md
├── AWP.md
└── commitStandard.md
```

### Task File Naming

Task files use a flat layout within each status folder (no nested subdirectories for hierarchy):

- **Planned tasks** → `tasks/planned/`
- **Unplanned tasks** → `tasks/unplanned/`
- **Completed tasks** → `tasks/completed/`

ID and filename conventions:

- **Level 1 (top-level parent)**: `task-1.0.md`, `task-2.0.md` — `.0` suffix ensures correct alphabetical sort (parent before children)
- **Level 2 (tasks)**: `task-1.1.md`, `task-1.2.md`, `task-2.1.md`
- **Level 3 (subtasks)**: `task-1.2.1.md`, `task-1.2.2.md`
- **Unplanned**: `task-U-1.md`, `task-U-1.1.md` (or `task-U-1.0.md` for top-level unplanned)

### Unplanned Tasks (AI Instructions)

**For AI agents consuming this MCP server:** Unplanned tasks are not created by `base` or `init`. They are added **during development** when work is discovered that was not in the original backlog. Read the type-specific backlog recipe (`get_*_backlog_recipe` tool) — especially `pro-backlog-recipe.md` section 5 — and follow `AWP.md` procedure 1.8.

#### When is something an unplanned task?

Not everything "missing" during development is unplanned. Use this decision guide:

| Situation | What to create | Where |
|-----------|----------------|-------|
| A step needed to **finish a planned task** you are already working on | **Subtask** (e.g., `1.2.1`) | `tasks/planned/task-1.2.1.md` |
| New work **not in original backlog or requirements** (forgotten feature, new requirement, bug fix, scope expansion) | **Unplanned task** (`U-1`, `U-1.1`) | `tasks/unplanned/task-U-1.md` |
| A **concern or risk** to track, not yet actionable work | **Risk entry** (`R.1`, `R.2`) | `AWP.md` → Risks Tasks section |
| Unsure whether it belongs in planned or unplanned scope | **Ask the human** before creating | — |

**Examples:**
- Implementing task 1.2 and realizing you need a database migration script → **subtask** `1.2.1` under the planned task
- Discovering the app needs login, but auth was never in requirements or backlog → **unplanned** `U-1`
- Fixing a bug found while working on task 2.0 → **unplanned** `U-2` (per AWP procedure 1.8)
- Noticing the architecture may not scale — worth tracking but not a task yet → **risk** `R.1` in AWP.md

#### How to create an unplanned task (step-by-step)

1. **Confirm with the human** before creating U- tasks (required by backlog recipes)
2. **Assign the next U- ID** (e.g., `U-1`, then `U-2`; use `U-1.1` for child work under `U-1`)
3. **Create the task file** at `tasks/unplanned/task-U-1.md` using the same schema as planned tasks (see backlog recipe section 3)
4. **Update `backlog.md`** — add a link under the `## Unplanned Tasks` section:
   `- [ ] [Task U-1: Title](tasks/unplanned/task-U-1.md)`
5. **Log in `AWP.md`** — add an entry under the `## Unplanned Tasks` section (AWP procedure 1.8)
6. **Notify the human** that a new unplanned task was added

#### What `init` creates vs what you add later

| Created by `init` | Added during development |
|-------------------|--------------------------|
| `tasks/planned/` with Level 1 tasks (`task-1.0.md`, …) | Subtasks (`task-1.1.md`, `task-1.2.1.md`, …) |
| Empty `tasks/unplanned/` directory | Unplanned tasks (`task-U-*.md`) |
| `backlog.md` with Planned Tasks section populated | Updates to Unplanned Tasks section in `backlog.md` |
| `AWP.md` from awp-recipe | Entries in AWP.md Unplanned Tasks and Risks sections |

## 10. Technical Details

### Server Setup
- Uses `@modelcontextprotocol/sdk` for MCP protocol
- Exposes tools via `ListToolsRequestSchema`
- Exposes resources via `ListResourcesRequestSchema`
- Handles requests via `CallToolRequestSchema` and `ReadResourceRequestSchema`

### Module Organization
- `src/index.ts` - Server setup and routing
- `src/tools/` - Tool handlers (base, init, recommend, backlog_sync)
- `src/resources/` - Resource handlers (recipes, backlog snapshot)
- `src/backlog/` - Kanban compiler, watcher CLI, and HTTP server
- `src/utils/` - Shared helper functions
- `src/recipes/` - Recipe markdown files
- `src/templates/` - Template files (README, commitStandard, kanban)

### Recipe Access
- **As Tools**: `get_mvp_backlog_recipe`, `get_awp_recipe` → Returns recipe content
- **As Resources**: `recipe://mvp-backlog-recipe`, `recipe://awp-recipe` → Direct URI access
- Both methods return the same recipe content

## 11. Live Kanban Board

The Kanban board is a **read-only** live view of your markdown backlog. Markdown stays the source of truth; the board is compiled into JSON and served over HTTP.

### Directory layout

```
agentic-sdlc/
├── backlog-<name>/
│   └── <type>/
│       ├── user.md          ← raw user input (preserved before base.md)
│       ├── base.md          ← foundation agreement (shown in modal)
│       ├── backlog.md
│       └── tasks/
│           ├── planned/     ← In Progress inferred from # Status: [~]
│           ├── unplanned/
│           └── completed/
└── kanban/                  ← generated viewer + JSON + in-repo runner
    ├── index.html
    ├── backlog.json
    ├── package.json
    ├── runner/
    ├── KANBAN.md
    ├── activity.json
    └── .kanban-config.json  ← includes appDir for MCP resources
```

### Column rules

| Column | Rule |
|--------|------|
| Unplanned | File in `tasks/unplanned/` |
| Planned | File in `tasks/planned/` with `# Status: [ ] Pending` |
| In Progress | File in `tasks/planned/` with `# Status: [~] In Progress` |
| Completed | File in `tasks/completed/` |

### After `init`

The Kanban board **starts automatically** when `init` completes. It opens in **Cursor/VS Code Simple Browser** when available (integrated preview beside your code); otherwise your **system browser** opens at http://localhost:4173.

To start manually:

```bash
cd agentic-sdlc/kanban && npm run watch
```

Preview/browser open is automatic. Environment overrides:

| Variable | Effect |
|----------|--------|
| `AWP_KANBAN_NO_OPEN=1` | Do not open any window |
| `AWP_KANBAN_FORCE_BROWSER=1` | Skip Cursor preview; use system browser only |

When the AI edits task `.md` files, the board updates within ~1s (file watcher + SSE). The board also polls every 5s as a fallback.

**Agents must update task markdown** on every `awp update` / `awp commit` / `awp next`:

1. Set `# Status: [~] In Progress` when starting a task; `[x] Completed` when done
2. Append lines under `## Activity` with a timestamp (e.g. `- 2026-06-24 10:00 — Started scaffold`)
3. Move the file to `tasks/completed/` when the task is finished

Git commits and application code **do not** move Kanban cards — only changes to task `.md` files (or `backlog_sync`) recompile the board.

See `agentic-sdlc/kanban/KANBAN.md` for copy-paste instructions agents can quote to users.

### AWP command bar (Kanban UI)

The board header includes buttons for standard AWP chat commands:

| Button | Copies to clipboard |
|--------|---------------------|
| Start | `awp check` — find current actionable step |
| Update | `awp update` |
| Commit | `awp commit` |
| Next | `awp next` |
| Check | `awp check` |
| Handoff | `awp handoff` |

Hover a button for its description, click to copy, then paste into the agent chat. The board is read-only; commands run in the IDE agent, not in the browser.

For `awp next`, the agent must follow the mandatory sequence: **update → commit → next** (see AWP.md).

### Agent commits panel

The **Agent commits** section lists recent git commits from the project root that match the AWP commit standard (`type(scope step): subject` from `commitStandard.md`). This surfaces work the agent committed during the workflow.

- Live API: `GET /api/commits.json` (filtered to AWP-format commits)
- All commits: `GET /api/commits.json?all=1`
- Refreshes automatically when git HEAD changes (server watches `.git`) and every 5s via polling; **Refresh** forces an immediate reload

Requires a git repository at `appDir` (from `.kanban-config.json`).

### MCP tools and resources

| Name | Purpose |
|------|---------|
| `backlog_sync` | Recompile `kanban/backlog.json` from markdown (pass `appDir`) |
| `backlog://<name>/snapshot` | Read compiled JSON for agent context |

Set `AGENTIC_SDLC_APP_DIR` to your project root in MCP config if the server cwd is not your project (so snapshot resources resolve correctly).

### In-repo NPM scripts (`agentic-sdlc/kanban/`)

- `npm run sync` — one-shot compile
- `npm run open` — sync + open preview (when server already running on 4173)
- `npm run watch` — watch + serve on port 4173
- `npm run serve` — serve only

### MCP package scripts (developers only)

When working on the `mcp-agentic-sdlc` repo itself:

- `npm run backlog:sync` — one-shot compile
- `npm run backlog:watch` — watch + serve (optional `--appDir`)
- `npm run backlog:serve` — serve only

---

This is how the MCP Agentic SDLC server works. It guides users through project setup, generates recommendations when needed, and creates a structured project foundation using recipe-driven templates.
