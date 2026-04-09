"use client";

import {
  Zap,
  Battery,
  Thermometer,
  Sun,
  Clock,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { PowerChart } from "@/components/app/passports/dynamic/power-chart";
import { DegradationChart } from "@/components/app/passports/dynamic/degradation-chart";

// Demo SCADA data — 30 days of realistic power output
function generatePowerData() {
  const data = [];
  const base = 480;
  for (let i = 30; i >= 1; i--) {
    const day = `Mar ${31 - i}`;
    const weather = Math.random();
    const power =
      weather > 0.85
        ? base * (0.3 + Math.random() * 0.2) // cloudy
        : weather > 0.7
          ? base * (0.5 + Math.random() * 0.2) // partly cloudy
          : base * (0.75 + Math.random() * 0.2); // sunny
    data.push({ day, power: Math.round(power) });
  }
  return data;
}

// Degradation curve — 30 year projection
function generateDegradationData() {
  const data = [];
  let retention = 100;
  for (let year = 0; year <= 30; year++) {
    data.push({ year, retention: +retention.toFixed(1) });
    if (year === 0) retention -= 1.0; // first year
    else retention -= 0.4; // linear after
  }
  return data;
}

const powerData = generatePowerData();
const degradationData = generateDegradationData();

const snapshots = [
  {
    icon: Zap,
    label: "Active Power",
    value: "485 W",
    sub: "87% of rated capacity",
    color: "text-[#22C55E]",
    bg: "bg-[#E8FAE9]",
  },
  {
    icon: Battery,
    label: "Lifetime Energy",
    value: "1,247 kWh",
    sub: "Since Jan 2026",
    color: "text-[#3B82F6]",
    bg: "bg-[#DBEAFE]",
  },
  {
    icon: Thermometer,
    label: "Module Temp",
    value: "42.3°C",
    sub: "Within normal range",
    color: "text-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
  },
  {
    icon: Sun,
    label: "Irradiance",
    value: "892 W/m²",
    sub: "Clear sky conditions",
    color: "text-[#22C55E]",
    bg: "bg-[#E8FAE9]",
  },
  {
    icon: Clock,
    label: "Operating Hours",
    value: "2,580 h",
    sub: "97.2% availability",
    color: "text-[#0D0D0D]",
    bg: "bg-[#F2F2F2]",
  },
];

export default function DynamicDataPage() {
  return (
    <div className="space-y-6">
      {/* Header with live status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0D0D0D]">Dynamic Data</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 bg-[#22C55E]" />
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-[#22C55E]">
            <Wifi className="h-3 w-3" />
            Waaree SCADA · Live
          </span>
        </div>
      </div>

      {/* Snapshot cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {snapshots.map((s) => (
          <div key={s.label} className="clean-card p-3">
            <div className="flex items-center gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center ${s.bg}`}
              >
                <s.icon className={`h-3 w-3 ${s.color}`} />
              </div>
              <span className="text-[0.6875rem] text-[#737373]">
                {s.label}
              </span>
            </div>
            <p className="mt-1.5 font-mono text-lg font-bold text-[#0D0D0D]">
              {s.value}
            </p>
            <p className="text-[0.625rem] text-[#A3A3A3]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Power output chart */}
      <div className="clean-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0D0D0D]">
              Power Output — Last 30 Days
            </h3>
            <p className="text-xs text-[#737373]">
              Daily average active power (W)
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#A3A3A3]">
            <Clock className="h-3 w-3" />
            Updated 5 min ago
          </div>
        </div>
        <div className="mt-2">
          <PowerChart data={powerData} />
        </div>
      </div>

      {/* Degradation + Data quality */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="clean-card p-4">
          <h3 className="text-sm font-bold text-[#0D0D0D]">
            Performance Degradation
          </h3>
          <p className="text-xs text-[#737373]">
            30-year power retention projection
          </p>
          <div className="mt-2">
            <DegradationChart
              data={degradationData}
              warrantyPercent={87.4}
            />
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-[#22C55E]">
              <span className="h-0.5 w-4 bg-[#22C55E]" /> Projected
            </span>
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <span className="h-0.5 w-4 border-t-2 border-dashed border-[#F59E0B]" />{" "}
              Warranty
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Data quality */}
          <div className="clean-card p-4">
            <h3 className="text-sm font-bold text-[#0D0D0D]">Data Quality</h3>
            <div className="mt-3 space-y-2.5">
              {[
                {
                  label: "Freshness",
                  value: "5 min ago",
                  icon: CheckCircle2,
                  ok: true,
                },
                {
                  label: "Completeness",
                  value: "94%",
                  icon: CheckCircle2,
                  ok: true,
                },
                {
                  label: "Source",
                  value: "SCADA v2.1",
                  icon: Wifi,
                  ok: true,
                },
                {
                  label: "Anomalies",
                  value: "0 active",
                  icon: CheckCircle2,
                  ok: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-sm text-[#737373]">
                    <item.icon
                      className={`h-3.5 w-3.5 ${item.ok ? "text-[#22C55E]" : "text-[#F59E0B]"}`}
                    />
                    {item.label}
                  </span>
                  <span className="font-mono text-sm font-medium text-[#0D0D0D]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly log */}
          <div className="dashed-card p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#22C55E]" />
              <h3 className="text-sm font-bold text-[#0D0D0D]">
                Anomaly Log
              </h3>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-[#737373]">
              <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
              No anomalies detected
            </div>
            <p className="mt-1 text-xs text-[#A3A3A3]">
              Last checked 5 min ago · Monitoring power output, temperature,
              and degradation patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
