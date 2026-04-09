import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SolarPanelDiagram } from "@/components/passport/solar-panel-diagram";
import { OverviewClient } from "@/components/passport/overview-client";
import { formatNumber, formatDate } from "@/lib/utils";
import type { Passport } from "@/types/passport";

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

  const manufacturerData = [
    { label: "Manufacturer", value: p.manufacturer_name },
    { label: "Operator ID", value: p.manufacturer_operator_id ?? "—" },
    { label: "Country", value: p.manufacturer_country ?? "—" },
    { label: "Address", value: p.manufacturer_address ?? "—" },
    ...(p.manufacturer_contact_url ? [{ label: "Contact", value: p.manufacturer_contact_url }] : []),
    { label: "Facility", value: p.facility_name ?? "—" },
    { label: "Location", value: p.facility_location ?? "—" },
    { label: "Manufacturing Date", value: formatDate(p.manufacturing_date) },
  ];

  const warrantyData = [
    { label: "Serial Number", value: p.serial_number ?? "—" },
    { label: "Batch ID", value: p.batch_id ?? "—" },
    { label: "GTIN", value: p.gtin ?? "—" },
    { label: "Product Warranty", value: formatNumber(p.product_warranty_years, "years") },
    {
      label: "Performance Warranty",
      value: `${formatNumber(p.performance_warranty_years, "years")} / ${p.performance_warranty_percent}%`,
    },
    {
      label: "Degradation Rate",
      value: p.linear_degradation_percent_per_year
        ? `${p.linear_degradation_percent_per_year}%/yr`
        : "—",
    },
    { label: "Expected Lifetime", value: formatNumber(p.expected_lifetime_years, "years") },
    {
      label: "Carbon Methodology",
      value: p.carbon_footprint_methodology ?? "—",
    },
    ...(p.published_at ? [{ label: "Published", value: formatDate(p.published_at) }] : []),
    { label: "Passport Version", value: `v${p.passport_version}` },
  ];

  return (
    <div className="space-y-12">
      {/* Interactive Solar Panel Diagram */}
      <section>
        <SolarPanelDiagram passport={p} publicId={publicId} />
      </section>

      {/* Client-side animated section */}
      <OverviewClient
        manufacturerData={manufacturerData}
        warrantyData={warrantyData}
      />
    </div>
  );
}
