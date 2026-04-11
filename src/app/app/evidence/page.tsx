import { createClient } from "@/lib/supabase/server";
import { UploadEvidenceButton } from "@/components/app/upload-evidence-button";
import { EvidenceVaultClient } from "@/components/app/evidence-vault-client";
import { PageHeader } from "@/components/shared/page-header";

export default async function EvidenceVaultPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("passport_documents")
    .select("*, passports(model_id, pv_passport_id)")
    .order("created_at", { ascending: false });

  const docs = documents ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Vault"
        subtitle={`${docs.length} document${docs.length !== 1 ? "s" : ""} across all passports`}
        action={<UploadEvidenceButton />}
      />

      <EvidenceVaultClient documents={docs} />
    </div>
  );
}
