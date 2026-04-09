import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatNumber } from "@/lib/utils";

export default async function SpecsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase
    .from("passports")
    .select("*")
    .eq("id", id)
    .single();

  if (!p) notFound();

  const groups = [
    {
      title: "Electrical Specifications",
      rows: [
        ["Rated Power (STC)", p.rated_power_stc_w ? `${p.rated_power_stc_w} W` : "—"],
        ["Module Efficiency", p.module_efficiency_percent ? `${p.module_efficiency_percent}%` : "—"],
        ["Open Circuit Voltage (Voc)", p.voc_v ? formatNumber(p.voc_v, "V") : "—"],
        ["Short Circuit Current (Isc)", p.isc_a ? formatNumber(p.isc_a, "A") : "—"],
        ["Voltage at Max Power (Vmp)", p.vmp_v ? formatNumber(p.vmp_v, "V") : "—"],
        ["Current at Max Power (Imp)", p.imp_a ? formatNumber(p.imp_a, "A") : "—"],
        ["Max System Voltage", p.max_system_voltage_v ? `${p.max_system_voltage_v} V DC` : "—"],
        ["Bifaciality Factor", p.bifaciality_factor ? `${(p.bifaciality_factor * 100).toFixed(0)}%` : "—"],
      ],
    },
    {
      title: "Thermal Characteristics",
      rows: [
        ["Temp. Coefficient Pmax", p.temperature_coefficient_pmax ? `${p.temperature_coefficient_pmax}%/°C` : "—"],
        ["Temp. Coefficient Voc", p.temperature_coefficient_voc ? `${p.temperature_coefficient_voc}%/°C` : "—"],
        ["Temp. Coefficient Isc", p.temperature_coefficient_isc ? `${p.temperature_coefficient_isc}%/°C` : "—"],
        ["NOCT", p.noct_celsius ? `${p.noct_celsius}°C` : "—"],
      ],
    },
    {
      title: "Mechanical Specifications",
      rows: [
        ["Dimensions (L×W×D)", p.module_length_mm && p.module_width_mm ? `${p.module_length_mm} × ${p.module_width_mm} × ${p.module_depth_mm ?? "—"} mm` : "—"],
        ["Weight", p.module_mass_kg ? formatNumber(p.module_mass_kg, "kg") : "—"],
        ["Cell Count", p.cell_count?.toString() ?? "—"],
        ["Cell Type", p.cell_type ?? "—"],
        ["Frame", p.frame_type ?? "—"],
        ["Glass", p.glass_type ?? "—"],
        ["Connector", p.connector_type ?? "—"],
        ["IP Rating", p.ip_rating ?? "—"],
        ["Fire Rating", p.fire_rating ?? "—"],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#0D0D0D]">Specifications</h2>

      {groups.map((group) => (
        <div key={group.title} className="passport-table">
          <div className="passport-table-header">
            <span>{group.title}</span>
          </div>
          {group.rows.map(([label, value]) => (
            <div key={label} className="passport-table-row">
              <span className="table-label">{label}</span>
              <span className={`table-value ${value !== "—" ? "" : "text-[#A3A3A3]"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
