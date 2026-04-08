import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { MetricCard } from "@/components/shared/metric-card";
import { DefinitionList } from "@/components/shared/definition-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent, formatNumber } from "@/lib/utils";
import type { PassportCircularity, PassportMaterial } from "@/types/passport";
import { RecycleIcon, AlertTriangleIcon, WrenchIcon } from "lucide-react";

interface Props {
  params: Promise<{ publicId: string }>;
}

export default async function CircularityPage({ params }: Props) {
  const { publicId } = await params;
  const supabase = await createClient();

  const { data: passport } = await supabase
    .from("passports")
    .select("id")
    .eq("public_id", publicId)
    .single();
  if (!passport) notFound();

  const [{ data: circularity }, { data: materials }] = await Promise.all([
    supabase
      .from("passport_circularity")
      .select("*")
      .eq("passport_id", passport.id)
      .single(),
    supabase
      .from("passport_materials")
      .select("*")
      .eq("passport_id", passport.id)
      .order("sort_order"),
  ]);

  const c = circularity as PassportCircularity | null;
  const mats = (materials ?? []) as PassportMaterial[];

  if (!c) {
    return (
      <div>
        <SectionHeader title="Circularity & End of Life" />
        <EmptyState
          title="No circularity data"
          description="Circularity information has not been added yet."
          icon={<RecycleIcon className="h-10 w-10" />}
        />
      </div>
    );
  }

  const recoveryMaterials = [
    { name: "Aluminium", recoverable: c.recovery_aluminium },
    { name: "Glass", recoverable: c.recovery_glass },
    { name: "Silicon", recoverable: c.recovery_silicon },
    { name: "Copper", recoverable: c.recovery_copper },
    { name: "Silver", recoverable: c.recovery_silver },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Circularity & End of Life"
        description="Recyclability, material composition, and dismantling information"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Recyclability Rate"
          value={c.recyclability_rate_percent?.toString() ?? "—"}
          unit="%"
          icon={<RecycleIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Recycled Content"
          value={c.recycled_content_percent?.toString() ?? "—"}
          unit="%"
        />
        <MetricCard
          label="Dismantling Time"
          value={c.dismantling_time_minutes?.toString() ?? "—"}
          unit="min"
          icon={<WrenchIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Hazardous"
          value={c.is_hazardous ? "Yes" : "No"}
          icon={<AlertTriangleIcon className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Material Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mats.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{m.material_name}</span>
                    {m.is_critical_raw_material && (
                      <Badge variant="outline" className="text-xs">CRM</Badge>
                    )}
                    {m.is_substance_of_concern && (
                      <Badge variant="destructive" className="text-xs">SoC</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {m.mass_g != null && (
                      <span>{formatNumber(m.mass_g, "g")}</span>
                    )}
                    {m.mass_percent != null && (
                      <span className="font-mono">{formatPercent(m.mass_percent)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Material Recovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {recoveryMaterials.map((rm) => (
                <Badge
                  key={rm.name}
                  variant={rm.recoverable ? "default" : "outline"}
                  className={rm.recoverable ? "" : "opacity-50"}
                >
                  {rm.name}
                </Badge>
              ))}
            </div>
            {c.recovery_notes && (
              <p className="text-sm text-muted-foreground">{c.recovery_notes}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {c.dismantling_instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dismantling Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
              {c.dismantling_instructions}
            </pre>
          </CardContent>
        </Card>
      )}

      {c.hazardous_substances_notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hazardous Substances Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{c.hazardous_substances_notes}</p>
          </CardContent>
        </Card>
      )}

      {c.collection_scheme && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Collection Scheme</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{c.collection_scheme}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
