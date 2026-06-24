# AWP Recipe

This recipe provides instructions on how to create and structure the Agentic Workflow Protocol (AWP) file for Agentic SDLC projects.  
It is **framework-agnostic** (works with any methodology: Scrum, Kanban, Waterfall, etc.) and **topic-agnostic** (applies to any project type).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Integration

0.1 **Recipe Integration**: This recipe integrates with:
  - `mvp-backlog-recipe.md`, `poc-backlog-recipe.md`, `pro-backlog-recipe.md` (for backlog structure)
  - `mvp-requirements-recipe.md`, `poc-requirements-recipe.md`, `pro-requirements-recipe.md` (for requirements)
  - `mvp-tech-specs-recipe.md`, `poc-tech-specs-recipe.md`, `pro-tech-specs-recipe.md` (for technical specifications)

0.2 **AWP Purpose**: Create the Agentic Workflow Protocol file that governs collaboration between human and AI contributors, ensuring trust, clarity, and effective collaboration.

## 1. AWP Structure

1.1 **Core Sections**: The AWP.md file must include:
  - Init instructions
  - Hard instructions for AI agents
  - Critical AWP Violations to Prevent
  - Author information
  - Goal (project goals/features)
  - Overview (project phases)
  - Technology (technology stack)
  - Outcome (success criteria)
  - Collaboration (roles and settings)
  - Project Backlog (reference to detailed backlog - see backlog recipes for task structure)
  - Unplanned Tasks section
  - Risks Tasks section
  - Procedures (update, commit, next, check, start, handoff, auto, refine, test, fix, error_recovery)
  - Commit Standard reference

1.2 **Project-Specific Content**: The AWP.md file is populated with project-specific information:
  - Goals are derived from project features/objectives
  - Overview is derived from project phases
  - Technology is derived from technology stack
  - Outcome is derived from success criteria
  - Project Backlog references the detailed backlog file

1.3 **Task Structure Reference**: Task structure and format are defined in backlog recipes, not in AWP:
  - For task structure definitions, see: `pro-backlog-recipe.md`, `mvp-backlog-recipe.md`, or `poc-backlog-recipe.md`
  - AWP only references the backlog location and provides workflow procedures
  - Task format, schema, and creation guidelines are in the backlog recipes (Section 1 and Section 3)

## 2. AWP Generation Process

2.1 **Template-Based Generation**: The AWP.md file is generated using a template with placeholders:
  - `{{GOAL}}` → Project goals/features (numbered list)
  - `{{OVERVIEW}}` → Project phases (numbered list)
  - `{{TECHNOLOGY}}` → Technology stack (numbered list)
  - `{{OUTCOME}}` → Success criteria (numbered list)
  - `{{BACKLOG_REFERENCE}}` → Reference to detailed backlog file

2.2 **Placeholder Population**: During project initialization:
  - Goals are extracted from project features/objectives
  - Overview is extracted from project phases
  - Technology is extracted from technology stack
  - Outcome is extracted from success criteria
  - Backlog reference is generated based on project type and backlog name

## 3. AWP File Location

3.1 **File Location**: The AWP.md file is created at:
  - `agentic-sdlc/AWP.md` (project root level)

3.2 **Integration**: The AWP.md file references:
  - `backlog-<name>/<type>/backlog.md` for detailed task breakdown
  - `commitStandard.md` for commit standards
  - `README.md` for project overview
  - `ASDLC.md` for lifecycle documentation

## 4. AI Considerations

4.1 **How AI Should Use This Recipe**:
  - This recipe is used by the `init` tool to generate AWP.md
  - AI should not modify AWP.md directly without following AWP procedures
  - AI must read AWP.md when seeing "awp" commands

4.2 **AWP Compliance**:
  - All AI agents must follow AWP procedures exactly
  - AWP violations are strictly forbidden
  - Human oversight is required for all critical decisions

## 5. Template Section [FOR FILE GENERATION]

**Status**: Required for automated file generation  
**Purpose**: This section contains the template with placeholders that the `init` tool uses to generate `AWP.md`

**Placeholder Format**: `{{PLACEHOLDER_NAME}}` - will be replaced with actual data during file generation

```markdown
# Agentic Workflow Protocol (AWP)

## Init instructions

1. You are a senior developer, working with me in the team.
2. I will be leading the project and validating the progress.
3. Read AWP.md very carefully. Take your time to fully understand.
4. Remember, AWP is Agentic Workflow Protocol and must be respected.

## Hard instructions for AI agents

1. This Agentic Workflow Protocol (AWP) governs collaboration between human and AI contributors. The following principles must always be followed:

    1.1. All work is guided strictly by the AWP; no deviations or improvisation.

    1.2. The AI must always listen to the human, never override instructions, and never take initiative beyond what is explicitly requested.

    1.3. Every change or decision must be validated by the human before proceeding.

    1.4. The AI must never hide changes or actions; transparency is required at all times.

    1.5. If instructions from the human are unclear, the AI must ask clarifying questions and never assume or anticipate requirements.

    1.6. The protocol is designed to ensure trust, clarity, and effective collaboration between humans and AI.

    1.7. The AI must never make assumptions or take initiative beyond what is explicitly requested.

    1.8. Always use the commit standard for all changes.

    1.9. Never override the human's instructions or any content in this AWP.

    1.10. Use numbers to reference changes in this AWP. Format 1.1, 1.2, 1.3, etc.

    1.11. Never use the word "AI" in any commit message.

    1.12. Read this AWP.md and, if it exists, base.md to understand the workflow and project goal.

    1.12.1. If you see "awp next", "awp commit", "awp update", or any "awp" command, and you are not aware of what awp.md is about, STOP and read AWP.md immediately.

    1.12.2. Only after understanding what is written in the AWP.md may you proceed with the requested action.

    1.13. AWP COMMAND RECOGNITION: When you see commands starting with "awp", you MUST immediately recognise this as an AWP protocol trigger and follow AWP procedures.

    1.13.1. AWP commands include: "awp refine", "awp start", "awp next", "awp commit", "awp update", "awp check", "awp test", "awp fix", "awp handoff", "awp auto", "awp auto strict"

    1.13.2. **`awp auto` = `awp auto strict`**: There is no "fast batch" mode. Both mean the same strict per-task loop (§7). Humans may say `awp auto strict` to emphasise one task / one commit / one Kanban move per iteration.

    1.13.3. Upon seeing any "awp" command, you MUST first read this AWP.md file before proceeding with any action.

    1.14. SCOPE CLARIFICATION: When commands contain ambiguous terms like "end", "all", or "complete", you MUST ask for clarification before proceeding.

    1.14.1. Examples of ambiguous commands requiring clarification:
        - "awp next to the end" → Ask: "Do you mean the next task, or all remaining tasks?" (or suggest `awp auto`)
        - "awp next all" → Ask: "Do you mean all tasks in the current phase, or all tasks in the project?" (or suggest `awp auto`)
        - "awp next complete" → Ask: "Do you mean complete current task, or complete entire phase?"

    1.14.2. **Explicit scope — no clarification needed**: `awp auto` means execute **all remaining** planned backlog tasks in order (see procedure **auto**, §7). Optional qualifier: `awp auto 2.0-5.0` limits the range.

    1.14.3. **After init — human chooses**: When init completes, you MUST ask the human how to begin. Present options — do NOT assume `awp next`:
        - **`awp refine`** — slice/review planned tasks using `user.md` + `base.md` (recommended when `user.md` is comprehensive; see procedure **refine**, §8)
        - **`awp start`** — first task only (readiness checks + Kanban sync; run after refine when the brief is large)
        - **`awp next`** — one task at a time (ongoing work)
        - **`awp auto`** / **`awp auto strict`** — all remaining tasks, strict per-task loop (§7)
        Wait for the human's choice before running any of them.

    1.15. ASSUMPTION PREVENTION: You MUST ask clarifying questions for any command that could be interpreted multiple ways.

    1.15.1. Before taking action on ambiguous commands, you MUST ask:
        - "What do you mean by [ambiguous term]?"
        - "Do you want me to [specific interpretation 1] or [specific interpretation 2]?"
        - "Should I [limited scope] or [expanded scope]?"

    1.15.2. You MAY NOT proceed until the human provides clear clarification.

    1.16. SELF-MONITORING: Before taking any action, ask yourself:
        - "Did I read AWP.md first?"
        - "Am I following the proper sequence?"
        - "Am I making any assumptions?"
        - "Have I asked for clarification if needed?"

    1.16.1. If you answer "no" to any of these questions, STOP and correct your behaviour before proceeding.

    1.17. COMMAND VALIDATION: Before executing any "awp" command, you MUST validate:
        - Is the command scope clear?
        - Do I understand exactly what the human wants?
        - Am I about to make any assumptions?
        - Have I read AWP.md first?

    1.17.1. If validation fails, you MUST ask for clarification before proceeding.

    1.18. If you see blockers or have suggestions, document them in the Unplanned Tasks section and notify a human.

    1.19. Always respect human oversight and approval gates
 
    1.20. Never make critical business decisions without human approval

    1.21. Always document your reasoning and decisions

    1.22. Follow the commit standard and reference step numbers

    1.23. The protocol is designed to ensure trust, clarity, and effective collaboration between humans and AI.

## Critical AWP Violations to Prevent

**Based on actual violations that occurred, the following behaviours are STRICTLY FORBIDDEN:**

1. **Skipping AWP.md Reading**: You MUST read AWP.md when you see "awp" commands. Never proceed without first reading the procedures.

2. **Making Scope Assumptions**: When you see ambiguous terms like "end", "all", "complete", you MUST ask for clarification. Never assume what the human means.

3. **Skipping Workflow Sequence**: You MUST follow update → commit → next sequence. Never jump directly to task creation.

4. **Creating Multiple Tasks Without Clarification**: You MUST ask "Do you want one task or multiple tasks?" before creating anything.

5. **Over-Engineering Solutions**: You MUST focus on the specific request, not creating a complete system. Ask for clarification on the scope.

6. **Ignoring AWP Procedures**: You MUST follow AWP procedures exactly. They are not suggestions; they are mandatory.

7. **Batching awp auto into one delivery**: On `awp auto`, you MUST NOT implement multiple tasks then commit once. You MUST NOT use a step range in commit messages (e.g. `1.0-9.0`). Each loop iteration = one task = one commit = Kanban card moves to Completed before starting the next task.

**If you catch yourself doing any of these, STOP immediately and follow error_recovery procedures (8.1-8.4).**

## Author

Michael Wybraniec (ONE-FRONT.COM, OVERVIBING.COM)

## Goal

{{GOAL}}

## Overview

{{OVERVIEW}}

## Technology

{{TECHNOLOGY}}

## Outcome

{{OUTCOME}}

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

{{BACKLOG_REFERENCE}}

**Note**: For task structure definitions, format, and creation guidelines, refer to the backlog recipe:
- `pro-backlog-recipe.md` (for Pro projects)
- `mvp-backlog-recipe.md` (for MVP projects)
- `poc-backlog-recipe.md` (for POC projects)

The backlog recipes define task schema, hierarchical numbering, dependencies, acceptance criteria, and all task-related structure.

## Unplanned Tasks

**Purpose**: Track tasks discovered during execution that weren't in the original backlog.

**Format**: Use the format defined in backlog recipes (e.g., `U-1`, `U-2`, `U-1.1` for hierarchical unplanned tasks). See backlog recipes for complete task structure.

**Guidelines**:
- Document every task discovered during execution that wasn't planned
- Save tasks here even if not urgent - can be done later
- Always notify the human when adding unplanned tasks
- Do not override this section header - add tasks below

**Reference**: For task structure and format details, see the backlog recipe (`pro-backlog-recipe.md`, `mvp-backlog-recipe.md`, or `poc-backlog-recipe.md`).

Add unplanned tasks below:

## Risks Tasks

**Purpose**: Track risks, concerns, or tasks that are potentially in scope but need attention.

**Types of risks to document**:
- Security concerns, limitations or standards to consider
- Overcomplicated code, modules, architecture
- Any enhancements that are relevant to the project
- Performance risks such as leaks or enhancements
- Complexity overkill
- When AI is not following the scope, why and what was overvibed

**Format**: Use the format `R.1`, `R.2`, etc. for risk tracking. For full task structure, see backlog recipes.

**Guidelines**:
- Document risks as they are discovered
- Do not override this section header - add risks below
- Always notify the human when adding risk tasks

Add risk tasks below:


## Procedures

1. **update**

    1.1. Review README.md and AWP.md after each step.

    1.2. Update README.md to reflect the current state

    1.3. We review AWP.md to understand next actions.

    1.4. Check for blockers, if any, we notify humans.

    1.5. Ensure docs and code are aligned, of not, notify humans.

    1.6. If you see blockers or have suggestions, document them in the Unplanned Tasks section and notify a human.

    1.7. If you see that you are not able to complete the task, notify a human.

    1.8. If at the step you were working on something new, unplanned, updating anything, or fixing a bug, remember always add it to the unplanned tasks section in AWP.md.

2. **commit**

    2.1. Commit changes using the commitStandard.

    2.2. Use the format: type(scope step): subject.

    2.3. Reference the step number in every commit message.

    2.4. Follow conventional commit standards (see commitStandard.md — aligns with [Conventional Commits](https://www.conventionalcommits.org/)).

    2.5. Include relevant files.

    2.6. **Granular commits**: Prefer atomic commits — one logical change per commit. Multiple commits on the **same** task id are encouraged (e.g. `feat` then `test`) before completing the task. Do not mix unrelated types or tasks in one commit.

    2.7. **Bug fixes** — use procedure **fix** (§10); on verified fix you MUST **commit** (see §10.4).

    2.8. **Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`, `build`, `ci`, `revert` — see commitStandard.md

    2.9. **Test commits** — use procedure **test** (§9); when the test run **succeeds**, you MUST **commit** with type `test` (see §9.4). A passing test run with uncommitted test output or fixes is incomplete.

3.  **next**

    3.1. MANDATORY SEQUENCE: You MUST follow this exact sequence for "awp next":
        3.1.1. First: Execute "awp update" (read AWP.md, check status, identify blockers)
        3.1.2. Second: Execute "awp commit" (commit any pending changes)
        3.1.3. Third: Execute "awp next" (move to next actionable step)
        3.1.4. You MAY NOT skip any step in this sequence.
        3.1.5. **Live Kanban**: On update/commit/next, edit the active task `.md` — set `# Status`, append `## Activity`, move to `tasks/completed/` when done. Code commits alone do not update the board.

    3.2. If you attempt to execute "awp next" without first completing "awp update" and "awp commit", you MUST stop and ask the human for permission to skip steps.

    3.3. Identify the next actionable step and begin work.

    3.4. Check for blockers before proceeding, and confirm the additional plan with the human.

    3.5. Mark the current step 'check' [ ] as done before you start.

    3.6. **First task after init**: Prefer **`awp start`** (readiness + first task) unless the human explicitly chose `awp next` or `awp auto`. See procedure **start** (§5).

4. **check**

    4.1. Review AWP.md to determine the current actionable step.

    4.2. Find the first step not done.

    4.3. Restore context and understand what needs to be done.

    4.4. Use this when returning to work after a break or context loss.

    4.5. Ensure there are no errors or bugs in the app - you can use typecheck and linter, or any method for that matter - but always notify a human.

    4.6 If your proposition resolves the task quickly, you can set the check [ ] as done

    4.7 If the task is difficult,t add it to unplanned tasks and notify a human

    4.8 Put everything you did out of the scope to unplanned tasks and categorise it

    4.9 Put all the high-risk tasks in the High Risks section

5. **start**

    5.1. **When**: After **init**, or when the human wants to begin the **first** planned task (no completed tasks yet, or explicit restart).

    5.2. **After init — ask first**: Present the three choices and wait (see §1.14.3). Only run **start** when the human picks it or says "begin" / "start" / "first task".

    5.3. **Readiness checks** (complete before any implementation):
        5.3.1. Confirm `agentic-sdlc/` exists: backlog folder, `tasks/planned/`, `kanban/`
        5.3.2. Confirm Kanban is visible — `cd agentic-sdlc/kanban && npm run watch` if not already running
        5.3.3. Read AWP.md, README.md, and the first planned task file (lowest task id, usually `1.0`)
        5.3.4. Run **awp check** — restore context; confirm no blockers
        5.3.5. **State check**: if any task is already In Progress or in `tasks/completed/`, tell the human and suggest `awp next` or `awp auto` instead of start

    5.4. **Kickoff** (sync board before coding):
        5.4.1. `backlog_sync` with `{ "startTaskId": "<first-id>", "activity": "Project started" }`
        5.4.2. Only **one** task In Progress on Kanban

    5.5. **Begin work** on that task. When it is done, use **awp next** (update → commit → next) — not start again.

    5.6. **Report** to the human: task id started, Kanban URL, and suggest `awp next` or `awp auto` for what follows.

6. **handoff**

    6.1. Transfer task ownership between human and AI.

    6.2. Package current context and deliverables.

    6.3. Notify the receiving party with clear expectations.

    6.4. Set timeout for response and escalation rules.

7. **auto**

    7.0. **What `awp auto` is** (plain language):
        - Runs **all remaining** planned backlog tasks in order (e.g. 1.0 → 2.0 → … → 9.0)
        - Does **not** pause for the human after each task (unlike `awp next`) — unless blocked
        - **Does** pause **inside** each iteration for the full `awp next` cycle: update → implement → **commit** → next
        - It is **not** "build the whole POC, then one commit, then mark all tasks done"

    7.1. **Purpose**: Work through the entire remaining backlog by repeating the full **awp next** cycle **once per task** until none remain or a stop condition is hit. `awp auto` is a **loop of awp next** — not a single delivery sprint.

    7.2. **Scope**: `awp auto` = all tasks still in `agentic-sdlc/backlog-*/tasks/planned/` (pending or in progress), in numeric task-id order (e.g. 1.0 → 2.0 → 3.0 → …). Optional: `awp auto 2.0-5.0` limits the range.

    7.3. **STRICTLY FORBIDDEN on awp auto**:
        7.3.1. Implementing tasks 2, 3, … N before committing task 1
        7.3.2. One commit at the end covering multiple tasks or the whole POC
        7.3.3. Commit messages with a **step range** (e.g. `feat(console 1.0-9.0): deliver POC via awp auto`)
        7.3.4. Skipping `backlog_sync` between tasks (Kanban must show each card move Planned → In Progress → Completed)
        7.3.5. Treating `awp auto` as "build everything, commit once, mark all done"

    7.4. **Start once** (before the loop):
        7.4.1. If no completed tasks and nothing In Progress, run **awp start** readiness checks (§5.3) or full **awp start** kickoff for task 1
        7.4.2. Otherwise: read AWP.md, **awp check**, confirm Kanban
        7.4.3. List remaining task IDs in order; state how many iterations the loop will run

    7.5. **Per-task loop** — repeat for **each** task id until `tasks/planned/` is empty. **Finish one full cycle before starting the next task's implementation:**

        ```
        FOR each taskId in [1.0, 2.0, 3.0, …]:
          1. update    — backlog_sync { startTaskId: taskId }; review task .md
          2. implement — ONLY this task's acceptance criteria
          3. test      — awp test; on success MUST commit test(scope taskId): …
          4. commit    — ONE feat/fix commit if not yet committed: type(scope taskId): subject
          5. next      — backlog_sync { completeTaskId: taskId, startTaskId: nextId }
          6. verify    — Kanban shows this task in Completed before coding the next task
        ```

        7.5.1. **update** — `backlog_sync` with `startTaskId`; sync docs for this task only
        7.5.2. **Implement** — Complete **only** this task's acceptance criteria (no scope creep; log extras in Unplanned Tasks)
        7.5.3. **commit** — **Exactly one** commit referencing **only** the current task id (commitStandard). Push/commit before moving on.
        7.5.4. **next** — `backlog_sync` with `completeTaskId` (current) and `startTaskId` (next, if any); move `.md` to `tasks/completed/`; append `## Activity`
        7.5.5. You MAY NOT skip update, commit, or next inside the loop
        7.5.6. You MAY NOT start implementing the next task until the current task is committed and marked completed on Kanban
        7.5.7. **Checkpoint report** — after each task, before starting the next, report to the human:
            - Task id completed
            - Commit hash and message (single task id only)
            - Key files touched
            - Kanban: previous task → Completed; next task → In Progress
            If you cannot show this, you MUST NOT proceed to the next task.

    7.6. **Kanban**: The board updates only from task `.md` changes. Each loop iteration must move one card Planned → In Progress → Completed. If In Progress is empty while you code, you skipped a step.

    7.7. **Stop and hand off** when:
        - A step requires human approval (`requires_human`, approver gate)
        - You hit a blocker you cannot resolve
        - Build, test, or lint fails after a reasonable retry
        - You need a product/architecture decision — add to Unplanned Tasks and run **awp handoff**

    7.8. **Done**: When `tasks/planned/` is empty, report completed task ids and commit list (one per task). A final docs-only commit is optional; **do not** use it to land all application code.

8. **refine**

    8.1. **When**: After **init**, especially when `user.md` exists and is comprehensive; before **awp start** or **awp auto**; when a parent task (e.g. `1.0`) is too large for one commit cycle.

    8.2. **Purpose**: Turn agreed scope (`base.md`) + detailed user input (`user.md`) into **small, executable** planned tasks with clear acceptance criteria — without scope creep.

    8.3. **Read first** (in order):
        8.3.1. `user.md` — raw user brief (source material)
        8.3.2. `base.md` — agreed contract (scope boundary)
        8.3.3. `requirements.md`, `backlog.md`, `tech-specs.md`
        8.3.4. Next parent task in `tasks/planned/` (lowest id without completed children, usually `N.0`)

    8.4. **Refine procedure**:
        8.4.1. Identify the **next parent** task id (e.g. `1.0`) — only refine **one parent per refine cycle** unless the human asks for more
        8.4.2. Extract from `user.md` only items that belong to this phase and are **in scope** per `base.md`
        8.4.3. If the parent has **no** child tasks (`1.1`, `1.2`, …) and user detail is rich → create subtasks:
            - `1.1`, `1.2`, … under `tasks/planned/` (max ~8 per parent)
            - Each subtask: title, description from user text, acceptance criteria, dependencies (`1.2` depends on `1.1`)
            - Parent `1.0` becomes a **container** — complete only when all children are done
        8.4.4. If subtasks already exist → review/update descriptions and acceptance criteria from `user.md`; do not duplicate work
        8.4.5. Work **not** in `base.md` scope → `tasks/unplanned/task-U-*.md`, not planned/
        8.4.6. **Present the slice to the human** — list task ids, titles, acceptance criteria; ask for approval
        8.4.7. You MAY NOT run **awp start** or write application code until the human approves the slice (or explicitly skips refine)

    8.5. **Sizing rules** (backlog recipe §2.9):
        - One Kanban card ≈ one `awp next` cycle ≈ one commit
        - Break down when: > 8 hours, multiple components, vague criteria, or > 200 words in description
        - Each subtask must be independently testable

    8.6. **After approval**:
        8.6.1. Save task `.md` files; run `backlog_sync` (or `cd agentic-sdlc/kanban && npm run sync`) so Kanban updates
        8.6.2. Suggest **`awp start`** on the first executable task (`1.1` if subtasks exist, else `1.0`)

    8.7. **Init already used user.md**: `init` may have created subtasks from `user.md` heuristics. **awp refine** is still required to validate, adjust slices, and get human approval before coding.

9. **test**

    9.1. **When**: After implementation on the active task; before **awp next**; when the human says `awp test`; in CI-like verification loops during **awp auto** (per task, before that task's completion commit).

    9.2. **Readiness**: Identify the **active task id** (In Progress on Kanban). Run **awp check** if context is stale.

    9.3. **Run** (project-appropriate — use `package.json` scripts when present):
        9.3.1. Unit / component tests (`npm test`, `npm run test`, etc.)
        9.3.2. Typecheck and linter when available
        9.3.3. Smoke or manual check only when no automated suite exists — document what you ran

    9.4. **On success — MUST commit** (this is mandatory, not optional):
        9.4.1. Execute **awp commit** immediately after a green run
        9.4.2. Message: `test(scope taskId): subject` — e.g. `test(console 2.0): add map tab render tests`
        9.4.3. Include new/updated test files and any small test-only config in the commit
        9.4.4. Append `## Activity` on the active task `.md` (e.g. "Tests passed — committed")
        9.4.5. **Do not** call **awp next** — **test** verifies and commits evidence; **next** advances the task

    9.5. **On failure**:
        9.5.1. **Do not commit** failing code or broken tests
        9.5.2. Report failures to the human with logs
        9.5.3. Run **awp fix** for in-scope failures, or **awp handoff** if blocked

    9.6. **Testing reference** (what to cover when choosing tests):
        9.6.1. **Unit** — components/modules, props, state, coverage on critical paths
        9.6.2. **Integration** — APIs, data flow, auth, error handling
        9.6.3. **E2E** — core user journeys, responsive/cross-browser when relevant
        9.6.4. **Performance / a11y / security** — when acceptance criteria or task requires it

10. **fix**

    10.1. **When**: Test/lint/build failure; bug found in **awp check**; regression blocking active acceptance criteria; human says `awp fix`.

    10.2. **Scope** (pick one before coding):
        10.2.1. **Active task** — fix required to complete current In Progress task → commit `fix(scope taskId): …`
        10.2.2. **Out of scope** — ask human first → unplanned `U-n` in `tasks/unplanned/` → commit `fix(scope U-n): …`; log in AWP.md Unplanned Tasks

    10.3. **Procedure**:
        10.3.1. Reproduce the issue; state root cause briefly
        10.3.2. Implement minimal fix (no scope creep)
        10.3.3. Re-run tests or verification that failed before

    10.4. **On success — MUST commit** (mandatory):
        10.4.1. Execute **awp commit** immediately after the fix is verified
        10.4.2. Message: `fix(scope taskId): subject` — e.g. `fix(map 2.0): handle null facility id`
        10.4.3. Append `## Activity` on the task `.md` (active or `U-n`)
        10.4.4. Task stays **In Progress** (or unplanned open) — fixing does not complete the task; use **awp next** when acceptance criteria are met

    10.5. **On failure**: Do not commit partial fixes. Document attempts; run **awp handoff** or add **Unplanned Tasks** / **Risks** as needed.

11. **error_recovery**

    11.1. If you realise you have violated AWP procedures, you MUST immediately:
        11.1.1. Stop all current actions
        11.1.2. Acknowledge the violation to the human
        11.1.3. Ask for permission to correct the error
        11.1.4. Follow proper AWP procedures going forward

    11.2. Document the violation in the Unplanned Tasks section for future reference.

    11.3. Ask the human how they want to proceed with the error.

    11.4. Examples of AWP violations:
        - Skipping AWP.md reading when seeing "awp" commands
        - Making assumptions about command scope
        - Skipping the update → commit → next sequence
        - Creating multiple tasks without clarification
        - Not asking for clarification on ambiguous commands

## Commit Standard

@commitStandard.md
```

**Placeholder Mappings**:
- `{{GOAL}}` → Project goals/features (numbered list format: "1. Goal1\n2. Goal2")
- `{{OVERVIEW}}` → Project phases (numbered list format: "1. Phase1\n2. Phase2")
- `{{TECHNOLOGY}}` → Technology stack (numbered list format: "1. Tech1\n2. Tech2")
- `{{OUTCOME}}` → Success criteria (numbered list format: "1. Outcome1\n2. Outcome2")
- `{{BACKLOG_REFERENCE}}` → Reference to detailed backlog (markdown link format)
