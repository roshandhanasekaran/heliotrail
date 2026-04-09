import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { GlassCard } from "@/components/passport/glass-card";
import { FadeIn } from "@/components/ui/fade-in";
import { formatDate } from "@/lib/utils";
import {
  SUBMISSION_STATUS_LABELS,
  ANCHOR_TYPE_LABELS,
} from "@/lib/constants";
import type { PassportAnchor, PassportSubmission } from "@/types/passport";
import {
  AnchorIcon,
  HashIcon,
  ShieldCheckIcon,
  TicketIcon,
  ClockIcon,
  ServerIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
} from "lucide-react";

interface Props {
  params: Promise<{ publicId: string }>;
}

const statusIcon: Record<string, React.ReactNode> = {
  accepted: <CheckCircle2Icon className="h-4 w-4 text-[#22C55E]" />,
  rejected: <XCircleIcon className="h-4 w-4 text-red-500" />,
  error: <AlertCircleIcon className="h-4 w-4 text-red-500" />,
  pending: <LoaderIcon className="h-4 w-4 text-[#737373]" />,
};

const statusColor: Record<string, string> = {
  accepted: "bg-[#22C55E]/10 text-[#16a34a] border-[#22C55E]/20",
  rejected: "bg-red-50 text-red-600 border-red-200",
  error: "bg-red-50 text-red-600 border-red-200",
  pending: "bg-gray-50 text-[#737373] border-[#D9D9D9]",
};

export default async function RegistryPage({ params }: Props) {
  const { publicId } = await params;
  const supabase = await createClient();

  const { data: passport } = await supabase
    .from("passports")
    .select("id, verification_status")
    .eq("public_id", publicId)
    .single();
  if (!passport) notFound();

  const [{ data: anchors }, { data: submissions }] = await Promise.all([
    supabase
      .from("passport_anchors")
      .select("*")
      .eq("passport_id", passport.id)
      .order("anchored_at", { ascending: false }),
    supabase
      .from("passport_submissions")
      .select("*")
      .eq("passport_id", passport.id)
      .order("submitted_at", { ascending: false }),
  ]);

  const anchorList = (anchors ?? []) as PassportAnchor[];
  const submissionList = (submissions ?? []) as PassportSubmission[];

  if (anchorList.length === 0 && submissionList.length === 0) {
    return (
      <EmptyState
        title="No registry activity"
        description="This passport has not been anchored or submitted to any registry yet."
        icon={<AnchorIcon className="h-10 w-10" />}
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Current verification status */}
      <FadeIn>
        <SectionHeader
          title="Registry Status"
          description="Integrity anchoring and CIRPASS 2 registry submissions"
        />

        <GlassCard>
          <div className="flex items-center gap-3 p-5">
            <ShieldCheckIcon
              className={`h-8 w-8 ${
                passport.verification_status === "verified"
                  ? "text-[#22C55E]"
                  : "text-[#737373]"
              }`}
            />
            <div>
              <p className="text-sm font-semibold text-[#0D0D0D]">
                Verification Status
              </p>
              <p className="text-xs text-[#737373] capitalize">
                {passport.verification_status}
              </p>
            </div>
            {submissionList.length > 0 && submissionList[0].response_id && (
              <div className="ml-auto flex items-center gap-2 border border-[#D9D9D9] px-3 py-1.5">
                <TicketIcon className="h-3.5 w-3.5 text-[#22C55E]" />
                <span className="text-xs font-mono text-[#0D0D0D]">
                  {submissionList[0].response_id}
                </span>
              </div>
            )}
          </div>
        </GlassCard>
      </FadeIn>

      {/* Anchor history */}
      {anchorList.length > 0 && (
        <FadeIn delay={0.1}>
          <SectionHeader
            title="Integrity Anchors"
            description="SHA-256 hashes of the canonical DPP payload"
          />

          <div className="space-y-3">
            {anchorList.map((anchor) => (
              <GlassCard key={anchor.id}>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HashIcon className="h-4 w-4 text-[#22C55E]" />
                      <span className="text-sm font-semibold text-[#0D0D0D]">
                        v{anchor.passport_version}
                      </span>
                    </div>
                    <span className="text-xs text-[#737373] border border-[#D9D9D9] px-2 py-0.5">
                      {ANCHOR_TYPE_LABELS[anchor.anchor_type] ?? anchor.anchor_type}
                    </span>
                  </div>

                  <div className="bg-[#F8F8F8] border border-[#E5E5E5] px-3 py-2">
                    <p className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold mb-1">
                      Payload Hash ({anchor.hash_algorithm})
                    </p>
                    <p className="text-xs font-mono text-[#0D0D0D] break-all">
                      {anchor.payload_hash}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                    <ClockIcon className="h-3 w-3" />
                    {formatDate(anchor.anchored_at)}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Submission history */}
      {submissionList.length > 0 && (
        <FadeIn delay={0.2}>
          <SectionHeader
            title="CIRPASS 2 Submissions"
            description="History of submissions to the CIRPASS 2 digital product passport registry"
          />

          <div className="space-y-3">
            {submissionList.map((sub) => (
              <GlassCard key={sub.id}>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ServerIcon className="h-4 w-4 text-[#737373]" />
                      <span className="text-sm font-semibold text-[#0D0D0D] capitalize">
                        {sub.target_registry}
                      </span>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 border ${
                        statusColor[sub.submission_status] ?? statusColor.pending
                      }`}
                    >
                      {statusIcon[sub.submission_status]}
                      {SUBMISSION_STATUS_LABELS[sub.submission_status] ??
                        sub.submission_status}
                    </span>
                  </div>

                  {sub.response_id && (
                    <div className="flex items-center gap-2">
                      <TicketIcon className="h-3.5 w-3.5 text-[#22C55E]" />
                      <span className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold">
                        Receipt
                      </span>
                      <span className="text-xs font-mono text-[#0D0D0D]">
                        {sub.response_id}
                      </span>
                    </div>
                  )}

                  {sub.error_message && (
                    <div className="bg-red-50 border border-red-200 px-3 py-2">
                      <p className="text-xs text-red-600">{sub.error_message}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                    <ClockIcon className="h-3 w-3" />
                    {formatDate(sub.submitted_at)}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
