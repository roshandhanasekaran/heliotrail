// src/lib/rbac.ts

export type Role = "owner" | "admin" | "compliance" | "editor" | "viewer";

const ROLE_HIERARCHY: Role[] = ["owner", "admin", "compliance", "editor", "viewer"];

/** Returns true if `userRole` meets or exceeds `requiredRole` in the hierarchy. */
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) <= ROLE_HIERARCHY.indexOf(requiredRole);
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  compliance: "Compliance Officer",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Full control. Billing, delete org, transfer ownership.",
  admin: "Manage team, org settings, API keys, all passport operations.",
  compliance: "Approve/reject passports, manage evidence, regulatory config.",
  editor: "Create/edit passports, upload evidence, submit for review.",
  viewer: "Read-only access to dashboards, passports, and reports.",
};

export const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
  owner: { bg: "bg-red-100", text: "text-red-700" },
  admin: { bg: "bg-emerald-100", text: "text-emerald-700" },
  compliance: { bg: "bg-indigo-100", text: "text-indigo-700" },
  editor: { bg: "bg-amber-100", text: "text-amber-700" },
  viewer: { bg: "bg-gray-100", text: "text-gray-600" },
};

export const PERMISSIONS: Record<string, Role> = {
  "profile.edit": "viewer",
  "security.edit": "viewer",
  "org.view": "viewer",
  "org.edit": "admin",
  "team.view": "admin",
  "team.invite": "admin",
  "team.remove": "admin",
  "roles.assign": "admin",
  "passport.view": "viewer",
  "passport.edit": "editor",
  "passport.submit": "editor",
  "passport.approve": "compliance",
  "passport.publish": "compliance",
  "evidence.view": "viewer",
  "evidence.upload": "editor",
  "regulatory.edit": "compliance",
  "audit.view": "viewer",
  "api-keys.manage": "admin",
  "notifications.edit": "viewer",
  "org.transfer": "owner",
  "org.delete": "owner",
};

export function canDo(userRole: Role, permission: string): boolean {
  const required = PERMISSIONS[permission];
  if (!required) return false;
  return hasPermission(userRole, required);
}
