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
  - Procedures (update, commit, next, check, handoff, test, error_recovery)
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

    1.13.1. AWP commands include: "awp next", "awp commit", "awp update", "awp check", "awp handoff"

    1.13.2. Upon seeing any "awp" command, you MUST first read this AWP.md file before proceeding with any action.

    1.14. SCOPE CLARIFICATION: When commands contain ambiguous terms like "end", "all", or "complete", you MUST ask for clarification before proceeding.

    1.14.1. Examples of ambiguous commands requiring clarification:
        - "awp next to the end" → Ask: "Do you mean the next task, or all remaining tasks?"
        - "awp next all" → Ask: "Do you mean all tasks in the current phase, or all tasks in the project?"
        - "awp next complete" → Ask: "Do you mean complete current task, or complete entire phase?"

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

**If you catch yourself doing any of these, STOP immediately and follow error_recovery procedures (6.1-6.4).**

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

    2.4. Follow conventional commit standards.

    2.5. Include relevant files.

3.  **next**

    3.1. MANDATORY SEQUENCE: You MUST follow this exact sequence for "awp next":
        3.1.1. First: Execute "awp update" (read AWP.md, check status, identify blockers)
        3.1.2. Second: Execute "awp commit" (commit any pending changes)
        3.1.3. Third: Execute "awp next" (move to next actionable step)
        3.1.4. You MAY NOT skip any step in this sequence.

    3.2. If you attempt to execute "awp next" without first completing "awp update" and "awp commit", you MUST stop and ask the human for permission to skip steps.

    3.3. Identify the next actionable step and begin work.

    3.4. Check for blockers before proceeding, and confirm the additional plan with the human.

    3.5. Mark the current step 'check' [ ] as done before you start.

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

5. **handoff**

    5.1. Transfer task ownership between human and AI.

    5.2. Package current context and deliverables.

    5.3. Notify the receiving party with clear expectations.

    5.4. Set timeout for response and escalation rules.

6. **test**

   6.1. **Unit Testing**
   6.1.1. Test individual components/modules with an appropriate testing framework
   6.1.2. Verify component props, events, and rendering
   6.1.3. Test component interactions and state changes
   6.1.4. Ensure minimum code coverage for critical components
   6.1.5. Run tests before each commit

   6.2. **Integration Testing**
   6.2.1. Test API endpoints and service integrations
   6.2.2. Verify database operations and data flow
   6.2.3. Test authentication and authorisation flows
   6.2.4. Validate API response formats and error handling
   6.2.5. Test real-time features and external integrations

   6.3. **E2E Testing**
   6.3.1. Test complete user journeys with E2E testing framework
   6.3.2. Verify core application flows and business logic
   6.3.3. Test multilingual functionality if applicable
   6.3.4. Validate responsive design and cross-browser compatibility
   6.3.5. Test offline functionality if required

   6.4. **Performance Testing**
   6.4.1. Run performance audits (Lighthouse, WebPageTest, etc.)
   6.4.2. Monitor bundle size and loading performance
   6.4.3. Test image optimisation and resource loading
   6.4.4. Validate database query performance
   6.4.5. Test under various network conditions

   6.5. **Accessibility Testing**
   6.5.1. Run automated accessibility testing tools
   6.5.2. Test keyboard navigation and screen reader compatibility
   6.5.3. Verify colour contrast and text readability
   6.5.4. Test with users with disabilities when possible
   6.5.5. Ensure WCAG compliance standards

   6.6. **Security Testing**
   6.6.1. Run security compliance checks and vulnerability scans
   6.6.2. Test authentication and authorisation mechanisms
   6.6.3. Validate input sanitisation and XSS prevention
   6.6.4. Test API rate limiting and abuse prevention
   6.6.5. Verify data encryption and privacy compliance

   6.7. **Localization Testing**
   6.7.1. Test all content in supported languages
   6.7.2. Verify date/time formats for target timezones
   6.7.3. Test currency formatting for target markets
   6.7.4. Validate cultural appropriateness of translations
   6.7.5. Test with native speakers when possible

   6.8. **Mobile Testing**
   6.8.1. Test on target market devices and browsers
   6.8.2. Verify touch interactions and mobile gestures
   6.8.3. Test mobile keyboard and form inputs
   6.8.4. Validate offline functionality if applicable
   6.8.5. Test mobile-specific features and flows

7. **error_recovery**

    6.1. If you realise you have violated AWP procedures, you MUST immediately:
        6.1.1. Stop all current actions
        6.1.2. Acknowledge the violation to the human
        6.1.3. Ask for permission to correct the error
        6.1.4. Follow proper AWP procedures going forward

    6.2. Document the violation in the Unplanned Tasks section for future reference.

    6.3. Ask the human how they want to proceed with the error.

    6.4. Examples of AWP violations:
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
