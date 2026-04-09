import { createClient } from "@/lib/supabase/server";
import { PASSPORT_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { CheckSquare, Clock, CheckCircle2, FileEdit } from "lucide-react";

export default async function ApprovalsPage() {
  const supabase = await createClient();
  const { data: passports } = await supabase
    .from("passports")
    .select("*")
    .in("status", ["under_review", "approved"])
    .order("updated_at", { ascending: false });

  const all = passports ?? [];
  const pending = all.filter((p) => p.status === "under_review");
  const approved = all.filter((p) => p.status === "approved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D]">Approvals</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Review and approve passport updates
        </p>
      </div>

      {/* Summary */}
      <div className="flex gap-3">
        <div className="inline-flex items-center gap-2 border border-dashed border-[#F59E0B] bg-[#FEF3C7] px-3 py-1.5 text-sm">
          <Clock className="h-3.5 w-3.5 text-[#F59E0B]" />
          <span>{pending.length} pending</span>
        </div>
        <div className="inline-flex items-center gap-2 border border-dashed border-[#22C55E] bg-[#E8FAE9] px-3 py-1.5 text-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
          <span>{approved.length} approved</span>
        </div>
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
        <div className="space-y-2">
          {all.map((p) => (
            <Link
              key={p.id}
              href={`/app/passports/${p.id}/overview`}
              className="clean-card flex items-center justify-between p-4 transition-colors hover:bg-[#FAFAFA]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center ${
                    p.status === "under_review"
                      ? "bg-[#FEF3C7]"
                      : "bg-[#E8FAE9]"
                  }`}
                >
                  {p.status === "under_review" ? (
                    <Clock className="h-5 w-5 text-[#F59E0B]" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0D0D0D]">
                    {p.model_id}
                  </p>
                  <p className="font-mono text-xs text-[#737373]">
                    {p.pv_passport_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#A3A3A3]">
                  {formatDate(p.updated_at)}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold ${
                    p.status === "under_review"
                      ? "status-pending"
                      : "status-valid"
                  }`}
                >
                  {PASSPORT_STATUS_LABELS[p.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
