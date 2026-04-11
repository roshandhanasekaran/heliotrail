# PV Passport Data Schema

## Schema design principle
Design the schema in 3 layers:

1. **Regulatory core (high certainty)**
2. **Industry consensus extensions (medium certainty)**
3. **Advanced lifecycle intelligence (low certainty / differentiating)**

---

## 1. Regulatory core fields (high certainty or safest baseline)

### 1.1 Identity
- `pvPassportId`
- `moduleIdentifier`
- `serialNumber`
- `batchId`
- `modelId`
- `gtin`
- `dataCarrierType`
- `passportVersion`
- `passportStatus`

### 1.2 Economic operators
- `manufacturer.name`
- `manufacturer.operatorIdentifier`
- `manufacturer.address`
- `manufacturer.contactUrl`
- `importer.name`
- `importer.operatorIdentifier`
- `authorizedRepresentative`
- `distributor[]`

### 1.3 Facilities
- `manufacturingFacility.facilityIdentifier`
- `manufacturingFacility.name`
- `manufacturingFacility.location`
- `manufacturingDate`

### 1.4 Product technical data
- `moduleCategory`
- `moduleTechnology`
- `ratedPowerSTC_W`
- `moduleEfficiency_percent`
- `voc_V`
- `isc_A`
- `vmp_V`
- `imp_A`
- `maxSystemVoltage_V`
- `moduleDimensions_mm`
- `moduleMass_kg`

### 1.5 Compliance and documentation
- `declarationOfConformity`
- `technicalDocumentationRef`
- `certificates[]`
- `userManual`
- `installationInstructions`
- `safetyInstructions`

---

## 2. Industry-consensus fields (medium certainty)

### 2.1 BOM and material composition
- `moduleMaterials[]`
  - `materialName`
  - `componentType`
  - `mass_g`
  - `massPercent`
  - `casNumber`
  - `isCriticalRawMaterial`
  - `supplierId`
  - `recyclabilityHint`

### 2.2 Substances and compliance
- `substancesOfConcern[]`
  - `name`
  - `casNumber`
  - `concentration_w_w_percent`
  - `regulatoryBasis`
- `reachStatus`
- `rohsStatus`

### 2.3 Carbon and sustainability
- `epdRef`
- `carbonFootprint`
  - `declaredValue_kgCO2e`
  - `boundary`
  - `methodology`
  - `verificationRef`
- `recycledContent[]`
- `renewableContent_percent`

### 2.4 Reliability and warranty
- `productWarranty_years`
- `performanceWarranty`
- `linearDegradation_percent_per_year`
- `expectedLifetime_years`
- `testStandards[]`

### 2.5 Supply chain
- `supplyChainActors[]`
- `supplyChainFacilities[]`
- `supplierTiers[]`
- `chainOfCustodyEvents[]`
- `supplyChainDueDiligenceReport`
- `thirdPartyAssurances[]`

### 2.6 Circularity and EoL
- `dismantlingAndRemovalInformation[]`
- `repairabilityNotes`
- `sparePartSources[]`
- `collectionScheme`
- `endOfLifeInformation`
- `recyclerInformation`
- `recoveryOutcomes[]`

---

## 3. Advanced lifecycle intelligence fields (low certainty / product differentiators)

### 3.1 Operational summaries
- `currentActivePower_W`
- `cumulativeEnergyGeneration_kWh`
- `cumulativeIrradiance_kWh_m2`
- `moduleTemperature_C`
- `ambientTemperature_C`
- `operatingHours_h`

### 3.2 Health / degradation
- `powerRetention_percent`
- `estimatedDegradationRate_percent_per_year`
- `anomalyFlags[]`
- `negativeEvents[]`

### 3.3 Service history
- `maintenanceEvents[]`
- `inspectionEvents[]`
- `componentReplacementEvents[]`

### 3.4 Digital evidence layer
- `telemetry.endpoint`
- `telemetry.manifestHash`
- `telemetry.accessPolicy`
- `evidenceRefs[]`
- `documentHashes[]`

---

## Canonical example object

```json
{
  "pvPassportId": "PVP-0000001",
  "moduleIdentifier": "MOD-123456789",
  "modelId": "WM-550N-TOPCON",
  "manufacturer": {
    "name": "Example Manufacturer",
    "operatorIdentifier": "EO-12345",
    "contactUrl": "https://example.org"
  },
  "manufacturingFacility": {
    "facilityIdentifier": "FAC-IND-001",
    "location": "India"
  },
  "manufacturingDate": "2026-01-12T00:00:00Z",
  "moduleTechnology": "crystalline_silicon_topcon",
  "ratedPowerSTC_W": 550,
  "moduleEfficiency_percent": 21.3,
  "compliance": {
    "declarationOfConformity": {
      "uri": "https://example.org/docs/doc.pdf",
      "hashAlg": "sha256",
      "hash": "abc123"
    }
  },
  "materialComposition": {
    "moduleMaterials": [
      {
        "materialName": "glass",
        "mass_g": 12000
      },
      {
        "materialName": "aluminium",
        "mass_g": 1800
      }
    ]
  },
  "endOfLife": {
    "status": "in_use"
  }
}
```

## Product recommendation
Implement the schema as:
- JSON schema for API/data exchange
- relational/document persistence model for operations
- optional VC credentialSubject model for certificates
- event model for lifecycle updates
