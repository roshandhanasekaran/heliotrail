import {
  LayoutDashboard,
  FileStack,
  FolderOpen,
  CheckSquare,
  BarChart3,
  BrainCircuit,
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

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** Global app sidebar — grouped by section */
export const SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/app", icon: LayoutDashboard },
      { label: "Passports", href: "/app/passports", icon: FileStack, badge: "count" },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Evidence Vault", href: "/app/evidence", icon: FolderOpen },
      { label: "Approvals", href: "/app/approvals", icon: CheckSquare, badge: "count" },
      { label: "AI Analytics", href: "/app/ai-analytics", icon: BrainCircuit },
      { label: "Compliance", href: "/app/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Integrations", href: "/app/integrations", icon: Plug },
      { label: "Settings", href: "/app/settings", icon: Settings },
    ],
  },
];

/** Flat list for backward compat */
export const GLOBAL_NAV: NavItem[] = SIDEBAR_SECTIONS.flatMap((s) => s.items);

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
