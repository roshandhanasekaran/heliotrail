"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/passport/glass-card";
import { RadialGauge } from "@/components/passport/radial-gauge";
import { ExplodedPanel } from "@/components/passport/exploded-panel";
import { SectionTitle } from "@/components/passport/section-title";
import {
  RecycleIcon,
  AlertTriangleIcon,
  WrenchIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

interface MaterialData {
  id: string;
  name: string;
  massPercent: number;
  massG: number | null;
  isCritical: boolean;
  isSoC: boolean;
}

interface CircularityData {
  recyclabilityRate: number;
  recycledContent: number;
  dismantlingTime: number;
  isHazardous: boolean;
  dismantlingInstructions: string | null;
  hazardousNotes: string | null;
  collectionScheme: string | null;
  recoveryNotes: string | null;
  recovery: {
    aluminium: boolean;
    glass: boolean;
    silicon: boolean;
    copper: boolean;
    silver: boolean;
  };
}

interface CircularityClientProps {
  circularity: CircularityData;
  materials: MaterialData[];
}

const recoveryColors: Record<string, string> = {
  Aluminium: "#fbbf24",
  Glass: "#60a5fa",
  Silicon: "#34d399",
  Copper: "#f97316",
  Silver: "#a78bfa",
};

export function CircularityClient({
  circularity,
  materials,
}: CircularityClientProps) {
  const recoveryItems = [
    { name: "Aluminium", recoverable: circularity.recovery.aluminium },
    { name: "Glass", recoverable: circularity.recovery.glass },
    { name: "Silicon", recoverable: circularity.recovery.silicon },
    { name: "Copper", recoverable: circularity.recovery.copper },
    { name: "Silver", recoverable: circularity.recovery.silver },
  ];

  return (
    <div className="space-y-12">
      <SectionTitle
        title="Circularity & End of Life"
        description="Recyclability, material composition, and dismantling information"
        accentColor="#ef4444"
      />

      {/* Radial gauges row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-8 sm:gap-14"
      >
        <RadialGauge
          value={circularity.recyclabilityRate}
          max={100}
          label="Recyclability Rate"
          unit="%"
          size={170}
          color="#4caf50"
          glowColor="#66bb6a"
        />
        <RadialGauge
          value={circularity.recycledContent}
          max={100}
          label="Recycled Content"
          unit="%"
          size={150}
          color="#2196f3"
        />
        <RadialGauge
          value={circularity.dismantlingTime}
          max={120}
          label="Dismantling Time"
          unit="min"
          size={150}
          color="#ff9800"
        />
      </motion.div>

      {/* Exploded panel + Material recovery side-by-side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exploded panel diagram */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <GlassCard accentColor="#ef4444">
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                  <RecycleIcon className="h-4.5 w-4.5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Panel Cross-Section
                </h3>
              </div>
              <ExplodedPanel materials={[]} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Material recovery */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <GlassCard tilt accentColor="#34d399">
            <div className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <RecycleIcon className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold">Material Recovery</h3>
              </div>

              <div className="space-y-3">
                {recoveryItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: recoveryColors[item.name],
                          boxShadow: `0 0 8px ${recoveryColors[item.name]}40`,
                        }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    {item.recoverable ? (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span className="text-xs font-semibold">
                          Recoverable
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground/50">
                        <XCircleIcon className="h-4 w-4" />
                        <span className="text-xs">Not recoverable</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {circularity.recoveryNotes && (
                <p className="mt-4 text-xs text-muted-foreground/70 pl-1">
                  {circularity.recoveryNotes}
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Material composition */}
      {materials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard accentColor="#a78bfa">
            <div className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                  <RecycleIcon className="h-4.5 w-4.5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Material Composition
                </h3>
              </div>

              {/* Animated stacked bar */}
              <div className="mb-6 overflow-hidden rounded-full h-4 bg-white/[0.04]">
                <div className="flex h-full">
                  {materials.map((m, i) => {
                    const colors = [
                      "#60a5fa",
                      "#a78bfa",
                      "#34d399",
                      "#f472b6",
                      "#fbbf24",
                      "#f97316",
                      "#06b6d4",
                      "#e879f9",
                    ];
                    const color = colors[i % colors.length];
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.massPercent}%` }}
                        transition={{
                          delay: 0.4 + i * 0.08,
                          duration: 0.8,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                        style={{
                          backgroundColor: color,
                          opacity: 0.7,
                        }}
                        title={`${m.name}: ${m.massPercent}%`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Material list */}
              <div className="grid gap-2 sm:grid-cols-2">
                {materials.map((m, i) => {
                  const colors = [
                    "#60a5fa",
                    "#a78bfa",
                    "#34d399",
                    "#f472b6",
                    "#fbbf24",
                    "#f97316",
                    "#06b6d4",
                    "#e879f9",
                  ];
                  const color = colors[i % colors.length];
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.04 }}
                      className="flex items-center justify-between rounded-lg border border-white/[0.03] px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm">{m.name}</span>
                        {m.isCritical && (
                          <span className="rounded-full bg-yellow-500/15 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">
                            CRM
                          </span>
                        )}
                        {m.isSoC && (
                          <span className="rounded-full bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                            SoC
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {m.massG != null && (
                          <span className="text-xs text-muted-foreground/60">
                            {m.massG}g
                          </span>
                        )}
                        <span
                          className="font-mono text-sm font-bold"
                          style={{
                            color,
                            textShadow: `0 0 8px ${color}25`,
                          }}
                        >
                          {m.massPercent}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Additional info cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {circularity.isHazardous && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard accentColor="#ef4444">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                    <AlertTriangleIcon className="h-4.5 w-4.5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Hazardous Substances</h3>
                </div>
                {circularity.hazardousNotes && (
                  <p className="text-sm text-muted-foreground/80">
                    {circularity.hazardousNotes}
                  </p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {circularity.dismantlingInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <GlassCard accentColor="#ff9800">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                    <WrenchIcon className="h-4.5 w-4.5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    Dismantling Instructions
                  </h3>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground/80">
                  {circularity.dismantlingInstructions}
                </pre>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {circularity.collectionScheme && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard accentColor="#2196f3">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <RecycleIcon className="h-4.5 w-4.5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Collection Scheme</h3>
                </div>
                <p className="text-sm text-muted-foreground/80">
                  {circularity.collectionScheme}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
