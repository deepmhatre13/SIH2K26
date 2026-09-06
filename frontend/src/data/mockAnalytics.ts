import type { SectorBenchmark, MinistryBenchmark, AgencyBenchmark, ModelComparisonMetrics, SHAPFeatureImportance } from '../types';

export const MACRO_PORTFOLIO_STATS = {
  reportingCycle: 'April 2026',
  totalMonitoredProjects: 1981,
  totalMinistriesMonitored: 17,
  totalSectorsMonitored: 22,
  originalCostTotalLakhCr: 37.13,
  revisedCostTotalLakhCr: 42.78,
  anticipatedEscalationLakhCr: 5.65,
  escalationPercentage: 15.22,
  cumulativeExpenditureLakhCr: 20.36,
  expenditureRatioPercent: 47.59,
  
  // Project risk & status breakdown
  projectsWithCostOverrun: 456,
  projectsWithTimeOverrun: 842,
  avgTimeOverrunMonths: 36.4,
  projectsWithoutDelay: 1139,
  projectsInRedAlert: 218,
  projectsInAmberAlert: 512,
  projectsInGreenNormal: 1251,

  // Prediction model performance
  earlyWarningLeadTimeMonths: 8.4,
  modelAccuracyScorePercent: 91.8,
  preventedEscalationPotentialCr: 48500
};

export const AI_VS_STATISTICAL_METRICS: ModelComparisonMetrics[] = [
  {
    metricName: 'Cost Overrun Forecasting Accuracy (R² Score)',
    conventionalStatistical: 0.612,
    aiMachineLearning: 0.884,
    improvementGain: '+44.4% Accuracy',
    unit: 'Score (0-1)'
  },
  {
    metricName: 'Mean Absolute Percentage Error (MAPE)',
    conventionalStatistical: '28.4%',
    aiMachineLearning: '11.2%',
    improvementGain: '60.5% Error Reduction',
    unit: 'Percentage'
  },
  {
    metricName: 'Early Warning Lead Time Before Materialization',
    conventionalStatistical: '1.8 Months',
    aiMachineLearning: '8.4 Months',
    improvementGain: '+6.6 Months Advance Notice',
    unit: 'Months'
  },
  {
    metricName: 'Schedule Slippage Prediction RMSE',
    conventionalStatistical: '14.2 Months',
    aiMachineLearning: '5.1 Months',
    improvementGain: '64.1% Precision Gain',
    unit: 'Months'
  },
  {
    metricName: 'False Alarm Rate on Risk Triggers',
    conventionalStatistical: '34.6%',
    aiMachineLearning: '8.9%',
    improvementGain: '74.3% Reduction in False Positives',
    unit: 'Percentage'
  },
  {
    metricName: 'Non-Linear Regulatory & Weather Factor Synthesis',
    conventionalStatistical: 'Not Supported (Linear)',
    aiMachineLearning: 'Multi-Modal Gradient Boosted + NLP',
    improvementGain: 'Automated Bottleneck Extraction',
    unit: 'Capability'
  }
];

export const SHAP_FEATURE_ATTRIBUTION: SHAPFeatureImportance[] = [
  {
    featureName: 'Cumulative Expenditure Velocity / Burn Rate',
    source: 'CUF Field',
    importanceScore: 0.23,
    impactDirection: 'increases_overrun',
    description: 'Deceleration in monthly expenditure relative to time elapsed indicates vendor cash crunch or stalled field work.'
  },
  {
    featureName: 'Land Acquisition Pending Percentage',
    source: 'CUF Field',
    importanceScore: 0.19,
    impactDirection: 'increases_overrun',
    description: 'Projects starting construction with <80% contiguous land acquired have 4.2x higher likelihood of contractual idling claims.'
  },
  {
    featureName: 'State-Level Right of Way (RoW) Clearance Delay Index',
    source: 'External Non-CUF',
    importanceScore: 0.16,
    impactDirection: 'increases_overrun',
    description: 'Historical clearance turnaround by State revenue authorities; unaccounted for in standard CUF monthly submissions.'
  },
  {
    featureName: 'Physical vs. Financial Progress Divergence Gap',
    source: 'CUF Field',
    importanceScore: 0.14,
    impactDirection: 'increases_overrun',
    description: 'When financial disbursal outpaces physical site completion by >15%, cost overrun risk increases exponentially.'
  },
  {
    featureName: 'Commodity Inflation Volatility (Steel / Cement Index)',
    source: 'External Non-CUF',
    importanceScore: 0.11,
    impactDirection: 'increases_overrun',
    description: 'Wholesale Price Index (WPI) escalation on core construction commodities during active procurement window.'
  },
  {
    featureName: 'Milestone Achievement Velocity (Achieved vs Scheduled)',
    source: 'CUF Field',
    importanceScore: 0.09,
    impactDirection: 'increases_overrun',
    description: 'Slippage on early Stage-I milestones is the strongest forward indicator of terminal project delay.'
  },
  {
    featureName: 'Contractor Debt-to-Equity & Credit Risk Profile',
    source: 'External Non-CUF',
    importanceScore: 0.08,
    impactDirection: 'increases_overrun',
    description: 'EPC contractor balance-sheet liquidity and exposure to multiple stressed infrastructure packages simultaneously.'
  }
];

export const SECTOR_BENCHMARKS: SectorBenchmark[] = [
  {
    sector: 'Railways',
    activeProjectsCount: 462,
    totalApprovedCostCr: 694000,
    totalExpenditureCr: 378000,
    avgCostOverrunPercent: 38.6,
    avgScheduleDelayMonths: 48.2,
    highRiskProjectsCount: 78,
    milestoneAdherenceRatePercent: 64.2,
    topBottleneck: 'Himalayan Geology & Land Acquisition'
  },
  {
    sector: 'Roads & Highways',
    activeProjectsCount: 814,
    totalApprovedCostCr: 885000,
    totalExpenditureCr: 541000,
    avgCostOverrunPercent: 12.8,
    avgScheduleDelayMonths: 21.4,
    highRiskProjectsCount: 62,
    milestoneAdherenceRatePercent: 78.9,
    topBottleneck: 'Right of Way (RoW) & Forest Clearances'
  },
  {
    sector: 'Petroleum & Natural Gas',
    activeProjectsCount: 168,
    totalApprovedCostCr: 412000,
    totalExpenditureCr: 289000,
    avgCostOverrunPercent: 9.4,
    avgScheduleDelayMonths: 18.6,
    highRiskProjectsCount: 14,
    milestoneAdherenceRatePercent: 84.1,
    topBottleneck: 'Offshore Vessel Availability'
  },
  {
    sector: 'Power',
    activeProjectsCount: 194,
    totalApprovedCostCr: 520000,
    totalExpenditureCr: 364000,
    avgCostOverrunPercent: 26.2,
    avgScheduleDelayMonths: 39.8,
    highRiskProjectsCount: 32,
    milestoneAdherenceRatePercent: 69.5,
    topBottleneck: 'Boiler Vendor Litigation & FGD Retrofits'
  },
  {
    sector: 'Urban Development & Metro',
    activeProjectsCount: 112,
    totalApprovedCostCr: 345000,
    totalExpenditureCr: 168000,
    avgCostOverrunPercent: 14.1,
    avgScheduleDelayMonths: 28.5,
    highRiskProjectsCount: 16,
    milestoneAdherenceRatePercent: 76.3,
    topBottleneck: 'Underground Utilities & Traffic Diversion'
  },
  {
    sector: 'Civil Aviation',
    activeProjectsCount: 58,
    totalApprovedCostCr: 98000,
    totalExpenditureCr: 62000,
    avgCostOverrunPercent: 18.5,
    avgScheduleDelayMonths: 24.1,
    highRiskProjectsCount: 8,
    milestoneAdherenceRatePercent: 79.4,
    topBottleneck: 'Village Resettlement & Runway Earthwork'
  },
  {
    sector: 'Coal',
    activeProjectsCount: 96,
    totalApprovedCostCr: 148000,
    totalExpenditureCr: 89000,
    avgCostOverrunPercent: 21.9,
    avgScheduleDelayMonths: 32.7,
    highRiskProjectsCount: 12,
    milestoneAdherenceRatePercent: 71.8,
    topBottleneck: 'Forest Divergence & Stage-II Clearance'
  },
  {
    sector: 'Ports & Shipping',
    activeProjectsCount: 77,
    totalApprovedCostCr: 135000,
    totalExpenditureCr: 45000,
    avgCostOverrunPercent: 8.2,
    avgScheduleDelayMonths: 16.4,
    highRiskProjectsCount: 6,
    milestoneAdherenceRatePercent: 86.2,
    topBottleneck: 'Coastal CRZ Clearances & Capital Dredging'
  }
];

export const MINISTRY_BENCHMARKS: MinistryBenchmark[] = [
  {
    ministry: 'Ministry of Road Transport and Highways',
    shortCode: 'MoRTH',
    projectCount: 814,
    budgetOutlayCr: 885000,
    expenditureCr: 541000,
    costOverrunPercent: 12.8,
    avgDelayMonths: 21.4,
    efficiencyRating: 'A'
  },
  {
    ministry: 'Ministry of Railways',
    shortCode: 'MoR',
    projectCount: 462,
    budgetOutlayCr: 694000,
    expenditureCr: 378000,
    costOverrunPercent: 38.6,
    avgDelayMonths: 48.2,
    efficiencyRating: 'C'
  },
  {
    ministry: 'Ministry of Petroleum & Natural Gas',
    shortCode: 'MoPNG',
    projectCount: 168,
    budgetOutlayCr: 412000,
    expenditureCr: 289000,
    costOverrunPercent: 9.4,
    avgDelayMonths: 18.6,
    efficiencyRating: 'A+'
  },
  {
    ministry: 'Ministry of Power',
    shortCode: 'MoP',
    projectCount: 194,
    budgetOutlayCr: 520000,
    expenditureCr: 364000,
    costOverrunPercent: 26.2,
    avgDelayMonths: 39.8,
    efficiencyRating: 'B'
  },
  {
    ministry: 'Ministry of Housing and Urban Affairs',
    shortCode: 'MoHUA',
    projectCount: 112,
    budgetOutlayCr: 345000,
    expenditureCr: 168000,
    costOverrunPercent: 14.1,
    avgDelayMonths: 28.5,
    efficiencyRating: 'A'
  },
  {
    ministry: 'Ministry of Coal',
    shortCode: 'MoC',
    projectCount: 96,
    budgetOutlayCr: 148000,
    expenditureCr: 89000,
    costOverrunPercent: 21.9,
    avgDelayMonths: 32.7,
    efficiencyRating: 'B'
  }
];

export const AGENCY_BENCHMARKS: AgencyBenchmark[] = [
  { agencyName: 'NHAI', sector: 'Roads & Highways', projectsMonitored: 580, portfolioValueCr: 620000, avgDelayMonths: 19.8, costVariancePercent: 11.2, performanceScore: 88 },
  { agencyName: 'NTPC Limited', sector: 'Power', projectsMonitored: 42, portfolioValueCr: 165000, avgDelayMonths: 32.4, costVariancePercent: 22.8, performanceScore: 78 },
  { agencyName: 'ONGC', sector: 'Petroleum & Natural Gas', projectsMonitored: 38, portfolioValueCr: 142000, avgDelayMonths: 16.2, costVariancePercent: 8.9, performanceScore: 91 },
  { agencyName: 'DFCCIL', sector: 'Railways', projectsMonitored: 6, portfolioValueCr: 124000, avgDelayMonths: 54.0, costVariancePercent: 78.4, performanceScore: 68 },
  { agencyName: 'RVNL', sector: 'Railways', projectsMonitored: 84, portfolioValueCr: 98000, avgDelayMonths: 41.2, costVariancePercent: 34.6, performanceScore: 74 },
  { agencyName: 'Power Grid (PGCIL)', sector: 'Power', projectsMonitored: 64, portfolioValueCr: 84000, avgDelayMonths: 11.5, costVariancePercent: 4.8, performanceScore: 94 },
  { agencyName: 'CMRL', sector: 'Urban Development & Metro', projectsMonitored: 4, portfolioValueCr: 63246, avgDelayMonths: 26.0, costVariancePercent: 8.5, performanceScore: 86 }
];

export const HISTORICAL_S_CURVE_DATA = [
  { month: 'M-0', plannedPhysical: 0, actualPhysical: 0, plannedFinancial: 0, actualFinancial: 0 },
  { month: 'M-12', plannedPhysical: 18, actualPhysical: 14, plannedFinancial: 15, actualFinancial: 12 },
  { month: 'M-24', plannedPhysical: 38, actualPhysical: 28, plannedFinancial: 32, actualFinancial: 29 },
  { month: 'M-36', plannedPhysical: 62, actualPhysical: 46, plannedFinancial: 54, actualFinancial: 50 },
  { month: 'M-48', plannedPhysical: 84, actualPhysical: 64, plannedFinancial: 76, actualFinancial: 71 },
  { month: 'M-60', plannedPhysical: 96, actualPhysical: 78, plannedFinancial: 90, actualFinancial: 82 },
  { month: 'Current (M-72)', plannedPhysical: 100, actualPhysical: 86, plannedFinancial: 100, actualFinancial: 89 },
  { month: 'Predicted M-84', plannedPhysical: 100, actualPhysical: 95, plannedFinancial: 100, actualFinancial: 96 },
  { month: 'Predicted M-92', plannedPhysical: 100, actualPhysical: 100, plannedFinancial: 100, actualFinancial: 100 }
];
