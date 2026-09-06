export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ProjectStatus = 'ON_TRACK' | 'AT_RISK' | 'CRITICAL_DELAY' | 'COMPLETED';

export type SectorType = 
  | 'Roads & Highways'
  | 'Railways'
  | 'Petroleum & Natural Gas'
  | 'Power'
  | 'Coal'
  | 'Civil Aviation'
  | 'Ports & Shipping'
  | 'Urban Development & Metro'
  | 'Water Resources'
  | 'Atomic Energy'
  | 'Telecommunications'
  | 'Mines & Steel';

export interface Milestone {
  id: string;
  name: string;
  originalDate: string;
  revisedDate: string;
  actualDate?: string;
  status: 'COMPLETED' | 'DELAYED' | 'AT_RISK' | 'PENDING' | 'ON_TRACK';
  weightagePercent: number;
  slippageMonths: number;
  criticalPath: boolean;
}

export interface Bottleneck {
  id: string;
  category: 'Land Acquisition' | 'Forest Clearance' | 'Right of Way (RoW)' | 'Contractor Financial Stress' | 'Law & Order' | 'Utility Shifting' | 'Scope Revision' | 'Court Litigation';
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  reportedDate: string;
  delayImpactMonths: number;
  costImpactCr: number;
  status: 'UNRESOLVED' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED';
  agencyActionRequired: string;
}

export interface CUFFields {
  cufFormId: string;
  reportingMonth: string;
  sanctionCostCr: number;
  originalCommissioningDate: string;
  approvedRevisedCostCr: number;
  cumulativeExpenditureCr: number;
  expenditureCurrentFYCr: number;
  physicalProgressPercent: number;
  financialProgressPercent: number;
  totalMilestonesCount: number;
  milestonesAchievedCount: number;
  isContractorDefault: boolean;
  landAcquisitionStatusPercent: number;
  environmentalClearanceStatus: 'OBTAINED' | 'STAGE_1' | 'STAGE_2_PENDING' | 'NOT_INITIATED';
}

export interface RiskBreakdown {
  scheduleRiskScore: number;       // 0-100 (Weight: 35%)
  costEscalationRiskScore: number;  // 0-100 (Weight: 30%)
  regulatoryBottleneckScore: number;// 0-100 (Weight: 20%)
  agencyContractorRiskScore: number;// 0-100 (Weight: 15%)
  compositeScore: number;           // 0-100 (PCRI)
}

export interface Project {
  id: string;
  ocmsCode: string;
  paimanaId: string;
  name: string;
  sector: SectorType;
  ministry: string;
  implementingAgency: string;
  state: string;
  locationDetails: string;
  
  // Financial telemetry (All in ₹ Crore)
  originalCostCr: number;
  revisedCostCr: number;
  predictedFinalCostCr: number;
  costOverrunCr: number;
  costOverrunPercent: number;
  cumulativeExpenditureCr: number;
  financialProgressPercent: number;

  // Timeline telemetry
  originalSanctionDate: string;
  originalCompletionDate: string;
  revisedCompletionDate: string;
  predictedCompletionDate: string;
  timeOverrunMonths: number;
  physicalProgressPercent: number;

  // Risk & Status
  status: ProjectStatus;
  riskLevel: RiskLevel;
  riskBreakdown: RiskBreakdown;
  aiEarlyWarningTriggered: boolean;
  earlyWarningDate?: string;
  aiConfidenceScore: number; // e.g. 94.2%

  // Details
  milestones: Milestone[];
  bottlenecks: Bottleneck[];
  cufData: CUFFields;
  executiveSummary: string;
}

export interface EarlyWarningAlert {
  id: string;
  projectId: string;
  projectName: string;
  sector: SectorType;
  ministry: string;
  agency: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  alertType: 'COST_ESCALATION_SPIKE' | 'SCHEDULE_CRITICAL_SLIPPAGE' | 'LAND_ACQUISITION_PARALYSIS' | 'CONTRACTOR_DISTRESS' | 'DISBURSEMENT_DECELERATION';
  headline: string;
  description: string;
  timestamp: string;
  detectionLeadTimeMonths: number;
  predictedCostImpactCr: number;
  predictedTimeImpactMonths: number;
  prescriptiveRecommendations: string[];
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'INTERVENTION_INITIATED' | 'RESOLVED';
}

export interface SectorBenchmark {
  sector: SectorType;
  activeProjectsCount: number;
  totalApprovedCostCr: number;
  totalExpenditureCr: number;
  avgCostOverrunPercent: number;
  avgScheduleDelayMonths: number;
  highRiskProjectsCount: number;
  milestoneAdherenceRatePercent: number;
  topBottleneck: string;
}

export interface MinistryBenchmark {
  ministry: string;
  shortCode: string;
  projectCount: number;
  budgetOutlayCr: number;
  expenditureCr: number;
  costOverrunPercent: number;
  avgDelayMonths: number;
  efficiencyRating: 'A+' | 'A' | 'B' | 'C' | 'D';
}

export interface AgencyBenchmark {
  agencyName: string;
  sector: SectorType;
  projectsMonitored: number;
  portfolioValueCr: number;
  avgDelayMonths: number;
  costVariancePercent: number;
  performanceScore: number; // 0 - 100
}

export interface ModelComparisonMetrics {
  metricName: string;
  conventionalStatistical: number | string;
  aiMachineLearning: number | string;
  improvementGain: string;
  unit: string;
}

export interface SHAPFeatureImportance {
  featureName: string;
  source: 'CUF Field' | 'External Non-CUF';
  importanceScore: number;
  impactDirection: 'increases_overrun' | 'decreases_overrun';
  description: string;
}

export interface WhatIfSimulationInput {
  landAcquisitionDelayMonths: number;
  environmentalClearanceMonths: number;
  commodityInflationRatePercent: number;
  contractorCashflowLagFactor: number;
  monsoonDisruptionDays: number;
}

export interface WhatIfSimulationResult {
  basePredictedCostCr: number;
  simulatedCostCr: number;
  costDeltaCr: number;
  costDeltaPercent: number;
  basePredictedMonths: number;
  simulatedMonths: number;
  timeDeltaMonths: number;
  newRiskScore: number;
  newRiskLevel: RiskLevel;
  confidenceLowerBoundCr: number;
  confidenceUpperBoundCr: number;
  keyVulnerabilityFactors: string[];
}

export interface LLMChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  referencedProjectIds?: string[];
  suggestedFollowUps?: string[];
}
