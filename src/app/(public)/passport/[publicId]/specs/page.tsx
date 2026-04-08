import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
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
    { param: "Rated Power (STC)", value: formatNumber(p.rated_power_stc_w, "W") },
    { param: "Module Efficiency", value: formatNumber(p.module_efficiency_percent, "%") },
    { param: "Open Circuit Voltage (Voc)", value: formatNumber(p.voc_v, "V") },
    { param: "Short Circuit Current (Isc)", value: formatNumber(p.isc_a, "A") },
    { param: "Voltage at Max Power (Vmp)", value: formatNumber(p.vmp_v, "V") },
    { param: "Current at Max Power (Imp)", value: formatNumber(p.imp_a, "A") },
    { param: "Max System Voltage", value: formatNumber(p.max_system_voltage_v, "V") },
  ];

  const mechanical = [
    { param: "Length", value: formatNumber(p.module_length_mm, "mm") },
    { param: "Width", value: formatNumber(p.module_width_mm, "mm") },
    { param: "Depth", value: formatNumber(p.module_depth_mm, "mm") },
    { param: "Mass", value: formatNumber(p.module_mass_kg, "kg") },
    { param: "Cell Count", value: formatNumber(p.cell_count) },
    { param: "Cell Type", value: p.cell_type ?? "—" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Technical Specifications"
        description="Electrical and mechanical parameters at Standard Test Conditions (STC)"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Electrical Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {electrical.map((row) => (
                  <TableRow key={row.param}>
                    <TableCell>{row.param}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mechanical Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mechanical.map((row) => (
                  <TableRow key={row.param}>
                    <TableCell>{row.param}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
