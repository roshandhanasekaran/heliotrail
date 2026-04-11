// Shared ESPR readiness computation used by both dashboard and analytics pages.

export interface EsprCheck {
  label: string;
  ok: boolean;
  weight: number;
}

export interface EsprReadinessInput {
  passportCount: number;
  hasRatedPower: boolean;
  materialsCount: number;
  hasCarbonFootprint: boolean;
  validCertsCount: number;
  circularityCount: number;
  hasSupplyChain: boolean;
  hasDynamicData: boolean;
}

export function computeEsprChecks(input: EsprReadinessInput): EsprCheck[] {
  return [
    { label: "Product Identification (Annex III)", ok: input.passportCount > 0, weight: 12 },
    { label: "Technical Specifications", ok: input.hasRatedPower, weight: 12 },
    { label: "Material Composition (BOM)", ok: input.materialsCount > 0, weight: 15 },
    { label: "Carbon Footprint (ISO 14067)", ok: input.hasCarbonFootprint, weight: 15 },
    { label: "Compliance Certificates", ok: input.validCertsCount > 0, weight: 12 },
    { label: "Circularity & EoL Data", ok: input.circularityCount > 0, weight: 12 },
    { label: "Supply Chain Due Diligence", ok: input.hasSupplyChain, weight: 10 },
    { label: "Dynamic Performance Data", ok: input.hasDynamicData, weight: 12 },
  ];
}

export function computeReadinessScore(checks: EsprCheck[]): number {
  return checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);
}

export function computeMarketAccess(checks: EsprCheck[], readinessScore: number) {
  const coreMarketReady =
    readinessScore >= 70 && checks[3].ok && checks[2].ok && checks[4].ok;
  const extendedMarketReady = readinessScore >= 85 && checks[6].ok;

  const markets = [
    { country: "DE", name: "Germany", ready: coreMarketReady },
    { country: "FR", name: "France", ready: coreMarketReady },
    { country: "IT", name: "Italy", ready: coreMarketReady },
    { country: "ES", name: "Spain", ready: coreMarketReady },
    { country: "NL", name: "Netherlands", ready: coreMarketReady },
    { country: "PL", name: "Poland", ready: extendedMarketReady },
    { country: "RO", name: "Romania", ready: extendedMarketReady },
  ];

  return {
    markets,
    readyCount: markets.filter((m) => m.ready).length,
    totalCount: markets.length,
  };
}
