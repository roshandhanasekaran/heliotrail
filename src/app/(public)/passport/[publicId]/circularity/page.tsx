import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { CircularityClient } from "@/components/passport/circularity-client";
import type { PassportCircularity, PassportMaterial } from "@/types/passport";
import { RecycleIcon } from "lucide-react";

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
        <EmptyState
          title="No circularity data"
          description="Circularity information has not been added yet."
          icon={<RecycleIcon className="h-10 w-10" />}
        />
      </div>
    );
  }

  const circularityData = {
    recyclabilityRate: c.recyclability_rate_percent ?? 0,
    recycledContent: c.recycled_content_percent ?? 0,
    dismantlingTime: c.dismantling_time_minutes ?? 0,
    renewableContent: c.renewable_content_percent ?? 0,
    isHazardous: c.is_hazardous,
    dismantlingInstructions: c.dismantling_instructions,
    hazardousNotes: c.hazardous_substances_notes,
    collectionScheme: c.collection_scheme,
    recoveryNotes: c.recovery_notes,
    recyclerName: c.recycler_name,
    recyclerContact: c.recycler_contact,
    endOfLifeStatus: c.end_of_life_status,
    recovery: {
      aluminium: c.recovery_aluminium,
      glass: c.recovery_glass,
      silicon: c.recovery_silicon,
      copper: c.recovery_copper,
      silver: c.recovery_silver,
    },
  };

  const materialsData = mats.map((m) => ({
    id: m.id,
    name: m.material_name,
    componentType: m.component_type,
    massPercent: m.mass_percent ?? 0,
    massG: m.mass_g,
    isCritical: m.is_critical_raw_material,
    isSoC: m.is_substance_of_concern,
    recyclabilityHint: m.recyclability_hint,
    casNumber: m.cas_number,
    concentrationPercent: m.concentration_percent,
    regulatoryBasis: m.regulatory_basis,
  }));

  return (
    <CircularityClient
      circularity={circularityData}
      materials={materialsData}
    />
  );
}
