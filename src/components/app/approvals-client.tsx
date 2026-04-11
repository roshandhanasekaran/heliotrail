"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

type Passport = {
  id: string;
  model_id: string;
  pv_passport_id: string;
  status: string;
  updated_at: string;
  manufacturer_name: string;
};

type Props = {
  passports: Passport[];
};

export function ApprovalsClient({ passports }: Props) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleApprove(p: Passport) {
    setStatuses((prev) => ({ ...prev, [p.id]: "approved" }));
    showToast(`${p.model_id} approved`);
  }

  function handleReject(p: Passport) {
    setStatuses((prev) => ({ ...prev, [p.id]: "rejected" }));
    showToast(`${p.model_id} sent back for revision`);
  }

  function effectiveStatus(p: Passport): string {
    return statuses[p.id] ?? p.status;
  }

  const all = passports.map((p) => ({ ...p, effectiveStatus: effectiveStatus(p) }));
  const pendingCount = all.filter((p) => p.effectiveStatus === "under_review").length;
  const approvedCount = all.filter((p) => p.effectiveStatus === "approved").length;

  return (
    <>
      {toastMessage && (
        <div className="flex items-center gap-2 bg-[var(--passport-green-muted)] px-4 py-2 text-sm font-medium text-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary */}
      <div className="flex gap-3">
        <div className="inline-flex items-center gap-2 border border-dashed border-[#F59E0B] bg-[var(--passport-amber-muted)] px-3 py-1.5 text-sm">
          <Clock className="h-3.5 w-3.5 text-[#F59E0B]" />
          <span>{pendingCount} pending</span>
        </div>
        <div className="inline-flex items-center gap-2 border border-dashed border-primary bg-[var(--passport-green-muted)] px-3 py-1.5 text-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          <span>{approvedCount} approved</span>
        </div>
      </div>

      <div className="space-y-2">
        {all.map((p) => {
          const isPending = p.effectiveStatus === "under_review";
          const isRejected = p.effectiveStatus === "rejected";

          return (
            <div
              key={p.id}
              className="clean-card flex items-center justify-between px-4 py-3"
            >
              <Link
                href={`/app/passports/${p.id}/overview`}
                className="flex flex-1 items-center gap-4 transition-colors hover:opacity-80"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center ${
                    isPending
                      ? "bg-[var(--passport-amber-muted)]"
                      : isRejected
                      ? "bg-red-100"
                      : "bg-[var(--passport-green-muted)]"
                  }`}
                >
                  {isPending ? (
                    <Clock className="h-5 w-5 text-[#F59E0B]" />
                  ) : isRejected ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {p.model_id}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {p.pv_passport_id}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground/70">
                  {formatDate(p.updated_at)}
                </span>
                <StatusBadge status={p.effectiveStatus} />

                {isPending && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(p)}
                      className="inline-flex items-center gap-1 border border-primary px-3 py-1 text-xs font-medium text-primary hover:bg-[var(--passport-green-muted)]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(p)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
