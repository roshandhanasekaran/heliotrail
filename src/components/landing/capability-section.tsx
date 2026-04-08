"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  ShieldCheckIcon,
  RecycleIcon,
  BarChart3Icon,
  ScanLineIcon,
  UsersIcon,
  ArrowRightIcon,
} from "lucide-react";

const capabilities = [
  {
    icon: FileTextIcon,
    accent: "#6366f1",
    title: "Complete Product Identity",
    description:
      "Every module gets a unique digital passport with manufacturer data, specifications, and full traceability from factory to field.",
  },
  {
    icon: ShieldCheckIcon,
    accent: "#22c55e",
    title: "Compliance & Certifications",
    description:
      "Track IEC standards, CE declarations, and safety certifications with automatic expiry monitoring and status verification.",
  },
  {
    icon: RecycleIcon,
    accent: "#f59e0b",
    title: "Circularity Intelligence",
    description:
      "Material composition, recyclability rates, dismantling guides, and critical raw material tracking for end-of-life planning.",
  },
  {
    icon: BarChart3Icon,
    accent: "#ef4444",
    title: "Carbon Footprint Tracking",
    description:
      "Cradle-to-gate carbon footprint per ISO 14067 with full methodology transparency and environmental product declarations.",
  },
  {
    icon: ScanLineIcon,
    accent: "#8b5cf6",
    title: "QR-Based Access",
    description:
      "Every passport has a unique public ID and QR code. Scan at the installation site to instantly access the full digital record.",
  },
  {
    icon: UsersIcon,
    accent: "#06b6d4",
    title: "Role-Based Visibility",
    description:
      "Public data for consumers, restricted data for recyclers, full access for manufacturers — all enforced at the database level.",
  },
];

function CapabilityCard({
  cap,
  index,
}: {
  cap: (typeof capabilities)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = cap.icon;

  return (
    <FadeIn delay={index * 0.08}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? `0 8px 30px ${cap.accent}12, 0 0 0 1px ${cap.accent}20`
            : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
          borderColor: isHovered ? `${cap.accent}30` : undefined,
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300"
          style={{
            backgroundColor: cap.accent,
            opacity: isHovered ? 0.8 : 0,
            transform: isHovered ? "scaleX(1)" : "scaleX(0.3)",
          }}
        />

        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at 50% 0%, ${cap.accent}06, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        <div className="relative">
          <div className="mb-5 flex items-center justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
              style={{
                backgroundColor: `${cap.accent}10`,
                boxShadow: isHovered
                  ? `0 4px 14px ${cap.accent}20`
                  : "none",
              }}
            >
              <Icon
                className="h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-110"
                style={{ color: cap.accent }}
              />
            </div>
            <ArrowRightIcon
              className="h-4 w-4 text-muted-foreground/0 transition-all duration-300 group-hover:text-muted-foreground/50 group-hover:translate-x-0.5"
            />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{cap.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {cap.description}
          </p>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export function CapabilitySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Platform Capabilities
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
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
          <CapabilityCard key={cap.title} cap={cap} index={i} />
        ))}
      </div>
    </section>
  );
}
