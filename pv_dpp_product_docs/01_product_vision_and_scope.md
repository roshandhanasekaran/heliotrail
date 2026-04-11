# Product Vision and Scope

## Product name
**PV Digital Product Passport Platform**

## Product vision
A trusted digital passport platform for photovoltaic modules that combines:
- regulatory compliance,
- supply-chain traceability,
- circularity readiness,
- lifecycle evidence,
- and optional operational intelligence.

## Problem statement
PV modules are moving toward a more traceable, circular, and evidence-driven market model, but the ecosystem is still fragmented:
- regulations define the **DPP framework**, but not yet a fully mature PV-specific schema,
- manufacturing, compliance, recycling, and performance data live in disconnected systems,
- recyclers and refurbishers often lack machine-readable dismantling and material data,
- installers and buyers struggle to verify origin, compliance, and long-term performance evidence.

## Target users

### Primary
- PV manufacturers
- importers / EU economic operators
- compliance teams
- quality / certification teams
- recyclers and producer responsibility organizations

### Secondary
- EPCs / installers
- asset owners / operators
- insurers / financiers
- auditors / market surveillance bodies
- circular-economy marketplaces

## Product outcomes
The platform should help customers:
1. create a machine-readable PV passport,
2. keep it updated across the lifecycle,
3. expose the right information to the right stakeholders,
4. prove integrity and provenance,
5. support reuse / recycling and EoL workflows.

## Core product modules

### 1. Passport registry
- passport creation
- unique IDs
- QR/data carrier resolution
- current-status lookup

### 2. Compliance document vault
- declarations
- test reports
- certificates
- manuals
- safety information
- versioning and integrity hashes

### 3. Material and BOM intelligence
- module material breakdown
- substances of concern
- supplier mapping
- recyclability guidance

### 4. Supply-chain and due-diligence layer
- actor registry
- facilities
- supplier tiers
- chain-of-custody events
- audit evidence

### 5. Circularity and EoL layer
- dismantling instructions
- collection scheme references
- refurbish / second-life workflows
- recovery outcome reporting

### 6. Optional performance layer
- telemetry connectors
- degradation summaries
- maintenance history
- anomaly / failure events

## Product boundaries

### In scope
- product passport platform
- evidence and document orchestration
- structured schema and APIs
- controlled-access information sharing
- optional trust / verification layer

### Out of scope for MVP
- full SCADA platform
- inverter / plant analytics replacement
- broad ERP replacement
- direct certification lab software replacement

## Suggested packaging

### Edition A — Compliance Core
For manufacturers beginning DPP readiness.

### Edition B — Traceability and Circularity
Adds supply-chain and EoL intelligence.

### Edition C — Lifecycle Intelligence
Adds dynamic performance and predictive analytics.

## Success metrics
- time to create passport
- % passports with complete regulatory core
- % passports with verified supporting evidence
- recycler usability score
- % passports with reusable structured BOM
- customer onboarding time
- passport update latency
