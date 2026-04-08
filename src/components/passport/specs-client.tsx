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
        accentColor="#2196f3"
      />

      {/* Radial gauges row */}
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
          color="#4caf50"
        />
        <RadialGauge
          value={gaugeData.efficiency}
          max={30}
          label="Efficiency"
          unit="%"
          size={160}
          color="#2196f3"
        />
      </motion.div>

      {/* Spec tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <GlassCard tilt accentColor="#2196f3">
            <div className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <ZapIcon className="h-4.5 w-4.5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Electrical Parameters
                </h3>
              </div>

              <div className="space-y-0">
                {/* Table header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                    Parameter
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                    Value
                  </span>
                </div>
                {electrical.map((row, i) => (
                  <motion.div
                    key={row.param}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                    className="flex items-center justify-between border-b border-white/[0.03] py-3 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground/80">
                      {row.param}
                    </span>
                    <span
                      className={`text-sm font-mono tabular-nums ${
                        row.highlight
                          ? "font-bold text-blue-400"
                          : "font-medium"
                      }`}
                      style={
                        row.highlight
                          ? {
                              textShadow: "0 0 10px rgba(33,150,243,0.2)",
                            }
                          : undefined
                      }
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
          <GlassCard tilt accentColor="#ff9800">
            <div className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                  <BoxIcon className="h-4.5 w-4.5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Mechanical Parameters
                </h3>
              </div>

              <div className="space-y-0">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                    Parameter
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                    Value
                  </span>
                </div>
                {mechanical.map((row, i) => (
                  <motion.div
                    key={row.param}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className="flex items-center justify-between border-b border-white/[0.03] py-3 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground/80">
                      {row.param}
                    </span>
                    <span
                      className={`text-sm font-mono tabular-nums ${
                        row.highlight
                          ? "font-bold text-orange-400"
                          : "font-medium"
                      }`}
                      style={
                        row.highlight
                          ? {
                              textShadow: "0 0 10px rgba(255,152,0,0.2)",
                            }
                          : undefined
                      }
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
