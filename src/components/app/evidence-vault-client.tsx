"use client";

import { useMemo, useState } from "react";
import { DOCUMENT_TYPE_LABELS, ACCESS_LEVEL_LABELS } from "@/lib/constants";
import {
  Search,
  FileText,
  Lock,
  Globe,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

type DocumentRow = {
  id: string;
  name: string;
  issuer: string | null;
  document_type: string;
  access_level: string;
  document_hash: string | null;
  passports: { model_id: string; pv_passport_id: string } | null;
};

export function EvidenceVaultClient({ documents }: { documents: DocumentRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return documents;
    const q = search.toLowerCase();
    return documents.filter((doc) => {
      const typeLabel = (DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type).toLowerCase();
      const modelId = doc.passports?.model_id?.toLowerCase() ?? "";
      return (
        doc.name.toLowerCase().includes(q) ||
        (doc.issuer?.toLowerCase().includes(q) ?? false) ||
        typeLabel.includes(q) ||
        modelId.includes(q)
      );
    });
  }, [documents, search]);

  const isSearching = search.trim().length > 0;

  return (
    <>
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
        />
      </div>

      {/* Result count */}
      {isSearching && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} of {documents.length} document{documents.length !== 1 ? "s" : ""} match &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-16 text-center">
          <FolderOpen className="h-10 w-10 text-[#D9D9D9]" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {isSearching ? "No documents match your search" : "Evidence vault is empty"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isSearching
              ? "Try a different keyword or clear your search."
              : "Upload certificates, declarations, or manuals to get started."}
          </p>
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Document
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground md:table-cell">
                  Type
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground lg:table-cell">
                  Linked Passport
                </th>
                <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Access
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9]">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {doc.name}
                        </p>
                        {doc.issuer && (
                          <p className="text-xs text-muted-foreground">
                            {doc.issuer}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                    {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {doc.passports && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {doc.passports.model_id}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {doc.access_level === "public" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#22C55E]">
                        <Globe className="h-3 w-3" /> Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        {ACCESS_LEVEL_LABELS[doc.access_level] ?? doc.access_level}
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
    </>
  );
}
