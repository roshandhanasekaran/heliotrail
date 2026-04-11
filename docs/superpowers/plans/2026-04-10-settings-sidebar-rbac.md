# Settings Sidebar & RBAC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat settings page with a sidebar-navigated, RBAC-aware settings system with 10 functional sub-pages, a 5-role permission model, and realistic mock data.

**Architecture:** Settings becomes a nested layout under `/app/settings/` with its own left sidebar (modeled on the existing `PassportContextNav` pattern). A lightweight RBAC module (`src/lib/rbac.ts`) defines roles and permissions, filtering sidebar visibility and page-level access. All data is mock-first using the same patterns as `src/lib/mock/dynamic-data.ts`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Badge, Button, Card, Input, Label, Separator, Table), Lucide icons.

---

## File Map

### New Files
| File | Responsibility |
|---|---|
| `src/lib/rbac.ts` | Role enum, permission hierarchy, `hasPermission()`, `canAccess()` |
| `src/lib/mock/settings.ts` | All mock data: currentUser, org, team, invites, apiKeys, auditLog, notifications |
| `src/lib/settings-nav.ts` | Settings sidebar sections config with `minRole` per item |
| `src/components/settings/settings-sidebar.tsx` | Settings left sidebar (desktop vertical + mobile horizontal) |
| `src/app/app/settings/layout.tsx` | Settings nested layout wrapping sidebar + content |
| `src/app/app/settings/page.tsx` | Redirect to `/app/settings/profile` (replaces current flat page) |
| `src/app/app/settings/profile/page.tsx` | Profile form |
| `src/app/app/settings/security/page.tsx` | Password + sessions |
| `src/app/app/settings/organization/page.tsx` | Org general settings |
| `src/app/app/settings/team/page.tsx` | Team roster + invite |
| `src/app/app/settings/roles/page.tsx` | Permission matrix (read-only) |
| `src/app/app/settings/regulatory/page.tsx` | Compliance config |
| `src/app/app/settings/audit-log/page.tsx` | Audit log viewer |
| `src/app/app/settings/api-keys/page.tsx` | API key management |
| `src/app/app/settings/notifications/page.tsx` | Notification prefs |
| `src/app/app/settings/danger-zone/page.tsx` | Owner-only destructive actions |

### Modified Files
| File | Change |
|---|---|
| `src/lib/constants.ts` | Add `ROLE_LABELS` record |

---

## Task 1: RBAC Module + Types

**Files:**
- Create: `src/lib/rbac.ts`

- [ ] **Step 1: Create the RBAC module**

```typescript
// src/lib/rbac.ts

export type Role = "owner" | "admin" | "compliance" | "editor" | "viewer";

/**
 * Role hierarchy — lower index = higher privilege.
 * Used for "minimum role" checks: if your role index <= required index, you pass.
 */
const ROLE_HIERARCHY: Role[] = [
  "owner",
  "admin",
  "compliance",
  "editor",
  "viewer",
];

/** Returns true if `userRole` meets or exceeds `requiredRole` in the hierarchy. */
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return (
    ROLE_HIERARCHY.indexOf(userRole) <= ROLE_HIERARCHY.indexOf(requiredRole)
  );
}

/** Human-readable labels for each role. */
export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  compliance: "Compliance Officer",
  editor: "Editor",
  viewer: "Viewer",
};

/** Short descriptions for the permission matrix. */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Full control. Billing, delete org, transfer ownership.",
  admin: "Manage team, org settings, API keys, all passport operations.",
  compliance:
    "Approve/reject passports, manage evidence, regulatory config.",
  editor: "Create/edit passports, upload evidence, submit for review.",
  viewer: "Read-only access to dashboards, passports, and reports.",
};

/** Badge colors per role for the UI. */
export const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
  owner: { bg: "bg-red-100", text: "text-red-700" },
  admin: { bg: "bg-emerald-100", text: "text-emerald-700" },
  compliance: { bg: "bg-indigo-100", text: "text-indigo-700" },
  editor: { bg: "bg-amber-100", text: "text-amber-700" },
  viewer: { bg: "bg-gray-100", text: "text-gray-600" },
};

/**
 * Full permission matrix.
 * Each key is a capability, value is the minimum role required.
 */
export const PERMISSIONS: Record<string, Role> = {
  // Account
  "profile.edit": "viewer",
  "security.edit": "viewer",
  // Organization
  "org.view": "viewer",
  "org.edit": "admin",
  "team.view": "admin",
  "team.invite": "admin",
  "team.remove": "admin",
  "roles.assign": "admin",
  // Passports
  "passport.view": "viewer",
  "passport.edit": "editor",
  "passport.submit": "editor",
  "passport.approve": "compliance",
  "passport.publish": "compliance",
  // Evidence
  "evidence.view": "viewer",
  "evidence.upload": "editor",
  // Compliance
  "regulatory.edit": "compliance",
  "audit.view": "viewer",
  // System
  "api-keys.manage": "admin",
  "notifications.edit": "viewer",
  "org.transfer": "owner",
  "org.delete": "owner",
};

/** Check a specific permission for a user role. */
export function canDo(userRole: Role, permission: string): boolean {
  const required = PERMISSIONS[permission];
  if (!required) return false;
  return hasPermission(userRole, required);
}
```

- [ ] **Step 2: Verify module compiles**

Run: `cd /Users/roshandhanashekeran/Developer/heliotrail && npx tsc --noEmit src/lib/rbac.ts 2>&1 | head -20`
Expected: No errors (or only unrelated project-wide issues)

- [ ] **Step 3: Commit**

```bash
git add src/lib/rbac.ts
git commit -m "feat(settings): add RBAC module with role hierarchy and permissions"
```

---

## Task 2: Mock Data Layer

**Files:**
- Create: `src/lib/mock/settings.ts`

- [ ] **Step 1: Create the mock settings data**

```typescript
// src/lib/mock/settings.ts

import type { Role } from "@/lib/rbac";

/* ── User ── */
export interface MockUser {
  id: string;
  name: string;
  email: string;
  title: string;
  role: Role;
  avatarInitial: string;
}

export const currentUser: MockUser = {
  id: "usr_001",
  name: "Roshan Dhanasekaran",
  email: "roshan@waaree.com",
  title: "Head of Sustainability",
  role: "owner",
  avatarInitial: "R",
};

/* ── Organization ── */
export interface MockOrganization {
  name: string;
  domain: string;
  operatorId: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  defaultFacility: string;
  createdAt: string;
}

export const organization: MockOrganization = {
  name: "Waaree Energies Ltd.",
  domain: "waaree.com",
  operatorId: "EU-EO-2025-IN-WAAREE-001",
  address: {
    street: "Surat Mega Factory, Plot 337",
    city: "Surat",
    postalCode: "394230",
    country: "India",
  },
  defaultFacility: "Surat Mega Factory",
  createdAt: "2025-08-14T09:00:00Z",
};

/* ── Team Members ── */
export interface MockTeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited";
  joinedAt: string;
  lastActive: string;
}

export const teamMembers: MockTeamMember[] = [
  {
    id: "usr_001",
    name: "Roshan Dhanasekaran",
    email: "roshan@waaree.com",
    role: "owner",
    status: "active",
    joinedAt: "2025-08-14T09:00:00Z",
    lastActive: "2026-04-10T08:30:00Z",
  },
  {
    id: "usr_002",
    name: "Priya Sharma",
    email: "priya.sharma@waaree.com",
    role: "admin",
    status: "active",
    joinedAt: "2025-09-01T10:00:00Z",
    lastActive: "2026-04-09T17:45:00Z",
  },
  {
    id: "usr_003",
    name: "Ankit Patel",
    email: "ankit.patel@waaree.com",
    role: "compliance",
    status: "active",
    joinedAt: "2025-10-15T08:00:00Z",
    lastActive: "2026-04-10T07:15:00Z",
  },
  {
    id: "usr_004",
    name: "Meera Gupta",
    email: "meera.gupta@waaree.com",
    role: "editor",
    status: "active",
    joinedAt: "2025-11-20T09:30:00Z",
    lastActive: "2026-04-08T16:20:00Z",
  },
  {
    id: "usr_005",
    name: "Vikram Singh",
    email: "vikram.singh@waaree.com",
    role: "viewer",
    status: "active",
    joinedAt: "2026-01-10T11:00:00Z",
    lastActive: "2026-04-07T14:00:00Z",
  },
];

/* ── Pending Invites ── */
export interface MockInvite {
  id: string;
  email: string;
  role: Role;
  invitedBy: string;
  invitedAt: string;
}

export const pendingInvites: MockInvite[] = [
  {
    id: "inv_001",
    email: "rajesh.kumar@waaree.com",
    role: "editor",
    invitedBy: "Roshan Dhanasekaran",
    invitedAt: "2026-04-08T10:00:00Z",
  },
];

/* ── API Keys ── */
export interface MockApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  scopes: string[];
}

export const apiKeys: MockApiKey[] = [
  {
    id: "key_001",
    name: "ERP Integration — SAP S/4HANA",
    prefix: "ht_live_a3Kx",
    createdAt: "2025-11-01T12:00:00Z",
    lastUsed: "2026-04-10T06:45:00Z",
    scopes: ["passports:read", "passports:write"],
  },
  {
    id: "key_002",
    name: "MES Data Pipeline",
    prefix: "ht_live_p9Qw",
    createdAt: "2026-01-15T08:00:00Z",
    lastUsed: "2026-04-09T23:00:00Z",
    scopes: ["passports:read", "evidence:write"],
  },
  {
    id: "key_003",
    name: "CI/CD Test Key",
    prefix: "ht_test_z2Ym",
    createdAt: "2026-03-20T14:00:00Z",
    lastUsed: null,
    scopes: ["passports:read"],
  },
];

/* ── Audit Log ── */
export interface MockAuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export const auditLog: MockAuditEntry[] = [
  {
    id: "aud_001",
    actor: "Roshan Dhanasekaran",
    action: "org.settings.updated",
    target: "Organization",
    details: "Changed default facility to Surat Mega Factory",
    timestamp: "2026-04-10T08:30:00Z",
  },
  {
    id: "aud_002",
    actor: "Roshan Dhanasekaran",
    action: "team.invite.sent",
    target: "rajesh.kumar@waaree.com",
    details: "Invited as Editor",
    timestamp: "2026-04-08T10:00:00Z",
  },
  {
    id: "aud_003",
    actor: "Priya Sharma",
    action: "api-key.created",
    target: "CI/CD Test Key",
    details: "Created API key ht_test_z2Ym with scope passports:read",
    timestamp: "2026-03-20T14:00:00Z",
  },
  {
    id: "aud_004",
    actor: "Ankit Patel",
    action: "passport.approved",
    target: "WRM-580-TOPCon",
    details: "Approved passport for publication",
    timestamp: "2026-03-18T11:20:00Z",
  },
  {
    id: "aud_005",
    actor: "Meera Gupta",
    action: "passport.submitted",
    target: "WRM-670-HJT",
    details: "Submitted passport for compliance review",
    timestamp: "2026-03-15T09:45:00Z",
  },
  {
    id: "aud_006",
    actor: "Priya Sharma",
    action: "team.role.changed",
    target: "Vikram Singh",
    details: "Changed role from Editor to Viewer",
    timestamp: "2026-02-28T16:30:00Z",
  },
  {
    id: "aud_007",
    actor: "Roshan Dhanasekaran",
    action: "regulatory.updated",
    target: "Compliance Config",
    details: "Updated carbon methodology to JRC Harmonised 2025",
    timestamp: "2026-02-15T13:00:00Z",
  },
  {
    id: "aud_008",
    actor: "Ankit Patel",
    action: "passport.rejected",
    target: "WRM-550-PERC",
    details: "Rejected: missing REACH declaration for cadmium telluride",
    timestamp: "2026-02-10T10:15:00Z",
  },
];

/* ── Notification Preferences ── */
export interface NotificationCategory {
  key: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
}

export const notificationPreferences: NotificationCategory[] = [
  {
    key: "passport_status",
    label: "Passport Status Changes",
    description: "When a passport moves to a new status (approved, published, etc.)",
    email: true,
    inApp: true,
  },
  {
    key: "approval_requests",
    label: "Approval Requests",
    description: "When a passport is submitted for your review",
    email: true,
    inApp: true,
  },
  {
    key: "compliance_deadlines",
    label: "Compliance Deadlines",
    description: "Upcoming certification expirations and regulatory deadlines",
    email: true,
    inApp: false,
  },
  {
    key: "team_activity",
    label: "Team Activity",
    description: "New members joining, role changes, and invitations",
    email: false,
    inApp: true,
  },
  {
    key: "system_alerts",
    label: "System Alerts",
    description: "API key usage warnings, integration failures, and downtime",
    email: true,
    inApp: true,
  },
];

/* ── Regulatory / Compliance Config ── */
export interface RegulatoryConfig {
  carbonMethodology: string;
  reachStatus: string;
  rohsStatus: string;
  uflpaAttestationMode: string;
  weeeCollectionScheme: string;
  certificationStandards: string[];
}

export const regulatoryConfig: RegulatoryConfig = {
  carbonMethodology: "JRC Harmonised 2025",
  reachStatus: "Compliant",
  rohsStatus: "Compliant",
  uflpaAttestationMode: "Per-shipment attestation",
  weeeCollectionScheme: "PV Cycle",
  certificationStandards: [
    "IEC 61215:2021",
    "IEC 61730:2023",
    "UL 61730",
    "BIS IS 14286:2024",
  ],
};
```

- [ ] **Step 2: Verify module compiles**

Run: `cd /Users/roshandhanashekeran/Developer/heliotrail && npx tsc --noEmit src/lib/mock/settings.ts 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/mock/settings.ts
git commit -m "feat(settings): add mock data for settings pages"
```

---

## Task 3: Settings Navigation Config

**Files:**
- Create: `src/lib/settings-nav.ts`

- [ ] **Step 1: Create the settings navigation config**

```typescript
// src/lib/settings-nav.ts

import {
  User,
  Lock,
  Building2,
  Users,
  Shield,
  Scale,
  ScrollText,
  Key,
  Bell,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/rbac";

export interface SettingsNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Minimum role required to see this section. */
  minRole: Role;
}

export interface SettingsNavSection {
  title: string;
  items: SettingsNavItem[];
}

export const SETTINGS_SECTIONS: SettingsNavSection[] = [
  {
    title: "ACCOUNT",
    items: [
      { label: "Profile", href: "/app/settings/profile", icon: User, minRole: "viewer" },
      { label: "Security", href: "/app/settings/security", icon: Lock, minRole: "viewer" },
    ],
  },
  {
    title: "ORGANIZATION",
    items: [
      { label: "General", href: "/app/settings/organization", icon: Building2, minRole: "viewer" },
      { label: "Team", href: "/app/settings/team", icon: Users, minRole: "admin" },
      { label: "Roles & Permissions", href: "/app/settings/roles", icon: Shield, minRole: "admin" },
    ],
  },
  {
    title: "COMPLIANCE",
    items: [
      { label: "Regulatory", href: "/app/settings/regulatory", icon: Scale, minRole: "compliance" },
      { label: "Audit Log", href: "/app/settings/audit-log", icon: ScrollText, minRole: "viewer" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "API Keys", href: "/app/settings/api-keys", icon: Key, minRole: "admin" },
      { label: "Notifications", href: "/app/settings/notifications", icon: Bell, minRole: "viewer" },
      { label: "Danger Zone", href: "/app/settings/danger-zone", icon: AlertTriangle, minRole: "owner" },
    ],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/settings-nav.ts
git commit -m "feat(settings): add settings navigation config with RBAC minRole"
```

---

## Task 4: Settings Sidebar Component

**Files:**
- Create: `src/components/settings/settings-sidebar.tsx`

This follows the exact pattern of `src/components/app/passports/passport-context-nav.tsx` — desktop vertical nav with green active indicator, mobile horizontal scroll strip. Added: RBAC filtering and role badges.

- [ ] **Step 1: Create the settings sidebar component**

```tsx
// src/components/settings/settings-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SETTINGS_SECTIONS } from "@/lib/settings-nav";
import { hasPermission, ROLE_LABELS, type Role } from "@/lib/rbac";

interface SettingsSidebarProps {
  userRole: Role;
}

/** Badge shown on nav items that require elevated roles. */
function RoleBadge({ minRole }: { minRole: Role }) {
  if (minRole === "viewer") return null;

  const colors: Record<string, string> = {
    owner: "bg-red-100 text-red-700",
    admin: "bg-emerald-100 text-emerald-700",
    compliance: "bg-indigo-100 text-indigo-700",
  };

  const labels: Record<string, string> = {
    owner: "OWNER",
    admin: "ADMIN",
    compliance: "COMPLIANCE+",
  };

  return (
    <span
      className={cn(
        "ml-auto shrink-0 px-1.5 py-0.5 text-[0.5625rem] font-bold leading-none",
        colors[minRole] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {labels[minRole] ?? minRole.toUpperCase()}
    </span>
  );
}

export function SettingsSidebar({ userRole }: SettingsSidebarProps) {
  const pathname = usePathname();

  /** Filter sections to only show items the user can access. */
  const visibleSections = SETTINGS_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      hasPermission(userRole, item.minRole)
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile: horizontal scrollable tab strip */}
      <nav className="lg:hidden -mx-4 border-b border-[#D9D9D9] bg-[#FAFAFA] px-4 sm:-mx-6 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {visibleSections.flatMap((section) =>
            section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "nav-pill-active text-[#0D0D0D]"
                      : "border border-transparent text-[#737373] hover:bg-[#F2F2F2] hover:text-[#0D0D0D]"
                  )}
                >
                  <item.icon className="h-3 w-3 shrink-0" />
                  {item.label}
                </Link>
              );
            })
          )}
        </div>
      </nav>

      {/* Desktop: vertical sidebar */}
      <nav className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-20 space-y-4">
          {visibleSections.map((section) => (
            <div key={section.title}>
              <div className="mb-1 px-3 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-[#A3A3A3]">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "border-l-2 border-[#22C55E] bg-[#E8FAE9] font-medium text-[#0D0D0D]"
                          : "border-l-2 border-transparent text-[#737373] hover:bg-[#F2F2F2] hover:text-[#0D0D0D]"
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      <RoleBadge minRole={item.minRole} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/settings/settings-sidebar.tsx
git commit -m "feat(settings): add settings sidebar component with RBAC filtering"
```

---

## Task 5: Settings Layout + Root Redirect

**Files:**
- Create: `src/app/app/settings/layout.tsx`
- Rewrite: `src/app/app/settings/page.tsx`

- [ ] **Step 1: Create the settings layout**

```tsx
// src/app/app/settings/layout.tsx
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { currentUser } from "@/lib/mock/settings";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0">
      {/* Settings header */}
      <div className="-m-4 mb-0 border-b border-[#D9D9D9] bg-[#FAFAFA] p-4 lg:-m-6 lg:mb-0 lg:p-6">
        <h1 className="text-xl font-bold text-[#0D0D0D]">Settings</h1>
        <p className="mt-0.5 text-sm text-[#737373]">
          Manage your account, organization, and workspace configuration
        </p>
      </div>

      {/* Body with sidebar + content */}
      <div className="flex gap-6 pt-6">
        <SettingsSidebar userRole={currentUser.role} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace root settings page with redirect**

```tsx
// src/app/app/settings/page.tsx
import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/app/settings/profile");
}
```

- [ ] **Step 3: Verify navigation works**

Run: `cd /Users/roshandhanashekeran/Developer/heliotrail && npm run build 2>&1 | tail -30`
Expected: Build succeeds (or fails only on missing sub-page files, which is expected)

- [ ] **Step 4: Commit**

```bash
git add src/app/app/settings/layout.tsx src/app/app/settings/page.tsx
git commit -m "feat(settings): add settings layout with sidebar and redirect"
```

---

## Task 6: Profile Page

**Files:**
- Create: `src/app/app/settings/profile/page.tsx`

- [ ] **Step 1: Create the profile settings page**

```tsx
// src/app/app/settings/profile/page.tsx
"use client";

import { useState } from "react";
import { currentUser } from "@/lib/mock/settings";
import { ROLE_LABELS } from "@/lib/rbac";
import { User } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Profile</h2>
        <p className="text-sm text-[#737373]">Manage your personal information</p>
      </div>

      <div className="clean-card">
        <div className="p-5">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center bg-[#22C55E] text-xl font-bold text-white">
              {currentUser.avatarInitial}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0D0D0D]">{currentUser.name}</p>
              <p className="text-xs text-[#737373]">{ROLE_LABELS[currentUser.role]}</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
                Email
              </label>
              <input
                type="email"
                value={currentUser.email}
                readOnly
                className="mt-1 block w-full border border-[#D9D9D9] bg-[#F5F5F5] px-3 py-2 text-sm text-[#737373]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
                Job Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
                Role
              </label>
              <input
                type="text"
                value={ROLE_LABELS[currentUser.role]}
                readOnly
                className="mt-1 block w-full border border-[#D9D9D9] bg-[#F5F5F5] px-3 py-2 text-sm text-[#737373]"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button onClick={handleSave} className="cta-primary text-xs">
              Save Changes
            </button>
            {saved && (
              <span className="text-xs font-medium text-[#22C55E]">Changes saved</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/profile/page.tsx
git commit -m "feat(settings): add profile settings page"
```

---

## Task 7: Security Page

**Files:**
- Create: `src/app/app/settings/security/page.tsx`

- [ ] **Step 1: Create the security settings page**

```tsx
// src/app/app/settings/security/page.tsx
"use client";

import { useState } from "react";
import { Lock, Monitor, Smartphone } from "lucide-react";

const sessions = [
  { id: "s1", device: "MacBook Pro — Chrome", location: "Mumbai, IN", lastActive: "Active now", icon: Monitor, current: true },
  { id: "s2", device: "iPhone 15 — Safari", location: "Mumbai, IN", lastActive: "2 hours ago", icon: Smartphone, current: false },
];

export default function SecurityPage() {
  const [saved, setSaved] = useState(false);

  function handleChangePassword() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Security</h2>
        <p className="text-sm text-[#737373]">Manage your password and active sessions</p>
      </div>

      {/* Change Password */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Lock className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Change Password</h3>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleChangePassword} className="cta-primary text-xs">
              Update Password
            </button>
            {saved && (
              <span className="text-xs font-medium text-[#22C55E]">Password updated</span>
            )}
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Monitor className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Active Sessions</h3>
        </div>
        <div className="divide-y divide-[#E5E5E5]">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <session.icon className="h-4 w-4 text-[#737373]" />
                <div>
                  <p className="text-sm font-medium text-[#0D0D0D]">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 bg-[#E8FAE9] px-1.5 py-0.5 text-[0.625rem] font-bold text-[#22C55E]">
                        CURRENT
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#737373]">{session.location} · {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-xs font-medium text-red-600 hover:text-red-700">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/security/page.tsx
git commit -m "feat(settings): add security settings page with password and sessions"
```

---

## Task 8: Organization General Page

**Files:**
- Create: `src/app/app/settings/organization/page.tsx`

- [ ] **Step 1: Create the organization settings page**

```tsx
// src/app/app/settings/organization/page.tsx
"use client";

import { useState } from "react";
import { currentUser, organization } from "@/lib/mock/settings";
import { canDo } from "@/lib/rbac";
import { Building2 } from "lucide-react";

export default function OrganizationPage() {
  const canEdit = canDo(currentUser.role, "org.edit");
  const [orgName, setOrgName] = useState(organization.name);
  const [operatorId, setOperatorId] = useState(organization.operatorId);
  const [domain, setDomain] = useState(organization.domain);
  const [facility, setFacility] = useState(organization.defaultFacility);
  const [street, setStreet] = useState(organization.address.street);
  const [city, setCity] = useState(organization.address.city);
  const [postalCode, setPostalCode] = useState(organization.address.postalCode);
  const [country, setCountry] = useState(organization.address.country);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputClass = canEdit
    ? "mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
    : "mt-1 block w-full border border-[#D9D9D9] bg-[#F5F5F5] px-3 py-2 text-sm text-[#737373]";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Organization</h2>
        <p className="text-sm text-[#737373]">
          {canEdit
            ? "Manage your organization details and ESPR operator information"
            : "View your organization details (contact an Admin to make changes)"}
        </p>
      </div>

      {/* Org Identity */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Building2 className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Organization Identity</h3>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Organization Name</label>
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} readOnly={!canEdit} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Domain</label>
              <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} readOnly={!canEdit} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Default Facility</label>
              <input type="text" value={facility} onChange={(e) => setFacility(e.target.value)} readOnly={!canEdit} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {/* EU Economic Operator */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <span className="flex h-5 w-5 items-center justify-center bg-[#003399] text-[0.5rem] font-bold text-white">EU</span>
          <h3 className="text-sm font-bold text-[#0D0D0D]">EU Economic Operator (ESPR Art. 8)</h3>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Economic Operator ID</label>
              <input type="text" value={operatorId} onChange={(e) => setOperatorId(e.target.value)} readOnly={!canEdit} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Street Address</label>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} readOnly={!canEdit} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} readOnly={!canEdit} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Postal Code</label>
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} readOnly={!canEdit} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} readOnly={!canEdit} className={inputClass} />
            </div>
          </div>

          {canEdit && (
            <div className="mt-5 flex items-center gap-3">
              <button onClick={handleSave} className="cta-primary text-xs">Save Changes</button>
              {saved && <span className="text-xs font-medium text-[#22C55E]">Changes saved</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/organization/page.tsx
git commit -m "feat(settings): add organization settings page with EU operator fields"
```

---

## Task 9: Team Management Page

**Files:**
- Create: `src/app/app/settings/team/page.tsx`

- [ ] **Step 1: Create the team management page**

```tsx
// src/app/app/settings/team/page.tsx
"use client";

import { useState } from "react";
import { teamMembers, pendingInvites, type MockTeamMember, type MockInvite } from "@/lib/mock/settings";
import { ROLE_LABELS, ROLE_COLORS, type Role } from "@/lib/rbac";
import { formatDate } from "@/lib/utils";
import { Users, UserPlus, MoreHorizontal, Mail, Clock, X } from "lucide-react";

const ALL_ROLES: Role[] = ["admin", "compliance", "editor", "viewer"];

export default function TeamPage() {
  const [members] = useState<MockTeamMember[]>(teamMembers);
  const [invites, setInvites] = useState<MockInvite[]>(pendingInvites);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");
  const [inviteSent, setInviteSent] = useState(false);

  function handleSendInvite() {
    if (!inviteEmail) return;
    const newInvite: MockInvite = {
      id: `inv_${Date.now()}`,
      email: inviteEmail,
      role: inviteRole,
      invitedBy: "Roshan Dhanasekaran",
      invitedAt: new Date().toISOString(),
    };
    setInvites([...invites, newInvite]);
    setInviteEmail("");
    setInviteRole("editor");
    setShowInvite(false);
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
  }

  function handleRevokeInvite(id: string) {
    setInvites(invites.filter((inv) => inv.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0D0D0D]">Team</h2>
          <p className="text-sm text-[#737373]">
            Manage team members and invitations
          </p>
        </div>
        <button onClick={() => setShowInvite(true)} className="cta-primary text-xs">
          <UserPlus className="h-3.5 w-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {inviteSent && (
        <div className="flex items-center gap-2 bg-[#E8FAE9] px-4 py-2 text-sm font-medium text-[#0D0D0D]">
          <Mail className="h-4 w-4 text-[#22C55E]" /> Invitation sent successfully
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="clean-card border-[#22C55E]">
          <div className="flex items-center justify-between border-b border-[#D9D9D9] px-5 py-3">
            <h3 className="text-sm font-bold text-[#0D0D0D]">Invite Team Member</h3>
            <button onClick={() => setShowInvite(false)} className="text-[#737373] hover:text-[#0D0D0D]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@waaree.com"
                  className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                >
                  {ALL_ROLES.map((role) => (
                    <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button onClick={handleSendInvite} className="cta-primary text-xs">Send Invitation</button>
            </div>
          </div>
        </div>
      )}

      {/* Team Roster */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Users className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Members</h3>
          <span className="ml-auto bg-[#F2F2F2] px-2 py-0.5 text-xs font-semibold text-[#737373]">
            {members.length}
          </span>
        </div>
        <div className="divide-y divide-[#E5E5E5]">
          {members.map((member) => {
            const colors = ROLE_COLORS[member.role];
            return (
              <div key={member.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center bg-[#22C55E] text-xs font-bold text-white">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0D0D0D]">{member.name}</p>
                    <p className="text-xs text-[#737373]">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[0.625rem] font-bold ${colors.bg} ${colors.text}`}>
                    {ROLE_LABELS[member.role]}
                  </span>
                  <span className="hidden text-xs text-[#A3A3A3] sm:block">
                    Active {formatDate(member.lastActive)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="clean-card">
          <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
            <Clock className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="text-sm font-bold text-[#0D0D0D]">Pending Invitations</h3>
            <span className="ml-auto bg-[#FEF3C7] px-2 py-0.5 text-xs font-semibold text-[#F59E0B]">
              {invites.length}
            </span>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-[#0D0D0D]">{invite.email}</p>
                  <p className="text-xs text-[#737373]">
                    Invited as {ROLE_LABELS[invite.role]} by {invite.invitedBy} · {formatDate(invite.invitedAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleRevokeInvite(invite.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/team/page.tsx
git commit -m "feat(settings): add team management page with invite and roster"
```

---

## Task 10: Roles & Permissions Page

**Files:**
- Create: `src/app/app/settings/roles/page.tsx`

- [ ] **Step 1: Create the roles and permissions page**

```tsx
// src/app/app/settings/roles/page.tsx
import { ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_COLORS, PERMISSIONS, hasPermission, type Role } from "@/lib/rbac";
import { Shield, Check, Minus } from "lucide-react";

const ROLES: Role[] = ["owner", "admin", "compliance", "editor", "viewer"];

/** Group permissions by category for display. */
const PERMISSION_GROUPS = [
  {
    title: "Account",
    items: [
      { key: "profile.edit", label: "Edit own profile" },
      { key: "security.edit", label: "Change password" },
    ],
  },
  {
    title: "Organization",
    items: [
      { key: "org.view", label: "View org settings" },
      { key: "org.edit", label: "Edit org settings" },
      { key: "team.invite", label: "Invite / remove members" },
      { key: "roles.assign", label: "Assign roles" },
    ],
  },
  {
    title: "Passports",
    items: [
      { key: "passport.view", label: "View passports" },
      { key: "passport.edit", label: "Create / edit passports" },
      { key: "passport.submit", label: "Submit for review" },
      { key: "passport.approve", label: "Approve / reject" },
      { key: "passport.publish", label: "Publish passports" },
    ],
  },
  {
    title: "Evidence & Compliance",
    items: [
      { key: "evidence.view", label: "View documents" },
      { key: "evidence.upload", label: "Upload documents" },
      { key: "regulatory.edit", label: "Edit regulatory config" },
      { key: "audit.view", label: "View audit log" },
    ],
  },
  {
    title: "System",
    items: [
      { key: "api-keys.manage", label: "Manage API keys" },
      { key: "notifications.edit", label: "Edit notifications" },
      { key: "org.transfer", label: "Transfer ownership" },
      { key: "org.delete", label: "Delete organization" },
    ],
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Roles & Permissions</h2>
        <p className="text-sm text-[#737373]">
          Reference matrix showing what each role can do. Roles are system-defined.
        </p>
      </div>

      {/* Role summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((role) => {
          const colors = ROLE_COLORS[role];
          return (
            <div key={role} className="clean-card p-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[0.625rem] font-bold ${colors.bg} ${colors.text}`}>
                  {ROLE_LABELS[role]}
                </span>
              </div>
              <p className="mt-2 text-xs text-[#737373]">{ROLE_DESCRIPTIONS[role]}</p>
            </div>
          );
        })}
      </div>

      {/* Permission matrix */}
      <div className="clean-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Shield className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Permission Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#D9D9D9] bg-[#FAFAFA]">
                <th className="px-5 py-2 text-left text-xs font-bold uppercase tracking-wider text-[#737373]">Capability</th>
                {ROLES.map((role) => (
                  <th key={role} className="px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-[#737373]">
                    {ROLE_LABELS[role].split(" ")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_GROUPS.map((group) => (
                <>
                  <tr key={group.title}>
                    <td colSpan={6} className="bg-[#FAFAFA] px-5 py-1.5 text-[0.625rem] font-bold uppercase tracking-wider text-[#A3A3A3]">
                      {group.title}
                    </td>
                  </tr>
                  {group.items.map((perm) => {
                    const minRole = PERMISSIONS[perm.key];
                    return (
                      <tr key={perm.key} className="border-b border-[#E5E5E5]">
                        <td className="px-5 py-2 text-sm text-[#0D0D0D]">{perm.label}</td>
                        {ROLES.map((role) => (
                          <td key={role} className="px-3 py-2 text-center">
                            {minRole && hasPermission(role, minRole) ? (
                              <Check className="mx-auto h-4 w-4 text-[#22C55E]" />
                            ) : (
                              <Minus className="mx-auto h-4 w-4 text-[#D9D9D9]" />
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/roles/page.tsx
git commit -m "feat(settings): add roles and permissions matrix page"
```

---

## Task 11: Regulatory Page

**Files:**
- Create: `src/app/app/settings/regulatory/page.tsx`

- [ ] **Step 1: Create the regulatory compliance settings page**

```tsx
// src/app/app/settings/regulatory/page.tsx
"use client";

import { useState } from "react";
import { regulatoryConfig, currentUser } from "@/lib/mock/settings";
import { canDo } from "@/lib/rbac";
import { Scale, ShieldCheck, Leaf, FileCheck } from "lucide-react";

export default function RegulatoryPage() {
  const canEdit = canDo(currentUser.role, "regulatory.edit");
  const [carbonMethod, setCarbonMethod] = useState(regulatoryConfig.carbonMethodology);
  const [reach, setReach] = useState(regulatoryConfig.reachStatus);
  const [rohs, setRohs] = useState(regulatoryConfig.rohsStatus);
  const [uflpa, setUflpa] = useState(regulatoryConfig.uflpaAttestationMode);
  const [weee, setWeee] = useState(regulatoryConfig.weeeCollectionScheme);
  const [saved, setSaved] = useState(false);

  const inputClass = canEdit
    ? "mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
    : "mt-1 block w-full border border-[#D9D9D9] bg-[#F5F5F5] px-3 py-2 text-sm text-[#737373]";

  const selectClass = inputClass;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Regulatory</h2>
        <p className="text-sm text-[#737373]">
          Default compliance settings applied to new passports
        </p>
      </div>

      {/* Carbon & Environmental */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Leaf className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Carbon & Environmental</h3>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Carbon Footprint Methodology</label>
              {canEdit ? (
                <select value={carbonMethod} onChange={(e) => setCarbonMethod(e.target.value)} className={selectClass}>
                  <option>JRC Harmonised 2025</option>
                  <option>GHG Protocol Product Standard</option>
                  <option>ISO 14067:2018</option>
                  <option>PEF (Product Environmental Footprint)</option>
                </select>
              ) : (
                <input type="text" value={carbonMethod} readOnly className={inputClass} />
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">WEEE Collection Scheme</label>
              {canEdit ? (
                <select value={weee} onChange={(e) => setWeee(e.target.value)} className={selectClass}>
                  <option>PV Cycle</option>
                  <option>SENS eRecycling</option>
                  <option>National EPR Scheme</option>
                  <option>Manufacturer Take-Back</option>
                </select>
              ) : (
                <input type="text" value={weee} readOnly className={inputClass} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chemical Compliance */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <ShieldCheck className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Chemical Compliance</h3>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">REACH Status</label>
              {canEdit ? (
                <select value={reach} onChange={(e) => setReach(e.target.value)} className={selectClass}>
                  <option>Compliant</option>
                  <option>Non-Compliant</option>
                  <option>Exempt</option>
                  <option>Under Review</option>
                </select>
              ) : (
                <input type="text" value={reach} readOnly className={inputClass} />
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">RoHS Status</label>
              {canEdit ? (
                <select value={rohs} onChange={(e) => setRohs(e.target.value)} className={selectClass}>
                  <option>Compliant</option>
                  <option>Compliant with Exemption 7a</option>
                  <option>Non-Compliant</option>
                  <option>Under Review</option>
                </select>
              ) : (
                <input type="text" value={rohs} readOnly className={inputClass} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Supply Chain Due Diligence */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Scale className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Supply Chain Due Diligence</h3>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">UFLPA Attestation Mode</label>
              {canEdit ? (
                <select value={uflpa} onChange={(e) => setUflpa(e.target.value)} className={selectClass}>
                  <option>Per-shipment attestation</option>
                  <option>Annual blanket attestation</option>
                  <option>Not applicable (non-US market)</option>
                </select>
              ) : (
                <input type="text" value={uflpa} readOnly className={inputClass} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certification Standards */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <FileCheck className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Tracked Certification Standards</h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {regulatoryConfig.certificationStandards.map((std) => (
              <span key={std} className="bg-[#F2F2F2] px-3 py-1 text-xs font-medium text-[#0D0D0D]">
                {std}
              </span>
            ))}
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="cta-primary text-xs">Save Changes</button>
          {saved && <span className="text-xs font-medium text-[#22C55E]">Changes saved</span>}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/regulatory/page.tsx
git commit -m "feat(settings): add regulatory compliance settings page"
```

---

## Task 12: Audit Log Page

**Files:**
- Create: `src/app/app/settings/audit-log/page.tsx`

- [ ] **Step 1: Create the audit log page**

```tsx
// src/app/app/settings/audit-log/page.tsx
import { auditLog } from "@/lib/mock/settings";
import { ScrollText, User, Settings, Key, FileCheck, Users } from "lucide-react";

const ACTION_ICONS: Record<string, typeof Settings> = {
  "org.settings.updated": Settings,
  "team.invite.sent": Users,
  "team.role.changed": Users,
  "api-key.created": Key,
  "passport.approved": FileCheck,
  "passport.rejected": FileCheck,
  "passport.submitted": FileCheck,
  "regulatory.updated": Settings,
};

const ACTION_LABELS: Record<string, string> = {
  "org.settings.updated": "Updated org settings",
  "team.invite.sent": "Sent invitation",
  "team.role.changed": "Changed role",
  "api-key.created": "Created API key",
  "passport.approved": "Approved passport",
  "passport.rejected": "Rejected passport",
  "passport.submitted": "Submitted passport",
  "regulatory.updated": "Updated compliance config",
};

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Audit Log</h2>
        <p className="text-sm text-[#737373]">
          Chronological record of all settings, team, and approval changes
        </p>
      </div>

      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <ScrollText className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Recent Activity</h3>
          <span className="ml-auto bg-[#F2F2F2] px-2 py-0.5 text-xs font-semibold text-[#737373]">
            {auditLog.length} entries
          </span>
        </div>
        <div className="divide-y divide-[#E5E5E5]">
          {auditLog.map((entry) => {
            const Icon = ACTION_ICONS[entry.action] ?? Settings;
            const label = ACTION_LABELS[entry.action] ?? entry.action;
            const date = new Date(entry.timestamp);
            const timeStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
            const clockStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

            return (
              <div key={entry.id} className="flex gap-4 px-5 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-[#F2F2F2]">
                  <Icon className="h-3.5 w-3.5 text-[#737373]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#0D0D0D]">
                        <span className="font-semibold">{entry.actor}</span>{" "}
                        <span className="text-[#737373]">{label}</span>{" "}
                        <span className="font-medium">{entry.target}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-[#A3A3A3]">{entry.details}</p>
                    </div>
                    <span className="shrink-0 text-xs text-[#A3A3A3]">
                      {timeStr} {clockStr}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/audit-log/page.tsx
git commit -m "feat(settings): add audit log page with activity timeline"
```

---

## Task 13: API Keys Page

**Files:**
- Create: `src/app/app/settings/api-keys/page.tsx`

- [ ] **Step 1: Create the API keys management page**

```tsx
// src/app/app/settings/api-keys/page.tsx
"use client";

import { useState } from "react";
import { apiKeys, type MockApiKey } from "@/lib/mock/settings";
import { formatDate } from "@/lib/utils";
import { Key, Plus, Copy, Trash2, Check } from "lucide-react";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<MockApiKey[]>(apiKeys);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCreate() {
    if (!newKeyName) return;
    const newKey: MockApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      prefix: `ht_live_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      scopes: ["passports:read"],
    };
    setKeys([...keys, newKey]);
    setNewKeyName("");
    setShowCreate(false);
  }

  function handleRevoke(id: string) {
    setKeys(keys.filter((k) => k.id !== id));
  }

  function handleCopy(id: string) {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0D0D0D]">API Keys</h2>
          <p className="text-sm text-[#737373]">
            Manage API keys for ERP, MES, and PLM integrations
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="cta-primary text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span>Create Key</span>
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="clean-card border-[#22C55E]">
          <div className="p-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">Key Name</label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. ERP Integration — SAP"
              className="mt-1 block w-full max-w-md border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
            />
            <div className="mt-3 flex items-center gap-2">
              <button onClick={handleCreate} className="cta-primary text-xs">Create</button>
              <button onClick={() => setShowCreate(false)} className="cta-secondary text-xs">
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys list */}
      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Key className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Active Keys</h3>
          <span className="ml-auto bg-[#F2F2F2] px-2 py-0.5 text-xs font-semibold text-[#737373]">
            {keys.length}
          </span>
        </div>
        <div className="divide-y divide-[#E5E5E5]">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between px-5 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#0D0D0D]">{key.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#737373]">
                  <code className="bg-[#F2F2F2] px-1.5 py-0.5 font-mono text-[#0D0D0D]">{key.prefix}••••••</code>
                  <span>Created {formatDate(key.createdAt)}</span>
                  <span>{key.lastUsed ? `Last used ${formatDate(key.lastUsed)}` : "Never used"}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {key.scopes.map((scope) => (
                    <span key={scope} className="bg-[#E8FAE9] px-1.5 py-0.5 text-[0.625rem] font-medium text-[#0D0D0D]">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(key.id)}
                  className="flex h-7 w-7 items-center justify-center text-[#737373] hover:text-[#0D0D0D]"
                  title="Copy key prefix"
                >
                  {copiedId === key.id ? <Check className="h-3.5 w-3.5 text-[#22C55E]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => handleRevoke(key.id)}
                  className="flex h-7 w-7 items-center justify-center text-[#737373] hover:text-red-600"
                  title="Revoke key"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/api-keys/page.tsx
git commit -m "feat(settings): add API keys management page"
```

---

## Task 14: Notifications Page

**Files:**
- Create: `src/app/app/settings/notifications/page.tsx`

- [ ] **Step 1: Create the notifications preferences page**

```tsx
// src/app/app/settings/notifications/page.tsx
"use client";

import { useState } from "react";
import { notificationPreferences, type NotificationCategory } from "@/lib/mock/settings";
import { Bell, Mail, MonitorSmartphone } from "lucide-react";

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationCategory[]>(notificationPreferences);
  const [saved, setSaved] = useState(false);

  function toggle(key: string, channel: "email" | "inApp") {
    setPrefs(
      prefs.map((p) =>
        p.key === key ? { ...p, [channel]: !p[channel] } : p
      )
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Notifications</h2>
        <p className="text-sm text-[#737373]">
          Choose how you want to be notified about activity in your workspace
        </p>
      </div>

      <div className="clean-card">
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-3">
          <Bell className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-bold text-[#0D0D0D]">Notification Preferences</h3>
        </div>

        {/* Header row */}
        <div className="flex items-center border-b border-[#D9D9D9] bg-[#FAFAFA] px-5 py-2">
          <span className="flex-1 text-xs font-bold uppercase tracking-wider text-[#737373]">Category</span>
          <div className="flex w-32 justify-center gap-8">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#737373]">
              <Mail className="h-3 w-3" /> Email
            </span>
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#737373]">
              <MonitorSmartphone className="h-3 w-3" /> App
            </span>
          </div>
        </div>

        <div className="divide-y divide-[#E5E5E5]">
          {prefs.map((pref) => (
            <div key={pref.key} className="flex items-center px-5 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0D0D0D]">{pref.label}</p>
                <p className="text-xs text-[#737373]">{pref.description}</p>
              </div>
              <div className="flex w-32 justify-center gap-8">
                {/* Email toggle */}
                <button
                  onClick={() => toggle(pref.key, "email")}
                  className={`flex h-5 w-9 items-center rounded-full transition-colors ${
                    pref.email ? "bg-[#22C55E]" : "bg-[#D9D9D9]"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      pref.email ? "translate-x-[18px]" : "translate-x-[2px]"
                    }`}
                  />
                </button>
                {/* In-app toggle */}
                <button
                  onClick={() => toggle(pref.key, "inApp")}
                  className={`flex h-5 w-9 items-center rounded-full transition-colors ${
                    pref.inApp ? "bg-[#22C55E]" : "bg-[#D9D9D9]"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      pref.inApp ? "translate-x-[18px]" : "translate-x-[2px]"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="cta-primary text-xs">Save Preferences</button>
        {saved && <span className="text-xs font-medium text-[#22C55E]">Preferences saved</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/notifications/page.tsx
git commit -m "feat(settings): add notifications preferences page"
```

---

## Task 15: Danger Zone Page

**Files:**
- Create: `src/app/app/settings/danger-zone/page.tsx`

- [ ] **Step 1: Create the danger zone page**

```tsx
// src/app/app/settings/danger-zone/page.tsx
"use client";

import { useState } from "react";
import { organization } from "@/lib/mock/settings";
import { AlertTriangle, ArrowRightLeft, Trash2 } from "lucide-react";

export default function DangerZonePage() {
  const [transferEmail, setTransferEmail] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
        <p className="text-sm text-[#737373]">
          Irreversible actions. Proceed with extreme caution.
        </p>
      </div>

      {/* Transfer Ownership */}
      <div className="clean-card border-red-200">
        <div className="flex items-center gap-3 border-b border-red-200 bg-red-50 px-5 py-3">
          <ArrowRightLeft className="h-4 w-4 text-red-600" />
          <h3 className="text-sm font-bold text-red-700">Transfer Ownership</h3>
        </div>
        <div className="p-5">
          <p className="mb-3 text-sm text-[#737373]">
            Transfer ownership of <strong>{organization.name}</strong> to another team member. You will be demoted to Admin. This action cannot be undone by you.
          </p>
          <div className="max-w-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">New Owner Email</label>
            <input
              type="email"
              value={transferEmail}
              onChange={(e) => setTransferEmail(e.target.value)}
              placeholder="colleague@waaree.com"
              className="mt-1 block w-full border border-red-200 bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button
            disabled={!transferEmail}
            className="mt-3 inline-flex items-center gap-2 bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" /> Transfer Ownership
          </button>
        </div>
      </div>

      {/* Delete Organization */}
      <div className="clean-card border-red-200">
        <div className="flex items-center gap-3 border-b border-red-200 bg-red-50 px-5 py-3">
          <Trash2 className="h-4 w-4 text-red-600" />
          <h3 className="text-sm font-bold text-red-700">Delete Organization</h3>
        </div>
        <div className="p-5">
          <p className="mb-3 text-sm text-[#737373]">
            Permanently delete <strong>{organization.name}</strong> and all associated data including passports, evidence, and team members. This action is <strong>irreversible</strong>.
          </p>
          <div className="max-w-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
              Type <code className="font-mono text-red-600">{organization.name}</code> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={organization.name}
              className="mt-1 block w-full border border-red-200 bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button
            disabled={deleteConfirm !== organization.name}
            className="mt-3 inline-flex items-center gap-2 bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Organization
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app/settings/danger-zone/page.tsx
git commit -m "feat(settings): add danger zone page with transfer and delete"
```

---

## Task 16: Build & Visual Verification

- [ ] **Step 1: Run the build**

Run: `cd /Users/roshandhanashekeran/Developer/heliotrail && npm run build 2>&1 | tail -40`
Expected: Build succeeds with all settings routes compiled

- [ ] **Step 2: Start dev server and verify**

Run: `cd /Users/roshandhanashekeran/Developer/heliotrail && npm run dev`

Manual checks:
1. Navigate to `/app/settings` — redirects to `/app/settings/profile`
2. Settings sidebar visible on left with 4 grouped sections
3. Role badges (ADMIN, COMPLIANCE+, OWNER) show on restricted items
4. Click each of the 10 sidebar links — each loads the correct sub-page
5. Profile page shows avatar, editable name/title, readonly email/role
6. Team page shows 5 members, 1 pending invite, working invite form
7. Roles page shows the full permission matrix with check/dash icons
8. Regulatory page shows compliance config dropdowns
9. Audit log shows 8 timestamped entries
10. API keys page shows 3 keys with copy/revoke buttons
11. Notifications page has working toggle switches
12. Danger zone shows red-themed destructive actions
13. Mobile responsive — sidebar collapses to horizontal tab strip

- [ ] **Step 3: Fix any build or rendering issues**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(settings): complete settings sidebar with RBAC, 10 sub-pages, and mock data"
```
