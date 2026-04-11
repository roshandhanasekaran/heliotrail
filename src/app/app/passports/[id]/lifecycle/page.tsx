import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RefreshCcw, Recycle, AlertTriangle, CheckCircle2, Leaf, Wrench, Phone, FileText, ShieldCheck } from "lucide-react";

export default async function LifecyclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: passport }, { data: circularity }] = await Promise.all([
    supabase.from("passports").select("*").eq("id", id).single(),
    supabase
      .from("passport_circularity")
      .select("*")
      .eq("passport_id", id)
      .single(),
  ]);

  if (!passport) notFound();

  const c = circularity;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Lifecycle</h2>

      {/* Circularity summary */}
      {c ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <div className="clean-card p-4">
              <p className="text-xs text-muted-foreground">Recyclability</p>
              <p className="mt-1 text-xl font-bold text-primary">
                {c.recyclability_rate_percent ?? "—"}%
              </p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs text-muted-foreground">Recycled Content</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {c.recycled_content_percent ?? "—"}%
              </p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs text-muted-foreground">Renewable Content</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {c.renewable_content_percent ?? "—"}%
              </p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs text-muted-foreground">Dismantling Time</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {c.dismantling_time_minutes ?? "—"} min
              </p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs text-muted-foreground">Hazardous</p>
              <p className="mt-1 text-xl font-bold">
                {c.is_hazardous ? (
                  <span className="flex items-center gap-1 text-[#F59E0B]">
                    <AlertTriangle className="h-5 w-5" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-primary">
                    <CheckCircle2 className="h-5 w-5" /> No
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* REACH / RoHS Compliance */}
          <div className="passport-table">
            <div className="passport-table-header">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" /> Regulatory Compliance
              </span>
            </div>
            <div className="passport-table-row">
              <span className="table-label">REACH Status</span>
              <span className="table-value">
                {passport.reach_status
                  ? ({ compliant: "Compliant", non_compliant: "Non-Compliant", exempt: "Exempt", under_review: "Under Review" } as Record<string, string>)[passport.reach_status] ?? passport.reach_status
                  : "—"}
              </span>
            </div>
            <div className="passport-table-row">
              <span className="table-label">RoHS Status</span>
              <span className="table-value">
                {passport.rohs_status
                  ? ({ compliant: "Compliant", compliant_with_exemption: "Compliant with Exemption", exempt: "Exempt", non_compliant: "Non-Compliant" } as Record<string, string>)[passport.rohs_status] ?? passport.rohs_status
                  : "—"}
              </span>
            </div>
          </div>

          {/* Recovery materials */}
          <div className="passport-table">
            <div className="passport-table-header">
              <span className="flex items-center gap-2">
                <Recycle className="h-3.5 w-3.5" /> Material Recovery
              </span>
            </div>
            {[
              ["Aluminium", c.recovery_aluminium],
              ["Glass", c.recovery_glass],
              ["Silicon", c.recovery_silicon],
              ["Copper", c.recovery_copper],
              ["Silver", c.recovery_silver],
            ].map(([name, recoverable]) => (
              <div key={name as string} className="passport-table-row">
                <span className="table-label">{name}</span>
                <span className="table-value">
                  {recoverable ? (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Recycle className="h-3 w-3" /> Recoverable
                    </span>
                  ) : (
                    <span className="text-muted-foreground/70">—</span>
                  )}
                </span>
              </div>
            ))}
            {c.recovery_notes && (
              <div className="passport-table-row">
                <span className="table-label">Recovery Notes</span>
                <span className="table-value text-xs">{c.recovery_notes}</span>
              </div>
            )}
          </div>

          {/* Dismantling & Repair */}
          {(c.dismantling_instructions || c.recycler_name) && (
            <div className="passport-table">
              <div className="passport-table-header">
                <span className="flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5" /> Dismantling &amp; Recycler
                </span>
              </div>
              {c.dismantling_instructions && (
                <div className="passport-table-row">
                  <span className="table-label">Dismantling Instructions</span>
                  <span className="table-value whitespace-pre-line text-xs">
                    {c.dismantling_instructions}
                  </span>
                </div>
              )}
              {c.recycler_name && (
                <div className="passport-table-row">
                  <span className="table-label">Recycler</span>
                  <span className="table-value">{c.recycler_name}</span>
                </div>
              )}
              {c.recycler_contact && (
                <div className="passport-table-row">
                  <span className="table-label">Recycler Contact</span>
                  <span className="table-value">{c.recycler_contact}</span>
                </div>
              )}
            </div>
          )}

          {/* End of Life */}
          {(c.collection_scheme || c.hazardous_substances_notes || c.end_of_life_status) && (
            <div className="passport-table">
              <div className="passport-table-header">
                <span className="flex items-center gap-2">
                  <Leaf className="h-3.5 w-3.5" /> End of Life
                </span>
              </div>
              {c.end_of_life_status && (
                <div className="passport-table-row">
                  <span className="table-label">EoL Status</span>
                  <span className="table-value">{c.end_of_life_status}</span>
                </div>
              )}
              {c.collection_scheme && (
                <div className="passport-table-row">
                  <span className="table-label">Collection Scheme</span>
                  <span className="table-value">{c.collection_scheme}</span>
                </div>
              )}
              {c.hazardous_substances_notes && (
                <div className="passport-table-row">
                  <span className="table-label">Hazardous Notes</span>
                  <span className="table-value text-xs">
                    {c.hazardous_substances_notes}
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="dashed-card flex flex-col items-center py-12 text-center">
          <RefreshCcw className="h-8 w-8 text-border" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No lifecycle data recorded
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground/70">
            Add circularity and end-of-life information for this passport.
          </p>
        </div>
      )}
    </div>
  );
}
