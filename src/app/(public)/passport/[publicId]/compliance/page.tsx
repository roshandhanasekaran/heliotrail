import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { ComplianceClient } from "@/components/passport/compliance-client";
import { CERTIFICATE_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { PassportCertificate } from "@/types/passport";
import { AwardIcon } from "lucide-react";

interface Props {
  params: Promise<{ publicId: string }>;
}

export default async function CompliancePage({ params }: Props) {
  const { publicId } = await params;
  const supabase = await createClient();

  const { data: passport } = await supabase
    .from("passports")
    .select("id")
    .eq("public_id", publicId)
    .single();
  if (!passport) notFound();

  const { data: certificates } = await supabase
    .from("passport_certificates")
    .select("*")
    .eq("passport_id", passport.id)
    .order("issued_date", { ascending: false });

  const certs = (certificates ?? []) as PassportCertificate[];

  if (certs.length === 0) {
    return (
      <div>
        <EmptyState
          title="No certificates available"
          description="Certificate data has not been added to this passport yet."
          icon={<AwardIcon className="h-10 w-10" />}
        />
      </div>
    );
  }

  const certsData = certs.map((cert) => ({
    id: cert.id,
    standardName: cert.standard_name,
    status: cert.status,
    statusLabel: CERTIFICATE_STATUS_LABELS[cert.status],
    issuer: cert.issuer,
    certificateNumber: cert.certificate_number,
    issuedDate: formatDate(cert.issued_date),
    expiryDate: formatDate(cert.expiry_date),
    scopeNotes: cert.scope_notes,
    documentUrl: cert.document_url,
    documentHash: cert.document_hash,
    hashAlgorithm: cert.hash_algorithm,
  }));

  return <ComplianceClient certs={certsData} />;
}
