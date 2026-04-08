"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import { DownloadIcon, FileIcon } from "lucide-react";

interface DocData {
  id: string;
  name: string;
  documentType: string;
  documentTypeLabel: string;
  mimeType: string | null;
  fileSizeBytes: number | null;
  fileSizeFormatted: string | null;
  description: string | null;
  issuer: string | null;
  issuedDate: string | null;
}

interface DocumentsClientProps {
  docs: DocData[];
}

const typeColors: Record<string, string> = {
  datasheet: "#3b82f6",
  declaration_of_conformity: "#22c55e",
  manual: "#f59e0b",
  epd: "#8b5cf6",
  test_report: "#ef4444",
  warranty: "#06b6d4",
  other: "#64748b",
};

export function DocumentsClient({ docs }: DocumentsClientProps) {
  return (
    <div className="space-y-10">
      <SectionTitle
        title="Documents"
        description="Public documentation, declarations, and technical datasheets"
        accentColor="#8b5cf6"
      />

      <div className="space-y-3">
        {docs.map((doc, i) => {
          const color = typeColors[doc.documentType] ?? typeColors.other;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <GlassCard accentColor={color}>
                <div className="flex items-start gap-4 p-5 pt-6">
                  {/* File icon */}
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${color}12`,
                    }}
                  >
                    <FileIcon className="h-5 w-5" style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold leading-tight">
                          {doc.name}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                            style={{
                              backgroundColor: `${color}12`,
                              color,
                            }}
                          >
                            {doc.documentTypeLabel}
                          </span>
                          {doc.mimeType && (
                            <span className="text-xs text-muted-foreground">
                              {doc.mimeType.split("/")[1]?.toUpperCase()}
                            </span>
                          )}
                          {doc.fileSizeFormatted && (
                            <span className="text-xs text-muted-foreground">
                              {doc.fileSizeFormatted}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                        style={{
                          backgroundColor: `${color}08`,
                        }}
                      >
                        <DownloadIcon
                          className="h-3.5 w-3.5"
                          style={{ color }}
                        />
                      </div>
                    </div>

                    {doc.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {doc.description}
                      </p>
                    )}

                    <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                      {doc.issuer && <span>Issued by {doc.issuer}</span>}
                      {doc.issuedDate && <span>{doc.issuedDate}</span>}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
