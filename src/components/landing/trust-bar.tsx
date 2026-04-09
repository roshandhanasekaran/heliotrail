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
  { icon: ZapIcon, label: "Instant Verification", sublabel: "Instant access" },
];

export function TrustBar() {
  return (
    <section className="border-y border-[#D9D9D9] bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-[#F2F2F2]">
                    <Icon className="h-4.5 w-4.5 text-[#737373]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0D0D0D]">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs text-[#737373]">
                      {item.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
