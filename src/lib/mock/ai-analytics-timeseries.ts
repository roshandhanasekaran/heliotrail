/**
 * Time-series and module-level mock data for the AI Analytics module flyout.
 * Provides SCADA readings, thermal events, IV curves, and module profiles.
 */

// ─── Module Profiles ──────────────────────────────────────

export type ModulePersonality =
  | "normal"
  | "outperforming"
  | "hotspot"
  | "batch_defect"
  | "connector_fault";

export interface ModuleProfile {
  moduleId: string;
  manufacturer: string;
  model: string;
  technology: string;
  ratedPower: number; // Wp
  batch: string;
  installationDate: string;
  personality: ModulePersonality;
  currentPR: number; // %
  degradationRate: number; // %/yr
  warrantyEvidenceScore: number; // 0-100
  originCountry: string;
  originRisk: "Low" | "Medium" | "High";
}

const MODULE_PROFILES: ModuleProfile[] = [
  {
    moduleId: "Module-01",
    manufacturer: "Roshan",
    model: "WRM-600",
    technology: "TOPCon Bifacial",
    ratedPower: 600,
    batch: "B-2024-01",
    installationDate: "2024-06-15",
    personality: "outperforming",
    currentPR: 87.2,
    degradationRate: 0.32,
    warrantyEvidenceScore: 95,
    originCountry: "IN",
    originRisk: "Low",
  },
  {
    moduleId: "Module-02",
    manufacturer: "Vikram Solar",
    model: "VSMDH-450",
    technology: "PERC Mono",
    ratedPower: 450,
    batch: "B-2024-01",
    installationDate: "2024-06-15",
    personality: "normal",
    currentPR: 83.8,
    degradationRate: 0.41,
    warrantyEvidenceScore: 82,
    originCountry: "IN",
    originRisk: "Low",
  },
  {
    moduleId: "Module-03",
    manufacturer: "Adani Solar",
    model: "ASM-540",
    technology: "HJT",
    ratedPower: 540,
    batch: "B-2024-02",
    installationDate: "2024-07-01",
    personality: "normal",
    currentPR: 82.6,
    degradationRate: 0.39,
    warrantyEvidenceScore: 78,
    originCountry: "IN",
    originRisk: "Low",
  },
  {
    moduleId: "Module-04",
    manufacturer: "Roshan",
    model: "WRM-600",
    technology: "TOPCon Bifacial",
    ratedPower: 600,
    batch: "B-2024-02",
    installationDate: "2024-07-01",
    personality: "normal",
    currentPR: 84.1,
    degradationRate: 0.36,
    warrantyEvidenceScore: 88,
    originCountry: "IN",
    originRisk: "Low",
  },
  {
    moduleId: "Module-05",
    manufacturer: "Vikram Solar",
    model: "VSMDH-450",
    technology: "PERC Mono",
    ratedPower: 450,
    batch: "B-2024-02",
    installationDate: "2024-07-01",
    personality: "connector_fault",
    currentPR: 79.3,
    degradationRate: 0.48,
    warrantyEvidenceScore: 71,
    originCountry: "IN",
    originRisk: "Low",
  },
  {
    moduleId: "Module-06",
    manufacturer: "Adani Solar",
    model: "ASM-540",
    technology: "HJT",
    ratedPower: 540,
    batch: "B-2024-03",
    installationDate: "2024-08-10",
    personality: "normal",
    currentPR: 85.3,
    degradationRate: 0.35,
    warrantyEvidenceScore: 91,
    originCountry: "IN",
    originRisk: "Low",
  },
  {
    moduleId: "Module-07",
    manufacturer: "Roshan",
    model: "WRM-600",
    technology: "TOPCon Bifacial",
    ratedPower: 600,
    batch: "B-2024-03",
    installationDate: "2024-08-10",
    personality: "batch_defect",
    currentPR: 76.9,
    degradationRate: 0.72,
    warrantyEvidenceScore: 65,
    originCountry: "CN",
    originRisk: "Medium",
  },
  {
    moduleId: "Module-08",
    manufacturer: "Vikram Solar",
    model: "VSMDH-450",
    technology: "PERC Mono",
    ratedPower: 450,
    batch: "B-2024-03",
    installationDate: "2024-08-10",
    personality: "normal",
    currentPR: 81.4,
    degradationRate: 0.44,
    warrantyEvidenceScore: 76,
    originCountry: "IN",
    originRisk: "Low",
  },
  {
    moduleId: "Module-09",
    manufacturer: "Adani Solar",
    model: "ASM-540",
    technology: "HJT",
    ratedPower: 540,
    batch: "B-2024-03",
    installationDate: "2024-08-10",
    personality: "hotspot",
    currentPR: 74.8,
    degradationRate: 1.1,
    warrantyEvidenceScore: 92,
    originCountry: "CN",
    originRisk: "High",
  },
  {
    moduleId: "Module-10",
    manufacturer: "Roshan",
    model: "WRM-600",
    technology: "TOPCon Bifacial",
    ratedPower: 600,
    batch: "B-2024-01",
    installationDate: "2024-06-15",
    personality: "outperforming",
    currentPR: 86.1,
    degradationRate: 0.30,
    warrantyEvidenceScore: 97,
    originCountry: "IN",
    originRisk: "Low",
  },
];

export function getModuleProfiles(): ModuleProfile[] {
  return MODULE_PROFILES;
}

// ─── SCADA Data (Hourly power readings) ───────────────────

export interface ScadaDataPoint {
  timestamp: string; // ISO
  power: number; // W
  expected: number; // W
  irradiance: number; // W/m²
}

/**
 * Generates 7 days of hourly SCADA data for a given module index.
 * Module personality affects the variance and underperformance.
 */
export function getScadaData(moduleIndex: number): ScadaDataPoint[] {
  const profile = MODULE_PROFILES[moduleIndex] ?? MODULE_PROFILES[0];
  const baseDate = new Date("2026-04-03T00:00:00Z");
  const points: ScadaDataPoint[] = [];

  // Seeded-ish RNG based on module index
  const seed = (moduleIndex + 1) * 7919;
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s % 10000) / 10000;
  };

  for (let day = 0; day < 7; day++) {
    for (let hour = 5; hour <= 19; hour++) {
      const ts = new Date(baseDate);
      ts.setUTCDate(ts.getUTCDate() + day);
      ts.setUTCHours(hour);

      // Bell-curve irradiance peaking at noon
      const hourFactor = 1 - Math.pow((hour - 12) / 7, 2);
      const irradiance = Math.max(0, 950 * hourFactor * (0.85 + rand() * 0.3));

      const expected =
        profile.ratedPower * (irradiance / 1000) * 0.85;

      // Apply personality modifier
      let prFactor = profile.currentPR / 100;
      if (profile.personality === "hotspot" && hour >= 11 && hour <= 14) {
        prFactor *= 0.85 + rand() * 0.1; // Extra loss during peak
      } else if (profile.personality === "connector_fault") {
        prFactor *= rand() > 0.15 ? 1.0 : 0.6; // Intermittent drops
      } else if (profile.personality === "batch_defect") {
        prFactor *= 0.92 + rand() * 0.06;
      }

      const power = expected * prFactor * (0.97 + rand() * 0.06);

      points.push({
        timestamp: ts.toISOString(),
        power: Math.round(power * 10) / 10,
        expected: Math.round(expected * 10) / 10,
        irradiance: Math.round(irradiance * 10) / 10,
      });
    }
  }

  return points;
}

// ─── Thermal Events ───────────────────────────────────────

export interface ThermalEvent {
  moduleIndex: number;
  moduleId: string;
  hotspotRow: number; // 0-5
  hotspotCol: number; // 0-9
  deltaT: number; // °C above ambient
  maxTemp: number; // °C
  inspectionDate: string;
  cells: number[][]; // 6×10 temperature grid
}

export function getThermalEvents(): ThermalEvent[] {
  // Only Module-09 (index 8) has a hotspot event
  const grid: number[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: number[] = [];
    for (let c = 0; c < 10; c++) {
      // Base temp 35-45°C
      let temp = 35 + Math.random() * 10;
      // Hotspot at row 3, col 6
      const dist = Math.sqrt(Math.pow(r - 3, 2) + Math.pow(c - 6, 2));
      if (dist < 2.5) {
        temp += (2.5 - dist) * 16;
      }
      row.push(Math.round(temp * 10) / 10);
    }
    grid.push(row);
  }
  // Ensure hotspot cell is hot
  grid[3][6] = 72.4;

  return [
    {
      moduleIndex: 8,
      moduleId: "Module-09",
      hotspotRow: 3,
      hotspotCol: 6,
      deltaT: 14.2,
      maxTemp: 72.4,
      inspectionDate: "2026-03-28",
      cells: grid,
    },
  ];
}

// ─── IV Curves ────────────────────────────────────────────

export interface IVCurvePoint {
  voltage: number;
  current: number;
}

export interface IVCurveData {
  moduleIndex: number;
  moduleId: string;
  points: IVCurvePoint[];
  voc: number; // V
  isc: number; // A
  vmp: number; // V
  imp: number; // A
  fillFactor: number;
  seriesResistance: number; // Ohm
  shuntResistance: number; // Ohm
}

export function getIVCurves(): IVCurveData[] {
  return MODULE_PROFILES.map((profile, idx) => {
    const voc = profile.ratedPower > 500 ? 49.2 : 41.8;
    const isc = profile.ratedPower / (voc * 0.78);

    // Personality affects fill factor
    let ff: number;
    switch (profile.personality) {
      case "outperforming":
        ff = 0.79 + (idx % 3) * 0.005;
        break;
      case "hotspot":
        ff = 0.68;
        break;
      case "batch_defect":
        ff = 0.71;
        break;
      case "connector_fault":
        ff = 0.73;
        break;
      default:
        ff = 0.76 + (idx % 5) * 0.005;
    }

    const vmp = voc * 0.82;
    const imp = (profile.ratedPower / vmp) * (ff / 0.78);

    // Generate IV curve points
    const points: IVCurvePoint[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const v = (voc * i) / steps;
      // Simplified single-diode model shape
      const t = v / voc;
      const current =
        isc * (1 - Math.pow(t, 8)) * (1 - 0.02 * t);

      // Add noise for defective modules
      const noise =
        profile.personality === "connector_fault"
          ? (Math.sin(i * 3) * 0.05 * isc)
          : 0;

      points.push({
        voltage: Math.round(v * 100) / 100,
        current: Math.max(0, Math.round((current + noise) * 100) / 100),
      });
    }

    return {
      moduleIndex: idx,
      moduleId: profile.moduleId,
      points,
      voc,
      isc: Math.round(isc * 100) / 100,
      vmp: Math.round(vmp * 100) / 100,
      imp: Math.round(imp * 100) / 100,
      fillFactor: Math.round(ff * 1000) / 1000,
      seriesResistance:
        profile.personality === "connector_fault"
          ? 0.82
          : profile.personality === "hotspot"
            ? 0.65
            : 0.35 + (idx % 4) * 0.05,
      shuntResistance:
        profile.personality === "batch_defect"
          ? 120
          : profile.personality === "hotspot"
            ? 85
            : 350 + (idx % 5) * 30,
    };
  });
}

// ─── Anomaly Alerts (for AI Recommendation) ───────────────

export interface AnomalyAlert {
  moduleIndex: number;
  moduleId: string;
  personality: ModulePersonality;
  recommendation: string;
  estimatedRecoveryEur?: number;
}

export function getAnomalyAlerts(): AnomalyAlert[] {
  return MODULE_PROFILES.filter((p) =>
    ["hotspot", "batch_defect", "connector_fault"].includes(p.personality),
  ).map((p) => {
    const idx = MODULE_PROFILES.indexOf(p);
    let recommendation: string;
    let estimatedRecoveryEur: number | undefined;

    switch (p.personality) {
      case "hotspot":
        estimatedRecoveryEur = 1420;
        recommendation = `Module shows bypass diode failure pattern. Degradation rate exceeds warranty threshold. **Warranty claim recommended** — evidence score ${p.warrantyEvidenceScore}%. Estimated recovery: €${estimatedRecoveryEur}.`;
        break;
      case "batch_defect":
        recommendation = `Batch ${p.batch} shows systematic underperformance. **Contact supplier** for batch-wide investigation.`;
        break;
      case "connector_fault":
        recommendation = `Intermittent current drops indicate connector degradation. **Schedule inspection** within 30 days.`;
        break;
      default:
        recommendation = "";
    }

    return {
      moduleIndex: idx,
      moduleId: p.moduleId,
      personality: p.personality,
      recommendation,
      estimatedRecoveryEur,
    };
  });
}
