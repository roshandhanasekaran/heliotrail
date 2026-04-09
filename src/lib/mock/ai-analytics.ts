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
      costIfDelayed: 156,
    },
    componentRisk: {
      modulesAtRisk: 2,
      highestRisk: "WRM-600-LOT-07",
      failureProbability30d: 4.2,
      failureProbability90d: 11.8,
    },
    maintenanceROI: {
      cleaningCostEur: 85,
      annualSavingsEur: 1872,
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
    monthlyLoss: 12.4,
    annualProjected: 148.8,
    optimizationPotential: 2400,
    lossDrivers: [
      {
        category: "Soiling",
        euroPerMonth: 5.6,
        percent: 45,
        color: "#F59E0B",
        trend: "up",
      },
      {
        category: "Clipping",
        euroPerMonth: 2.4,
        percent: 19,
        color: "#3B82F6",
        trend: "stable",
      },
      {
        category: "Degradation",
        euroPerMonth: 2.8,
        percent: 23,
        color: "#737373",
        trend: "up",
      },
      {
        category: "Downtime",
        euroPerMonth: 1.6,
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
