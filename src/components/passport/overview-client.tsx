"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import { FactoryIcon, ShieldCheckIcon } from "lucide-react";

interface DataItem {
  label: string;
  value: string;
}

interface OverviewClientProps {
  manufacturerData: DataItem[];
  warrantyData: DataItem[];
}

export function OverviewClient({
  manufacturerData,
  warrantyData,
}: OverviewClientProps) {
  return (
    <section>
      <SectionTitle
        title="Product Details"
        description="Manufacturer information and warranty coverage"
        accentColor="#4caf50"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard tilt accentColor="#4caf50">
            <div className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-primary/10">
                  <FactoryIcon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Manufacturer</h3>
              </div>
              <div className="space-y-3">
                {manufacturerData.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center justify-between border-b border-border pb-2.5 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground/70">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard tilt accentColor="#ab47bc">
            <div className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-purple-500/10">
                  <ShieldCheckIcon className="h-4.5 w-4.5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Warranty &amp; Identification
                </h3>
              </div>
              <div className="space-y-3">
                {warrantyData.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center justify-between border-b border-border pb-2.5 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground/70">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium font-mono">
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
