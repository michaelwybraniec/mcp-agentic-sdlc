# Pro Backlog Recipe

This canvas provides instructions on how to create, structure, and execute a full project backlog.  
It is **framework-agnostic** (works with any methodology: Scrum, Kanban, Waterfall, etc.) and **topic-agnostic** (applies to any project type).  
Designed to be both **human- and AI-friendly**.

## 1. Task Structure

1.1 Use **hierarchical numbering** for tasks (supports up to 3 levels):

  1.1.1 Level 1 (Top-level parent): main feature → `1`, `2`, `3` (filename: `task-1.0.md`, `task-2.0.md`)

  1.1.2 Level 2 (Tasks): child tasks → `1.1`, `1.2`, `2.1` (filename: `task-1.1.md`, `task-1.2.md`)

  1.1.3 Level 3 (Subtasks): sub-tasks → `1.2.1`, `1.2.2`, `2.1.1` (filename: `task-1.2.1.md`, `task-1.2.2.md`)

  1.1.4 Unplanned tasks → `U-1`, `U-2`, `U-1.1`, `U-1.1.1` (filename: `task-U-1.md`, `task-U-1.1.md`)  

1.2. Track task execution using **checkboxes**:

  1.2.1 → completed: `false` → pending

  1.2.2 → completed: `true` → done

1.3. Each task should include:

  1.3.1 `id`: Hierarchical ID  

  1.3.2 `title`: Short and precise description

  1.3.3 `description`: Detailed instructions, self-contained

  1.3.4 `owner`: Optional, responsible team or role

  1.3.5 `dependencies`: List of task IDs it relies on

  1.3.6 `priority`: Critical / High / Medium / Low

  1.3.7 `estimated_effort`: Hours or story points

  1.3.8 `testing`: QA instructions, Self-test instructions

  1.3.9 `security_review`: Check if relevant

  1.3.10 `risk`: Risks if task fails

  1.3.11 `acceptance_criteria`: Explicit "done" conditions that must be met

  1.3.12 `definition_of_done`: Checklist of requirements for task completion

  1.3.13 `measurable_outcomes`: Quantifiable success metrics and KPIs

  1.3.14 `notes`: Optional extra info

  1.3.15 `completed`: Boolean (true/false)

  1.3.16 `children`: Optional array of sub-tasks

  1.3.17 `strengths`: Optional, why this task is valuable

## 2. Common Issues & AI Considerations

2.1 Keep each task self-contained; avoid "see previous task."

2.2 Use clear action verbs: Implement, Test, Document, Review, Deploy.

2.3 Break tasks small enough to reduce token usage for AI.

2.4 Use explicit dependencies for AI reasoning.

2.5 Include testing, security, risks, acceptance criteria, definition of done, measurable outcomes, and strengths at every level.

2.6 **Scope Creep Management**: When unplanned tasks arise, create them with U- prefix

2.7 **AI Boundary Setting**: AI should not create tasks beyond original scope without explicit U- prefix

## 3. Task Schema Definition (Markdown Format)

Each task should be created as a separate Markdown file with the following structure:

```markdown
# Task ID: [hierarchical-id]
# Title: [short-description]
# Status: [ ] Pending / [x] Completed
# Priority: [critical|high|medium|low]
# Owner: [responsible-team-or-role]
# Estimated Effort: [hours-or-story-points]

## Description
[Detailed, self-contained instructions for this task]

## Dependencies
- [ ] Task ID: [dependency-1]
- [ ] Task ID: [dependency-2]

## Testing Instructions
[QA instructions and self-test steps]

## Security Review
[Security considerations and checks needed]

## Risk Assessment
[What could go wrong if this task fails]

## Acceptance Criteria
[Explicit "done" conditions - what must be true for this task to be considered complete. Adapt criteria to your project context and methodology.]
- [ ] Criterion 1: [Specific, testable condition]
- [ ] Criterion 2: [Specific, testable condition]
- [ ] Criterion 3: [Specific, testable condition]

## Definition of Done
[Checklist of requirements that must be met before task completion - adapt to your project context]
- [ ] Deliverable completed as specified
- [ ] Quality checks passed (testing, review, validation, etc.)
- [ ] Documentation updated (if applicable)
- [ ] Security/compliance review completed (if applicable)
- [ ] All acceptance criteria met
- [ ] Measurable outcomes achieved
- [ ] Stakeholder approval obtained (if required)

## Measurable Outcomes
[Success indicators - use any combination that fits your task. Not all tasks need KPIs.]
- **Quantitative Metrics** (when applicable): [Name] - Target: [value] - Current: [value]
- **KPIs** (when applicable): [Key Performance Indicator] - Target: [value]
- **Verification Criteria**: [Specific check that can be verified: yes/no, pass/fail, exists/doesn't exist]
- **Observable Outcomes**: [What should be visible, working, or demonstrable when complete]
- **Quality Attributes**: [Performance, reliability, usability, security levels achieved]
- **Completion Indicators**: [Specific deliverables, artifacts, or states that indicate completion]

## Notes
[Optional additional information]

## Strengths
[Why this task is valuable to the project]

## Sub-tasks (Children)
- [ ] [Sub-task 1 description]
- [ ] [Sub-task 2 description]

## Completed
[ ] Pending / [x] Completed
```

## 4. Project Backlog Example (Markdown Files)

**Note**: The examples below are software development examples for illustration. Adapt the structure, acceptance criteria, definition of done, and measurable outcomes to your specific project type and methodology (e.g., marketing campaigns, research projects, hardware development, process improvements, etc.).

### Task File: `task-1.0.md` (Level 1 - Top-level parent)
```markdown
# Task ID: 1
# Title: Set up Project Repository
# Status: [ ] Pending
# Priority: high
# Owner: Dev Team
# Estimated Effort: 4h

## Description
Create Git repository with backend and frontend folder structure.

## Dependencies
- None

## Testing Instructions
Confirm repo exists and README is added

## Security Review
Check permissions and branch protection

## Risk Assessment
Misconfigured repo may block future commits

## Acceptance Criteria
- [ ] Git repository created and accessible
- [ ] Backend and frontend folder structure exists
- [ ] README.md file is present and contains project description
- [ ] Branch protection rules are configured
- [ ] Repository permissions are set correctly

## Definition of Done
- [ ] Repository structure created
- [ ] README.md added with project description
- [ ] Branch protection configured
- [ ] Permissions verified
- [ ] All acceptance criteria met

## Measurable Outcomes
- **Verification Criteria**: Repository exists and is accessible
- **Completion Indicators**: Backend and frontend folders created, README.md file present
- **Observable Outcomes**: Repository structure visible in version control, branch protection rules active

## Strengths
Foundation for all future development work

## Notes
Initial project setup

## Sub-tasks
- [ ] Create repository structure
- [ ] Add README.md
- [ ] Configure branch protection
```

### Task File: `task-1.1.md` (Level 2 - Task)
```markdown
# Task ID: 1.1
# Title: Initialize Backend Environment
# Status: [ ] Pending
# Priority: high
# Owner: Backend Dev
# Estimated Effort: 3h

## Description
Set up Node.js backend, install dependencies, and configure environment variables.

## Dependencies
- [ ] Task ID: 1

## Testing Instructions
Run basic server, check endpoints respond

## Security Review
Ensure no secrets are hardcoded

## Risk Assessment
Misconfiguration could block backend work

## Acceptance Criteria
- [ ] Node.js backend environment initialized
- [ ] All dependencies installed successfully
- [ ] Environment variables configured (no hardcoded secrets)
- [ ] Basic server starts without errors
- [ ] Health check endpoint responds with 200 status

## Definition of Done
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Server structure created
- [ ] Server starts successfully
- [ ] Health check endpoint working
- [ ] No secrets in code (security review passed)
- [ ] All acceptance criteria met

## Measurable Outcomes
- **Verification Criteria**: Server starts without errors, health endpoint returns 200 status
- **Quantitative Metrics**: Response time < 100ms (p95), 0 hardcoded secrets found
- **Observable Outcomes**: Server running, health check endpoint accessible, environment variables configured
- **Quality Attributes**: Security review passed, no secrets in codebase

## Strengths
Enables backend development to begin

## Notes
Backend foundation setup

## Sub-tasks
- [ ] Install Node.js dependencies
- [ ] Configure environment variables
- [ ] Set up basic server structure
```

### Task File: `task-2.0.md` (Level 1 - Top-level parent)
```markdown
# Task ID: 2
# Title: Implement Core Feature
# Status: [ ] Pending
# Priority: critical
# Owner: Backend Dev
# Estimated Effort: 8h

## Description
Develop main business logic module and expose API endpoints.

## Dependencies
- [ ] Task ID: 1.1

## Testing Instructions
Unit tests and integration tests

## Security Review
Validate input, prevent injection attacks

## Risk Assessment
Critical for MVP; delays block other features

## Acceptance Criteria
- [ ] Business logic module implemented
- [ ] API endpoints exposed and functional
- [ ] All unit tests passing (coverage ≥ 80%)
- [ ] Integration tests passing
- [ ] Input validation implemented
- [ ] No security vulnerabilities detected

## Definition of Done
- [ ] API endpoints designed and documented
- [ ] Business logic implemented
- [ ] Unit tests written and passing (≥80% coverage)
- [ ] Integration tests written and passing
- [ ] Input validation implemented
- [ ] Security review passed
- [ ] Code reviewed and approved
- [ ] All acceptance criteria met

## Measurable Outcomes
- **Quantitative Metrics**: Test coverage ≥ 80%, API response time < 200ms (p95)
- **Verification Criteria**: All unit tests passing, all integration tests passing, 0 critical security vulnerabilities
- **Observable Outcomes**: API endpoints respond correctly, business logic executes as expected
- **Quality Attributes**: Code reviewed and approved, security review passed

## Strengths
Core functionality for the application

## Notes
Main business logic implementation

## Sub-tasks
- [ ] Design API endpoints
- [ ] Implement business logic
- [ ] Add unit tests
- [ ] Add integration tests
```

## 5. Unplanned Tasks & Scope Management

5.1 **Unplanned Task Identification**: When scope expands beyond original plan

5.2 **U- Prefix System**: All unplanned tasks use `U-` prefix (e.g., `U-1`, `U-1.1`, `U-2.1.1`)

5.3 **AI Guidelines**:

  5.3.1 AI should flag when creating tasks that go beyond original scope

  5.3.2 AI must use U- prefix for any tasks not in original backlog

  5.3.3 AI should ask for confirmation before creating U- tasks

5.4 **Unplanned Backlog**: Maintain separate tracking of U- tasks for scope analysis

5.5 **Scope Creep Prevention**: Regular review of U- tasks to identify patterns

### Example Unplanned Task File: `task-U-1.md`

```markdown
# Task ID: U-1
# Title: Add User Authentication
# Status: [ ] Pending
# Priority: high
# Owner: Backend Dev
# Estimated Effort: 6h

## Description
Originally not planned, but required for security compliance. Implement user authentication system with login/logout functionality.

## Dependencies
- [ ] Task ID: 1.1

## Testing Instructions
Test login/logout flows and session management

## Security Review
Critical - implement secure authentication

## Risk Assessment
Without auth, app cannot go to production

## Acceptance Criteria
- [ ] Login endpoint functional with secure authentication
- [ ] Logout endpoint functional
- [ ] Session management implemented securely
- [ ] Authentication flow tested end-to-end
- [ ] Security tests passing
- [ ] No authentication vulnerabilities

## Definition of Done
- [ ] Authentication flow designed
- [ ] Login endpoint implemented and tested
- [ ] Logout endpoint implemented and tested
- [ ] Session management implemented
- [ ] Security tests written and passing
- [ ] Security review passed
- [ ] All acceptance criteria met

## Measurable Outcomes
- **Quantitative Metrics**: Authentication success rate ≥ 99.9%, 0 authentication vulnerabilities
- **Verification Criteria**: Login/logout flows functional, session management secure, all security tests passing
- **Observable Outcomes**: Users can log in, users can log out, sessions managed securely
- **Quality Attributes**: Security review passed, authentication flows tested end-to-end

## Strengths
Enables secure access to application features

## Notes
Unplanned requirement discovered during security review

## Sub-tasks
- [ ] Design authentication flow
- [ ] Implement login endpoint
- [ ] Implement logout endpoint
- [ ] Add session management
- [ ] Add security tests
```

## 6. Task Slicing & Hierarchy

6.1 **Break large tasks into smaller subtasks** (Feature → Module → Task → Sub-task)

6.2 **When to Break Down Tasks**: AI should break down tasks when:
   - Task description is longer than 200 words
   - Estimated effort exceeds 8 hours or 1 story point
   - Task involves multiple distinct deliverables or components
   - Task requires multiple skills or roles to complete
   - Task has unclear acceptance criteria or definition of done
   - Task description contains words like "and", "also", "additionally", "including" (indicating multiple parts)

6.3 **How to Break Down Tasks**: AI should:
   - Create Level 2 tasks (1.1, 1.2, etc.) for major components or phases
   - Create Level 3 subtasks (1.2.1, 1.2.2, etc.) for specific implementation steps
   - Each subtask should be independently testable and completable
   - Each subtask should have clear acceptance criteria
   - Subtasks should follow logical sequence (setup → implementation → testing → documentation)
   - Use hierarchical numbering: parent task `1.0` → child tasks `1.1`, `1.2` → subtasks `1.2.1`, `1.2.2`

6.4 **Task Size Guidelines**:
   - **Level 1 (Epic/Feature)**: 1-2 weeks, multiple components
   - **Level 2 (Task)**: 4-8 hours, single component or feature
   - **Level 3 (Subtask)**: 1-4 hours, specific implementation step
   - If a task exceeds these sizes, it MUST be broken down further

6.5 **AI Task Breakdown Process**:
   - When AI encounters a large task, it should:
     1. Analyze the task description for distinct components
     2. Identify logical breakdown points (setup, implementation, testing, etc.)
     3. Create subtask files (task-1.1.md, task-1.2.md, etc.) for each component
     4. Update the parent task to reference its subtasks
     5. Ensure each subtask is self-contained with its own acceptance criteria
   - AI should NOT mark parent tasks as complete until ALL subtasks are complete
   - AI should proactively suggest breakdowns when reviewing tasks

6.6 **Task Status Management**:
   - Tasks start as `[ ] Pending` - NEVER mark as `[x] Completed` initially
   - Only mark as `[x] Completed` when ALL acceptance criteria are met AND all subtasks (if any) are complete
   - Parent tasks (Level 1) are only complete when ALL child tasks (Level 2) are complete
   - Level 2 tasks are only complete when ALL subtasks (Level 3) are complete
   - AI must verify completion by checking acceptance criteria, definition of done, and subtask status

6.7 Use explicit dependencies to avoid AI needing external context

6.8 Include testing and security for each task without overkill

6.9 Track risks and strengths for planning and prioritization

## 7. Key Takeaways

7.1 Markdown + hierarchical structure = human-readable backlog for humans & AI

7.2 Tasks are self-contained, minimizing AI token usage

7.3 Explicit dependencies allow AI to reason about execution order

7.4 Completed, testing, security, risk, acceptance criteria, definition of done, and measurable outcomes fields help AI generate code, documentation, QA checks, and validate task completion

7.5 Hierarchical IDs enable easy slicing into subtasks

7.6 U- prefix system prevents scope creep and maintains project boundaries

## 8. File Structure & Creation

8.1 **Project Structure**: Work within `agentic-sdlc/` directory - if is not created stop and ask the user if he initiated project with Agentic SDLC.

8.2 **Backlog Directory Structure**: Create structure within `backlog-<name>/pro/`:

```
agentic-sdlc/
├── backlog-<name>/
│   └── pro/
│       ├── requirements.md          # Full requirements
│       ├── backlog.md               # Main backlog index file
│       ├── tech-specs.md            # Full tech specs
│       └── tasks/
│           ├── planned/          # All tasks flat: task-1.0.md, task-1.1.md, task-1.2.1.md, etc.
│           ├── unplanned/        # U- prefixed tasks: task-U-1.md, task-U-1.1.md, etc.
│           └── completed/        # Completed tasks (moved here when done)
└── other files described in other instructions
```

**Backlog Files Created:**
- **`backlog-<name>/pro/backlog.md`**: Main backlog index with links to all tasks
- **`backlog-<name>/pro/tasks/`**: Directory containing all individual task files

8.3 **Main Backlog Index File**: Create `backlog-<name>/pro/backlog.md` with task index:

```markdown
# Project Backlog

## Planned Tasks
- [ ] [Task 1: Set up Project Repository](tasks/planned/task-1.0.md)
- [ ] [Task 1.1: Initialize Backend Environment](tasks/planned/task-1.1.md)
- [ ] [Task 1.2: Configure Database](tasks/planned/task-1.2.md)
- [ ] [Task 1.2.1: Database Schema Design](tasks/planned/task-1.2.1.md)
- [ ] [Task 2: Implement Core Feature](tasks/planned/task-2.0.md)

## Unplanned Tasks
- [ ] [Task U-1: Add User Authentication](tasks/unplanned/task-U-1.md)

## Completed Tasks
- [x] [Task 0: Project Planning](tasks/completed/task-0.md)

---
**Location**: `backlog-<name>/pro/backlog.md`
```

## 8.4 **File Creation Process**

8.4.1 Create `tasks/` directory structure in `agentic-sdlc/`

8.4.2 Create individual task files in appropriate subdirectories

8.4.3 Update `backlog-<name>/pro/backlog.md` index when adding new tasks

8.4.4 Move completed tasks to `completed/` directory

8.4.5 Use version control to track changes

## 8.5 **AI Instructions**: When AI creates the backlog structure, it should

8.5.1 **Create Backlog Directory Structure**:
   - Create `tasks/` directory with subdirectories (`planned/`, `unplanned/`, `completed/`)

8.5.2 **Create Individual Task Files**:
   - Create individual `.md` files in `planned/` directory (flat structure, no subfolders)
   - Use filename format: `task-[ID].md` where:
     - **Level 1 (top-level parent)**: `task-1.0.md`, `task-2.0.md` (use `.0` suffix to ensure correct alphabetical sorting - parent comes before children)
     - **Level 2 (tasks)**: `task-1.1.md`, `task-1.2.md`, `task-2.1.md`
     - **Level 3 (subtasks)**: `task-1.2.1.md`, `task-1.2.2.md`, `task-2.1.1.md`
     - **Unplanned**: `task-U-1.md`, `task-U-1.1.md` (or `task-U-1.0.md` for top-level unplanned)
   - **Important**: All task files are stored flat in `planned/` folder - no nested folders for hierarchy
   - **Sorting**: Files sort correctly alphabetically: `task-1.0.md` → `task-1.1.md` → `task-1.2.md` → `task-1.2.1.md` → `task-2.0.md`

8.5.3 **Create Main Backlog Index**:
   - Create `backlog-<name>/pro/backlog.md` with links to all tasks
   - Update the index when adding new tasks

8.5.4 **Follow Backlog Standards**:
   - Use correct ID format (numbered or U- prefixed)
   - Follow the Markdown template structure exactly
   - Ensure all task files are properly linked and organized

## 9. Implementation & AI-Driven Backlog Tools

9.1 **Implementation**: Store tasks as Markdown files, use version control for tracking

9.2 **AI Integration**: Use AI to convert text descriptions into Markdown task files automatically

9.3 **Task Slicing**: AI MUST proactively break down large tasks into subtasks:
   - Analyze task size, complexity, and description length
   - Create Level 2 and Level 3 subtasks following guidelines in section 6
   - Ensure each subtask is independently completable and testable
   - Update parent task to reference created subtasks
   - Never mark parent tasks complete until all subtasks are done

9.4 **Validation**: AI can validate dependencies, testing steps, risk notes, acceptance criteria completion, definition of done checklist, and measurable outcomes

9.5 **Prioritization**: AI can prioritize tasks based on metadata (priority, effort, risk)

9.6 **Scope Management**: AI can identify when tasks exceed original scope and flag for U- prefix

9.7 **File Management**: AI can create, update, and organize task files in proper directories

9.8 **Markdown Benefits**: 
- Human-readable format
- Easy to edit in any text editor
- Version control friendly
- Can be converted to other formats if needed
- Supports rich formatting and checkboxes

---

## 10. Template Section [FOR FILE GENERATION]

**Status**: Required for automated file generation  
**Purpose**: This section contains the template with placeholders that the `init` tool uses to generate `backlog.md`

**Placeholder Format**: `{{PLACEHOLDER_NAME}}` - will be replaced with actual data during file generation

```markdown
# Project Backlog

## Planned Tasks

{{TASK_LINKS}}

## Unplanned Tasks

*No unplanned tasks yet*

## Completed Tasks

*No completed tasks yet*

---

**Project Goals:** {{GOALS_LIST}}
**Technology Stack:** {{TECHNOLOGY_LIST}}
**Success Criteria:** {{OUTCOME_LIST}}
**Location:** This backlog is located at \`backlog-<name>/<type>/backlog.md\`
```

**Placeholder Mappings**:
- `{{TASK_LINKS}}` → Task links based on phases (formatted as markdown links)
- `{{GOALS_LIST}}` → Project objectives (comma-separated)
- `{{TECHNOLOGY_LIST}}` → Technologies (comma-separated)
- `{{OUTCOME_LIST}}` → Success criteria (comma-separated)
