# BOM and Dynamic Data Design Notes

## Why the passport needs three BOM views
A single BOM is not enough because product, supply-chain, and recycler stakeholders need different data granularity.

### BOM-lite
Use for:
- first product release
- fast onboarding of manufacturers
- baseline ESG and material disclosure
- quick recycling support

Contains:
- major module components
- material family
- approximate mass or percentage
- criticality and hazardous flags
- recyclability hints

### Full engineering BOM
Use for:
- detailed traceability
- quality and warranty root-cause analysis
- supplier/site/lot linkage
- PLM and ERP integration

Contains:
- part numbers
- revisions
- assembly hierarchy
- lot and batch IDs
- specification references
- supplier site references
- compliance document references

### Recycling BOM / material disclosure BOM
Use for:
- dismantling
- hazardous handling
- material recovery optimization
- end-of-life classification

Contains:
- recoverable fractions
- hazardous materials
- contamination risks
- disassembly order
- recovery route guidance

## Recommended release strategy
### MVP
- regulatory core
- BOM-lite
- substances of concern
- certificates
- maintenance events
- latest dynamic snapshot

### Enterprise release
- restricted engineering BOM
- supply-chain tiering
- recycler BOM
- dynamic rollups
- signed evidence manifests

## Dynamic data design rule
The passport should not behave like a SCADA historian.

### Put inside the passport
- latest operating snapshot
- cumulative energy generation
- degradation indicators
- maintenance history
- inspection events
- anomaly / incident history
- pointers and hashes for datasets

### Keep outside the passport
- 1-minute or 5-minute telemetry streams
- waveform-level or inverter log archives
- raw sensor dumps
- large weather and irradiance histories

## Reference dynamic fields
### Snapshot
- current active power
- irradiance
- ambient temperature
- module temperature
- operating status
- snapshot timestamp

### Rollups
- daily energy
- monthly energy
- lifetime energy
- availability
- downtime
- degradation estimate

### Events
- maintenance
- inspection
- cleaning
- repair
- replacement
- incident

## Data-governance note
Dynamic operational data should be scope-aware:
- module-level where available
- string-level when module granularity is not feasible
- asset or plant-level where only aggregate telemetry exists

The passport can still reference the correct scope and data quality level.
