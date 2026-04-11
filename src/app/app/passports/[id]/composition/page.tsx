import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AlertTriangle, Layers } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function CompositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: passport }, { data: materials }] = await Promise.all([
    supabase.from("passports").select("id").eq("id", id).single(),
    supabase
      .from("passport_materials")
      .select("*")
      .eq("passport_id", id)
      .order("sort_order"),
  ]);

  if (!passport) notFound();

  const mats = materials ?? [];
  const criticalCount = mats.filter((m) => m.is_critical_raw_material).length;
  const socCount = mats.filter((m) => m.is_substance_of_concern).length;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">
        Material Composition
      </h2>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 border border-dashed border-border px-3 py-1.5 text-sm">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{mats.length} materials</span>
        </div>
        {criticalCount > 0 && (
          <div className="inline-flex items-center gap-2 border border-dashed border-[#F59E0B] bg-[var(--passport-amber-muted)] px-3 py-1.5 text-sm">
            <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span className="text-foreground">
              {criticalCount} critical raw material{criticalCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
        {socCount > 0 && (
          <div className="inline-flex items-center gap-2 border border-dashed border-red-300 bg-red-50 px-3 py-1.5 text-sm">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-foreground">
              {socCount} substance{socCount > 1 ? "s" : ""} of concern
            </span>
          </div>
        )}
      </div>

      {/* Materials table */}
      {mats.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-10 w-10" />}
          title="No materials recorded"
          description="Add material composition data to this passport."
        />
      ) : (
        <div className="clean-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Material
                </th>
                <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Component
                </th>
                <th className="px-4 py-2.5 text-right text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Mass
                </th>
                <th className="px-4 py-2.5 text-right text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                  %
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground md:table-cell">
                  CAS #
                </th>
                <th className="hidden px-4 py-2.5 text-center text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  CRM
                </th>
                <th className="hidden px-4 py-2.5 text-center text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  SoC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mats.map((m) => (
                <tr key={m.id} className="hover:bg-muted/50">
                  <td className="px-4 py-2.5 text-sm font-medium text-foreground">
                    {m.material_name}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground">
                    {m.component_type ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-sm text-foreground">
                    {m.mass_g ? `${m.mass_g.toLocaleString()} g` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-sm text-foreground">
                    {m.mass_percent ? `${m.mass_percent.toFixed(2)}%` : "—"}
                  </td>
                  <td className="hidden px-4 py-2.5 font-mono text-xs text-muted-foreground md:table-cell">
                    {m.cas_number || "—"}
                  </td>
                  <td className="hidden px-4 py-2.5 text-center sm:table-cell">
                    {m.is_critical_raw_material ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center bg-[var(--passport-amber-muted)] text-xs font-bold text-[#F59E0B]">
                        !
                      </span>
                    ) : (
                      <span className="text-xs text-border">—</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-2.5 text-center sm:table-cell">
                    {m.is_substance_of_concern ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center bg-red-50 text-xs font-bold text-red-500">
                        !
                      </span>
                    ) : (
                      <span className="text-xs text-border">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
