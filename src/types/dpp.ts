/**
 * ESPR-aligned Digital Product Passport JSON schema types.
 * Matches the canonical structure from docs/04_pv_passport_data_schema.md.
 */

export interface DPPIdentity {
  pvPassportId: string;
  moduleIdentifier: string;
  serialNumber: string | null;
  batchId: string | null;
  modelId: string;
  gtin: string | null;
  passportVersion: number;
  passportStatus: string;
}

export interface DPPEconomicOperator {
  name: string;
  operatorIdentifier: string | null;
  address: string | null;
  contactUrl: string | null;
  country: string | null;
}

export interface DPPFacility {
  facilityIdentifier: string | null;
  name: string | null;
  location: string | null;
}

export interface DPPTechnicalData {
  moduleTechnology: string;
  ratedPowerSTC_W: number | null;
  moduleEfficiency_percent: number | null;
  voc_V: number | null;
  isc_A: number | null;
  vmp_V: number | null;
  imp_A: number | null;
  maxSystemVoltage_V: number | null;
  moduleDimensions_mm: {
    length: number | null;
    width: number | null;
    depth: number | null;
  };
  moduleMass_kg: number | null;
  cellCount: number | null;
  cellType: string | null;
  temperatureCoefficients: {
    pmax: number | null;
    voc: number | null;
    isc: number | null;
  };
  noct_celsius: number | null;
  fireRating: string | null;
  ipRating: string | null;
  connectorType: string | null;
  frameType: string | null;
  glassType: string | null;
  bifacialityFactor: number | null;
}

export interface DPPCertificate {
  standardName: string;
  certificateNumber: string | null;
  issuer: string;
  issuedDate: string | null;
  expiryDate: string | null;
  status: string;
  documentUrl: string | null;
  documentHash: string | null;
  hashAlgorithm: string | null;
  scopeNotes: string | null;
}

export interface DPPDocument {
  name: string;
  documentType: string;
  accessLevel: string;
  url: string | null;
  fileSizeBytes: number | null;
  mimeType: string | null;
  documentHash: string | null;
  hashAlgorithm: string | null;
  issuer: string | null;
  issuedDate: string | null;
  description: string | null;
}

export interface DPPCompliance {
  certificates: DPPCertificate[];
  documents: DPPDocument[];
}

export interface DPPMaterial {
  materialName: string;
  componentType: string | null;
  mass_g: number | null;
  massPercent: number | null;
  casNumber: string | null;
  isCriticalRawMaterial: boolean;
  isSubstanceOfConcern: boolean;
  concentration_percent: number | null;
  regulatoryBasis: string | null;
  recyclabilityHint: string | null;
  recycledContentPercent: number | null;
  originCountry: string | null;
  supplierId: string | null;
}

export interface DPPMaterialComposition {
  moduleMaterials: DPPMaterial[];
  substancesOfConcern?: DPPSubstanceOfConcern[];
  reachStatus?: string;
  rohsStatus?: string;
}

export interface DPPCircularity {
  recyclabilityRate_percent: number | null;
  recycledContent_percent: number | null;
  renewableContent_percent: number | null;
  isHazardous: boolean;
  hazardousSubstancesNotes: string | null;
  dismantlingTime_minutes: number | null;
  dismantlingInstructions: string | null;
  collectionScheme: string | null;
  recycler: {
    name: string | null;
    contact: string | null;
  };
  recoveryOutcomes: {
    aluminium: boolean;
    glass: boolean;
    silicon: boolean;
    copper: boolean;
    silver: boolean;
    notes: string | null;
  };
  endOfLifeStatus: string;
}

export interface DPPImporter {
  name: string;
  operatorIdentifier: string;
  country: string;
}

export interface DPPCarbon {
  declaredValue_kgCO2e: number | null;
  methodology: string | null;
  functionalUnit_gCO2eq_per_kWh: number | null;
  boundary: string | null;
  verificationRef: string | null;
}

export interface DPPWarranty {
  productWarranty_years: number | null;
  performanceWarranty_years: number | null;
  performanceWarranty_percent: number | null;
  linearDegradation_percent_per_year: number | null;
  expectedLifetime_years: number | null;
}

export interface DPPSupplyChainActor {
  name: string;
  role: string;
  operatorId?: string;
  country?: string;
  facilityName?: string;
  facilityLocation?: string;
  certifications?: string[];
  tierLevel?: number;
  stage?: string;
  uflpaCompliant?: boolean;
  auditDate?: string;
}

export interface DPPChainOfCustodyEvent {
  eventType: string;
  fromActor?: string;
  toActor?: string;
  location?: string;
  timestamp?: string;
  evidenceUrl?: string;
  evidenceHash?: string;
  notes?: string;
}

export interface DPPSubstanceOfConcern {
  substanceName: string;
  casNumber?: string;
  concentrationPercent?: number;
  locationInModule?: string;
  regulatoryBasis?: string;
  exemption?: string;
  notes?: string;
}

export interface DPPPayload {
  schemaVersion: "1.0.0";
  generatedAt: string;
  identity: DPPIdentity;
  manufacturer: DPPEconomicOperator;
  importer?: DPPImporter;
  manufacturingFacility: DPPFacility;
  manufacturingDate: string | null;
  technicalData: DPPTechnicalData;
  compliance: DPPCompliance;
  materialComposition: DPPMaterialComposition;
  circularity: DPPCircularity;
  carbon: DPPCarbon;
  warranty: DPPWarranty;
  dataCarrierType?: string;
  supplyChain?: {
    actors: DPPSupplyChainActor[];
    chainOfCustodyEvents: DPPChainOfCustodyEvent[];
    uflpaCompliance?: { status: string };
    ssiCertification?: { status: string };
  };
}
