import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Documents"
        description="Public documentation, declarations, and technical datasheets"
      />

      {docs.length === 0 ? (
        <EmptyState
          title="No documents available"
          description="Public documents have not been uploaded yet."
          icon={<FileTextIcon className="h-10 w-10" />}
        />
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex-shrink-0 rounded-md bg-muted p-2.5 text-muted-foreground">
                  <FileTextIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium leading-tight">{doc.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                        </Badge>
                        {doc.mime_type && (
                          <span className="text-xs text-muted-foreground">
                            {doc.mime_type.split("/")[1]?.toUpperCase()}
                          </span>
                        )}
                        {doc.file_size_bytes != null && (
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(doc.file_size_bytes)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {doc.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {doc.description}
                    </p>
                  )}
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    {doc.issuer && <span>Issued by {doc.issuer}</span>}
                    {doc.issued_date && <span>{formatDate(doc.issued_date)}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
