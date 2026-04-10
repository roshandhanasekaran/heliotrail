import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CERTIFICATE_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, XCircle, ExternalLink, Fingerprint } from "lucide-react";

export default async function CompliancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: passport }, { data: certificates }] = await Promise.all([
    supabase.from("passports").select("id").eq("id", id).single(),
    supabase
      .from("passport_certificates")
      .select("*")
      .eq("passport_id", id)
      .order("created_at"),
  ]);

  if (!passport) notFound();

  const certs = certificates ?? [];
  const validCount = certs.filter((c) => c.status === "valid").length;

  const statusIcon = {
    valid: CheckCircle2,
    expired: XCircle,
    revoked: XCircle,
    pending: Clock,
  };

  const statusColor = {
    valid: "text-[#22C55E]",
    expired: "text-red-500",
    revoked: "text-red-500",
    pending: "text-[#F59E0B]",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0D0D0D]">Compliance</h2>
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="h-4 w-4 text-[#22C55E]" />
          <span className="text-[#737373]">
            {validCount}/{certs.length} certificates valid
          </span>
        </div>
      </div>

      {certs.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-12 text-center">
          <ShieldCheck className="h-8 w-8 text-[#D9D9D9]" />
          <p className="mt-3 text-sm font-medium text-[#737373]">
            No certificates recorded
          </p>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Upload compliance certificates for this passport.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {certs.map((cert) => {
            const Icon = statusIcon[cert.status as keyof typeof statusIcon] ?? Clock;
            const color = statusColor[cert.status as keyof typeof statusColor] ?? "text-[#737373]";

            return (
              <div key={cert.id} className="clean-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#0D0D0D]">
                      {cert.standard_name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#737373]">
                      {cert.issuer}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span
                      className={`text-xs font-semibold ${
                        cert.status === "valid"
                          ? "status-valid"
                          : cert.status === "pending"
                            ? "status-pending"
                            : "status-expired"
                      } px-1.5 py-0.5`}
                    >
                      {CERTIFICATE_STATUS_LABELS[cert.status] ?? cert.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-[#737373]">
                  {cert.issued_date && (
                    <span>Issued: {formatDate(cert.issued_date)}</span>
                  )}
                  {cert.expiry_date && (
                    <span>Expires: {formatDate(cert.expiry_date)}</span>
                  )}
                </div>
                {cert.certificate_number && (
                  <p className="mt-1 font-mono text-xs text-[#A3A3A3]">
                    #{cert.certificate_number}
                  </p>
                )}
                {cert.scope_notes && (
                  <p className="mt-1 text-xs text-[#737373]">
                    {cert.scope_notes}
                  </p>
                )}
                {(cert.document_url || cert.document_hash) && (
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    {cert.document_url && (
                      <a
                        href={cert.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#22C55E] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> View Document
                      </a>
                    )}
                    {cert.document_hash && (
                      <span className="inline-flex items-center gap-1 text-[#737373]">
                        <Fingerprint className="h-3 w-3" />
                        <span className="font-mono">
                          {cert.hash_algorithm ?? "SHA-256"}:{" "}
                          {cert.document_hash.substring(0, 16)}...
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
