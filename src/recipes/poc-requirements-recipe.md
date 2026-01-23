# POC Requirements Recipe

This canvas provides instructions on how to identify, scope, and document POC (Proof of Concept) requirements.  
It is **framework-agnostic** (works with any methodology: Agile, Lean, Waterfall, etc.) and **topic-agnostic** (applies to any project type: software, hardware, process, service, etc.).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Structure & Customization

0.1 This recipe uses a modular structure with clear markers:

  0.1.1 `[UNCHANGEABLE]` - Core concepts that define what POC requirements are (rarely change)

  0.1.2 `[REPLACEABLE]` - Implementation patterns and sections that can be swapped or customized

  0.1.3 Status flags: **Required** | **Optional** | **Recommended**

0.2 **Customization Guidelines**:

  0.2.1 Sections marked `[REPLACEABLE]` can be replaced with alternative approaches

  0.2.2 Patterns (Pattern A, Pattern B, etc.) can be mixed and matched

  0.2.3 Optional sections can be skipped if not applicable to your project

  0.2.4 You can add new patterns or sections following the same structure

0.3 **Recipe Integration**: This recipe integrates with:
  - `pro-requirements-recipe.md` (base requirements structure and methodology)
  - `poc-backlog-recipe.md` (for creating POC-focused tasks)
  - `poc-tech-specs-recipe.md` (for POC technical specifications)

0.4 **POC Requirements Purpose**: Create `backlog-<name>/poc/requirements.md` - proof-focused requirements document filtered to POC scope only.

## 1. Core POC Requirements Concepts [UNCHANGEABLE]

1.1 **POC Requirements** (`backlog-<name>/poc/requirements.md`) is a requirements document filtered to POC scope only.

1.2 POC Requirements characteristics:

  1.2.1 **Proof-focused**: Designed to prove concept works, not production-ready

  1.2.2 **POC-scoped**: Only includes requirements essential for proving the concept

  1.2.3 **Minimal**: Just enough to prove the concept

  1.2.4 **Functional**: Must work to prove concept, but not production quality

1.3 POC Requirements purpose:

  1.3.1 Define WHAT must be proven for POC

  1.3.2 Filter full requirements to POC scope only

  1.3.3 Enable POC delivery with proper requirements foundation

  1.3.4 Support concept validation and learning

1.4 POC Requirements relationship to other documents:

  1.4.1 Source: Filtered from `backlog-<name>/pro/requirements.md` based on POC scope

  1.4.2 Links to: POC backlog, POC tech specs

  1.4.3 Focus: Proof-focused requirements for POC scope

## 2. POC Requirements Creation Process [REPLACEABLE]

**Status**: Required  
**Dependencies**: Full Requirements Document (optional)

2.1 **Approach A: Filter from Full Requirements**

  2.1.1 Start with full `backlog-<name>/pro/requirements.md` (if it exists)

  2.1.2 Review requirements to identify POC proof points

  2.1.3 Filter requirements to only POC proof points

  2.1.4 Adjust sections for POC scope

  2.1.5 Focus on proof, not production quality

2.2 **Approach B: Create Directly for POC**

  2.2.1 Start with POC scope definition

  2.2.2 Use `pro-requirements-recipe.md` as structure guide

  2.2.3 Create requirements only for POC proof points

  2.2.4 Focus on proof-focused requirements

2.3 Choose approach based on whether full requirements exist.

## 3. POC Scope Identification [REPLACEABLE]

**Status**: Required  
**Dependencies**: Core Concept, Proof Objectives

3.1 **Core Concept**: Identify what concept needs to be proven.

  3.1.1 What hypothesis needs validation?

  3.1.2 What technical feasibility needs proof?

  3.1.3 What is the core proof point?

3.2 **Essential Proof Points Only**: Include only requirements necessary to prove the concept.

  3.2.1 Remove production features

  3.2.2 Remove nice-to-have enhancements

  3.2.3 Focus on minimal proof requirements

3.3 **POC vs. Production**: Explicitly define what is POC and what is production.

  3.3.1 Mark requirements as: POC / Production / Future

  3.3.2 Focus on proof requirements only

  3.3.3 Document what is explicitly out of POC scope

## 4. POC Requirements Document Structure [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Scope

4.1 **POC Overview**: High-level POC description

  4.1.1 POC purpose and context

  4.1.2 Core concept to be proven

  4.1.3 POC scope boundaries

4.2 **POC Core Objectives**: Primary proof objectives the POC must achieve

4.3 **POC Proof Points**: What specific concepts or capabilities must be proven

4.4 **POC Functional Requirements**: Detailed functional specifications for POC proof points only

4.5 **POC Non-Functional Requirements**: Quality attributes for POC (proof-focused, not production)

4.6 **Out of POC Scope**: Explicitly excluded features or capabilities

4.7 **POC Success Criteria**: Measurable conditions for POC success (proof indicators)

4.8 **POC Implementation Assumptions**: Assumptions about environment, resources, or context

4.9 **POC Proof Flow**: Step-by-step proof demonstration flow

4.10 **Link to Full Requirements**: Reference to full requirements document (if exists)

## 5. POC Prioritization [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Scope

5.1 **Prioritization Framework**: Focus on proof-critical requirements

  5.1.1 PROOF CRITICAL: Required to prove concept

  5.1.2 PROOF IMPORTANT: Helps prove concept but not critical

  5.1.3 PROOF OPTIONAL: Nice to have for proof, defer if needed

  5.1.4 PRODUCTION: Explicitly out of POC scope

5.2 **POC Critical Path**: Identify requirements that block concept proof

5.3 **Dependencies**: Map requirement dependencies for POC scope

## 6. POC Requirements Quality Standards [REPLACEABLE]

**Status**: Required

6.1 **Proof-Focused Quality**: POC requirements must enable concept proof

  6.1.1 Clear and unambiguous

  6.1.2 Testable to prove concept

  6.1.3 Complete for POC scope

  6.1.4 Traceable to POC objectives

6.2 **POC-Specific Considerations**:

  6.2.1 Focus on concept proof, not production quality

  6.2.2 Minimal but functional

  6.2.3 Proof-ready, not production-ready

## 7. File Structure & Creation

7.1 **Project Structure**: Work within `agentic-sdlc/` directory - if it is not created, stop and ask the user if they initiated the project with Agentic SDLC.

7.2 **POC Requirements Directory Structure**: Create POC requirements file:

```
agentic-sdlc/
├── backlog-<name>/
│   └── poc/
│       ├── requirements.md          # POC requirements
│       ├── backlog.md                # POC backlog
│       ├── tech-specs.md            # POC tech specs
│       └── tasks/                   # Backlog tasks (from poc-backlog-recipe)
└── other files described in other instructions
```

7.3 **POC Requirements Document**: Create `backlog-<name>/poc/requirements.md` following the structure in section 4.

7.4 **AI Instructions**: When AI creates POC requirements structure, it should:

  7.4.1 Create `backlog-<name>/poc/` directory if it doesn't exist

  7.4.2 Filter requirements to POC scope only

  7.4.3 Focus on proof-focused quality standards

  7.4.4 Maintain traceability between full requirements and POC requirements

## 8. AI Considerations

8.1 **How AI Should Use This Recipe**:

  8.1.1 Read `pro-requirements-recipe.md` to understand requirements structure

  8.1.2 Read full requirements document (if exists) to understand scope

  8.1.3 Use this recipe to identify POC requirements

  8.1.4 Create POC-focused requirements document

8.2 **POC Requirements Generation**:

  8.2.1 AI should filter requirements to POC scope only

  8.2.2 AI should focus on proof-focused quality standards

  8.2.3 AI should maintain consistency with POC scope

8.3 **AI Boundary Setting**:

  8.3.1 AI should not expand requirements scope beyond POC

  8.3.2 AI should flag when requirements suggest scope expansion

  8.3.3 AI should maintain proof-focused approach for POC (not production-ready)

---

## 9. Template Section [FOR FILE GENERATION]

**Status**: Required for automated file generation  
**Purpose**: This section contains the template with placeholders that the `init` tool uses to generate `requirements.md`

**Placeholder Format**: `{{PLACEHOLDER_NAME}}` - will be replaced with actual data during file generation

```markdown
# POC Requirements

## POC Overview

### Core Concept
**Hypothesis:** {{HYPOTHESIS}}
**Technical Feasibility:** {{TECHNICAL_FEASIBILITY}}

## POC Core Objectives
{{PROOF_POINTS_LIST}}

## POC Proof Points
{{PROOF_POINTS_DETAILED_LIST}}

## Out of POC Scope
{{OUT_OF_SCOPE_LIST}}

## POC Success Criteria
{{SUCCESS_CRITERIA_LIST}}

## POC Proof Flow
To be defined based on proof points.

---
*Created using poc-requirements-recipe.md*
```

**Placeholder Mappings**:
- `{{HYPOTHESIS}}` → Core concept hypothesis
- `{{TECHNICAL_FEASIBILITY}}` → Core concept technical feasibility
- `{{PROOF_POINTS_LIST}}` → Essential proof points (numbered list)
- `{{PROOF_POINTS_DETAILED_LIST}}` → Proof points formatted as PP-1, PP-2, etc.
- `{{OUT_OF_SCOPE_LIST}}` → Out of scope items (numbered list, or "None specified")
- `{{SUCCESS_CRITERIA_LIST}}` → Success criteria (numbered list, or "To be defined")
