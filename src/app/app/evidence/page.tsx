import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_TYPE_LABELS, ACCESS_LEVEL_LABELS } from "@/lib/constants";
import { formatDate, formatFileSize } from "@/lib/utils";
import { FolderOpen, Upload, Search, FileText, Lock, Globe, CheckCircle2 } from "lucide-react";

export default async function EvidenceVaultPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("passport_documents")
    .select("*, passports(model_id, pv_passport_id)")
    .order("created_at", { ascending: false });

  const docs = documents ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D]">Evidence Vault</h1>
          <p className="mt-1 text-sm text-[#737373]">
            {docs.length} document{docs.length !== 1 ? "s" : ""} across all passports
          </p>
        </div>
        <button className="cta-primary text-sm">
          <Upload className="h-4 w-4" />
          Upload Evidence
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A3]" />
        <input
          type="text"
          placeholder="Search documents..."
          className="h-9 w-full border border-[#D9D9D9] bg-white pl-8 pr-3 text-sm placeholder:text-[#A3A3A3] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
        />
      </div>

      {docs.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-16 text-center">
          <FolderOpen className="h-10 w-10 text-[#D9D9D9]" />
          <p className="mt-3 text-sm font-medium text-[#737373]">
            Evidence vault is empty
          </p>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Upload certificates, declarations, or manuals to get started.
          </p>
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D9D9D9] bg-[#FAFAFA]">
                <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373]">
                  Document
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373] md:table-cell">
                  Type
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373] lg:table-cell">
                  Linked Passport
                </th>
                <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373]">
                  Access
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373] sm:table-cell">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9]">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-[#737373]" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#0D0D0D]">
                          {doc.name}
                        </p>
                        {doc.issuer && (
                          <p className="text-xs text-[#A3A3A3]">
                            {doc.issuer}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-[#737373] md:table-cell">
                    {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {doc.passports && (
                      <span className="font-mono text-xs text-[#737373]">
                        {(doc.passports as { model_id: string }).model_id}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {doc.access_level === "public" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#22C55E]">
                        <Globe className="h-3 w-3" /> Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-[#737373]">
                        <Lock className="h-3 w-3" />
                        {ACCESS_LEVEL_LABELS[doc.access_level]}
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {doc.document_hash ? (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    ) : (
                      <span className="text-xs text-[#D9D9D9]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
