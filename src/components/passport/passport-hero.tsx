"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  MODULE_TECHNOLOGY_LABELS,
  VERIFICATION_STATUS_LABELS,
} from "@/lib/constants";
import { formatWatts, formatDate } from "@/lib/utils";
import type { Passport } from "@/types/passport";
import { CirpassSubmitDialog } from "@/components/passport/cirpass-submit-dialog";
import {
  ShieldCheckIcon,
  ClockIcon,
  FactoryIcon,
  CopyIcon,
  ZapIcon,
  GaugeIcon,
  LeafIcon,
  CalendarIcon,
  GridIcon,
  SendIcon,
} from "lucide-react";

interface PassportHeroProps {
  passport: Passport;
}

const quickStats = (p: Passport) => [
  { label: "Rated Power", value: `${p.rated_power_stc_w ?? "\u2014"}`, unit: "W", icon: ZapIcon },
  { label: "Efficiency", value: `${p.module_efficiency_percent ?? "\u2014"}`, unit: "%", icon: GaugeIcon },
  { label: "Carbon", value: `${p.carbon_footprint_kg_co2e ?? "\u2014"}`, unit: "kg", icon: LeafIcon },
  { label: "Lifetime", value: `${p.expected_lifetime_years ?? "\u2014"}`, unit: "yr", icon: CalendarIcon },
  { label: "Warranty", value: `${p.product_warranty_years ?? "\u2014"}`, unit: "yr", icon: ShieldCheckIcon },
  { label: "Cells", value: `${p.cell_count ?? "\u2014"}`, unit: "", icon: GridIcon },
];

export function PassportHero({ passport }: PassportHeroProps) {
  const stats = quickStats(passport);
  const canonicalUrl = `https://heliotrail.com/passport/${passport.public_id}`;
  const [passportUrl, setPassportUrl] = useState(canonicalUrl);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = window.location.href.split(/\/(?:specs|compliance|circularity|documents|registry)$/)[0];
    setPassportUrl(url);
    QRCode.toDataURL(url, {
      width: 120,
      margin: 1,
      color: { dark: "#0D0D0D", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, []);

  return (
    <div className="border-b border-[#D9D9D9] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top row: badges + passport ID */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-[#22C55E] px-3 py-1.5">
              <span className="inline-flex h-2 w-2 rounded-full bg-white" />
              <span className="text-xs font-semibold text-[#0D0D0D] tracking-wide">
                Active Passport
              </span>
            </div>
            <span className="border border-[#D9D9D9] px-3 py-1 text-xs font-medium text-[#737373]">
              {MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
                passport.module_technology}
            </span>
            <span className="flex items-center gap-1 border border-[#D9D9D9] px-3 py-1 text-xs font-medium text-[#0D0D0D]">
              <ShieldCheckIcon className="h-3 w-3" />
              {VERIFICATION_STATUS_LABELS[passport.verification_status]}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 border border-[#D9D9D9] px-3 py-1.5">
              <span className="font-mono text-xs text-[#737373]">
                {passport.pv_passport_id}
              </span>
              <button
                className="p-0.5 hover:text-[#22C55E] transition-colors"
                onClick={() =>
                  navigator.clipboard.writeText(passport.pv_passport_id)
                }
              >
                <CopyIcon className="h-3 w-3 text-[#737373]" />
              </button>
            </div>
            {passport.status === "published" && (
              <button
                onClick={() => setSubmitOpen(true)}
                className="flex items-center gap-2 bg-[#22C55E] px-3.5 py-1.5 text-xs font-semibold text-[#0D0D0D] hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all"
              >
                <SendIcon className="h-3 w-3" />
                Submit to CIRPASS 2
              </button>
            )}
          </div>
        </div>

        {/* Main content: Title + Verification badge */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-[#0D0D0D] sm:text-4xl lg:text-5xl">
              {passport.model_id}
            </h1>
            <p className="mt-2 text-lg text-[#737373]">
              <span className="font-semibold text-[#0D0D0D]">
                {formatWatts(passport.rated_power_stc_w)}
              </span>
              {" \u00b7 "}
              {passport.manufacturer_name}
            </p>
            <div className="mt-3 flex flex-col gap-1 text-sm text-[#737373]">
              <span className="flex items-center gap-1.5">
                <FactoryIcon className="h-3.5 w-3.5 text-[#737373]" />
                {passport.facility_name ?? "\u2014"}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5 text-[#737373]" />
                Manufactured {formatDate(passport.manufacturing_date)}
              </span>
            </div>
          </div>

          {/* Verified Digital Passport badge */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="border border-[#D9D9D9] p-4 flex flex-col items-center gap-2">
              <ShieldCheckIcon className="h-10 w-10 text-[#22C55E]" />
              <span className="text-[10px] font-semibold text-[#0D0D0D] uppercase tracking-wider">
                Verified DPP
              </span>
              <span className="font-mono text-[10px] text-[#A3A3A3]">
                {passport.pv_passport_id}
              </span>
            </div>
            {qrDataUrl && (
              <div className="flex flex-col items-center gap-1">
                <img src={qrDataUrl} alt="DPP QR Code" width={100} height={100} className="border border-[#D9D9D9]" />
                <span className="text-[9px] font-medium text-[#A3A3A3] uppercase tracking-wider">Scan for DPP</span>
              </div>
            )}
            <span className="text-[10px] font-medium text-[#737373] uppercase tracking-wider">
              Digital Passport
            </span>
          </div>
        </div>

        {/* Quick stats grid — dashed border cards */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="border border-dashed border-[#D9D9D9] px-3.5 py-3 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-[#737373]" />
                  <p className="text-[10px] font-semibold text-[#737373] uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-xl font-bold tabular-nums tracking-tight text-[#0D0D0D]">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-[10px] font-medium text-[#737373] uppercase">
                      {stat.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CIRPASS 2 submit dialog */}
        <CirpassSubmitDialog
          passport={passport}
          open={submitOpen}
          onClose={() => setSubmitOpen(false)}
        />
      </div>
    </div>
  );
}
