# Backlog Recipe

This canvas provides instructions on how to create, structure, and execute a software project backlog.  
It is **topic-agnostic** and designed to be both **human- and AI-friendly**.

## 1. Task Structure

1.1 Use **hierarchical numbering** for tasks:

  1.1.1 Parent task: main feature or epic → `1`, `2`, `3`  

  1.1.2 Child task: smaller sub-tasks → `1.1`, `1.1.1`, `2.1.1`

  1.1.3 Unplanned tasks → `U-1`, `U-2`, `U-1.1`, `U-1.1.1`  

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

  1.3.11 `notes`: Optional extra info

  1.3.12 `completed`: Boolean (true/false)

  1.3.13 `children`: Optional array of sub-tasks

  1.3.14 `strengths`: Optional, why this task is valuable

## 2. Common Issues & AI Considerations

2.1 Keep each task self-contained; avoid "see previous task."

2.2 Use clear action verbs: Implement, Test, Document, Review, Deploy.

2.3 Break tasks small enough to reduce token usage for AI.

2.4 Use explicit dependencies for AI reasoning.

2.5 Include testing, security, risks, and strengths at every level.

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

### Task File: `task-1.md`
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

## Strengths
Foundation for all future development work

## Notes
Initial project setup

## Sub-tasks
- [ ] Create repository structure
- [ ] Add README.md
- [ ] Configure branch protection
```

### Task File: `task-1-1.md`
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

## Strengths
Enables backend development to begin

## Notes
Backend foundation setup

## Sub-tasks
- [ ] Install Node.js dependencies
- [ ] Configure environment variables
- [ ] Set up basic server structure
```

### Task File: `task-2.md`
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

6.1 Break large tasks into smaller subtasks (Feature → Module → Task → Sub-task)

6.2 Use explicit dependencies to avoid AI needing external context

6.3 Include testing and security for each task without overkill

6.4 Track risks and strengths for planning and prioritization

## 7. Key Takeaways

7.1 Markdown + hierarchical structure = human-readable backlog for humans & AI

7.2 Tasks are self-contained, minimizing AI token usage

7.3 Explicit dependencies allow AI to reason about execution order

7.4 Completed, testing, security, risk fields help AI generate code, documentation, or QA checks

7.5 Hierarchical IDs enable easy slicing into subtasks

7.6 U- prefix system prevents scope creep and maintains project boundaries

## 8. File Structure & Creation

8.1 **Project Structure**: Work within `agentic-sdlc/` directory - if is not created stop and ask the user if he initiated project with Agentic SDLC.

8.2 **Backlog Directory Structure**: Create a `tasks/` directory with subdirectories:

```
agentic-sdlc/
├── tasks/
│   ├── planned/          # Regular tasks (1, 1.1, 2, etc.)
│   ├── unplanned/        # U- prefixed tasks (U-1, U-1.1, etc.)
│   └── completed/        # Completed tasks (moved here when done)
├── project-backlog.md    # Main backlog index file
└── other files described in other instructions
```

**Backlog Files Created:**
- **`project-backlog.md`**: Main backlog index with links to all tasks
- **`tasks/`**: Directory containing all individual task files

8.3 **Main Backlog Index File**: Create `project-backlog.md` with task index:

```markdown
# Project Backlog

## Planned Tasks
- [ ] [Task 1: Set up Project Repository](tasks/planned/task-1.md)
- [ ] [Task 1.1: Initialize Backend Environment](tasks/planned/task-1-1.md)
- [ ] [Task 2: Implement Core Feature](tasks/planned/task-2.md)

## Unplanned Tasks
- [ ] [Task U-1: Add User Authentication](tasks/unplanned/task-U-1.md)

## Completed Tasks
- [x] [Task 0: Project Planning](tasks/completed/task-0.md)
```

## 8.4 **File Creation Process**

8.4.1 Create `tasks/` directory structure in `agentic-sdlc/`

8.4.2 Create individual task files in appropriate subdirectories

8.4.3 Update `project-backlog.md` index when adding new tasks

8.4.4 Move completed tasks to `completed/` directory

8.4.5 Use version control to track changes

## 8.5 **AI Instructions**: When AI creates the backlog structure, it should

8.5.1 **Create Backlog Directory Structure**:
   - Create `tasks/` directory with subdirectories (`planned/`, `unplanned/`, `completed/`)

8.5.2 **Create Individual Task Files**:
   - Create individual `.md` files in appropriate subdirectories
   - Use filename format: `task-[ID].md` (e.g., `task-1.md`, `task-U-1.md`)

8.5.3 **Create Main Backlog Index**:
   - Create `project-backlog.md` with links to all tasks
   - Update the index when adding new tasks

8.5.4 **Follow Backlog Standards**:
   - Use correct ID format (numbered or U- prefixed)
   - Follow the Markdown template structure exactly
   - Ensure all task files are properly linked and organized

## 9. Implementation & AI-Driven Backlog Tools

9.1 **Implementation**: Store tasks as Markdown files, use version control for tracking

9.2 **AI Integration**: Use AI to convert text descriptions into Markdown task files automatically

9.3 **Task Slicing**: AI can suggest task slicing or sub-tasks if description is large

9.4 **Validation**: AI can validate dependencies, testing steps, and risk notes

9.5 **Prioritization**: AI can prioritize tasks based on metadata (priority, effort, risk)

9.6 **Scope Management**: AI can identify when tasks exceed original scope and flag for U- prefix

9.7 **File Management**: AI can create, update, and organize task files in proper directories

9.8 **Markdown Benefits**: 
- Human-readable format
- Easy to edit in any text editor
- Version control friendly
- Can be converted to other formats if needed
- Supports rich formatting and checkboxes
