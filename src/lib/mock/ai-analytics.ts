/**
 * AI/ML Analytics data for the Intelligence Sidebar.
 * Simulates fleet-wide analysis from aggregated dynamic data.
 */

// ─── Fleet Health Composite Score ───────────────────────────

export interface FleetHealthScore {
  overall: number; // 0-100
  weeklyDelta: number;
  breakdown: {
    label: string;
    score: number;
    weight: number;
    status: "good" | "warning" | "critical";
    color: string;
  }[];
}

export function getFleetHealthScore(): FleetHealthScore {
  const breakdown = [
    {
      label: "Performance Ratio",
      score: 81,
      weight: 0.3,
      status: "warning" as const,
      color: "#F59E0B",
    },
    {
      label: "Availability",
      score: 97,
      weight: 0.25,
      status: "good" as const,
      color: "#22C55E",
    },
    {
      label: "Degradation",
      score: 92,
      weight: 0.2,
      status: "good" as const,
      color: "#22C55E",
    },
    {
      label: "Revenue Impact",
      score: 74,
      weight: 0.15,
      status: "warning" as const,
      color: "#F59E0B",
    },
    {
      label: "Compliance",
      score: 95,
      weight: 0.1,
      status: "good" as const,
      color: "#22C55E",
    },
  ];

  const overall = Math.round(
    breakdown.reduce((sum, b) => sum + b.score * b.weight, 0),
  );

  return { overall, weeklyDelta: -1.2, breakdown };
}

// ─── Fleet Health History ──────────────────────────────────

export interface FleetHealthWeek {
  week: string;
  score: number;
}

export function getFleetHealthHistory(): FleetHealthWeek[] {
  return [
    { week: "W1", score: 91 },
    { week: "W2", score: 90 },
    { week: "W3", score: 89 },
    { week: "W4", score: 90 },
    { week: "W5", score: 89 },
    { week: "W6", score: 89 },
    { week: "W7", score: 88 },
    { week: "W8", score: 88 },
  ];
}

// ─── AI Insights Feed ───────────────────────────────────────

export interface AIInsight {
  id: string;
  category: "performance" | "maintenance" | "financial" | "compliance" | "anomaly";
  severity: "info" | "warning" | "critical" | "success";
  confidence: number; // 0-100
  title: string;
  detail: string;
  action?: { label: string; href: string };
  timestamp: string;
}

const CATEGORY_LABELS: Record<AIInsight["category"], string> = {
  performance: "Performance",
  maintenance: "Maintenance",
  financial: "Financial",
  compliance: "Compliance",
  anomaly: "Anomaly",
};

export { CATEGORY_LABELS };

export function getAIInsights(): AIInsight[] {
  return [
    {
      id: "ins-001",
      category: "maintenance",
      severity: "warning",
      confidence: 94,
      title: "Cleaning recommended in 5 days",
      detail:
        "Soiling loss pattern analysis suggests optimal cleaning window Apr 14-16. Delaying 10+ days costs an estimated €156/mo.",
      action: { label: "Schedule", href: "/app/analytics" },
      timestamp: "2 min ago",
    },
    {
      id: "ins-002",
      category: "performance",
      severity: "critical",
      confidence: 91,
      title: "WRM-600 PR dropped below 75%",
      detail:
        "Module WRM-600-LOT-07 underperforming fleet average by 10.3%. Pattern suggests partial shading or bypass diode failure.",
      action: { label: "Investigate", href: "/app/passports" },
      timestamp: "18 min ago",
    },
    {
      id: "ins-003",
      category: "financial",
      severity: "info",
      confidence: 88,
      title: "€2,400/yr optimization identified",
      detail:
        "Switching to 21-day cleaning cycles (from 30-day) and fixing clipping on 2 inverters recovers 3.2% annual yield.",
      action: { label: "View Plan", href: "/app/analytics" },
      timestamp: "1h ago",
    },
    {
      id: "ins-004",
      category: "anomaly",
      severity: "warning",
      confidence: 86,
      title: "Degradation anomaly detected",
      detail:
        "Year-1 degradation of 1.1% on WRM-600-LOT-07 exceeds expected 0.8%. ML model flags 72% probability of exceeding warranty rate by Year 5.",
      action: { label: "Details", href: "/app/analytics" },
      timestamp: "3h ago",
    },
    {
      id: "ins-005",
      category: "compliance",
      severity: "success",
      confidence: 99,
      title: "IEC 61215 renewed successfully",
      detail:
        "Certificate auto-verified via registry. Valid until 2028-04-01. No action required.",
      timestamp: "6h ago",
    },
    {
      id: "ins-006",
      category: "performance",
      severity: "info",
      confidence: 82,
      title: "Fleet PR stabilizing at 81.4%",
      detail:
        "After declining 2.1% QoQ, PR trend shows stabilization. Seasonal irradiance increase expected to push PR to 83%+ by May.",
      timestamp: "1d ago",
    },
  ];
}

// ─── Predictive Maintenance ─────────────────────────────────

export interface MaintenancePrediction {
  nextCleaning: {
    daysUntil: number;
    estimatedSoilingAtCleaning: number;
    costIfDelayed: number;
  };
  componentRisk: {
    modulesAtRisk: number;
    highestRisk: string;
    failureProbability30d: number;
    failureProbability90d: number;
  };
  maintenanceROI: {
    cleaningCostEur: number;
    annualSavingsEur: number;
    paybackDays: number;
  };
}

export function getMaintenancePredictions(): MaintenancePrediction {
  return {
    nextCleaning: {
      daysUntil: 5,
      estimatedSoilingAtCleaning: 6.8,
      costIfDelayed: 156000,
    },
    componentRisk: {
      modulesAtRisk: 247,
      highestRisk: "WRM-600-LOT-07",
      failureProbability30d: 4.2,
      failureProbability90d: 11.8,
    },
    maintenanceROI: {
      cleaningCostEur: 85000,
      annualSavingsEur: 1872000,
      paybackDays: 17,
    },
  };
}

// ─── Revenue Intelligence ───────────────────────────────────

export interface RevenueIntelligence {
  monthlyLoss: number;
  annualProjected: number;
  optimizationPotential: number;
  lossDrivers: {
    category: string;
    euroPerMonth: number;
    percent: number;
    color: string;
    trend: "up" | "down" | "stable";
  }[];
}

export function getRevenueIntelligence(): RevenueIntelligence {
  return {
    monthlyLoss: 12400,
    annualProjected: 148800,
    optimizationPotential: 2400000,
    lossDrivers: [
      {
        category: "Soiling",
        euroPerMonth: 5600,
        percent: 45,
        color: "#F59E0B",
        trend: "up",
      },
      {
        category: "Clipping",
        euroPerMonth: 2400,
        percent: 19,
        color: "#3B82F6",
        trend: "stable",
      },
      {
        category: "Degradation",
        euroPerMonth: 2800,
        percent: 23,
        color: "#737373",
        trend: "up",
      },
      {
        category: "Downtime",
        euroPerMonth: 1600,
        percent: 13,
        color: "#EF4444",
        trend: "down",
      },
    ],
  };
}

// ─── Performance Forecast ───────────────────────────────────

export interface PerformanceForecast {
  pr30dForecast: number[];
  prTarget: number;
  degradationTrajectory: { year: number; actual: number; warranty: number }[];
  seasonalOutlook: string;
}

export function getPerformanceForecast(): PerformanceForecast {
  return {
    pr30dForecast: [81.4, 81.6, 81.9, 82.2, 82.5, 82.8, 83.1, 83.4],
    prTarget: 85,
    degradationTrajectory: [
      { year: 0, actual: 100, warranty: 97 },
      { year: 5, actual: 97.8, warranty: 94.2 },
      { year: 10, actual: 95.4, warranty: 91.5 },
      { year: 15, actual: 93.1, warranty: 88.7 },
      { year: 20, actual: 90.6, warranty: 86 },
      { year: 25, actual: 88.2, warranty: 83.2 },
    ],
    seasonalOutlook:
      "Irradiance increasing — expect PR +1.5% by May. Summer clipping risk high for oversized arrays.",
  };
}

// ─── Anomaly Stream ─────────────────────────────────────────

export interface MLAnomaly {
  id: string;
  timestamp: string;
  type: string;
  severity: "low" | "medium" | "high";
  mlConfidence: number;
  pattern: "recurring" | "one-off" | "escalating";
  description: string;
  resolved: boolean;
  module?: string;
}

export function getAnomalyStream(): MLAnomaly[] {
  return [
    {
      id: "ML-001",
      timestamp: "14 min ago",
      type: "Power Drop",
      severity: "medium",
      mlConfidence: 92,
      pattern: "recurring",
      description: "18% output drop detected — matches afternoon shading pattern from last 3 weeks",
      resolved: false,
      module: "WRM-600-LOT-07",
    },
    {
      id: "ML-002",
      timestamp: "2h ago",
      type: "Thermal Stress",
      severity: "low",
      mlConfidence: 78,
      pattern: "one-off",
      description: "Module temp 62°C for 20 min — within tolerance, no degradation impact predicted",
      resolved: true,
      module: "HT-555-BF-03",
    },
    {
      id: "ML-003",
      timestamp: "6h ago",
      type: "Inverter Clipping",
      severity: "high",
      mlConfidence: 96,
      pattern: "recurring",
      description: "28h clipping in March — oversized array likely. €2.4/mo in lost revenue.",
      resolved: false,
    },
    {
      id: "ML-004",
      timestamp: "1d ago",
      type: "Soiling Spike",
      severity: "medium",
      mlConfidence: 88,
      pattern: "escalating",
      description: "Soiling rate accelerated 1.8x after dust storm — cleaning urgency elevated",
      resolved: false,
    },
  ];
}

// ─── Fleet Benchmarking ────────────────────────────────────

export interface FleetBenchmark {
  moduleId: string;
  modelId: string;
  manufacturer: string;
  pr: number; // current PR%
  delta: number; // vs fleet average
  rank: number;
  status: "outperforming" | "normal" | "underperforming";
}

export function getFleetBenchmarking(): FleetBenchmark[] {
  return [
    {
      moduleId: "WRM-600-LOT-01",
      modelId: "WRM-600",
      manufacturer: "Roshan",
      pr: 87.2,
      delta: 5.8,
      rank: 1,
      status: "outperforming",
    },
    {
      moduleId: "VSMDH-450-LOT-02",
      modelId: "VSMDH-450",
      manufacturer: "Vikram Solar",
      pr: 86.1,
      delta: 4.7,
      rank: 2,
      status: "outperforming",
    },
    {
      moduleId: "ASM-540-LOT-01",
      modelId: "ASM-540",
      manufacturer: "Adani Solar",
      pr: 85.3,
      delta: 3.9,
      rank: 3,
      status: "outperforming",
    },
    {
      moduleId: "WRM-600-LOT-03",
      modelId: "WRM-600",
      manufacturer: "Roshan",
      pr: 83.8,
      delta: 2.4,
      rank: 4,
      status: "normal",
    },
    {
      moduleId: "VSMDH-450-LOT-04",
      modelId: "VSMDH-450",
      manufacturer: "Vikram Solar",
      pr: 82.6,
      delta: 1.2,
      rank: 5,
      status: "normal",
    },
    {
      moduleId: "ASM-540-LOT-03",
      modelId: "ASM-540",
      manufacturer: "Adani Solar",
      pr: 81.4,
      delta: 0.0,
      rank: 6,
      status: "normal",
    },
    {
      moduleId: "WRM-600-LOT-05",
      modelId: "WRM-600",
      manufacturer: "Roshan",
      pr: 80.1,
      delta: -1.3,
      rank: 7,
      status: "normal",
    },
    {
      moduleId: "VSMDH-450-LOT-06",
      modelId: "VSMDH-450",
      manufacturer: "Vikram Solar",
      pr: 78.4,
      delta: -3.0,
      rank: 8,
      status: "underperforming",
    },
    {
      moduleId: "ASM-540-LOT-05",
      modelId: "ASM-540",
      manufacturer: "Adani Solar",
      pr: 76.9,
      delta: -4.5,
      rank: 9,
      status: "underperforming",
    },
    {
      moduleId: "WRM-600-LOT-07",
      modelId: "WRM-600",
      manufacturer: "Roshan",
      pr: 74.8,
      delta: -6.6,
      rank: 10,
      status: "underperforming",
    },
  ];
}

// ─── Compliance Risk Scoring ───────────────────────────────

export interface ComplianceRisk {
  passportId: string;
  modelId: string;
  riskScore: number; // 0-100, higher = more risk
  riskLevel: "low" | "medium" | "high";
  factors: string[];
}

export function getComplianceRiskScoring(): ComplianceRisk[] {
  return [
    {
      passportId: "DPP-WRM-600-001",
      modelId: "WRM-600",
      riskScore: 8,
      riskLevel: "low",
      factors: ["All certificates current", "Full traceability data"],
    },
    {
      passportId: "DPP-ASM-540-001",
      modelId: "ASM-540",
      riskScore: 12,
      riskLevel: "low",
      factors: ["All certificates current", "Complete BOM documentation"],
    },
    {
      passportId: "DPP-VSMDH-450-001",
      modelId: "VSMDH-450",
      riskScore: 6,
      riskLevel: "low",
      factors: ["All certificates current", "EU ESPR fully aligned"],
    },
    {
      passportId: "DPP-WRM-600-003",
      modelId: "WRM-600",
      riskScore: 15,
      riskLevel: "low",
      factors: ["All certificates current", "Minor data gap in transport records"],
    },
    {
      passportId: "DPP-ASM-540-003",
      modelId: "ASM-540",
      riskScore: 18,
      riskLevel: "low",
      factors: ["All certificates current", "Recycling plan pending review"],
    },
    {
      passportId: "DPP-VSMDH-450-004",
      modelId: "VSMDH-450",
      riskScore: 42,
      riskLevel: "medium",
      factors: [
        "IEC 61730 certificate expiring in 60 days",
        "Renewal application not yet submitted",
      ],
    },
    {
      passportId: "DPP-WRM-600-005",
      modelId: "WRM-600",
      riskScore: 55,
      riskLevel: "medium",
      factors: [
        "Missing Environmental Product Declaration (EPD) document",
        "Carbon footprint data incomplete for upstream suppliers",
      ],
    },
    {
      passportId: "DPP-ASM-540-005",
      modelId: "ASM-540",
      riskScore: 81,
      riskLevel: "high",
      factors: [
        "REACH substance status under review — SVHC candidate list update pending",
        "Supplier due diligence report overdue by 45 days",
        "Potential non-compliance with EU ESPR Article 8(2)",
      ],
    },
  ];
}

// ─── Carbon Optimization ───────────────────────────────────

export interface CarbonOptimization {
  currentAvgKgCO2e: number;
  industryBenchmark: number;
  potentialReductionPercent: number;
  suggestions: {
    action: string;
    impactKgCO2e: number;
    difficulty: "easy" | "medium" | "hard";
  }[];
}

export function getCarbonOptimization(): CarbonOptimization {
  return {
    currentAvgKgCO2e: 815,
    industryBenchmark: 750,
    potentialReductionPercent: 12.4,
    suggestions: [
      {
        action: "Switch to recycled aluminium frames (30% recycled content → 80%)",
        impactKgCO2e: 38,
        difficulty: "medium",
      },
      {
        action: "Source polysilicon from hydro-powered facilities",
        impactKgCO2e: 42,
        difficulty: "hard",
      },
      {
        action: "Consolidate shipping routes to reduce transport emissions",
        impactKgCO2e: 14,
        difficulty: "easy",
      },
      {
        action: "Replace SF₆ in cell manufacturing with fluorine-free alternative",
        impactKgCO2e: 7,
        difficulty: "medium",
      },
    ],
  };
}

// ─── Provenance Correlations (Killer Feature) ──────────────

export interface ProvenanceCorrelations {
  supplierDegradation: {
    supplierId: string;
    materialName: string;
    avgDegradationRate: number; // %/yr
    moduleCount: number;
    comparedToFleetAvg: number; // delta vs fleet avg
    risk: "normal" | "elevated" | "critical";
  }[];
  batchAnomalies: {
    batchId: string;
    company: string;
    modulesAffected: number;
    modulesTotal: number;
    anomalyType: string;
    severity: "low" | "medium" | "high";
  }[];
  materialRiskFactors: {
    material: string;
    originCountry: string;
    riskType: string;
    incidenceRate: number; // %
    affectedModules: number;
  }[];
  warrantyClaimCandidates: {
    passportId: string;
    modelId: string;
    currentDegradation: number; // %/yr
    warrantyThreshold: number; // %/yr
    batchId: string;
    commonSupplier: string;
    estimatedClaimValueEur: number;
  }[];
}

export function getProvenanceCorrelations(): ProvenanceCorrelations {
  return {
    supplierDegradation: [
      {
        supplierId: "SUP-SI-001",
        materialName: "Polysilicon wafers",
        avgDegradationRate: 0.38,
        moduleCount: 14,
        comparedToFleetAvg: -0.02,
        risk: "normal",
      },
      {
        supplierId: "SUP-EV-001",
        materialName: "EVA encapsulant",
        avgDegradationRate: 0.54,
        moduleCount: 8,
        comparedToFleetAvg: 0.14,
        risk: "elevated",
      },
      {
        supplierId: "SUP-AL-001",
        materialName: "Aluminium frames",
        avgDegradationRate: 0.36,
        moduleCount: 18,
        comparedToFleetAvg: -0.04,
        risk: "normal",
      },
      {
        supplierId: "SUP-GL-001",
        materialName: "Tempered glass",
        avgDegradationRate: 0.40,
        moduleCount: 18,
        comparedToFleetAvg: 0.0,
        risk: "normal",
      },
      {
        supplierId: "SUP-BS-001",
        materialName: "Backsheet (TPT)",
        avgDegradationRate: 0.42,
        moduleCount: 10,
        comparedToFleetAvg: 0.02,
        risk: "normal",
      },
      {
        supplierId: "SUP-JB-001",
        materialName: "Junction boxes",
        avgDegradationRate: 0.61,
        moduleCount: 6,
        comparedToFleetAvg: 0.21,
        risk: "elevated",
      },
    ],
    batchAnomalies: [
      {
        batchId: "LOT-2026-Q1-SRT-003",
        company: "Roshan",
        modulesAffected: 3,
        modulesTotal: 6,
        anomalyType: "Elevated PID susceptibility — voltage-driven leakage current above threshold",
        severity: "high",
      },
      {
        batchId: "BATCH-MND-2026-02",
        company: "Adani Solar",
        modulesAffected: 2,
        modulesTotal: 5,
        anomalyType: "Micro-crack propagation rate 2.3x fleet average after thermal cycling",
        severity: "medium",
      },
      {
        batchId: "LOT-2026-Q1-VKS-001",
        company: "Vikram Solar",
        modulesAffected: 1,
        modulesTotal: 4,
        anomalyType: "Hot-spot formation at cell interconnect — IR imaging confirms solder void",
        severity: "low",
      },
    ],
    materialRiskFactors: [
      {
        material: "EVA encapsulant",
        originCountry: "CN",
        riskType: "Delamination",
        incidenceRate: 2.1,
        affectedModules: 3,
      },
      {
        material: "Backsheet (PVF)",
        originCountry: "JP",
        riskType: "PID susceptibility",
        incidenceRate: 0.0,
        affectedModules: 0,
      },
      {
        material: "Solder ribbon",
        originCountry: "DE",
        riskType: "Micro-crack at cell interconnect",
        incidenceRate: 1.4,
        affectedModules: 2,
      },
    ],
    warrantyClaimCandidates: [
      {
        passportId: "DPP-WRM-600-007",
        modelId: "WRM-600",
        currentDegradation: 1.1,
        warrantyThreshold: 0.4,
        batchId: "LOT-2026-Q1-SRT-003",
        commonSupplier: "SUP-EV-001 (EVA encapsulant)",
        estimatedClaimValueEur: 1420,
      },
      {
        passportId: "DPP-ASM-540-005",
        modelId: "ASM-540",
        currentDegradation: 0.72,
        warrantyThreshold: 0.4,
        batchId: "BATCH-MND-2026-02",
        commonSupplier: "SUP-JB-001 (Junction boxes)",
        estimatedClaimValueEur: 980,
      },
    ],
  };
}

// ─── Warranty Intelligence ─────────────────────────────────

export interface WarrantyIntelligence {
  claimReady: {
    passportId: string;
    modelId: string;
    degradationRate: number;
    warrantyThreshold: number;
    evidenceScore: number; // 0-100, how complete the evidence package is
    estimatedClaimValueEur: number;
  }[];
  atRisk: {
    passportId: string;
    modelId: string;
    yearsToThreshold: number;
    currentTrajectory: number; // %/yr
  }[];
  batchDefectPatterns: {
    batchId: string;
    defectType: string;
    affectedCount: number;
    totalInBatch: number;
    confidence: number; // %
  }[];
}

export function getWarrantyIntelligence(): WarrantyIntelligence {
  return {
    claimReady: [
      {
        passportId: "DPP-WRM-600-007",
        modelId: "WRM-600",
        degradationRate: 1.1,
        warrantyThreshold: 0.4,
        evidenceScore: 92,
        estimatedClaimValueEur: 1420,
      },
      {
        passportId: "DPP-ASM-540-005",
        modelId: "ASM-540",
        degradationRate: 0.72,
        warrantyThreshold: 0.4,
        evidenceScore: 78,
        estimatedClaimValueEur: 980,
      },
    ],
    atRisk: [
      {
        passportId: "DPP-VSMDH-450-006",
        modelId: "VSMDH-450",
        yearsToThreshold: 2.1,
        currentTrajectory: 0.48,
      },
      {
        passportId: "DPP-WRM-600-005",
        modelId: "WRM-600",
        yearsToThreshold: 3.4,
        currentTrajectory: 0.44,
      },
      {
        passportId: "DPP-ASM-540-003",
        modelId: "ASM-540",
        yearsToThreshold: 4.8,
        currentTrajectory: 0.42,
      },
    ],
    batchDefectPatterns: [
      {
        batchId: "LOT-2026-Q1-SRT-003",
        defectType: "Elevated micro-crack rate post-thermal cycling",
        affectedCount: 3,
        totalInBatch: 6,
        confidence: 89,
      },
      {
        batchId: "BATCH-MND-2026-02",
        defectType: "PID susceptibility above fleet baseline",
        affectedCount: 2,
        totalInBatch: 5,
        confidence: 76,
      },
    ],
  };
}
