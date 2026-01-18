# MVP Backlog Recipe

This canvas provides instructions on how to create, structure, and execute an MVP-focused project backlog.  
It is **framework-agnostic** (works with any methodology: Scrum, Kanban, Waterfall, etc.) and **topic-agnostic** (applies to any project type).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Integration

0.1 **Recipe Integration**: This recipe integrates with:
  - `pro-backlog-recipe.md` (base backlog structure and methodology)
  - `mvp-requirements-recipe.md` (for MVP requirements understanding)
  - `mvp-tech-specs-recipe.md` (for MVP technical specifications)

0.2 **MVP Backlog Purpose**: Create MVP-focused backlog with tasks only for MVP scope features, ensuring production-ready quality for MVP delivery.

## 1. MVP Task Structure

1.1 Use **hierarchical numbering** for tasks (supports up to 3 levels, same as pro-backlog-recipe.md):

  1.1.1 Level 1 (Top-level parent): MVP feature → `1`, `2`, `3` (filename: `task-1.0.md`, `task-2.0.md`)

  1.1.2 Level 2 (Tasks): child tasks → `1.1`, `1.2`, `2.1` (filename: `task-1.1.md`, `task-1.2.md`)

  1.1.3 Level 3 (Subtasks): sub-tasks → `1.2.1`, `1.2.2`, `2.1.1` (filename: `task-1.2.1.md`, `task-1.2.2.md`)

  1.1.4 Unplanned tasks → `U-1`, `U-2`, `U-1.1`, `U-1.1.1` (filename: `task-U-1.md`, `task-U-1.1.md`)  

1.2. Track task execution using **checkboxes**:

  1.2.1 → completed: `false` → pending

  1.2.2 → completed: `true` → done

1.3. Each MVP task should include (same structure as pro-backlog-recipe.md):

  1.3.1 `id`: Hierarchical ID  

  1.3.2 `title`: Short and precise description

  1.3.3 `description`: Detailed instructions, self-contained

  1.3.4 `owner`: Optional, responsible team or role

  1.3.5 `dependencies`: List of task IDs it relies on

  1.3.6 `priority`: Critical / High / Medium / Low (MVP-critical path prioritized)

  1.3.7 `estimated_effort`: Hours or story points

  1.3.8 `testing`: QA instructions, Self-test instructions

  1.3.9 `security_review`: Check if relevant

  1.3.10 `risk`: Risks if task fails (MVP-blocking risks highlighted)

  1.3.11 `acceptance_criteria`: Explicit "done" conditions that must be met

  1.3.12 `definition_of_done`: Checklist of requirements for task completion

  1.3.13 `measurable_outcomes`: Quantifiable success metrics and KPIs

  1.3.14 `notes`: Optional extra info

  1.3.15 `completed`: Boolean (true/false)

  1.3.16 `children`: Optional array of sub-tasks

  1.3.17 `strengths`: Optional, why this task is valuable for MVP

  1.3.18 `mvp_scope`: **NEW** - Mark as MVP / Phase 2 / Phase 3 / Future

## 2. MVP-Specific Considerations

2.1 **MVP Scope Enforcement**: Only create tasks for MVP features

  2.1.1 Review MVP requirements to identify MVP features

  2.1.2 Exclude tasks for future phases from MVP backlog

  2.1.3 Mark non-MVP tasks clearly if they must be tracked

2.2 **MVP Critical Path**: Identify and prioritize MVP-critical tasks

  2.2.1 Tasks that block MVP delivery are highest priority

  2.2.2 Dependencies must be managed for MVP scope

  2.2.3 MVP-blocking risks must be flagged immediately

2.3 **Production-Ready Quality**: MVP tasks must meet production standards

  2.3.1 Quality checks are required (not optional for MVP)

  2.3.2 Security review is mandatory for MVP features

  2.3.3 Testing is required for all MVP tasks

2.4 **MVP vs. Future Phases**: Clear separation

  2.4.1 MVP tasks: Required for MVP delivery

  2.4.2 Phase 2+ tasks: Track separately or mark clearly

  2.4.3 Future tasks: Exclude from MVP backlog

2.5 Include testing, security, risks, acceptance criteria, definition of done, measurable outcomes, and strengths at every level.

2.6 **Scope Creep Management**: When unplanned tasks arise, create them with U- prefix

2.7 **AI Boundary Setting**: AI should not create tasks beyond MVP scope without explicit U- prefix

2.8 **Task Slicing & Breakdown** (see pro-backlog-recipe.md section 6 for detailed guidelines):
   - AI MUST break down large tasks into smaller subtasks
   - Break down when: task > 200 words, > 8 hours, multiple components, unclear criteria
   - Create Level 2 tasks (1.1, 1.2) for major components
   - Create Level 3 subtasks (1.2.1, 1.2.2) for specific steps
   - Each subtask must be independently testable and completable
   - Parent tasks are only complete when ALL subtasks are complete
   - Tasks start as `[ ] Pending` - NEVER mark complete until all criteria met

## 3. MVP Task Schema Definition (Markdown Format)

Each MVP task should be created as a separate Markdown file with the following structure (based on pro-backlog-recipe.md with MVP additions):

```markdown
# Task ID: [hierarchical-id]
# Title: [short-description]
# Status: [ ] Pending / [x] Completed
# Priority: [critical|high|medium|low]
# Owner: [responsible-team-or-role]
# Estimated Effort: [hours-or-story-points]
# MVP Scope: [MVP|Phase 2|Phase 3|Future]

## Description
[Detailed, self-contained instructions for this MVP task]

## Dependencies
- [ ] Task ID: [dependency-1]
- [ ] Task ID: [dependency-2]

## Testing Instructions
[QA instructions and self-test steps - REQUIRED for MVP]

## Security Review
[Security considerations and checks needed - REQUIRED for MVP]

## Risk Assessment
[What could go wrong if this task fails - highlight MVP-blocking risks]

## Acceptance Criteria
[Explicit "done" conditions - what must be true for this task to be considered complete. Adapt criteria to your project context and methodology.]
- [ ] Criterion 1: [Specific, testable condition]
- [ ] Criterion 2: [Specific, testable condition]
- [ ] Criterion 3: [Specific, testable condition]

## Definition of Done
[Checklist of requirements that must be met before task completion - adapt to your project context]
- [ ] Deliverable completed as specified
- [ ] Quality checks passed (testing, review, validation, etc.) - REQUIRED for MVP
- [ ] Documentation updated (if applicable)
- [ ] Security/compliance review completed (if applicable) - REQUIRED for MVP
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
[Why this task is valuable for MVP delivery]

## MVP Scope
[MVP|Phase 2|Phase 3|Future] - [Brief explanation of why this is MVP or future phase]

## Sub-tasks (Children)
- [ ] [Sub-task 1 description]
- [ ] [Sub-task 2 description]

## Completed
[ ] Pending / [x] Completed
```

## 4. MVP Backlog Creation Process

4.1 **Link to MVP Requirements**:

  4.1.1 Review `backlog-<name>/mvp/requirements.md` to identify MVP features

  4.1.2 Map MVP requirements to backlog tasks

  4.1.3 Ensure all MVP requirements have corresponding tasks

4.2 **MVP Task Identification**:

  4.2.1 Create tasks only for MVP features

  4.2.2 Exclude tasks for future phases from MVP backlog

  4.2.3 Mark MVP-critical path tasks

4.3 **MVP Task Prioritization**:

  4.3.1 Prioritize tasks critical for MVP delivery

  4.3.2 Identify MVP-critical path

  4.3.3 Manage dependencies for MVP scope

4.4 **MVP Backlog Structure**:

  4.4.1 Create separate MVP backlog or mark MVP tasks clearly

  4.4.2 Link tasks to MVP requirements

  4.4.3 Track MVP progress separately

## 5. File Structure & Creation

5.1 **Project Structure**: Work within `agentic-sdlc/` directory - if is not created stop and ask the user if he initiated project with Agentic SDLC.

5.2 **MVP Backlog Directory Structure**: Create structure within `backlog-<name>/mvp/`:

```
agentic-sdlc/
├── backlog-<name>/
│   └── mvp/
│       ├── requirements.md          # MVP requirements
│       ├── backlog.md               # MVP backlog index file
│       ├── tech-specs.md            # MVP tech specs
│       └── tasks/
│           ├── planned/          # All tasks flat: task-1.0.md, task-1.1.md, task-1.2.1.md, etc.
│           ├── unplanned/        # U- prefixed tasks: task-U-1.md, task-U-1.1.md, etc.
│           └── completed/        # Completed tasks (moved here when done)
└── other files described in other instructions
```

**MVP Backlog Files Created:**
- **`backlog-<name>/mvp/backlog.md`**: MVP backlog index with links to all MVP tasks
- **`backlog-<name>/mvp/tasks/`**: Directory containing all individual MVP task files

5.3 **Main MVP Backlog Index File**: Create `backlog-<name>/mvp/backlog.md` with task index:

```markdown
# MVP Backlog

## MVP Tasks
- [ ] [Task 1: MVP Feature 1](tasks/planned/task-1.0.md)
- [ ] [Task 1.1: MVP Feature 1 Subtask](tasks/planned/task-1.1.md)
- [ ] [Task 1.2: MVP Feature 1 Additional Task](tasks/planned/task-1.2.md)
- [ ] [Task 1.2.1: MVP Feature 1 Subtask Detail](tasks/planned/task-1.2.1.md)
- [ ] [Task 2: MVP Feature 2](tasks/planned/task-2.0.md)

## Unplanned Tasks
- [ ] [Task U-1: Unplanned MVP Task](tasks/unplanned/task-U-1.md)

## Completed Tasks
- [x] [Task 0: MVP Planning](tasks/completed/task-0.md)

---
**Note**: This backlog contains only MVP-scoped tasks. Future phase tasks are tracked separately.
**Location**: `backlog-<name>/mvp/backlog.md`
```

## 6. Key Takeaways

6.1 MVP backlog follows pro-backlog-recipe.md structure but filtered to MVP scope only

6.2 MVP tasks must meet production-ready quality standards

6.3 MVP-critical path tasks are highest priority

6.4 All MVP tasks must have testing, security review, and quality checks

6.5 Clear separation between MVP tasks and future phase tasks

6.6 MVP backlog links to MVP requirements and MVP tech specs

## 7. AI Considerations

7.1 **How AI Should Use This Recipe**:

  7.1.1 Read `mvp-requirements-recipe.md` to understand MVP scope

  7.1.2 Read `pro-backlog-recipe.md` for base backlog structure

  7.1.3 Use this recipe to create MVP-focused backlog

  7.1.4 Maintain traceability between MVP requirements and MVP tasks

7.2 **MVP Backlog Generation**:

  7.2.1 AI should create backlog tasks only for MVP features

  7.2.2 AI should flag when tasks suggest scope expansion beyond MVP

  7.2.3 AI should prioritize MVP-critical path tasks

7.3 **AI Boundary Setting**:

  7.3.1 AI should not expand scope beyond MVP requirements

  7.3.2 AI should flag when tasks suggest scope expansion

  7.3.3 AI should maintain production-ready focus for MVP

---

## 8. Template Section [FOR FILE GENERATION]

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
- `{{GOALS_LIST}}` → Project goals/features (comma-separated)
- `{{TECHNOLOGY_LIST}}` → Technologies (comma-separated)
- `{{OUTCOME_LIST}}` → Success criteria (comma-separated)
