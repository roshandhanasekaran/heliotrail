import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
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

  const technologyLabels: Record<string, string> = {
    crystalline_silicon_topcon: "TOPCon",
    crystalline_silicon_perc: "PERC",
    crystalline_silicon_hjt: "HJT",
    thin_film_cdte: "CdTe",
    thin_film_cigs: "CIGS",
    topcon: "TOPCon",
    perc: "PERC",
    hjt: "HJT",
    cdte: "CdTe",
    cigs: "CIGS",
  };

  const manufacturerData = [
    { label: "Manufacturer", value: p.manufacturer_name },
    { label: "Operator ID", value: p.manufacturer_operator_id ?? "—" },
    { label: "Country", value: p.manufacturer_country ?? "—" },
    { label: "Address", value: p.manufacturer_address ?? "—" },
    ...(p.manufacturer_contact_url ? [{ label: "Contact", value: p.manufacturer_contact_url }] : []),
    { label: "Facility", value: p.facility_name ?? "—" },
    { label: "Location", value: p.facility_location ?? "—" },
    { label: "Technology", value: p.module_technology ? (technologyLabels[p.module_technology] ?? p.module_technology) : "—" },
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
      label: "Carbon Footprint",
      value: p.carbon_footprint_kg_co2e
        ? `${p.carbon_footprint_kg_co2e} kg CO₂e`
        : "—",
    },
    {
      label: "Carbon Intensity",
      value: p.carbon_intensity_g_co2e_per_kwh
        ? `${p.carbon_intensity_g_co2e_per_kwh} gCO₂e/kWh`
        : "—",
    },
    {
      label: "LCA Boundary",
      value: p.carbon_lca_boundary
        ? ({ cradle_to_gate: "Cradle-to-Gate", cradle_to_grave: "Cradle-to-Grave" } as Record<string, string>)[p.carbon_lca_boundary!] ?? p.carbon_lca_boundary
        : "—",
    },
    {
      label: "Carbon Methodology",
      value: p.carbon_footprint_methodology ?? "—",
    },
    {
      label: "Verification Reference",
      value: p.carbon_verification_ref ?? "—",
    },
    ...(p.published_at ? [{ label: "Published", value: formatDate(p.published_at) }] : []),
    { label: "Passport Version", value: `v${p.passport_version}` },
  ];

  const importerData = p.importer_name
    ? [
        { label: "Importer Name", value: p.importer_name },
        { label: "Operator ID", value: p.importer_operator_id ?? "—" },
        { label: "Country", value: p.importer_country ?? "—" },
      ]
    : null;

  return (
    <div className="space-y-12">
      {/* Client-side animated section */}
      <OverviewClient
        manufacturerData={manufacturerData}
        warrantyData={warrantyData}
        importerData={importerData}
      />
    </div>
  );
}
