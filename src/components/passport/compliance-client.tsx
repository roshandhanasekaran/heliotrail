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

const statusConfig: Record<string, { color: string; bgClass: string; textClass: string; icon: typeof CheckCircleIcon }> = {
  valid: { color: "#22c55e", bgClass: "bg-emerald-50 dark:bg-emerald-950/30", textClass: "text-emerald-600 dark:text-emerald-400", icon: CheckCircleIcon },
  expired: { color: "#ef4444", bgClass: "bg-red-50 dark:bg-red-950/30", textClass: "text-red-600 dark:text-red-400", icon: XCircleIcon },
  revoked: { color: "#ef4444", bgClass: "bg-red-50 dark:bg-red-950/30", textClass: "text-red-600 dark:text-red-400", icon: XCircleIcon },
  pending: { color: "#f59e0b", bgClass: "bg-amber-50 dark:bg-amber-950/30", textClass: "text-amber-600 dark:text-amber-400", icon: ClockIcon },
};

export function ComplianceClient({ certs }: ComplianceClientProps) {
  return (
    <div className="space-y-10">
      <SectionTitle
        title="Compliance & Certifications"
        description="Standards, test certifications, and regulatory compliance"
        accentColor="#f59e0b"
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
                <div className="p-5 pt-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-base font-semibold leading-tight">
                      {cert.standardName}
                    </h3>
                    <div
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bgClass} ${config.textClass}`}
                    >
                      <Icon className="h-3 w-3" />
                      {cert.statusLabel}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issuer</span>
                      <span className="font-medium">{cert.issuer}</span>
                    </div>
                    {cert.certificateNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Certificate #
                        </span>
                        <span className="font-mono text-xs">
                          {cert.certificateNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issued</span>
                      <span>{cert.issuedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expires</span>
                      <span>{cert.expiryDate}</span>
                    </div>
                  </div>

                  {cert.scopeNotes && (
                    <div className="mt-4 rounded-lg bg-muted/50 px-3 py-2">
                      <div className="flex items-start gap-1.5">
                        <ShieldCheckIcon className="mt-0.5 h-3 w-3 text-muted-foreground shrink-0" />
                        <p className="text-xs text-muted-foreground">
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
