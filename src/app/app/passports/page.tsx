import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PassportListClient } from "@/components/app/passports/passport-list-client";
import { PageHeader } from "@/components/shared/page-header";

export default async function PassportsListPage() {
  const supabase = await createClient();
  const { data: passports } = await supabase
    .from("passports")
    .select("id, pv_passport_id, model_id, module_technology, rated_power_stc_w, status, verification_status, updated_at, serial_number, manufacturer_name")
    .order("updated_at", { ascending: false });

  const all = passports ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Passports"
        subtitle={`${all.length} passport${all.length !== 1 ? "s" : ""} in your portfolio`}
        action={
          <Link href="/app/passports/new" className="cta-primary text-sm">
            <Plus className="h-4 w-4" />
            Create Passport
          </Link>
        }
      />

      <PassportListClient passports={all} />
    </div>
  );
}
