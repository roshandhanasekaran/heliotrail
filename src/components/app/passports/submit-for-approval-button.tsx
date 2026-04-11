"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SubmitForApprovalButton({
  passportId,
  currentStatus,
}: {
  passportId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  if (currentStatus === "published" || currentStatus === "under_review") {
    return null;
  }

  const handleSubmit = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("passports")
      .update({ status: "under_review" })
      .eq("id", passportId);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      router.refresh();
    }, 1500);
  };

  if (submitted) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
        <CheckCircle2 className="h-3.5 w-3.5" /> Submitted for Review
      </span>
    );
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="cta-primary text-xs"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Send className="h-3 w-3" />
      )}
      {loading ? "Submitting..." : "Submit for Approval"}
    </button>
  );
}
