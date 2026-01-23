export function handleRecommendTool(args: any): any {
  const projectType = (args?.projectType as string)?.toLowerCase();
  const backlogName = args?.backlogName as string;
  const foundationalInfo = args?.foundationalInfo as any;
  const missingElements = args?.missingElements as any;

  if (!projectType || !backlogName || !foundationalInfo || !missingElements) {
    return {
      content: [
        {
          type: "text",
          text: "ERROR: Missing required parameters for recommendations!\n\nRequired: projectType, backlogName, foundationalInfo, missingElements.",
        },
      ],
      isError: true,
    };
  }

  if (!['mvp', 'poc', 'pro'].includes(projectType)) {
    return {
      content: [
        {
          type: "text",
          text: "ERROR: Invalid project type. Must be 'mvp', 'poc', or 'pro'.",
        },
      ],
      isError: true,
    };
  }

  // Generate recommendations based on foundational info and project type
  let recommendations: any = {};

  if (projectType === 'mvp') {
    const coreValue = foundationalInfo.mvpCoreValueProposition;
    if (!coreValue) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: Cannot generate recommendations without Core Value Proposition. This is a foundational requirement.",
          },
        ],
        isError: true,
      };
    }

    // Generate recommendations for missing MVP elements
    if (missingElements.mvpEssentialFeatures) {
      recommendations.mvpEssentialFeatures = [
        `Core feature to solve: ${coreValue.problem || 'the identified problem'}`,
        `User authentication/authorization (if needed for ${coreValue.primaryUser || 'users'})`,
        `Core user journey implementation: ${coreValue.coreUserJourney || 'the identified journey'}`,
        `Data persistence for core functionality`,
        `Basic UI/UX for primary user interactions`,
      ];
    }

    if (missingElements.mvpTechnologies) {
      recommendations.mvpTechnologies = [
        'Modern web framework (React, Vue, or Next.js for frontend)',
        'Backend framework (Node.js/Express, Python/FastAPI, or similar)',
        'Database (PostgreSQL, MongoDB, or SQLite for MVP)',
        'Authentication service (Auth0, Firebase Auth, or custom)',
        'Deployment platform (Vercel, AWS, or Heroku)',
      ];
    }

    if (missingElements.mvpArchitectureApproach) {
      recommendations.mvpArchitectureApproach = 'Monolithic architecture recommended for MVP to reduce complexity. Separate frontend and backend layers with RESTful API communication. Use MVC pattern for backend organization.';
    }

    if (missingElements.mvpPhases) {
      recommendations.mvpPhases = [
        'Phase 1: Project setup and core infrastructure',
        'Phase 2: Core feature implementation',
        'Phase 3: User interface and experience',
        'Phase 4: Testing, security review, and deployment',
      ];
    }

    if (missingElements.mvpSuccessCriteria) {
      recommendations.mvpSuccessCriteria = [
        `Core value delivered: ${coreValue.problem || 'problem'} solved for ${coreValue.primaryUser || 'users'}`,
        'All MVP features functional and tested',
        'Production-ready deployment',
        'User can complete core user journey successfully',
      ];
    }

    if (missingElements.mvpOutOfScope) {
      recommendations.mvpOutOfScope = [
        'Advanced analytics and reporting',
        'Third-party integrations beyond core functionality',
        'Mobile native apps (web-first for MVP)',
        'Advanced admin features',
        'Performance optimizations beyond basic requirements',
      ];
    }

    if (missingElements.mvpNonFunctionalRequirements) {
      recommendations.mvpNonFunctionalRequirements = [
        'Performance: Page load time < 3 seconds',
        'Security: HTTPS, authentication, input validation',
        'Availability: 99% uptime target',
        'Scalability: Support for initial user base (define size)',
        'Usability: Intuitive interface for primary users',
      ];
    }

    if (missingElements.mvpDataModels) {
      recommendations.mvpDataModels = 'Core entities: User, primary domain entities based on core value. Relationships: User owns/creates primary entities. Data validation: Required fields, type checking, constraints.';
    }

  } else if (projectType === 'poc') {
    const coreConcept = foundationalInfo.pocCoreConcept;
    if (!coreConcept) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: Cannot generate recommendations without Core Concept. This is a foundational requirement.",
          },
        ],
        isError: true,
      };
    }

    if (missingElements.pocEssentialProofPoints) {
      recommendations.pocEssentialProofPoints = [
        `Proof that: ${coreConcept.hypothesis || 'the hypothesis'}`,
        `Technical feasibility: ${coreConcept.technicalFeasibility || 'the technical concept'}`,
        'Basic integration/demonstration',
        'Core functionality working',
      ];
    }

    if (missingElements.pocTechnologies) {
      recommendations.pocTechnologies = [
        'Minimal tech stack to prove concept',
        'Rapid prototyping tools',
        'Simple data storage (if needed)',
      ];
    }

    if (missingElements.pocArchitectureApproach) {
      recommendations.pocArchitectureApproach = 'Simplified architecture focused on proof. Single application or minimal services. Quick iteration and testing.';
    }

    if (missingElements.pocPhases) {
      recommendations.pocPhases = [
        'Phase 1: Proof setup and core concept implementation',
        'Phase 2: Demonstrate key proof points',
        'Phase 3: Validate and document results',
      ];
    }

    if (missingElements.pocSuccessCriteria) {
      recommendations.pocSuccessCriteria = [
        `Hypothesis validated: ${coreConcept.hypothesis || 'the hypothesis'}`,
        `Technical feasibility proven: ${coreConcept.technicalFeasibility || 'the concept'}`,
        'Proof demonstration working',
      ];
    }

    if (missingElements.pocOutOfScope) {
      recommendations.pocOutOfScope = [
        'Production-ready code',
        'Full feature set',
        'Performance optimization',
        'Security hardening',
      ];
    }

  } else if (projectType === 'pro') {
    const objectives = foundationalInfo.proCoreObjectives || [];
    if (!objectives.length) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: Cannot generate recommendations without Core Objectives. This is a foundational requirement.",
          },
        ],
        isError: true,
      };
    }

    if (missingElements.proFunctionalRequirements) {
      recommendations.proFunctionalRequirements = objectives.map((obj: string, i: number) => 
        `FR-${i + 1}: ${obj} - Full implementation with all features`
      );
    }

    if (missingElements.proTechnologies) {
      recommendations.proTechnologies = [
        'Enterprise-grade framework',
        'Scalable database solution',
        'Microservices or modular architecture',
        'CI/CD pipeline',
        'Monitoring and logging tools',
      ];
    }

    if (missingElements.proArchitectureApproach) {
      recommendations.proArchitectureApproach = 'Modular architecture with clear separation of concerns. Consider microservices if scale requires. Layered architecture: presentation, business logic, data access.';
    }

    if (missingElements.proPhases) {
      recommendations.proPhases = [
        'Phase 1: Project setup and architecture',
        'Phase 2: Core functionality development',
        'Phase 3: Advanced features and integrations',
        'Phase 4: Testing, optimization, and deployment',
        'Phase 5: Documentation and handoff',
      ];
    }

    if (missingElements.proTargetUsers) {
      recommendations.proTargetUsers = [
        'Primary users: End users of the system',
        'Administrators: System administrators',
        'Stakeholders: Business stakeholders',
      ];
    }

    if (missingElements.proNonFunctionalRequirements) {
      recommendations.proNonFunctionalRequirements = [
        'Performance: Optimized for expected load',
        'Security: Enterprise-grade security',
        'Scalability: Horizontal scaling capability',
        'Reliability: 99.9% uptime',
        'Maintainability: Clean code, documentation',
      ];
    }

    if (missingElements.proOutOfScope) {
      recommendations.proOutOfScope = [
        'Future enhancements',
        'Legacy system integrations (unless specified)',
        'Mobile apps (unless specified)',
      ];
    }

    if (missingElements.proDataModels) {
      recommendations.proDataModels = 'Comprehensive data model based on functional requirements. Core entities, relationships, data validation, and business rules.';
    }
  }

  // Format recommendations for presentation
  const recommendationText = Object.entries(recommendations)
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
      if (Array.isArray(value)) {
        return `**${label}:**\n${value.map((v: any, i: number) => `  ${i + 1}. ${v}`).join('\n')}`;
      } else {
        return `**${label}:**\n  ${value}`;
      }
    })
    .join('\n\n');

  return {
    content: [
      {
        type: "text",
        text: `# AI Recommendations for ${projectType.toUpperCase()} Project: ${backlogName}

Based on your foundational information, here are my recommendations for the missing elements:

${recommendationText}

---

**Next Steps:**
1. Review these recommendations
2. Let me know if you'd like to:
   - Accept all recommendations (say "accept all" or "yes")
   - Modify specific recommendations (tell me what to change)
   - Reject and provide your own answers

Once confirmed, I'll proceed with creating your project structure using the 'init' tool.`,
      },
    ],
  };
}
