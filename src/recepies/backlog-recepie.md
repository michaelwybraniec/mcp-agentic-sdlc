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

## 3. Task Schema Definition (Enum / JSON Schema)

  ```json
  {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Project Task",
    "type": "object",
    "properties": {
      "id": {"type": "string"},
      "title": {"type": "string"},
      "description": {"type": "string"},
      "owner": {"type": "string"},
      "dependencies": {"type": "array", "items": {"type": "string"}},
      "priority": {"type": "string", "enum": ["critical", "high", "medium", "low"]},
      "estimated_effort": {"type": "string"},
      "testing": {"type": "string"},
      "security_review": {"type": "string"},
      "risk": {"type": "string"},
      "notes": {"type": "string"},
      "strengths": {"type": "string"},
      "completed": {"type": "boolean"},
      "children": {"type": "array", "items": {"$ref": "#"}}
    },
    "required": ["id", "title", "description", "priority", "completed"]
  }
  ```

## 4. Project Backlog Example

```json
[
  {
    "id": "1",
    "title": "Set up Project Repository",
    "description": "Create Git repository with backend and frontend folder structure.",
    "owner": "Dev Team",
    "dependencies": [],
    "priority": "high",
    "estimated_effort": "4h",
    "testing": "Confirm repo exists and README is added",
    "security_review": "Check permissions and branch protection",
    "risk": "Misconfigured repo may block future commits",
    "notes": "",
    "completed": false
  },
  {
    "id": "1.1",
    "title": "Initialize Backend Environment",
    "description": "Set up Node.js backend, install dependencies, and configure environment variables.",
    "owner": "Backend Dev",
    "dependencies": ["1"],
    "priority": "high",
    "estimated_effort": "3h",
    "testing": "Run basic server, check endpoints respond",
    "security_review": "Ensure no secrets are hardcoded",
    "risk": "Misconfiguration could block backend work",
    "notes": "",
    "completed": false
  },
  {
    "id": "1.2",
    "title": "Initialize Frontend Environment",
    "description": "Set up React project and configure linters and package manager.",
    "owner": "Frontend Dev",
    "dependencies": ["1"],
    "priority": "medium",
    "estimated_effort": "2h",
    "testing": "Run dev server, confirm default page renders",
    "security_review": "Check CORS and dev tools configuration",
    "risk": "Incorrect setup can break frontend development",
    "notes": "",
    "completed": false
  },
  {
    "id": "2",
    "title": "Implement Core Feature",
    "description": "Develop main business logic module and expose API endpoints.",
    "owner": "Backend Dev",
    "dependencies": ["1.1"],
    "priority": "critical",
    "estimated_effort": "8h",
    "testing": "Unit tests and integration tests",
    "security_review": "Validate input, prevent injection attacks",
    "risk": "Critical for MVP; delays block other features",
    "notes": "",
    "completed": false
  },
  {
    "id": "2.1",
    "title": "Add Frontend Integration",
    "description": "Connect frontend UI with backend API and ensure proper data flow.",
    "owner": "Frontend Dev",
    "dependencies": ["1.2", "2"],
    "priority": "high",
    "estimated_effort": "5h",
    "testing": "Functional UI tests, manual review",
    "security_review": "Check CORS and API security",
    "risk": "Broken integration affects user experience",
    "notes": "",
    "completed": false
  }
]
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

### Example Unplanned Task

```json
{
  "id": "U-1",
  "title": "Add User Authentication",
  "description": "Originally not planned, but required for security compliance.",
  "owner": "Backend Dev",
  "dependencies": ["1.1"],
  "priority": "high",
  "estimated_effort": "6h",
  "testing": "Test login/logout flows and session management",
  "security_review": "Critical - implement secure authentication",
  "risk": "Without auth, app cannot go to production",
  "notes": "Unplanned requirement discovered during security review",
  "completed": false
}
```

## 6. Task Slicing & Hierarchy

6.1 Break large tasks into smaller subtasks (Feature → Module → Task → Sub-task)

6.2 Use explicit dependencies to avoid AI needing external context

6.3 Include testing and security for each task without overkill

6.4 Track risks and strengths for planning and prioritization

## 7. Key Takeaways

7.1 JSON + hierarchical Markdown = dual-format backlog for humans & AI

7.2 Tasks are self-contained, minimizing AI token usage

7.3 Explicit dependencies allow AI to reason about execution order

7.4 Completed, testing, security, risk fields help AI generate code, documentation, or QA checks

7.5 Hierarchical IDs enable easy slicing into subtasks

7.6 U- prefix system prevents scope creep and maintains project boundaries

## 8. File Structure & Creation

8.1 **Project Structure**: Work within `agentic-sdlc/` directory - if is not created stop and ask the user if he initiated project with Agentic SDLC.

8.2 **Main Backlog File**: Create `project-backlog.json` with two main sections:

```json
{
  "backlog": [
    "Planned tasks with IDs: 1, 1.1, 1.1.1, 2, 2.1, etc."
  ],
  "unplanned": [
    "Unplanned tasks with IDs: U-1, U-1.1, U-2, etc."
  ]
}
```

## 8.3 **File Creation Process**

8.3.1 Start with empty `project-backlog.json` in `agentic-sdlc/` directory

8.3.2 Add tasks to `backlog` section as they are planned

8.3.3 Move tasks to `unplanned` section when scope expands

8.3.4 Use version control to track changes

## 8.4 **AI Instructions**: When AI creates tasks, it should

8.4.1 Add to appropriate section (`backlog` or `unplanned`)

8.4.2 Use correct ID format (numbered or U- prefixed)

8.4.3 Maintain JSON structure and validation

## 9. Implementation & AI-Driven Backlog Tools

9.1 **Implementation**: Store tasks as JSON files, use version control for tracking

9.2 **AI Integration**: Use AI to convert text descriptions into JSON tasks automatically

9.3 **Task Slicing**: AI can suggest task slicing or sub-tasks if description is large

9.4 **Validation**: AI can validate dependencies, testing steps, and risk notes

9.5 **Prioritization**: AI can prioritize tasks based on metadata (priority, effort, risk)

9.6 **Scope Management**: AI can identify when tasks exceed original scope and flag for U- prefix

9.7 **Tools**: Compatible with project management tools that accept JSON imports
