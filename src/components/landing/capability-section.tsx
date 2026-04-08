"use client";

import { FadeIn } from "@/components/ui/fade-in";
import {
  FileTextIcon,
  ShieldCheckIcon,
  RecycleIcon,
  BarChart3Icon,
  ScanLineIcon,
  UsersIcon,
} from "lucide-react";

const capabilities = [
  {
    icon: FileTextIcon,
    color: "from-blue-500/20 to-blue-600/5",
    borderColor: "border-blue-500/20 hover:border-blue-500/40",
    iconColor: "text-blue-400",
    title: "Complete Product Identity",
    description:
      "Every module gets a unique digital passport with manufacturer data, specifications, and full traceability from factory to field.",
  },
  {
    icon: ShieldCheckIcon,
    color: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
    iconColor: "text-emerald-400",
    title: "Compliance & Certifications",
    description:
      "Track IEC standards, CE declarations, and safety certifications with automatic expiry monitoring and status verification.",
  },
  {
    icon: RecycleIcon,
    color: "from-amber-500/20 to-amber-600/5",
    borderColor: "border-amber-500/20 hover:border-amber-500/40",
    iconColor: "text-amber-400",
    title: "Circularity Intelligence",
    description:
      "Material composition, recyclability rates, dismantling guides, and critical raw material tracking for end-of-life planning.",
  },
  {
    icon: BarChart3Icon,
    color: "from-rose-500/20 to-rose-600/5",
    borderColor: "border-rose-500/20 hover:border-rose-500/40",
    iconColor: "text-rose-400",
    title: "Carbon Footprint Tracking",
    description:
      "Cradle-to-gate carbon footprint per ISO 14067 with full methodology transparency and environmental product declarations.",
  },
  {
    icon: ScanLineIcon,
    color: "from-violet-500/20 to-violet-600/5",
    borderColor: "border-violet-500/20 hover:border-violet-500/40",
    iconColor: "text-violet-400",
    title: "QR-Based Access",
    description:
      "Every passport has a unique public ID and QR code. Scan at the installation site to instantly access the full digital record.",
  },
  {
    icon: UsersIcon,
    color: "from-cyan-500/20 to-cyan-600/5",
    borderColor: "border-cyan-500/20 hover:border-cyan-500/40",
    iconColor: "text-cyan-400",
    title: "Role-Based Visibility",
    description:
      "Public data for consumers, restricted data for recyclers, full access for manufacturers — all enforced at the database level.",
  },
];

export function CapabilitySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Platform Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a PV passport needs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From manufacturing data to end-of-life recycling, HelioTrail
            captures the full lifecycle of every solar module.
          </p>
        </div>
      </FadeIn>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap, i) => (
          <FadeIn key={cap.title} delay={i * 0.08}>
            <div
              className={`group relative overflow-hidden border ${cap.borderColor} bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cap.color} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center bg-background/50 ${cap.iconColor} ring-1 ring-border/50`}
                >
                  <cap.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
