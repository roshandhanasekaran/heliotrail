import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import type {
  PassportSupplyChainActor,
  PassportChainOfCustody,
  PassportSubstanceOfConcern,
} from "@/types/passport";
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
  ArrowRight,
  FileCheck,
  FlaskConical,
  AlertTriangle,
  ShieldCheck,
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

  const [{ data: p }, { data: actors }, { data: custody }, { data: substances }] = await Promise.all([
    supabase.from("passports").select("*").eq("id", id).single(),
    supabase
      .from("passport_supply_chain_actors")
      .select("*")
      .eq("passport_id", id)
      .order("tier_level", { ascending: false }),
    supabase
      .from("passport_chain_of_custody")
      .select("*")
      .eq("passport_id", id)
      .order("event_timestamp", { ascending: true }),
    supabase
      .from("passport_substances_of_concern")
      .select("*")
      .eq("passport_id", id)
      .order("concentration_percent", { ascending: false }),
  ]);

  if (!p) notFound();

  const scActors = (actors ?? []) as PassportSupplyChainActor[];
  const cocEvents = (custody ?? []) as PassportChainOfCustody[];
  const socEntries = (substances ?? []) as PassportSubstanceOfConcern[];

  // Determine UFLPA compliance summary
  const allUflpaCompliant =
    scActors.length > 0 && scActors.every((a) => a.uflpa_compliant);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">
        Supply Chain Traceability
      </h2>

      {/* Supply chain flow */}
      <div className="clean-card p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Route className="h-3.5 w-3.5" />
          Value Chain — Raw Materials to Module
        </div>

        {scActors.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground/70">
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
                        isVerified ? "bg-[var(--passport-green-muted)]" : "bg-[var(--passport-amber-muted)]"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isVerified ? "text-primary" : "text-[#F59E0B]"
                        }`}
                      />
                    </div>
                    {i < scActors.length - 1 && (
                      <div className="h-12 w-px bg-border" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {actor.stage ?? actor.actor_role}
                      </span>
                      <StatusBadge status={isVerified ? "verified" : "pending"} className="px-1.5 py-0.5 text-[0.625rem]" />
                    </div>
                    <p className="mt-0.5 text-sm text-foreground">
                      {actor.actor_name}
                    </p>
                    {(actor.facility_location || actor.country) && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {actor.facility_location ?? actor.country}
                        {actor.country && (
                          <span className="ml-1 inline-flex items-center bg-muted px-1 py-0.5 text-[0.625rem] font-bold">
                            {actor.country}
                          </span>
                        )}
                      </p>
                    )}
                    {actor.certifications && actor.certifications.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground/70">
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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Factory className="h-3.5 w-3.5" />
            Manufacturer
          </div>
          <p className="mt-2 text-sm font-bold text-foreground">
            {p.manufacturer_name}
          </p>
          {p.manufacturer_address && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {p.manufacturer_address}
            </p>
          )}
          {p.manufacturer_country && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              {p.manufacturer_country}
            </p>
          )}
          {p.manufacturer_operator_id && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/70">
              Operator ID: {p.manufacturer_operator_id}
            </p>
          )}
        </div>

        {p.facility_name && (
          <div className="clean-card p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Factory className="h-3.5 w-3.5" />
              Manufacturing Facility
            </div>
            <p className="mt-2 text-sm font-bold text-foreground">
              {p.facility_name}
            </p>
            {p.facility_location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {p.facility_location}
              </p>
            )}
            {p.facility_id && (
              <p className="mt-2 font-mono text-xs text-muted-foreground/70">
                Facility ID: {p.facility_id}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Chain of Custody */}
      <div className="clean-card p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <FileCheck className="h-3.5 w-3.5" />
          Chain of Custody
        </div>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Auditable transfer events from raw material to finished module.
        </p>

        {cocEvents.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground/70">
            No chain of custody events recorded yet.
          </p>
        ) : (
          <div className="mt-4 space-y-0">
            {cocEvents.map((event, i) => (
              <div key={event.id} className="flex gap-4">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#EFF6FF]">
                    <ArrowRight className="h-4 w-4 text-[#3B82F6]" />
                  </div>
                  {i < cocEvents.length - 1 && (
                    <div className="h-10 w-px bg-border" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {event.event_type}
                    </span>
                    {event.event_timestamp && (
                      <span className="text-[0.625rem] text-muted-foreground/70">
                        {new Date(event.event_timestamp).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  {(event.from_actor || event.to_actor) && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {event.from_actor}
                      {event.from_actor && event.to_actor && (
                        <span className="mx-1.5 text-border">→</span>
                      )}
                      {event.to_actor}
                    </p>
                  )}
                  {event.location && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground/70">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </p>
                  )}
                  {event.evidence_hash && (
                    <p className="mt-1 font-mono text-[0.625rem] text-muted-foreground/70">
                      Evidence: {event.evidence_hash.slice(0, 16)}...
                    </p>
                  )}
                  {event.notes && (
                    <p className="mt-0.5 text-xs text-muted-foreground/70 italic">
                      {event.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Substances of Concern (REACH Article 33) */}
      <div className="clean-card p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <FlaskConical className="h-3.5 w-3.5" />
          Substances of Concern
        </div>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Per EU REACH Article 33 — SVHC above 0.1% w/w threshold.
        </p>

        {socEntries.length === 0 ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-primary">
            <ShieldCheck className="h-4 w-4" />
            No substances of concern identified above reporting threshold.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 text-left text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">Substance</th>
                  <th className="py-2 pr-4 text-left text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">CAS Number</th>
                  <th className="py-2 pr-4 text-right text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">Concentration</th>
                  <th className="py-2 pr-4 text-left text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                  <th className="py-2 text-left text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">Regulatory Basis</th>
                </tr>
              </thead>
              <tbody>
                {socEntries.map((soc) => {
                  const aboveThreshold = (soc.concentration_percent ?? 0) >= 0.1;
                  return (
                    <tr key={soc.id} className="border-b border-dashed border-muted">
                      <td className="py-2.5 pr-4">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          {aboveThreshold && <AlertTriangle className="h-3 w-3 text-[#F59E0B]" />}
                          {soc.substance_name}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">
                        {soc.cas_number ?? "—"}
                      </td>
                      <td className="py-2.5 pr-4 text-right">
                        <span className={`font-mono text-xs font-semibold ${aboveThreshold ? "text-[#F59E0B]" : "text-primary"}`}>
                          {soc.concentration_percent != null ? `${soc.concentration_percent}%` : "—"}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                        {soc.location_in_module ?? "—"}
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground/70">
                        {soc.regulatory_basis ?? "—"}
                        {soc.exemption && (
                          <span className="ml-1.5 bg-muted px-1 py-0.5 text-[0.625rem] font-semibold">
                            Exempt: {soc.exemption}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Due diligence note */}
      <div className="dashed-card p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Due Diligence Status
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
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
