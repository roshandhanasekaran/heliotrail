import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { MetricCard } from "@/components/shared/metric-card";
import { DefinitionList } from "@/components/shared/definition-list";
import { SolarPanelDiagram } from "@/components/passport/solar-panel-diagram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatDate } from "@/lib/utils";
import type { Passport } from "@/types/passport";
import {
  ZapIcon,
  GaugeIcon,
  LeafIcon,
  CalendarIcon,
  ShieldIcon,
  FactoryIcon,
} from "lucide-react";

interface Props {
  params: Promise<{ publicId: string }>;
}

export default async function OverviewPage({ params }: Props) {
  const { publicId } = await params;
  const supabase = await createClient();
  const { data: passport } = await supabase
    .from("passports")
    .select("*")
    .eq("public_id", publicId)
    .single();

  if (!passport) notFound();
  const p = passport as Passport;

  return (
    <div className="space-y-10">
      {/* Interactive Solar Panel Diagram */}
      <section>
        <SectionHeader
          title="Explore Passport Data"
          description="Click any zone on the panel diagram to navigate to that section"
        />
        <SolarPanelDiagram passport={p} publicId={publicId} />
      </section>

      {/* Manufacturer & Warranty */}
      <section>
        <SectionHeader title="Product Details" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FactoryIcon className="h-4 w-4 text-primary" />
                Manufacturer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DefinitionList
                items={[
                  { label: "Manufacturer", value: p.manufacturer_name },
                  { label: "Operator ID", value: p.manufacturer_operator_id ?? "—" },
                  { label: "Country", value: p.manufacturer_country ?? "—" },
                  { label: "Facility", value: p.facility_name ?? "—" },
                  { label: "Location", value: p.facility_location ?? "—" },
                  { label: "Manufacturing Date", value: formatDate(p.manufacturing_date) },
                ]}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldIcon className="h-4 w-4 text-primary" />
                Warranty &amp; Identification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DefinitionList
                items={[
                  { label: "Serial Number", value: <span className="font-mono text-xs">{p.serial_number ?? "—"}</span> },
                  { label: "Batch ID", value: <span className="font-mono text-xs">{p.batch_id ?? "—"}</span> },
                  { label: "GTIN", value: <span className="font-mono text-xs">{p.gtin ?? "—"}</span> },
                  { label: "Product Warranty", value: formatNumber(p.product_warranty_years, "years") },
                  { label: "Performance Warranty", value: `${formatNumber(p.performance_warranty_years, "years")} / ${p.performance_warranty_percent}%` },
                  { label: "Degradation Rate", value: p.linear_degradation_percent_per_year ? `${p.linear_degradation_percent_per_year}%/yr` : "—" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
