# Regulatory Landscape

## Executive interpretation
For PV modules, the **ESPR** provides the horizontal DPP framework, but a fully product-specific PV passport requirement will depend on a future **delegated act**. That means some design choices are already firm, while others are still product-strategy decisions.

## 1. High-certainty regulatory foundations

### ESPR (EU) 2024/1781
Source: https://eur-lex.europa.eu/eli/reg/2024/1781/eng

What is clear already:
- the DPP must be linked to a **persistent unique product identifier**
- DPP data must be reachable through a **data carrier**
- DPPs must support **interoperability**
- access and update rights must be controlled
- data integrity, authentication, security, and privacy must be ensured
- delegated acts decide the exact product-group data requirements

### EU Batteries Regulation 2023/1542
Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1542

Why it matters for PV:
- it is the most mature real-world EU passport model
- it proves the viability of:
  - public / legitimate-interest / authority access tiers
  - model-level + item-level + use-phase information
  - QR-linked passport access
  - controlled update and integrity mechanisms

### Practical takeaway
Use the **battery passport as the architectural template**, but do **not** claim PV has the same legal data obligations yet.

## 2. Medium-certainty compliance anchors relevant to PV

### REACH
Operational relevance:
- substances of very high concern communication
- article-level substance transparency
- structured BOM/substance model becomes highly valuable

### RoHS
Operational relevance:
- hazardous substance compliance signalling
- useful for product and market documentation layers

### WEEE
Operational relevance:
- end-of-life obligations
- collection / treatment / recycling support
- strong case for dismantling and recovery data in the passport

### Construction Products Regulation (context-dependent)
Relevance depends on:
- building-integrated PV use cases
- whether the product is treated in practice as a construction product in the target scenario

## 3. Low- to medium-certainty areas
These are strategically useful but not yet fully locked for PV:
- exact access-tier matrices
- mandatory PV product-level field list
- item-level vs model-level granularity
- required dynamic operational fields
- legally required circularity KPIs beyond general DPP direction

## 4. Mandatory vs voluntary thinking for product design

### Treat as mandatory-ready
- unique product / passport identity
- economic operator identification
- core product specifications
- compliance documentation links
- instruction / safety document access
- integrity model and access control
- versioning / auditability

### Treat as industry-consensus layer
- BOM and material composition
- substances-of-concern details
- facility-level provenance
- dismantling and EoL instructions
- due-diligence reports
- chain-of-custody events

### Treat as advanced / forward-looking
- real-time telemetry
- module-level operating analytics
- degradation prediction models
- asset marketplace reuse scoring
- digital twin integration

## 5. Lifecycle-stage reporting obligations model

### Manufacturing
- product identity
- manufacturer
- facility
- specs
- declarations
- certificates
- material profile

### Distribution / placing on market
- importer / distributor references
- lot/batch / shipment traceability
- market-specific documentation

### Use phase
- owner/operator linkage where contractually relevant
- maintenance events
- performance summaries
- fault / incident history

### End of life
- collection route
- dismantling guidance
- recycler receipt
- recovery outcomes
- disposal / recycling evidence

## Product implication
Build the product so that **regulatory core is immutable enough for audit**, while **industry extensions remain configurable** by customer, geography, and product type.
