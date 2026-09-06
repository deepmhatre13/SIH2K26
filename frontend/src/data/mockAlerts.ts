import type { EarlyWarningAlert } from '../types';

export const MOCK_ALERTS: EarlyWarningAlert[] = [
  {
    id: 'alt-001',
    projectId: 'proj-001',
    projectName: 'Mumbai - Ahmedabad High Speed Rail Corridor (MAHSR Bullet Train)',
    sector: 'Railways',
    ministry: 'Ministry of Railways',
    agency: 'NHSRCL',
    severity: 'CRITICAL',
    alertType: 'COST_ESCALATION_SPIKE',
    headline: 'High Probability of >₹13,450 Cr Additional Cost Escalation on Package C-2 & E-1',
    description: 'Predictive algorithm detected severe divergence between JICA Yen-denominated loan disbursements and domestic EPC bidding quotes. Escalating inflation in specialty ballastless slab track components projected to push terminal cost beyond ₹178,000 Cr.',
    timestamp: '2026-04-12 09:30 IST',
    detectionLeadTimeMonths: 11.2,
    predictedCostImpactCr: 13450,
    predictedTimeImpactMonths: 14,
    prescriptiveRecommendations: [
      'Convene High-Level Steering Committee with MoR and Ministry of External Affairs regarding JICA Yen loan tranche hedging.',
      'Fast-track localization of ballastless track slab manufacturing under Make in India guidelines to save ~₹4,200 Cr.',
      'Direct NHSRCL to initiate value engineering review on underground power sub-stations.'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'alt-002',
    projectId: 'proj-003',
    projectName: 'Char Dham Mahamarg Vikas Pariyojana (889 km)',
    sector: 'Roads & Highways',
    ministry: 'Ministry of Road Transport and Highways (MoRTH)',
    agency: 'BRO & NHIDCL',
    severity: 'CRITICAL',
    alertType: 'LAND_ACQUISITION_PARALYSIS',
    headline: 'Silkyara-Barkot Tunnel Section Approaching Critical Geological Slippage Threshold',
    description: 'Post-subsidence structural monitoring indicates micro-shear zone movements in geological strata. Progress velocity decreased by 42% over preceding quarter with pending Forest Stage-II clearance for additional bypass escape portal.',
    timestamp: '2026-04-11 16:45 IST',
    detectionLeadTimeMonths: 7.8,
    predictedCostImpactCr: 1540,
    predictedTimeImpactMonths: 8,
    prescriptiveRecommendations: [
      'Deploy continuous Ground Penetrating Radar (GPR) and fiber-optic deformation sensors in coordination with NGI Norway.',
      'MoRTH to request immediate exemption from MoEFCC Forest Advisory Committee for safety egress portal.',
      'Mandate weekly geotechnical status telemetry directly into PAIMANA automated sensor feed.'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'alt-003',
    projectId: 'proj-002',
    projectName: 'Western Dedicated Freight Corridor (Dadri to JNPT Port)',
    sector: 'Railways',
    ministry: 'Ministry of Railways',
    agency: 'DFCCIL',
    severity: 'HIGH',
    alertType: 'SCHEDULE_CRITICAL_SLIPPAGE',
    headline: 'Terminal JNPT Port Connectivity Section Stalled Due to Mangrove Clearance & RoW',
    description: 'Final 109 km Vaitarna-JNPT stretch has achieved only 1.2% progress over past 90 days. Risk of domino delay on freight modal share transition from Nhava Sheva container terminals.',
    timestamp: '2026-04-09 11:15 IST',
    detectionLeadTimeMonths: 6.5,
    predictedCostImpactCr: 2670,
    predictedTimeImpactMonths: 9,
    prescriptiveRecommendations: [
      'Organize joint site inspection by Cabinet Secretariat PMG (Project Monitoring Group) with Chief Secretary Maharashtra.',
      'Expedite compensatory afforestation deposit of ₹48 Cr to State Forest Development Corporation.',
      'Implement round-the-clock double-shift mechanized track laying once civil clearance is handed over.'
    ],
    status: 'INTERVENTION_INITIATED'
  },
  {
    id: 'alt-004',
    projectId: 'proj-008',
    projectName: 'Talcher Coal Gasification-Based Ammonia-Urea Complex',
    sector: 'Coal',
    ministry: 'Ministry of Chemicals and Fertilizers',
    agency: 'Talcher Fertilizers Limited',
    severity: 'HIGH',
    alertType: 'CONTRACTOR_DISTRESS',
    headline: 'Foreign Vendor Technical Specialist Mobilization Lag on Gasifier Integration',
    description: 'Critical path milestone for high-temperature synthesis gas commissioning is behind schedule by 115 days. International EPC consortium facing visa processing delays and delayed refractory materials delivery.',
    timestamp: '2026-04-08 14:20 IST',
    detectionLeadTimeMonths: 5.4,
    predictedCostImpactCr: 1750,
    predictedTimeImpactMonths: 6,
    prescriptiveRecommendations: [
      'Issue fast-track Business/Project visa recommendations through Ministry of External Affairs for 45 specialist commissioning engineers.',
      'Impose liquidated damages (LD) clause warning on refractory supplier for immediate airlift delivery.',
      'Mobilize senior technical taskforce from PDIL (Projects & Development India Limited) to supervise cold testing.'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'alt-005',
    projectId: 'proj-006',
    projectName: 'Navi Mumbai International Airport (Phase I)',
    sector: 'Civil Aviation',
    ministry: 'Ministry of Civil Aviation',
    agency: 'CIDCO / NMIAL',
    severity: 'MEDIUM',
    alertType: 'DISBURSEMENT_DECELERATION',
    headline: 'DGCA Flight Calibration and Security Clearance Window Narrowing for Q4 Commercial Opening',
    description: 'Terminal Baggage Handling System integration testing at 68% vs 85% planned. Runway calibration successful, but statutory multi-agency security and customs dry runs require synchronized scheduling.',
    timestamp: '2026-04-05 17:00 IST',
    detectionLeadTimeMonths: 4.0,
    predictedCostImpactCr: 420,
    predictedTimeImpactMonths: 3,
    prescriptiveRecommendations: [
      'Convene tripartite coordination meeting with BCAS (Bureau of Civil Aviation Security), CISF, and Customs Commissioner.',
      'Accelerate commercial airline trial schedules with Air India & IndiGo for proving flights.',
      'Establish dedicated on-site DGCA inspection desk for rapid snag list sign-offs.'
    ],
    status: 'ACKNOWLEDGED'
  }
];
