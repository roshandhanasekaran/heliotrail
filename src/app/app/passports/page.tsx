import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PassportListClient } from "@/components/app/passports/passport-list-client";

export default async function PassportsListPage() {
  const supabase = await createClient();
  const { data: passports } = await supabase
    .from("passports")
    .select("id, pv_passport_id, model_id, module_technology, rated_power_stc_w, status, verification_status, updated_at, serial_number, manufacturer_name")
    .order("updated_at", { ascending: false });

  const all = passports ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D]">Passports</h1>
          <p className="mt-1 text-sm text-[#737373]">
            {all.length} passport{all.length !== 1 ? "s" : ""} in your portfolio
          </p>
        </div>
        <Link href="/app/passports/new" className="cta-primary text-sm">
          <Plus className="h-4 w-4" />
          Create Passport
        </Link>
      </div>

      <PassportListClient passports={all} />
    </div>
  );
}
