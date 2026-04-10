import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatNumber } from "@/lib/utils";
import { SpecsClient } from "@/components/passport/specs-client";
import type { Passport } from "@/types/passport";

interface Props {
  params: Promise<{ publicId: string }>;
}

export default async function SpecsPage({ params }: Props) {
  const { publicId } = await params;
  const supabase = await createClient();
  const { data: passport } = await supabase
    .from("passports")
    .select("*")
    .eq("public_id", publicId)
    .single();

  if (!passport) notFound();
  const p = passport as Passport;

  const electrical = [
    { param: "Rated Power (STC)", value: formatNumber(p.rated_power_stc_w, "W"), highlight: true },
    { param: "Module Efficiency", value: formatNumber(p.module_efficiency_percent, "%"), highlight: true },
    { param: "Open Circuit Voltage (Voc)", value: formatNumber(p.voc_v, "V") },
    { param: "Short Circuit Current (Isc)", value: formatNumber(p.isc_a, "A") },
    { param: "Voltage at Max Power (Vmp)", value: formatNumber(p.vmp_v, "V") },
    { param: "Current at Max Power (Imp)", value: formatNumber(p.imp_a, "A") },
    { param: "Max System Voltage", value: formatNumber(p.max_system_voltage_v, "V") },
    ...(p.temperature_coefficient_pmax != null ? [{ param: "Temp. Coefficient (Pmax)", value: `${p.temperature_coefficient_pmax} %/°C` }] : []),
    ...(p.temperature_coefficient_voc != null ? [{ param: "Temp. Coefficient (Voc)", value: `${p.temperature_coefficient_voc} %/°C` }] : []),
    ...(p.temperature_coefficient_isc != null ? [{ param: "Temp. Coefficient (Isc)", value: `${p.temperature_coefficient_isc} %/°C` }] : []),
    ...(p.noct_celsius != null ? [{ param: "NOCT", value: `${p.noct_celsius} °C` }] : []),
  ];

  const mechanical = [
    { param: "Length", value: formatNumber(p.module_length_mm, "mm") },
    { param: "Width", value: formatNumber(p.module_width_mm, "mm") },
    { param: "Depth", value: formatNumber(p.module_depth_mm, "mm") },
    { param: "Mass", value: formatNumber(p.module_mass_kg, "kg") },
    { param: "Cell Count", value: formatNumber(p.cell_count), highlight: true },
    { param: "Cell Type", value: p.cell_type ?? "—" },
    ...(p.glass_type ? [{ param: "Glass Type", value: p.glass_type }] : []),
    ...(p.frame_type ? [{ param: "Frame Type", value: p.frame_type }] : []),
    ...(p.connector_type ? [{ param: "Connector", value: p.connector_type }] : []),
    ...(p.ip_rating ? [{ param: "IP Rating", value: p.ip_rating }] : []),
    ...(p.fire_rating ? [{ param: "Fire Rating", value: p.fire_rating }] : []),
    ...(p.bifaciality_factor != null ? [{ param: "Bifaciality Factor", value: `${(p.bifaciality_factor * 100).toFixed(0)}%`, highlight: true }] : []),
  ];

  const gaugeData = {
    power: p.rated_power_stc_w ?? 0,
    efficiency: p.module_efficiency_percent ?? 0,
  };

  return (
    <div className="space-y-12">
      <SpecsClient
        electrical={electrical}
        mechanical={mechanical}
        gaugeData={gaugeData}
      />

    </div>
  );
}
