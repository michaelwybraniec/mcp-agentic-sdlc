/** Parse base.md and extract structured fields by project type. */
export function parseBaseMd(content: string, type: string): any {
  const data: any = {};

  if (type === 'mvp') {
    const problemMatch = content.match(/\*\*Problem:\*\*\s*(.+?)(?:\n|$)/);
    const primaryUserMatch = content.match(/\*\*Primary User:\*\*\s*(.+?)(?:\n|$)/);
    const coreUserJourneyMatch = content.match(/\*\*Core User Journey:\*\*\s*(.+?)(?:\n|$)/);

    if (problemMatch && primaryUserMatch && coreUserJourneyMatch) {
      data.mvpCoreValueProposition = {
        problem: problemMatch[1].trim(),
        primaryUser: primaryUserMatch[1].trim(),
        coreUserJourney: coreUserJourneyMatch[1].trim(),
      };
    }

    const featuresMatch = content.match(/##\s+\d+\.\s+Essential MVP Features\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (featuresMatch) {
      data.mvpFeatures = featuresMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const outOfScopeMatch = content.match(/##\s+\d+\.\s+Out of MVP Scope\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (outOfScopeMatch) {
      data.mvpOutOfScope = outOfScopeMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const successMatch = content.match(/##\s+\d+\.\s+MVP Success Criteria\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (successMatch) {
      data.mvpSuccessCriteria = successMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const techMatch = content.match(/##\s+\d+\.\s+Key Technologies\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (techMatch) {
      data.mvpTech = techMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const archMatch = content.match(/##\s+\d+\.\s+Architecture Approach\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (archMatch) {
      data.mvpArchitectureApproach = archMatch[1].trim();
    }

    const nonFuncMatch = content.match(/##\s+\d+\.\s+Non-Functional Requirements\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (nonFuncMatch) {
      data.mvpNonFunctional = nonFuncMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const dataModelsMatch = content.match(/##\s+\d+\.\s+Data Models\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (dataModelsMatch) {
      data.mvpDataModels = dataModelsMatch[1].trim();
    }

    const phasesMatch = content.match(/##\s+\d+\.\s+Project Phases\s*\(MVP\)\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (phasesMatch) {
      data.phases = phasesMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
  } else if (type === 'poc') {
    const hypothesisMatch = content.match(/\*\*Hypothesis:\*\*\s*(.+?)(?:\n|$)/);
    const technicalFeasibilityMatch = content.match(/\*\*Technical Feasibility:\*\*\s*(.+?)(?:\n|$)/);

    if (hypothesisMatch && technicalFeasibilityMatch) {
      data.pocCoreConcept = {
        hypothesis: hypothesisMatch[1].trim(),
        technicalFeasibility: technicalFeasibilityMatch[1].trim(),
      };
    }

    const proofPointsMatch = content.match(/##\s+\d+\.\s+Essential Proof Points\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (proofPointsMatch) {
      data.pocProofPoints = proofPointsMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const outOfScopeMatch = content.match(/##\s+\d+\.\s+Out of POC Scope\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (outOfScopeMatch) {
      data.pocOutOfScope = outOfScopeMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const successMatch = content.match(/##\s+\d+\.\s+POC Success Criteria\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (successMatch) {
      data.pocSuccessCriteria = successMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const techMatch = content.match(/##\s+\d+\.\s+Key Technologies\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (techMatch) {
      data.pocTech = techMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const archMatch = content.match(/##\s+\d+\.\s+Architecture Approach\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (archMatch) {
      data.pocArchitecture = archMatch[1].trim();
    }

    const phasesMatch = content.match(/##\s+\d+\.\s+Project Phases\s*\(POC\)\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (phasesMatch) {
      data.phases = phasesMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
  } else if (type === 'pro') {
    const objectivesMatch = content.match(/##\s+\d+\.\s+Core Objectives\s*\(User Provided\)\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (objectivesMatch) {
      data.proObjectives = objectivesMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const targetUsersMatch = content.match(/##\s+\d+\.\s+Target Users\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (targetUsersMatch) {
      data.proTargetUsers = targetUsersMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const functionalMatch = content.match(/##\s+\d+\.\s+Functional Requirements\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (functionalMatch) {
      data.proFunctional = functionalMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const nonFuncMatch = content.match(/##\s+\d+\.\s+Non-Functional Requirements\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (nonFuncMatch) {
      data.proNonFunctional = nonFuncMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const outOfScopeMatch = content.match(/##\s+\d+\.\s+Out of Scope\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (outOfScopeMatch) {
      data.proOutOfScope = outOfScopeMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const techMatch = content.match(/##\s+\d+\.\s+Key Technologies\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (techMatch) {
      data.proTech = techMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }

    const archMatch = content.match(/##\s+\d+\.\s+Architecture Approach\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (archMatch) {
      data.proArchitecture = archMatch[1].trim();
    }

    const dataModelsMatch = content.match(/##\s+\d+\.\s+Data Models\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (dataModelsMatch) {
      data.proDataModels = dataModelsMatch[1].trim();
    }

    const phasesMatch = content.match(/##\s+\d+\.\s+Project Phases\s*\(PRO\)\s*\n\n([\s\S]*?)(?=\n##|$)/);
    if (phasesMatch) {
      data.phases = phasesMatch[1].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
    }
  }

  return data;
}
