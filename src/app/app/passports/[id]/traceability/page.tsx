import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Route,
  Factory,
  MapPin,
  Globe,
  CheckCircle2,
  ArrowRight,
  Package,
  Truck,
  Cpu,
  Layers,
  Gem,
} from "lucide-react";

export default async function TraceabilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase
    .from("passports")
    .select("*")
    .eq("id", id)
    .single();

  if (!p) notFound();

  // Supply chain stages (demo data based on typical PV module production)
  const stages = [
    {
      icon: Gem,
      label: "Polysilicon",
      supplier: "Wacker Chemie AG",
      location: "Burghausen, Germany",
      country: "DE",
      status: "verified" as const,
      detail: "Electronic-grade polysilicon (9N purity)",
    },
    {
      icon: Layers,
      label: "Wafer",
      supplier: "LONGi Green Energy",
      location: "Xi'an, China",
      country: "CN",
      status: "verified" as const,
      detail: "M10 (182mm) N-Type monocrystalline wafer",
    },
    {
      icon: Cpu,
      label: "Cell",
      supplier: "Waaree Cell Division",
      location: "Chikhli, Gujarat, India",
      country: "IN",
      status: "verified" as const,
      detail: "TOPCon bifacial cell, 24.5% cell efficiency",
    },
    {
      icon: Factory,
      label: "Module Assembly",
      supplier: p.manufacturer_name,
      location: p.facility_location ?? "Surat, Gujarat, India",
      country: "IN",
      status: "verified" as const,
      detail: `${p.model_id} — ${p.rated_power_stc_w}W module`,
    },
    {
      icon: Truck,
      label: "Distribution",
      supplier: "Waaree Logistics",
      location: "Mundra Port, Gujarat, India",
      country: "IN",
      status: "pending" as const,
      detail: "Export-ready, EU market",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#0D0D0D]">
        Supply Chain Traceability
      </h2>

      {/* Supply chain flow */}
      <div className="clean-card p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
          <Route className="h-3.5 w-3.5" />
          Value Chain — Polysilicon to Module
        </div>

        <div className="mt-5 space-y-0">
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                    stage.status === "verified"
                      ? "bg-[#E8FAE9]"
                      : "bg-[#FEF3C7]"
                  }`}
                >
                  <stage.icon
                    className={`h-5 w-5 ${
                      stage.status === "verified"
                        ? "text-[#22C55E]"
                        : "text-[#F59E0B]"
                    }`}
                  />
                </div>
                {i < stages.length - 1 && (
                  <div className="h-12 w-px bg-[#D9D9D9]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#0D0D0D]">
                    {stage.label}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[0.625rem] font-semibold ${
                      stage.status === "verified"
                        ? "status-valid"
                        : "status-pending"
                    }`}
                  >
                    {stage.status === "verified" ? "Verified" : "Pending"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-[#0D0D0D]">
                  {stage.supplier}
                </p>
                <p className="flex items-center gap-1 text-xs text-[#737373]">
                  <MapPin className="h-3 w-3" />
                  {stage.location}
                  <span className="ml-1 inline-flex items-center bg-[#F2F2F2] px-1 py-0.5 text-[0.625rem] font-bold">
                    {stage.country}
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#A3A3A3]">{stage.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manufacturer card */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="clean-card p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
            <Factory className="h-3.5 w-3.5" />
            Manufacturer
          </div>
          <p className="mt-2 text-sm font-bold text-[#0D0D0D]">
            {p.manufacturer_name}
          </p>
          {p.manufacturer_address && (
            <p className="mt-1 flex items-center gap-1 text-xs text-[#737373]">
              <MapPin className="h-3 w-3" />
              {p.manufacturer_address}
            </p>
          )}
          {p.manufacturer_country && (
            <p className="mt-1 flex items-center gap-1 text-xs text-[#737373]">
              <Globe className="h-3 w-3" />
              {p.manufacturer_country}
            </p>
          )}
          {p.manufacturer_operator_id && (
            <p className="mt-2 font-mono text-xs text-[#A3A3A3]">
              Operator ID: {p.manufacturer_operator_id}
            </p>
          )}
        </div>

        {p.facility_name && (
          <div className="clean-card p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
              <Factory className="h-3.5 w-3.5" />
              Manufacturing Facility
            </div>
            <p className="mt-2 text-sm font-bold text-[#0D0D0D]">
              {p.facility_name}
            </p>
            {p.facility_location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-[#737373]">
                <MapPin className="h-3 w-3" />
                {p.facility_location}
              </p>
            )}
            {p.facility_id && (
              <p className="mt-2 font-mono text-xs text-[#A3A3A3]">
                Facility ID: {p.facility_id}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Due diligence note */}
      <div className="dashed-card p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#737373]">
          <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
          Due Diligence Status
        </div>
        <p className="mt-2 text-sm text-[#737373]">
          Supply chain due diligence conducted per EU Regulation 2024/1252.
          Polysilicon sourced from non-conflict region (Germany). Cell
          manufacturing in-house (India). No UFLPA-flagged entities in supply
          chain.
        </p>
      </div>
    </div>
  );
}
