# Implementation Roadmap

## Delivery philosophy
Build in 3 major waves:
1. **Compliance Core**
2. **Traceability + Circularity**
3. **Lifecycle Intelligence**

---

## Wave 1 — Compliance Core (MVP)

### Goals
- launch a usable passport platform
- support regulatory-core data
- prove document integrity and passport resolution

### Deliverables
- passport identity service
- QR/data-carrier resolution
- public/restricted views
- product schema v1
- document vault with hashing
- admin portal for manufacturers
- basic audit trail
- importer/manufacturer/facility data model

### Success criteria
- a manufacturer can create, publish, and update a passport
- public users can resolve the passport
- auditors can view version history
- evidence documents are integrity-protected

---

## Wave 2 — Traceability and Circularity

### Goals
- expand toward full DPP readiness
- improve supply-chain and EoL usefulness

### Deliverables
- supplier and facility registry
- BOM/material composition workflows
- substances-of-concern model
- due diligence report model
- chain-of-custody events
- dismantling and recycler workflows
- recovery outcome reporting

### Success criteria
- recycler can use the passport operationally
- manufacturer can publish structured material data
- supply-chain evidence is linked to product records

---

## Wave 3 — Lifecycle Intelligence

### Goals
- differentiate the platform commercially
- enable value after compliance

### Deliverables
- telemetry pointer architecture
- maintenance history
- degradation summaries
- anomaly event model
- portfolio analytics
- optional digital twin layer
- resale / second-life scoring

### Success criteria
- passport becomes useful after sale, not just at placing-on-market time
- asset owners/operators gain measurable operational value

---

## Team roles

### Product / domain lead
Owns:
- scope
- schema prioritization
- regulatory interpretation

### Compliance lead
Owns:
- field justification
- evidence requirements
- geographic rollout logic

### Solution architect
Owns:
- system decomposition
- security model
- integration pattern

### Backend team
Owns:
- APIs
- data model
- access control
- versioning

### Frontend team
Owns:
- manufacturer portal
- public passport viewer
- restricted stakeholder views

### Data / integration engineer
Owns:
- ERP/MES/PLM connectors
- import templates
- evidence ingestion

### Trust / identity engineer
Owns:
- DID/VC integration
- certificate verification
- trust registry

---

## Suggested backlog epics
- EPIC-01 Passport identity and registry
- EPIC-02 Product schema and validation
- EPIC-03 Evidence vault and hashing
- EPIC-04 Access control and tenanting
- EPIC-05 BOM and materials
- EPIC-06 Supply-chain graph
- EPIC-07 Circularity and recycling
- EPIC-08 Dynamic performance layer
- EPIC-09 Trust / VC / DID
- EPIC-10 Reporting and analytics

## Decision gates
Before each wave, confirm:
- target geography
- target product scope
- minimum regulatory interpretation
- customer data availability
- whether blockchain anchoring is truly needed


## Frontend build stream

### Stream A — Public experience
Build:
- landing page
- QR resolver
- public passport overview
- public evidence summary
- public lifecycle/circularity summary

### Stream B — Manufacturer workspace
Build:
- app shell and sidebar
- dashboard
- passport list
- create/edit wizard
- evidence vault
- approvals inbox
- passport detail workspace

### Stream C — Restricted stakeholder workspaces
Build:
- recycler view
- auditor view
- operator/performance view
- authority/compliance trace view

### Stream D — Design system
Build first:
- typography and spacing primitives
- buttons
- badges and chips
- cards
- tables
- tabs
- drawers and modals
- file upload
- timeline
- status rail
- section sidebar

### Frontend decision gates
Before implementation, confirm:
- single-app vs public-site + app split
- authentication provider
- whether QR links resolve to a public page or resolver first
- document-viewer strategy
- charting library
- localization requirements
- offline / weak-network behavior for field users
