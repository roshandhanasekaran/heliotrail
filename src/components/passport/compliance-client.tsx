"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import { ShieldCheckIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "lucide-react";

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
}

interface ComplianceClientProps {
  certs: CertData[];
}

const statusConfig: Record<string, { color: string; icon: typeof CheckCircleIcon }> = {
  valid: { color: "#4caf50", icon: CheckCircleIcon },
  expired: { color: "#ef4444", icon: XCircleIcon },
  revoked: { color: "#ef4444", icon: XCircleIcon },
  pending: { color: "#ff9800", icon: ClockIcon },
};

export function ComplianceClient({ certs }: ComplianceClientProps) {
  return (
    <div className="space-y-10">
      <SectionTitle
        title="Compliance & Certifications"
        description="Standards, test certifications, and regulatory compliance"
        accentColor="#eab308"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certs.map((cert, i) => {
          const config = statusConfig[cert.status] ?? statusConfig.pending;
          const Icon = config.icon;

          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <GlassCard tilt accentColor={config.color}>
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-base font-semibold leading-tight">
                      {cert.standardName}
                    </h3>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                      }}
                    >
                      <Icon className="h-3 w-3" />
                      {cert.statusLabel}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground/70">Issuer</span>
                      <span className="font-medium">{cert.issuer}</span>
                    </div>
                    {cert.certificateNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground/70">
                          Certificate #
                        </span>
                        <span className="font-mono text-xs">
                          {cert.certificateNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground/70">Issued</span>
                      <span>{cert.issuedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground/70">Expires</span>
                      <span>{cert.expiryDate}</span>
                    </div>
                  </div>

                  {/* Scope notes */}
                  {cert.scopeNotes && (
                    <div className="mt-4 border border-border bg-card px-3 py-2">
                      <div className="flex items-start gap-1.5">
                        <ShieldCheckIcon className="mt-0.5 h-3 w-3 text-primary/60 shrink-0" />
                        <p className="text-xs text-muted-foreground/80">
                          {cert.scopeNotes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
