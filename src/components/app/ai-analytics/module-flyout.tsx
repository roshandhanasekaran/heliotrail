"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, CheckCircle2Icon, XCircleIcon, AlertTriangleIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  getModuleProfiles,
  getScadaData,
  getThermalEvents,
  getIVCurves,
  getAnomalyAlerts,
} from "@/lib/mock/ai-analytics-timeseries";
import type {
  ModuleProfile,
  ThermalEvent,
  IVCurveData,
  AnomalyAlert,
} from "@/lib/mock/ai-analytics-timeseries";

// ─── Types ────────────────────────────────────────────────

interface ModuleFlyoutProps {
  moduleId: string | null;
  onClose: () => void;
}

type TabKey = "performance" | "thermal" | "iv-curves" | "supply-chain" | "warranty";

const TABS: { key: TabKey; label: string }[] = [
  { key: "performance", label: "Performance" },
  { key: "thermal", label: "Thermal" },
  { key: "iv-curves", label: "IV Curves" },
  { key: "supply-chain", label: "Supply Chain" },
  { key: "warranty", label: "Warranty" },
];

const CHART_TOOLTIP_STYLE = {
  background: "#fff",
  border: "1px solid #D9D9D9",
  fontSize: 12,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
};

// ─── Helpers ──────────────────────────────────────────────

function parseModuleIndex(moduleId: string): number {
  const match = moduleId.match(/(\d+)$/);
  if (!match) return 0;
  return parseInt(match[1], 10) - 1;
}

function prColor(pr: number): string {
  if (pr < 78) return "#EF4444";
  if (pr < 82) return "#F59E0B";
  return "#22C55E";
}

function degradationColor(rate: number): string {
  return rate > 0.5 ? "#EF4444" : "#737373";
}

function hotspotColor(deltaT: number | null): string {
  if (deltaT === null) return "#737373";
  if (deltaT > 10) return "#EF4444";
  if (deltaT > 5) return "#F59E0B";
  return "#22C55E";
}

function warrantyScoreColor(score: number): string {
  if (score > 80) return "#22C55E";
  if (score > 60) return "#F59E0B";
  return "#EF4444";
}

function fillFactorColor(ff: number): string {
  if (ff < 0.72) return "#EF4444";
  if (ff < 0.76) return "#F59E0B";
  return "#22C55E";
}

function statusBadge(
  pr: number,
  personality: string,
): { label: string; bg: string; text: string } {
  if (personality === "outperforming" || pr >= 85)
    return { label: "OUTPERFORMING", bg: "#DCFCE7", text: "#166534" };
  if (
    personality === "hotspot" ||
    personality === "batch_defect" ||
    personality === "connector_fault" ||
    pr < 78
  )
    return { label: "AT RISK", bg: "#FEE2E2", text: "#B91C1C" };
  return { label: "NORMAL", bg: "#F2F2F2", text: "#525252" };
}

function tempToColor(temp: number): string {
  const t = Math.max(0, Math.min(1, (temp - 20) / 60));
  if (t < 0.33) {
    const f = t / 0.33;
    const r = Math.round(0 + f * 34);
    const g = Math.round(100 + f * 155);
    const b = Math.round(200 - f * 120);
    return `rgb(${r},${g},${b})`;
  }
  if (t < 0.58) {
    const f = (t - 0.33) / 0.25;
    const r = Math.round(34 + f * 221);
    const g = Math.round(255 - f * 50);
    const b = Math.round(80 - f * 60);
    return `rgb(${r},${g},${b})`;
  }
  const f = (t - 0.58) / 0.42;
  const r = 255;
  const g = Math.round(205 - f * 175);
  const b = Math.round(20 - f * 20);
  return `rgb(${r},${g},${b})`;
}

/**
 * Renders text with **bold** markers as React nodes (no dangerouslySetInnerHTML).
 */
function renderBoldText(text: string): ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i}>{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// ─── BOM Data ─────────────────────────────────────────────

const BOM_DATA = [
  { material: "Glass", percent: 62.5 },
  { material: "Aluminium", percent: 9.5 },
  { material: "Silicon", percent: 3.2 },
  { material: "EVA", percent: 9.5 },
  { material: "Backsheet", percent: 3.2 },
  { material: "Copper", percent: 0.6 },
  { material: "Silver", percent: 0.05 },
];

// ─── Warranty Evidence Factors ────────────────────────────

function getEvidenceFactors(profile: ModuleProfile) {
  const score = profile.warrantyEvidenceScore;
  return [
    { label: "SCADA data continuity (365 days)", pass: score >= 50 },
    { label: "Flash test comparison available", pass: score >= 60 },
    { label: "IR thermography conducted", pass: profile.personality === "hotspot" || score >= 70 },
    { label: "IV curve trace on file", pass: score >= 55 },
    { label: "Environmental data correlated", pass: score >= 75 },
    { label: "Manufacturer spec sheet verified", pass: score >= 40 },
    { label: "Installation records complete", pass: score >= 80 },
    { label: "Batch defect pattern documented", pass: profile.personality === "batch_defect" || score >= 90 },
  ];
}

// ─── Sub-Components ───────────────────────────────────────

function PerformanceTab({ moduleIndex }: { moduleIndex: number }) {
  const scadaData = useMemo(() => getScadaData(moduleIndex), [moduleIndex]);

  const dailyData = useMemo(() => {
    const byDay: Record<string, { powers: number[]; expecteds: number[] }> = {};
    for (const pt of scadaData) {
      const day = pt.timestamp.slice(0, 10);
      if (!byDay[day]) byDay[day] = { powers: [], expecteds: [] };
      byDay[day].powers.push(pt.power);
      byDay[day].expecteds.push(pt.expected);
    }
    return Object.entries(byDay).map(([day, vals]) => ({
      day: day.slice(5),
      power: Math.round(vals.powers.reduce((a, b) => a + b, 0) / vals.powers.length),
      expected: Math.round(vals.expecteds.reduce((a, b) => a + b, 0) / vals.expecteds.length),
    }));
  }, [scadaData]);

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
        Power Output vs Expected — Last 7 Days
      </p>
      <div className="border border-[#E5E5E5] bg-white p-3">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailyData} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="flyoutPowerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "#737373" }}
              axisLine={{ stroke: "#D9D9D9" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) => `${v}W`}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value, name) => [
                `${value} W`,
                name === "expected" ? "Expected" : "Actual",
              ]}
            />
            <ReferenceLine
              y={dailyData[0]?.expected ?? 0}
              stroke="#A3A3A3"
              strokeDasharray="8 4"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="power"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#flyoutPowerGrad)"
              activeDot={{ r: 3, fill: "#22C55E" }}
            />
            <Line
              type="monotone"
              dataKey="expected"
              stroke="#A3A3A3"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ThermalTab({ moduleIndex }: { moduleIndex: number }) {
  const thermalEvents = useMemo(() => getThermalEvents(), []);
  const event: ThermalEvent | undefined = thermalEvents.find(
    (e) => e.moduleIndex === moduleIndex,
  );

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F2F2F2] flex items-center justify-center mb-3">
          <CheckCircle2Icon size={20} className="text-[#22C55E]" />
        </div>
        <p className="text-sm font-semibold text-[#0D0D0D]">No thermal anomalies detected</p>
        <p className="text-xs text-[#737373] mt-1">
          This module shows normal thermal behavior across all inspections.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
        Thermal Anomaly
      </p>
      <div className="border border-[#E5E5E5] bg-white p-4">
        <div
          className="grid gap-[2px] mx-auto"
          style={{
            gridTemplateColumns: "repeat(10, 1fr)",
            maxWidth: 400,
          }}
        >
          {event.cells.map((row, r) =>
            row.map((temp, c) => (
              <div
                key={`${r}-${c}`}
                className="relative aspect-square rounded-sm"
                style={{ backgroundColor: tempToColor(temp) }}
                title={`${temp.toFixed(1)}\u00B0C`}
              >
                {r === event.hotspotRow && c === event.hotspotCol && (
                  <div className="absolute inset-0 rounded-sm border-2 border-white" />
                )}
              </div>
            )),
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 justify-center">
          <span className="text-[9px] font-mono text-[#737373]">20°C</span>
          <div
            className="h-2 flex-1 rounded-full"
            style={{
              maxWidth: 200,
              background:
                "linear-gradient(to right, rgb(0,100,200), rgb(34,197,94), rgb(245,158,11), rgb(239,68,68))",
            }}
          />
          <span className="text-[9px] font-mono text-[#737373]">80°C</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">Delta Temperature</p>
            <p className="font-mono text-lg font-bold text-[#EF4444]">
              {event.deltaT.toFixed(1)}°C
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">Inspection Date</p>
            <p className="font-mono text-sm font-semibold text-[#0D0D0D]">
              {event.inspectionDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IVCurvesTab({ moduleIndex }: { moduleIndex: number }) {
  const allCurves = useMemo(() => getIVCurves(), []);
  const curve: IVCurveData | undefined = allCurves[moduleIndex];

  if (!curve) return null;

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
        IV Curve Trace
      </p>
      <div className="border border-[#E5E5E5] bg-white p-3">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={curve.points} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
            <XAxis
              dataKey="voltage"
              tick={{ fontSize: 10, fill: "#737373" }}
              axisLine={{ stroke: "#D9D9D9" }}
              tickLine={false}
              label={{ value: "Voltage (V)", position: "insideBottom", offset: -2, fontSize: 10, fill: "#A3A3A3" }}
            />
            <YAxis
              dataKey="current"
              tick={{ fontSize: 10, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
              width={40}
              label={{ value: "Current (A)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#A3A3A3" }}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value, name) => [
                `${Number(value).toFixed(2)} ${name === "current" ? "A" : "V"}`,
                name === "current" ? "Current" : "Voltage",
              ]}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: "#3B82F6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="border border-[#E5E5E5] bg-white p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#737373]">Fill Factor</p>
          <p className="font-mono text-lg font-bold" style={{ color: fillFactorColor(curve.fillFactor) }}>
            {curve.fillFactor.toFixed(3)}
          </p>
        </div>
        <div className="border border-[#E5E5E5] bg-white p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#737373]">Series R</p>
          <p className="font-mono text-lg font-bold text-[#0D0D0D]">
            {curve.seriesResistance.toFixed(2)} &#8486;
          </p>
        </div>
        <div className="border border-[#E5E5E5] bg-white p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#737373]">Shunt R</p>
          <p className="font-mono text-lg font-bold text-[#0D0D0D]">
            {curve.shuntResistance} &#8486;
          </p>
        </div>
      </div>
    </div>
  );
}

function SupplyChainTab({ profile }: { profile: ModuleProfile }) {
  const riskBadge = (risk: "Low" | "Medium" | "High") => {
    const colors = {
      Low: { bg: "#DCFCE7", text: "#166534" },
      Medium: { bg: "#FEF3C7", text: "#92400E" },
      High: { bg: "#FEE2E2", text: "#B91C1C" },
    };
    const c = colors[risk];
    return (
      <span
        className="px-2 py-0.5 text-[9px] font-bold uppercase"
        style={{ backgroundColor: c.bg, color: c.text }}
      >
        {risk}
      </span>
    );
  };

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
        Module Details
      </p>
      <div className="border border-[#E5E5E5] bg-white overflow-hidden">
        <table className="w-full text-xs">
          <tbody>
            {[
              { label: "Manufacturer", value: profile.manufacturer },
              { label: "Model", value: profile.model },
              { label: "Technology", value: profile.technology },
              { label: "Batch", value: profile.batch },
              { label: "Installation Date", value: profile.installationDate },
            ].map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                <td className="px-4 py-2.5 text-[#737373] font-medium">{row.label}</td>
                <td className="px-4 py-2.5 font-mono text-[#0D0D0D] text-right">{row.value}</td>
              </tr>
            ))}
            <tr className={BOM_DATA.length % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
              <td className="px-4 py-2.5 text-[#737373] font-medium">Origin Country</td>
              <td className="px-4 py-2.5 font-mono text-[#0D0D0D] text-right">
                <span className="inline-flex items-center gap-2">
                  {profile.originCountry} {riskBadge(profile.originRisk)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3 mt-6">
        Bill of Materials
      </p>
      <div className="border border-[#E5E5E5] bg-white p-4 space-y-2">
        {BOM_DATA.map((item) => (
          <div key={item.material} className="flex items-center gap-3">
            <span className="w-20 text-[11px] text-[#737373]">{item.material}</span>
            <div className="flex-1 h-2 bg-[#F2F2F2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#22C55E] rounded-full"
                style={{ width: `${Math.min(item.percent, 100)}%` }}
              />
            </div>
            <span className="w-12 text-right font-mono text-[10px] text-[#0D0D0D]">
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WarrantyTab({ profile }: { profile: ModuleProfile }) {
  const degradationData = useMemo(() => {
    const actualRate = profile.degradationRate;
    const warrantyRate = 0.4;
    return Array.from({ length: 31 }, (_, year) => ({
      year,
      actual: Math.round((100 - actualRate * year) * 10) / 10,
      warranty: Math.round((100 - warrantyRate * year) * 10) / 10,
    }));
  }, [profile.degradationRate]);

  const evidenceFactors = useMemo(() => getEvidenceFactors(profile), [profile]);
  const passCount = evidenceFactors.filter((f) => f.pass).length;

  const excessDegradation = Math.max(0, profile.degradationRate - 0.4);
  const estimatedClaimEur = Math.round(excessDegradation * 2000);

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3">
        Degradation Curve — 30-Year Projection
      </p>
      <div className="border border-[#E5E5E5] bg-white p-3">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={degradationData} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: "#737373" }}
              axisLine={{ stroke: "#D9D9D9" }}
              tickLine={false}
              label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 10, fill: "#A3A3A3" }}
            />
            <YAxis
              domain={[60, 102]}
              tick={{ fontSize: 10, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value, name) => [
                `${Number(value).toFixed(1)}%`,
                name === "actual" ? "Actual" : "Warranty Threshold",
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#22C55E"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: "#22C55E" }}
            />
            <Line
              type="monotone"
              dataKey="warranty"
              stroke="#F59E0B"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-[#22C55E]" />
            <span className="text-[9px] text-[#737373]">Actual ({profile.degradationRate}%/yr)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 border-t border-dashed border-[#F59E0B]" />
            <span className="text-[9px] text-[#737373]">Warranty Threshold (0.40%/yr)</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-wider font-bold text-[#737373] mb-3 mt-6">
        Evidence Score Breakdown ({passCount}/{evidenceFactors.length})
      </p>
      <div className="border border-[#E5E5E5] bg-white p-4 space-y-2">
        {evidenceFactors.map((f) => (
          <div key={f.label} className="flex items-center gap-2">
            {f.pass ? (
              <CheckCircle2Icon size={14} className="text-[#22C55E] shrink-0" />
            ) : (
              <XCircleIcon size={14} className="text-[#EF4444] shrink-0" />
            )}
            <span className="text-[11px] text-[#525252]">{f.label}</span>
          </div>
        ))}
      </div>

      {estimatedClaimEur > 0 && (
        <div className="mt-4 border border-[#E5E5E5] bg-white p-4">
          <p className="text-[10px] uppercase tracking-wider text-[#737373]">
            Estimated Claim Value
          </p>
          <p className="font-mono text-2xl font-bold text-[#22C55E] mt-1">
            &euro;{estimatedClaimEur.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Flyout Component ────────────────────────────────

export function ModuleFlyout({ moduleId, onClose }: ModuleFlyoutProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("performance");

  const moduleIndex = moduleId ? parseModuleIndex(moduleId) : -1;

  const profiles = useMemo(() => getModuleProfiles(), []);
  const profile: ModuleProfile | undefined = moduleIndex >= 0 ? profiles[moduleIndex] : undefined;

  const anomalyAlerts = useMemo(() => getAnomalyAlerts(), []);
  const alert: AnomalyAlert | undefined = anomalyAlerts.find(
    (a) => a.moduleIndex === moduleIndex,
  );

  const thermalEvents = useMemo(() => getThermalEvents(), []);
  const thermalEvent: ThermalEvent | undefined = thermalEvents.find(
    (e) => e.moduleIndex === moduleIndex,
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const isOpen = moduleId !== null;

  const badge = profile
    ? statusBadge(profile.currentPR, profile.personality)
    : { label: "NORMAL", bg: "#F2F2F2", text: "#525252" };

  const showAIRecommendation =
    alert &&
    (alert.personality === "hotspot" ||
      alert.personality === "batch_defect" ||
      alert.personality === "connector_fault");

  return (
    <AnimatePresence>
      {isOpen && profile && (
        <>
          {/* Backdrop */}
          <motion.div
            key="flyout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.20)" }}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            key="flyout-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white"
            style={{
              width: "50vw",
              minWidth: 480,
              maxWidth: 720,
              borderLeft: "1px solid #E5E5E5",
              boxShadow: "-8px 0 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <div
              className="shrink-0 px-5 py-4"
              style={{ borderBottom: "1px solid #E5E5E5" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2
                      className="text-sm font-bold text-[#0D0D0D] truncate"
                      style={{ fontSize: 14 }}
                    >
                      {moduleId}
                    </h2>
                    <span
                      className="px-2 py-0.5 text-[9px] font-bold uppercase shrink-0"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p
                    className="text-[#737373] mt-0.5 truncate"
                    style={{ fontSize: 10 }}
                  >
                    {profile.manufacturer} &middot; {profile.technology} &middot;{" "}
                    {profile.ratedPower}Wp &middot; {profile.batch}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="ml-3 shrink-0 p-1 hover:bg-[#F2F2F2] rounded transition-colors"
                  aria-label="Close flyout"
                >
                  <XIcon size={16} color="#999" />
                </button>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div
              className="shrink-0 grid grid-cols-4"
              style={{ borderBottom: "1px solid #E5E5E5" }}
            >
              <div className="px-4 py-3" style={{ borderRight: "1px solid #E5E5E5" }}>
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">Current PR</p>
                <p
                  className="font-mono text-xl font-bold mt-0.5"
                  style={{ color: prColor(profile.currentPR) }}
                >
                  {profile.currentPR}%
                </p>
              </div>
              <div className="px-4 py-3" style={{ borderRight: "1px solid #E5E5E5" }}>
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">Degrad. Rate/yr</p>
                <p
                  className="font-mono text-xl font-bold mt-0.5"
                  style={{ color: degradationColor(profile.degradationRate) }}
                >
                  {profile.degradationRate.toFixed(2)}%
                </p>
              </div>
              <div className="px-4 py-3" style={{ borderRight: "1px solid #E5E5E5" }}>
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                  Hotspot &#916;T
                </p>
                <p
                  className="font-mono text-xl font-bold mt-0.5"
                  style={{
                    color: thermalEvent
                      ? hotspotColor(thermalEvent.deltaT)
                      : "#737373",
                  }}
                >
                  {thermalEvent ? `${thermalEvent.deltaT.toFixed(1)}\u00B0C` : "\u2014"}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                  Warranty Evidence
                </p>
                <p
                  className="font-mono text-xl font-bold mt-0.5"
                  style={{ color: warrantyScoreColor(profile.warrantyEvidenceScore) }}
                >
                  {profile.warrantyEvidenceScore}%
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div
              className="shrink-0 flex gap-0 px-5 overflow-x-auto"
              style={{ borderBottom: "1px solid #E5E5E5" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="relative px-3 py-2.5 text-[10px] uppercase tracking-wider font-bold transition-colors whitespace-nowrap"
                  style={{
                    color: activeTab === tab.key ? "#0D0D0D" : "#737373",
                  }}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="flyout-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "#22C55E" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ padding: "16px 20px" }}
            >
              {activeTab === "performance" && (
                <PerformanceTab moduleIndex={moduleIndex} />
              )}
              {activeTab === "thermal" && (
                <ThermalTab moduleIndex={moduleIndex} />
              )}
              {activeTab === "iv-curves" && (
                <IVCurvesTab moduleIndex={moduleIndex} />
              )}
              {activeTab === "supply-chain" && (
                <SupplyChainTab profile={profile} />
              )}
              {activeTab === "warranty" && (
                <WarrantyTab profile={profile} />
              )}
            </div>

            {/* AI Recommendation (sticky bottom) */}
            {showAIRecommendation && alert && (
              <div
                className="shrink-0 px-5 py-3"
                style={{
                  backgroundColor: "#FFFBEB",
                  borderLeft: "3px solid #F59E0B",
                  borderTop: "1px solid #E5E5E5",
                  color: "#451A03",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangleIcon size={14} className="text-[#F59E0B] shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    AI Recommendation
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {renderBoldText(alert.recommendation)}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
