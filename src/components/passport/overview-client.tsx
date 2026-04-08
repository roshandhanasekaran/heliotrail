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
        accentColor="#6366f1"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard tilt accentColor="#6366f1">
            <div className="p-6 pt-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30">
                  <FactoryIcon className="h-5 w-5 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold">Manufacturer</h3>
              </div>
              <div className="space-y-1">
                {manufacturerData.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold">{item.value}</span>
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
          <GlassCard tilt accentColor="#8b5cf6">
            <div className="p-6 pt-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/30">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold">
                  Warranty &amp; Identification
                </h3>
              </div>
              <div className="space-y-1">
                {warrantyData.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold font-mono">
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
