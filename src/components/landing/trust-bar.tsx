"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  RecycleIcon,
  GlobeIcon,
  ZapIcon,
  LockIcon,
  DatabaseIcon,
} from "lucide-react";

const items = [
  { icon: ShieldCheckIcon, label: "EU ESPR Aligned", sublabel: "Regulation 2024/1781", color: "#6366f1" },
  { icon: RecycleIcon, label: "Circularity Tracked", sublabel: "End-of-life ready", color: "#22c55e" },
  { icon: LockIcon, label: "Immutable Records", sublabel: "Tamper-proof data", color: "#f59e0b" },
  { icon: GlobeIcon, label: "Open Standards", sublabel: "Interoperable DPP", color: "#3b82f6" },
  { icon: DatabaseIcon, label: "Real-Time Data", sublabel: "Always current", color: "#8b5cf6" },
  { icon: ZapIcon, label: "Instant Verification", sublabel: "QR scan access", color: "#06b6d4" },
];

export function TrustBar() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#0a0a1a]">
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.label} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="group flex flex-col items-center gap-3 text-center"
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:shadow-lg"
                      style={{
                        backgroundColor: `${item.color}10`,
                      }}
                    >
                      <Icon
                        className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/90">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
