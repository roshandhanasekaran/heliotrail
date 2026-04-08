import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { DocumentsClient } from "@/components/passport/documents-client";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { PassportDocument } from "@/types/passport";
import { FileTextIcon } from "lucide-react";

interface Props {
  params: Promise<{ publicId: string }>;
}

export default async function DocumentsPage({ params }: Props) {
  const { publicId } = await params;
  const supabase = await createClient();

  const { data: passport } = await supabase
    .from("passports")
    .select("id")
    .eq("public_id", publicId)
    .single();
  if (!passport) notFound();

  const { data: documents } = await supabase
    .from("passport_documents")
    .select("*")
    .eq("passport_id", passport.id)
    .order("created_at", { ascending: false });

  const docs = (documents ?? []) as PassportDocument[];

  if (docs.length === 0) {
    return (
      <div>
        <EmptyState
          title="No documents available"
          description="Public documents have not been uploaded yet."
          icon={<FileTextIcon className="h-10 w-10" />}
        />
      </div>
    );
  }

  const docsData = docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    documentType: doc.document_type,
    documentTypeLabel: DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type,
    mimeType: doc.mime_type,
    fileSizeBytes: doc.file_size_bytes,
    fileSizeFormatted: doc.file_size_bytes != null ? formatFileSize(doc.file_size_bytes) : null,
    description: doc.description,
    issuer: doc.issuer,
    issuedDate: doc.issued_date ? formatDate(doc.issued_date) : null,
  }));

  return <DocumentsClient docs={docsData} />;
}
