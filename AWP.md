# Agentic Workflow Protocol (AWP)

## Overview

The Agentic Workflow Protocol (AWP) is a standardized approach for managing and documenting workflows between humans and AI agents. It provides a structured way to maintain project context, track progress, and ensure smooth collaboration between all participants.

## Core Concepts

### 1. Workflow Tracking
- Each step is clearly numbered and documented
- Progress is tracked through explicit status updates
- Context is maintained through structured documentation

### 2. Human-AI Collaboration
- Clear ownership of tasks (human vs AI)
- Explicit handoff procedures
- Built-in approval gates for critical decisions

### 3. Context Management
- Structured documentation to prevent context loss
- Clear recovery procedures after breaks or resets
- Synchronized state between code and documentation

## Protocol Structure

### Init Section
```yaml
init:
  - Read AWP.md and README.md
  - Follow defined procedures
  - Keep documentation in sync
  - Reference step numbers in commits
```

### Steps Format
```yaml
steps:
  - number: "1"
    name: "Step Name"
    description: "What needs to be done"
    owner: "human|ai_agent"
    requires_human: true|false
    done: true|false
```

### Core Procedures

1. **update**
   - Review and update documentation
   - Mark steps as complete
   - Ensure sync between code and docs

2. **commit**
   - Use standardized commit messages
   - Reference step numbers
   - Follow conventional commit format

3. **next**
   - Identify next actionable step
   - Check for blockers
   - Begin work on next task

4. **check**
   - Review current project state
   - Restore context if needed
   - Identify current actionable items

5. **handoff**
   - Package current context
   - Clear transfer of responsibility
   - Set expectations and timeouts

## Commit Standard
```yaml
format: "type(scope step): subject"
types: [feat, fix, docs, test, chore]
rules:
  - Reference step number
  - Use imperative mood
  - Keep messages concise
examples:
  - "feat(api 2.1): add endpoint"
  - "docs(readme 3.2): update usage"
```

## Best Practices

1. **Documentation**
   - Keep AWP.md and README.md in sync
   - Update documentation before marking steps complete
   - Include context for future reference

2. **Workflow**
   - Follow procedures consistently
   - Use step numbers in all references
   - Regular status updates

3. **Collaboration**
   - Clear task ownership
   - Explicit handoffs
   - Document decisions and rationale

## Integration with MCP Agentic SDLC

AWP is designed to work seamlessly with the MCP Agentic SDLC framework:
- AWP provides the workflow protocol
- SDLC provides the development lifecycle structure
- Together they create a complete system for agentic software development

## Example Implementation

See the `examples/` directory for practical implementations of AWP in different project contexts:
- `awp1.yml`: Simple CLI tool project
- `awp2.yml`: Web application project
- `awp3.yml`: API development project
- `awp4.yml`: Library development project
- `awp5.yml`: Full-stack application project 