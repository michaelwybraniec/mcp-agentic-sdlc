# Pro Tech Specs Recipe

This canvas provides instructions on how to create, structure, and document full technical specifications.  
It is **framework-agnostic** (works with any technology stack: web, mobile, backend, CLI, etc.) and **topic-agnostic** (applies to any project type: software, hardware, system, etc.).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Structure & Customization

0.1 This recipe uses a modular structure with clear markers:

  0.1.1 `[FIXED]` - Core concepts that define what technical specifications are (rarely change)

  0.1.2 `[REPLACEABLE]` - Implementation patterns and sections that can be swapped or customized

  0.1.3 Status flags: **Required** | **Optional** | **Recommended**

0.2 **Customization Guidelines**:

  0.2.1 Sections marked `[REPLACEABLE]` can be replaced with alternative approaches

  0.2.2 Patterns (Pattern A, Pattern B, etc.) can be mixed and matched

  0.2.3 Optional sections can be skipped if not applicable to your project

  0.2.4 You can add new patterns or sections following the same structure

0.3 **Recipe Integration**: This recipe integrates with pro-requirements-recipe.md and pro-backlog-recipe.md to create full technical specifications based on all requirements.

0.4 **Related Recipes**: 
  - For MVP tech specs, use `mvp-tech-specs-recipe.md` (production-ready, MVP-scoped)
  - For POC tech specs, use `poc-tech-specs-recipe.md` (proof-focused, POC-scoped)

## 1. Core Tech Specs Concepts [FIXED]

1.1 A **technical specification** is a document that describes HOW a system will be implemented technically.

1.2 Tech specs define:

  1.2.1 **Technical approach**: How the system will be built

  1.2.2 **Architecture**: System structure and organization

  1.2.3 **Implementation details**: Specific technologies, patterns, and decisions

  1.2.4 **Code structure**: How code will be organized

  1.2.5 **Data models**: Data structures and formats

  1.2.6 **Components/Modules**: Building blocks of the system

1.3 Tech specs must be:

  1.3.1 **Traceable**: Linked to requirements (what requirements are being implemented)

  1.3.2 **Actionable**: Clear enough for developers to implement

  1.3.3 **Complete**: Cover all technical aspects needed for implementation

  1.3.4 **Testable**: Include verification approach and quality gates

1.4 Tech specs relationship to requirements:

  1.4.1 Requirements define WHAT the system must do

  1.4.2 Tech specs define HOW the system will be built to meet requirements

  1.4.3 Tech specs translate requirements into technical implementation

## 2. Technical Context Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: Requirements Document

2.1 **Technology Stack**:

  2.1.1 Runtime environment (if applicable)

  2.1.2 Frameworks and libraries

  2.1.3 Build tools and tooling

  2.1.4 Development tools

  2.1.5 Third-party dependencies

2.2 **Development Tools**:

  2.2.1 Code quality tools (linters, formatters)

  2.2.2 Testing frameworks

  2.2.3 Build and deployment tools

  2.2.4 Development environment setup

2.3 **Technology Decisions**:

  2.3.1 Rationale for technology choices

  2.3.2 Alternatives considered

  2.3.3 Constraints or limitations

2.4 Format: Structured list with technology names, versions, and brief descriptions.

## 3. Implementation Approach Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: Technical Context, Requirements Document

3.1 **Architecture Pattern**:

  3.1.1 Overall architecture style (layered, microservices, monolithic, etc.)

  3.1.2 Architectural layers or components

  3.1.3 Separation of concerns

  3.1.4 Design patterns used

3.2 **Key Design Decisions**:

  3.2.1 State management approach (if applicable)

  3.2.2 Data handling strategy

  3.2.3 Component/module strategy

  3.2.4 Type safety approach (if applicable)

  3.2.5 Styling approach (if applicable)

3.3 **Pattern A: Layered Architecture**

  3.3.1 Presentation Layer: UI components, user interface

  3.3.2 Business Logic Layer: Core functionality, business rules

  3.3.3 Data Layer: Data access, storage, persistence

3.4 **Pattern B: Component-Based Architecture**

  3.4.1 Modular components with clear interfaces

  3.4.2 Composition over configuration

  3.4.3 Reusable building blocks

3.5 **Pattern C: Service-Oriented Architecture**

  3.5.1 Independent services

  3.5.2 Service interfaces and contracts

  3.5.3 Service communication patterns

3.6 Choose one pattern or create your own following the same structure.

3.7 Format: Description of architecture with clear layers/components and their responsibilities.

## 4. Source Code Structure Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: Implementation Approach

4.1 **Directory Organization**:

  4.1.1 Root-level files and directories

  4.1.2 Source code directory structure

  4.1.3 Configuration files location

  4.1.4 Asset/resource organization

4.2 **File Naming Conventions**:

  4.2.1 File naming patterns

  4.2.2 Directory naming patterns

  4.2.3 Module/component organization

4.3 **Code Organization Principles**:

  4.3.1 Separation by feature vs. by type

  4.3.2 Shared/common code location

  4.3.3 Test file organization

4.4 Format: Directory tree structure with brief descriptions of each major directory/file.

## 5. Data Models Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: Requirements Document, Functional Requirements

5.1 **Core Data Structures**:

  5.1.1 Main entities and their properties

  5.1.2 Data types and formats

  5.1.3 Relationships between entities

5.2 **Data Interfaces/Types**:

  5.2.1 Type definitions (if using typed language)

  5.2.2 Data validation rules

  5.2.3 Required vs. optional fields

5.3 **Data Flow**:

  5.3.1 How data moves through the system

  5.3.2 Data transformation points

  5.3.3 Data persistence approach

5.4 **Sample Data Format** (if applicable):

  5.4.1 Example data structures

  5.4.2 Data format examples

  5.4.3 Data validation examples

5.5 Format: Type definitions, interfaces, or data structure descriptions with examples.

## 6. Component/Module Specifications Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: Source Code Structure, Data Models

6.1 **Component/Module Structure**:

  6.1.1 Each major component/module should be specified

  6.1.2 Component/module responsibilities

  6.1.3 Component/module interfaces

  6.1.4 Dependencies between components/modules

6.2 **Component/Module Specification Format**:

  6.2.1 **Name**: Component/module name

  6.2.2 **File/Location**: Where it lives in codebase

  6.2.3 **Responsibilities**: What it does

  6.2.4 **Inputs/Props**: What it receives

  6.2.5 **Outputs/Returns**: What it produces

  6.2.6 **State Management**: How it manages state (if applicable)

  6.2.7 **Dependencies**: What it depends on

6.3 **Component/Module Categories** (adapt to your project type):

  6.3.1 UI Components (for user-facing applications)

  6.3.2 Business Logic Modules

  6.3.3 Data Access Modules

  6.3.4 Utility/Helper Modules

  6.3.5 Integration Modules

6.4 Format: Detailed specification for each major component/module following the format above.

## 7. Custom Hooks/Utilities Section [REPLACEABLE]

**Status**: Optional  
**Dependencies**: Component/Module Specifications

7.1 **Reusable Logic**:

  7.1.1 Custom hooks (if applicable to your stack)

  7.1.2 Utility functions

  7.1.3 Shared business logic

7.2 **Hook/Utility Specification**:

  7.2.1 **Name**: Hook/utility name

  7.2.2 **File/Location**: Where it lives

  7.2.3 **Purpose**: What it does

  7.2.4 **Interface**: Inputs and outputs

  7.2.5 **Implementation Notes**: Key implementation details

7.3 Format: Specification for each reusable hook/utility.

## 8. Styling Approach Section [REPLACEABLE]

**Status**: Optional (Required for UI projects)  
**Dependencies**: Component/Module Specifications

8.1 **Styling Strategy**:

  8.1.1 CSS framework or approach

  8.1.2 Styling methodology

  8.1.3 Component styling approach

8.2 **Design Tokens**:

  8.2.1 Color palette

  8.2.2 Typography

  8.2.3 Spacing scale

  8.2.4 Animation/transition patterns

8.3 **Configuration**:

  8.3.1 Styling tool configuration

  8.3.2 Custom theme/token setup

8.4 Format: Description of styling approach with configuration examples.

## 9. Delivery Phases Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: All previous sections

9.1 **Phased Implementation Approach**:

  9.1.1 Break implementation into logical phases

  9.1.2 Each phase has clear deliverables

  9.1.3 Phases build on each other

9.2 **Phase Structure**:

  9.2.1 **Phase Name**: Descriptive name

  9.2.2 **Deliverable**: What is produced in this phase

  9.2.3 **Tasks**: Specific implementation tasks

  9.2.4 **Verification**: How to verify phase completion

9.3 **Pattern A: Foundation-First Phases**

  9.3.1 Phase 1: Project Setup & Core Infrastructure

  9.3.2 Phase 2: Data Layer

  9.3.3 Phase 3: Core Components/Modules

  9.3.4 Phase 4: Integration & Interaction

  9.3.5 Phase 5: Enhancement & Polish

  9.3.6 Phase 6: Production Readiness

9.4 **Pattern B: Feature-Based Phases**

  9.4.1 Phase 1: Core Feature 1

  9.4.2 Phase 2: Core Feature 2

  9.4.3 Phase 3: Integration & Polish

9.5 **Pattern C: MVP-Focused Phases**

  9.5.1 Phase 1: MVP Foundation

  9.5.2 Phase 2: MVP Core Features

  9.5.3 Phase 3: MVP Polish & Production

9.6 Choose one pattern or create your own following the same structure.

9.7 Format: Numbered phases with deliverables, tasks, and verification criteria.

## 10. Verification Approach Section [REPLACEABLE]

**Status**: Required  
**Dependencies**: Delivery Phases, Requirements Document

10.1 **Build Commands**:

  10.1.1 Development server/run commands

  10.1.2 Production build commands

  10.1.3 Type checking commands (if applicable)

  10.1.4 Linting commands

  10.1.5 Testing commands

10.2 **Testing Strategy**:

  10.2.1 Unit testing approach

  10.2.2 Integration testing approach

  10.2.3 End-to-end testing approach (if applicable)

  10.2.4 Manual testing approach

10.3 **Manual Testing Checklist**:

  10.3.1 Core functionality tests

  10.3.2 User flow tests

  10.3.3 Edge case tests

  10.3.4 Quality checks

10.4 **Quality Gates**:

  10.4.1 Code quality requirements

  10.4.2 Type safety requirements (if applicable)

  10.4.3 Linting requirements

  10.4.4 Build success requirements

  10.4.5 Functionality requirements

  10.4.6 Performance requirements

10.5 Format: Structured testing approach with checklists and quality criteria.

## 11. Technical Risks & Mitigations Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: Implementation Approach, Delivery Phases

11.1 **Risk Identification**:

  11.1.1 Technology learning curve risks

  11.1.2 Implementation complexity risks

  11.1.3 Performance risks

  11.1.4 Integration risks

  11.1.5 Scope/effort estimation risks

11.2 **Risk Format**:

  11.2.1 **Risk Name**: Clear risk description

  11.2.2 **Impact**: What happens if risk materializes

  11.2.3 **Mitigation**: How to prevent or handle the risk

11.3 Format: List of risks with mitigation strategies.

## 12. Future Enhancements Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: Requirements Document, MVP/POC Scope

12.1 **Out of Scope Items**:

  12.1.1 Features not in current scope (MVP/POC/Phase 1)

  12.1.2 Future phase enhancements

  12.1.3 Nice-to-have features

12.2 **Future Technical Considerations**:

  12.2.1 Technical debt to address later

  12.2.2 Scalability improvements

  12.2.3 Performance optimizations

12.3 Format: List of future enhancements with brief descriptions.

## 13. Success Metrics Section [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: Requirements Document, MVP/POC Scope

13.1 **Technical Quality Metrics**:

  13.1.1 Code quality indicators

  13.1.2 Type safety indicators (if applicable)

  13.1.3 Build success indicators

  13.1.4 Test coverage indicators

13.2 **Functional Metrics**:

  13.2.1 Feature completion

  13.2.2 Requirement fulfillment

  13.2.3 User flow completion

13.3 **Performance Metrics** (if applicable):

  13.3.1 Response times

  13.3.2 Resource usage

  13.3.3 Scalability indicators

13.4 Format: List of success metrics with clear success criteria.

## 14. Link to Requirements [REPLACEABLE]

**Status**: Required  
**Dependencies**: Requirements Document

14.1 **Requirements Traceability**:

  14.1.1 Link each tech spec section to source requirements

  14.1.2 Map requirements to technical implementation

  14.1.3 Show how requirements are addressed technically

14.2 **Requirements Mapping**:

  14.2.1 Functional requirements → Technical implementation

  14.2.2 Non-functional requirements → Technical approach

  14.2.3 Constraints → Technical decisions

14.3 Format: Traceability matrix or structured links between requirements and tech spec sections.

## 15. Tech Specs Schema Definition (Markdown Format)

16.1 **Main Tech Specs Document Template**:

```markdown
# Technical Specification: [Project Name]

## Technical Context

### Stack
- **Runtime**: [Runtime environment]
- **Framework**: [Framework name and version]
- **Build Tool**: [Build tool name and version]
- [Additional stack items]

### Development Tools
- [Tool 1]: [Purpose]
- [Tool 2]: [Purpose]

## Implementation Approach

### Architecture Pattern
[Description of architecture pattern]

### Key Design Decisions
1. [Decision 1]: [Rationale]
2. [Decision 2]: [Rationale]

## Source Code Structure
\`\`\`
[Directory tree structure]
\`\`\`

## Data Models

### Core Interfaces
[Type definitions or data structures]

### Sample Data Format
[Example data structures]

## Component/Module Specifications

### [Component/Module Name]
**File**: [File path]
**Responsibilities**:
- [Responsibility 1]
- [Responsibility 2]
**Inputs/Props**: [Description]
**Outputs/Returns**: [Description]

[Additional components/modules...]

## Custom Hooks/Utilities

### [Hook/Utility Name]
**File**: [File path]
**Purpose**: [Description]
**Interface**: [Inputs and outputs]

## Styling Approach (if applicable)
[Styling strategy and configuration]

## Delivery Phases

### Phase 1: [Phase Name]
**Deliverable**: [What is produced]
- [Task 1]
- [Task 2]
**Verification**: [How to verify]

[Additional phases...]

## Verification Approach

### Build Commands
\`\`\`bash
[Build commands]
\`\`\`

### Manual Testing Checklist
- [ ] [Test 1]
- [ ] [Test 2]

### Quality Gates
1. [Gate 1]
2. [Gate 2]

## Technical Risks & Mitigations
- **Risk 1**: [Description] - **Mitigation**: [Strategy]
- **Risk 2**: [Description] - **Mitigation**: [Strategy]

## Future Enhancements
- [Enhancement 1]
- [Enhancement 2]

## Success Metrics
- [Metric 1]: [Success criteria]
- [Metric 2]: [Success criteria]

## Link to Requirements
- [Requirement ID]: [How it's implemented]
- [Requirement ID]: [How it's implemented]
```

## 16. AI Considerations

17.1 **How AI Should Use This Recipe**:

  17.1.1 Read pro-requirements-recipe.md to understand requirements

  17.1.2 Read mvp-recipe.md or poc-recipe.md to understand scope (if applicable)

  17.1.3 Use this recipe to create technical specifications

  17.1.4 Maintain traceability between requirements and tech specs

17.2 **Tech Specs Generation**:

  17.2.1 AI can help translate requirements into technical specifications

  17.2.2 AI should ensure tech specs are actionable and complete

  17.2.3 AI should maintain consistency with requirements

17.3 **AI Boundary Setting**:

  17.4.1 AI should not expand technical scope beyond requirements

  17.4.2 AI should flag when tech specs suggest scope expansion

  17.4.3 AI should maintain focus on defined scope

## 18. File Structure & Creation

18.1 **Project Structure**: Work within `agentic-sdlc/` directory - if it is not created, stop and ask the user if they initiated the project with Agentic SDLC.

18.2 **Tech Specs Directory Structure**: Create tech specs files:

```
agentic-sdlc/
├── requirements/
│   └── requirements-document.md    # Full requirements
├── tech-specs/
│   └── tech-specs.md                # Full technical specification
├── tasks/                           # Backlog tasks (from pro-backlog-recipe)
└── other files described in other instructions
```

18.3 **Tech Specs Document**: Create `tech-specs.md` following the schema in section 15.

18.4 **AI Instructions**: When AI creates tech specs structure, it should:

  18.4.1 Create `tech-specs/` directory structure

  18.4.2 Create full `tech-specs.md` from all requirements

  18.4.3 Maintain traceability to requirements

  18.4.4 Follow delivery phases structure

  18.4.5 Include verification approach and quality gates

18.5 **Note**: For MVP or POC tech specs, use the respective recipes:
  - `mvp-tech-specs-recipe.md` for production-ready MVP tech specs
  - `poc-tech-specs-recipe.md` for proof-focused POC tech specs

## 19. Examples

[Examples section left empty for future branch]

## 20. Key Takeaways

20.1 Tech specs define **HOW** the system will be built, not **WHAT** it must do (that's requirements).

20.2 Tech specs must be **traceable** to requirements and **actionable** for developers.

20.3 Tech specs should include **delivery phases** to break down implementation.

20.4 Tech specs should include **verification approach** and **quality gates**.

20.5 Use appropriate sections based on project type (UI projects need styling, backend projects need API specs, etc.).

20.6 Tech specs marked `[REPLACEABLE]` can be customized or replaced with alternative approaches.

20.7 This recipe is framework-agnostic and topic-agnostic - adapt it to your specific needs.

20.8 Tech specs should inform backlog creation - use pro-backlog-recipe.md to convert tech specs into actionable tasks.

20.9 For MVP tech specs (production-ready, MVP-scoped), use `mvp-tech-specs-recipe.md`.

20.10 For POC tech specs (proof-focused, POC-scoped), use `poc-tech-specs-recipe.md`.
