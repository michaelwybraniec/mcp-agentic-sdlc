# MVP Tech Specs Recipe

This canvas provides instructions on how to create, structure, and document MVP technical specifications.  
It is **framework-agnostic** (works with any technology stack: web, mobile, backend, CLI, etc.) and **topic-agnostic** (applies to any project type: software, hardware, system, etc.).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Structure & Customization

0.1 This recipe uses a modular structure with clear markers:

  0.1.1 `[FIXED]` - Core concepts that define what MVP tech specs are (rarely change)

  0.1.2 `[REPLACEABLE]` - Implementation patterns and sections that can be swapped or customized

  0.1.3 Status flags: **Required** | **Optional** | **Recommended**

0.2 **Customization Guidelines**:

  0.2.1 Sections marked `[REPLACEABLE]` can be replaced with alternative approaches

  0.2.2 Patterns (Pattern A, Pattern B, etc.) can be mixed and matched

  0.2.3 Optional sections can be skipped if not applicable to your project

  0.2.4 You can add new patterns or sections following the same structure

0.3 **Recipe Integration**: This recipe integrates with:
  - `pro-tech-specs-recipe.md` (base recipe for full tech specs structure)
  - `mvp-recipe.md` (for MVP scope definition)
  - `pro-requirements-recipe.md` (for requirements understanding)
  - `pro-backlog-recipe.md` (for creating MVP-focused tasks)

0.4 **MVP Tech Specs Purpose**: Create `mvp-tech-specs.md` - production-ready technical specification filtered to MVP scope only.

## 1. Core MVP Tech Specs Concepts [FIXED]

1.1 **MVP Tech Specs** (`mvp-tech-specs.md`) is a technical specification document filtered to MVP scope only.

1.2 MVP Tech Specs characteristics:

  1.2.1 **Production-ready**: Must meet production quality standards

  1.2.2 **MVP-scoped**: Only includes technical specs for MVP features

  1.2.3 **Complete in scope**: All MVP features fully specified technically

  1.2.4 **Actionable**: Clear enough for developers to implement MVP

1.3 MVP Tech Specs purpose:

  1.3.1 Define HOW to implement MVP features technically

  1.3.2 Provide production-ready technical approach for MVP

  1.3.3 Enable MVP delivery with proper technical foundation

  1.3.4 Support MVP validation and learning

1.4 MVP Tech Specs relationship to other documents:

  1.4.1 Source: Filtered from `tech-specs.md` based on `mvp-requirements.md`

  1.4.2 Links to: MVP requirements, MVP scope, MVP backlog

  1.4.3 Focus: Production-ready implementation for MVP scope

## 2. MVP Tech Specs Creation Process [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Requirements, Full Tech Specs (optional)

2.1 **Approach A: Filter from Full Tech Specs**

  2.1.1 Start with full `tech-specs.md` (if it exists)

  2.1.2 Review `mvp-requirements.md` to identify MVP scope

  2.1.3 Filter tech specs to only MVP features

  2.1.4 Adjust sections for MVP scope

  2.1.5 Ensure production-ready quality standards

2.2 **Approach B: Create Directly from MVP Requirements**

  2.2.1 Start with `mvp-requirements.md`

  2.2.2 Use `pro-tech-specs-recipe.md` as structure guide

  2.2.3 Create tech specs only for MVP features

  2.2.4 Focus on production-ready implementation

2.3 Choose approach based on whether full tech specs exist.

## 3. MVP Technical Context Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Requirements

3.1 **Technology Stack**:

  3.1.1 Production-ready runtime environment

  3.1.2 Production-ready frameworks and libraries

  3.1.3 Build tools suitable for production

  3.1.4 Development tools for MVP development

  3.1.5 Only dependencies needed for MVP features

3.2 **Technology Decisions**:

  3.2.1 Rationale for technology choices (production-focused)

  3.2.2 Production considerations

  3.2.3 MVP-specific constraints

3.3 **Key Difference from Full Tech Specs**: Minimal but complete stack for MVP, not all possible technologies.

3.4 Format: Structured list with technology names, versions, and production-readiness notes.

## 4. MVP Implementation Approach Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Requirements, MVP Technical Context

4.1 **Architecture Pattern**:

  4.1.1 Production-ready architecture for MVP scope

  4.1.2 Architecture layers/components for MVP features

  4.1.3 Separation of concerns for MVP

  4.1.4 Design patterns for MVP implementation

4.2 **Key Design Decisions**:

  4.2.1 Production-ready state management (if applicable)

  4.2.2 Production-ready data handling for MVP

  4.2.3 Component/module strategy for MVP

  4.2.4 Production quality standards

4.3 **Key Difference from Full Tech Specs**: Architecture focused on MVP features only, but production-ready.

4.4 Format: Description of production-ready architecture for MVP scope.

## 5. MVP Source Code Structure Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Implementation Approach

5.1 **Directory Organization**:

  5.1.1 Production-ready directory structure

  5.1.2 Source code structure for MVP features

  5.1.3 Configuration files for production

  5.1.4 Only directories needed for MVP

5.2 **File Naming Conventions**:

  5.2.1 Production-ready naming patterns

  5.2.2 MVP-focused organization

5.3 **Key Difference from Full Tech Specs**: Structure includes only MVP features, but follows production standards.

5.4 Format: Directory tree structure with MVP-focused organization.

## 6. MVP Data Models Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Requirements, MVP Functional Requirements

6.1 **Core Data Structures**:

  6.1.1 Data structures for MVP features only

  6.1.2 Production-ready data types and formats

  6.1.3 Relationships for MVP features

6.2 **Data Interfaces/Types**:

  6.2.1 Type definitions for MVP features

  6.2.2 Production-ready data validation

  6.2.3 Required vs. optional fields for MVP

6.3 **Key Difference from Full Tech Specs**: Only data models for MVP features, but production-ready.

6.4 Format: Type definitions, interfaces, or data structure descriptions for MVP features.

## 7. MVP Component/Module Specifications Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Source Code Structure, MVP Data Models

7.1 **Component/Module Structure**:

  7.1.1 Only components/modules for MVP features

  7.1.2 Production-ready component specifications

  7.1.3 Component interfaces for MVP

  7.1.4 Dependencies between MVP components

7.2 **Component/Module Specification Format**:

  7.2.1 **Name**: Component/module name

  7.2.2 **File/Location**: Where it lives in codebase

  7.2.3 **Responsibilities**: What it does (MVP-focused)

  7.2.4 **Inputs/Props**: What it receives

  7.2.5 **Outputs/Returns**: What it produces

  7.2.6 **State Management**: How it manages state (production-ready)

  7.2.7 **Dependencies**: What it depends on

7.3 **Key Difference from Full Tech Specs**: Only MVP components, but production-ready specifications.

7.4 Format: Detailed specification for each MVP component/module.

## 8. MVP Delivery Phases Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: All previous sections

8.1 **MVP Phased Implementation**:

  8.1.1 Full implementation phases for MVP

  8.1.2 Production-ready delivery approach

  8.1.3 Phases build to production-ready MVP

8.2 **MVP Phase Structure**:

  8.2.1 **Phase Name**: Descriptive name

  8.2.2 **Deliverable**: What is produced (production-ready)

  8.2.3 **Tasks**: Specific MVP implementation tasks

  8.2.4 **Verification**: How to verify phase completion (production standards)

8.3 **Recommended MVP Phases**:

  8.3.1 Phase 1: MVP Foundation & Setup

  8.3.2 Phase 2: MVP Data Layer

  8.3.3 Phase 3: MVP Core Features

  8.3.4 Phase 4: MVP Integration & Polish

  8.3.5 Phase 5: MVP Production Readiness

8.4 **Key Difference from Full Tech Specs**: Phases focused on MVP delivery, but full production standards.

8.5 Format: Numbered phases with production-ready deliverables, tasks, and verification.

## 9. MVP Verification Approach Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Delivery Phases, MVP Requirements

9.1 **Build Commands**:

  9.1.1 Production build commands

  9.1.2 Development commands

  9.1.3 Quality check commands

9.2 **Testing Strategy**:

  9.2.1 Production testing approach for MVP

  9.2.2 Unit testing for MVP features

  9.2.3 Integration testing for MVP

  9.2.4 End-to-end testing for MVP (if applicable)

9.3 **Manual Testing Checklist**:

  9.3.1 MVP feature tests

  9.3.2 MVP user flow tests

  9.3.3 Production quality checks

9.4 **Quality Gates**:

  9.4.1 Production code quality requirements

  9.4.2 Production type safety (if applicable)

  9.4.3 Production build success

  9.4.4 MVP functionality requirements

  9.4.5 Production performance requirements

9.5 **Key Difference from Full Tech Specs**: Testing focused on MVP features, but production standards.

9.6 Format: Production-ready testing approach with checklists and quality criteria.

## 10. MVP Technical Risks & Mitigations Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Implementation Approach, MVP Delivery Phases

10.1 **MVP-Specific Risks**:

  10.1.1 Risks specific to MVP delivery

  10.1.2 Production readiness risks

  10.1.3 MVP scope risks

10.2 **Risk Format**:

  10.2.1 **Risk Name**: Clear risk description

  10.2.2 **Impact**: What happens if risk materializes

  10.2.3 **Mitigation**: How to prevent or handle the risk

10.3 Format: List of MVP-specific risks with mitigation strategies.

## 11. MVP Future Enhancements Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Requirements, MVP Scope

11.1 **Out of MVP Scope**:

  11.1.1 Features not in MVP (Phase 2+)

  11.1.2 Future technical enhancements

  11.1.3 Nice-to-have technical features

11.2 Format: List of future enhancements with brief descriptions.

## 12. MVP Success Metrics Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Requirements, MVP Scope

12.1 **Technical Quality Metrics**:

  12.1.1 Production code quality indicators

  12.1.2 Production type safety indicators (if applicable)

  12.1.3 Production build success indicators

  12.1.4 MVP test coverage indicators

12.2 **Functional Metrics**:

  12.2.1 MVP feature completion

  12.2.2 MVP requirement fulfillment

  12.2.3 MVP user flow completion

12.3 **Production Metrics**:

  12.3.1 Production readiness indicators

  12.3.2 Production deployment success

  12.3.3 Production performance indicators

12.4 **Key Success Criteria**: MVP success = production-ready, usable by real users.

12.5 Format: List of success metrics with production-ready success criteria.

## 13. Link to MVP Requirements [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Requirements Document

13.1 **MVP Requirements Traceability**:

  13.1.1 Link each MVP tech spec section to MVP requirements

  13.1.2 Map MVP requirements to technical implementation

  13.1.3 Show how MVP requirements are addressed technically

13.2 **Requirements Mapping**:

  13.2.1 MVP functional requirements → Technical implementation

  13.2.2 MVP non-functional requirements → Technical approach

  13.2.3 MVP constraints → Technical decisions

13.3 Format: Traceability matrix or structured links between MVP requirements and tech spec sections.

## 14. MVP Tech Specs Schema Definition (Markdown Format)

14.1 **MVP Tech Specs Document Template**:

```markdown
# MVP Technical Specification: [Project Name]

**Scope**: MVP (Minimum Viable Product)  
**Source**: Filtered from tech-specs.md based on mvp-requirements.md

## Technical Context

### Stack
- **Runtime**: [Production-ready runtime environment]
- **Framework**: [Production-ready framework and version]
- **Build Tool**: [Production-ready build tool and version]
- [Additional stack items for MVP only]

### Development Tools
- [Tool 1]: [Purpose]
- [Tool 2]: [Purpose]

## Implementation Approach

### Architecture Pattern
[Production-ready architecture for MVP scope]

### Key Design Decisions
1. [Decision 1]: [Rationale - production-focused]
2. [Decision 2]: [Rationale - MVP-focused]

## Source Code Structure
\`\`\`
[Production-ready directory structure for MVP]
\`\`\`

## Data Models

### Core Interfaces
[Type definitions for MVP features only]

### Sample Data Format
[Example data structures for MVP]

## Component/Module Specifications

### [MVP Component/Module Name]
**File**: [File path]
**Responsibilities**:
- [Responsibility 1 - MVP-focused]
- [Responsibility 2 - MVP-focused]
**Inputs/Props**: [Description]
**Outputs/Returns**: [Description]

[Additional MVP components/modules only...]

## Delivery Phases

### Phase 1: MVP Foundation
**Deliverable**: [Production-ready foundation]
- [Task 1]
- [Task 2]
**Verification**: [Production quality checks]

[Additional MVP phases...]

## Verification Approach

### Build Commands
\`\`\`bash
[Production build commands]
\`\`\`

### Manual Testing Checklist
- [ ] [MVP feature test 1]
- [ ] [MVP feature test 2]

### Quality Gates
1. [Production quality gate 1]
2. [Production quality gate 2]

## Technical Risks & Mitigations
- **Risk 1**: [MVP-specific risk] - **Mitigation**: [Strategy]
- **Risk 2**: [Production risk] - **Mitigation**: [Strategy]

## Future Enhancements
- [Phase 2 feature 1]
- [Phase 2 feature 2]

## Success Metrics
- [Metric 1]: [Production-ready success criteria]
- [Metric 2]: [MVP success criteria]

## Link to MVP Requirements
- [MVP Requirement ID]: [How it's implemented]
- [MVP Requirement ID]: [How it's implemented]
```

## 15. AI Considerations

15.1 **How AI Should Use This Recipe**:

  15.1.1 Read `mvp-recipe.md` to understand MVP scope

  15.1.2 Read `mvp-requirements.md` to understand MVP requirements

  15.1.3 Read `pro-tech-specs-recipe.md` for base structure (if needed)

  15.1.4 Use this recipe to create MVP tech specs

  15.1.5 Maintain traceability between MVP requirements and MVP tech specs

15.2 **MVP Tech Specs Generation**:

  15.2.1 AI should filter tech specs to MVP scope only

  15.2.2 AI should ensure production-ready quality standards

  15.2.3 AI should maintain consistency with MVP requirements

15.3 **AI Boundary Setting**:

  15.3.1 AI should not expand technical scope beyond MVP requirements

  15.3.2 AI should flag when tech specs suggest scope expansion

  15.3.3 AI should maintain production-ready focus for MVP

## 16. File Structure & Creation

16.1 **Project Structure**: Work within `agentic-sdlc/` directory - if it is not created, stop and ask the user if they initiated the project with Agentic SDLC.

16.2 **MVP Tech Specs Directory Structure**: Create MVP tech specs file:

```
agentic-sdlc/
├── requirements/
│   └── requirements-document.md    # Full requirements
├── mvp/
│   └── mvp-requirements.md          # MVP requirements
├── tech-specs/
│   ├── tech-specs.md                # Full technical specification (optional)
│   └── mvp-tech-specs.md            # MVP technical specification
├── tasks/                           # Backlog tasks (from pro-backlog-recipe)
└── other files described in other instructions
```

16.3 **MVP Tech Specs Document**: Create `mvp-tech-specs.md` following the schema in section 14.

16.4 **AI Instructions**: When AI creates MVP tech specs structure, it should:

  16.4.1 Create `tech-specs/` directory if it doesn't exist

  16.4.2 Create `mvp-tech-specs.md` from MVP requirements

  16.4.3 Filter from full tech specs if it exists, or create directly from MVP requirements

  16.4.4 Maintain traceability to MVP requirements

  16.4.5 Follow MVP delivery phases structure

  16.4.6 Include production-ready verification approach and quality gates

  16.4.7 Ensure production-ready quality standards throughout

## 17. Examples

[Examples section left empty for future branch]

## 18. Key Takeaways

18.1 MVP tech specs define **HOW** to implement MVP features technically.

18.2 MVP tech specs must be **production-ready** and **MVP-scoped**.

18.3 MVP tech specs are filtered from full tech specs or created directly from MVP requirements.

18.4 MVP tech specs should include **production-ready delivery phases**.

18.5 MVP tech specs should include **production verification approach** and **quality gates**.

18.6 Use `pro-tech-specs-recipe.md` as structure guide if creating directly from MVP requirements.

18.7 Maintain **traceability** between MVP requirements and MVP tech specs.

18.8 Focus on **production-ready implementation** for MVP scope, not proof-of-concept.

18.9 MVP tech specs enable **production-ready MVP delivery**.

18.10 MVP success = production-ready, usable by real users.
