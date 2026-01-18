# POC Tech Specs Recipe

This canvas provides instructions on how to create, structure, and document POC (Proof of Concept) technical specifications.  
It is **framework-agnostic** (works with any technology stack: web, mobile, backend, CLI, etc.) and **topic-agnostic** (applies to any project type: software, hardware, system, etc.).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Structure & Customization

0.1 This recipe uses a modular structure with clear markers:

  0.1.1 `[UNCHANGEABLE]` - Core concepts that define what POC tech specs are (rarely change)

  0.1.2 `[REPLACEABLE]` - Implementation patterns and sections that can be swapped or customized

  0.1.3 Status flags: **Required** | **Optional** | **Recommended**

0.2 **Customization Guidelines**:

  0.2.1 Sections marked `[REPLACEABLE]` can be replaced with alternative approaches

  0.2.2 Patterns (Pattern A, Pattern B, etc.) can be mixed and matched

  0.2.3 Optional sections can be skipped if not applicable to your project

  0.2.4 You can add new patterns or sections following the same structure

0.3 **Recipe Integration**: This recipe integrates with:
  - `pro-tech-specs-recipe.md` (base recipe for full tech specs structure)
  - `poc-recipe.md` (for POC scope definition, if it exists)
  - `pro-requirements-recipe.md` (for requirements understanding)
  - `pro-backlog-recipe.md` (for creating POC-focused tasks)

0.4 **POC Tech Specs Purpose**: Create `backlog-<name>/poc/tech-specs.md` - proof-of-concept technical specification filtered to POC scope only.

## 1. Core POC Tech Specs Concepts [UNCHANGEABLE]

1.1 **POC Tech Specs** (`backlog-<name>/poc/tech-specs.md`) is a technical specification document filtered to POC scope only.

1.2 POC Tech Specs characteristics:

  1.2.1 **Proof-focused**: Designed to prove concept works, not production-ready

  1.2.2 **POC-scoped**: Only includes technical specs for POC proof

  1.2.3 **Minimal**: Just enough to prove the concept

  1.2.4 **Functional**: Must work to prove concept, but not production quality

1.3 POC Tech Specs purpose:

  1.3.1 Define HOW to prove the concept technically

  1.3.2 Provide minimal technical approach to prove concept

  1.3.3 Enable POC delivery to validate concept

  1.3.4 Support concept validation and learning

1.4 POC Tech Specs relationship to other documents:

  1.4.1 Source: Filtered from `backlog-<name>/pro/tech-specs.md` based on `backlog-<name>/poc/requirements.md`

  1.4.2 Links to: POC requirements, POC scope, POC backlog

  1.4.3 Focus: Proof-of-concept implementation, not production-ready

1.5 POC vs MVP Tech Specs:

  1.5.1 POC: "Can we build this?" (proof, not production)

  1.5.2 MVP: "Should we build this?" (production-ready, validates market fit)

## 2. POC Tech Specs Creation Process [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Requirements, Full Tech Specs (optional)

2.1 **Approach A: Filter from Full Tech Specs**

  2.1.1 Start with full `backlog-<name>/pro/tech-specs.md` (if it exists)

  2.1.2 Review `backlog-<name>/poc/requirements.md` to identify POC scope

  2.1.3 Filter tech specs to only POC proof features

  2.1.4 Simplify sections for POC scope

  2.1.5 Focus on proof, not production quality

2.2 **Approach B: Create Directly from POC Requirements**

  2.2.1 Start with `backlog-<name>/poc/requirements.md`

  2.2.2 Use `pro-tech-specs-recipe.md` as structure guide

  2.2.3 Create tech specs only for POC proof

  2.2.4 Focus on minimal proof implementation

2.3 Choose approach based on whether full tech specs exist.

## 3. POC Technical Context Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Requirements

3.1 **Technology Stack**:

  3.1.1 Minimal runtime environment (just enough to prove concept)

  3.1.2 Minimal frameworks and libraries (proof-focused)

  3.1.3 Basic build tools (if needed for proof)

  3.1.4 Minimal development tools

  3.1.5 Only dependencies needed for POC proof

3.2 **Technology Decisions**:

  3.2.1 Rationale for technology choices (proof-focused)

  3.2.2 Proof considerations (not production)

  3.2.3 POC-specific constraints

3.3 **Key Difference from Full Tech Specs**: Minimal stack just to prove concept, not production-ready.

3.4 Format: Structured list with minimal technology choices focused on proof.

## 4. POC Implementation Approach Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Requirements, POC Technical Context

4.1 **Architecture Pattern**:

  4.1.1 Simplified architecture for POC proof

  4.1.2 Minimal architecture layers/components for proof

  4.1.3 Basic separation of concerns for POC

  4.1.4 Simple design patterns for proof

4.2 **Key Design Decisions**:

  4.2.1 Simple state management (if applicable, proof-focused)

  4.2.2 Basic data handling for POC

  4.2.3 Minimal component/module strategy

  4.2.4 Proof-level quality (not production)

4.3 **Key Difference from Full Tech Specs**: Architecture focused on proof only, simplified, not production-ready.

4.4 Format: Description of simplified architecture for POC proof.

## 5. POC Source Code Structure Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Implementation Approach

5.1 **Directory Organization**:

  5.1.1 Minimal directory structure

  5.1.2 Basic source code structure for POC proof

  5.1.3 Minimal configuration files

  5.1.4 Only directories needed for proof

5.2 **File Naming Conventions**:

  5.2.1 Basic naming patterns (proof-focused)

  5.2.2 POC-focused organization

5.3 **Key Difference from Full Tech Specs**: Minimal structure just for proof, not production standards.

5.4 Format: Minimal directory tree structure for POC proof.

## 6. POC Data Models Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Requirements, POC Functional Requirements

6.1 **Core Data Structures**:

  6.1.1 Essential data structures for POC proof only

  6.1.2 Basic data types and formats (proof-level)

  6.1.3 Minimal relationships for proof

6.2 **Data Interfaces/Types**:

  6.2.1 Basic type definitions for POC proof

  6.2.2 Minimal data validation (proof-level)

  6.2.3 Essential fields only

6.3 **Key Difference from Full Tech Specs**: Only essential data models for proof, basic quality.

6.4 Format: Basic type definitions or data structures for POC proof.

## 7. POC Component/Module Specifications Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Source Code Structure, POC Data Models

7.1 **Component/Module Structure**:

  7.1.1 Only components/modules needed for proof

  7.1.2 Basic component specifications (proof-level)

  7.1.3 Simple component interfaces

  7.1.4 Minimal dependencies

7.2 **Component/Module Specification Format**:

  7.2.1 **Name**: Component/module name

  7.2.2 **File/Location**: Where it lives in codebase

  7.2.3 **Responsibilities**: What it does (proof-focused)

  7.2.4 **Inputs/Props**: What it receives

  7.2.5 **Outputs/Returns**: What it produces

  7.2.6 **State Management**: How it manages state (basic, proof-level)

  7.2.7 **Dependencies**: What it depends on

7.3 **Key Difference from Full Tech Specs**: Only proof components, basic specifications.

7.4 Format: Basic specification for each POC component/module.

## 8. POC Delivery Phases Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: All previous sections

8.1 **POC Phased Implementation**:

  8.1.1 Simplified implementation phases for proof

  8.1.2 Proof-focused delivery approach

  8.1.3 Phases build to proof validation

8.2 **POC Phase Structure**:

  8.2.1 **Phase Name**: Descriptive name

  8.2.2 **Deliverable**: What is produced (proof-level)

  8.2.3 **Tasks**: Specific POC proof tasks

  8.2.4 **Verification**: How to verify proof works

8.3 **Recommended POC Phases**:

  8.3.1 Phase 1: POC Setup & Basic Structure

  8.3.2 Phase 2: Core Proof Implementation

  8.3.3 Phase 3: Proof Validation

8.4 **Key Difference from Full Tech Specs**: Simplified phases focused on proof, not production delivery.

8.5 Format: Simplified phases with proof-focused deliverables, tasks, and verification.

## 9. POC Verification Approach Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Delivery Phases, POC Requirements

9.1 **Build Commands**:

  9.1.1 Basic build/run commands (if needed)

  9.1.2 Development commands

  9.1.3 Minimal quality checks

9.2 **Testing Strategy**:

  9.2.1 Basic testing approach for proof

  9.2.2 Manual verification (does it work?)

  9.2.3 Basic functional tests

  9.2.4 Proof validation tests

9.3 **Manual Testing Checklist**:

  9.3.1 POC proof tests

  9.3.2 Basic functionality tests

  9.3.3 Concept validation checks

9.4 **Quality Gates**:

  9.4.1 Basic functionality (does it work?)

  9.4.2 Proof validation (can we prove the concept?)

  9.4.3 Basic quality (not production standards)

9.5 **Key Difference from Full Tech Specs**: Basic verification focused on proof, not production testing.

9.6 Format: Basic testing approach with proof-focused checklists.

## 10. POC Technical Risks & Mitigations Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: POC Implementation Approach, POC Delivery Phases

10.1 **POC-Specific Risks**:

  10.1.1 Risks specific to proving concept

  10.1.2 Proof validation risks

  10.1.3 Technical feasibility risks

10.2 **Risk Format**:

  10.2.1 **Risk Name**: Clear risk description

  10.2.2 **Impact**: What happens if risk materializes

  10.2.3 **Mitigation**: How to prevent or handle the risk

10.3 Format: List of POC-specific risks with mitigation strategies.

## 11. POC Future Enhancements Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: POC Requirements, POC Scope

11.1 **Out of POC Scope**:

  11.1.1 Everything else (not in POC)

  11.1.2 Production-ready features

  11.1.3 MVP features (if POC is separate)

  11.1.4 Full system features

11.2 Format: List of future enhancements (everything not in POC).

## 12. POC Success Metrics Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: POC Requirements, POC Scope

12.1 **Proof Validation Metrics**:

  12.1.1 Concept proven (yes/no)

  12.1.2 Proof works (functional)

  12.1.3 Technical feasibility validated

12.2 **Functional Metrics**:

  12.2.1 POC proof features work

  12.2.2 Concept can be demonstrated

12.3 **Key Success Criteria**: POC success = concept proven (not production-ready).

12.4 Format: List of proof validation metrics.

## 13. Link to POC Requirements [REPLACEABLE]

**Status**: Required  
**Dependencies**: POC Requirements Document

13.1 **POC Requirements Traceability**:

  13.1.1 Link each POC tech spec section to POC requirements

  13.1.2 Map POC requirements to technical proof implementation

  13.1.3 Show how POC requirements are addressed technically

13.2 **Requirements Mapping**:

  13.2.1 POC functional requirements → Technical proof implementation

  13.2.2 POC constraints → Technical decisions

13.3 Format: Traceability matrix or structured links between POC requirements and tech spec sections.

## 14. POC Tech Specs Schema Definition (Markdown Format)

14.1 **POC Tech Specs Document Template**:

```markdown
# POC Technical Specification: [Project Name]

**Scope**: POC (Proof of Concept)  
**Source**: Filtered from tech-specs.md based on poc-requirements.md  
**Focus**: "Can we build this?" (proof, not production)

## Technical Context

### Stack
- **Runtime**: [Minimal runtime environment for proof]
- **Framework**: [Basic framework for proof]
- **Build Tool**: [Basic build tool if needed]
- [Minimal stack items for POC only]

### Development Tools
- [Tool 1]: [Purpose - proof-focused]
- [Tool 2]: [Purpose - proof-focused]

## Implementation Approach

### Architecture Pattern
[Simplified architecture for POC proof]

### Key Design Decisions
1. [Decision 1]: [Rationale - proof-focused]
2. [Decision 2]: [Rationale - minimal approach]

## Source Code Structure
\`\`\`
[Minimal directory structure for POC proof]
\`\`\`

## Data Models

### Core Interfaces
[Basic type definitions for POC proof only]

### Sample Data Format
[Example data structures for proof]

## Component/Module Specifications

### [POC Component/Module Name]
**File**: [File path]
**Responsibilities**:
- [Responsibility 1 - proof-focused]
- [Responsibility 2 - proof-focused]
**Inputs/Props**: [Description]
**Outputs/Returns**: [Description]

[Additional POC components/modules only...]

## Delivery Phases

### Phase 1: POC Setup
**Deliverable**: [Basic proof setup]
- [Task 1]
- [Task 2]
**Verification**: [Does it work?]

### Phase 2: Core Proof
**Deliverable**: [Proof implementation]
- [Task 1]
- [Task 2]
**Verification**: [Can we prove concept?]

### Phase 3: Proof Validation
**Deliverable**: [Proof validated]
- [Task 1]
- [Task 2]
**Verification**: [Concept proven?]

## Verification Approach

### Build Commands
\`\`\`bash
[Basic build/run commands if needed]
\`\`\`

### Manual Testing Checklist
- [ ] [POC proof test 1]
- [ ] [POC proof test 2]
- [ ] [Concept proven?]

### Quality Gates
1. [Basic functionality - does it work?]
2. [Proof validation - can we prove concept?]

## Technical Risks & Mitigations
- **Risk 1**: [POC-specific risk] - **Mitigation**: [Strategy]
- **Risk 2**: [Proof validation risk] - **Mitigation**: [Strategy]

## Future Enhancements
- [Everything else - not in POC]
- [Production-ready features]
- [MVP features if separate]

## Success Metrics
- [Metric 1]: [Proof validation - concept proven?]
- [Metric 2]: [Basic functionality - does it work?]

## Link to POC Requirements
- [POC Requirement ID]: [How it's proven]
- [POC Requirement ID]: [How it's proven]
```

## 15. AI Considerations

15.1 **How AI Should Use This Recipe**:

  15.1.1 Read `backlog-<name>/poc/requirements.md` to understand POC scope

  15.1.2 Read `pro-tech-specs-recipe.md` for base structure (if needed)

  15.1.3 Use this recipe to create POC tech specs

  15.1.4 Maintain traceability between POC requirements and POC tech specs

15.2 **POC Tech Specs Generation**:

  15.2.1 AI should filter tech specs to POC scope only

  15.2.2 AI should focus on proof, not production quality

  15.2.3 AI should maintain consistency with POC requirements

15.3 **AI Boundary Setting**:

  15.3.1 AI should not expand technical scope beyond POC requirements

  15.3.2 AI should flag when tech specs suggest scope expansion

  15.3.3 AI should maintain proof-focused approach (not production-ready)

## 16. File Structure & Creation

16.1 **Project Structure**: Work within `agentic-sdlc/` directory - if it is not created, stop and ask the user if they initiated the project with Agentic SDLC.

16.2 **POC Tech Specs Directory Structure**: Create POC tech specs file:

```
agentic-sdlc/
├── backlog-<name>/
│   └── poc/
│       ├── requirements.md          # POC requirements
│       ├── backlog.md                # POC backlog
│       ├── tech-specs.md            # POC technical specification
│       └── tasks/                   # Backlog tasks (from poc-backlog-recipe)
└── other files described in other instructions
```

16.3 **POC Tech Specs Document**: Create `backlog-<name>/poc/tech-specs.md` following the schema in section 14.

16.4 **AI Instructions**: When AI creates POC tech specs structure, it should:

  16.4.1 Create `backlog-<name>/poc/` directory if it doesn't exist

  16.4.2 Create `backlog-<name>/poc/tech-specs.md` from POC requirements

  16.4.3 Filter from full tech specs if it exists, or create directly from POC requirements

  16.4.4 Maintain traceability to POC requirements

  16.4.5 Follow simplified POC delivery phases structure

  16.4.6 Include basic verification approach (proof-focused)

  16.4.7 Focus on proof, not production quality

## 17. Examples

[Examples section left empty for future branch]

## 18. Key Takeaways

18.1 POC tech specs define **HOW** to prove the concept technically.

18.2 POC tech specs must be **proof-focused** and **POC-scoped**.

18.3 POC tech specs are filtered from full tech specs or created directly from POC requirements.

18.4 POC tech specs should include **simplified delivery phases** (proof-focused).

18.5 POC tech specs should include **basic verification approach** (does it work? can we prove it?).

18.6 Use `pro-tech-specs-recipe.md` as structure guide if creating directly from POC requirements.

18.7 Maintain **traceability** between POC requirements and POC tech specs.

18.8 Focus on **proof implementation**, not production-ready quality.

18.9 POC tech specs enable **concept validation** ("Can we build this?").

18.10 POC success = concept proven (not production-ready).

---

## 19. Template Section [FOR FILE GENERATION]

**Status**: Required for automated file generation  
**Purpose**: This section contains the template with placeholders that the `init` tool uses to generate `tech-specs.md`

**Placeholder Format**: `{{PLACEHOLDER_NAME}}` - will be replaced with actual data during file generation

```markdown
# POC Tech Specs

## POC Technical Context

### Technology Stack
{{TECHNOLOGY_LIST}}

### Technology Decisions
{{ARCHITECTURE_APPROACH}}

## POC Implementation Approach

### Architecture Pattern
{{ARCHITECTURE_APPROACH}}

### Key Design Decisions
{{ARCHITECTURE_APPROACH}}

---
*Created using poc-tech-specs-recipe.md*
```

**Placeholder Mappings**:
- `{{TECHNOLOGY_LIST}}` → Technologies (numbered list)
- `{{ARCHITECTURE_APPROACH}}` → Architecture approach and key design decisions
