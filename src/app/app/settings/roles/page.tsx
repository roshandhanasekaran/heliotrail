import { Fragment } from "react";
import { Shield, Check, Minus } from "lucide-react";
import { redirect } from "next/navigation";
import {
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_COLORS,
  PERMISSIONS,
  hasPermission,
  canDo,
  type Role,
} from "@/lib/rbac";
import { currentUser } from "@/lib/mock/settings";

const ROLES: Role[] = ["owner", "admin", "compliance", "editor", "viewer"];

const PERMISSION_GROUPS: { label: string; permissions: string[] }[] = [
  {
    label: "Account",
    permissions: ["profile.edit", "security.edit"],
  },
  {
    label: "Organization",
    permissions: ["org.view", "org.edit", "team.invite", "roles.assign"],
  },
  {
    label: "Passports",
    permissions: [
      "passport.view",
      "passport.edit",
      "passport.submit",
      "passport.approve",
      "passport.publish",
    ],
  },
  {
    label: "Evidence & Compliance",
    permissions: [
      "evidence.view",
      "evidence.upload",
      "regulatory.edit",
      "audit.view",
    ],
  },
  {
    label: "System",
    permissions: [
      "api-keys.manage",
      "notifications.edit",
      "org.transfer",
      "org.delete",
    ],
  },
];

/** Format a permission key into a readable label. e.g. "passport.approve" → "Approve" */
function permLabel(key: string): string {
  const parts = key.split(".");
  const action = parts[parts.length - 1];
  return action.charAt(0).toUpperCase() + action.slice(1).replace(/-/g, " ");
}

/** Full readable capability label. e.g. "passport.approve" → "Passport · Approve" */
function capabilityLabel(key: string): string {
  const [domain, ...rest] = key.split(".");
  const domainLabel = domain.charAt(0).toUpperCase() + domain.slice(1);
  const actionLabel = rest
    .join(".")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `${domainLabel} · ${actionLabel}`;
}

export default function RolesPage() {
  if (!canDo(currentUser.role, "team.view")) {
    redirect("/app/settings/profile");
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Roles &amp; Permissions</h2>
        <p className="text-sm text-[#737373]">
          Overview of role capabilities and the full permission matrix.
        </p>
      </div>

      {/* Role summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((role) => {
          const colors = ROLE_COLORS[role];
          return (
            <div key={role} className="clean-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#737373]" />
                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
                >
                  {ROLE_LABELS[role]}
                </span>
              </div>
              <p className="text-xs text-[#737373] leading-relaxed">
                {ROLE_DESCRIPTIONS[role]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Permission matrix */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-[#D9D9D9] px-5 py-3">
          <Shield className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">
            Permission Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D9D9D9]">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#737373]">
                  Capability
                </th>
                {ROLES.map((role) => {
                  const colors = ROLE_COLORS[role];
                  const firstWord = ROLE_LABELS[role].split(" ")[0];
                  return (
                    <th
                      key={role}
                      className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#737373]"
                    >
                      <span
                        className={`rounded px-2 py-0.5 ${colors.bg} ${colors.text}`}
                      >
                        {firstWord}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_GROUPS.map((group) => (
                <Fragment key={group.label}>
                  {/* Group header row */}
                  <tr className="bg-[#FAFAFA]">
                    <td
                      colSpan={ROLES.length + 1}
                      className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#737373]"
                    >
                      {group.label}
                    </td>
                  </tr>

                  {/* Permission rows */}
                  {group.permissions.map((perm) => {
                    const minRole = PERMISSIONS[perm] as Role | undefined;
                    return (
                      <tr
                        key={perm}
                        className="border-t border-[#D9D9D9] hover:bg-[#FAFAFA]"
                      >
                        <td className="px-5 py-2.5 text-sm text-[#0D0D0D]">
                          {capabilityLabel(perm)}
                        </td>
                        {ROLES.map((role) => {
                          const allowed =
                            minRole !== undefined &&
                            hasPermission(role, minRole);
                          return (
                            <td
                              key={role}
                              className="px-3 py-2.5 text-center"
                            >
                              {allowed ? (
                                <Check
                                  className="mx-auto h-4 w-4"
                                  style={{ color: "#22C55E" }}
                                />
                              ) : (
                                <Minus
                                  className="mx-auto h-4 w-4"
                                  style={{ color: "#D9D9D9" }}
                                />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
