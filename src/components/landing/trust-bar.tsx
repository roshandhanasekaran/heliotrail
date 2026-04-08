"use client";

import { FadeIn } from "@/components/ui/fade-in";
import {
  ShieldCheckIcon,
  RecycleIcon,
  GlobeIcon,
  ZapIcon,
  LockIcon,
  DatabaseIcon,
} from "lucide-react";

const items = [
  { icon: ShieldCheckIcon, label: "EU ESPR Aligned", sublabel: "Regulation 2024/1781" },
  { icon: RecycleIcon, label: "Circularity Tracked", sublabel: "End-of-life ready" },
  { icon: LockIcon, label: "Immutable Records", sublabel: "Tamper-proof data" },
  { icon: GlobeIcon, label: "Open Standards", sublabel: "Interoperable DPP" },
  { icon: DatabaseIcon, label: "Real-Time Data", sublabel: "Always current" },
  { icon: ZapIcon, label: "Instant Verification", sublabel: "QR scan access" },
];

export function TrustBar() {
  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.05}>
                <div className="flex flex-col items-center gap-2 text-center group">
                  <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
