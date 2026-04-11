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
  { label: "Carbon", value: `${p.carbon_footprint_kg_co2e ?? "\u2014"}`, unit: "kg CO\u2082e", icon: LeafIcon },
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
    const url = `${window.location.origin}/passport/${passport.public_id}`;
    setPassportUrl(url);
    QRCode.toDataURL(url, {
      width: 120,
      margin: 1,
      color: { dark: "#0D0D0D", light: "#FFFFFF" },
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [passport.public_id]);

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top row: badges + passport ID */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-primary px-3 py-1.5">
              <span className="inline-flex h-2 w-2 rounded-full bg-background" />
              <span className="text-xs font-semibold text-foreground tracking-wide">
                Active Passport
              </span>
            </div>
            <span className="border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
                passport.module_technology}
            </span>
            <span className="flex items-center gap-1 border border-border px-3 py-1 text-xs font-medium text-foreground">
              <ShieldCheckIcon className="h-3 w-3" />
              {VERIFICATION_STATUS_LABELS[passport.verification_status]}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 border border-border px-3 py-1.5">
              <span className="font-mono text-xs text-muted-foreground">
                {passport.pv_passport_id}
              </span>
              <button
                className="p-0.5 hover:text-primary transition-colors"
                onClick={() =>
                  navigator.clipboard.writeText(passport.pv_passport_id)
                }
              >
                <CopyIcon className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            {passport.status === "published" && (
              <button
                onClick={() => setSubmitOpen(true)}
                className="flex items-center gap-2 bg-primary px-3.5 py-1.5 text-xs font-semibold text-foreground hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all"
              >
                <SendIcon className="h-3 w-3" />
                Submit to CIRPASS 2
              </button>
            )}
          </div>
        </div>

        {/* Main content: Title + Floating Panel + Verification */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* Left: Title & Details */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {passport.model_id}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              <span className="font-semibold text-foreground">
                {formatWatts(passport.rated_power_stc_w)}
              </span>
              {" \u00b7 "}
              {passport.manufacturer_name}
            </p>
            <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FactoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {passport.facility_name ?? "\u2014"}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Manufactured {formatDate(passport.manufacturing_date)}
              </span>
            </div>

            {/* Verified badge + QR — below text on lg */}
            <div className="mt-6 flex items-center gap-4">
              <div className="border border-border px-4 py-3 flex items-center gap-3">
                <ShieldCheckIcon className="h-7 w-7 text-primary" />
                <div>
                  <span className="block text-[10px] font-semibold text-foreground uppercase tracking-wider">
                    Verified DPP
                  </span>
                  <span className="block font-mono text-[10px] text-muted-foreground/70">
                    {passport.pv_passport_id}
                  </span>
                </div>
              </div>
              {qrDataUrl && (
                <div className="flex flex-col items-center gap-1">
                  <img src={qrDataUrl} alt="DPP QR Code" width={72} height={72} className="border border-border" />
                  <span className="text-[8px] font-medium text-muted-foreground/70 uppercase tracking-wider">Scan for DPP</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Photorealistic Solar Panel */}
          <div className="relative shrink-0 w-full md:w-[320px] lg:w-[380px] mx-auto md:mx-0">
            <div className="relative transition-all duration-700 ease-out hover:scale-[1.02] hover:-translate-y-1">
              <img
                src="/solar-panel-hero.png"
                alt={`${passport.model_id} solar panel`}
                width={1152}
                height={576}
                className="w-full h-auto select-none pointer-events-none drop-shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Quick stats grid — dashed border cards */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="border border-dashed border-border px-3.5 py-3 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-xl font-bold tabular-nums tracking-tight text-foreground">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
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
