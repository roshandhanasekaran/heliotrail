import {
  TrendingUp,
  Leaf,
  FolderOpen,
  Gem,
  FlaskConical,
  ShieldAlert,
  Layers,
  Gauge,
  AlertTriangle,
  Recycle,
  type LucideIcon,
} from "lucide-react";

// ── Extended KPI data passed from the server component ────────────────────────
export interface KpiComputeInput {
  total: number;
  published: number;
  complianceScore: number;
  avgCarbon: number;
  materialsCount: number;
  evidencePercent: number;
  crmCount: number;
  socCount: number;
  validCerts: number;
  pendingCerts: number;
  expiredCerts: number;
  totalCerts: number;
  certsExpiringIn30Days: number;
  avgRecyclability: number;
}

export interface KpiMetricDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
  category: "passport" | "compliance" | "environmental" | "operational";
  suffix: string;
  accentColor: string;
  description: string;
  computeValue: (d: KpiComputeInput) => number;
  computeTrend: (d: KpiComputeInput) => { text: string; up: boolean };
  defaultEnabled: boolean;
  sparkSeed: number[];
}

export const KPI_REGISTRY: KpiMetricDefinition[] = [
  // ── Passport ────────────────────────────────────────────────────────────────
  {
    id: "published_rate",
    label: "Published Rate",
    icon: TrendingUp,
    category: "passport",
    suffix: "%",
    accentColor: "#22C55E",
    description: "Percentage of passports in published status",
    computeValue: (d) =>
      d.total > 0 ? Math.round((d.published / d.total) * 100) : 0,
    computeTrend: (d) => {
      const rate = d.total > 0 ? (d.published / d.total) * 100 : 0;
      return { text: rate >= 50 ? "+12% QoQ" : "Growing", up: true };
    },
    defaultEnabled: true,
    sparkSeed: [40, 42, 48, 50, 55, 58, 63],
  },
  {
    id: "evidence_coverage",
    label: "Evidence",
    icon: FolderOpen,
    category: "passport",
    suffix: "%",
    accentColor: "#3B82F6",
    description: "Passports with supporting documentation attached",
    computeValue: (d) => d.evidencePercent,
    computeTrend: () => ({ text: "+8% this mo.", up: true }),
    defaultEnabled: true,
    sparkSeed: [60, 65, 70, 75, 78, 82, 87],
  },

  // ── Compliance ──────────────────────────────────────────────────────────────
  {
    id: "expiring_certs_30d",
    label: "Expiring Certs",
    icon: ShieldAlert,
    category: "compliance",
    suffix: "",
    accentColor: "#F59E0B",
    description: "Certificates expiring within the next 30 days",
    computeValue: (d) => d.certsExpiringIn30Days,
    computeTrend: (d) => ({
      text: d.certsExpiringIn30Days > 0 ? "Action needed" : "All clear",
      up: d.certsExpiringIn30Days === 0,
    }),
    defaultEnabled: true,
    sparkSeed: [2, 3, 1, 4, 2, 3],
  },

  // ── Environmental ───────────────────────────────────────────────────────────
  {
    id: "avg_carbon",
    label: "Avg Carbon",
    icon: Leaf,
    category: "environmental",
    suffix: "",
    accentColor: "#22C55E",
    description: "Average kg CO\u2082e per module (cradle-to-gate, ISO 14067)",
    computeValue: (d) => d.avgCarbon,
    computeTrend: () => ({ text: "-3% vs batch", up: false }),
    defaultEnabled: true,
    sparkSeed: [440, 430, 425, 420, 415, 412, 410],
  },
  {
    id: "crm_materials",
    label: "CRM Materials",
    icon: Gem,
    category: "environmental",
    suffix: "",
    accentColor: "#F59E0B",
    description: "Critical Raw Materials flagged per EU CRA regulation",
    computeValue: (d) => d.crmCount,
    computeTrend: (d) => ({
      text: `${d.crmCount} flagged`,
      up: d.crmCount === 0,
    }),
    defaultEnabled: true,
    sparkSeed: [20, 25, 30, 33, 36, 40, 42],
  },
  {
    id: "substances_of_concern",
    label: "SoC Count",
    icon: FlaskConical,
    category: "environmental",
    suffix: "",
    accentColor: "#EF4444",
    description: "Substances of Concern requiring ESPR disclosure",
    computeValue: (d) => d.socCount,
    computeTrend: (d) => ({
      text: d.socCount > 0 ? `${d.socCount} tracked` : "None",
      up: d.socCount === 0,
    }),
    defaultEnabled: true,
    sparkSeed: [5, 4, 6, 5, 5, 4],
  },

  // ── Optional / Operational (not default) ────────────────────────────────────
  {
    id: "materials_count",
    label: "Materials",
    icon: Layers,
    category: "environmental",
    suffix: "",
    accentColor: "#F59E0B",
    description: "Total material entries across all passports",
    computeValue: (d) => d.materialsCount,
    computeTrend: (d) => ({ text: `${d.crmCount} CRM`, up: true }),
    defaultEnabled: false,
    sparkSeed: [20, 25, 30, 33, 36, 40, 42],
  },
  {
    id: "fleet_pr",
    label: "Fleet PR",
    icon: Gauge,
    category: "operational",
    suffix: "%",
    accentColor: "#22C55E",
    description: "Fleet Performance Ratio — operational field metric",
    computeValue: () => 81,
    computeTrend: () => ({ text: "Stable", up: true }),
    defaultEnabled: false,
    sparkSeed: [83, 82, 80, 82, 82, 81],
  },
  {
    id: "active_alerts",
    label: "Active Alerts",
    icon: AlertTriangle,
    category: "operational",
    suffix: "",
    accentColor: "#F59E0B",
    description: "Modules flagged for underperformance or issues",
    computeValue: () => 3,
    computeTrend: () => ({ text: "2 new", up: false }),
    defaultEnabled: false,
    sparkSeed: [1, 0, 2, 1, 3, 3],
  },
  {
    id: "recyclability_rate",
    label: "Recyclability",
    icon: Recycle,
    category: "environmental",
    suffix: "%",
    accentColor: "#22C55E",
    description: "Average recyclability rate across portfolio",
    computeValue: (d) => d.avgRecyclability,
    computeTrend: (d) => ({
      text: d.avgRecyclability >= 80 ? "On track" : "Below target",
      up: d.avgRecyclability >= 80,
    }),
    defaultEnabled: false,
    sparkSeed: [75, 78, 80, 82, 83, 85],
  },
];

export const DEFAULT_ENABLED_IDS = KPI_REGISTRY.filter(
  (k) => k.defaultEnabled,
).map((k) => k.id);

export const MAX_SECONDARY_KPIS = 6;
