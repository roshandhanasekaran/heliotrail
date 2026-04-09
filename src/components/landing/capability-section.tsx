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
    title: "Complete Product Identity",
    description:
      "Every module gets a unique digital passport with manufacturer data, specifications, and full traceability from factory to field.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Compliance & Certifications",
    description:
      "Track IEC standards, CE declarations, and safety certifications with automatic expiry monitoring and status verification.",
  },
  {
    icon: RecycleIcon,
    title: "Circularity Intelligence",
    description:
      "Material composition, recyclability rates, dismantling guides, and critical raw material tracking for end-of-life planning.",
  },
  {
    icon: BarChart3Icon,
    title: "Carbon Footprint Tracking",
    description:
      "Cradle-to-gate carbon footprint per ISO 14067 with full methodology transparency and environmental product declarations.",
  },
  {
    icon: ScanLineIcon,
    title: "Digital Access",
    description:
      "Every passport has a unique public ID. Access it from any device to instantly view the full digital record at the installation site.",
  },
  {
    icon: UsersIcon,
    title: "Role-Based Visibility",
    description:
      "Public data for consumers, restricted data for recyclers, full access for manufacturers — all enforced at the database level.",
  },
];

export function CapabilitySection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 border border-[#D9D9D9] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#737373]">
              Platform Capabilities
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#0D0D0D] sm:text-4xl">
              Everything a PV passport needs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#737373]">
              From manufacturing data to end-of-life recycling, HelioTrail
              captures the full lifecycle of every solar module.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <FadeIn key={cap.title} delay={i * 0.05}>
                <div className="clean-card h-full p-6">
                  <div className="mb-5">
                    <div className="flex h-10 w-10 items-center justify-center bg-[#F2F2F2]">
                      <Icon className="h-5 w-5 text-[#0D0D0D]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-[#0D0D0D]">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#737373]">
                    {cap.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
