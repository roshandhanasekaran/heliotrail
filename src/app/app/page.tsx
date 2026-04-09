import { createClient } from "@/lib/supabase/server";
import { PASSPORT_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  FileStack,
  CheckCircle2,
  Clock,
  FileEdit,
  ArrowRight,
  Plus,
  ShieldCheck,
  Leaf,
  TrendingUp,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { StatusChart } from "@/components/app/dashboard/status-chart";
import { CarbonChart } from "@/components/app/dashboard/carbon-chart";
import { MaterialChart } from "@/components/app/dashboard/material-chart";
import { ComplianceGauge } from "@/components/app/dashboard/compliance-gauge";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: passports }, { data: certificates }, { data: materials }] =
    await Promise.all([
      supabase.from("passports").select("*"),
      supabase.from("passport_certificates").select("*"),
      supabase.from("passport_materials").select("*"),
    ]);

  const all = passports ?? [];
  const certs = certificates ?? [];
  const mats = materials ?? [];

  const published = all.filter((p) => p.status === "published");
  const drafts = all.filter((p) => p.status === "draft");
  const pending = all.filter((p) => p.status === "under_review");
  const recent = [...all]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5);

  // Compliance score
  const validCerts = certs.filter((c) => c.status === "valid").length;
  const totalCerts = certs.length;
  const complianceScore = totalCerts > 0 ? Math.round((validCerts / totalCerts) * 100) : 0;

  // Carbon footprint data
  const carbonData = all
    .filter((p) => p.carbon_footprint_kg_co2e)
    .map((p) => ({
      model: p.model_id.replace("WRM-", "").replace("HT-", ""),
      co2: p.carbon_footprint_kg_co2e as number,
    }));
  const avgCarbon =
    carbonData.length > 0
      ? Math.round(carbonData.reduce((s, d) => s + d.co2, 0) / carbonData.length)
      : 0;

  // Material composition (aggregate)
  const totalMass = mats.reduce((s, m) => s + (m.mass_g ?? 0), 0);
  const matGroups: Record<string, number> = {};
  for (const m of mats) {
    const key = m.component_type?.toLowerCase() ?? "other";
    const bucket =
      key.includes("glass") || key.includes("cover")
        ? "glass"
        : key.includes("frame")
          ? "aluminium"
          : key.includes("cell") || key.includes("solar")
            ? "silicon"
            : key.includes("encap")
              ? "encapsulant"
              : key.includes("ribbon") || key.includes("wire") || key.includes("connector")
                ? "copper"
                : "other";
    matGroups[bucket] = (matGroups[bucket] ?? 0) + (m.mass_g ?? 0);
  }
  const materialData = [
    {
      name: "Fleet Avg",
      glass: +((matGroups.glass ?? 0) / totalMass * 100).toFixed(1),
      aluminium: +((matGroups.aluminium ?? 0) / totalMass * 100).toFixed(1),
      silicon: +((matGroups.silicon ?? 0) / totalMass * 100).toFixed(1),
      encapsulant: +((matGroups.encapsulant ?? 0) / totalMass * 100).toFixed(1),
      copper: +((matGroups.copper ?? 0) / totalMass * 100).toFixed(1),
      other: +((matGroups.other ?? 0) / totalMass * 100).toFixed(1),
    },
  ];

  // Status chart data
  const statusData = [
    { name: "Published", value: published.length, color: "#22C55E" },
    { name: "Under Review", value: pending.length, color: "#F59E0B" },
    { name: "Draft", value: drafts.length, color: "#D9D9D9" },
  ];

  // CRM / SoC counts
  const crmCount = mats.filter((m) => m.is_critical_raw_material).length;
  const socCount = mats.filter((m) => m.is_substance_of_concern).length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Waaree Energies Ltd. — Portfolio Intelligence
          </p>
        </div>
        <Link href="/app/passports/new" className="cta-primary text-sm">
          <Plus className="h-4 w-4" />
          Create Passport
        </Link>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          icon={FileStack}
          label="Total Passports"
          value={all.length.toString()}
          sub={`${published.length} published`}
          bg="bg-[#F2F2F2]"
          color="text-[#0D0D0D]"
        />
        <KpiCard
          icon={TrendingUp}
          label="Published Rate"
          value={`${all.length > 0 ? Math.round((published.length / all.length) * 100) : 0}%`}
          sub={`${published.length} of ${all.length}`}
          bg="bg-[#E8FAE9]"
          color="text-[#22C55E]"
        />
        <KpiCard
          icon={ShieldCheck}
          label="Compliance"
          value={`${complianceScore}%`}
          sub={`${validCerts}/${totalCerts} certs valid`}
          bg="bg-[#E8FAE9]"
          color="text-[#22C55E]"
        />
        <KpiCard
          icon={Leaf}
          label="Avg Carbon"
          value={avgCarbon > 0 ? `${avgCarbon}` : "—"}
          sub="kg CO₂e / module"
          bg="bg-[#E8FAE9]"
          color="text-[#22C55E]"
        />
        <KpiCard
          icon={BarChart3}
          label="Materials Tracked"
          value={mats.length.toString()}
          sub={`${crmCount} CRM · ${socCount} SoC`}
          bg="bg-[#FEF3C7]"
          color="text-[#F59E0B]"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Status distribution + Compliance gauge */}
        <div className="clean-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0D0D0D]">
              Passport Status
            </h2>
            <div className="relative">
              <ComplianceGauge score={complianceScore} size={80} label="" />
            </div>
          </div>
          <StatusChart data={statusData} />
          <div className="mt-2 flex items-center gap-4 text-xs text-[#737373]">
            <span>{validCerts} valid certificates</span>
            <span className="text-[#D9D9D9]">·</span>
            <span>
              {certs.filter((c) => c.status === "pending").length} pending
            </span>
            {certs.filter((c) => c.status === "expired").length > 0 && (
              <>
                <span className="text-[#D9D9D9]">·</span>
                <span className="text-[#EF4444]">
                  {certs.filter((c) => c.status === "expired").length} expired
                </span>
              </>
            )}
          </div>
        </div>

        {/* Carbon footprint */}
        <div className="clean-card p-4">
          <h2 className="text-sm font-bold text-[#0D0D0D]">
            Carbon Footprint by Model
          </h2>
          <p className="text-xs text-[#737373]">kg CO₂e (cradle-to-gate)</p>
          {carbonData.length > 0 ? (
            <CarbonChart data={carbonData} />
          ) : (
            <div className="flex h-[220px] items-center justify-center">
              <p className="text-sm text-[#A3A3A3]">
                No carbon data available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Material composition */}
      <div className="clean-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0D0D0D]">
              Fleet Material Composition
            </h2>
            <p className="text-xs text-[#737373]">
              Aggregated across all passports · {mats.length} materials tracked
            </p>
          </div>
          <div className="flex items-center gap-3">
            {crmCount > 0 && (
              <span className="inline-flex items-center gap-1 border border-dashed border-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 text-xs">
                <AlertTriangle className="h-3 w-3 text-[#F59E0B]" />
                {crmCount} CRM
              </span>
            )}
            {socCount > 0 && (
              <span className="inline-flex items-center gap-1 border border-dashed border-red-300 bg-red-50 px-2 py-0.5 text-xs">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                {socCount} SoC
              </span>
            )}
          </div>
        </div>
        <MaterialChart data={materialData} />
      </div>

      {/* Recent + Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="clean-card">
            <div className="flex items-center justify-between border-b border-[#D9D9D9] px-4 py-3">
              <h2 className="text-sm font-bold text-[#0D0D0D]">
                Recent Passports
              </h2>
              <Link
                href="/app/passports"
                className="flex items-center gap-1 text-xs font-medium text-[#737373] hover:text-[#0D0D0D]"
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
                    <p className="font-mono text-xs text-[#737373]">
                      {p.pv_passport_id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.rated_power_stc_w && (
                      <span className="hidden font-mono text-xs font-medium text-[#737373] sm:block">
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
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-[#FAFAFA]"
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
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-[#FAFAFA]"
                >
                  <FileEdit className="h-4 w-4 text-[#737373]" />
                  <span>
                    <strong>{drafts.length}</strong> drafts in progress
                  </span>
                </Link>
              )}
              {pending.length === 0 && drafts.length === 0 && (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle2 className="h-6 w-6 text-[#22C55E]" />
                  <p className="mt-2 text-sm text-[#737373]">All caught up</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick regulatory status */}
          <div className="clean-card p-4">
            <h2 className="text-sm font-bold text-[#0D0D0D]">
              EU ESPR Readiness
            </h2>
            <div className="mt-3 space-y-2">
              {[
                ["Product Identity", true],
                ["Technical Specs", true],
                ["Material Composition", true],
                ["Carbon Footprint", carbonData.length > 0],
                ["Compliance Certs", validCerts > 0],
                ["Circularity Data", true],
                ["Supply Chain", false],
                ["Dynamic Data", false],
              ].map(([label, ok]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-[#737373]">{label as string}</span>
                  {ok ? (
                    <span className="inline-flex h-4 w-4 items-center justify-center bg-[#E8FAE9] text-[9px] font-bold text-[#22C55E]">
                      ✓
                    </span>
                  ) : (
                    <span className="inline-flex h-4 w-4 items-center justify-center bg-[#FEF3C7] text-[9px] font-bold text-[#F59E0B]">
                      ○
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-dashed border-[#D9D9D9] pt-3">
              <Link
                href="/app/analytics"
                className="flex items-center gap-1 text-xs font-medium text-[#22C55E] hover:text-[#0D0D0D]"
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

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  bg,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  bg: string;
  color: string;
}) {
  return (
    <div className="clean-card p-4">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center ${bg}`}>
          <Icon className={`h-3.5 w-3.5 ${color}`} />
        </div>
        <span className="text-xs text-[#737373]">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#0D0D0D]">{value}</p>
      <p className="text-[0.6875rem] text-[#A3A3A3]">{sub}</p>
    </div>
  );
}
