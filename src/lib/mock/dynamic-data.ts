/**
 * Centralized mock data generators for Dynamic Data tab.
 * All generators use seeded PRNG for deterministic renders.
 */

// Seeded PRNG (mulberry32)
function seededRandom(seed: number) {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

let _seed = 42;
function rand() {
  _seed++;
  return seededRandom(_seed);
}
function resetSeed(s = 42) {
  _seed = s;
}

// Shared tooltip style for all Recharts charts
export const CHART_TOOLTIP_STYLE = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  fontSize: 12,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  color: "var(--foreground)",
};

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ─── Power Output (30 days) ─────────────────────────────────

export interface PowerDataPoint {
  day: string;
  power: number;
  expected: number;
}

export function generatePowerData(days = 30): PowerDataPoint[] {
  resetSeed(100);
  const base = 480;
  const data: PowerDataPoint[] = [];
  for (let i = days; i >= 1; i--) {
    const day = `Mar ${31 - i}`;
    const weather = rand();
    const power =
      weather > 0.85
        ? base * (0.3 + rand() * 0.2)
        : weather > 0.7
          ? base * (0.5 + rand() * 0.2)
          : base * (0.75 + rand() * 0.2);
    const expected = base * (0.8 + rand() * 0.1);
    data.push({
      day,
      power: Math.round(power),
      expected: Math.round(expected),
    });
  }
  return data;
}

// ─── Degradation (30-year projection) ───────────────────────

export interface DegradationDataPoint {
  year: number;
  retention: number;
  warrantyMin: number;
  fleetAvg: number;
  upperBound: number;
  lowerBound: number;
}

export function generateDegradationData(years = 30): DegradationDataPoint[] {
  resetSeed(200);
  const data: DegradationDataPoint[] = [];
  let retention = 100;
  let fleetRetention = 100;
  for (let year = 0; year <= years; year++) {
    const uncertainty = 0.3 + year * 0.06;
    data.push({
      year,
      retention: +retention.toFixed(1),
      warrantyMin: year === 0 ? 97 : Math.max(80, 97 - year * 0.55),
      fleetAvg: +fleetRetention.toFixed(1),
      upperBound: +(retention + uncertainty).toFixed(1),
      lowerBound: +(retention - uncertainty).toFixed(1),
    });
    if (year === 0) {
      retention -= 1.0;
      fleetRetention -= 1.2;
    } else {
      retention -= 0.38 + rand() * 0.04;
      fleetRetention -= 0.42 + rand() * 0.06;
    }
  }
  return data;
}

// ─── Performance Ratio (monthly) ────────────────────────────

export interface PRDataPoint {
  month: string;
  expected: number;
  actual: number;
}

export function generatePRData(months = 12): PRDataPoint[] {
  resetSeed(300);
  const data: PRDataPoint[] = [];
  for (let i = 0; i < months; i++) {
    const seasonal = Math.sin(((i + 3) / 12) * Math.PI * 2) * 2;
    const expected = 83 + seasonal;
    const actual = expected - (1 + rand() * 3);
    data.push({
      month: MONTHS_SHORT[i % 12],
      expected: +expected.toFixed(1),
      actual: +actual.toFixed(1),
    });
  }
  return data;
}

// ─── Energy Yield (monthly expected vs actual) ──────────────

export interface EnergyYieldDataPoint {
  month: string;
  expected: number;
  actual: number;
  cumulativeExpected: number;
  cumulativeActual: number;
}

export function generateEnergyYieldData(months = 12): EnergyYieldDataPoint[] {
  resetSeed(400);
  const data: EnergyYieldDataPoint[] = [];
  let cumE = 0;
  let cumA = 0;
  const baseYield = [38, 52, 72, 88, 102, 110, 108, 96, 78, 56, 40, 34]; // kWh seasonal pattern
  for (let i = 0; i < months; i++) {
    const expected = baseYield[i % 12] + rand() * 5;
    const actual = expected * (0.88 + rand() * 0.1);
    cumE += expected;
    cumA += actual;
    data.push({
      month: MONTHS_SHORT[i % 12],
      expected: Math.round(expected),
      actual: Math.round(actual),
      cumulativeExpected: Math.round(cumE),
      cumulativeActual: Math.round(cumA),
    });
  }
  return data;
}

// ─── Irradiance vs Power (scatter) ──────────────────────────

export interface IrradiancePoint {
  irradiance: number;
  power: number;
  timeOfDay: "morning" | "midday" | "afternoon";
}

export function generateIrradianceCorrelation(points = 120): IrradiancePoint[] {
  resetSeed(500);
  const data: IrradiancePoint[] = [];
  for (let i = 0; i < points; i++) {
    const hour = 6 + rand() * 12;
    const timeOfDay: IrradiancePoint["timeOfDay"] =
      hour < 10 ? "morning" : hour < 14 ? "midday" : "afternoon";
    const baseIrradiance =
      timeOfDay === "midday"
        ? 700 + rand() * 400
        : timeOfDay === "morning"
          ? 200 + rand() * 500
          : 300 + rand() * 400;
    const irradiance = Math.round(baseIrradiance);
    const idealPower = (irradiance / 1000) * 485;
    const noise = (rand() - 0.5) * 60;
    const soilingLoss = rand() > 0.7 ? rand() * 30 : 0;
    const power = Math.round(Math.max(0, idealPower + noise - soilingLoss));
    data.push({ irradiance, power, timeOfDay });
  }
  return data;
}

// ─── Temperature Derating ───────────────────────────────────

export interface TemperaturePoint {
  temperature: number;
  theoreticalPower: number;
  measuredPower: number;
}

export function generateTemperatureDerating(points = 40): TemperaturePoint[] {
  resetSeed(600);
  const data: TemperaturePoint[] = [];
  const ratedPower = 485;
  const tempCoeff = -0.34; // %/°C typical for crystalline silicon
  const stcTemp = 25;
  for (let i = 0; i < points; i++) {
    const temp = 15 + (i / points) * 50;
    const theoreticalPower =
      ratedPower * (1 + (tempCoeff / 100) * (temp - stcTemp));
    const noise = (rand() - 0.5) * 20;
    const additionalLoss = temp > 45 ? rand() * 15 : 0;
    const measuredPower = Math.max(0, theoreticalPower + noise - additionalLoss);
    data.push({
      temperature: +temp.toFixed(1),
      theoreticalPower: Math.round(theoreticalPower),
      measuredPower: Math.round(measuredPower),
    });
  }
  return data;
}

// ─── Soiling Loss (monthly) ─────────────────────────────────

export interface SoilingDataPoint {
  month: string;
  loss: number;
  cleaned: boolean;
  revenueLoss: number;
}

export function generateSoilingData(months = 12): SoilingDataPoint[] {
  resetSeed(700);
  const data: SoilingDataPoint[] = [];
  for (let i = 0; i < months; i++) {
    const isSummer = i >= 4 && i <= 8;
    const baseLoss = isSummer ? 5 + rand() * 4 : 2 + rand() * 3;
    const cleaned = i % 3 === 2;
    const loss = cleaned ? baseLoss * 0.4 : baseLoss;
    data.push({
      month: MONTHS_SHORT[i % 12],
      loss: +loss.toFixed(1),
      cleaned,
      revenueLoss: +(loss * 2.8).toFixed(2),
    });
  }
  return data;
}

// ─── Inverter Clipping (monthly) ────────────────────────────

export interface ClippingDataPoint {
  month: string;
  hours: number;
  kwhLost: number;
}

export function generateClippingData(months = 12): ClippingDataPoint[] {
  resetSeed(800);
  const data: ClippingDataPoint[] = [];
  const seasonal = [2, 4, 8, 14, 22, 28, 30, 26, 18, 10, 4, 2];
  for (let i = 0; i < months; i++) {
    const hours = Math.round(seasonal[i % 12] + rand() * 6);
    data.push({
      month: MONTHS_SHORT[i % 12],
      hours,
      kwhLost: +(hours * 0.42).toFixed(1),
    });
  }
  return data;
}

// ─── Availability (monthly) ─────────────────────────────────

export interface AvailabilityDataPoint {
  month: string;
  uptime: number;
  planned: number;
  unplanned: number;
}

export function generateAvailabilityData(
  months = 12,
): AvailabilityDataPoint[] {
  resetSeed(900);
  const data: AvailabilityDataPoint[] = [];
  for (let i = 0; i < months; i++) {
    const planned = i === 2 || i === 8 ? 2 + rand() * 2 : rand() * 0.5;
    const unplanned = rand() > 0.7 ? 0.5 + rand() * 2 : rand() * 0.3;
    const uptime = 100 - planned - unplanned;
    data.push({
      month: MONTHS_SHORT[i % 12],
      uptime: +uptime.toFixed(1),
      planned: +planned.toFixed(1),
      unplanned: +unplanned.toFixed(1),
    });
  }
  return data;
}

// ─── Anomaly Log ────────────────────────────────────────────

export interface AnomalyEntry {
  id: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
  type: string;
  description: string;
  resolved: boolean;
}

export function generateAnomalyLog(): AnomalyEntry[] {
  return [
    {
      id: "ANM-001",
      timestamp: "2026-04-08 14:32",
      severity: "medium",
      type: "Power Drop",
      description:
        "Output dropped 18% below expected for 45 min — possible partial shading from adjacent structure",
      resolved: true,
    },
    {
      id: "ANM-002",
      timestamp: "2026-04-05 09:15",
      severity: "low",
      type: "Temperature Spike",
      description:
        "Module temp exceeded 62°C for 20 min during midday peak — within tolerance but monitored",
      resolved: true,
    },
    {
      id: "ANM-003",
      timestamp: "2026-03-28 11:47",
      severity: "high",
      type: "Communication Loss",
      description:
        "SCADA data gap of 2.3 hours — inverter firmware update caused monitoring disconnect",
      resolved: true,
    },
    {
      id: "ANM-004",
      timestamp: "2026-03-22 16:05",
      severity: "low",
      type: "Soiling Alert",
      description:
        "Soiling loss estimated at 6.2% — cleaning recommended within 7 days",
      resolved: false,
    },
    {
      id: "ANM-005",
      timestamp: "2026-03-15 08:30",
      severity: "medium",
      type: "Degradation Flag",
      description:
        "Year-1 degradation rate of 1.1% exceeds expected 0.8% — monitoring for next quarter confirmation",
      resolved: false,
    },
  ];
}

// ─── KPI Snapshot data ──────────────────────────────────────

export interface DynamicKpi {
  label: string;
  value: string;
  sub: string;
  trend: string;
  trendUp: boolean;
  accentColor: string;
  sparkData: number[];
}

export function getDynamicKpis(): DynamicKpi[] {
  return [
    {
      label: "Performance Ratio",
      value: "82.3%",
      sub: "Target: 85%",
      trend: "-1.2% vs last month",
      trendUp: false,
      accentColor: "#F59E0B",
      sparkData: [84, 83, 82, 83, 81, 82, 83, 82],
    },
    {
      label: "Active Power",
      value: "485 W",
      sub: "87% of rated capacity",
      trend: "Nominal",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [460, 470, 480, 475, 490, 485, 482, 485],
    },
    {
      label: "Specific Yield",
      value: "4.82 kWh/kWp",
      sub: "Daily average",
      trend: "+0.3 vs fleet avg",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [4.5, 4.6, 4.8, 4.7, 4.9, 4.8, 4.85, 4.82],
    },
    {
      label: "Degradation Rate",
      value: "0.38%/yr",
      sub: "Warranted: 0.40%/yr",
      trend: "Within warranty",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [0.5, 0.45, 0.42, 0.4, 0.39, 0.38, 0.38, 0.38],
    },
    {
      label: "Availability",
      value: "97.2%",
      sub: "Last 12 months",
      trend: "+0.4% QoQ",
      trendUp: true,
      accentColor: "#22C55E",
      sparkData: [96, 96.5, 96.8, 97, 97.1, 97, 97.2, 97.2],
    },
    {
      label: "Soiling Loss",
      value: "4.1%",
      sub: "Est. cleaning in 5 days",
      trend: "+1.2% this month",
      trendUp: false,
      accentColor: "#F59E0B",
      sparkData: [2, 2.5, 3, 2.8, 3.5, 3.8, 4, 4.1],
    },
    {
      label: "Module Temp",
      value: "42.3°C",
      sub: "NOCT: 45°C",
      trend: "Within range",
      trendUp: true,
      accentColor: "#3B82F6",
      sparkData: [35, 38, 40, 42, 43, 41, 40, 42],
    },
    {
      label: "Revenue Impact",
      value: "-€12.40/mo",
      sub: "From underperformance",
      trend: "Soiling + clipping",
      trendUp: false,
      accentColor: "#EF4444",
      sparkData: [8, 9, 10, 11, 12, 11, 12, 12.4],
    },
  ];
}

// ─── Flash test vs field ────────────────────────────────────

export interface FlashTestData {
  flashTestPower: number;
  fieldPower: number;
  gapPercent: number;
}

export function getFlashTestData(): FlashTestData {
  return {
    flashTestPower: 555,
    fieldPower: 485,
    gapPercent: 12.6,
  };
}

// ─── Revenue impact breakdown ───────────────────────────────

export interface RevenueLossBreakdown {
  totalExpected: number;
  totalActual: number;
  losses: { category: string; kwhLost: number; euroLost: number; color: string }[];
}

export function getRevenueLossBreakdown(): RevenueLossBreakdown {
  return {
    totalExpected: 874,
    totalActual: 812,
    losses: [
      { category: "Soiling", kwhLost: 28, euroLost: 5.6, color: "#F59E0B" },
      { category: "Clipping", kwhLost: 12, euroLost: 2.4, color: "#3B82F6" },
      { category: "Degradation", kwhLost: 14, euroLost: 2.8, color: "#737373" },
      { category: "Downtime", kwhLost: 8, euroLost: 1.6, color: "#EF4444" },
    ],
  };
}
