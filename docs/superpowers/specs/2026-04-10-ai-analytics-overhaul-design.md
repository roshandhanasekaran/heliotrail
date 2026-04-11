# AI Analytics Overhaul — Design Spec

**Date:** 2026-04-10
**Status:** Draft
**Scope:** Complete overhaul of the AI Analytics section to deliver realistic, interactive, multi-persona intelligence for PV solar fleet monitoring.

---

## Context

The current AI Analytics section (`/app/ai-analytics`) has 7 detail panels with realistic *values* but is one-dimensional: static mock data, no hover tooltips on charts, no drill-down, no time-series exploration, and no persona differentiation. For HelioTrail to deliver real business value to clients in the solar PV sector — both module manufacturers and fleet operators — the analytics must feel grounded in real operational data and provide actionable intelligence, not just dashboards.

**Key decisions made:**
- **Architecture:** Enhanced current structure (Approach A) — keep the 6-section sidebar, add controls and interactivity on top
- **Personas:** Multi-persona dashboard (Manufacturer + Operator toggle)
- **Data:** Rich simulated time-series data mimicking real SCADA feeds
- **Data sources:** All four layers — Weather/Environmental, Thermal/IV Diagnostics, Financial/Energy Market, Supply Chain/Quality

---

## 1. Data Architecture

### 1.1 Time-Series Data Generator

**New file:** `src/lib/mock/ai-analytics-timeseries.ts`

Generates 30 days of simulated operational data with 15-minute intervals (2,880 data points per module, 15 modules = 43,200 total data points). Uses seeded random generation for deterministic output (no flicker on re-render).

**SCADA Telemetry (per module, 15-min intervals):**
| Field | Unit | Range | Notes |
|---|---|---|---|
| `timestamp` | ISO 8601 | 30-day window | 96 intervals/day |
| `power_ac_kw` | kW | 0–0.55 | Bell curve, peaks at solar noon, 0 at night |
| `irradiance_poa_wm2` | W/m² | 0–1100 | Correlated with power, cloud transients |
| `module_temp_c` | °C | 10–72 | Ambient + NOCT correlation |
| `ambient_temp_c` | °C | 8–35 | Seasonal pattern (April, southern Europe) |
| `performance_ratio` | % | 0.65–0.88 | Calculated: actual / (irradiance × nameplate × derating) |
| `string_current_a` | A | 0–14 | For string-level anomaly detection |
| `string_voltage_v` | V | 0–52 | Per-string voltage |

**Weather/Environmental (hourly):**
| Field | Unit | Notes |
|---|---|---|
| `ghi_wm2` | W/m² | Global horizontal irradiance |
| `dni_wm2` | W/m² | Direct normal irradiance |
| `humidity_pct` | % | Relative humidity |
| `wind_speed_ms` | m/s | Affects module cooling |
| `dust_index` | 0–10 | Accumulates between cleanings, resets on cleaning events |
| `cloud_cover_pct` | % | Drives irradiance variation |

**Financial (daily aggregates):**
| Field | Unit | Notes |
|---|---|---|
| `energy_yield_kwh` | kWh | Sum of 15-min power data |
| `revenue_eur` | EUR | yield × tariff rate (time-of-use pricing) |
| `loss_soiling_eur` | EUR | Soiling impact in currency |
| `loss_clipping_eur` | EUR | Inverter clipping loss |
| `loss_degradation_eur` | EUR | Age-related power loss |
| `loss_downtime_eur` | EUR | Unplanned outage cost |
| `carbon_avoided_kg` | kg CO₂ | Grid emission factor × yield |
| `spot_price_eur_mwh` | EUR/MWh | Energy market price (varies by hour) |

**Diagnostic Events (sparse):**
| Event | Frequency | Data |
|---|---|---|
| Thermal imaging | 2–3 per fleet per month | Heatmap grid, hotspot ΔT, location on module |
| IV curve trace | 1 per module at commissioning + annual | Voltage-current pairs, fill factor, series resistance |
| Maintenance | 3 cleanings + 1 inverter reset per 30 days | Type, cost, duration, impact on soiling/performance |
| Anomaly alert | 4 active | Severity, confidence %, pattern description, timestamp |

### 1.2 Module Personalities

Each of the 15 modules has a distinct "personality" that makes the data realistic:

| Module | Behavior | Purpose |
|---|---|---|
| Module-09 (WRM-580) | Runs hot (+12°C above string avg), accelerated degradation 0.62%/yr | Hotspot / bypass diode failure demo |
| Module-03 (WRM-580) | Normal temp but low PR (76%), batch B-2024-03 defect | Batch defect detection demo |
| Module-12 (WRM-580) | Intermittent string current drops | Connector/junction box failure demo |
| Module-01, 04, 07, 10, 13 | High performers (PR 83-86%) | "Outperforming" baseline |
| Remaining modules | Normal operation (PR 79-82%) | Fleet average |

### 1.3 Data Generation Strategy

- **Lazy generation**: Data computed on first access, cached in module scope
- **Seeded RNG**: `seed = moduleIndex * 1000 + dayOfYear` — deterministic, no flicker
- **Correlation engine**: Weather drives irradiance → irradiance drives power → power drives revenue. Not independent random values.
- **Seasonal calibration**: April in southern Europe (~35°N): 6.5 peak sun hours, sunrise ~06:45, sunset ~20:15, avg ambient 18°C

---

## 2. UI Architecture

### 2.1 Top Control Bar (New Component)

**File:** `src/components/app/ai-analytics/analytics-control-bar.tsx`

Sits between the page header and content area. Contains:

1. **Persona Toggle** — Segmented control: `Manufacturer` | `Operator`
   - Stored in component state, passed down as prop to all detail panels
   - Changes which content blocks are visible within each panel
   - Default: Manufacturer (matches primary HelioTrail user base)

2. **Time Range Selector** — Buttons: `7D` | `30D` | `90D` | `1Y`
   - Filters all time-series data on the current panel
   - Default: 30D
   - For 90D and 1Y: data generator produces daily aggregates instead of 15-min

3. **Model Filter** — Dropdown: `All Models (15)` | `WRM-580 TOPCon` | `WRM-545 PERC` | etc.
   - Filters fleet tables and charts to selected model line
   - Default: All Models

4. **Sync Indicator** — Right-aligned: `● Last sync: 2 min ago`
   - Simulated — updates timestamp every 60 seconds via `setInterval`
   - Green dot pulses with CSS animation

### 2.2 Chart Upgrade: Custom SVG → Recharts

**Replace all 4 custom SVG chart components** in `src/components/app/ai-analytics/shared/` with Recharts equivalents:

| Current (Custom SVG) | New (Recharts) | Key Additions |
|---|---|---|
| `area-chart.tsx` | Recharts `AreaChart` + `Tooltip` + `Brush` | Rich tooltip, brush zoom, reference lines |
| `bar-chart.tsx` | Recharts `BarChart` + `Tooltip` | Hover highlight, click handler, value labels |
| `dual-line-chart.tsx` | Recharts `LineChart` (dual series) + `Tooltip` | Hover crosshair, legend toggle |
| `donut-chart.tsx` | Recharts `PieChart` + `Tooltip` + active sector | Hover expands sector, shows value |

**Shared tooltip component:** `src/components/app/ai-analytics/shared/analytics-tooltip.tsx`
- Dark background (#0D0D0D), white text
- Shows all correlated metrics for the data point (not just the chart's own value)
- "Click for module detail →" hint when hovering module-specific data

**Shared chart wrapper:** `src/components/app/ai-analytics/shared/chart-container.tsx`
- Consistent sizing, responsive container
- Loading skeleton while data generates
- Export button (future — not in scope)

### 2.3 Module Drill-Down Flyout (New Component)

**File:** `src/components/app/ai-analytics/module-flyout.tsx`

Slides in from the right edge (width: 50% of viewport, min 480px). Triggered by clicking any module ID in any table, chart tooltip, or alert card.

**Structure:**
- **Header**: Module ID, manufacturer, technology, batch, status badge (At Risk / Normal / Outperforming)
- **Quick stats row**: Current PR, Degradation rate/yr, Hotspot ΔT, Warranty evidence score
- **Tabbed content**:
  1. **Performance** — Power output vs expected (7-day Recharts area chart), PR trend, energy yield
  2. **Thermal** — Simulated thermal heatmap (CSS gradient grid), hotspot markers with ΔT values, inspection history
  3. **IV Curves** — Simulated IV curve chart (voltage vs current), fill factor, series resistance comparison to baseline
  4. **Supply Chain** — BOM components, supplier, origin country, batch, risk indicators
  5. **Warranty** — Degradation curve vs warranty threshold, evidence score breakdown, claim value estimate
- **AI Recommendation**: Contextual suggestion based on module's "personality" (e.g., "Bypass diode failure pattern — warranty claim recommended")

**Animation**: Slide-in from right with `framer-motion` (already in dependencies), 300ms duration.

### 2.4 Persona-Specific Content

When the persona toggle switches, each detail panel shows/hides specific content blocks:

**Manufacturer-emphasis content (hidden in Operator view):**
- Quality Score by Model Line (Fleet Health)
- Model vs Datasheet PR comparison (Performance)
- Batch defect patterns, supplier degradation comparison (Degradation)
- Material durability by component type (Soiling)
- Warranty exposure EUR by product line (Revenue)
- Supply chain risk scoring, UFLPA attestation status (Compliance)

**Operator-emphasis content (hidden in Manufacturer view):**
- Active Alert Timeline (Fleet Health)
- Daily energy yield bars with weather icons, PR vs Irradiance scatter (Performance)
- Remaining useful life estimates (Degradation)
- Full cleaning ROI optimizer, temperature derating chart (Soiling)
- Spot price overlay, revenue timeline (Revenue)
- Grid code compliance, ESG reporting readiness (Compliance)

**Shared content (always visible):**
- KPI cards, fleet health gauge, trend charts
- Fleet benchmarking tables
- AI insights and anomaly feeds
- Carbon metrics and compliance risk tables

---

## 3. Enhanced Detail Panels

### 3.1 Summary Detail
- **NEW**: Live fleet power output ticker (simulated, updates every 5s via `setInterval`)
- **NEW**: Weather widget — current irradiance, ambient temp, wind, cloud cover
- **UPGRADED**: KPI cards clickable → navigate to relevant section
- **UPGRADED**: Alert cards show timestamp + confidence % + "View Module →" link

### 3.2 Fleet Health Detail
- **NEW**: Heatmap table — 15 modules × 5 metrics, cells colored by score, hover shows value + trend
- **UPGRADED**: Historical trend → Recharts with tooltip per metric
- **PERSONA (Mfr)**: Quality Score by Model Line comparison chart
- **PERSONA (Ops)**: Active Alert Timeline

### 3.3 Performance Detail
- **UPGRADED**: 30-day chart → Recharts with brush zoom + correlated tooltip
- **NEW**: Daily energy yield stacked bars (actual vs expected) with weather icons
- **NEW**: PR vs Irradiance scatter plot (identifies low-light underperformers)
- **UPGRADED**: Table rows clickable → module flyout
- **PERSONA (Mfr)**: "Model vs Datasheet" column
- **PERSONA (Ops)**: "Revenue per Module" column + daily EUR

### 3.4 Degradation & Warranty Detail
- **UPGRADED**: 25-year projection → Recharts with hover per year
- **NEW**: Batch anomaly timeline (visual timeline with severity markers)
- **NEW**: Warranty claim builder — modules with evidence >80% get "Prepare Claim" button
- **PERSONA (Mfr)**: Supplier comparison, BOM correlation
- **PERSONA (Ops)**: Claim value EUR, remaining useful life

### 3.5 Soiling & Environmental Detail
- **NEW**: Soiling accumulation chart (30-day, resets at cleaning events)
- **NEW**: Temperature derating chart (efficiency vs module temp throughout day)
- **NEW**: Component failure mode breakdown with hours-to-failure
- **UPGRADED**: Cleaning schedule → interactive timeline
- **PERSONA (Ops)**: Full cleaning ROI optimizer
- **PERSONA (Mfr)**: Material durability tracking

### 3.6 Revenue & Carbon Detail
- **UPGRADED**: Loss driver donut → Recharts with hover EUR breakdown
- **NEW**: Revenue timeline — 30-day stacked area (energy sale + carbon + tariff)
- **NEW**: Spot price overlay (generation timing vs price peaks)
- **NEW**: Carbon intensity per-module comparison vs industry benchmarks
- **PERSONA (Mfr)**: Carbon footprint per model line for EPD/ESPR
- **PERSONA (Ops)**: Revenue optimization opportunities

### 3.7 Compliance & Risk Detail
- **NEW**: Risk score trend chart (30-day per-module trend)
- **NEW**: ESPR compliance checklist (data completeness per requirement)
- **UPGRADED**: Insight cards expandable with evidence links
- **UPGRADED**: Anomaly cards clickable → module flyout
- **PERSONA (Mfr)**: Supply chain risk, UFLPA attestation
- **PERSONA (Ops)**: Grid code compliance, ESG readiness

---

## 4. Interaction Patterns

### 4.1 Rich Tooltips
Every Recharts component uses a shared `<AnalyticsTooltip>` that shows all correlated metrics for the hovered data point. Example for a performance chart point:
- Timestamp, PR %, Power kW, Irradiance W/m², Module Temp °C
- "Click for module detail →" when hovering module-specific data

### 4.2 Click-to-Drill
Any module ID rendered anywhere (table cell, chart label, alert card, tooltip) wraps in a `<ModuleLink>` component that opens the flyout on click.

### 4.3 Brush Zoom
All time-series Recharts charts include a `<Brush>` component at the bottom for drag-to-select time range. Reset button returns to full range.

### 4.4 Cross-Highlight
Within a single detail panel, hovering a module in one visualization highlights it in adjacent charts/tables. Implemented via shared `hoveredModuleId` state in the panel component.

### 4.5 Time Range Propagation
The control bar's time range selection (7D/30D/90D/1Y) filters ALL charts in the active panel. Passed as prop from page component.

---

## 5. Files to Create / Modify

### New Files
| File | Purpose |
|---|---|
| `src/lib/mock/ai-analytics-timeseries.ts` | Time-series data generator (SCADA, weather, financial, diagnostic) |
| `src/components/app/ai-analytics/analytics-control-bar.tsx` | Top control bar (persona, time range, filters) |
| `src/components/app/ai-analytics/module-flyout.tsx` | Module drill-down flyout panel |
| `src/components/app/ai-analytics/shared/analytics-tooltip.tsx` | Shared rich tooltip component |
| `src/components/app/ai-analytics/shared/chart-container.tsx` | Shared chart wrapper with responsive sizing |
| `src/components/app/ai-analytics/shared/module-link.tsx` | Clickable module ID wrapper |
| `src/components/app/ai-analytics/shared/heatmap-table.tsx` | Module × metric heatmap grid |

### Modified Files
| File | Changes |
|---|---|
| `src/app/app/ai-analytics/page.tsx` | Add control bar, persona/timeRange/filter state, flyout state |
| `src/lib/mock/ai-analytics.ts` | Refactor to pull from time-series generator instead of flat values |
| `src/components/app/ai-analytics/shared/area-chart.tsx` | Replace custom SVG with Recharts AreaChart |
| `src/components/app/ai-analytics/shared/bar-chart.tsx` | Replace custom SVG with Recharts BarChart |
| `src/components/app/ai-analytics/shared/dual-line-chart.tsx` | Replace custom SVG with Recharts LineChart |
| `src/components/app/ai-analytics/shared/donut-chart.tsx` | Replace custom SVG with Recharts PieChart |
| `src/components/app/ai-analytics/summary-detail.tsx` | Add live ticker, weather widget, clickable KPIs |
| `src/components/app/ai-analytics/fleet-health-detail.tsx` | Add heatmap, persona blocks, Recharts upgrade |
| `src/components/app/ai-analytics/performance-detail.tsx` | Add yield bars, scatter plot, persona blocks |
| `src/components/app/ai-analytics/degradation-detail.tsx` | Add timeline, claim builder, persona blocks |
| `src/components/app/ai-analytics/soiling-detail.tsx` | Add soiling chart, derating, failure modes |
| `src/components/app/ai-analytics/revenue-detail.tsx` | Add revenue timeline, spot overlay, carbon comparison |
| `src/components/app/ai-analytics/compliance-detail.tsx` | Add risk trend, ESPR checklist, persona blocks |

### Deleted Files
| File | Reason |
|---|---|
| `src/components/app/ai-analytics/shared/countdown-ring.tsx` | Replaced by inline badge display in soiling section (simpler, no separate component needed) |

---

## 6. Verification Plan

1. **Data generator**: Write a quick console test — generate 30 days for Module-09, verify power follows bell curve, irradiance correlates, nighttime values are 0, hotspot behavior is present
2. **Persona toggle**: Switch between Manufacturer/Operator — verify correct content blocks show/hide in each panel
3. **Time range**: Select 7D/30D/90D — verify all charts on current panel update data range
4. **Chart interactivity**: Hover any chart data point — verify tooltip appears with correlated metrics
5. **Module flyout**: Click any module ID in a table — verify flyout slides in with correct module data, all 5 tabs load
6. **Cross-highlight**: Hover a module in the benchmarking table — verify it highlights in adjacent charts
7. **Visual regression**: Compare each panel before/after to ensure no layout breakage
8. **Performance**: Verify page loads in <2s despite 43K generated data points (lazy generation + caching)

---

## 7. Out of Scope

- Real API integration (SCADA, weather APIs) — future milestone
- Drag-and-drop widget customization
- Data export (CSV/PDF) — future
- Mobile-specific responsive layout (existing responsive grids are sufficient)
- Dark mode for the analytics section specifically
- Real-time WebSocket data streaming
