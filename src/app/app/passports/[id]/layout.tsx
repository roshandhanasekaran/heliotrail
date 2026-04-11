import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PASSPORT_STATUS_LABELS, VERIFICATION_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { PassportContextNav } from "@/components/app/passports/passport-context-nav";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SubmitForApprovalButton } from "@/components/app/passports/submit-for-approval-button";

export default async function PassportWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: passport } = await supabase
    .from("passports")
    .select("*")
    .eq("id", id)
    .single();

  if (!passport) notFound();

  return (
    <div className="space-y-0">
      {/* Workspace header */}
      <div className="-m-4 mb-0 border-b border-border bg-muted/50 p-4 lg:-m-6 lg:mb-0 lg:p-6">
        <div className="mb-3">
          <Link
            href="/app/passports"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Passports
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {passport.model_id}
            </h1>
            <p className="mt-0.5 font-mono text-sm text-muted-foreground">
              {passport.pv_passport_id}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ${
                  passport.status === "published"
                    ? "status-valid"
                    : passport.status === "under_review"
                      ? "status-pending"
                      : passport.status === "draft"
                        ? "bg-muted text-muted-foreground"
                        : "status-valid"
                }`}
              >
                {PASSPORT_STATUS_LABELS[passport.status] ?? passport.status}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ${
                  passport.verification_status === "verified"
                    ? "status-valid"
                    : "status-pending"
                }`}
              >
                {VERIFICATION_STATUS_LABELS[passport.verification_status]}
              </span>
              <span className="text-xs text-muted-foreground/70">
                Updated {formatDate(passport.updated_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/passport/${passport.public_id}`}
              target="_blank"
              className="cta-secondary text-xs"
            >
              <span className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" /> Preview Public
              </span>
            </Link>
            <SubmitForApprovalButton
              passportId={id}
              currentStatus={passport.status}
            />
          </div>
        </div>
      </div>

      {/* Workspace body with context nav */}
      <div className="flex gap-6 pt-6">
        <PassportContextNav passportId={id} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
