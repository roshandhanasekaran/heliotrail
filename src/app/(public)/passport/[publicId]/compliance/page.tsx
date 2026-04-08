import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CERTIFICATE_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { PassportCertificate } from "@/types/passport";
import { AwardIcon, ShieldCheckIcon } from "lucide-react";

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

  const statusColor: Record<string, string> = {
    valid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    revoked: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Compliance & Certifications"
        description="Standards, test certifications, and regulatory compliance"
      />

      {certs.length === 0 ? (
        <EmptyState
          title="No certificates available"
          description="Certificate data has not been added to this passport yet."
          icon={<AwardIcon className="h-10 w-10" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert) => (
            <Card key={cert.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-tight">
                    {cert.standard_name}
                  </CardTitle>
                  <Badge className={statusColor[cert.status] ?? ""}>
                    {CERTIFICATE_STATUS_LABELS[cert.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issuer</span>
                  <span className="font-medium">{cert.issuer}</span>
                </div>
                {cert.certificate_number && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate #</span>
                    <span className="font-mono text-xs">{cert.certificate_number}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued</span>
                  <span>{formatDate(cert.issued_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span>{formatDate(cert.expiry_date)}</span>
                </div>
                {cert.scope_notes && (
                  <p className="mt-2 text-xs text-muted-foreground border-t border-border pt-2">
                    <ShieldCheckIcon className="mr-1 inline h-3 w-3" />
                    {cert.scope_notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
