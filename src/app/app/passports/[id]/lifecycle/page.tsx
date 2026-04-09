import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RefreshCcw, Recycle, AlertTriangle, CheckCircle2 } from "lucide-react";

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
      <h2 className="text-lg font-bold text-[#0D0D0D]">Lifecycle</h2>

      {/* Circularity summary */}
      {c ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="clean-card p-4">
              <p className="text-xs text-[#737373]">Recyclability</p>
              <p className="mt-1 text-xl font-bold text-[#22C55E]">
                {c.recyclability_rate_percent ?? "—"}%
              </p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs text-[#737373]">Recycled Content</p>
              <p className="mt-1 text-xl font-bold text-[#0D0D0D]">
                {c.recycled_content_percent ?? "—"}%
              </p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs text-[#737373]">Dismantling Time</p>
              <p className="mt-1 text-xl font-bold text-[#0D0D0D]">
                {c.dismantling_time_minutes ?? "—"} min
              </p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs text-[#737373]">Hazardous</p>
              <p className="mt-1 text-xl font-bold">
                {c.is_hazardous ? (
                  <span className="flex items-center gap-1 text-[#F59E0B]">
                    <AlertTriangle className="h-5 w-5" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#22C55E]">
                    <CheckCircle2 className="h-5 w-5" /> No
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Recovery materials */}
          <div className="passport-table">
            <div className="passport-table-header">
              <span>Material Recovery</span>
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
                    <span className="inline-flex items-center gap-1 text-[#22C55E]">
                      <Recycle className="h-3 w-3" /> Recoverable
                    </span>
                  ) : (
                    <span className="text-[#A3A3A3]">—</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Additional info */}
          {(c.collection_scheme || c.hazardous_substances_notes) && (
            <div className="passport-table">
              <div className="passport-table-header">
                <span>End of Life</span>
              </div>
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
              {c.end_of_life_status && (
                <div className="passport-table-row">
                  <span className="table-label">EoL Status</span>
                  <span className="table-value">{c.end_of_life_status}</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="dashed-card flex flex-col items-center py-12 text-center">
          <RefreshCcw className="h-8 w-8 text-[#D9D9D9]" />
          <p className="mt-3 text-sm font-medium text-[#737373]">
            No lifecycle data recorded
          </p>
          <p className="mt-1 max-w-sm text-xs text-[#A3A3A3]">
            Add circularity and end-of-life information for this passport.
          </p>
        </div>
      )}
    </div>
  );
}
