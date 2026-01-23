# POC Backlog Recipe

This canvas provides instructions on how to create, structure, and execute a POC (Proof of Concept)-focused project backlog.  
It is **framework-agnostic** (works with any methodology: Scrum, Kanban, Waterfall, etc.) and **topic-agnostic** (applies to any project type).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Integration

0.1 **Recipe Integration**: This recipe integrates with:
  - `pro-backlog-recipe.md` (base backlog structure and methodology)
  - `poc-requirements-recipe.md` (for POC requirements understanding)
  - `poc-tech-specs-recipe.md` (for POC technical specifications)

0.2 **POC Backlog Purpose**: Create POC-focused backlog with tasks only for POC proof, ensuring functional proof without production-ready quality requirements.

## 1. POC Task Structure

1.1 Use **hierarchical numbering** for tasks (same as pro-backlog-recipe.md):

  1.1.1 Level 1 (Top-level parent): POC proof point or concept → `1`, `2`, `3` (filename: `task-1.0.md`, `task-2.0.md`)

  1.1.2 Level 2 (Tasks): child tasks → `1.1`, `1.2`, `2.1` (filename: `task-1.1.md`, `task-1.2.md`)

  1.1.3 Level 3 (Subtasks): sub-tasks → `1.2.1`, `1.2.2`, `2.1.1` (filename: `task-1.2.1.md`, `task-1.2.2.md`)

  1.1.4 Unplanned tasks → `U-1`, `U-2`, `U-1.1`, `U-1.1.1` (filename: `task-U-1.md`, `task-U-1.1.md`)  

1.2. Track task execution using **checkboxes**:

  1.2.1 → completed: `false` → pending

  1.2.2 → completed: `true` → done

1.3. Each POC task should include (same structure as pro-backlog-recipe.md):

  1.3.1 `id`: Hierarchical ID  

  1.3.2 `title`: Short and precise description

  1.3.3 `description`: Detailed instructions, self-contained

  1.3.4 `owner`: Optional, responsible team or role

  1.3.5 `dependencies`: List of task IDs it relies on

  1.3.6 `priority`: Critical / High / Medium / Low (POC-critical path prioritized)

  1.3.7 `estimated_effort`: Hours or story points

  1.3.8 `testing`: Basic functional testing (proof-focused, not production QA)

  1.3.9 `security_review`: Optional for POC (unless security is the concept being proven)

  1.3.10 `risk`: Risks if task fails (POC-blocking risks highlighted)

  1.3.11 `acceptance_criteria`: Explicit "done" conditions that must be met

  1.3.12 `definition_of_done`: Checklist of requirements for task completion

  1.3.13 `measurable_outcomes`: Proof indicators (functional proof, not production metrics)

  1.3.14 `notes`: Optional extra info

  1.3.15 `completed`: Boolean (true/false)

  1.3.16 `children`: Optional array of sub-tasks

  1.3.17 `strengths`: Optional, why this task proves the concept

  1.3.18 `poc_scope`: **NEW** - Mark as POC / Future / Production

## 2. POC-Specific Considerations

2.1 **POC Scope Enforcement**: Only create tasks for POC proof points

  2.1.1 Review POC requirements to identify proof points

  2.1.2 Exclude tasks for production features from POC backlog

  2.1.3 Mark non-POC tasks clearly if they must be tracked

2.2 **POC Critical Path**: Identify and prioritize POC-critical tasks

  2.2.1 Tasks that prove the core concept are highest priority

  2.2.2 Dependencies must be managed for POC scope

  2.2.3 POC-blocking risks must be flagged immediately

2.3 **Proof-Focused Quality**: POC tasks must prove concept works

  2.3.1 Functional correctness is required (not production quality)

  2.3.2 Security review is optional (unless security is the concept)

  2.3.3 Basic testing is required to prove concept works

2.4 **POC vs. Production**: Clear separation

  2.4.1 POC tasks: Required to prove concept

  2.4.2 Production tasks: Track separately or mark clearly

  2.4.3 Future tasks: Exclude from POC backlog

2.5 Include testing, risks, acceptance criteria, definition of done, measurable outcomes, and strengths at every level.

2.6 **Scope Creep Management**: When unplanned tasks arise, create them with U- prefix

2.7 **AI Boundary Setting**: AI should not create tasks beyond POC scope without explicit U- prefix

2.8 **Task Slicing & Breakdown** (see pro-backlog-recipe.md section 6 for detailed guidelines):
   - AI MUST break down large tasks into smaller subtasks
   - Break down when: task > 200 words, > 8 hours, multiple components, unclear criteria
   - Create Level 2 tasks (1.1, 1.2) for major components
   - Create Level 3 subtasks (1.2.1, 1.2.2) for specific steps
   - Each subtask must be independently testable and completable
   - Parent tasks are only complete when ALL subtasks are complete
   - Tasks start as `[ ] Pending` - NEVER mark complete until all criteria met

## 3. POC Task Schema Definition (Markdown Format)

Each POC task should be created as a separate Markdown file with the following structure (based on pro-backlog-recipe.md with POC adaptations):

```markdown
# Task ID: [hierarchical-id]
# Title: [short-description]
# Status: [ ] Pending / [x] Completed
# Priority: [critical|high|medium|low]
# Owner: [responsible-team-or-role]
# Estimated Effort: [hours-or-story-points]
# POC Scope: [POC|Future|Production]

## Description
[Detailed, self-contained instructions for this POC task]

## Dependencies
- [ ] Task ID: [dependency-1]
- [ ] Task ID: [dependency-2]

## Testing Instructions
[Basic functional testing to prove concept works - proof-focused, not production QA]

## Security Review
[Security considerations - OPTIONAL for POC unless security is the concept being proven]

## Risk Assessment
[What could go wrong if this task fails - highlight POC-blocking risks]

## Acceptance Criteria
[Explicit "done" conditions - what must be true to prove the concept works]
- [ ] Criterion 1: [Specific, testable condition]
- [ ] Criterion 2: [Specific, testable condition]
- [ ] Criterion 3: [Specific, testable condition]

## Definition of Done
[Checklist of requirements that must be met before task completion - proof-focused]
- [ ] Concept proven to work (functional proof)
- [ ] Basic testing completed (proof-focused)
- [ ] Documentation updated (if applicable)
- [ ] Security review completed (if applicable and relevant to POC)
- [ ] All acceptance criteria met
- [ ] Measurable outcomes achieved (proof indicators)
- [ ] Stakeholder approval obtained (if required)

## Measurable Outcomes
[Proof indicators - focus on functional proof, not production metrics]
- **Verification Criteria**: [Specific check that proves concept works: yes/no, pass/fail]
- **Observable Outcomes**: [What should be visible, working, or demonstrable to prove concept]
- **Proof Indicators**: [Specific evidence that concept is proven]
- **Completion Indicators**: [Specific deliverables, artifacts, or states that indicate proof]

## Notes
[Optional additional information]

## Strengths
[Why this task proves the concept]

## POC Scope
[POC|Future|Production] - [Brief explanation of why this is POC or future/production]

## Sub-tasks (Children)
- [ ] [Sub-task 1 description]
- [ ] [Sub-task 2 description]

## Completed
[ ] Pending / [x] Completed
```

## 4. POC Backlog Creation Process

4.1 **Link to POC Requirements**:

  4.1.1 Review `backlog-<name>/poc/requirements.md` to identify POC proof points

  4.1.2 Map POC requirements to backlog tasks

  4.1.3 Ensure all POC requirements have corresponding tasks

4.2 **POC Task Identification**:

  4.2.1 Create tasks only for POC proof points

  4.2.2 Exclude tasks for production features from POC backlog

  4.2.3 Mark POC-critical path tasks

4.3 **POC Task Prioritization**:

  4.3.1 Prioritize tasks critical for proving the concept

  4.3.2 Identify POC-critical path

  4.3.3 Manage dependencies for POC scope

4.4 **POC Backlog Structure**:

  4.4.1 Create separate POC backlog or mark POC tasks clearly

  4.4.2 Link tasks to POC requirements

  4.4.3 Track POC progress separately

## 5. File Structure & Creation

5.1 **Project Structure**: Work within `agentic-sdlc/` directory - if is not created stop and ask the user if he initiated project with Agentic SDLC.

5.2 **POC Backlog Directory Structure**: Create structure within `backlog-<name>/poc/`:

```
agentic-sdlc/
├── backlog-<name>/
│   └── poc/
│       ├── requirements.md          # POC requirements
│       ├── backlog.md               # POC backlog index file
│       ├── tech-specs.md            # POC tech specs
│       └── tasks/
│           ├── planned/          # All tasks flat: task-1.0.md, task-1.1.md, task-1.2.1.md, etc.
│           ├── unplanned/        # U- prefixed tasks: task-U-1.md, task-U-1.1.md, etc.
│           └── completed/        # Completed tasks (moved here when done)
└── other files described in other instructions
```

**POC Backlog Files Created:**
- **`backlog-<name>/poc/backlog.md`**: POC backlog index with links to all POC tasks
- **`backlog-<name>/poc/tasks/`**: Directory containing all individual POC task files

5.3 **Main POC Backlog Index File**: Create `backlog-<name>/poc/backlog.md` with task index:

```markdown
# POC Backlog

## POC Tasks
- [ ] [Task 1: POC Proof Point 1](tasks/planned/task-1.0.md)
- [ ] [Task 1.1: POC Proof Point 1 Subtask](tasks/planned/task-1.1.md)
- [ ] [Task 1.2: POC Proof Point 1 Additional Task](tasks/planned/task-1.2.md)
- [ ] [Task 1.2.1: POC Proof Point 1 Subtask Detail](tasks/planned/task-1.2.1.md)
- [ ] [Task 2: POC Proof Point 2](tasks/planned/task-2.0.md)

## Unplanned Tasks
- [ ] [Task U-1: Unplanned POC Task](tasks/unplanned/task-U-1.md)

## Completed Tasks
- [x] [Task 0: POC Planning](tasks/completed/task-0.md)

---
**Note**: This backlog contains only POC-scoped tasks. Production tasks are tracked separately.
**Location**: `backlog-<name>/poc/backlog.md`
```

## 6. Key Takeaways

6.1 POC backlog follows pro-backlog-recipe.md structure but filtered to POC scope only

6.2 POC tasks must prove concept works (functional proof, not production quality)

6.3 POC-critical path tasks are highest priority

6.4 POC tasks require basic testing to prove concept, but not production QA

6.5 Clear separation between POC tasks and production tasks

6.6 POC backlog links to POC requirements and POC tech specs

## 7. AI Considerations

7.1 **How AI Should Use This Recipe**:

  7.1.1 Read `poc-requirements-recipe.md` to understand POC scope

  7.1.2 Read `pro-backlog-recipe.md` for base backlog structure

  7.1.3 Use this recipe to create POC-focused backlog

  7.1.4 Maintain traceability between POC requirements and POC tasks

7.2 **POC Backlog Generation**:

  7.2.1 AI should create backlog tasks only for POC proof points

  7.2.2 AI should flag when tasks suggest scope expansion beyond POC

  7.2.3 AI should prioritize POC-critical path tasks

7.3 **AI Boundary Setting**:

  7.3.1 AI should not expand scope beyond POC requirements

  7.3.2 AI should flag when tasks suggest scope expansion

  7.3.3 AI should maintain proof-focused approach for POC (not production-ready)

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
- `{{GOALS_LIST}}` → Project proof points/objectives (comma-separated)
- `{{TECHNOLOGY_LIST}}` → Technologies (comma-separated)
- `{{OUTCOME_LIST}}` → Success criteria (comma-separated)
