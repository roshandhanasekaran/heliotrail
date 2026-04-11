import { createClient } from "@/lib/supabase/server";
import { CheckSquare } from "lucide-react";
import { ApprovalsClient } from "@/components/app/approvals-client";
import { PageHeader } from "@/components/shared/page-header";

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
      <PageHeader
        title="Approvals"
        subtitle="Review and approve passport updates"
      />

      {all.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-16 text-center">
          <CheckSquare className="h-10 w-10 text-border" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No approvals pending
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            When passports are submitted for review, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <ApprovalsClient passports={all} />
      )}
    </div>
  );
}
