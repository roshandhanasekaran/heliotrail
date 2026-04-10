"use client";

import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AwardIcon,
  ExternalLinkIcon,
} from "lucide-react";

interface CertData {
  id: string;
  standardName: string;
  status: string;
  statusLabel: string;
  issuer: string;
  certificateNumber: string | null;
  issuedDate: string;
  expiryDate: string;
  scopeNotes: string | null;
  documentUrl: string | null;
  documentHash: string | null;
  hashAlgorithm: string | null;
}

interface ComplianceClientProps {
  certs: CertData[];
}

const statusConfig: Record<
  string,
  { badgeClass: string; icon: typeof CheckCircleIcon }
> = {
  valid: {
    badgeClass: "bg-[#E8FAE9] dark:bg-[#22C55E]/10 text-foreground",
    icon: CheckCircleIcon,
  },
  expired: {
    badgeClass: "bg-[#FEE2E2] dark:bg-red-500/10 text-foreground",
    icon: XCircleIcon,
  },
  revoked: {
    badgeClass: "bg-[#FEE2E2] dark:bg-red-500/10 text-foreground",
    icon: XCircleIcon,
  },
  pending: {
    badgeClass: "bg-[#FEF3C7] dark:bg-amber-500/10 text-foreground",
    icon: ClockIcon,
  },
};

export function ComplianceClient({ certs }: ComplianceClientProps) {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Compliance & Certifications"
        description="Standards, test certifications, and regulatory compliance"
        icon={ShieldCheckIcon}
      />

      {/* Summary bar */}
      <GlassCard>
        <div className="flex flex-wrap items-center justify-center gap-8 px-6 py-4">
          {["valid", "pending", "expired", "revoked"].map((status) => {
            const count = certs.filter((c) => c.status === status).length;
            const config = statusConfig[status];
            if (count === 0) return null;
            const Icon = config.icon;
            return (
              <div key={status} className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center bg-muted">
                  <Icon className="h-3.5 w-3.5 text-foreground" />
                </div>
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {count}
                </span>
                <span className="text-xs text-muted-foreground capitalize font-medium">{status}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Certificate cards */}
      <GlassCard>
        <div className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-muted">
              <AwardIcon className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Certificates</h3>
              <p className="text-[11px] text-muted-foreground">{certs.length} certification{certs.length !== 1 ? "s" : ""} on file</p>
            </div>
          </div>

          <div className="space-y-2">
            {certs.map((cert) => {
              const config = statusConfig[cert.status] ?? statusConfig.pending;
              const Icon = config.icon;

              return (
                <div
                  key={cert.id}
                  className="border border-border bg-background p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-semibold text-foreground truncate">
                          {cert.standardName}
                        </h4>
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.badgeClass}`}
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {cert.statusLabel}
                        </div>
                      </div>

                      {/* Details as inline table */}
                      <div className="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Issuer</span>
                          <span className="text-foreground font-medium">{cert.issuer}</span>
                        </div>
                        {cert.certificateNumber && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Cert #</span>
                            <span className="text-foreground font-mono text-[11px]">
                              {cert.certificateNumber}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Issued</span>
                          <span className="text-foreground">{cert.issuedDate}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Expires</span>
                          <span className="text-foreground">{cert.expiryDate}</span>
                        </div>
                      </div>

                      {cert.documentHash && (
                        <div className="col-span-2 flex justify-between text-xs mt-1">
                          <span className="text-muted-foreground">Integrity</span>
                          <span className="text-muted-foreground font-mono text-[10px] truncate max-w-[200px]" title={cert.documentHash}>
                            {cert.hashAlgorithm?.toUpperCase()}: {cert.documentHash.slice(0, 16)}...
                          </span>
                        </div>
                      )}

                      {cert.scopeNotes && (
                        <p className="col-span-2 mt-2 text-[11px] text-muted-foreground leading-relaxed">
                          {cert.scopeNotes}
                        </p>
                      )}
                    </div>

                    {cert.documentUrl && (
                      <a
                        href={cert.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clean-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground shrink-0"
                      >
                        <ExternalLinkIcon className="h-3 w-3" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
