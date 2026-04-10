"use client";

import { useState } from "react";
import { Upload, X, CheckCircle2, FileUp } from "lucide-react";

export function UploadEvidenceButton({ className }: { className?: string }) {
  const [showDialog, setShowDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      setTimeout(() => {
        setShowDialog(false);
        setUploaded(false);
      }, 2000);
    }, 1500);
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0D0D0D]">
                Upload Evidence
              </h3>
              <button
                onClick={() => {
                  setShowDialog(false);
                  setUploaded(false);
                }}
                className="text-[#737373] hover:text-[#0D0D0D]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {uploaded ? (
              <div className="mt-6 flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-[#22C55E]" />
                <p className="mt-3 text-sm font-medium text-[#0D0D0D]">
                  Document uploaded successfully
                </p>
                <p className="mt-1 text-xs text-[#737373]">
                  The evidence has been added to the passport.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 flex flex-col items-center border-2 border-dashed border-[#D9D9D9] bg-[#FAFAFA] py-10 text-center">
                  <FileUp className="h-8 w-8 text-[#A3A3A3]" />
                  <p className="mt-3 text-sm font-medium text-[#737373]">
                    Drag & drop files here
                  </p>
                  <p className="mt-1 text-xs text-[#A3A3A3]">
                    PDF, DOCX, or images up to 25 MB
                  </p>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="cta-secondary mt-4 text-xs"
                  >
                    {uploading ? "Uploading..." : "Browse Files"}
                  </button>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setShowDialog(false)}
                    className="cta-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="cta-primary text-xs"
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
