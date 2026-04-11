"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";

interface ExportButtonProps {
  exportUrl: string;
  fileName?: string;
}

export function ExportButton({ exportUrl, fileName }: ExportButtonProps) {
  const [loading, setLoading] = useState<"pdf" | "excel" | null>(null);
  const [open, setOpen] = useState(false);

  const handleExport = async (format: "pdf" | "excel") => {
    setLoading(format);
    setOpen(false);
    try {
      const sep = exportUrl.includes("?") ? "&" : "?";
      const res = await fetch(`${exportUrl}${sep}format=${format}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        fileName ??
        (format === "pdf" ? "report.pdf" : "report.xlsx");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading != null}
        className="cta-secondary flex items-center gap-1.5 text-xs"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Download className="h-3 w-3" />
        )}
        Export
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded border border-border bg-background shadow-lg">
            <button
              onClick={() => handleExport("pdf")}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
            >
              <FileText className="h-3.5 w-3.5 text-[#EF4444]" />
              Export as PDF
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#22C55E]" />
              Export as Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
