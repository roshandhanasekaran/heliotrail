import { createClient } from "@/lib/supabase/server";
import { UploadEvidenceButton } from "@/components/app/upload-evidence-button";
import { EvidenceVaultClient } from "@/components/app/evidence-vault-client";

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
          <h1 className="text-2xl font-bold text-foreground">Evidence Vault</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {docs.length} document{docs.length !== 1 ? "s" : ""} across all passports
          </p>
        </div>
        <UploadEvidenceButton />
      </div>

      <EvidenceVaultClient documents={docs} />
    </div>
  );
}
