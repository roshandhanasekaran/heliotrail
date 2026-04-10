"use client";

import { useState, useEffect } from "react";
import { Upload, X, CheckCircle2, UploadCloud } from "lucide-react";

const FAKE_FILENAME = "EU_Declaration_of_Conformity_2026.pdf";
const FAKE_FILESIZE = "2.4 MB";
const FAKE_HASH = "a3f8...7d2e";
const UPLOAD_DURATION_MS = 2000;
const AUTO_CLOSE_DELAY_MS = 3000;
const PROGRESS_INTERVAL_MS = 50;

export function UploadEvidenceButton({ className }: { className?: string }) {
  const [showDialog, setShowDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Drive progress bar to 100% over UPLOAD_DURATION_MS
  useEffect(() => {
    if (!uploading) return;

    const steps = UPLOAD_DURATION_MS / PROGRESS_INTERVAL_MS;
    const increment = 100 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        clearInterval(timer);
        setProgress(100);
        setUploading(false);
        setUploaded(true);
      } else {
        setProgress(current);
      }
    }, PROGRESS_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [uploading]);

  // Auto-close after upload completes
  useEffect(() => {
    if (!uploaded) return;
    const timer = setTimeout(() => {
      handleClose();
    }, AUTO_CLOSE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [uploaded]);

  const handleClose = () => {
    setShowDialog(false);
    setUploaded(false);
    setUploading(false);
    setProgress(0);
  };

  const handleUpload = () => {
    if (uploading || uploaded) return;
    setProgress(0);
    setUploading(true);
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className={className ?? "cta-primary text-sm"}
      >
        <Upload className="h-4 w-4" />
        Upload Evidence
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0D0D0D]">
                Upload Evidence
              </h3>
              <button
                onClick={handleClose}
                className="text-[#737373] hover:text-[#0D0D0D]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Success state */}
            {uploaded ? (
              <div className="mt-6 flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-[#22C55E]" />
                <p className="mt-3 text-sm font-medium text-[#0D0D0D]">
                  Document uploaded successfully
                </p>
                <p className="mt-1 text-xs text-[#737373]">
                  SHA-256 hash:{" "}
                  <span className="font-mono text-[#0D0D0D]">{FAKE_HASH}</span>{" "}
                  (verified)
                </p>
                <button
                  onClick={handleClose}
                  className="cta-secondary mt-5 text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Drag-and-drop zone */}
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 w-full cursor-pointer border-2 border-dashed border-[#D9D9D9] bg-[#FAFAFA] py-12 text-center transition-colors hover:border-[#22C55E] hover:bg-[#F0FDF4] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UploadCloud className="mx-auto h-9 w-9 text-[#A3A3A3]" />
                  <p className="mt-3 text-sm font-medium text-[#737373]">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-[#A3A3A3]">
                    PDF, DOC, JPG, PNG up to 50MB
                  </p>
                </button>

                {/* Progress state */}
                {uploading && (
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#737373]">
                      <span className="font-medium text-[#0D0D0D]">
                        {FAKE_FILENAME}
                      </span>
                      <span>{FAKE_FILESIZE}</span>
                    </div>
                    {/* Track */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                      {/* Fill */}
                      <div
                        className="h-full rounded-full bg-[#22C55E] transition-all duration-75"
                        style={{ width: `${Math.round(progress)}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-[#737373]">
                      {Math.round(progress)}%
                    </p>
                  </div>
                )}

                {/* Footer actions */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={handleClose}
                    disabled={uploading}
                    className="cta-secondary text-xs disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="cta-primary text-xs disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
