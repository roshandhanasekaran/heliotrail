import { createClient } from "@/lib/supabase/server";
import { CheckSquare } from "lucide-react";
import { ApprovalsClient } from "@/components/app/approvals-client";

export default async function ApprovalsPage() {
  const supabase = await createClient();
  const { data: passports } = await supabase
    .from("passports")
    .select("id, model_id, pv_passport_id, status, updated_at, manufacturer_name")
    .in("status", ["under_review", "approved"])
    .order("updated_at", { ascending: false });

  const all = passports ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D]">Approvals</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Review and approve passport updates
        </p>
      </div>

      {all.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-16 text-center">
          <CheckSquare className="h-10 w-10 text-[#D9D9D9]" />
          <p className="mt-3 text-sm font-medium text-[#737373]">
            No approvals pending
          </p>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            When passports are submitted for review, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <ApprovalsClient passports={all} />
      )}
    </div>
  );
}
