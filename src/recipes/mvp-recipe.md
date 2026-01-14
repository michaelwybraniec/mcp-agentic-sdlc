# MVP Recipe

This canvas provides instructions on how to define, scope, and deliver a Minimum Viable Product (MVP).  
It is **framework-agnostic** (works with any methodology: Agile, Lean, Waterfall, etc.) and **topic-agnostic** (applies to any project type: software, hardware, process, service, etc.).  
Designed to be both **human- and AI-friendly**.

## 0. Recipe Structure & Customization

0.1 This recipe uses a modular structure with clear markers:

  0.1.1 `[FIXED]` - Core concepts that define what an MVP is (rarely change)

  0.1.2 `[REPLACEABLE]` - Implementation patterns and sections that can be swapped or customized

  0.1.3 Status flags: **Required** | **Optional** | **Recommended**

0.2 **Customization Guidelines**:

  0.2.1 Sections marked `[REPLACEABLE]` can be replaced with alternative approaches

  0.2.2 Patterns (Pattern A, Pattern B, etc.) can be mixed and matched

  0.2.3 Optional sections can be skipped if not applicable to your project

  0.2.4 You can add new patterns or sections following the same structure

0.3 **Recipe Integration**: This recipe integrates with pro-requirements-recipe.md and pro-backlog-recipe.md to help define MVP scope and create MVP-focused tasks.

## 1. Core MVP Concepts [FIXED]

1.1 A **Minimum Viable Product (MVP)** is the smallest version of a product that delivers value to users and allows learning from real usage.

1.2 MVP characteristics:

  1.2.1 **Minimum**: Contains only essential features needed to deliver core value

  1.2.2 **Viable**: Functional enough to be used by real users

  1.2.3 **Product**: Complete enough to provide value, not just a prototype

1.3 MVP purpose:

  1.3.1 Validate core assumptions about user needs

  1.3.2 Test product-market fit with minimal investment

  1.3.3 Learn from real user feedback

  1.3.4 Enable iterative improvement based on data

1.4 MVP is NOT:

  1.4.1 A prototype or proof of concept (MVP is usable by real users)

  1.4.2 A half-finished product (MVP must be complete in its limited scope)

  1.4.3 An excuse for poor quality (MVP must meet quality standards for its scope)

  1.4.4 Everything you can build quickly (MVP focuses on core value, not speed)

## 2. MVP Scope Definition

2.1 **Core Value Proposition**: Identify the single most important value the product delivers.

  2.1.1 What problem does it solve?

  2.1.2 Who is the primary user?

  2.1.3 What is the core user journey?

2.2 **Essential Features Only**: Include only features necessary for core value delivery.

  2.2.1 Remove "nice-to-have" features

  2.2.2 Remove features that can wait for future phases

  2.2.3 Focus on one primary use case

2.3 **Quality Standards**: MVP must meet quality standards appropriate for its scope.

  2.3.1 Functional correctness

  2.3.2 Basic usability

  2.3.3 Security for sensitive data

  2.3.4 Performance sufficient for expected load

2.4 **Out of MVP Scope**: Explicitly define what is excluded from MVP.

  2.4.1 Features planned for Phase 2, Phase 3, etc.

  2.4.2 Nice-to-have enhancements

  2.4.3 Edge cases that don't affect core value

## 3. MVP Identification from Requirements [REPLACEABLE]

**Status**: Required  
**Dependencies**: Requirements Document (from pro-requirements-recipe.md)

3.1 **Link to Requirements**:

  3.1.1 Review functional requirements from pro-requirements-recipe.md

  3.1.2 Identify which requirements are essential for MVP

  3.1.3 Map requirements to MVP features

3.2 **Requirement Prioritization for MVP**:

  3.2.1 Use prioritization framework from pro-requirements-recipe.md (MoSCoW, RICE, etc.)

  3.2.2 Mark requirements as: MVP / Phase 2 / Phase 3 / Future

  3.2.3 Focus on MUST HAVE requirements for MVP

3.3 **MVP Feature List**:

  3.3.1 Create list of features included in MVP

  3.3.2 Link each feature to source requirements

  3.3.3 Document why each feature is essential for MVP

3.4 **MVP Requirements Document**: Create subset of requirements document focused on MVP scope.

## 4. MVP Prioritization Strategies [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: Requirements Document, Core Objectives

4.1 **Pattern A: Core User Journey Focus**

  4.1.1 Identify the primary user journey

  4.1.2 Include only features needed for that journey

  4.1.3 Exclude alternative paths and edge cases

4.2 **Pattern B: Risk Reduction Focus**

  4.2.1 Prioritize features that reduce biggest risks

  4.2.2 Focus on assumptions that need validation

  4.2.3 Include features that enable learning

4.3 **Pattern C: Value vs. Effort Matrix**

  4.3.1 Plot features on 2x2 matrix: High/Low Value vs. High/Low Effort

  4.3.2 MVP includes: High Value / Low Effort + High Value / High Effort (if critical)

  4.3.3 Exclude: Low Value features regardless of effort

4.4 **Pattern D: Must-Have vs. Should-Have**

  4.4.1 Use MoSCoW method from pro-requirements-recipe.md

  4.4.2 MVP = All MUST HAVE features only

  4.4.3 SHOULD HAVE and COULD HAVE go to future phases

4.5 Choose one pattern or create your own following the same structure.

## 5. MVP Success Criteria [REPLACEABLE]

**Status**: Required  
**Dependencies**: Core Objectives, MVP Scope

5.1 **Learning Objectives**: What you need to learn from MVP.

  5.1.1 Key assumptions to validate

  5.1.2 Questions to answer

  5.1.3 Metrics to measure

5.2 **User Validation Criteria**:

  5.2.1 Can users complete core user journey?

  5.2.2 Do users find value in the product?

  5.2.3 Are users willing to use it again?

5.3 **Business Validation Criteria**:

  5.3.1 Does MVP achieve core business objectives?

  5.3.2 Is there evidence of product-market fit?

  5.3.3 Are success metrics met?

5.4 **Technical Validation Criteria**:

  5.4.1 Does MVP meet quality standards?

  5.4.2 Is MVP stable and reliable?

  5.4.3 Can MVP handle expected load?

5.5 Format: Measurable criteria with clear success indicators.

## 6. MVP vs. Future Phases [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Scope, Requirements Document

6.1 **Phase Planning**:

  6.1.1 MVP: Core value delivery

  6.1.2 Phase 2: Enhancements based on MVP learnings

  6.1.3 Phase 3+: Additional features and improvements

6.2 **Feature Roadmap**:

  6.2.1 Map all requirements to phases

  6.2.2 Clearly separate MVP from future phases

  6.2.3 Document rationale for phase assignments

6.3 **MVP Boundaries**:

  6.3.1 What is in MVP (explicit list)

  6.3.2 What is explicitly out of MVP (explicit list)

  6.3.3 What is deferred to future phases

6.4 Format: Clear phase breakdown with feature assignments.

## 7. MVP Release Planning [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Scope, MVP Success Criteria

7.1 **Release Scope**:

  7.1.1 Features included in MVP release

  7.1.2 Quality standards for release

  7.1.3 Known limitations and workarounds

7.2 **Release Timeline**:

  7.2.1 Target release date

  7.2.2 Key milestones

  7.2.3 Dependencies and blockers

7.3 **Release Strategy**:

  7.3.1 Release approach (public, beta, limited rollout)

  7.3.2 Rollout plan (if phased)

  7.3.3 Rollback plan (if needed)

7.4 **Release Criteria**:

  7.4.1 Must-have features complete

  7.4.2 Quality gates passed

  7.4.3 Success criteria measurable

7.5 Format: Structured release plan with clear milestones.

## 8. MVP Risk Management [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Scope, MVP Success Criteria

8.1 **Scope Risks**:

  8.1.1 Risk: MVP scope too large (delays release)

  8.1.2 Mitigation: Strict prioritization, regular scope review

  8.1.3 Risk: MVP scope too small (no value delivered)

  8.1.4 Mitigation: Validate core value proposition, user testing

8.2 **Quality Risks**:

  8.2.1 Risk: Quality compromised for speed

  8.2.2 Mitigation: Define quality standards, maintain quality gates

  8.2.3 Risk: Technical debt accumulation

  8.2.4 Mitigation: Balance speed with maintainability

8.3 **Learning Risks**:

  8.3.1 Risk: Not learning from MVP

  8.3.2 Mitigation: Define learning objectives, plan feedback collection

  8.3.3 Risk: Ignoring MVP feedback

  8.3.4 Mitigation: Plan for iteration based on feedback

8.4 Format: Risk list with mitigation strategies.

## 9. MVP Validation & Testing [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Scope, MVP Success Criteria

9.1 **User Testing**:

  9.1.1 Test core user journey

  9.1.2 Collect user feedback

  9.1.3 Validate assumptions

9.2 **Functional Testing**:

  9.2.1 Test MVP features work correctly

  9.2.2 Test core user flows

  9.2.3 Test critical paths

9.3 **Quality Testing**:

  9.3.1 Performance testing (if applicable)

  9.3.2 Security testing (if applicable)

  9.3.3 Usability testing

9.4 **Learning Validation**:

  9.4.1 Measure success criteria

  9.4.2 Collect data on key metrics

  9.4.3 Analyze feedback and usage patterns

9.5 Format: Test plan with clear validation approach.

## 10. MVP Backlog Creation [REPLACEABLE]

**Status**: Required  
**Dependencies**: MVP Scope, Requirements Document, Backlog Recipe

10.1 **Link to Backlog Recipe**:

  10.1.1 Use pro-backlog-recipe.md to create MVP-focused backlog

  10.1.2 Create tasks only for MVP features

  10.1.3 Mark non-MVP tasks for future phases

10.2 **MVP Task Identification**:

  10.2.1 Map MVP features to backlog tasks

  10.2.2 Ensure all MVP requirements have corresponding tasks

  10.2.3 Exclude tasks for future phases from MVP backlog

10.3 **MVP Task Prioritization**:

  10.3.1 Prioritize tasks critical for MVP delivery

  10.3.2 Identify MVP-critical path

  10.3.3 Manage dependencies for MVP scope

10.4 **MVP Backlog Structure**:

  10.4.1 Create separate MVP backlog or mark MVP tasks clearly

  10.4.2 Link tasks to MVP requirements

  10.4.3 Track MVP progress separately

10.5 Format: MVP backlog following pro-backlog-recipe.md structure.

## 11. MVP Metrics & Measurement [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Success Criteria

11.1 **User Metrics**:

  11.1.1 User adoption rate

  11.1.2 User engagement

  11.1.3 User satisfaction

  11.1.4 Core user journey completion rate

11.2 **Business Metrics**:

  11.2.1 Value delivery indicators

  11.2.2 Business objective achievement

  11.2.3 Product-market fit indicators

11.3 **Learning Metrics**:

  11.3.1 Assumption validation results

  11.3.2 Key questions answered

  11.3.3 Insights discovered

11.4 **Technical Metrics**:

  11.4.1 Performance metrics

  11.4.2 Quality metrics (bugs, stability)

  11.4.3 Reliability metrics

11.5 Format: Metrics list with measurement approach and targets.

## 12. MVP Iteration Planning [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Release Planning, MVP Metrics

12.1 **Post-MVP Planning**:

  12.1.1 Plan for MVP feedback integration

  12.1.2 Identify improvements for next iteration

  12.1.3 Plan Phase 2 based on learnings

12.2 **Iteration Strategy**:

  12.2.1 How to incorporate feedback

  12.2.2 When to iterate vs. when to pivot

  12.2.3 Decision criteria for next steps

12.3 **Continuous Improvement**:

  12.3.1 Regular review of MVP metrics

  12.3.2 User feedback collection process

  12.3.3 Iteration planning process

12.4 Format: Iteration plan with feedback integration approach.

## 13. MVP Documentation [REPLACEABLE]

**Status**: Recommended  
**Dependencies**: MVP Scope, MVP Release Planning

13.1 **MVP Scope Document**:

  13.1.1 What is in MVP

  13.1.2 What is out of MVP

  13.1.3 Rationale for scope decisions

13.2 **MVP Release Notes**:

  13.2.1 Features included

  13.2.2 Known limitations

  13.2.3 User instructions

13.3 **MVP Learnings Document**:

  13.3.1 What was learned

  13.3.2 Assumptions validated/invalidated

  13.3.3 Feedback summary

  13.3.4 Next steps based on learnings

13.4 Format: Documentation templates for MVP artifacts.

## 14. MVP Schema Definition (Markdown Format)

14.1 **MVP Scope Document Template**:

```markdown
# MVP Scope: [Project Name]

## MVP Overview
[Brief description of MVP]

## Core Value Proposition
[Single most important value delivered]

## MVP Features
- [Feature 1]: [Description] - Links to: [Requirement IDs]
- [Feature 2]: [Description] - Links to: [Requirement IDs]

## Out of MVP Scope
- ❌ [Feature/Requirement explicitly excluded]
- ❌ [Feature/Requirement for Phase 2]

## MVP Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## MVP Release Plan
- **Target Date**: [Date]
- **Release Strategy**: [Approach]
- **Key Milestones**: [List]

## MVP Metrics
- [Metric 1]: [Target]
- [Metric 2]: [Target]

## Link to Requirements
- Requirements Document: [Link]
- MVP Requirements: [Link to subset]

## Link to Backlog
- MVP Backlog: [Link]
- MVP Tasks: [List of task IDs]
```

14.2 **MVP Feature Template** (if storing features separately):

```markdown
# MVP Feature: [Feature Name]
# Feature ID: [MVP-F-1]
# Status: [Planned / In Progress / Complete]

## Description
[Feature description]

## Core Value
[Why this feature is essential for MVP]

## Linked Requirements
- [Requirement ID: FR-X]
- [Requirement ID: FR-Y]

## Linked Tasks
- [Task ID: 1]
- [Task ID: 2]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Success Metrics
[How to measure if this feature delivers value]

## Notes
[Additional information]
```

## 15. AI Considerations

15.1 **How AI Should Use This Recipe**:

  15.1.1 Read pro-requirements-recipe.md to understand requirements

  15.1.2 Use this recipe to identify MVP scope from requirements

  15.1.3 Create MVP-focused backlog using pro-backlog-recipe.md

  15.1.4 Maintain traceability between requirements, MVP features, and backlog tasks

15.2 **MVP Scope Identification**:

  15.2.1 AI can help identify which requirements are essential for MVP

  15.2.2 AI should apply prioritization frameworks to determine MVP scope

  15.2.3 AI should flag when MVP scope seems too large or too small

15.3 **MVP Backlog Creation**:

  15.3.1 AI should create backlog tasks only for MVP features

  15.3.2 AI should mark non-MVP tasks for future phases

  15.3.3 AI should maintain MVP focus in task creation

15.4 **MVP Validation**:

  15.4.1 AI can help validate MVP scope against success criteria

  15.4.2 AI can suggest MVP scope adjustments based on requirements

15.5 **AI Boundary Setting**:

  15.5.1 AI should not expand MVP scope beyond defined boundaries

  15.5.2 AI should flag when tasks suggest scope expansion

  15.5.3 AI should maintain strict MVP focus

## 16. File Structure & Creation

16.1 **Project Structure**: Work within `agentic-sdlc/` directory - if it is not created, stop and ask the user if they initiated the project with Agentic SDLC.

16.2 **MVP Directory Structure**: Create MVP-related files:

```
agentic-sdlc/
├── requirements/
│   └── requirements-document.md    # Full requirements (from pro-requirements-recipe)
├── mvp/
│   ├── mvp-scope.md                 # MVP scope document
│   ├── mvp-features/                # Optional: individual feature files
│   │   ├── mvp-f-1.md
│   │   └── mvp-f-2.md
│   └── mvp-learnings.md             # Post-MVP learnings (created after release)
├── tasks/                           # Backlog tasks (from pro-backlog-recipe)
│   └── [MVP tasks marked clearly]
└── other files described in other instructions
```

16.3 **MVP Scope Document**: Create `mvp-scope.md` following the schema in section 14.

16.4 **MVP Features** (optional): If storing features separately, create individual files following the template in section 14.2.

16.5 **MVP Backlog**: Create MVP-focused backlog or mark MVP tasks clearly in main backlog.

16.6 **AI Instructions**: When AI creates MVP structure, it should:

  16.6.1 Create `mvp/` directory structure

  16.6.2 Create MVP scope document following the schema

  16.6.3 Identify MVP features from requirements

  16.6.4 Create MVP-focused backlog tasks

  16.6.5 Maintain traceability between requirements, MVP features, and tasks

  16.6.6 Keep MVP scope focused and avoid scope creep

## 17. Examples

[Examples section left empty for future branch]

## 18. Key Takeaways

18.1 MVP is the **minimum** version that delivers **viable** value to users.

18.2 MVP focuses on **core value proposition** and **essential features only**.

18.3 MVP must meet **quality standards** appropriate for its scope.

18.4 MVP enables **learning** from real user feedback and usage.

18.5 Use **pro-requirements-recipe.md** to identify MVP scope from requirements.

18.6 Use **pro-backlog-recipe.md** to create MVP-focused tasks.

18.7 Maintain **strict MVP boundaries** to avoid scope creep.

18.8 Plan for **iteration** based on MVP learnings and feedback.

18.9 MVP is not a prototype - it must be **usable by real users**.

18.10 MVP success is measured by **learning and validation**, not just feature completion.
