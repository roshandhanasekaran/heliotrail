/**
 * AI Analytics Time-Series Data Generator
 *
 * Generates realistic SCADA telemetry, weather, financial, and diagnostic
 * event data for a 15-module PV solar fleet. All output is deterministic
 * via a seeded PRNG (mulberry32) — no flicker on re-render.
 *
 * Seasonal calibration: April in southern Europe (~35°N)
 *   - ~6.5 peak sun hours
 *   - Sunrise ~06:45, sunset ~20:15 (UTC+1)
 *   - Avg ambient 18°C
 *
 * Data volumes: 15 modules × 2,880 points (30 days × 96 intervals) = 43,200
 */

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export interface ScadaDataPoint {
  timestamp: string;
  power_ac_kw: number;
  irradiance_poa_wm2: number;
  module_temp_c: number;
  ambient_temp_c: number;
  performance_ratio: number;
  string_current_a: number;
  string_voltage_v: number;
}

export interface WeatherDataPoint {
  timestamp: string;
  ghi_wm2: number;
  dni_wm2: number;
  humidity_pct: number;
  wind_speed_ms: number;
  dust_index: number;
  cloud_cover_pct: number;
}

export interface FinancialDataPoint {
  date: string;
  energy_yield_kwh: number;
  revenue_eur: number;
  loss_soiling_eur: number;
  loss_clipping_eur: number;
  loss_degradation_eur: number;
  loss_downtime_eur: number;
  carbon_avoided_kg: number;
  spot_price_eur_mwh: number;
}

export interface ThermalEvent {
  date: string;
  module_id: string;
  hotspot_delta_c: number;
  hotspot_temp_c: number;
  location: { row: number; col: number };
  heatmap: number[][];
}

export interface IVCurveTrace {
  module_id: string;
  date: string;
  voltage_points: number[];
  current_points: number[];
  fill_factor: number;
  series_resistance_ohm: number;
  shunt_resistance_ohm: number;
}

export interface MaintenanceEvent {
  date: string;
  type: "cleaning" | "inverter_reset" | "inspection";
  cost_eur: number;
  duration_hours: number;
  notes: string;
}

export interface AnomalyAlert {
  id: string;
  module_id: string;
  severity: "high" | "medium" | "low";
  confidence_pct: number;
  pattern: string;
  description: string;
  detected_at: string;
}

export interface ModuleProfile {
  id: string;
  model: string;
  manufacturer: string;
  technology: string;
  rated_power_w: number;
  batch: string;
  install_date: string;
  personality:
    | "hotspot"
    | "batch_defect"
    | "connector_fault"
    | "high_performer"
    | "normal";
}

// ═══════════════════════════════════════════════════════════════
// Seeded PRNG — mulberry32
// ═══════════════════════════════════════════════════════════════

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Clamp a value to [min, max] */
function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/** Round to N decimal places */
function round(v: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
}

// ═══════════════════════════════════════════════════════════════
// Constants & configuration
// ═══════════════════════════════════════════════════════════════

const NUM_MODULES = 15;
const DEFAULT_DAYS = 30;
const INTERVALS_PER_DAY = 96; // 15-min intervals
const HOURS_PER_DAY = 24;

// April in southern Europe (~35°N)
const SUNRISE_HOUR = 6.75; // 06:45
const SUNSET_HOUR = 20.25; // 20:15
const SOLAR_NOON = (SUNRISE_HOUR + SUNSET_HOUR) / 2; // ~13:5
const DAY_LENGTH = SUNSET_HOUR - SUNRISE_HOUR; // ~13.5 h
const AVG_AMBIENT_C = 18;
const PEAK_IRRADIANCE = 1050; // W/m² clear-sky peak
const NAMEPLATE_W = 580; // WRM-580 rated power

// Financial constants
const CARBON_FACTOR_KG_KWH = 0.42;

// Start date: 2026-03-12 (30 days ending ~Apr 10)
const START_DATE = new Date("2026-03-12T00:00:00+01:00");

// ═══════════════════════════════════════════════════════════════
// Module profiles
// ═══════════════════════════════════════════════════════════════

type Personality =
  | "hotspot"
  | "batch_defect"
  | "connector_fault"
  | "high_performer"
  | "normal";

interface ModuleConfig {
  index: number;
  id: string;
  personality: Personality;
  prBase: number; // baseline PR
  tempOffset: number; // extra temp above string avg
  degradationRate: number; // %/yr
  batch: string;
  connectorFault: boolean;
}

const MODULE_CONFIGS: ModuleConfig[] = [
  // High performers: indices 0(M01), 3(M04), 6(M07), 9(M10), 12(M13)
  {
    index: 0,
    id: "Module-01",
    personality: "high_performer",
    prBase: 0.85,
    tempOffset: 0,
    degradationRate: 0.4,
    batch: "B-2024-01",
    connectorFault: false,
  },
  {
    index: 3,
    id: "Module-04",
    personality: "high_performer",
    prBase: 0.84,
    tempOffset: 0,
    degradationRate: 0.38,
    batch: "B-2024-01",
    connectorFault: false,
  },
  {
    index: 6,
    id: "Module-07",
    personality: "high_performer",
    prBase: 0.86,
    tempOffset: 0,
    degradationRate: 0.42,
    batch: "B-2024-02",
    connectorFault: false,
  },
  {
    index: 9,
    id: "Module-10",
    personality: "high_performer",
    prBase: 0.83,
    tempOffset: 0,
    degradationRate: 0.41,
    batch: "B-2024-02",
    connectorFault: false,
  },
  {
    index: 12,
    id: "Module-13",
    personality: "high_performer",
    prBase: 0.84,
    tempOffset: 0,
    degradationRate: 0.39,
    batch: "B-2024-01",
    connectorFault: false,
  },
  // Special modules
  {
    index: 8,
    id: "Module-09",
    personality: "hotspot",
    prBase: 0.78,
    tempOffset: 12,
    degradationRate: 0.62,
    batch: "B-2024-03",
    connectorFault: false,
  },
  {
    index: 2,
    id: "Module-03",
    personality: "batch_defect",
    prBase: 0.76,
    tempOffset: 0,
    degradationRate: 0.55,
    batch: "B-2024-03",
    connectorFault: false,
  },
  {
    index: 11,
    id: "Module-12",
    personality: "connector_fault",
    prBase: 0.8,
    tempOffset: 0,
    degradationRate: 0.45,
    batch: "B-2024-02",
    connectorFault: true,
  },
  // Normal modules: indices 1(M02), 4(M05), 5(M06), 7(M08), 10(M11), 13(M14), 14(M15)
  {
    index: 1,
    id: "Module-02",
    personality: "normal",
    prBase: 0.81,
    tempOffset: 0,
    degradationRate: 0.43,
    batch: "B-2024-01",
    connectorFault: false,
  },
  {
    index: 4,
    id: "Module-05",
    personality: "normal",
    prBase: 0.8,
    tempOffset: 0,
    degradationRate: 0.44,
    batch: "B-2024-02",
    connectorFault: false,
  },
  {
    index: 5,
    id: "Module-06",
    personality: "normal",
    prBase: 0.82,
    tempOffset: 0,
    degradationRate: 0.42,
    batch: "B-2024-01",
    connectorFault: false,
  },
  {
    index: 7,
    id: "Module-08",
    personality: "normal",
    prBase: 0.79,
    tempOffset: 0,
    degradationRate: 0.46,
    batch: "B-2024-02",
    connectorFault: false,
  },
  {
    index: 10,
    id: "Module-11",
    personality: "normal",
    prBase: 0.81,
    tempOffset: 0,
    degradationRate: 0.43,
    batch: "B-2024-03",
    connectorFault: false,
  },
  {
    index: 13,
    id: "Module-14",
    personality: "normal",
    prBase: 0.8,
    tempOffset: 0,
    degradationRate: 0.44,
    batch: "B-2024-01",
    connectorFault: false,
  },
  {
    index: 14,
    id: "Module-15",
    personality: "normal",
    prBase: 0.79,
    tempOffset: 0,
    degradationRate: 0.45,
    batch: "B-2024-02",
    connectorFault: false,
  },
];

// Sort by index for array-based access
const SORTED_MODULES = [...MODULE_CONFIGS].sort((a, b) => a.index - b.index);

// ═══════════════════════════════════════════════════════════════
// Weather pre-generation (shared across modules)
// ═══════════════════════════════════════════════════════════════

interface WeatherSlice {
  /** Hourly weather data */
  hourly: WeatherDataPoint[];
  /** Cloud cover interpolated to 15-min intervals (0-1) */
  cloud15min: number[];
  /** Dust index interpolated to 15-min intervals */
  dust15min: number[];
}

let _weatherCache: WeatherSlice | null = null;

function generateWeather(days: number): WeatherSlice {
  // Use a separate rng stream for weather to keep it stable
  const wRng = mulberry32(1001);

  const hourly: WeatherDataPoint[] = [];
  const totalHours = days * HOURS_PER_DAY;

  // Generate daily cloud patterns: some days are cloudy, some clear
  const dailyCloudBase: number[] = [];
  for (let d = 0; d < days; d++) {
    // ~20% chance of a predominantly cloudy day
    dailyCloudBase.push(wRng() < 0.2 ? 60 + wRng() * 30 : 10 + wRng() * 25);
  }

  // Dust accumulates over time, reset on cleaning days
  const cleaningDays = [7, 15, 24]; // days when cleaning happens
  let dustAccum = 1.5;

  for (let h = 0; h < totalHours; h++) {
    const dayIndex = Math.floor(h / HOURS_PER_DAY);
    const hourOfDay = h % HOURS_PER_DAY;
    const ts = new Date(START_DATE.getTime() + h * 3600000);

    // Reset dust on cleaning days
    if (cleaningDays.includes(dayIndex) && hourOfDay === 8) {
      dustAccum = 0.5;
    }
    // Accumulate dust slowly
    dustAccum += 0.003 + wRng() * 0.005;

    // Cloud cover: base + diurnal variation + noise
    const cloudBase = dailyCloudBase[dayIndex] ?? 20;
    // Afternoon convection can increase clouds
    const diurnalCloud =
      hourOfDay >= 13 && hourOfDay <= 17 ? 10 + wRng() * 15 : 0;
    const cloudCover = clamp(
      cloudBase + diurnalCloud + gaussianWithRng(wRng, 0, 8),
      0,
      100
    );

    // Is it daytime?
    const isDaytime =
      hourOfDay >= SUNRISE_HOUR && hourOfDay <= SUNSET_HOUR;

    // Solar geometry: hour angle from solar noon
    const hourAngle = (hourOfDay - SOLAR_NOON) / (DAY_LENGTH / 2);
    const solarFraction = isDaytime
      ? Math.max(0, Math.cos((hourAngle * Math.PI) / 2))
      : 0;

    // GHI: clear-sky envelope attenuated by clouds
    const clearSkyGHI = PEAK_IRRADIANCE * solarFraction;
    const cloudFactor = 1 - (cloudCover / 100) * 0.75;
    const ghi = round(
      Math.max(0, clearSkyGHI * cloudFactor + gaussianWithRng(wRng, 0, 15)),
      1
    );

    // DNI: more affected by clouds than GHI
    const dniCloudFactor = 1 - (cloudCover / 100) * 0.9;
    const dni = round(
      Math.max(
        0,
        PEAK_IRRADIANCE *
          0.85 *
          solarFraction *
          dniCloudFactor +
          gaussianWithRng(wRng, 0, 10)
      ),
      1
    );

    // Ambient temp: diurnal sine wave
    const tempAmplitude = 6 + wRng() * 3; // 6-9°C swing
    const tempPhase = (hourOfDay - 15) / 12; // peak at ~15:00
    const ambientTemp = round(
      AVG_AMBIENT_C +
        tempAmplitude * Math.sin((1 - Math.abs(tempPhase)) * Math.PI * 0.5) *
          (hourOfDay >= 6 && hourOfDay <= 20 ? 1 : -0.6) +
        gaussianWithRng(wRng, 0, 1.5),
      1
    );

    // Humidity: inverse of temperature, higher at night
    const humidity = round(
      clamp(
        65 -
          (ambientTemp - AVG_AMBIENT_C) * 2.5 +
          (isDaytime ? -10 : 10) +
          gaussianWithRng(wRng, 0, 5),
        25,
        95
      ),
      1
    );

    // Wind speed: moderate, slightly higher afternoon
    const windBase = 2 + (isDaytime ? 1.5 : 0);
    const windSpeed = round(
      clamp(windBase + gaussianWithRng(wRng, 0, 1.2), 0, 12),
      1
    );

    hourly.push({
      timestamp: ts.toISOString(),
      ghi_wm2: ghi,
      dni_wm2: dni,
      humidity_pct: humidity,
      wind_speed_ms: windSpeed,
      dust_index: round(clamp(dustAccum, 0, 10), 2),
      cloud_cover_pct: round(cloudCover, 1),
    });
  }

  // Interpolate cloud cover and dust to 15-min intervals
  const total15min = days * INTERVALS_PER_DAY;
  const cloud15min: number[] = [];
  const dust15min: number[] = [];

  for (let i = 0; i < total15min; i++) {
    const hourFrac = i / 4; // 4 intervals per hour
    const h0 = Math.floor(hourFrac);
    const h1 = Math.min(h0 + 1, hourly.length - 1);
    const frac = hourFrac - h0;

    const cc0 = hourly[h0]?.cloud_cover_pct ?? 20;
    const cc1 = hourly[h1]?.cloud_cover_pct ?? 20;
    cloud15min.push((cc0 + (cc1 - cc0) * frac) / 100);

    const d0 = hourly[h0]?.dust_index ?? 1;
    const d1 = hourly[h1]?.dust_index ?? 1;
    dust15min.push(d0 + (d1 - d0) * frac);
  }

  return { hourly, cloud15min, dust15min };
}

function gaussianWithRng(
  rngFn: () => number,
  mean: number,
  stddev: number
): number {
  const u1 = rngFn();
  const u2 = rngFn();
  const z =
    Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stddev;
}

function getWeatherSlice(days: number): WeatherSlice {
  if (!_weatherCache || _weatherCache.hourly.length < days * HOURS_PER_DAY) {
    _weatherCache = generateWeather(Math.max(days, DEFAULT_DAYS));
  }
  return _weatherCache;
}

// ═══════════════════════════════════════════════════════════════
// SCADA telemetry generation
// ═══════════════════════════════════════════════════════════════

const _scadaCache: Map<string, ScadaDataPoint[]> = new Map();

function generateScada(
  moduleIndex: number,
  days: number
): ScadaDataPoint[] {
  const key = `${moduleIndex}-${days}`;
  if (_scadaCache.has(key)) return _scadaCache.get(key)!;

  const config = SORTED_MODULES[moduleIndex];
  if (!config) throw new Error(`Invalid module index: ${moduleIndex}`);

  const weather = getWeatherSlice(days);
  const mRng = mulberry32(2000 + moduleIndex * 137);
  const totalIntervals = days * INTERVALS_PER_DAY;
  const data: ScadaDataPoint[] = [];

  // Connector fault pattern: intermittent drops on specific intervals
  const faultIntervals = new Set<number>();
  if (config.connectorFault) {
    // Generate clusters of fault intervals (2-5 consecutive intervals, 3-6 events over 30 days)
    const numFaultEvents = 3 + Math.floor(mRng() * 4);
    for (let e = 0; e < numFaultEvents; e++) {
      const startInterval = Math.floor(mRng() * totalIntervals);
      const duration = 2 + Math.floor(mRng() * 4);
      for (let j = 0; j < duration; j++) {
        faultIntervals.add(startInterval + j);
      }
    }
  }

  for (let i = 0; i < totalIntervals; i++) {
    const ts = new Date(START_DATE.getTime() + i * 15 * 60000);
    const hourOfDay = ts.getHours() + ts.getMinutes() / 60;
    const dayIndex = Math.floor(i / INTERVALS_PER_DAY);

    // Is it daytime?
    const isDaytime = hourOfDay >= SUNRISE_HOUR && hourOfDay <= SUNSET_HOUR;

    // Solar geometry
    const hourAngle = (hourOfDay - SOLAR_NOON) / (DAY_LENGTH / 2);
    const solarFraction = isDaytime
      ? Math.max(0, Math.cos((hourAngle * Math.PI) / 2))
      : 0;

    // Cloud attenuation from weather data
    const cloudFrac = weather.cloud15min[i] ?? 0.2;
    const dustIdx = weather.dust15min[i] ?? 1;

    // Irradiance: bell-curve with cloud + dust attenuation + module noise
    const clearSkyIrr = PEAK_IRRADIANCE * solarFraction;
    const cloudAtten = 1 - cloudFrac * 0.75;
    const dustAtten = 1 - dustIdx * 0.008; // up to ~8% loss at dust=10
    const irrNoise = isDaytime ? gaussianWithRng(mRng, 0, 20) : 0;
    const irradiance = round(
      clamp(clearSkyIrr * cloudAtten * dustAtten + irrNoise, 0, 1100),
      1
    );

    // Ambient temperature: diurnal model with noise
    const tempAmplitude = 7;
    const ambientTemp = round(
      AVG_AMBIENT_C +
        tempAmplitude *
          Math.sin(
            ((hourOfDay - 6) / 18) * Math.PI
          ) *
          (isDaytime ? 1 : -0.4) +
        gaussianWithRng(mRng, 0, 1),
      1
    );

    // Module temp: ambient + NOCT correlation with irradiance + personality offset
    // NOCT model: Tcell = Tambient + (NOCT - 20) * G/800
    // NOCT ~45°C for typical modules
    const noctDelta = ((45 - 20) * irradiance) / 800;
    const moduleTemp = round(
      clamp(
        ambientTemp +
          noctDelta +
          config.tempOffset +
          gaussianWithRng(mRng, 0, 0.8),
        -5,
        80
      ),
      1
    );

    // Temperature derating: power drops ~0.35%/°C above 25°C (STC)
    const tempDerate =
      moduleTemp > 25 ? 1 - 0.0035 * (moduleTemp - 25) : 1;

    // Performance ratio with personality-based adjustment
    let pr = config.prBase;
    // Add small daily drift and noise
    pr += gaussianWithRng(mRng, 0, 0.015);
    // Soiling impact (dust index)
    pr -= dustIdx * 0.005;
    // Degradation (very small over 30 days, but visible for high-degradation modules)
    pr -= (config.degradationRate / 365) * dayIndex * 0.01;

    pr = clamp(pr, 0.55, 0.92);

    // Power: irradiance × nameplate × PR × temp derating
    let powerKw =
      (irradiance / 1000) * (NAMEPLATE_W / 1000) * pr * tempDerate;

    // Connector fault: intermittent current drops → power drops
    let connectorDrop = 1;
    if (faultIntervals.has(i)) {
      connectorDrop = 0.2 + mRng() * 0.4; // 20-60% of normal
    }
    powerKw *= connectorDrop;

    powerKw = round(clamp(powerKw, 0, 0.55), 4);

    // String current and voltage
    // Vmp ~40V at STC, increases slightly with irradiance
    // Imp = P / V
    const stringVoltage = isDaytime
      ? round(
          clamp(
            38 +
              (irradiance / PEAK_IRRADIANCE) * 12 -
              0.12 * (moduleTemp - 25) +
              gaussianWithRng(mRng, 0, 0.3),
            0,
            52
          ),
          2
        )
      : 0;

    const stringCurrent =
      stringVoltage > 0 && powerKw > 0
        ? round(clamp((powerKw * 1000) / stringVoltage, 0, 14), 2)
        : 0;

    // Finalized PR (back-calculate for consistency)
    const computedPr =
      irradiance > 50 && powerKw > 0
        ? round(
            powerKw /
              ((irradiance / 1000) * (NAMEPLATE_W / 1000) * tempDerate),
            4
          )
        : 0;

    data.push({
      timestamp: ts.toISOString(),
      power_ac_kw: powerKw,
      irradiance_poa_wm2: irradiance,
      module_temp_c: moduleTemp,
      ambient_temp_c: clamp(ambientTemp, 8, 35),
      performance_ratio: irradiance > 50 ? round(clamp(computedPr, 0.55, 0.92), 4) : 0,
      string_current_a: stringCurrent * connectorDrop < 1 && isDaytime && irradiance > 50
        ? round(stringCurrent * connectorDrop, 2)
        : stringCurrent,
      string_voltage_v: stringVoltage,
    });
  }

  _scadaCache.set(key, data);
  return data;
}

// ═══════════════════════════════════════════════════════════════
// Financial data generation
// ═══════════════════════════════════════════════════════════════

const _financialCache: Map<string, FinancialDataPoint[]> = new Map();

function generateFinancial(
  moduleIndex: number,
  days: number
): FinancialDataPoint[] {
  const key = `${moduleIndex}-${days}`;
  if (_financialCache.has(key)) return _financialCache.get(key)!;

  const scada = generateScada(moduleIndex, days);
  const config = SORTED_MODULES[moduleIndex];
  if (!config) throw new Error(`Invalid module index: ${moduleIndex}`);

  const fRng = mulberry32(3000 + moduleIndex * 53);
  const result: FinancialDataPoint[] = [];
  const weather = getWeatherSlice(days);

  for (let d = 0; d < days; d++) {
    const dateTs = new Date(
      START_DATE.getTime() + d * 24 * 3600000
    );
    const dateStr = dateTs.toISOString().split("T")[0]!;

    // Sum 15-min power readings for energy yield
    const startIdx = d * INTERVALS_PER_DAY;
    const endIdx = startIdx + INTERVALS_PER_DAY;
    const dayScada = scada.slice(startIdx, endIdx);

    // Energy = sum of (power_kw * 0.25 h)
    const energyKwh = round(
      dayScada.reduce((sum, pt) => sum + pt.power_ac_kw * 0.25, 0),
      3
    );

    // Spot price varies daily (80-130 EUR/MWh)
    const spotPrice = round(85 + fRng() * 45 + Math.sin(d * 0.3) * 10, 2);

    // Revenue: energy × spot price converted from MWh to kWh
    const revenue = round(energyKwh * (spotPrice / 1000), 4);

    // Losses
    const dustIdx = weather.dust15min[startIdx + 48] ?? 2; // mid-day dust
    const lossSoiling = round(energyKwh * dustIdx * 0.004 * (spotPrice / 1000), 4);
    const lossClipping = round(
      energyKwh * 0.005 * (1 + fRng() * 0.5) * (spotPrice / 1000),
      4
    );
    const lossDegradation = round(
      energyKwh *
        (config.degradationRate / 365) *
        0.01 *
        (spotPrice / 1000),
      4
    );
    const lossDowntime = config.connectorFault
      ? round(energyKwh * 0.02 * (spotPrice / 1000) * (fRng() > 0.7 ? 3 : 1), 4)
      : round(energyKwh * 0.002 * fRng() * (spotPrice / 1000), 4);

    const carbonAvoided = round(energyKwh * CARBON_FACTOR_KG_KWH, 3);

    result.push({
      date: dateStr,
      energy_yield_kwh: energyKwh,
      revenue_eur: revenue,
      loss_soiling_eur: lossSoiling,
      loss_clipping_eur: lossClipping,
      loss_degradation_eur: lossDegradation,
      loss_downtime_eur: lossDowntime,
      carbon_avoided_kg: carbonAvoided,
      spot_price_eur_mwh: spotPrice,
    });
  }

  _financialCache.set(key, result);
  return result;
}

// ═══════════════════════════════════════════════════════════════
// Diagnostic events
// ═══════════════════════════════════════════════════════════════

let _thermalCache: ThermalEvent[] | null = null;

function generateThermalEvents(): ThermalEvent[] {
  if (_thermalCache) return _thermalCache;

  const tRng = mulberry32(4000);
  const events: ThermalEvent[] = [];

  // 2-3 thermal events per fleet/month
  // Module-09 (hotspot) always gets one
  const eventModules = [8, Math.floor(tRng() * NUM_MODULES), Math.floor(tRng() * NUM_MODULES)];

  for (const mi of eventModules) {
    const config = SORTED_MODULES[mi]!;
    const dayOffset = 5 + Math.floor(tRng() * 20);
    const eventDate = new Date(
      START_DATE.getTime() + dayOffset * 24 * 3600000
    );

    // Generate 6x10 heatmap grid (cell temperatures)
    const baseTemp = config.personality === "hotspot" ? 58 : 45;
    const heatmap: number[][] = [];
    const hotRow = Math.floor(tRng() * 6);
    const hotCol = Math.floor(tRng() * 10);

    for (let r = 0; r < 6; r++) {
      const row: number[] = [];
      for (let c = 0; c < 10; c++) {
        const dist = Math.sqrt((r - hotRow) ** 2 + (c - hotCol) ** 2);
        const hotspotContrib =
          config.personality === "hotspot"
            ? 15 * Math.exp(-dist * 0.5)
            : 5 * Math.exp(-dist * 0.8);
        row.push(
          round(baseTemp + hotspotContrib + gaussianWithRng(tRng, 0, 1.5), 1)
        );
      }
      heatmap.push(row);
    }

    const hotspotTemp = heatmap[hotRow]![hotCol]!;
    const avgTemp =
      heatmap.flat().reduce((s, v) => s + v, 0) / heatmap.flat().length;

    events.push({
      date: eventDate.toISOString().split("T")[0]!,
      module_id: config.id,
      hotspot_delta_c: round(hotspotTemp - avgTemp, 1),
      hotspot_temp_c: round(hotspotTemp, 1),
      location: { row: hotRow, col: hotCol },
      heatmap,
    });
  }

  _thermalCache = events;
  return events;
}

let _ivCache: IVCurveTrace[] | null = null;

function generateIVCurves(): IVCurveTrace[] {
  if (_ivCache) return _ivCache;

  const ivRng = mulberry32(5000);
  const curves: IVCurveTrace[] = [];

  for (let mi = 0; mi < NUM_MODULES; mi++) {
    const config = SORTED_MODULES[mi]!;
    const dayOffset = 10 + Math.floor(ivRng() * 15);
    const eventDate = new Date(
      START_DATE.getTime() + dayOffset * 24 * 3600000
    );

    // IV curve: 20 points from 0V to Voc
    const voc = 48 + gaussianWithRng(ivRng, 0, 0.5);
    const isc = 12.5 + gaussianWithRng(ivRng, 0, 0.3);

    // Series/shunt resistance affect curve shape
    const rs =
      config.personality === "hotspot"
        ? 0.8 + ivRng() * 0.3
        : config.personality === "batch_defect"
          ? 0.6 + ivRng() * 0.2
          : 0.3 + ivRng() * 0.2;

    const rsh =
      config.personality === "batch_defect"
        ? 80 + ivRng() * 40
        : 200 + ivRng() * 100;

    const voltagePoints: number[] = [];
    const currentPoints: number[] = [];

    // Empirical fill factor based on Rs/Rsh
    // Ideal FF for silicon ~0.82; Rs degrades it, low Rsh degrades it further
    const idealFF = 0.82;
    const rsLoss = rs * 0.08; // ~0.024-0.088 loss from Rs
    const rshLoss = Math.max(0, (300 - rsh) * 0.0003); // loss from low Rsh
    const ff = round(clamp(idealFF - rsLoss - rshLoss, 0.55, 0.82), 4);

    // Derive Vmp, Imp from FF
    const vmp = voc * (0.72 + ff * 0.15); // Vmp typically ~80-85% of Voc
    const imp = (ff * voc * isc) / (vmp); // Imp from FF definition

    const numPoints = 20;
    for (let p = 0; p < numPoints; p++) {
      const v = (p / (numPoints - 1)) * voc;
      // Shape the curve: flat at Isc, then knee, then drops to 0 at Voc
      // Use a parameterized curve that matches the fill factor
      const vNorm = v / voc;
      const kneeSharpness = 3 + ff * 8; // sharper knee = higher FF
      const i = isc * Math.max(0, 1 - Math.pow(vNorm, kneeSharpness)) - v / rsh;

      voltagePoints.push(round(v, 2));
      currentPoints.push(round(Math.max(0, i), 3));
    }

    curves.push({
      module_id: config.id,
      date: eventDate.toISOString().split("T")[0]!,
      voltage_points: voltagePoints,
      current_points: currentPoints,
      fill_factor: clamp(ff, 0.5, 0.85),
      series_resistance_ohm: round(rs, 3),
      shunt_resistance_ohm: round(rsh, 1),
    });
  }

  _ivCache = curves;
  return curves;
}

let _maintenanceCache: MaintenanceEvent[] | null = null;

function generateMaintenanceEvents(): MaintenanceEvent[] {
  if (_maintenanceCache) return _maintenanceCache;

  const events: MaintenanceEvent[] = [];

  // 3 cleanings
  const cleaningDays = [7, 15, 24];
  for (const d of cleaningDays) {
    const eventDate = new Date(START_DATE.getTime() + d * 24 * 3600000);
    events.push({
      date: eventDate.toISOString().split("T")[0]!,
      type: "cleaning",
      cost_eur: 85 + Math.round((d % 3) * 5),
      duration_hours: 2,
      notes: `Scheduled cleaning — fleet-wide panel wash. Soiling reduced from ${(3 + d * 0.2).toFixed(1)}% to 0.5%.`,
    });
  }

  // 1 inverter reset
  const resetDate = new Date(START_DATE.getTime() + 18 * 24 * 3600000);
  events.push({
    date: resetDate.toISOString().split("T")[0]!,
    type: "inverter_reset",
    cost_eur: 0,
    duration_hours: 0.5,
    notes:
      "Inverter string 3 communication fault. Remote reset resolved issue. No downtime beyond reset window.",
  });

  _maintenanceCache = events;
  return events;
}

let _anomalyCache: AnomalyAlert[] | null = null;

function generateAnomalyAlerts(): AnomalyAlert[] {
  if (_anomalyCache) return _anomalyCache;

  const alerts: AnomalyAlert[] = [
    {
      id: "ANM-001",
      module_id: "Module-09",
      severity: "high",
      confidence_pct: 94,
      pattern: "escalating",
      description:
        "Persistent hotspot detected: cell temperature 12°C above string average. Thermal runaway risk if trend continues. Recommend IR inspection and bypass diode check.",
      detected_at: new Date(
        START_DATE.getTime() + 22 * 24 * 3600000 + 10 * 3600000
      ).toISOString(),
    },
    {
      id: "ANM-002",
      module_id: "Module-03",
      severity: "medium",
      confidence_pct: 88,
      pattern: "recurring",
      description:
        "PR consistently 5% below fleet average despite normal operating temperatures. Batch B-2024-03 defect pattern matches 2 other modules. Likely cell-level micro-crack or encapsulant browning.",
      detected_at: new Date(
        START_DATE.getTime() + 19 * 24 * 3600000 + 14 * 3600000
      ).toISOString(),
    },
    {
      id: "ANM-003",
      module_id: "Module-12",
      severity: "high",
      confidence_pct: 91,
      pattern: "recurring",
      description:
        "Intermittent string current drops (40-80% reduction) detected 5 times in 30 days. Pattern suggests loose MC4 connector or corroded contact. Immediate physical inspection recommended.",
      detected_at: new Date(
        START_DATE.getTime() + 25 * 24 * 3600000 + 11 * 3600000
      ).toISOString(),
    },
    {
      id: "ANM-004",
      module_id: "Module-09",
      severity: "low",
      confidence_pct: 76,
      pattern: "one-off",
      description:
        "Elevated degradation rate (0.62%/yr) detected for Module-09. Current trajectory exceeds warranty threshold by Year 8. Monitor and collect evidence for potential warranty claim.",
      detected_at: new Date(
        START_DATE.getTime() + 27 * 24 * 3600000 + 9 * 3600000
      ).toISOString(),
    },
  ];

  _anomalyCache = alerts;
  return alerts;
}

// ═══════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════

export function getModuleProfiles(): ModuleProfile[] {
  return SORTED_MODULES.map((c) => ({
    id: c.id,
    model: "WRM-580",
    manufacturer: "Roshan",
    technology: "Mono-PERC HJT",
    rated_power_w: NAMEPLATE_W,
    batch: c.batch,
    install_date: "2025-09-15",
    personality: c.personality,
  }));
}

export function getScadaData(
  moduleIndex: number,
  days: number = DEFAULT_DAYS
): ScadaDataPoint[] {
  return generateScada(moduleIndex, days);
}

export function getWeatherData(
  days: number = DEFAULT_DAYS
): WeatherDataPoint[] {
  const weather = getWeatherSlice(days);
  return weather.hourly.slice(0, days * HOURS_PER_DAY);
}

export function getFinancialData(
  moduleIndex: number,
  days: number = DEFAULT_DAYS
): FinancialDataPoint[] {
  return generateFinancial(moduleIndex, days);
}

export function getDailyAggregates(
  moduleIndex: number,
  days: number = DEFAULT_DAYS
): FinancialDataPoint[] {
  // For 90D and 1Y ranges, we only generate up to the requested days
  // and return daily-level data (same as financial data for daily granularity)
  return generateFinancial(moduleIndex, days);
}

export function getThermalEvents(): ThermalEvent[] {
  return generateThermalEvents();
}

export function getIVCurves(): IVCurveTrace[] {
  return generateIVCurves();
}

export function getMaintenanceEvents(): MaintenanceEvent[] {
  return generateMaintenanceEvents();
}

export function getAnomalyAlerts(): AnomalyAlert[] {
  return generateAnomalyAlerts();
}

// ─── Fleet-level aggregates ───────────────────────────────────

export function getFleetScadaSummary(
  days: number = DEFAULT_DAYS
): {
  timestamp: string;
  total_power_kw: number;
  avg_pr: number;
  avg_irradiance: number;
}[] {
  const totalIntervals = days * INTERVALS_PER_DAY;

  // Pre-generate all module data
  const allModuleData: ScadaDataPoint[][] = [];
  for (let m = 0; m < NUM_MODULES; m++) {
    allModuleData.push(generateScada(m, days));
  }

  const summary: {
    timestamp: string;
    total_power_kw: number;
    avg_pr: number;
    avg_irradiance: number;
  }[] = [];

  for (let i = 0; i < totalIntervals; i++) {
    let totalPower = 0;
    let prSum = 0;
    let prCount = 0;
    let irrSum = 0;

    for (let m = 0; m < NUM_MODULES; m++) {
      const pt = allModuleData[m]![i]!;
      totalPower += pt.power_ac_kw;
      if (pt.performance_ratio > 0) {
        prSum += pt.performance_ratio;
        prCount++;
      }
      irrSum += pt.irradiance_poa_wm2;
    }

    summary.push({
      timestamp: allModuleData[0]![i]!.timestamp,
      total_power_kw: round(totalPower, 3),
      avg_pr: prCount > 0 ? round(prSum / prCount, 4) : 0,
      avg_irradiance: round(irrSum / NUM_MODULES, 1),
    });
  }

  return summary;
}

export function getFleetFinancialSummary(
  days: number = DEFAULT_DAYS
): FinancialDataPoint[] {
  // Aggregate financial data across all modules
  const allFinancial: FinancialDataPoint[][] = [];
  for (let m = 0; m < NUM_MODULES; m++) {
    allFinancial.push(generateFinancial(m, days));
  }

  const summary: FinancialDataPoint[] = [];

  for (let d = 0; d < days; d++) {
    let energyYield = 0;
    let revenue = 0;
    let lossSoiling = 0;
    let lossClipping = 0;
    let lossDeg = 0;
    let lossDown = 0;
    let carbon = 0;
    let spotPrice = 0;

    for (let m = 0; m < NUM_MODULES; m++) {
      const fp = allFinancial[m]![d]!;
      energyYield += fp.energy_yield_kwh;
      revenue += fp.revenue_eur;
      lossSoiling += fp.loss_soiling_eur;
      lossClipping += fp.loss_clipping_eur;
      lossDeg += fp.loss_degradation_eur;
      lossDown += fp.loss_downtime_eur;
      carbon += fp.carbon_avoided_kg;
      spotPrice = fp.spot_price_eur_mwh; // same for all modules on same day
    }

    summary.push({
      date: allFinancial[0]![d]!.date,
      energy_yield_kwh: round(energyYield, 3),
      revenue_eur: round(revenue, 4),
      loss_soiling_eur: round(lossSoiling, 4),
      loss_clipping_eur: round(lossClipping, 4),
      loss_degradation_eur: round(lossDeg, 4),
      loss_downtime_eur: round(lossDown, 4),
      carbon_avoided_kg: round(carbon, 3),
      spot_price_eur_mwh: spotPrice,
    });
  }

  return summary;
}
