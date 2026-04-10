/**
 * Mock data for Settings pages.
 * Waaree Energies Ltd. — PV DPP SaaS platform demo data.
 */

import type { Role } from "@/lib/rbac";

// ─── User ────────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string;
  name: string;
  email: string;
  title: string;
  role: Role;
  avatarInitial: string;
}

export const currentUser: MockUser = {
  id: "usr_roshan_001",
  name: "Roshan Dhanasekaran",
  email: "roshan@waaree.com",
  title: "Head of Sustainability",
  role: "owner",
  avatarInitial: "R",
};

// ─── Organization ─────────────────────────────────────────────────────────────

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

// ─── Team Members ──────────────────────────────────────────────────────────────

export interface MockTeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
  joinedAt: string;
  lastActive: string;
}

export const teamMembers: MockTeamMember[] = [
  {
    id: "usr_roshan_001",
    name: "Roshan Dhanasekaran",
    email: "roshan@waaree.com",
    role: "owner",
    status: "active",
    joinedAt: "2025-08-14T09:00:00Z",
    lastActive: "2026-04-10T08:45:00Z",
  },
  {
    id: "usr_priya_002",
    name: "Priya Sharma",
    email: "priya.sharma@waaree.com",
    role: "admin",
    status: "active",
    joinedAt: "2025-08-20T10:30:00Z",
    lastActive: "2026-04-09T17:22:00Z",
  },
  {
    id: "usr_ankit_003",
    name: "Ankit Patel",
    email: "ankit.patel@waaree.com",
    role: "compliance",
    status: "active",
    joinedAt: "2025-09-03T08:00:00Z",
    lastActive: "2026-04-10T07:55:00Z",
  },
  {
    id: "usr_meera_004",
    name: "Meera Gupta",
    email: "meera.gupta@waaree.com",
    role: "editor",
    status: "active",
    joinedAt: "2025-10-11T11:15:00Z",
    lastActive: "2026-04-08T14:10:00Z",
  },
  {
    id: "usr_vikram_005",
    name: "Vikram Singh",
    email: "vikram.singh@waaree.com",
    role: "viewer",
    status: "active",
    joinedAt: "2026-01-06T09:45:00Z",
    lastActive: "2026-04-07T16:30:00Z",
  },
];

// ─── Pending Invites ───────────────────────────────────────────────────────────

export interface MockInvite {
  id: string;
  email: string;
  role: Role;
  invitedBy: string;
  invitedAt: string;
}

export const pendingInvites: MockInvite[] = [
  {
    id: "inv_rajesh_001",
    email: "rajesh.kumar@waaree.com",
    role: "editor",
    invitedBy: "Roshan Dhanasekaran",
    invitedAt: "2026-04-08T13:00:00Z",
  },
];

// ─── API Keys ──────────────────────────────────────────────────────────────────

export interface MockApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string | null;
}

export const apiKeys: MockApiKey[] = [
  {
    id: "key_erp_001",
    name: "ERP Integration — SAP S/4HANA",
    prefix: "ht_live_a3Kx",
    scopes: ["passports:read", "passports:write"],
    createdAt: "2025-09-15T10:00:00Z",
    lastUsed: "2026-04-10T06:12:00Z",
  },
  {
    id: "key_mes_002",
    name: "MES Data Pipeline",
    prefix: "ht_live_p9Qw",
    scopes: ["passports:read", "evidence:write"],
    createdAt: "2025-11-02T14:30:00Z",
    lastUsed: "2026-04-09T23:58:00Z",
  },
  {
    id: "key_ci_003",
    name: "CI/CD Test Key",
    prefix: "ht_test_z2Ym",
    scopes: ["passports:read"],
    createdAt: "2026-02-18T09:00:00Z",
    lastUsed: null,
  },
];

// ─── Audit Log ─────────────────────────────────────────────────────────────────

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
    target: "Waaree Energies Ltd.",
    details: "Updated default facility to 'Surat Mega Factory'.",
    timestamp: "2026-04-10T08:30:00Z",
  },
  {
    id: "aud_002",
    actor: "Roshan Dhanasekaran",
    action: "team.invite.sent",
    target: "rajesh.kumar@waaree.com",
    details: "Invited rajesh.kumar@waaree.com as Editor.",
    timestamp: "2026-04-08T13:00:00Z",
  },
  {
    id: "aud_003",
    actor: "Priya Sharma",
    action: "api_key.created",
    target: "MES Data Pipeline",
    details: "Created API key with scopes: passports:read, evidence:write.",
    timestamp: "2025-11-02T14:30:00Z",
  },
  {
    id: "aud_004",
    actor: "Ankit Patel",
    action: "passport.approved",
    target: "WRE-HJM-2026-0042",
    details: "Passport approved for Waaree HJM 550W (Lot 042).",
    timestamp: "2026-04-07T11:15:00Z",
  },
  {
    id: "aud_005",
    actor: "Meera Gupta",
    action: "passport.submitted",
    target: "WRE-HJM-2026-0051",
    details: "Passport submitted for compliance review.",
    timestamp: "2026-04-06T15:45:00Z",
  },
  {
    id: "aud_006",
    actor: "Priya Sharma",
    action: "team.role.changed",
    target: "Meera Gupta",
    details: "Role updated from Viewer to Editor.",
    timestamp: "2025-10-11T11:20:00Z",
  },
  {
    id: "aud_007",
    actor: "Ankit Patel",
    action: "regulatory.updated",
    target: "Carbon Methodology",
    details: "Carbon methodology updated to 'JRC Harmonised 2025'.",
    timestamp: "2026-03-18T09:00:00Z",
  },
  {
    id: "aud_008",
    actor: "Ankit Patel",
    action: "passport.rejected",
    target: "WRE-TOPCon-2026-0038",
    details: "Passport rejected — missing UFLPA attestation documents.",
    timestamp: "2026-04-05T16:00:00Z",
  },
];

// ─── Notification Preferences ──────────────────────────────────────────────────

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
    label: "Passport Status",
    description: "Updates when a passport is approved, rejected, or published.",
    email: true,
    inApp: true,
  },
  {
    key: "approval_requests",
    label: "Approval Requests",
    description: "Notifications when a passport is submitted for your review.",
    email: true,
    inApp: true,
  },
  {
    key: "compliance_deadlines",
    label: "Compliance Deadlines",
    description: "Reminders for upcoming ESPR regulatory submission deadlines.",
    email: true,
    inApp: false,
  },
  {
    key: "team_activity",
    label: "Team Activity",
    description: "Team member joins, role changes, and invite acceptances.",
    email: false,
    inApp: true,
  },
  {
    key: "system_alerts",
    label: "System Alerts",
    description: "Platform maintenance windows, outages, and security notices.",
    email: true,
    inApp: true,
  },
];

// ─── Regulatory Configuration ─────────────────────────────────────────────────

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
