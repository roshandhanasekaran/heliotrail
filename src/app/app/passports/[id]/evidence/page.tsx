import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DOCUMENT_TYPE_LABELS, ACCESS_LEVEL_LABELS } from "@/lib/constants";
import { formatDate, formatFileSize } from "@/lib/utils";
import { FolderOpen, FileText, Lock, Globe, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { UploadEvidenceButton } from "@/components/app/upload-evidence-button";

export default async function EvidencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: passport }, { data: documents }] = await Promise.all([
    supabase.from("passports").select("id").eq("id", id).single(),
    supabase
      .from("passport_documents")
      .select("*")
      .eq("passport_id", id)
      .order("created_at"),
  ]);

  if (!passport) notFound();

  const docs = documents ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Evidence</h2>
        <UploadEvidenceButton className="cta-primary text-xs" />
      </div>

      {docs.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-10 w-10" />}
          title="No evidence uploaded"
          description="Upload certificates, declarations, or manuals so this passport can move to review."
        />
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="clean-card flex items-center gap-4 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {doc.name}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                  </span>
                  {doc.issuer && (
                    <>
                      <span className="text-border">·</span>
                      <span>{doc.issuer}</span>
                    </>
                  )}
                  {doc.issued_date && (
                    <>
                      <span className="text-border">·</span>
                      <span>{formatDate(doc.issued_date)}</span>
                    </>
                  )}
                  {doc.file_size_bytes && (
                    <>
                      <span className="text-border">·</span>
                      <span>{formatFileSize(doc.file_size_bytes)}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {doc.access_level === "public" ? (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Globe className="h-3 w-3" /> Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    {ACCESS_LEVEL_LABELS[doc.access_level] ?? doc.access_level}
                  </span>
                )}
              </div>
              {doc.document_hash && (
                <div className="hidden items-center gap-1 text-xs text-primary lg:flex">
                  <span className="inline-flex h-4 w-4 items-center justify-center bg-[var(--passport-green-muted)] text-[9px] font-bold">
                    ✓
                  </span>
                  Hashed
                </div>
              )}
              {doc.url && (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">View</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
