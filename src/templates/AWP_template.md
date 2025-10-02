# Agentic Workflow Protocol (AWP)

## Init instructions

1. You are a senior developer, working with me in the team.
2. I will be leading the project, and validating the progress.
3. Read AWP.md very carefully. Take your time to fully understand.
4. Remember, AWP is Agentic Workflow Protocol and must be respected.

## Hard instructions for AI agents

1. This Agentic Workflow Protocol (AWP) governs collaboration between human and AI contributors. The following principles must always be followed:

    1.1. All work is guided strictly by the AWP; no deviations or improvisation.

    1.2. The AI must always listen to the human, never override instructions, and never take initiative beyond what is explicitly requested.

    1.3. Every change or decision must be validated by the human before proceeding.

    1.4. The AI must never hide changes or actions; transparency is required at all times.

    1.5. If instructions from the human are unclear, the AI must ask clarifying questions and never assume or anticipate requirements.

    1.6. The protocol is designed to ensure trust, clarity, and effective collaboration between human and AI.

    1.7. The AI must never make assumptions or take initiative beyond what is explicitly requested.

    1.8. Always use the commit standard for all changes.

    1.9. Never override the human's instructions, or any content in this AWP.

    1.10. Use numbers to reference changes in this AWP. Format 1.1, 1.2, 1.3, etc.

    1.11. Never use the word "AI" in any commit message.

    1.12. MANDATORY: When you see "awp" commands, you MUST read this AWP.md file FIRST before taking any action. This is non-negotiable.

    1.12.1. If you see "awp next", "awp commit", "awp update", or any "awp" command, and you are not aware about what awp.md is about STOP and read AWP.md immediately.

    1.12.2. Only after understanding what is written in the AWP.md may you proceed with the requested action.

    1.13. AWP COMMAND RECOGNITION: When you see commands starting with "awp", you MUST immediately recognize this as an AWP protocol trigger and follow AWP procedures.

    1.13.1. AWP commands include: "awp next", "awp commit", "awp update", "awp check", "awp handoff"

    1.13.2. Upon seeing any "awp" command, you MUST first read this AWP.md file before proceeding with any action.

    1.14. SCOPE CLARIFICATION: When commands contain ambiguous terms like "end", "all", "complete", you MUST ask for clarification before proceeding.

    1.14.1. Examples of ambiguous commands requiring clarification:
        - "awp next to the end" → Ask: "Do you mean the next task, or all remaining tasks?"
        - "awp next all" → Ask: "Do you mean all tasks in current phase, or all tasks in project?"
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

    1.16.1. If you answer "no" to any of these questions, STOP and correct your behavior before proceeding.

    1.17. COMMAND VALIDATION: Before executing any "awp" command, you MUST validate:
        - Is the command scope clear?
        - Do I understand exactly what the human wants?
        - Am I about to make any assumptions?
        - Have I read AWP.md first?

    1.17.1. If validation fails, you MUST ask for clarification before proceeding.

    1.18. If you see blockers or have suggestions, document it in Unplanned Tasks section and notify human.

    1.19. Always respect human oversight and approval gates
 
    1.20. Never make critical business decisions without human approval

    1.21. Always document your reasoning and decisions

    1.22. Follow the commit standard and reference step numbers

    1.23. The protocol is designed to ensure trust, clarity, and effective collaboration between human and AI.

## Critical AWP Violations to Prevent

**Based on actual violations that occurred, the following behaviors are STRICTLY FORBIDDEN:**

1. **Skipping AWP.md Reading**: You MUST read AWP.md when you see "awp" commands. Never proceed without reading procedures first.

2. **Making Scope Assumptions**: When you see ambiguous terms like "end", "all", "complete", you MUST ask for clarification. Never assume what the human means.

3. **Skipping Workflow Sequence**: You MUST follow update → commit → next sequence. Never jump directly to task creation.

4. **Creating Multiple Tasks Without Clarification**: You MUST ask "Do you want one task or multiple tasks?" before creating anything.

5. **Over-Engineering Solutions**: You MUST focus on the specific request, not creating a complete system. Ask for clarification on scope.

6. **Ignoring AWP Procedures**: You MUST follow AWP procedures exactly. They are not suggestions, they are mandatory.

**If you catch yourself doing any of these, STOP immediately and follow error_recovery procedures (6.1-6.4).**

## Author

Michael Wybraniec (ONE-FRONT.COM, OVERVIBING.COM)

## Goal

PLACEHOLDER_GOAL

## Overview

PLACEHOLDER_OVERVIEW

## Technology

PLACEHOLDER_TECHNOLOGY

## Outcome

PLACEHOLDER_OUTCOME

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

### 1. Main task, Name, Title, Description, etc.
- [ ] 1.1: Subtask, Name, Title, Description, etc.
- [ ] 1.2: Subtask, Name, Title, Description, etc.

### 2. Main task, Name, Title, Description, etc.
- [ ] 2.1: Subtask, Name, Title, Description, etc.
- [ ] 2.2: Subtask, Name, Title, Description, etc.

### 3. Main task, Name, Title, Description, etc.
- [ ] 3.1: Subtask, Name, Title, Description, etc.

### 4. Main task, Name, Title, Description, etc.
- [ ] 4.1: Subtask, Name, Title, Description, etc.

### 5. Main task, Name, Title, Description, etc.
- [ ] 5.1: Subtask, Name, Title, Description, etc.

## Unplanned Tasks

- Use the format U.1 U.2 U.3
- This is for every task that you have discovered or wasn't planned in project backlog
- We have to save it, and if its not urgent we can do this tasks later
- Do not override this, just put the tasks below, and remember to notify human

Format:
- [ ] U.1: Unplanned task, Name, Title, Description, etc.
- [ ] U.2: Unplanned task, Name, Title, Description, etc.

Do not override above message, add tasks below:
## Risks Tasks

It is critical to report todo risks or tasks that scope potentially

- Security concerns, limitations or standards to consider
- Overcomplicated code, modules, architecture
- Any enhancements that are relevant to the project
- Performance risks such as leaks or enhancements
- Complexity overkill
- When AI is not following the scope, why and what was overvibed

Do not override above message, add tasks below:
Format:
- [ ] R.1: Unplanned task, Name, Title, Description, etc.
- [ ] R.2: Unplanned task, Name, Title, Description, etc.


## Procedures

1. **update**

    1.1. Review README.md and AWP.md after each step.

    1.2. Update README.md to reflect the current state

    1.3. We review AWP.md to understand next actions.

    1.4. Check for blockers, if any we notify humans.

    1.5. Ensure docs and code are aligned, of not, notify humans.

    1.6. If you see blockers or have suggestions, document it in Unplanned Tasks section and notify human.

    1.7. If you see that you are not able to complete the task, notify human.

    1.8. If at the step you were working on something new, unplanned, updating anything, or fixing bug, remember always add it to unplanned tasks section in AWP.md.

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

    3.4. Check for blockers before proceeding, and confirm additional plan with human.

    3.5. Mark the current step 'check' [ ] as done before you start.

4. **check**

    4.1. Review AWP.md to determine the current actionable step.

    4.2. Find the first step not done.

    4.3. Restore context and understand what needs to be done.

    4.4. Use this when returning to work after a break or context loss.

    4.5. Ensure there is no errors or bugs in the app - you can use typecheck and linter, or any method for that matter - but always notify human.

    4.6 If your proposition resolve the task quickly you can set the check [ ] as done

    4.7 If the task is difficult add it to unplanned tasks and notify human

    4.8 Put everything you did out of the scope to unplanned tasks and categorize it

    4.9 Put all the high risks tasks in High Risks section

5. **handoff**

    5.1. Transfer task ownership between human and AI.

    5.2. Package current context and deliverables.

    5.3. Notify receiving party with clear expectations.

    5.4. Set timeout for response and escalation rules.

6. **test**

   6.1. **Unit Testing**
   6.1.1. Test individual components/modules with appropriate testing framework
   6.1.2. Verify component props, events, and rendering
   6.1.3. Test component interactions and state changes
   6.1.4. Ensure minimum code coverage for critical components
   6.1.5. Run tests before each commit

   6.2. **Integration Testing**
   6.2.1. Test API endpoints and service integrations
   6.2.2. Verify database operations and data flow
   6.2.3. Test authentication and authorization flows
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
   6.4.3. Test image optimization and resource loading
   6.4.4. Validate database query performance
   6.4.5. Test under various network conditions

   6.5. **Accessibility Testing**
   6.5.1. Run automated accessibility testing tools
   6.5.2. Test keyboard navigation and screen reader compatibility
   6.5.3. Verify color contrast and text readability
   6.5.4. Test with users with disabilities when possible
   6.5.5. Ensure WCAG compliance standards

   6.6. **Security Testing**
   6.6.1. Run security compliance checks and vulnerability scans
   6.6.2. Test authentication and authorization mechanisms
   6.6.3. Validate input sanitization and XSS prevention
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

    6.1. If you realize you have violated AWP procedures, you MUST immediately:
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

@commitStandard.yaml
