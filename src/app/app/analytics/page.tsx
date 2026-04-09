import { createClient } from "@/lib/supabase/server";
import {
  ShieldCheck,
  Globe,
  Award,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Recycle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [{ data: passports }, { data: certificates }, { data: materials }, { data: circularity }] =
    await Promise.all([
      supabase.from("passports").select("*"),
      supabase.from("passport_certificates").select("*"),
      supabase.from("passport_materials").select("*"),
      supabase.from("passport_circularity").select("*"),
    ]);

  const all = passports ?? [];
  const certs = certificates ?? [];
  const mats = materials ?? [];
  const circ = circularity ?? [];

  const validCerts = certs.filter((c) => c.status === "valid").length;
  const pendingCerts = certs.filter((c) => c.status === "pending").length;
  const expiredCerts = certs.filter((c) => c.status === "expired").length;
  const crmMats = [...new Set(mats.filter((m) => m.is_critical_raw_material).map((m) => m.material_name))];
  const socMats = [...new Set(mats.filter((m) => m.is_substance_of_concern).map((m) => m.material_name))];

  const avgRecyclability = circ.length > 0
    ? Math.round(circ.reduce((s, c) => s + (c.recyclability_rate_percent ?? 0), 0) / circ.length)
    : 0;
  const avgRecycledContent = circ.length > 0
    ? Math.round(circ.reduce((s, c) => s + (c.recycled_content_percent ?? 0), 0) / circ.length)
    : 0;

  // Regulatory readiness checklist
  const checks = [
    { label: "Product Identification (Annex III)", ok: all.length > 0, weight: 12 },
    { label: "Technical Specifications", ok: all.some((p) => p.rated_power_stc_w), weight: 12 },
    { label: "Material Composition (BOM)", ok: mats.length > 0, weight: 15 },
    { label: "Carbon Footprint (ISO 14067)", ok: all.some((p) => p.carbon_footprint_kg_co2e), weight: 15 },
    { label: "Compliance Certificates", ok: validCerts > 0, weight: 12 },
    { label: "Circularity & EoL Data", ok: circ.length > 0, weight: 12 },
    { label: "Supply Chain Due Diligence", ok: false, weight: 10 },
    { label: "Dynamic Performance Data", ok: false, weight: 12 },
  ];
  const readinessScore = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);

  // EU market access
  const markets = [
    { country: "DE", name: "Germany", ready: true },
    { country: "FR", name: "France", ready: true },
    { country: "IT", name: "Italy", ready: true },
    { country: "ES", name: "Spain", ready: true },
    { country: "NL", name: "Netherlands", ready: true },
    { country: "PL", name: "Poland", ready: false },
    { country: "RO", name: "Romania", ready: false },
  ];
  const readyMarkets = markets.filter((m) => m.ready).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D]">
          Portfolio Analytics
        </h1>
        <p className="mt-1 text-sm text-[#737373]">
          Regulatory intelligence, compliance health, and material analytics
        </p>
      </div>

      {/* Top row: Readiness + Market Access */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Regulatory readiness */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D]">
                <ShieldCheck className="h-4 w-4 text-[#22C55E]" />
                EU ESPR Regulatory Readiness
              </h2>
              <p className="mt-0.5 text-xs text-[#737373]">
                DPP Registry opens July 2026 — compliance status
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#22C55E]">
                {readinessScore}%
              </p>
              <p className="text-[0.625rem] text-[#737373]">readiness score</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full bg-[#F2F2F2]">
            <div
              className="h-full bg-[#22C55E] transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {checks.map((check) => (
              <div
                key={check.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-[#737373]">
                  {check.ok ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
                  )}
                  {check.label}
                </span>
                <span className="font-mono text-xs text-[#A3A3A3]">
                  {check.weight}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Market access */}
        <div className="clean-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D]">
            <Globe className="h-4 w-4 text-[#3B82F6]" />
            EU Market Access
          </h2>
          <p className="mt-0.5 text-xs text-[#737373]">
            {readyMarkets} of {markets.length} target markets DPP-ready
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {markets.map((m) => (
              <div
                key={m.country}
                className={`flex flex-col items-center gap-1 border p-3 ${
                  m.ready
                    ? "border-[#22C55E]/20 bg-[#E8FAE9]"
                    : "border-dashed border-[#D9D9D9] bg-[#FAFAFA]"
                }`}
              >
                <span className="text-lg font-bold text-[#0D0D0D]">
                  {m.country}
                </span>
                <span className="text-[0.625rem] text-[#737373]">
                  {m.name}
                </span>
                {m.ready ? (
                  <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-dashed border-[#D9D9D9] pt-3 text-xs text-[#737373]">
            Compliance with EU ESPR and local DPP requirements. Supply chain
            and dynamic data needed for remaining markets.
          </div>
        </div>
      </div>

      {/* Certificate health */}
      <div className="clean-card p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D]">
          <Award className="h-4 w-4 text-[#22C55E]" />
          Certificate Health
        </h2>
        <p className="mt-0.5 text-xs text-[#737373]">
          {certs.length} certificates across {all.length} passports
        </p>

        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#E8FAE9] flex items-center justify-center">
              <span className="text-sm font-bold text-[#22C55E]">{validCerts}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#0D0D0D]">Valid</p>
              <p className="text-[0.625rem] text-[#737373]">Compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#FEF3C7] flex items-center justify-center">
              <span className="text-sm font-bold text-[#F59E0B]">{pendingCerts}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#0D0D0D]">Pending</p>
              <p className="text-[0.625rem] text-[#737373]">Under review</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-red-50 flex items-center justify-center">
              <span className="text-sm font-bold text-red-500">{expiredCerts}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#0D0D0D]">Expired</p>
              <p className="text-[0.625rem] text-[#737373]">Needs renewal</p>
            </div>
          </div>
        </div>

        {/* Certificate progress bar */}
        <div className="mt-4 flex h-3 w-full overflow-hidden">
          <div
            className="bg-[#22C55E]"
            style={{ width: `${(validCerts / certs.length) * 100}%` }}
          />
          <div
            className="bg-[#F59E0B]"
            style={{ width: `${(pendingCerts / certs.length) * 100}%` }}
          />
          <div
            className="bg-[#EF4444]"
            style={{ width: `${(expiredCerts / certs.length) * 100}%` }}
          />
          <div className="flex-1 bg-[#F2F2F2]" />
        </div>
      </div>

      {/* Material intelligence + Circularity */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Material intelligence */}
        <div className="clean-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D]">
            <Layers className="h-4 w-4 text-[#3B82F6]" />
            Material Intelligence
          </h2>
          <p className="mt-0.5 text-xs text-[#737373]">
            EU Critical Raw Materials Act 2024 compliance
          </p>

          <div className="mt-4 space-y-3">
            <div className="passport-table">
              <div className="passport-table-header">
                <span>Critical Raw Materials (CRM)</span>
                <span className="font-mono">{crmMats.length}</span>
              </div>
              {crmMats.length > 0 ? (
                crmMats.map((name) => (
                  <div key={name} className="passport-table-row">
                    <span className="table-label flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-[#F59E0B]" />
                      {name}
                    </span>
                    <span className="table-value text-xs text-[#F59E0B]">
                      CRM Listed
                    </span>
                  </div>
                ))
              ) : (
                <div className="passport-table-row">
                  <span className="table-label text-[#A3A3A3]">
                    No critical raw materials
                  </span>
                </div>
              )}
            </div>

            <div className="passport-table">
              <div className="passport-table-header">
                <span>Substances of Concern (SoC)</span>
                <span className="font-mono">{socMats.length}</span>
              </div>
              {socMats.length > 0 ? (
                socMats.map((name) => (
                  <div key={name} className="passport-table-row">
                    <span className="table-label flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      {name}
                    </span>
                    <span className="table-value text-xs text-red-500">
                      REACH SVHC
                    </span>
                  </div>
                ))
              ) : (
                <div className="passport-table-row">
                  <span className="table-label text-[#A3A3A3]">
                    No substances of concern
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Circularity */}
        <div className="clean-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D]">
            <Recycle className="h-4 w-4 text-[#22C55E]" />
            Circularity Intelligence
          </h2>
          <p className="mt-0.5 text-xs text-[#737373]">
            Fleet-level circular economy metrics
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <CircularityMetric
              label="Avg Recyclability"
              value={`${avgRecyclability}%`}
              target="Target: >85%"
              ok={avgRecyclability >= 85}
            />
            <CircularityMetric
              label="Avg Recycled Content"
              value={`${avgRecycledContent}%`}
              target="Target: >15%"
              ok={avgRecycledContent >= 15}
            />
            <CircularityMetric
              label="Passports with EoL"
              value={`${circ.length}/${all.length}`}
              target="All passports"
              ok={circ.length === all.length}
            />
            <CircularityMetric
              label="WEEE Compliant"
              value={`${circ.filter((c) => c.collection_scheme).length}`}
              target="EU WEEE required"
              ok={circ.filter((c) => c.collection_scheme).length > 0}
            />
          </div>

          {/* Recovery materials */}
          <div className="mt-4 border-t border-dashed border-[#D9D9D9] pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
              Recovery Capabilities
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Aluminium", "Glass", "Silicon", "Copper", "Silver"].map(
                (mat) => (
                  <span
                    key={mat}
                    className="inline-flex items-center gap-1 bg-[#E8FAE9] px-2 py-0.5 text-xs font-medium text-[#22C55E]"
                  >
                    <Recycle className="h-3 w-3" />
                    {mat}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Carbon footprint analysis */}
      <div className="clean-card p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D]">
          <Leaf className="h-4 w-4 text-[#22C55E]" />
          Carbon Footprint Analysis
        </h2>
        <p className="mt-0.5 text-xs text-[#737373]">
          Per ISO 14067:2018 cradle-to-gate methodology
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {all
            .filter((p) => p.carbon_footprint_kg_co2e)
            .map((p) => (
              <div key={p.id} className="dashed-card p-3">
                <p className="text-xs font-medium text-[#737373]">
                  {p.model_id}
                </p>
                <p className="mt-1 text-xl font-bold text-[#0D0D0D]">
                  {p.carbon_footprint_kg_co2e}
                  <span className="ml-1 text-xs font-normal text-[#737373]">
                    kg CO₂e
                  </span>
                </p>
                <p className="text-[0.625rem] text-[#A3A3A3]">
                  {p.carbon_footprint_methodology}
                </p>
              </div>
            ))}
          {all.filter((p) => !p.carbon_footprint_kg_co2e).length > 0 && (
            <div className="dashed-card flex flex-col items-center justify-center p-3 text-center">
              <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
              <p className="mt-1 text-xs text-[#737373]">
                {all.filter((p) => !p.carbon_footprint_kg_co2e).length} passports
                missing carbon data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CircularityMetric({
  label,
  value,
  target,
  ok,
}: {
  label: string;
  value: string;
  target: string;
  ok: boolean;
}) {
  return (
    <div className="border border-dashed border-[#D9D9D9] p-3">
      <p className="text-xs text-[#737373]">{label}</p>
      <p className="mt-1 text-xl font-bold text-[#0D0D0D]">{value}</p>
      <div className="mt-1 flex items-center gap-1">
        {ok ? (
          <CheckCircle2 className="h-3 w-3 text-[#22C55E]" />
        ) : (
          <AlertTriangle className="h-3 w-3 text-[#F59E0B]" />
        )}
        <span className="text-[0.625rem] text-[#A3A3A3]">{target}</span>
      </div>
    </div>
  );
}
