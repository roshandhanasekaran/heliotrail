import { ScrollText, Settings, Users, Key, FileCheck } from "lucide-react";
import { auditLog } from "@/lib/mock/settings";

type ActionMeta = {
  icon: React.ElementType;
  label: string;
};

const ACTION_MAP: Record<string, ActionMeta> = {
  "org.settings.updated": { icon: Settings, label: "Updated org settings" },
  "team.invite.sent": { icon: Users, label: "Sent invitation" },
  "team.role.changed": { icon: Users, label: "Changed team role" },
  "api_key.created": { icon: Key, label: "Created API key" },
  "passport.approved": { icon: FileCheck, label: "Approved passport" },
  "passport.rejected": { icon: FileCheck, label: "Rejected passport" },
  "passport.submitted": { icon: FileCheck, label: "Submitted passport" },
  "regulatory.updated": { icon: Settings, label: "Updated regulatory config" },
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`;
}

export default function AuditLogPage() {
  const sorted = [...auditLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Audit Log</h2>
        <p className="text-sm text-muted-foreground">
          A tamper-evident record of all actions taken in your workspace.
        </p>
      </div>

      {/* Timeline card */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <ScrollText className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Recent Activity
          </h3>
          <span className="ml-auto rounded bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {sorted.length}
          </span>
        </div>

        <div className="divide-y divide-border">
          {sorted.map((entry) => {
            const meta = ACTION_MAP[entry.action] ?? {
              icon: Settings,
              label: entry.action,
            };
            const Icon = meta.icon;

            return (
              <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
                {/* Icon box */}
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{entry.actor}</span>{" "}
                    <span className="text-muted-foreground">{meta.label}</span>{" "}
                    <span className="font-medium">{entry.target}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">
                    {entry.details}
                  </p>
                </div>

                {/* Timestamp */}
                <p className="shrink-0 text-xs text-muted-foreground/70">
                  {formatTimestamp(entry.timestamp)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
