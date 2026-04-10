import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatWatts, formatPercent, formatDate, formatNumber } from "@/lib/utils";
import {
  MODULE_TECHNOLOGY_LABELS,
} from "@/lib/constants";
import {
  Zap,
  Gauge,
  Shield,
  Recycle,
  Factory,
  Calendar,
  MapPin,
  Weight,
  Leaf,
  Ship,
} from "lucide-react";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: passport }, { data: materials }, { data: certificates }] =
    await Promise.all([
      supabase.from("passports").select("*").eq("id", id).single(),
      supabase
        .from("passport_materials")
        .select("*")
        .eq("passport_id", id)
        .order("sort_order"),
      supabase
        .from("passport_certificates")
        .select("*")
        .eq("passport_id", id),
    ]);

  if (!passport) notFound();

  const validCerts = certificates?.filter((c) => c.status === "valid").length ?? 0;
  const totalCerts = certificates?.length ?? 0;
  const materialCount = materials?.length ?? 0;

  const summaryCards = [
    {
      icon: Zap,
      label: "Rated Power",
      value: passport.rated_power_stc_w
        ? formatWatts(passport.rated_power_stc_w)
        : "—",
    },
    {
      icon: Gauge,
      label: "Efficiency",
      value: passport.module_efficiency_percent
        ? formatPercent(passport.module_efficiency_percent)
        : "—",
    },
    {
      icon: Shield,
      label: "Certificates",
      value: `${validCerts}/${totalCerts} valid`,
    },
    {
      icon: Recycle,
      label: "Materials",
      value: `${materialCount} tracked`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="clean-card p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center bg-[#E8FAE9]">
                <card.icon className="h-3.5 w-3.5 text-[#22C55E]" />
              </div>
              <span className="text-xs text-[#737373]">{card.label}</span>
            </div>
            <p className="mt-2 text-lg font-bold text-[#0D0D0D]">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Identity section */}
      <div className="clean-card">
        <div className="border-b border-[#D9D9D9] px-4 py-3">
          <h2 className="text-sm font-bold text-[#0D0D0D]">
            Product Identity
          </h2>
        </div>
        <div className="grid gap-0 sm:grid-cols-2">
          <InfoRow
            icon={Factory}
            label="Manufacturer"
            value={passport.manufacturer_name}
          />
          <InfoRow
            label="Operator ID"
            value={passport.manufacturer_operator_id ?? "—"}
            mono
          />
          <InfoRow
            label="Country"
            value={passport.manufacturer_country ?? "—"}
          />
          {passport.manufacturer_address && (
            <InfoRow label="Address" value={passport.manufacturer_address} />
          )}
          {passport.manufacturer_contact_url && (
            <InfoRow label="Contact URL" value={passport.manufacturer_contact_url} />
          )}
          <InfoRow
            icon={MapPin}
            label="Facility"
            value={passport.facility_name ?? "—"}
          />
          <InfoRow
            label="Technology"
            value={
              MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
              passport.module_technology
            }
          />
          <InfoRow
            icon={Calendar}
            label="Manufacturing Date"
            value={
              passport.manufacturing_date
                ? formatDate(passport.manufacturing_date)
                : "—"
            }
          />
          <InfoRow
            label="Serial / Batch"
            value={passport.serial_number ?? passport.batch_id ?? "—"}
          />
          <InfoRow label="GTIN" value={passport.gtin ?? "—"} mono />
        </div>
      </div>

      {/* Key specs */}
      <div className="clean-card">
        <div className="border-b border-[#D9D9D9] px-4 py-3">
          <h2 className="text-sm font-bold text-[#0D0D0D]">
            Key Specifications
          </h2>
        </div>
        <div className="grid gap-0 sm:grid-cols-2">
          <InfoRow
            label="Voc"
            value={passport.voc_v ? formatNumber(passport.voc_v, "V") : "—"}
          />
          <InfoRow
            label="Isc"
            value={passport.isc_a ? formatNumber(passport.isc_a, "A") : "—"}
          />
          <InfoRow
            label="Vmp"
            value={passport.vmp_v ? formatNumber(passport.vmp_v, "V") : "—"}
          />
          <InfoRow
            label="Imp"
            value={passport.imp_a ? formatNumber(passport.imp_a, "A") : "—"}
          />
          <InfoRow
            label="Dimensions"
            value={
              passport.module_length_mm && passport.module_width_mm
                ? `${passport.module_length_mm} x ${passport.module_width_mm} x ${passport.module_depth_mm ?? "—"} mm`
                : "—"
            }
          />
          <InfoRow
            icon={Weight}
            label="Weight"
            value={
              passport.module_mass_kg
                ? formatNumber(passport.module_mass_kg, "kg")
                : "—"
            }
          />
          <InfoRow
            label="Cell Count"
            value={passport.cell_count?.toString() ?? "—"}
          />
          <InfoRow
            label="Cell Type"
            value={passport.cell_type ?? "—"}
          />
        </div>
      </div>

      {/* Warranty */}
      <div className="clean-card">
        <div className="border-b border-[#D9D9D9] px-4 py-3">
          <h2 className="text-sm font-bold text-[#0D0D0D]">Warranty</h2>
        </div>
        <div className="grid gap-0 sm:grid-cols-2">
          <InfoRow
            label="Product Warranty"
            value={
              passport.product_warranty_years
                ? `${passport.product_warranty_years} years`
                : "—"
            }
          />
          <InfoRow
            label="Performance Warranty"
            value={
              passport.performance_warranty_years
                ? `${passport.performance_warranty_years} years`
                : "—"
            }
          />
          <InfoRow
            label="Performance @ End"
            value={
              passport.performance_warranty_percent
                ? `≥${passport.performance_warranty_percent}%`
                : "—"
            }
          />
          <InfoRow
            label="Linear Degradation"
            value={
              passport.linear_degradation_percent_per_year
                ? `${passport.linear_degradation_percent_per_year}%/year`
                : "—"
            }
          />
          <InfoRow
            label="Expected Lifetime"
            value={
              passport.expected_lifetime_years
                ? `${passport.expected_lifetime_years} years`
                : "—"
            }
          />
        </div>
      </div>
      {/* EU Importer (conditional) */}
      {passport.importer_name && (
        <div className="clean-card">
          <div className="border-b border-[#D9D9D9] px-4 py-3">
            <h2 className="text-sm font-bold text-[#0D0D0D]">
              <span className="flex items-center gap-2">
                <Ship className="h-3.5 w-3.5 text-[#737373]" />
                EU Importer
              </span>
            </h2>
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            <InfoRow label="Importer Name" value={passport.importer_name} />
            <InfoRow
              label="Operator ID"
              value={passport.importer_operator_id ?? "—"}
              mono
            />
            <InfoRow
              label="Country"
              value={passport.importer_country ?? "—"}
            />
          </div>
        </div>
      )}

      {/* Carbon & Environmental */}
      <div className="clean-card">
        <div className="border-b border-[#D9D9D9] px-4 py-3">
          <h2 className="text-sm font-bold text-[#0D0D0D]">
            <span className="flex items-center gap-2">
              <Leaf className="h-3.5 w-3.5 text-[#22C55E]" />
              Carbon &amp; Environmental
            </span>
          </h2>
        </div>
        <div className="grid gap-0 sm:grid-cols-2">
          <InfoRow
            label="Carbon Footprint"
            value={
              passport.carbon_footprint_kg_co2e
                ? `${passport.carbon_footprint_kg_co2e} kg CO₂e`
                : "—"
            }
          />
          <InfoRow
            label="Carbon Intensity"
            value={
              passport.carbon_intensity_g_co2e_per_kwh
                ? `${passport.carbon_intensity_g_co2e_per_kwh} gCO₂e/kWh`
                : "—"
            }
          />
          <InfoRow
            label="LCA Boundary"
            value={
              passport.carbon_lca_boundary
                ? ({ cradle_to_gate: "Cradle-to-Gate", cradle_to_grave: "Cradle-to-Grave" } as Record<string, string>)[passport.carbon_lca_boundary] ?? passport.carbon_lca_boundary
                : "—"
            }
          />
          <InfoRow
            label="Methodology"
            value={
              passport.carbon_footprint_methodology
                ? ({ JRC_harmonized_2025: "JRC Harmonized 2025", PEF: "PEF", ISO_14040: "ISO 14040" } as Record<string, string>)[passport.carbon_footprint_methodology] ?? passport.carbon_footprint_methodology
                : "—"
            }
          />
          <InfoRow
            label="Verification Ref (EPD)"
            value={passport.carbon_verification_ref ?? "—"}
            mono
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#D9D9D9] px-4 py-2.5 last:border-b-0">
      <span className="flex items-center gap-2 text-[0.8125rem] text-[#737373]">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      <span
        className={`text-[0.8125rem] font-semibold text-[#0D0D0D] ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
