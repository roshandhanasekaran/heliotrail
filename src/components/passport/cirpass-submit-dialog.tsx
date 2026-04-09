"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Passport } from "@/types/passport";
import {
  SendIcon,
  LoaderIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  XIcon,
  ShieldCheckIcon,
  HashIcon,
  TicketIcon,
  ClockIcon,
} from "lucide-react";

interface CirpassSubmitDialogProps {
  passport: Passport;
  open: boolean;
  onClose: () => void;
}

type SubmitPhase = "confirm" | "anchoring" | "submitting" | "success" | "error";

interface SubmitResult {
  anchor?: {
    id: string;
    payloadHash: string;
    anchoredAt: string;
    passportVersion: number;
  };
  submission?: {
    id: string;
    status: string;
    receiptId: string | null;
    submittedAt: string;
  };
  error?: string;
  details?: string;
}

export function CirpassSubmitDialog({
  passport,
  open,
  onClose,
}: CirpassSubmitDialogProps) {
  const [phase, setPhase] = useState<SubmitPhase>("confirm");
  const [result, setResult] = useState<SubmitResult | null>(null);

  const handleSubmit = async () => {
    setPhase("anchoring");

    try {
      // Brief pause to show anchoring state
      await new Promise((r) => setTimeout(r, 800));
      setPhase("submitting");

      const response = await fetch(
        `/api/passports/${passport.id}/submit-to-cirpass`,
        { method: "POST" }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
        setPhase("success");
      } else {
        setResult(data);
        setPhase("error");
      }
    } catch {
      setResult({ error: "Network error. Please try again." });
      setPhase("error");
    }
  };

  const handleClose = () => {
    setPhase("confirm");
    setResult(null);
    onClose();
  };

  const handleRetry = () => {
    setResult(null);
    setPhase("confirm");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={phase === "confirm" || phase === "success" || phase === "error" ? handleClose : undefined}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-lg mx-4 bg-white border border-[#D9D9D9] shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D9D9D9] px-6 py-4">
          <h2 className="text-lg font-bold text-[#0D0D0D]">
            Submit to CIRPASS 2
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-[#737373] hover:text-[#0D0D0D] transition-colors"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {phase === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm text-[#737373] mb-4">
                  This will anchor and submit the following passport to the
                  CIRPASS 2 digital product passport registry.
                </p>

                <div className="border border-[#D9D9D9] p-4 mb-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#737373] uppercase tracking-wider font-semibold">
                      Model
                    </span>
                    <span className="text-sm font-medium text-[#0D0D0D]">
                      {passport.model_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#737373] uppercase tracking-wider font-semibold">
                      Manufacturer
                    </span>
                    <span className="text-sm font-medium text-[#0D0D0D]">
                      {passport.manufacturer_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#737373] uppercase tracking-wider font-semibold">
                      Passport ID
                    </span>
                    <span className="text-sm font-mono text-[#0D0D0D]">
                      {passport.pv_passport_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#737373] uppercase tracking-wider font-semibold">
                      Version
                    </span>
                    <span className="text-sm text-[#0D0D0D]">
                      v{passport.passport_version}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-[#737373] border border-[#D9D9D9] hover:bg-[#F2F2F2] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-[#22C55E] text-[#0D0D0D] hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all"
                  >
                    <SendIcon className="h-3.5 w-3.5" />
                    Confirm Submission
                  </button>
                </div>
              </motion.div>
            )}

            {(phase === "anchoring" || phase === "submitting") && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 gap-4"
              >
                <LoaderIcon className="h-8 w-8 text-[#22C55E] animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#0D0D0D]">
                    {phase === "anchoring"
                      ? "Anchoring passport..."
                      : "Submitting to CIRPASS 2..."}
                  </p>
                  <p className="text-xs text-[#737373] mt-1">
                    {phase === "anchoring"
                      ? "Computing integrity hash and recording anchor"
                      : "Sending DPP data to the CIRPASS 2 registry"}
                  </p>
                </div>

                {/* Progress steps */}
                <div className="w-full max-w-xs space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="h-4 w-4 text-[#22C55E]" />
                    <span className="text-xs text-[#0D0D0D]">
                      DPP payload assembled
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {phase === "submitting" ? (
                      <CheckCircle2Icon className="h-4 w-4 text-[#22C55E]" />
                    ) : (
                      <LoaderIcon className="h-4 w-4 text-[#737373] animate-spin" />
                    )}
                    <span
                      className={cn(
                        "text-xs",
                        phase === "submitting"
                          ? "text-[#0D0D0D]"
                          : "text-[#737373]"
                      )}
                    >
                      SHA-256 integrity hash computed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {phase === "submitting" ? (
                      <LoaderIcon className="h-4 w-4 text-[#737373] animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-[#D9D9D9]" />
                    )}
                    <span className="text-xs text-[#737373]">
                      Submitting to CIRPASS 2 portal
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "success" && result && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-4 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                >
                  <CheckCircle2Icon className="h-12 w-12 text-[#22C55E]" />
                </motion.div>

                <div className="text-center">
                  <p className="text-lg font-bold text-[#0D0D0D]">
                    Successfully Registered
                  </p>
                  <p className="text-sm text-[#737373] mt-1">
                    Passport accepted by CIRPASS 2 registry
                  </p>
                </div>

                <div className="w-full border border-[#D9D9D9] p-4 space-y-3 mt-2">
                  {result.submission?.receiptId && (
                    <div className="flex items-start gap-2">
                      <TicketIcon className="h-4 w-4 text-[#22C55E] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold">
                          Receipt ID
                        </p>
                        <p className="text-sm font-mono text-[#0D0D0D] break-all">
                          {result.submission.receiptId}
                        </p>
                      </div>
                    </div>
                  )}
                  {result.anchor?.payloadHash && (
                    <div className="flex items-start gap-2">
                      <HashIcon className="h-4 w-4 text-[#22C55E] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold">
                          Anchor Hash (SHA-256)
                        </p>
                        <p className="text-xs font-mono text-[#0D0D0D] break-all">
                          {result.anchor.payloadHash}
                        </p>
                      </div>
                    </div>
                  )}
                  {result.anchor?.anchoredAt && (
                    <div className="flex items-start gap-2">
                      <ClockIcon className="h-4 w-4 text-[#737373] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold">
                          Anchored At
                        </p>
                        <p className="text-sm text-[#0D0D0D]">
                          {new Date(result.anchor.anchoredAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {result.anchor?.passportVersion != null && (
                    <div className="flex items-start gap-2">
                      <ShieldCheckIcon className="h-4 w-4 text-[#737373] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#737373] uppercase tracking-wider font-semibold">
                          Passport Version
                        </p>
                        <p className="text-sm text-[#0D0D0D]">
                          v{result.anchor.passportVersion}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleClose}
                  className="mt-2 px-5 py-2 text-sm font-semibold bg-[#22C55E] text-[#0D0D0D] hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all"
                >
                  Done
                </button>
              </motion.div>
            )}

            {phase === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-4 gap-4"
              >
                <AlertCircleIcon className="h-12 w-12 text-red-500" />

                <div className="text-center">
                  <p className="text-lg font-bold text-[#0D0D0D]">
                    Submission Failed
                  </p>
                  <p className="text-sm text-[#737373] mt-1">
                    {result?.error ?? "An unexpected error occurred"}
                  </p>
                  {result?.details && (
                    <p className="text-xs text-red-500 mt-2 font-mono">
                      {result.details}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-[#737373] border border-[#D9D9D9] hover:bg-[#F2F2F2] transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-[#22C55E] text-[#0D0D0D] hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all"
                  >
                    Retry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
