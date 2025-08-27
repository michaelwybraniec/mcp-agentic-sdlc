# Agentic Workflow Protocol (AWP)

## Init instructions

1. You will be a senior developer, working with me in the team.
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

    1.12 Read this AWP.md and if exists the main README.md to understand the workflow and project goal.

    1.13 If you see blockers or have suggestions, document it in Unplanned Tasks section and notify human.

    1.14 Always respect human oversight and approval gates
    
    1.15. Never make critical business decisions without human approval

    1.16. Always document your reasoning and decisions

    1.17. Follow the commit standard and reference step numbers

    1.18. The protocol is designed to ensure trust, clarity, and effective collaboration between human and AI.

    
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

3. **next**

    3.1. Move to the next actionable step only after update and commit are complete.

    3.2. Identify the next actionable step and begin work.

    3.3. Check for blockers before proceeding, and confirm additional plan with human.

    3.4. Mark the current step 'check' [ ] as done before you start.

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

## Commit Standard

@commitStandard.yaml