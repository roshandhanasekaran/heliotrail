"use client";

import { GlassCard } from "@/components/passport/glass-card";
import { RadialGauge } from "@/components/passport/radial-gauge";
import { MaterialDonut } from "@/components/passport/material-donut";
import { SectionTitle } from "@/components/passport/section-title";
import { FadeIn } from "@/components/ui/fade-in";
import {
  RecycleIcon,
  AlertTriangleIcon,
  WrenchIcon,
  CheckCircleIcon,
  XCircleIcon,
  LeafIcon,
  UserIcon,
  InfoIcon,
  LockIcon,
} from "lucide-react";

interface MaterialData {
  id: string;
  name: string;
  componentType: string | null;
  massPercent: number;
  massG: number | null;
  isCritical: boolean;
  isSoC: boolean;
  recyclabilityHint: string | null;
  casNumber: string | null;
  concentrationPercent: number | null;
  regulatoryBasis: string | null;
}

interface CircularityData {
  recyclabilityRate: number;
  recycledContent: number;
  dismantlingTime: number;
  renewableContent: number;
  isHazardous: boolean;
  dismantlingInstructions: string | null;
  hazardousNotes: string | null;
  collectionScheme: string | null;
  recoveryNotes: string | null;
  recyclerName: string | null;
  recyclerContact: string | null;
  endOfLifeStatus: string | null;
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
  accessLevel?: "public" | "authenticated";
}

/* Monochrome material dot colors — green reserved for primary material only */
const materialDotColors: Record<string, string> = {
  Aluminium: "#0D0D0D",
  Glass: "#404040",
  Silicon: "#22C55E",
  Copper: "#737373",
  Silver: "#A3A3A3",
};

/* Monochrome palette for donut segments: green for primary, grays for the rest */
const monochromeSegmentColors = [
  "#22C55E",
  "#0D0D0D",
  "#404040",
  "#737373",
  "#A3A3A3",
  "#D9D9D9",
  "#0D0D0D",
  "#404040",
  "#737373",
];

const eolStatusLabels: Record<string, { bg: string; text: string }> = {
  recyclable: { bg: "var(--passport-green-muted)", text: "var(--primary)" },
  reusable: { bg: "var(--passport-green-muted)", text: "var(--primary)" },
  landfill: { bg: "var(--muted)", text: "var(--muted-foreground)" },
  incineration: { bg: "var(--muted)", text: "var(--muted-foreground)" },
};

function AccessRestricted({ label }: { label: string }) {
  return (
    <GlassCard>
      <div className="flex items-center gap-3 px-5 py-4 text-muted-foreground">
        <LockIcon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium">{label}</span>
      </div>
    </GlassCard>
  );
}

export function CircularityClient({
  circularity,
  materials,
  accessLevel = "authenticated",
}: CircularityClientProps) {
  const isPublic = accessLevel === "public";

  const recoveryItems = [
    { name: "Aluminium", recoverable: circularity.recovery.aluminium, method: "Direct smelting" },
    { name: "Glass", recoverable: circularity.recovery.glass, method: "Cullet for glass industry" },
    { name: "Silicon", recoverable: circularity.recovery.silicon, method: "Chemical purification" },
    { name: "Copper", recoverable: circularity.recovery.copper, method: "Copper smelting" },
    { name: "Silver", recoverable: circularity.recovery.silver, method: "Chemical extraction" },
  ];

  const socMaterials = materials.filter((m) => m.isSoC);

  return (
    <div className="space-y-10">
      <SectionTitle
        title="Circularity & End of Life"
        description="Recyclability, material composition, and dismantling information"
        icon={RecycleIcon}
      />

      {/* End of Life Status badge */}
      {circularity.endOfLifeStatus && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">End-of-Life Status:</span>
          <span
            className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor:
                eolStatusLabels[circularity.endOfLifeStatus]?.bg ?? "var(--muted)",
              color:
                eolStatusLabels[circularity.endOfLifeStatus]?.text ?? "var(--muted-foreground)",
            }}
          >
            {circularity.endOfLifeStatus}
          </span>
        </div>
      )}

      {/* Radial gauges */}
      <FadeIn>
        <GlassCard>
          <div className="px-6 py-6">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <RadialGauge
                value={circularity.recyclabilityRate}
                max={100}
                label="Recyclability"
                unit="%"
                size={140}
                color="#22C55E"
                showTicks
              />
              <div className="hidden sm:block w-px h-20 bg-border" />
              <RadialGauge
                value={circularity.recycledContent}
                max={100}
                label="Recycled Content"
                unit="%"
                size={130}
                color="var(--foreground)"
                showTicks
              />
              <div className="hidden sm:block w-px h-20 bg-border" />
              <RadialGauge
                value={circularity.renewableContent}
                max={100}
                label="Renewable"
                unit="%"
                size={130}
                color="#404040"
                showTicks
              />
              {!isPublic && (
                <>
                  <div className="hidden sm:block w-px h-20 bg-border" />
                  <RadialGauge
                    value={circularity.dismantlingTime}
                    max={120}
                    label="Dismantling"
                    unit="min"
                    size={130}
                    color="var(--muted-foreground)"
                    showTicks
                  />
                </>
              )}
            </div>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Material composition donut */}
      <FadeIn>
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-muted">
                <LeafIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Material Composition</h3>
                <p className="text-[11px] text-muted-foreground">Weight distribution by component</p>
              </div>
            </div>
            <MaterialDonut
              materials={materials.map((m, i) => ({
                name: m.name,
                massPercent: m.massPercent,
                massG: isPublic ? undefined : (m.massG ?? undefined),
                color: monochromeSegmentColors[i % monochromeSegmentColors.length],
                isCritical: m.isCritical,
                isSoC: m.isSoC,
                description: m.recyclabilityHint ?? undefined,
              }))}
            />
          </div>
        </GlassCard>
      </FadeIn>

      {/* Substances of Concern detail table */}
      {socMaterials.length > 0 && (
        <FadeIn>
          <GlassCard>
            <div className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-muted">
                  <AlertTriangleIcon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Substances of Concern</h3>
                  <p className="text-[11px] text-muted-foreground">REACH / EU regulatory disclosures</p>
                </div>
              </div>

              <div className="passport-table">
                <div className="passport-table-header">
                  <span>Substance</span>
                  <span>Details</span>
                </div>
                {socMaterials.map((m) => (
                  <div key={m.id} className="passport-table-row !items-start !py-3">
                    <div>
                      <span className="table-label font-medium text-foreground">{m.name}</span>
                      {!isPublic && m.componentType && (
                        <span className="ml-2 text-[10px] text-muted-foreground">({m.componentType})</span>
                      )}
                    </div>
                    <div className="text-right space-y-0.5">
                      {!isPublic && m.casNumber && (
                        <div className="text-[11px] text-foreground font-mono">CAS {m.casNumber}</div>
                      )}
                      {m.concentrationPercent != null && (
                        <div className="text-[11px] text-foreground">{m.concentrationPercent}% concentration</div>
                      )}
                      {m.regulatoryBasis && (
                        <div className="text-[10px] text-muted-foreground">{m.regulatoryBasis}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </FadeIn>
      )}

      {/* Material recovery */}
      <FadeIn>
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-muted">
                <RecycleIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Material Recovery</h3>
                <p className="text-[11px] text-muted-foreground">Recoverable materials assessment</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {recoveryItems.map((item) => (
                <div
                  key={item.name}
                  className={
                    item.recoverable
                      ? "border border-primary bg-[var(--passport-green-muted)] p-3 text-center"
                      : "border border-dashed border-border bg-muted/50 p-3 text-center"
                  }
                >
                  <div
                    className="mx-auto mb-2 h-2.5 w-2.5 shrink-0"
                    style={{
                      backgroundColor: materialDotColors[item.name] ?? "#A3A3A3",
                    }}
                  />
                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{item.method}</p>
                  {item.recoverable ? (
                    <div className="mt-2 flex items-center justify-center gap-1 text-primary">
                      <CheckCircleIcon className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Yes</span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-center gap-1 text-muted-foreground">
                      <XCircleIcon className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">No</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {circularity.recoveryNotes && (
              <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                {circularity.recoveryNotes}
              </p>
            )}
          </div>
        </GlassCard>
      </FadeIn>

      {/* Recycler Information */}
      {(circularity.recyclerName || circularity.recyclerContact) && (
        <FadeIn>
          {isPublic ? (
            <AccessRestricted label="Recycler Access Required — Certified recycler details are restricted" />
          ) : (
            <GlassCard>
              <div className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-muted">
                    <UserIcon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Certified Recycler</h3>
                    <p className="text-[11px] text-muted-foreground">Authorized end-of-life handler</p>
                  </div>
                </div>
                <div className="passport-table">
                  <div className="passport-table-header">
                    <span>Field</span>
                    <span>Value</span>
                  </div>
                  {circularity.recyclerName && (
                    <div className="passport-table-row">
                      <span className="table-label">Recycler</span>
                      <span className="table-value">{circularity.recyclerName}</span>
                    </div>
                  )}
                  {circularity.recyclerContact && (
                    <div className="passport-table-row">
                      <span className="table-label">Contact</span>
                      <span className="table-value mono">{circularity.recyclerContact}</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </FadeIn>
      )}

      {/* Additional info cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {circularity.isHazardous && (
          isPublic ? (
            <AccessRestricted label="Restricted Access Required — Hazardous substance details are restricted" />
          ) : (
            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-muted">
                    <AlertTriangleIcon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Hazardous Substances</h3>
                    <p className="text-[11px] text-muted-foreground">Safety & handling warnings</p>
                  </div>
                </div>
                {circularity.hazardousNotes && (
                  <p className="text-sm text-foreground leading-relaxed">
                    {circularity.hazardousNotes}
                  </p>
                )}
              </div>
            </GlassCard>
          )
        )}

        {circularity.dismantlingInstructions && (
          isPublic ? (
            <AccessRestricted label="Recycler Access Required — Dismantling instructions are restricted" />
          ) : (
            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-muted">
                    <WrenchIcon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Dismantling Instructions</h3>
                    <p className="text-[11px] text-muted-foreground">End-of-life procedures</p>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                  {circularity.dismantlingInstructions}
                </pre>
              </div>
            </GlassCard>
          )
        )}

        {circularity.collectionScheme && (
          <GlassCard>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center bg-muted">
                  <InfoIcon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Collection Scheme</h3>
                  <p className="text-[11px] text-muted-foreground">Recycling program details</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {circularity.collectionScheme}
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
