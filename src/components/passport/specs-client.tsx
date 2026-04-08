"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/passport/glass-card";
import { RadialGauge } from "@/components/passport/radial-gauge";
import { SectionTitle } from "@/components/passport/section-title";
import { ZapIcon, BoxIcon } from "lucide-react";

interface SpecRow {
  param: string;
  value: string;
  highlight?: boolean;
}

interface SpecsClientProps {
  electrical: SpecRow[];
  mechanical: SpecRow[];
  gaugeData: {
    power: number;
    efficiency: number;
  };
}

export function SpecsClient({
  electrical,
  mechanical,
  gaugeData,
}: SpecsClientProps) {
  return (
    <div className="space-y-12">
      <SectionTitle
        title="Technical Specifications"
        description="Electrical and mechanical parameters at Standard Test Conditions (STC)"
        accentColor="#3b82f6"
      />

      {/* Radial gauges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-10"
      >
        <RadialGauge
          value={gaugeData.power}
          max={700}
          label="Rated Power"
          unit="W"
          size={160}
          color="#6366f1"
        />
        <RadialGauge
          value={gaugeData.efficiency}
          max={30}
          label="Efficiency"
          unit="%"
          size={160}
          color="#3b82f6"
        />
      </motion.div>

      {/* Spec tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <GlassCard tilt accentColor="#3b82f6">
            <div className="p-6 pt-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                  <ZapIcon className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold">
                  Electrical Parameters
                </h3>
              </div>

              <div className="space-y-0">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground/60">
                    Parameter
                  </span>
                  <span className="text-xs font-medium text-muted-foreground/60">
                    Value
                  </span>
                </div>
                {electrical.map((row, i) => (
                  <motion.div
                    key={row.param}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                    className="flex items-center justify-between border-b border-border/30 py-3 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {row.param}
                    </span>
                    <span
                      className={`text-sm font-mono tabular-nums ${
                        row.highlight
                          ? "font-bold text-blue-600 dark:text-blue-400"
                          : "font-medium"
                      }`}
                    >
                      {row.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <GlassCard tilt accentColor="#f59e0b">
            <div className="p-6 pt-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
                  <BoxIcon className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold">
                  Mechanical Parameters
                </h3>
              </div>

              <div className="space-y-0">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground/60">
                    Parameter
                  </span>
                  <span className="text-xs font-medium text-muted-foreground/60">
                    Value
                  </span>
                </div>
                {mechanical.map((row, i) => (
                  <motion.div
                    key={row.param}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className="flex items-center justify-between border-b border-border/30 py-3 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {row.param}
                    </span>
                    <span
                      className={`text-sm font-mono tabular-nums ${
                        row.highlight
                          ? "font-bold text-amber-600 dark:text-amber-400"
                          : "font-medium"
                      }`}
                    >
                      {row.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
