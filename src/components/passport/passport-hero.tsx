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

        {/* Main content: Title + Floating Panel + Verification */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          {/* Left: Title & Details */}
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

            {/* Verified badge + QR — below text on lg */}
            <div className="mt-6 flex items-center gap-4">
              <div className="border border-[#D9D9D9] px-4 py-3 flex items-center gap-3">
                <ShieldCheckIcon className="h-7 w-7 text-[#22C55E]" />
                <div>
                  <span className="block text-[10px] font-semibold text-[#0D0D0D] uppercase tracking-wider">
                    Verified DPP
                  </span>
                  <span className="block font-mono text-[10px] text-[#A3A3A3]">
                    {passport.pv_passport_id}
                  </span>
                </div>
              </div>
              {qrDataUrl && (
                <div className="flex flex-col items-center gap-1">
                  <img src={qrDataUrl} alt="DPP QR Code" width={72} height={72} className="border border-[#D9D9D9]" />
                  <span className="text-[8px] font-medium text-[#A3A3A3] uppercase tracking-wider">Scan for DPP</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Premium Floating Solar Panel */}
          <div className="relative shrink-0 w-full max-w-[240px] mx-auto lg:mx-0 lg:mt-0 -mt-2">
            {/* Ambient glow beneath */}
            <div className="absolute inset-x-6 -bottom-3 h-12 bg-gradient-to-t from-black/8 to-transparent blur-2xl" />
            <div
              className="relative transition-all duration-700 ease-out hover:scale-[1.03] hover:-translate-y-1"
              style={{
                transform: "perspective(900px) rotateY(-5deg) rotateX(3deg)",
                filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.18)) drop-shadow(0 12px 24px rgba(0,0,0,0.08))",
              }}
            >
              <svg viewBox="0 0 320 420" className="w-full">
                <defs>
                  {/* Cell crystalline texture gradient */}
                  <linearGradient id="cell-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1a1a2e" />
                    <stop offset="30%" stopColor="#16213e" />
                    <stop offset="60%" stopColor="#0f1a2b" />
                    <stop offset="100%" stopColor="#1a1a2e" />
                  </linearGradient>
                  {/* Frame gradient — brushed anodized dark aluminum */}
                  <linearGradient id="frame-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a3a3a" />
                    <stop offset="15%" stopColor="#2a2a2a" />
                    <stop offset="50%" stopColor="#1f1f1f" />
                    <stop offset="85%" stopColor="#2a2a2a" />
                    <stop offset="100%" stopColor="#333333" />
                  </linearGradient>
                  {/* Frame inner bevel highlight */}
                  <linearGradient id="bevel-top" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  {/* Glass specular reflection — diagonal studio light */}
                  <linearGradient id="glass-specular" x1="0" y1="0" x2="0.6" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="0.18" />
                    <stop offset="25%" stopColor="white" stopOpacity="0.06" />
                    <stop offset="50%" stopColor="white" stopOpacity="0" />
                    <stop offset="75%" stopColor="white" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  {/* Animated light sweep */}
                  <linearGradient id="light-sweep" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="42%" stopColor="white" stopOpacity="0" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.08" />
                    <stop offset="58%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      values="-1.5 -1.5; 1.5 1.5"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </linearGradient>
                  {/* Busbar metallic */}
                  <linearGradient id="busbar-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C0C0C0" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#E8E8E8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#C0C0C0" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Outer frame — dark anodized aluminum */}
                <rect x="14" y="24" width="292" height="382" rx="4" fill="url(#frame-grad)" />
                {/* Frame top bevel highlight */}
                <rect x="14" y="24" width="292" height="6" rx="4" fill="url(#bevel-top)" />
                {/* Frame inner edge */}
                <rect x="18" y="28" width="284" height="374" rx="2" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.08" />

                {/* Glass surface over cells */}
                <rect x="26" y="36" width="268" height="358" rx="1" fill="#0c0f18" />

                {/* Solar cells grid — deep obsidian crystalline */}
                {Array.from({ length: 8 }).map((_, row) =>
                  Array.from({ length: 5 }).map((_, col) => {
                    const x = 32 + col * 52;
                    const y = 42 + row * 43;
                    return (
                      <g key={`cell-${row}-${col}`}>
                        {/* Cell body */}
                        <rect x={x} y={y} width="46" height="37" rx="0.5" fill="url(#cell-grad)" />
                        {/* Micro crystalline texture lines */}
                        <line x1={x + 2} y1={y + 9} x2={x + 44} y2={y + 9} stroke="white" strokeWidth="0.15" strokeOpacity="0.06" />
                        <line x1={x + 2} y1={y + 18.5} x2={x + 44} y2={y + 18.5} stroke="white" strokeWidth="0.15" strokeOpacity="0.06" />
                        <line x1={x + 2} y1={y + 28} x2={x + 44} y2={y + 28} stroke="white" strokeWidth="0.15" strokeOpacity="0.06" />
                        {/* Cell-to-cell gap glow */}
                        <rect x={x} y={y} width="46" height="37" rx="0.5" fill="none" stroke="#0a0e1a" strokeWidth="0.8" />
                      </g>
                    );
                  })
                )}

                {/* Silver busbars — vertical ribbons */}
                {Array.from({ length: 5 }).map((_, col) => (
                  <g key={`vbus-${col}`}>
                    <line
                      x1={32 + col * 52 + 11} y1={42}
                      x2={32 + col * 52 + 11} y2={42 + 8 * 43 - 6}
                      stroke="url(#busbar-grad)" strokeWidth="0.6"
                    />
                    <line
                      x1={32 + col * 52 + 23} y1={42}
                      x2={32 + col * 52 + 23} y2={42 + 8 * 43 - 6}
                      stroke="url(#busbar-grad)" strokeWidth="0.6"
                    />
                    <line
                      x1={32 + col * 52 + 35} y1={42}
                      x2={32 + col * 52 + 35} y2={42 + 8 * 43 - 6}
                      stroke="url(#busbar-grad)" strokeWidth="0.6"
                    />
                  </g>
                ))}

                {/* Glass specular reflection overlay */}
                <rect x="26" y="36" width="268" height="358" rx="1" fill="url(#glass-specular)" />

                {/* Animated light sweep */}
                <rect x="26" y="36" width="268" height="358" rx="1" fill="url(#light-sweep)" />

                {/* Edge highlight — bottom right specular from studio light */}
                <line x1="294" y1="200" x2="294" y2="394" stroke="white" strokeWidth="0.4" strokeOpacity="0.06" />

                {/* Junction box — dark matching frame */}
                <rect x="132" y="10" width="56" height="16" rx="3" fill="#2a2a2a" stroke="#444" strokeWidth="0.5" />
                <text x="160" y="21" textAnchor="middle" fill="#888" fontSize="5" fontFamily="monospace" letterSpacing="1">J-BOX</text>

                {/* Cables — red (+) and blue (−) */}
                <line x1="150" y1="10" x2="150" y2="0" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="170" y1="10" x2="170" y2="0" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

                {/* Mounting holes — industrial steel */}
                {[[22, 32], [298, 32], [22, 398], [298, 398]].map(([cx, cy], i) => (
                  <g key={`mount-${i}`}>
                    <circle cx={cx} cy={cy} r="4" fill="#1a1a1a" stroke="#444" strokeWidth="0.6" />
                    <circle cx={cx} cy={cy} r="1.8" fill="#555" />
                    <circle cx={cx} cy={cy} r="0.8" fill="#888" />
                  </g>
                ))}

                {/* Model ID on frame bottom */}
                <text
                  x="160" y="414"
                  textAnchor="middle"
                  fill="#666"
                  fontSize="6"
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing="2"
                >
                  {passport.model_id}
                </text>
              </svg>
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
