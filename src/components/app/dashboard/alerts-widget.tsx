"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const UNDERPERFORMERS = [
  { model: "WRM-600-LOT-07", pr: 72.1, delta: -10.3 },
  { model: "HT-555-BF-03", pr: 76.8, delta: -5.6 },
  { model: "WRM-580-LOT-12", pr: 78.4, delta: -4.0 },
];

export function AlertsWidget() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#0D0D0D]">
            Active Alerts
          </h2>
          <p className="text-xs text-[#737373]">
            Modules below expected performance
          </p>
        </div>
        <div className="flex items-center gap-1 border border-[#F59E0B] bg-[#FEF3C7] px-2 py-1">
          <AlertTriangle className="h-3 w-3 text-[#F59E0B]" />
          <span className="font-mono text-xs font-bold text-[#F59E0B]">
            {UNDERPERFORMERS.length}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-0">
        {UNDERPERFORMERS.map((module) => (
          <Link
            key={module.model}
            href="/app/passports"
            className="flex items-center justify-between border-b border-[#F2F2F2] py-2.5 transition-colors hover:bg-[#FAFAFA] last:border-0"
          >
            <div>
              <p className="font-mono text-xs font-medium text-[#0D0D0D]">
                {module.model}
              </p>
              <p className="text-[10px] text-[#A3A3A3]">
                PR: {module.pr}%
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#EF4444]">
              {module.delta}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
