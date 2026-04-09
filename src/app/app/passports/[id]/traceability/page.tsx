import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { PassportSupplyChainActor } from "@/types/passport";
import {
  Route,
  Factory,
  MapPin,
  Globe,
  CheckCircle2,
  Truck,
  Cpu,
  Layers,
  Gem,
  Mountain,
  type LucideIcon,
} from "lucide-react";

/** Map tier_level to an icon. Higher tier = earlier in raw-material chain. */
function iconForTier(tier: number | null): LucideIcon {
  switch (tier) {
    case 5:
      return Mountain; // Quartz Mining
    case 4:
      return Gem; // Polysilicon
    case 3:
      return Layers; // Wafer
    case 2:
      return Cpu; // Cell
    case 1:
      return Factory; // Module Assembly
    default:
      return Truck;
  }
}

export default async function TraceabilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: p }, { data: actors }] = await Promise.all([
    supabase.from("passports").select("*").eq("id", id).single(),
    supabase
      .from("passport_supply_chain_actors")
      .select("*")
      .eq("passport_id", id)
      .order("tier_level", { ascending: false }),
  ]);

  if (!p) notFound();

  const scActors = (actors ?? []) as PassportSupplyChainActor[];

  // Determine UFLPA compliance summary
  const allUflpaCompliant =
    scActors.length > 0 && scActors.every((a) => a.uflpa_compliant);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#0D0D0D]">
        Supply Chain Traceability
      </h2>

      {/* Supply chain flow */}
      <div className="clean-card p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
          <Route className="h-3.5 w-3.5" />
          Value Chain — Raw Materials to Module
        </div>

        {scActors.length === 0 ? (
          <p className="mt-4 text-sm text-[#A3A3A3]">
            No supply chain data recorded yet.
          </p>
        ) : (
          <div className="mt-5 space-y-0">
            {scActors.map((actor, i) => {
              const Icon = iconForTier(actor.tier_level);
              const isVerified = actor.audit_date !== null;
              return (
                <div key={actor.id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                        isVerified ? "bg-[#E8FAE9]" : "bg-[#FEF3C7]"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isVerified ? "text-[#22C55E]" : "text-[#F59E0B]"
                        }`}
                      />
                    </div>
                    {i < scActors.length - 1 && (
                      <div className="h-12 w-px bg-[#D9D9D9]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0D0D0D]">
                        {actor.stage ?? actor.actor_role}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-[0.625rem] font-semibold ${
                          isVerified ? "status-valid" : "status-pending"
                        }`}
                      >
                        {isVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-[#0D0D0D]">
                      {actor.actor_name}
                    </p>
                    {(actor.facility_location || actor.country) && (
                      <p className="flex items-center gap-1 text-xs text-[#737373]">
                        <MapPin className="h-3 w-3" />
                        {actor.facility_location ?? actor.country}
                        {actor.country && (
                          <span className="ml-1 inline-flex items-center bg-[#F2F2F2] px-1 py-0.5 text-[0.625rem] font-bold">
                            {actor.country}
                          </span>
                        )}
                      </p>
                    )}
                    {actor.certifications && actor.certifications.length > 0 && (
                      <p className="mt-1 text-xs text-[#A3A3A3]">
                        {actor.certifications.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
          {allUflpaCompliant
            ? " All supply chain actors are UFLPA-compliant. No flagged entities in supply chain."
            : scActors.length > 0
              ? " UFLPA compliance review in progress for some supply chain actors."
              : " Supply chain data pending entry."}
        </p>
      </div>
    </div>
  );
}
