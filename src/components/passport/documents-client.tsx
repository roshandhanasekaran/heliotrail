"use client";

import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import {
  DownloadIcon,
  FileTextIcon,
  FileCheckIcon,
  BookOpenIcon,
  FlaskConicalIcon,
  ShieldIcon,
  FileIcon,
  LockIcon,
} from "lucide-react";

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
  url: string | null;
  accessLevel: string;
}

interface DocumentsClientProps {
  docs: DocData[];
}

const typeConfig: Record<string, { icon: typeof FileIcon }> = {
  datasheet: { icon: FileTextIcon },
  declaration_of_conformity: { icon: FileCheckIcon },
  manual: { icon: BookOpenIcon },
  epd: { icon: FlaskConicalIcon },
  test_report: { icon: ShieldIcon },
  warranty: { icon: ShieldIcon },
  other: { icon: FileIcon },
};

const accessLabels: Record<string, string> = {
  public: "Public",
  restricted: "Restricted",
  recycler: "Recycler Only",
  authority: "Authority Only",
  internal: "Internal",
};

export function DocumentsClient({ docs }: DocumentsClientProps) {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Documents"
        description="Public documentation, declarations, and technical datasheets"
        icon={FileTextIcon}
      />

      <div className="space-y-2.5">
        {docs.map((doc) => {
          const config = typeConfig[doc.documentType] ?? typeConfig.other;
          const Icon = config.icon;

          return (
            <GlassCard key={doc.id}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F2F2F2]">
                    <Icon className="h-4 w-4 text-[#0D0D0D]" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0D0D0D] truncate">
                          {doc.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="bg-[#F2F2F2] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0D0D0D]">
                            {doc.documentTypeLabel}
                          </span>
                          {doc.mimeType && (
                            <span className="text-[10px] text-[#737373] font-mono">
                              {doc.mimeType.split("/")[1]?.toUpperCase()}
                            </span>
                          )}
                          {doc.fileSizeFormatted && (
                            <span className="text-[10px] text-[#737373]">
                              {doc.fileSizeFormatted}
                            </span>
                          )}
                          {doc.accessLevel !== "public" && (
                            <span className="flex items-center gap-1 bg-[#FEF3C7] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0D0D0D]">
                              <LockIcon className="h-2 w-2" />
                              {accessLabels[doc.accessLevel] ?? doc.accessLevel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Download */}
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="clean-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0D0D0D] shrink-0"
                        >
                          <DownloadIcon className="h-3 w-3" />
                          Download
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#737373] font-medium uppercase tracking-wide shrink-0 py-1.5">
                          Unavailable
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {doc.description && (
                      <p className="mt-2 text-xs text-[#737373] leading-relaxed">
                        {doc.description}
                      </p>
                    )}

                    {/* Issuer + Date */}
                    {(doc.issuer || doc.issuedDate) && (
                      <div className="mt-1.5 flex gap-4 text-[11px] text-[#737373]">
                        {doc.issuer && (
                          <span>
                            Issued by <span className="text-[#0D0D0D]">{doc.issuer}</span>
                          </span>
                        )}
                        {doc.issuedDate && <span>{doc.issuedDate}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
