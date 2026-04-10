import { createClient } from "@/lib/supabase/server";
import { PASSPORT_STATUS_LABELS } from "@/lib/constants";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileEdit,
  ArrowRight,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { DonutChart } from "@/components/app/dashboard/donut-chart";
import { CarbonChart } from "@/components/app/dashboard/carbon-chart";
import { MaterialChart } from "@/components/app/dashboard/material-chart";
import { DashboardKpis } from "./dashboard-kpis";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: passports }, { data: certificates }, { data: materials }, { data: documents }, { count: supplyChainCount }, { data: circularity }] =
    await Promise.all([
      supabase.from("passports").select("*"),
      supabase.from("passport_certificates").select("*"),
      supabase.from("passport_materials").select("*"),
      supabase.from("passport_documents").select("*"),
      supabase.from("passport_supply_chain_actors").select("*", { count: "exact", head: true }),
      supabase.from("passport_circularity").select("recyclability_rate_percent"),
    ]);

  const all = passports ?? [];
  const certs = certificates ?? [];
  const mats = materials ?? [];
  const docs = documents ?? [];
  const circ = circularity ?? [];
  const hasSupplyChain = (supplyChainCount ?? 0) > 0;

  const published = all.filter((p) => p.status === "published");
  const drafts = all.filter((p) => p.status === "draft");
  const pending = all.filter((p) => p.status === "under_review");
  const recent = [...all]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5);

  // Compliance
  const validCerts = certs.filter((c) => c.status === "valid").length;
  const pendingCerts = certs.filter((c) => c.status === "pending").length;
  const expiredCerts = certs.filter((c) => c.status === "expired").length;
  const complianceScore =
    certs.length > 0 ? Math.round((validCerts / certs.length) * 100) : 0;

  // Carbon
  const carbonData = all
    .filter((p) => p.carbon_footprint_kg_co2e)
    .map((p) => ({
      model: p.model_id as string,
      co2: p.carbon_footprint_kg_co2e as number,
      technology: (p.module_technology as string) ?? "other",
    }));
  const avgCarbon =
    carbonData.length > 0
      ? Math.round(carbonData.reduce((s, d) => s + d.co2, 0) / carbonData.length)
      : 0;

  // Materials — aggregate into segments
  const totalMass = mats.reduce((s, m) => s + (m.mass_g ?? 0), 0);
  const matBuckets: Record<string, number> = {};
  for (const m of mats) {
    const key = (m.component_type ?? "other").toLowerCase();
    const bucket = key.includes("glass") || key.includes("cover")
      ? "Glass"
      : key.includes("frame")
        ? "Aluminium"
        : key.includes("cell") || key.includes("solar")
          ? "Silicon"
          : key.includes("encap")
            ? "Encapsulant"
            : key.includes("ribbon") || key.includes("wire") || key.includes("connector")
              ? "Copper"
              : "Other";
    matBuckets[bucket] = (matBuckets[bucket] ?? 0) + (m.mass_g ?? 0);
  }

  const MATERIAL_COLORS: Record<string, string> = {
    Glass: "#22C55E",
    Aluminium: "#737373",
    Silicon: "#3B82F6",
    Encapsulant: "#F59E0B",
    Copper: "#EF4444",
    Other: "#D9D9D9",
  };

  const materialSegments = Object.entries(matBuckets)
    .map(([name, mass]) => ({
      name,
      percent: totalMass > 0 ? (mass / totalMass) * 100 : 0,
      color: MATERIAL_COLORS[name] ?? "#D9D9D9",
    }))
    .sort((a, b) => b.percent - a.percent);

  // Donut data
  const donutData = [
    { name: "Published", value: published.length, color: "#22C55E" },
    { name: "Under Review", value: pending.length, color: "#F59E0B" },
    { name: "Draft", value: drafts.length, color: "#D9D9D9" },
  ];

  // Evidence completeness
  const passportsWithDocs = new Set(docs.map((d) => d.passport_id)).size;
  const evidencePercent =
    all.length > 0 ? Math.round((passportsWithDocs / all.length) * 100) : 0;

  // Certs expiring in 30 days
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const certsExpiringIn30Days = certs.filter((c) => {
    if (!c.expiry_date || c.status !== "valid") return false;
    const exp = new Date(c.expiry_date);
    return exp >= now && exp <= in30Days;
  }).length;

  // Average recyclability
  const recycRates = circ
    .map((c) => c.recyclability_rate_percent)
    .filter((r): r is number => r != null);
  const avgRecyclability =
    recycRates.length > 0
      ? Math.round(recycRates.reduce((s, r) => s + r, 0) / recycRates.length)
      : 0;

  // KPI data to pass to client component (matches KpiComputeInput)
  const kpiData = {
    total: all.length,
    published: published.length,
    complianceScore,
    avgCarbon,
    materialsCount: mats.length,
    evidencePercent,
    crmCount: mats.filter((m) => m.is_critical_raw_material).length,
    socCount: mats.filter((m) => m.is_substance_of_concern).length,
    validCerts,
    pendingCerts,
    expiredCerts,
    totalCerts: certs.length,
    certsExpiringIn30Days,
    avgRecyclability,
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D]">Dashboard</h1>
          <p className="mt-0.5 text-sm text-[#737373]">
            Roshan — Portfolio Intelligence
          </p>
        </div>
        <Link href="/app/passports/new" className="cta-primary text-sm">
          <Plus className="h-4 w-4" />
          Create Passport
        </Link>
      </div>

      {/* KPI Cards (client component for animations) */}
      <DashboardKpis data={kpiData} />

      {/* Passport Status */}
      <div className="clean-card hover-card p-5">
        <h2 className="text-sm font-bold text-[#0D0D0D]">
          Passport Status
        </h2>
        <p className="text-xs text-[#737373]">
          Distribution across portfolio
        </p>
        <div className="mt-2">
          <DonutChart
            data={donutData}
            centerLabel="passports"
          />
        </div>
      </div>

      {/* Carbon Footprint — full width */}
      <div className="clean-card hover-card p-5">
        <h2 className="text-sm font-bold text-[#0D0D0D]">Carbon Footprint</h2>
        <p className="text-xs text-[#737373]">
          kg CO₂e per module (cradle-to-gate, ISO 14067)
        </p>
        {carbonData.length > 0 ? (
          <div className="mt-2">
            <CarbonChart data={carbonData} />
          </div>
        ) : (
          <div className="flex h-[280px] items-center justify-center text-sm text-[#A3A3A3]">
            No carbon data available
          </div>
        )}
      </div>

      {/* Material Composition */}
      <div className="clean-card hover-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0D0D0D]">
              Material Composition
            </h2>
            <p className="text-xs text-[#737373]">
              Fleet aggregate · {mats.length} materials
            </p>
          </div>
          <div className="flex gap-2">
            {kpiData.crmCount > 0 && (
              <span className="inline-flex items-center gap-1 border border-dashed border-[#F59E0B] bg-[#FEF3C7] px-1.5 py-0.5 text-[0.625rem]">
                <AlertTriangle className="h-2.5 w-2.5 text-[#F59E0B]" />
                {kpiData.crmCount} CRM
              </span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <MaterialChart segments={materialSegments} />
        </div>
      </div>

      {/* Recent + Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="clean-card">
            <div className="flex items-center justify-between border-b border-[#D9D9D9] px-4 py-3">
              <h2 className="text-sm font-bold text-[#0D0D0D]">
                Recent Passports
              </h2>
              <Link
                href="/app/passports"
                className="flex items-center gap-1 text-xs font-medium text-[#737373] hover:text-[#22C55E] transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-[#D9D9D9]">
              {recent.map((p) => (
                <Link
                  key={p.id}
                  href={`/app/passports/${p.id}/overview`}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#FAFAFA]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0D0D0D]">
                      {p.model_id}
                    </p>
                    <p className="font-mono text-xs text-[#A3A3A3]">
                      {p.pv_passport_id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.rated_power_stc_w && (
                      <span className="hidden font-mono text-xs text-[#737373] sm:block">
                        {p.rated_power_stc_w}W
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ${
                        p.status === "published"
                          ? "status-valid"
                          : p.status === "under_review"
                            ? "status-pending"
                            : "bg-[#F2F2F2] text-[#737373]"
                      }`}
                    >
                      {PASSPORT_STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Pending actions */}
          <div className="clean-card">
            <div className="border-b border-[#D9D9D9] px-4 py-3">
              <h2 className="text-sm font-bold text-[#0D0D0D]">
                Pending Actions
              </h2>
            </div>
            <div className="space-y-1 p-3">
              {pending.length > 0 && (
                <Link
                  href="/app/approvals"
                  className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-[#FAFAFA]"
                >
                  <Clock className="h-4 w-4 text-[#F59E0B]" />
                  <span>
                    <strong>{pending.length}</strong> awaiting approval
                  </span>
                </Link>
              )}
              {drafts.length > 0 && (
                <Link
                  href="/app/passports"
                  className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-[#FAFAFA]"
                >
                  <FileEdit className="h-4 w-4 text-[#737373]" />
                  <span>
                    <strong>{drafts.length}</strong> drafts in progress
                  </span>
                </Link>
              )}
              {pending.length === 0 && drafts.length === 0 && (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                  <p className="mt-1 text-xs text-[#737373]">All caught up</p>
                </div>
              )}
            </div>
          </div>

          {/* ESPR readiness */}
          <div className="clean-card p-4">
            <h2 className="text-sm font-bold text-[#0D0D0D]">
              EU ESPR Readiness
            </h2>
            <p className="mt-0.5 text-[0.625rem] text-[#A3A3A3]">
              DPP Registry opens July 2026
            </p>
            <div className="mt-3 space-y-1.5">
              {[
                ["Product Identity", true],
                ["Technical Specs", true],
                ["Material Composition", mats.length > 0],
                ["Carbon Footprint", carbonData.length > 0],
                ["Compliance Certs", validCerts > 0],
                ["Circularity Data", true],
                ["Supply Chain", hasSupplyChain],
                ["Dynamic Data", all.length > 0],
              ].map(([label, ok]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-[#737373]">{label as string}</span>
                  {ok ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-dashed border-[#D9D9D9] pt-3">
              <Link
                href="/app/analytics"
                className="flex items-center gap-1 text-xs font-medium text-[#22C55E] transition-colors hover:text-[#0D0D0D]"
              >
                View Analytics <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
