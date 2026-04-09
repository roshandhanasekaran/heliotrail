import {
  LayoutDashboard,
  FileStack,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Plug,
  Settings,
  Eye,
  Cpu,
  Layers,
  Route,
  ShieldCheck,
  FolderSearch,
  RefreshCcw,
  Activity,
  History,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: "count";
}

/** Global app sidebar items (authenticated shell) */
export const GLOBAL_NAV: NavItem[] = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Passports", href: "/app/passports", icon: FileStack, badge: "count" },
  { label: "Evidence Vault", href: "/app/evidence", icon: FolderOpen },
  { label: "Approvals", href: "/app/approvals", icon: CheckSquare, badge: "count" },
  { label: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { label: "Integrations", href: "/app/integrations", icon: Plug },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

/** Context sidebar items within a passport workspace */
export const PASSPORT_SECTIONS: NavItem[] = [
  { label: "Overview", href: "overview", icon: Eye },
  { label: "Specifications", href: "specs", icon: Cpu },
  { label: "Composition", href: "composition", icon: Layers },
  { label: "Traceability", href: "traceability", icon: Route },
  { label: "Compliance", href: "compliance", icon: ShieldCheck },
  { label: "Evidence", href: "evidence", icon: FolderSearch },
  { label: "Lifecycle", href: "lifecycle", icon: RefreshCcw },
  { label: "Dynamic Data", href: "dynamic-data", icon: Activity },
  { label: "History", href: "history", icon: History },
];
