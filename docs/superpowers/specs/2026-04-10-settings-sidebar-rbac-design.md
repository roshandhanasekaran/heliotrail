# Settings Sidebar & RBAC Design

**Date:** 2026-04-10
**Status:** Approved
**Scope:** Manufacturer portal settings redesign with role-based access control

## Context

The current settings page (`src/app/app/settings/page.tsx`) is a flat, single-page layout with 5 hardcoded sections, dead "Manage" buttons, no sub-navigation, and no RBAC. This redesign transforms it into a production-grade settings experience with a dedicated sidebar, 10 functional sub-pages, and a 5-role permission system scoped to the manufacturer organization.

## Decisions

- **Layout:** Settings sidebar (left nav within settings area), not top tabs
- **Role model:** 5 roles — Owner, Admin, Compliance Officer, Editor, Viewer
- **Scope:** Manufacturer portal only (external stakeholder portals come in Wave 2)
- **Data approach:** Mock-first — realistic mock data mirroring eventual Supabase schema, no new migrations

## Settings Sidebar Structure

### Account (visible to all)
- **Profile** — Full name, email, job title, avatar
- **Security** — Change password, active sessions list

### Organization
- **General** — Org name, EU economic operator ID, registered address, logo, default facility. Everyone sees (read-only for Editor/Viewer), Admin+ edits.
- **Team** — Invite members via email, view roster, assign/change roles, remove members. Admin+ only.
- **Roles & Permissions** — Read-only permission matrix showing what each role can do. Admin+ only.

### Compliance
- **Regulatory** — Default carbon methodology, REACH/RoHS status, certification standards, UFLPA attestation mode, WEEE collection scheme. Compliance Officer + Admin + Owner.
- **Audit Log** — Read-only log of all settings changes, team changes, passport approval actions with timestamps and user attribution. Everyone (read-only).

### System
- **API Keys** — Generate/revoke API keys for ERP/MES/PLM integrations. Shows key prefix, created date, last used, scopes. Admin+ only.
- **Notifications** — Toggle email/in-app alerts per category: passport status changes, approval requests, compliance deadlines, team invites. Everyone.
- **Danger Zone** — Transfer org ownership, delete organization. Owner only.

## Role Definitions

| Role | Description |
|---|---|
| **Owner** | Full control. Billing, delete org, transfer ownership. One per org. |
| **Admin** | Manage team, org settings, API keys, all passport operations. Can invite/remove users. |
| **Compliance Officer** | Approve/reject passports, manage evidence, sign off on regulatory submissions, edit compliance config. Cannot manage team. |
| **Editor** | Create/edit passports, upload evidence, submit for review. Cannot manage team or settings. |
| **Viewer** | Read-only access to dashboards, passports, and reports. Cannot edit anything. |

## Permission Matrix

| Capability | Owner | Admin | Compliance | Editor | Viewer |
|---|---|---|---|---|---|
| Edit own profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change own password | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit org settings | ✓ | ✓ | — | — | — |
| View org settings | ✓ | ✓ | ✓ | ✓ | ✓ |
| Invite/remove team members | ✓ | ✓ | — | — | — |
| Assign/change roles | ✓ | ✓ | — | — | — |
| View passports | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create/edit passports | ✓ | ✓ | ✓ | ✓ | — |
| Submit for review | ✓ | ✓ | ✓ | ✓ | — |
| Approve/reject passports | ✓ | ✓ | ✓ | — | — |
| Publish passports | ✓ | ✓ | ✓ | — | — |
| Upload documents | ✓ | ✓ | ✓ | ✓ | — |
| View documents | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit regulatory config | ✓ | ✓ | ✓ | — | — |
| View audit log | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage API keys | ✓ | ✓ | — | — | — |
| Edit own notifications | ✓ | ✓ | ✓ | ✓ | ✓ |
| Transfer ownership | ✓ | — | — | — | — |
| Delete organization | ✓ | — | — | — | — |

## Routing Structure

```
src/app/app/settings/
├── layout.tsx              ← Settings layout with sidebar + RBAC filtering
├── page.tsx                ← Redirects to /profile
├── profile/page.tsx
├── security/page.tsx
├── organization/page.tsx
├── team/page.tsx
├── roles/page.tsx
├── regulatory/page.tsx
├── audit-log/page.tsx
├── api-keys/page.tsx
├── notifications/page.tsx
└── danger-zone/page.tsx
```

## Key Components

### Settings Sidebar (`src/components/settings/settings-sidebar.tsx`)
- Grouped sections: Account, Organization, Compliance, System
- Active route highlighting (green left border, matching main sidebar style)
- RBAC-filtered: sections hidden based on `currentUser.role`
- Role badges on restricted items (ADMIN, COMPLIANCE+, OWNER)

### RBAC Infrastructure (`src/lib/rbac.ts`)
- `Role` enum: `owner | admin | compliance | editor | viewer`
- `hasPermission(userRole, requiredRole)` — hierarchy check
- `SETTINGS_SECTIONS` config with `minRole` per section for sidebar filtering
- Role hierarchy: owner > admin > compliance > editor > viewer

### Mock Data Layer (`src/lib/mock/settings.ts`)
- `currentUser` — `{ id, name, email, title, role, avatarInitial }`
- `organization` — `{ name, operatorId, domain, address, facility, logo }`
- `teamMembers[]` — `{ id, name, email, role, status, joinedAt, lastActive }`
- `pendingInvites[]` — `{ id, email, role, invitedBy, invitedAt }`
- `apiKeys[]` — `{ id, prefix, name, createdAt, lastUsed, scopes[] }`
- `auditLog[]` — `{ id, actor, action, target, details, timestamp }`
- `notificationPreferences` — `{ [category]: { email: bool, inApp: bool } }`

## Team Invite Flow

1. Admin clicks "Invite Member" on Team page
2. Modal opens: enter email + select role from dropdown
3. Invite stored in mock data with status `pending`
4. Team page shows pending invites section with ability to revoke
5. (Email delivery and actual auth callback deferred to database integration phase)

## Visual Design

- Follows existing design system: `clean-card`, `cta-primary`, `cta-secondary`, Tailwind + shadcn
- Settings sidebar matches main app sidebar style (same typography, green active indicator)
- Form inputs use existing input styling with green focus ring
- Danger zone uses red accent for destructive actions
- Permission badges: green for ADMIN, indigo for COMPLIANCE+, red for OWNER

## Verification

1. Navigate to `/app/settings` — should redirect to `/app/settings/profile`
2. Sidebar shows all sections with correct grouping and role badges
3. Click each section — navigates to correct sub-page with populated content
4. No dead buttons — every button has a handler (even if mock/toast-based)
5. Switch `currentUser.role` in mock data — sidebar sections filter correctly
6. Team page shows member roster and invite flow
7. Roles & Permissions page shows the permission matrix
8. Audit log shows timestamped entries
9. Danger zone only appears for Owner role
10. All pages are responsive — work on mobile without the settings sidebar (falls back to dropdown or sheet)
