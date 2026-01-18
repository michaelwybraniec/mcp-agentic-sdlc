# MVP Requirements Recipe

This canvas provides instructions on how to identify, scope, and document MVP (Minimum Viable Product) requirements.  
It is **framework-agnostic** (works with any methodology: Agile, Lean, Waterfall, etc.) and **topic-agnostic** (applies to any project type: software, hardware, process, service, etc.).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Structure & Customization

0.1 This recipe uses a modular structure with clear markers:

  0.1.1 `[UNCHANGEABLE]` - Core concepts that define what MVP requirements are (rarely change)

  0.1.2 `[REPLACEABLE]` - Implementation patterns and sections that can be swapped or customized

  0.1.3 Status flags: **Required** | **Optional** | **Recommended**

0.2 **Customization Guidelines**:

  0.2.1 Sections marked `[REPLACEABLE]` can be replaced with alternative approaches

  0.2.2 Patterns (Pattern A, Pattern B, etc.) can be mixed and matched

  0.2.3 Optional sections can be skipped if not applicable to your project

  0.2.4 You can add new patterns or sections following the same structure

0.3 **Recipe Integration**: This recipe integrates with:
  - `pro-requirements-recipe.md` (base requirements structure and methodology)
  - `mvp-backlog-recipe.md` (for creating MVP-focused tasks)
  - `mvp-tech-specs-recipe.md` (for MVP technical specifications)

0.4 **MVP Requirements Purpose**: Create `backlog-<name>/mvp/requirements.md` - production-ready requirements document filtered to MVP scope only.

## 1. Core MVP Requirements Concepts [UNCHANGEABLE]

1.1 **MVP Requirements** (`backlog-<name>/mvp/requirements.md`) is a requirements document filtered to MVP scope only.

1.2 MVP Requirements characteristics:

  1.2.1 **Production-ready**: Must meet production quality standards

  1.2.2 **MVP-scoped**: Only includes requirements essential for MVP delivery

  1.2.3 **Complete in scope**: All MVP requirements fully specified

  1.2.4 **Actionable**: Clear enough to implement MVP

1.3 MVP Requirements purpose:

  1.3.1 Define WHAT must be delivered for MVP

  1.3.2 Filter full requirements to MVP scope only

  1.3.3 Enable MVP delivery with proper requirements foundation

  1.3.4 Support MVP validation and learning

1.4 MVP Requirements relationship to other documents:

  1.4.1 Source: Filtered from `backlog-<name>/pro/requirements.md` based on MVP scope

  1.4.2 Links to: MVP backlog, MVP tech specs

  1.4.3 Focus: Production-ready requirements for MVP scope

## 2. MVP Requirements Creation Process [REPLACEABLE]

**Status**: Required  
**Dependencies**: Full Requirements Document (optional)

2.1 **Approach A: Filter from Full Requirements**

  2.1.1 Start with full `backlog-<name>/pro/requirements.md` (if it exists)

  2.1.2 Review requirements to identify MVP scope

  2.1.3 Filter requirements to only MVP features

  2.1.4 Adjust sections for MVP scope

  2.1.5 Ensure production-ready quality standards

2.2 **Approach B: Create Directly for MVP**

  2.2.1 Start with MVP scope definition

  2.2.2 Use `pro-requirements-recipe.md` as structure guide

  2.2.3 Create requirements only for MVP features

  2.2.4 Focus on production-ready requirements

2.3 Choose approach based on whether full requirements exist.

## 3. MVP Scope Identification [REPLACEABLE]

**Status**: Required  
**Dependencies**: Core Objectives, User Needs

3.1 **Core Value Proposition**: Identify the single most important value the MVP delivers.

  3.1.1 What problem does it solve?

  3.1.2 Who is the primary user?

  3.1.3 What is the core user journey?

3.2 **Essential Features Only**: Include only features necessary for core value delivery.

  3.2.1 Remove "nice-to-have" features

  3.2.2 Remove features that can wait for future phases

  3.2.3 Focus on one primary use case

3.3 **MVP vs. Future Phases**: Explicitly define what is MVP and what is not.

  3.3.1 Mark requirements as: MVP / Phase 2 / Phase 3 / Future

  3.3.2 Focus on MUST HAVE requirements for MVP

  3.3.3 Document what is explicitly out of MVP scope

## 4. MVP Requirements Document Structure [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Scope

4.1 **MVP Overview**: High-level MVP description

  4.1.1 MVP purpose and context

  4.1.2 Core value proposition

  4.1.3 MVP scope boundaries

4.2 **MVP Core Objectives**: Primary goals the MVP must achieve

4.3 **MVP Target Users**: Who will use the MVP

4.4 **MVP Functional Requirements**: Detailed functional specifications for MVP features only

4.5 **MVP Non-Functional Requirements**: Quality attributes and constraints for MVP

4.6 **Out of MVP Scope**: Explicitly excluded features or capabilities

4.7 **MVP Success Criteria**: Measurable conditions for MVP success

4.8 **MVP Implementation Assumptions**: Assumptions about environment, resources, or context

4.9 **MVP User Flow**: Step-by-step user interactions for MVP features

4.10 **Link to Full Requirements**: Reference to full requirements document (if exists)

## 5. MVP Prioritization [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Scope

5.1 **Prioritization Framework**: Use MoSCoW, RICE, or similar method

  5.1.1 MUST HAVE: Required for MVP

  5.1.2 SHOULD HAVE: Important but not MVP-critical

  5.1.3 COULD HAVE: Nice to have, defer to future phases

  5.1.4 WON'T HAVE: Explicitly out of scope

5.2 **MVP Critical Path**: Identify requirements that block MVP delivery

5.3 **Dependencies**: Map requirement dependencies for MVP scope

## 6. MVP Requirements Quality Standards [REPLACEABLE]

**Status**: Required

6.1 **Production-Ready Quality**: MVP requirements must meet production standards

  6.1.1 Clear and unambiguous

  6.1.2 Testable and verifiable

  6.1.3 Complete for MVP scope

  6.1.4 Traceable to MVP objectives

6.2 **MVP-Specific Considerations**:

  6.2.1 Focus on core value delivery

  6.2.2 Quality over quantity

  6.2.3 Production-ready, not prototype quality

## 7. File Structure & Creation

7.1 **Project Structure**: Work within `agentic-sdlc/` directory - if it is not created, stop and ask the user if they initiated the project with Agentic SDLC.

7.2 **MVP Requirements Directory Structure**: Create MVP requirements file:

```
agentic-sdlc/
├── backlog-<name>/
│   └── mvp/
│       ├── requirements.md          # MVP requirements
│       ├── backlog.md                # MVP backlog
│       ├── tech-specs.md            # MVP tech specs
│       └── tasks/                   # Backlog tasks (from mvp-backlog-recipe)
└── other files described in other instructions
```

7.3 **MVP Requirements Document**: Create `backlog-<name>/mvp/requirements.md` following the structure in section 4.

7.4 **AI Instructions**: When AI creates MVP requirements structure, it should:

  7.4.1 Create `backlog-<name>/mvp/` directory if it doesn't exist

  7.4.2 Filter requirements to MVP scope only

  7.4.3 Ensure production-ready quality standards

  7.4.4 Maintain traceability between full requirements and MVP requirements

## 8. AI Considerations

8.1 **How AI Should Use This Recipe**:

  8.1.1 Read `pro-requirements-recipe.md` to understand requirements structure

  8.1.2 Read full requirements document (if exists) to understand scope

  8.1.3 Use this recipe to identify MVP requirements

  8.1.4 Create MVP-focused requirements document

8.2 **MVP Requirements Generation**:

  8.2.1 AI should filter requirements to MVP scope only

  8.2.2 AI should ensure production-ready quality standards

  8.2.3 AI should maintain consistency with MVP scope

8.3 **AI Boundary Setting**:

  8.3.1 AI should not expand requirements scope beyond MVP

  8.3.2 AI should flag when requirements suggest scope expansion

  8.3.3 AI should maintain production-ready focus for MVP

---

## 9. Template Section [FOR FILE GENERATION]

**Status**: Required for automated file generation  
**Purpose**: This section contains the template with placeholders that the `init` tool uses to generate `requirements.md`

**Placeholder Format**: `{{PLACEHOLDER_NAME}}` - will be replaced with actual data during file generation

```markdown
# MVP Requirements

## MVP Overview

### Core Value Proposition
**Problem:** {{PROBLEM}}
**Primary User:** {{PRIMARY_USER}}
**Core User Journey:** {{CORE_USER_JOURNEY}}

## MVP Core Objectives
{{FEATURES_LIST}}

## MVP Target Users
{{PRIMARY_USER}}

## MVP Functional Requirements
{{FUNCTIONAL_REQUIREMENTS_LIST}}

## MVP Non-Functional Requirements
{{NON_FUNCTIONAL_REQUIREMENTS_LIST}}

## Out of MVP Scope
{{OUT_OF_SCOPE_LIST}}

## MVP Success Criteria
{{SUCCESS_CRITERIA_LIST}}

## MVP User Flow
{{CORE_USER_JOURNEY}}

---
*Created using mvp-requirements-recipe.md*
```

**Placeholder Mappings**:
- `{{PROBLEM}}` → Core Value Proposition problem
- `{{PRIMARY_USER}}` → Core Value Proposition primary user
- `{{CORE_USER_JOURNEY}}` → Core Value Proposition core user journey
- `{{FEATURES_LIST}}` → Essential MVP Features (numbered list)
- `{{FUNCTIONAL_REQUIREMENTS_LIST}}` → Functional requirements formatted as FR-1, FR-2, etc.
- `{{NON_FUNCTIONAL_REQUIREMENTS_LIST}}` → Non-functional requirements (numbered list, or "To be defined")
- `{{OUT_OF_SCOPE_LIST}}` → Out of scope items (numbered list, or "None specified")
- `{{SUCCESS_CRITERIA_LIST}}` → Success criteria (numbered list, or "To be defined")
