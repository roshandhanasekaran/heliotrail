// src/lib/settings-nav.ts

import {
  User, Lock, Building2, Users, Shield, Scale, ScrollText, Key, Bell, AlertTriangle, Palette,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/rbac";

export interface SettingsNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
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
      { label: "Branding", href: "/app/settings/branding", icon: Palette, minRole: "admin" },
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
