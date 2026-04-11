import { cn } from "@/lib/utils";

/**
 * Unified status badge for passports, verification, and certificates.
 *
 * Usage:
 *   <StatusBadge status="published" />
 *   <StatusBadge status="verified" type="verification" />
 *   <StatusBadge status="valid" type="certificate" />
 */

type BadgeType = "passport" | "verification" | "certificate";

/** Maps every known status value to a CSS class + display label */
const STATUS_MAP: Record<string, { className: string; label: string }> = {
  // Passport statuses
  published:      { className: "status-valid",   label: "Published" },
  approved:       { className: "status-valid",   label: "Approved" },
  under_review:   { className: "status-pending", label: "Under Review" },
  draft:          { className: "bg-muted text-muted-foreground", label: "Draft" },
  superseded:     { className: "bg-muted text-muted-foreground", label: "Superseded" },
  archived:       { className: "bg-muted text-muted-foreground", label: "Archived" },
  decommissioned: { className: "bg-muted text-muted-foreground", label: "Decommissioned" },

  // Verification statuses
  verified:     { className: "status-valid",   label: "Verified" },
  pending:      { className: "status-pending", label: "Pending" },
  unverifiable: { className: "status-expired", label: "Unverifiable" },
  outdated:     { className: "status-expired", label: "Outdated" },

  // Approval statuses
  rejected: { className: "bg-red-100 text-red-700", label: "Rejected" },

  // Certificate statuses
  valid:   { className: "status-valid",   label: "Valid" },
  expired: { className: "status-expired", label: "Expired" },
  revoked: { className: "status-expired", label: "Revoked" },
};

interface StatusBadgeProps {
  status: string;
  type?: BadgeType;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const entry = STATUS_MAP[status] ?? {
    className: "bg-muted text-muted-foreground",
    label: status,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-semibold",
        entry.className,
        className,
      )}
    >
      {label ?? entry.label}
    </span>
  );
}
