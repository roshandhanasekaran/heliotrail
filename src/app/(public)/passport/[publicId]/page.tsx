import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { MetricCard } from "@/components/shared/metric-card";
import { DefinitionList } from "@/components/shared/definition-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent, formatNumber, formatDate } from "@/lib/utils";
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
    <div className="space-y-8">
      <SectionHeader
        title="Overview"
        description="Key performance indicators and product summary"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Rated Power"
          value={p.rated_power_stc_w?.toString() ?? "—"}
          unit="W"
          icon={<ZapIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Module Efficiency"
          value={p.module_efficiency_percent?.toString() ?? "—"}
          unit="%"
          icon={<GaugeIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Carbon Footprint"
          value={p.carbon_footprint_kg_co2e?.toString() ?? "—"}
          unit="kg CO₂e"
          icon={<LeafIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Expected Lifetime"
          value={p.expected_lifetime_years?.toString() ?? "—"}
          unit="years"
          icon={<CalendarIcon className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FactoryIcon className="h-4 w-4" />
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldIcon className="h-4 w-4" />
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
                { label: "Performance Warranty", value: `${formatNumber(p.performance_warranty_years, "years")} / ${formatPercent(p.performance_warranty_percent)}` },
                { label: "Degradation Rate", value: formatPercent(p.linear_degradation_percent_per_year) ? `${p.linear_degradation_percent_per_year}%/yr` : "—" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
