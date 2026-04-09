# PV Solar Digital Product Passport (DPP) — Complete Reference Document

> **Version:** 1.0 | **Date:** 2026-04-09 | **Status:** Living Document
>
> This is the **single exhaustive reference** for designing and building a Digital Product Passport system for Photovoltaic (PV) Solar Panels. It consolidates regulatory analysis, industry standards, competitor intelligence, a complete data model, reference architecture, a Waaree Energies case study, and a circularity framework into one actionable document.

---

## How to Use This Document

| Audience | Start Here |
|----------|-----------|
| **Product managers** | Section 1 (Executive Summary), Section 2 (Regulatory), Section 9 (Roadmap) |
| **Data architects** | Section 5 (Data Model), Section 6 (Architecture) |
| **Compliance teams** | Section 2 (Regulatory), Section 3 (Standards), Section 8 (Waaree Gap Analysis) |
| **Frontend engineers** | Cross-reference with [docs/11_frontend_product_blueprint.md](./docs/11_frontend_product_blueprint.md) and [docs/13_frontend_screen_specifications.md](./docs/13_frontend_screen_specifications.md) |
| **Recyclers / EoL stakeholders** | Section 7 (Circularity & Sustainability) |
| **Investors / business development** | Section 1 (Executive Summary), Section 4 (Competitor Benchmarking), Section 8 (Waaree Case Study) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Regulatory Landscape](#2-regulatory-landscape)
3. [Industry Initiatives & Standards](#3-industry-initiatives--standards)
4. [Competitor & Industry Benchmarking](#4-competitor--industry-benchmarking)
5. [Complete PV Passport Data Model](#5-complete-pv-passport-data-model)
6. [Reference Architecture](#6-reference-architecture)
7. [Circularity & Sustainability Framework](#7-circularity--sustainability-framework)
8. [Case Study: Waaree Energies](#8-case-study-waaree-energies)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Appendices](#10-appendices)

---

## 1. Executive Summary

### Purpose

This document provides everything needed to design, build, and validate a production-grade Digital Product Passport (DPP) platform for photovoltaic solar modules. It serves as the **master reference** for the HelioTrail platform — the only PV-specific DPP platform globally.

### Scope

The document covers:
- The full EU regulatory environment applicable to PV product passports
- Every relevant industry initiative, consortium, and standard
- A competitive landscape analysis with architecture comparisons
- A complete 3-layer data model covering static, traceability, and dynamic attributes
- A hybrid reference architecture with identity, trust, and interoperability layers
- A circularity framework covering recycling, reuse, and material recovery
- A detailed Waaree Energies case study with gap analysis
- A phased implementation roadmap

### Strategic Conclusions

1. **There is not yet a battery-passport-equivalent PV schema.** PV does not have the same level of sector-specific, regulated schema maturity that batteries have today. This is the opportunity — define the standard before the EU mandates it.

2. **The safest product strategy is a tiered schema.** Separate regulatory core (high certainty), industry-consensus extensions (medium certainty), and advanced lifecycle intelligence (low certainty / differentiating).

3. **The best technical pattern is hybrid.** Structured cloud storage for full records + integrity hashes for immutability + DID/VC for trust + optional blockchain anchoring only where multi-party trust justifies it.

4. **The frontend must be a real SaaS product.** Clear app shell, role-based navigation, guided creation workflows, evidence-centric detail pages, and public/restricted views — not a document viewer or compliance spreadsheet.

### Market Context

- **EU DPP central registry launches July 19, 2026** — 3-month window to be production-ready
- **Battery passports become mandatory February 18, 2027** — PV will follow
- **PV waste will exceed 80 million tonnes by 2050** — circularity data is commercially valuable
- **DPP market: $2.4B (2025) to $10.8B (2035)**, CAGR 16-36%
- **No competitor offers a dedicated PV DPP platform** — Circularise has a pilot only (FAIR PV)

> See also: [docs/01_product_vision_and_scope.md](./docs/01_product_vision_and_scope.md), [docs/00_MASTER_INDEX.md](./docs/00_MASTER_INDEX.md)

---

## 2. Regulatory Landscape

### 2.1 EU ESPR — The Horizontal DPP Framework

**Regulation:** (EU) 2024/1781 — Ecodesign for Sustainable Products Regulation
**Source:** https://eur-lex.europa.eu/eli/reg/2024/1781/eng

The ESPR entered force in 2024 and establishes the horizontal framework for Digital Product Passports across all product groups. It does NOT yet specify PV-specific data requirements — those will come via delegated acts.

**What is firm today:**

| ESPR Requirement | Article | Implication for PV |
|-----------------|---------|-------------------|
| Persistent unique product identifier | Art. 8 | Must implement ISO/IEC 15459 / GS1 compliant IDs |
| Physical data carrier (QR, RFID, NFC) | Art. 8 | QR code on physical product required |
| Interoperability | Art. 8 | Open APIs, standard data exchange formats |
| Access and update rights controlled | Art. 10 | Role-based access tiers (public, legitimate-interest, authority) |
| Data integrity, authentication, security | Art. 10 | Hashing, signing, audit trails |
| Product-group-specific data fields | Via delegated acts | PV delegated act NOT yet published |

**Omnibus Simplification (2025):** The EU's deregulation wave scaled back CSRD significantly but **left the DPP framework untouched**. DPP requirements remain fully on track.

### 2.2 ESPR Working Plan 2025-2030 — PV Timeline

**Source:** https://oneclicklca.com/en/resources/articles/first-espr-working-plan

The EU Commission published its first ESPR Working Plan in April 2025, prioritizing product groups for delegated acts:

| Product Group | Expected Delegated Act |
|--------------|----------------------|
| Iron and steel | 2026 |
| Textiles / Apparel | 2027 |
| Tyres | 2027 |
| Furniture | 2028 |
| Aluminium | 2028 |
| EV chargers | 2028 |
| Electric motors | 2028 |
| Mobile phones and tablets | 2030 |
| **Solar PV modules** | **Not explicitly listed — likely 2028-2030** |

**Key insight:** PV modules are NOT in the first wave of priority product groups. However:
- The ESIA (European Solar PV Industry Alliance) is actively pushing for mandatory PV DPP
- Energy-related products may be addressed via EPREL (EU Product Registry for Energy Labelling) or future acts
- A 2028 mid-term review is the likely inflection point for adding PV
- Industry consensus timeline for mandatory PV DPP: **2028-2030**

**Strategic implication:** Building now creates a 2-4 year first-mover advantage before compliance becomes mandatory.

### 2.3 EU Batteries Regulation 2023/1542 — The Template

**Source:** https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1542

The Batteries Regulation is the most mature real-world EU passport model and serves as the **architectural template** for PV:

- **Mandatory from:** February 18, 2027 (for EV and industrial batteries >2kWh)
- **Access tiers proven:** Public / legitimate-interest / authority — three distinct levels
- **Data granularity proven:** Model-level + item-level + use-phase information
- **QR-linked access proven:** Physical data carrier resolving to digital passport
- **Controlled update proven:** Integrity mechanisms and update permissions

**What to reuse:** Structure, access tier thinking, modular schema design, evidence hashing, lifecycle status model, EoL/recycler data emphasis.

**What NOT to copy:** Battery-specific physics (chemistry, SoH, cycle count) — replace with PV-native equivalents (module technology, degradation rate, operating hours).

### 2.4 WEEE Directive — PV End-of-Life Obligations

**Directive:** 2012/19/EU as amended by (EU) 2024/884
**Deadline:** Member state transposition by October 2025

PV modules have been classified as electronic waste (Category 4 — Large Equipment) since 2012 under the WEEE Directive. Key obligations:

| Obligation | Target | Reference |
|-----------|--------|-----------|
| Collection rate | 85% of waste generated OR 65% of equipment placed on market | Art. 7 |
| Material recovery | 85% by weight | Annex V |
| Reuse and recycling | 80% by mass | Annex V |
| Producer registration | Mandatory in national WEEE registers | Art. 16 |
| Periodic reporting | Collection, treatment, recycling volumes | Art. 12 |
| Extended Producer Responsibility (EPR) | Financial responsibility for collection, treatment, recycling | Art. 13 |
| Take-back schemes | Free take-back from distributors and collection points | Art. 5 |

**2024/884 amendments (key changes):**
- Strengthened EPR obligations
- Enhanced traceability requirements for waste shipments
- Improved reporting granularity
- Deadline for member state transposition: **October 2025**

**Implication for DPP:** Strong justification for including dismantling instructions, material composition, hazardous substance identification, and recycler-facing data directly in the passport.

### 2.5 REACH & RoHS — Chemical Compliance

#### REACH (EC 1907/2006)
- **SVHC communication:** Manufacturers/importers must communicate if articles contain Substances of Very High Concern (SVHC) above 0.1% w/w
- **Article-level transparency:** Structured BOM/substance model is highly valuable for compliance
- **Relevant SVHCs for PV:** Lead (solder), cadmium (thin-film CdTe), certain flame retardants in backsheets

#### RoHS (2011/65/EU)
- **Current status:** PV panels are **exempt** from RoHS under Category 4 (large-scale fixed installations)
- **However:** The exemption is under review and may be narrowed
- **Lead in solder:** Currently exempted (Annex III, Category 7a) — but subject to periodic review
- **CdTe thin-film:** Specifically exempted for cadmium content in thin-film solar cells
- **Implication:** Track RoHS status and substance data even if currently exempt — regulation may tighten

### 2.6 CBAM — Carbon Border Adjustment Mechanism

**Regulation:** (EU) 2023/956
**Source:** https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en

| Aspect | Status |
|--------|--------|
| **Current scope** | Cement, iron & steel, aluminium, fertilizers, electricity, hydrogen |
| **PV modules directly covered?** | **No** — not in current scope |
| **PV components covered?** | **Yes** — aluminium frames, steel mounting structures fall under aluminium/steel categories |
| **Extension to PV?** | The European Solar Manufacturing Council (ESMC) is actively pushing for CBAM extension to cover PV modules |
| **Transitional period** | October 2023 - December 2025 (reporting only, no financial adjustment) |
| **Full implementation** | January 2026 (financial adjustment begins) |

**Why CBAM matters for PV DPP:**
- Aluminium frame (~9.5% of module weight) is already CBAM-covered — embedded carbon must be declared
- If CBAM extends to PV modules directly, **carbon footprint data in the passport becomes mandatory for import**
- Manufacturing-origin carbon intensity becomes commercially material (EU vs. China vs. India)
- The JRC harmonized carbon footprint rules (July 2025) provide the calculation methodology

**Data requirement:** The DPP should track carbon footprint per material/component to prepare for CBAM extension.

### 2.7 UFLPA & Forced Labor — Polysilicon Traceability

**US Legislation:** Uyghur Forced Labor Prevention Act (UFLPA), effective June 2022
**EU Legislation:** Forced Labour Regulation (EU) 2024/3015, effective December 2027

#### UFLPA (United States)
- **Rebuttable presumption:** All goods from Xinjiang region (China) are presumed made with forced labor unless proven otherwise
- **PV impact:** Xinjiang produces ~35% of global polysilicon supply
- **Enforcement:** US Customs and Border Protection (CBP) has detained multiple PV module shipments
- **Supply chain bifurcation:** Major manufacturers maintain separate UFLPA-compliant supply chains for US market
- **Traceability requirement:** Full chain-of-custody from polysilicon to finished module, with third-party audits

#### EU Forced Labour Regulation
- **Scope:** Prohibits placing, making available, or exporting products made with forced labor
- **Entry into force:** December 2027 (applies 3 years after regulation date)
- **Due diligence:** Risk-based approach, proportionate to size of economic operator
- **Investigation authority:** National competent authorities + Commission

**Implication for DPP:**
- Supply chain traceability to polysilicon origin is essential, not optional
- Chain-of-custody events must be auditable (mine → ingot → wafer → cell → module)
- Third-party assurance reports should be linkable in the passport
- Dual supply chain tracking (UFLPA-compliant vs. standard) should be representable

### 2.8 EU CSDDD — Corporate Sustainability Due Diligence

**Directive:** (EU) 2024/1760 — Corporate Sustainability Due Diligence Directive
**Source:** https://eur-lex.europa.eu/eli/dir/2024/1760/oj

| Aspect | Detail |
|--------|--------|
| **Scope** | EU companies with >1,000 employees and >€450M net turnover; non-EU companies with >€450M EU turnover |
| **Obligations** | Identify, prevent, mitigate adverse human rights and environmental impacts across value chain |
| **Supply chain coverage** | Full upstream (direct and indirect suppliers) and downstream (distribution, recycling) |
| **Transposition deadline** | July 26, 2026 (Member States) |
| **Application begins** | July 2027 (largest companies), phased through 2029 |
| **Relevance to PV DPP** | Supply chain due diligence reports, ESG assessments, and remediation evidence can be structured in the passport |

**Implication for DPP:**
- Due diligence reports become passport artifacts
- Supplier ESG compliance status should be trackable
- Remediation actions should be auditable
- Integration point: CSDDD evidence → passport supply chain section

### 2.9 PV Carbon Footprint Rules (JRC, July 2025)

The EU Joint Research Centre published **harmonized rules for calculating PV module carbon footprint:**

- **Functional unit:** grams of CO2 equivalent per kWh (gCO2eq/kWh) of electricity produced
- **Range:** 10.8 to 44 gCO2eq/kWh depending on manufacturing conditions
- **Methodology:** EU Environmental Footprint method + PV-specific PEFCR (Product Environmental Footprint Category Rules)
- **Major carbon sources:** Electricity for silicon manufacturing, silicon content, aluminium frame, glass, panel lifetime
- **Significance:** "One of the first steps on the path to introducing mandatory carbon footprint requirements at product level"

**Source:** https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/photovoltaic-panels-new-rules-assessment-carbon-footprint-2025-07-07_en

### 2.10 Mandatory vs. Voluntary Requirements Matrix

| Requirement | Legal Basis | Status | PV Applicability | DPP Treatment |
|------------|-------------|--------|------------------|---------------|
| Unique product identifier | ESPR Art. 8 | **Mandatory** | Direct | Regulatory Core |
| Physical data carrier (QR) | ESPR Art. 8 | **Mandatory** | Direct | Regulatory Core |
| Economic operator identification | ESPR Art. 8 | **Mandatory** | Direct | Regulatory Core |
| Product specifications | ESPR Art. 8 | **Mandatory** (via delegated act) | Awaiting PV act | Regulatory Core |
| Compliance documentation | ESPR Art. 8 | **Mandatory** | Direct | Regulatory Core |
| Access control / role-based | ESPR Art. 10 | **Mandatory** | Direct | Regulatory Core |
| Data integrity / audit trail | ESPR Art. 10 | **Mandatory** | Direct | Regulatory Core |
| WEEE collection/recycling data | WEEE Directive | **Mandatory** | Direct (Category 4) | Industry Consensus |
| Material composition / BOM | ESPR (future act) | **Mandatory** (expected) | PV act pending | Industry Consensus |
| Carbon footprint | JRC rules / future ESPR act | **Mandatory** (expected) | Methodology published | Industry Consensus |
| SVHC / substances of concern | REACH | **Mandatory** (>0.1% w/w) | Direct | Industry Consensus |
| Supply chain due diligence | CSDDD | **Mandatory** (for large companies) | Indirect | Industry Consensus |
| Forced labor attestation | UFLPA / EU FL Reg | **Mandatory** (for US/EU market) | Direct for polysilicon | Industry Consensus |
| CBAM carbon declaration | CBAM | **Mandatory** (for Al/steel components) | Partial | Industry Consensus |
| Operational telemetry | None | **Voluntary** | Product differentiator | Advanced Intelligence |
| Degradation/performance tracking | None | **Voluntary** | Product differentiator | Advanced Intelligence |
| Digital twin integration | None | **Voluntary** | Product differentiator | Advanced Intelligence |
| Reuse/refurbishment scoring | None | **Voluntary** | Commercially valuable | Advanced Intelligence |

> See also: [docs/02_regulatory_landscape.md](./docs/02_regulatory_landscape.md)

---

## 3. Industry Initiatives & Standards

### 3.1 European Solar PV Industry Alliance (ESIA) — PV Passport Program

The ESIA has published two landmark documents defining the PV passport concept:

**PV Passport Journey I** (June 2024): "Paving the way — Understanding Solar PV as a Preliminary Step Toward Implementing a PV Module Passport"
**Source:** https://solaralliance.eu/wp-content/uploads/2024/06/ESIA-PV-Passport_13062024.pdf

**PV Passport Journey II** (November 2024): "Implementation of a Mandatory Digital Product Passport (DPP) for Solar PV in the EU"
**Source:** https://solaralliance.eu/wp-content/uploads/2024/11/ESIA-PV-Passport-II.pdf

**Proposed PV Passport components:**
- Product information (identity, manufacturer, specs)
- Material inventory (critical raw materials: silicon, silver, indium + toxic/heavy metal disclosure)
- Carbon footprint (CO2) and circularity calculator
- Traceability (supply chain actors and events)
- Value chain process management
- Circular economy tools
- Partnerships with certified recyclers
- Disassembly/recycling instructions

**Prototype development:** The Bern University of Applied Sciences (BFH) developed a PV DPP prototype under the RETRIEVE project, reported in pv-magazine (June 2025).
**Source:** https://www.pv-magazine.com/2025/06/03/european-initiative-introduces-digital-product-passport-prototype-for-pv-industry/

### 3.2 Solar Stewardship Initiative (SSI)

The SSI is an independent, industry-led initiative promoting responsible and sustainable solar manufacturing through certification standards.

**Traceability Standard v1.0 (December 2024):**
- Chain-of-custody certification for solar supply chains
- Covers polysilicon → ingot → wafer → cell → module
- Three chain-of-custody models: identity preservation, segregation, mass balance
- Third-party audit requirements
- Annual surveillance audits

**ESG Standard:**
- Environmental, Social, and Governance requirements for solar manufacturers
- Labor rights and working conditions (addresses forced labor concerns)
- Environmental management (emissions, water, waste)
- Governance and ethics (anti-corruption, whistleblowing)
- Aligns with ILO conventions and UN Guiding Principles on Business and Human Rights

**Relevance to DPP:**
- SSI certification status can be a verifiable credential in the passport
- Chain-of-custody events map directly to the passport traceability section
- ESG compliance evidence supports CSDDD requirements

### 3.3 SolarPower Europe

Europe's largest solar energy association, representing over 300 member organizations:
- Published EU Solar Industry Strategy recommendations
- Active in sustainability and circularity working groups
- Coordinating with ESIA on PV passport development
- Circularity roadmap advocating for design-for-recycling, material transparency, and second-life markets
- Policy advocacy for CBAM extension to PV, domestic manufacturing incentives, and fair trade measures

### 3.4 PV Cycle — Producer Responsibility Organization

Europe's primary producer responsibility organization for solar PV:
- **WEEE compliance:** Collection, transport, and waste treatment of end-of-life PV panels
- **Operations:** Centralized registration and reporting platform for EU-27 and UK
- **Producer registration:** National WEEE/Battery register management on behalf of producers
- **Reporting:** Periodic reporting on collection, treatment, and recycling volumes
- **Volume:** Over 27,000 tonnes of PV waste collected to date
- **Coverage:** Active in 27 EU member states + UK

**Source:** https://pvcycle.org/pv-cycle-europe-services

**Relevance to DPP:** Collection scheme reference (passport field `collectionScheme`), recycler partner linkage, EPR compliance evidence.

### 3.5 Catena-X / Tractus-X — Automotive DPP Reference

Catena-X is the open data ecosystem for the automotive industry, providing a reference implementation for DPPs:
- **Ecopass:** DPP application for automotive components
- **Data sovereignty:** GAIA-X principles, International Data Spaces (IDS) architecture
- **Eclipse Tractus-X:** Open-source reference implementation on GitHub
- **DPP Expert Group:** Addressing ESPR, ELVR, Battery Regulation integration
- **Battery Passport:** First Catena-X certified solution by Spherity + RCS Global

**Relevance to PV:** Architecture patterns (decentralized data exchange, sovereign identity, twin registries) are transferable. The Catena-X model proves enterprise-scale DPP feasibility but requires PV-specific domain adaptation.

### 3.6 Battery Pass Consortium — Data Model Reference

**GitHub:** https://batterypass.github.io/BatteryPassDataModel/ (v1.2.0)

The Battery Pass data model provides the most mature sector-specific DPP schema, organized into 6 categories:

1. **General product information** — identity, manufacturer, model, specifications
2. **Material composition** — cell chemistry, materials, substances of concern
3. **Circularity** — dismantling, recycling, reuse, recovery
4. **Performance and durability** — SoH, cycle life, capacity retention
5. **Supply chain due diligence** — sourcing, chain of custody, third-party assurance
6. **Carbon footprint** — lifecycle emissions, methodology, verification

**Relevance to PV:** Use as structural template. The 6-category decomposition maps well to PV when physics-specific fields are replaced (chemistry → module technology, SoH → power retention, cycle count → operating hours).

### 3.7 ISO 59040 — Product Circularity Data Sheet (PCDS)

**Standard:** ISO 59040:2025
**Source:** https://www.iso.org/standard/82339.html

Published in 2025, ISO 59040 defines a standardized format for communicating product circularity information:
- Product identification
- Material composition and origin
- Design-for-circularity features
- Repair, refurbishment, and remanufacturing information
- End-of-life processing instructions
- Recovery rates and recyclability assessment

**Adopted by:** The RETRIEVE project (Horizon Europe) uses ISO 59040 as its DPP standard for PV modules.

**Relevance to DPP:** Alignment with ISO 59040 ensures interoperability with RETRIEVE project outputs and positions the platform for emerging circularity data standards.

### 3.8 IEC 61215 / 61730 — Performance & Safety Standards

| Standard | Scope | Current Version |
|----------|-------|----------------|
| **IEC 61215-1/1-1/2** | Design qualification and type approval — performance testing | 2021 |
| **IEC 61730-1/2** | Safety qualification — electrical, mechanical, fire safety | 2023 |
| **IEC 62108** | Concentrator PV module testing | Current |
| **UL 61730** | North American safety listing (harmonized with IEC) | Current |
| **BIS IS 14286** | Indian national standard for PV modules | Current |
| **IEC 62474** | Material declaration for electrical/electronic products | Current |

**Source:** https://insights.tuv.com/blog/how-to-achieve-revised-iec61215-iec-61730

**Relevance to DPP:** Certification records (standard, issuer, validity) are core passport fields. Test report references and compliance evidence are stored in the evidence vault.

### 3.9 PV DPP Pilot Projects

#### RETRIEVE Project (Horizon Europe)
- **Partners:** 18 partners from 10 countries
- **Lead:** Bern University of Applied Sciences (BFH)
- **Key partners:** Fraunhofer CSP, Sisecam (Turkey), Iberdrola (Spain), TotalEnergies (France), IFE (Norway)
- **DPP standard:** ISO 59040 (Product Circularity Data Sheet)
- **Methodology:** Survey of 70 industry experts + 15 in-depth stakeholder interviews
- **Architecture:** Modular system with role-based access
- **Status:** Integrating partner datasets; real-world pilot testing planned

#### FAIR PV Project (Netherlands) — Most Advanced Solar DPP
- **Partners:** Biosphere Solar, AMS Institute, TU Delft, Circularise
- **Timeline:** May 2024 - April 2026
- **Achievement:** World's first fully repairable, refurbishable, and transparently sourced PV module
- **DPP specification:** **176 data classes and 131 properties**
- **Technology:** Circularise's Smart Questioning for confidential data sharing
- **Infrastructure:** Blockchain-backed material provenance
- **Data scope:** Static (BOM, toxic substances, raw material origin, recycled content) AND dynamic (real-time energy output, repair history, degradation, health predictions)
- **Testing:** Innovation Pavilion in Amsterdam

**Source:** https://www.circularise.com/case-studies/building-a-transparent-solar-future-how-circularise-and-fair-pv-pioneered-circularity-with-digital-product-passports

### 3.10 Fraunhofer CSP & CEA-INES

**Fraunhofer CSP (Germany):**
- PV module material passport identified as key topic for 2025
- **PVConnect project:** Unified, interoperable data foundation connecting all life phases of PV power plants
- Active in the RETRIEVE project consortium
- Focus on failure diagnostics, reliability analysis, and material characterization
- **Source:** https://www.csp.fraunhofer.de/en/areas-of-research/material-analytics/material-passport-photovoltaics.html

**CEA-INES (France):**
- One of Europe's largest PV R&D facilities (200+ CEA employees, 100 industrial partners)
- "Design for recycle" approach: fluorine-free thermoplastic encapsulants, European-origin back sheets
- Internal ECO PV tool for Life Cycle Assessment optimization
- Silver reduction innovations: 26% less Ag via electrically conductive adhesives

### 3.11 Interoperability Standards

| Standard | Application | Priority for DPP |
|----------|-----------|-----------------|
| **GS1 Digital Link** | Web-based URI encoded in QR code — connects physical products to DPP | P0 |
| **GTIN** | Global Trade Item Number — primary product identifier | P0 |
| **EPCIS 2.0** | Standardized interfaces for supply chain event data | P2 |
| **ISO/IEC 15459** | Unique identification — required by ESPR Art. 8 | P0 |
| **Asset Administration Shell (AAS)** | Industry 4.0 digital twin framework — used in Catena-X | P2 |
| **JSON-LD** | Linked data serialization — enables semantic interoperability | P1 |
| **W3C DID Core** | Decentralized Identifiers for products and organizations | P1 |
| **W3C Verifiable Credentials 2.0** | Machine-verifiable credentials for certifications | P1 |

**GS1 Sunrise 2027:** The industry is transitioning from 1D barcodes to GS1 Digital Link QR codes. By 2027, GS1 Digital Link will be the primary standard for connecting physical products to their digital identities.

> See also: [docs/09_research_sources.md](./docs/09_research_sources.md)

---

## 4. Competitor & Industry Benchmarking

### 4.1 Competitive Landscape Overview

No competitor currently offers a dedicated PV-specific DPP platform. All competitors focus on batteries, automotive, plastics, or generic supply chains:

| Competitor | Focus | PV-Specific? | Architecture | Maturity |
|-----------|-------|-------------|--------------|---------|
| **Circularise** | Multi-industry (FAIR PV pilot) | Pilot only | Blockchain (Smart Questioning) | High |
| **Spherity** | Batteries, automotive (Catena-X certified) | No | DID/VC (VERA Studio) | High |
| **Circulor** | Batteries, automotive, tires | No | Blockchain (Hyperledger Fabric) | High |
| **iPoint-systems** | Compliance, sustainability (multi-industry) | No | Cloud/SaaS | High |
| **SAP Green Token** | ERP-integrated supply chain | No | Cloud/ERP (SAP native) | High |
| **Siemens Xcelerator** | Battery passport | No | IT/OT integration | Medium |
| **Narravero** | Multi-industry DPP-as-a-Service | No | Cloud/SaaS (white-label) | Medium |
| **R-Cycle** | Plastics packaging | No | Cloud | Medium |
| **SOLARCYCLE** | PV recycling + traceability | Recycling only | Proprietary | Low |
| **HelioTrail** | **PV-specific DPP** | **Yes (only dedicated platform)** | **Hybrid (cloud + integrity hashing)** | Building |

### 4.2 Detailed Competitor Profiles

#### Circularise (Netherlands) — Most Relevant Competitor
- **Technology:** Patented Smart Questioning — enables confidential supply chain data sharing without revealing source identity
- **PV experience:** Direct involvement in FAIR PV project (176 data classes, 131 properties)
- **Architecture:** Blockchain-backed material provenance
- **Passport creation:** No-code, minutes to create
- **Limitation:** Multi-industry focus limits PV depth; no dedicated PV data model or PV-specific analytics
- **Source:** https://www.circularise.com/

#### Spherity (Germany) — Battery Passport Leader
- **Platform:** VERA Studio (launched 2023) — white-label DPP management
- **Architecture:** W3C DIDs and Verifiable Credentials
- **Achievement:** First Catena-X certified Battery Passport solution (with RCS Global)
- **Clients:** Automotive and battery manufacturers
- **Limitation:** Strong in batteries, no PV-specific offering or data model
- **Source:** https://www.spherity.com/digital-product-passport

#### Catena-X Ecopass — Automotive DPP Reference
- **Architecture:** Decentralized data exchange with GAIA-X data sovereignty
- **Implementation:** Eclipse Tractus-X open-source reference
- **Key patterns:** Data space connectors, twin registries, usage policies
- **Limitation:** Automotive-specific domain model; requires significant adaptation for PV

#### Circulor (UK) — Enterprise Traceability
- **Architecture:** Hyperledger Fabric blockchain
- **Clients:** Volvo, Polestar, Volkswagen, Daimler, BMW
- **Features:** ML-powered BOM tracking, GPS-based supply chain, real-time monitoring
- **Partnership:** Rockwell Automation
- **Limitation:** No PV industry focus or solar-specific data model
- **Source:** https://circulor.com/

### 4.3 Feature Comparison Matrix

| Feature | Circularise | Spherity | SAP Green Token | HelioTrail |
|---------|------------|----------|-----------------|------------|
| **PV-specific data model** | No (generic) | No | No | **Yes (3-layer schema)** |
| **Passport creation** | No-code, minutes | White-label studio | ERP-integrated | **6-step wizard + auto-fill** |
| **BOM tracking** | Basic | Configurable | Deep ERP | **10-material template + CRM/SoC flags** |
| **Supply chain traceability** | Blockchain | DID/VC | Digital twin tokens | **5-stage timeline** |
| **Dashboard analytics** | Basic | N/A | Enterprise reports | **10 chart types + fleet intelligence** |
| **IoT/telemetry** | No | No | No | **Dynamic data tab** |
| **Recycler view** | No | No | No | **Planned** |
| **Carbon footprint tracking** | Limited | Via credentials | ERP-native | **JRC-aligned methodology** |
| **RBAC** | Yes | Yes | Yes | **Types defined, enforcement in progress** |
| **Bulk import** | Yes (10k+) | API | Native | **Not yet built** |
| **ERP integration** | Yes | API | Native SAP | **Stub only** |
| **Architecture** | Blockchain | DID/VC | Cloud/ERP | **Hybrid (cloud + integrity hashing)** |

### 4.4 Architecture Comparison

| Approach | Representative | Pros | Cons | Best For |
|----------|---------------|------|------|----------|
| **Centralized cloud** | SAP Green Token, Narravero | Simple, fast, enterprise-friendly | Single point of trust, limited cross-company verifiability | ERP-native environments |
| **Blockchain-first** | Circularise, Circulor | Strong immutability, multi-party trust | Expensive, rigid, poor for high-volume dynamic data, privacy challenges | Multi-stakeholder supply chains |
| **DID/VC-based** | Spherity | Verifiable, privacy-preserving, standards-based | Complex to implement, limited ecosystem adoption | Certificate verification, issuer trust |
| **Hybrid** | **HelioTrail** | Best of all worlds — cloud performance + selective immutability + optional blockchain | More complex architecture | **DPP platforms needing flexibility** |

### 4.5 HelioTrail Competitive Moat

No competitor offers all of these together for PV:
1. **PV-specific data model** with 3-layer schema aligned to ESPR delegated act structure
2. **Dynamic telemetry analytics** (10 chart types) — no competitor has real-time performance data in DPP
3. **Waaree-tailored wizard** with auto-fill and manufacturer-specific dropdowns
4. **Professional Swiss-minimal enterprise design** — investor/demo ready
5. **Integrated circularity/recycling workspace** with material recovery and dismantling data
6. **Both static and dynamic data** in one passport — unique in the market
7. **JRC-aligned carbon footprint methodology** — ready for future mandatory requirements

> See also: [docs/PV_DPP_COMPLETE_SPECIFICATION.md](./docs/PV_DPP_COMPLETE_SPECIFICATION.md) Section 5

---

## 5. Complete PV Passport Data Model

### Design Principle

The schema is organized in **3 layers** aligned with regulatory certainty:

```
┌───────────────────────────────────────────────────────────────┐
│  Layer 3: Advanced Lifecycle Intelligence (low certainty)      │
│  Telemetry, degradation, maintenance, digital twin, reuse     │
├───────────────────────────────────────────────────────────────┤
│  Layer 2: Industry Consensus Extensions (medium certainty)     │
│  BOM, substances, carbon, supply chain, circularity, warranty │
├───────────────────────────────────────────────────────────────┤
│  Layer 1: Regulatory Core (high certainty)                     │
│  Identity, operators, facilities, specs, compliance docs      │
└───────────────────────────────────────────────────────────────┘
```

### 5A. Static Attributes (Manufacturing / Design)

#### Product Identification

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `pvPassportId` | string | Unique passport identifier (ISO/IEC 15459 aligned) | L1 |
| `moduleIdentifier` | string | Module-level identifier | L1 |
| `serialNumber` | string | Module serial number | L1 |
| `batchId` | string | Batch/lot identifier | L1 |
| `modelId` | string | Product model identifier | L1 |
| `gtin` | string | GS1 Global Trade Item Number | L1 |
| `dataCarrierType` | enum | QR, DataMatrix, RFID, NFC | L1 |
| `passportVersion` | string | Current passport version | L1 |
| `passportStatus` | enum | draft, under_review, approved, published, superseded, archived, decommissioned | L1 |

#### Economic Operators

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `manufacturer.name` | string | Legal entity name | L1 |
| `manufacturer.operatorIdentifier` | string | EU economic operator ID | L1 |
| `manufacturer.address` | object | Registered address (country, city, postal code) | L1 |
| `manufacturer.contactUrl` | string | Contact URL | L1 |
| `importer.name` | string | EU importer name | L1 |
| `importer.operatorIdentifier` | string | Importer economic operator ID | L1 |
| `authorizedRepresentative` | object | EU authorized representative | L1 |
| `distributor[]` | array | Distribution chain actors | L1 |

#### Manufacturing Details

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `manufacturingFacility.facilityIdentifier` | string | Facility ID | L1 |
| `manufacturingFacility.name` | string | Facility name | L1 |
| `manufacturingFacility.location` | object | Country, address, GPS coordinates | L1 |
| `manufacturingDate` | ISO-8601 | Date of manufacture | L1 |
| `productionLineId` | string | Production line identifier | L2 |
| `processParameters` | object | Key manufacturing parameters (optional) | L3 |

#### Product Specifications

| Field | Type | Unit | Description | Layer |
|-------|------|------|-------------|-------|
| `moduleCategory` | enum | — | Mono, poly, thin-film, bifacial | L1 |
| `moduleTechnology` | enum | — | PERC, TOPCon, HJT, CIGS, CdTe | L1 |
| `ratedPowerSTC_W` | number | W | Nameplate power at STC | L1 |
| `moduleEfficiency_percent` | number | % | Module efficiency | L1 |
| `voc_V` | number | V | Open-circuit voltage | L1 |
| `isc_A` | number | A | Short-circuit current | L1 |
| `vmp_V` | number | V | Voltage at max power | L1 |
| `imp_A` | number | A | Current at max power | L1 |
| `maxSystemVoltage_V` | number | V | Max system voltage (typically 1000V or 1500V) | L1 |
| `moduleDimensions_mm` | object | mm | Length x width x depth | L1 |
| `moduleMass_kg` | number | kg | Total module mass | L1 |
| `tempCoeff_Pmax` | number | %/°C | Temperature coefficient of max power | L1 |
| `tempCoeff_Voc` | number | %/°C | Temperature coefficient of Voc | L1 |
| `tempCoeff_Isc` | number | %/°C | Temperature coefficient of Isc | L1 |
| `noct_C` | number | °C | Nominal Operating Cell Temperature | L1 |

#### Bill of Materials (BOM)

Typical PV module composition:

| Component | Material | Mass % | Recyclability |
|-----------|----------|--------|---------------|
| Front cover | Tempered glass | ~62-74% | Fully recyclable |
| Frame | Aluminium | ~9-10% | Fully recyclable |
| Solar cells | Crystalline silicon | ~3-5% | Recoverable (high value) |
| Encapsulant | EVA or POE | ~6.5-9.5% | Not recyclable (EVA) / Limited (POE) |
| Interconnects | Copper ribbons | ~0.6% | Recoverable |
| Cell metallization | Silver paste | ~0.05-0.06% | Recoverable (very high value) |
| Rear cover | Backsheet (polymer) or glass | ~3-7% | Limited (polymer) / Recyclable (glass) |
| Junction box | Plastics + copper | ~1-2% | Partially recyclable |
| Solder | Tin-lead or lead-free | trace | Contains lead (RoHS exempted) |

**BOM schema fields:**

```json
{
  "moduleMaterials": [
    {
      "materialName": "tempered glass",
      "componentType": "front_cover",
      "mass_g": 17800,
      "massPercent": 62.5,
      "casNumber": null,
      "isCriticalRawMaterial": false,
      "supplierId": "SUP-001",
      "recyclabilityHint": "fully_recyclable",
      "recycledContent_percent": 0,
      "originCountry": "IN"
    }
  ]
}
```

#### Certifications

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `declarationOfConformity` | object | URI + hash + hashAlg | L1 |
| `technicalDocumentationRef` | object | Reference to tech docs | L1 |
| `certificates[]` | array | Standard, issuer, validity, URI, hash | L1 |
| `userManual` | object | URI + hash | L1 |
| `installationInstructions` | object | URI + hash | L1 |
| `safetyInstructions` | object | URI + hash | L1 |

#### Environmental Data (Carbon Footprint)

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `epdRef` | object | Environmental Product Declaration reference + hash | L2 |
| `carbonFootprint.declaredValue_kgCO2e` | number | Total carbon footprint (kg CO2eq) | L2 |
| `carbonFootprint.functionalUnit_gCO2eq_per_kWh` | number | Per-kWh carbon intensity (JRC method) | L2 |
| `carbonFootprint.boundary` | enum | cradle_to_gate, cradle_to_grave | L2 |
| `carbonFootprint.methodology` | string | PEF, ISO 14040, JRC_harmonized_2025 | L2 |
| `carbonFootprint.verificationRef` | string | Third-party verification reference | L2 |
| `recycledContent[]` | array | Recycled content by material | L2 |
| `renewableContent_percent` | number | % renewable content | L2 |

#### Toxicity & Compliance

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `substancesOfConcern[]` | array | Name, CAS number, concentration %, regulatory basis | L2 |
| `reachStatus` | enum | compliant, non_compliant, exempt, under_review | L2 |
| `rohsStatus` | enum | compliant, compliant_with_exemption, exempt | L2 |
| `leadContent` | object | Lead present (solder), exemption basis (7a) | L2 |
| `cadmiumPresent` | boolean | CdTe thin-film specific | L2 |

#### Reliability & Warranty

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `productWarranty_years` | number | Product warranty duration | L2 |
| `performanceWarranty` | string | Performance guarantee terms (e.g., "87.4% at year 30") | L2 |
| `linearDegradation_percent_per_year` | number | Guaranteed degradation rate | L2 |
| `expectedLifetime_years` | number | Expected module lifetime | L2 |
| `testStandards[]` | array | IEC 61215, IEC 61730, UL, BIS, etc. | L2 |
| `pidResistance` | boolean | PID (Potential-Induced Degradation) resistance certified | L2 |
| `saltMistRating` | string | Salt mist corrosion test rating | L2 |
| `ammoniaResistance` | boolean | Ammonia corrosion resistance tested | L2 |

### 5B. Traceability & Supply Chain

#### Chain of Custody

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `supplyChainActors[]` | array | All actors with roles, IDs, locations | L2 |
| `supplyChainFacilities[]` | array | All facilities with IDs, locations, certifications | L2 |
| `chainOfCustodyEvents[]` | array | Custody transfer events (timestamp, from, to, evidence) | L2 |

#### Supplier Tiers

Material flow from raw material to finished module:

| Tier | Stage | Example Actor | Key Data |
|------|-------|--------------|----------|
| Tier 5 | Quartz mining | Quartz mine operator | Origin country, mine ID, ESG audit |
| Tier 4 | Polysilicon production | Polysilicon refinery | Facility ID, UFLPA compliance, purity grade |
| Tier 3 | Ingot/Wafer | Ingot puller / wafer slicer | Facility, lot ID, wafer specs |
| Tier 2 | Cell manufacturing | Cell producer | Technology, efficiency, lot ID |
| Tier 1 | Module assembly | Module manufacturer | Assembly date, line ID, QC data |

**Schema:**

```json
{
  "supplierTiers": [
    {
      "tier": 1,
      "stage": "module_assembly",
      "actor": { "name": "Waaree Energies", "id": "ACT-001" },
      "facility": { "name": "Surat Manufacturing Unit", "id": "FAC-IND-001", "country": "IN" },
      "certifications": ["IEC 61215", "ISO 9001"],
      "auditDate": "2025-11-15"
    }
  ]
}
```

#### Due Diligence

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `supplyChainDueDiligenceReport` | object | URI + hash + date + scope | L2 |
| `thirdPartyAssurances[]` | array | Audit reports, certifications, attestations | L2 |
| `uflpaCompliance` | object | Attestation status, compliant chain documentation | L2 |
| `ssiCertification` | object | SSI Traceability Standard certification status | L2 |
| `esgCompliance` | object | EcoVadis, CSDDD alignment, conflict minerals status | L2 |

#### Transport & Logistics

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `shippingRoute` | object | Origin, destination, mode of transport | L3 |
| `customsDeclaration` | object | HS code, customs reference, CBAM declaration | L3 |
| `importDeclaration` | object | EU import declaration reference | L3 |

### 5C. Dynamic Attributes (Lifecycle / Operational)

#### Real-time Performance

| Field | Type | Unit | Description | Layer |
|-------|------|------|-------------|-------|
| `currentActivePower_W` | number | W | Current active power output | L3 |
| `cumulativeEnergyGeneration_kWh` | number | kWh | Lifetime energy generated | L3 |
| `cumulativeIrradiance_kWh_m2` | number | kWh/m² | Cumulative irradiance received | L3 |
| `moduleTemperature_C` | number | °C | Current module temperature | L3 |
| `ambientTemperature_C` | number | °C | Current ambient temperature | L3 |
| `operatingHours_h` | number | h | Total operating hours | L3 |

#### Monitoring Data

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `inverterId` | string | Connected inverter identifier | L3 |
| `stringConfiguration` | object | String ID, position in array | L3 |
| `ivCurveData` | object | Latest IV curve reference + hash | L3 |
| `telemetry.endpoint` | string | Data source URL | L3 |
| `telemetry.manifestHash` | string | Integrity hash of telemetry manifest | L3 |
| `telemetry.accessPolicy` | string | Access control for telemetry data | L3 |

#### Maintenance History

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `maintenanceEvents[]` | array | Date, type (cleaning, repair, inspection), description, technician | L3 |
| `inspectionEvents[]` | array | Date, method (visual, IR, EL), findings, report reference | L3 |
| `componentReplacementEvents[]` | array | Component, reason, date, replacement part | L3 |

#### Performance Degradation

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `powerRetention_percent` | number | Current power as % of nameplate | L3 |
| `estimatedDegradationRate_percent_per_year` | number | Measured annual degradation | L3 |
| `anomalyFlags[]` | array | Active anomaly flags (PID, hotspot, delamination, snail trails, bypass diode failure) | L3 |
| `negativeEvents[]` | array | Historical negative events (hail, lightning, flooding) | L3 |

#### Ownership & Transfer

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `currentOwner` | object | Current asset owner/operator | L3 |
| `installationSite` | object | GPS coordinates, site ID, installation date | L3 |
| `ownershipTransferHistory[]` | array | Previous owners, transfer dates, sale type | L3 |

#### End-of-Life

| Field | Type | Description | Layer |
|-------|------|-------------|-------|
| `eolStatus` | enum | in_use, decommissioned, in_recycling, recycled, reused, disposed | L2 |
| `reuseAssessment` | object | Remaining capacity %, condition grade, reuse eligibility | L3 |
| `recyclingFacility` | object | Certified recycler name, ID, location | L2 |
| `materialRecoveryData[]` | array | Material, expected recovery %, actual recovery % | L2 |
| `disposalMethod` | string | Processing method used | L2 |
| `dismantlingInstructions` | object | Step-by-step disassembly, tool requirements, safety warnings | L2 |
| `recoveryOutcomes[]` | array | Material, mass recovered, purity, destination | L2 |

### 5D. Data Access Control Matrix

| Data Category | Public | Installer | Manufacturer | Regulator/Auditor | Recycler |
|---|---|---|---|---|---|
| Product ID & model | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manufacturer & facility | ✓ | ✓ | ✓ | ✓ | ✓ |
| Top-level specifications | ✓ | ✓ | ✓ | ✓ | ✓ |
| Certifications (summary) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Warranty terms | ✓ | ✓ | ✓ | ✓ | ✗ |
| Carbon footprint | ✓ | ✓ | ✓ | ✓ | ✓ |
| BOM (detailed) | ✗ | ✗ | ✓ | ✓ | ✓ |
| BOM (engineering) | ✗ | ✗ | ✓ | ✓ | ✗ |
| Substances of concern | ✗ | ✓ | ✓ | ✓ | ✓ |
| Supplier details (Tier 1-5) | ✗ | ✗ | ✓ | ✓ | ✗ |
| Due diligence reports | ✗ | ✗ | ✓ | ✓ | ✗ |
| Chain-of-custody events | ✗ | ✗ | ✓ | ✓ | ✗ |
| Performance data (dynamic) | ✗ | ✓ | ✓ | ✓ | ✗ |
| Maintenance history | ✗ | ✓ | ✓ | ✓ | ✗ |
| Dismantling instructions | ✓ (general) | ✓ | ✓ | ✓ | ✓ (full) |
| Recycling/recovery data | ✓ (summary) | ✓ | ✓ | ✓ | ✓ (full) |
| Approval logs / audit trail | ✗ | ✗ | ✓ | ✓ | ✗ |
| Draft / internal fields | ✗ | ✗ | ✓ | ✗ | ✗ |

### 5E. Canonical Example Object

```json
{
  "pvPassportId": "PVP-0000001",
  "moduleIdentifier": "MOD-123456789",
  "serialNumber": "SN-2026-001-00042",
  "batchId": "LOT-2026-Q1-001",
  "modelId": "WM-550N-TOPCON",
  "gtin": "08901234567890",
  "dataCarrierType": "qr_gs1_digital_link",
  "passportVersion": "v1",
  "passportStatus": "published",
  "manufacturer": {
    "name": "Waaree Energies Ltd.",
    "operatorIdentifier": "EO-WAAREE-001",
    "address": { "country": "IN", "city": "Surat", "state": "Gujarat" },
    "contactUrl": "https://waaree.com"
  },
  "importer": {
    "name": "Waaree EU GmbH",
    "operatorIdentifier": "EO-WAAREE-EU-001"
  },
  "manufacturingFacility": {
    "facilityIdentifier": "FAC-IND-SURAT-001",
    "name": "Waaree Surat Manufacturing Unit",
    "location": { "country": "IN", "region": "Gujarat" }
  },
  "manufacturingDate": "2026-01-12T00:00:00Z",
  "moduleCategory": "crystalline_silicon",
  "moduleTechnology": "topcon",
  "ratedPowerSTC_W": 550,
  "moduleEfficiency_percent": 21.3,
  "voc_V": 49.8,
  "isc_A": 13.82,
  "vmp_V": 41.8,
  "imp_A": 13.16,
  "maxSystemVoltage_V": 1500,
  "moduleDimensions_mm": { "length": 2278, "width": 1134, "depth": 30 },
  "moduleMass_kg": 28.5,
  "tempCoeff_Pmax": -0.30,
  "tempCoeff_Voc": -0.25,
  "tempCoeff_Isc": 0.05,
  "compliance": {
    "declarationOfConformity": {
      "uri": "https://vault.heliotrail.io/docs/doc-001.pdf",
      "hashAlg": "sha256",
      "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "certificates": [
      { "standard": "IEC 61215", "issuer": "TUV Rheinland", "validUntil": "2029-01-12" },
      { "standard": "IEC 61730", "issuer": "TUV Rheinland", "validUntil": "2029-01-12" },
      { "standard": "UL 61730", "issuer": "UL Solutions", "validUntil": "2029-06-30" },
      { "standard": "BIS IS 14286", "issuer": "BIS India", "validUntil": "2028-12-31" }
    ]
  },
  "carbonFootprint": {
    "declaredValue_kgCO2e": 425,
    "functionalUnit_gCO2eq_per_kWh": 18.2,
    "boundary": "cradle_to_gate",
    "methodology": "JRC_harmonized_2025",
    "verificationRef": "EPD-WAAREE-550-2026"
  },
  "materialComposition": {
    "moduleMaterials": [
      { "materialName": "tempered glass", "componentType": "front_cover", "mass_g": 17800, "massPercent": 62.5, "isCriticalRawMaterial": false, "recyclabilityHint": "fully_recyclable" },
      { "materialName": "aluminium", "componentType": "frame", "mass_g": 2700, "massPercent": 9.5, "isCriticalRawMaterial": false, "recyclabilityHint": "fully_recyclable" },
      { "materialName": "crystalline silicon", "componentType": "solar_cell", "mass_g": 900, "massPercent": 3.2, "isCriticalRawMaterial": true, "recyclabilityHint": "recoverable" },
      { "materialName": "silver", "componentType": "cell_metallization", "mass_g": 15, "massPercent": 0.05, "isCriticalRawMaterial": true, "recyclabilityHint": "recoverable" },
      { "materialName": "copper", "componentType": "interconnects", "mass_g": 180, "massPercent": 0.6, "isCriticalRawMaterial": false, "recyclabilityHint": "recoverable" },
      { "materialName": "EVA", "componentType": "encapsulant", "mass_g": 2700, "massPercent": 9.5, "isCriticalRawMaterial": false, "recyclabilityHint": "not_recyclable" },
      { "materialName": "backsheet", "componentType": "rear_cover", "mass_g": 900, "massPercent": 3.2, "isCriticalRawMaterial": false, "recyclabilityHint": "limited" }
    ],
    "substancesOfConcern": [
      { "name": "lead (Pb)", "casNumber": "7439-92-1", "concentration_w_w_percent": 0.002, "regulatoryBasis": "RoHS" }
    ],
    "reachStatus": "compliant",
    "rohsStatus": "compliant_with_exemption_7a"
  },
  "warranty": {
    "productWarranty_years": 25,
    "performanceWarranty": "87.4% at year 30",
    "linearDegradation_percent_per_year": 0.4,
    "expectedLifetime_years": 30
  },
  "supplyChain": {
    "supplierTiers": [
      { "tier": 1, "stage": "module_assembly", "actor": "Waaree Energies", "facility": "Surat, IN", "uflpaCompliant": true },
      { "tier": 2, "stage": "cell_manufacturing", "actor": "Waaree Cell Division", "facility": "Chikhli, IN", "uflpaCompliant": true },
      { "tier": 4, "stage": "polysilicon", "actor": "Compliant Polysilicon Source", "facility": "Non-Xinjiang", "uflpaCompliant": true }
    ],
    "ssiCertification": { "status": "not_certified", "targetDate": "2027-Q2" }
  },
  "endOfLife": {
    "status": "in_use",
    "dismantlingInstructions": "1. Remove junction box cover. 2. Disconnect cables. 3. Remove frame screws (4mm hex). 4. Separate glass from EVA/cell assembly using thermal or mechanical process.",
    "collectionScheme": "PV Cycle Europe",
    "recyclerPartner": "Veolia Environmental Services",
    "hazardousWarnings": ["Lead in solder joints — handle per local hazardous waste regulations"]
  }
}
```

> See also: [docs/04_pv_passport_data_schema.md](./docs/04_pv_passport_data_schema.md), [docs/10_bom_and_dynamic_data_design.md](./docs/10_bom_and_dynamic_data_design.md)

---

## 6. Reference Architecture

### 6.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PV Digital Product Passport                      │
│                      System Architecture                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐       │
│  │ QR Code/ │   │ Manufact.│   │ IoT/SCADA│   │ Recycler  │       │
│  │ NFC Tag  │   │ MES/ERP  │   │ Monitors │   │ Systems   │       │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘       │
│       │              │              │              │               │
│  ┌────▼──────────────▼──────────────▼──────────────▼───────┐      │
│  │              API Gateway / Data Ingestion                │      │
│  │         (REST + GraphQL + MQTT for IoT)                  │      │
│  └────────────────────┬────────────────────────────────────┘      │
│                       │                                            │
│  ┌────────────────────▼────────────────────────────────────┐      │
│  │              DPP Core Service Layer                      │      │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │      │
│  │  │Identity │ │Credential│ │Data      │ │Access    │   │      │
│  │  │Service  │ │Issuance  │ │Validation│ │Control   │   │      │
│  │  │(DID)    │ │(VC)      │ │Engine    │ │(RBAC)    │   │      │
│  │  └─────────┘ └──────────┘ └──────────┘ └──────────┘   │      │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │      │
│  │  │Passport │ │Evidence  │ │Approval  │ │Telemetry │   │      │
│  │  │Composer │ │Manager   │ │Workflow  │ │Aggregator│   │      │
│  │  └─────────┘ └──────────┘ └──────────┘ └──────────┘   │      │
│  └────────────────────┬────────────────────────────────────┘      │
│                       │                                            │
│  ┌────────────────────▼────────────────────────────────────┐      │
│  │                  Data Storage Layer                      │      │
│  │  ┌───────────┐  ┌────────────┐  ┌──────────────────┐   │      │
│  │  │Blockchain │  │PostgreSQL  │  │Object Storage     │   │      │
│  │  │(Optional  │  │/ Supabase  │  │(Documents, EPDs,  │   │      │
│  │  │ Anchoring,│  │(Structured │  │ Certificates,     │   │      │
│  │  │ DID Reg.) │  │ Passport   │  │ Test Reports)     │   │      │
│  │  │           │  │ Data, RBAC │  │                   │   │      │
│  │  │           │  │ Versions)  │  │                   │   │      │
│  │  └───────────┘  └────────────┘  └──────────────────┘   │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────┐      │
│  │              Stakeholder Portals                         │      │
│  │  Manufacturer │ Installer │ Regulator │ Consumer │ EOL  │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────┐      │
│  │              External Integrations                       │      │
│  │  EU DPP Registry │ GS1 Digital Link │ EPCIS │ Catena-X │      │
│  └─────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Architecture Layers

#### Layer 1 — Resolution & Registry
**Purpose:** Resolve QR / data carrier to passport, maintain status and manifest references.

| Component | Contents |
|-----------|----------|
| Passport resolver | QR → passport ID → latest public endpoint |
| Registry entries | Passport ID, product ID, latest manifest hash, status, revocation flags |
| EU DPP Registry connector | Bidirectional sync with EU central registry (when live, July 2026) |

#### Layer 2 — Core Passport Store
**Purpose:** Hold structured passport data with versioning, RBAC, and approval workflows.

| Component | Technology |
|-----------|-----------|
| Database | PostgreSQL (Supabase) |
| Schema validation | JSON Schema |
| Versioning | Immutable version snapshots per passport |
| RBAC | Role-based row-level security (Supabase RLS) |
| Approval workflow | State machine: draft → under_review → approved → published |

#### Layer 3 — Evidence & Document Vault
**Purpose:** Store and manage declarations, certificates, manuals, test reports, EPDs.

| Component | Technology |
|-----------|-----------|
| Storage | Supabase Storage / Vercel Blob |
| Integrity | SHA-256 hashing of all documents |
| Access control | Signed retrieval URLs, role-based visibility |
| Metadata | Document type, issuer, expiry, linked passport fields |

#### Layer 4 — Trust & Verification Layer
**Purpose:** Cryptographically verify issuer identity and document authenticity.

| Standard | Application |
|----------|-----------|
| **W3C DID Core** | Decentralized identifiers for manufacturers, certifiers, recyclers |
| **W3C Verifiable Credentials 2.0** | Machine-verifiable certificates (IEC, EPD, compliance declarations) |
| **PKI** | Certificate chain for document signing |

**Implementation note:** DID/VC is Phase 2+. For MVP, use document hashing + signed approvals. DID/VC adds cross-organization trust for credentials issued by third parties (TUV, UL, BIS).

**Comparison with Spherity battery passport approach:** Spherity uses DIDs as the primary identity model for all actors in the battery passport ecosystem. For PV, a pragmatic approach is to start with centralized identity (Supabase Auth) and introduce DIDs for inter-organization credential exchange where trust benefits justify the complexity.

#### Layer 5 — Telemetry & Lifecycle Intelligence
**Purpose:** Connect SCADA/IoT monitoring, store summaries and pointers.

**Design rule:** The passport should NOT behave like a SCADA historian.

| Store INSIDE the passport | Keep OUTSIDE the passport |
|--------------------------|--------------------------|
| Latest operating snapshot | 1-minute / 5-minute telemetry streams |
| Cumulative energy generation | Waveform-level inverter log archives |
| Degradation indicators | Raw sensor dumps |
| Maintenance/inspection history | Large weather/irradiance histories |
| Anomaly/incident history | |
| Pointers and hashes for datasets | |

#### Layer 6 — Integration Layer
| System | Integration Method | Priority |
|--------|-------------------|----------|
| EU DPP Registry | REST API (when launched July 2026) | P0 |
| GS1 Digital Link | QR code generation + resolution | P0 |
| ERP (SAP, Oracle) | REST API / file import | P1 |
| MES / PLM | REST API / webhook | P1 |
| Certification systems | Document upload + metadata | P1 |
| IEC 62474 | XML export for material declaration | P1 |
| Catena-X / Tractus-X | Eclipse reference implementation | P2 |
| EPCIS 2.0 | Supply chain event exchange | P2 |
| Recycler portals | REST API / partner views | P1 |

### 6.3 Data Carriers

| Carrier | Use Case | Standard | Priority |
|---------|----------|----------|----------|
| **QR code** | Primary — on module label, packaging, documentation | GS1 Digital Link | P0 |
| **NFC tag** | Optional — embedded in junction box or frame | ISO 14443 | P2 |
| **RFID** | Logistics — pallet/container tracking | EPC Gen2 / ISO 18000-6C | P2 |
| **DataMatrix** | Alternative to QR — higher density, smaller footprint | GS1 | P1 |

### 6.4 Technology Stack

| Layer | Recommended Technology |
|-------|----------------------|
| Frontend | Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Next.js API routes → REST API layer |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage / Vercel Blob |
| Authentication | Supabase Auth |
| Hosting | Vercel |
| Identifier Standard | GS1 Digital Link |
| Trust Layer | W3C DID Core + Verifiable Credentials (Phase 2+) |
| Blockchain | Optional — Ethereum L2 or Hyperledger for hash anchoring (Phase 3+) |

### 6.5 Build Recommendation

For the first release, keep blockchain **optional**. Make the product successful without blockchain, then enable anchoring where customer trust and cross-party auditability justify it. The evidence hashing + signed approvals model provides sufficient integrity for MVP.

> See also: [docs/05_reference_architecture.md](./docs/05_reference_architecture.md)

---

## 7. Circularity & Sustainability Framework

### 7.1 PV Waste Forecasts

| Timeframe | EU Annual PV Waste | EU Cumulative | Global |
|-----------|-------------------|---------------|--------|
| 2030 | 195,222 tonnes/year | — | — |
| 2040 | — | 6-13 million tonnes | — |
| 2050 | 2,127,300 tonnes/year | 21-35 million tonnes | 80+ million tonnes |

**Current EU recycling capacity:** ~170,000 tonnes/year — a **massive shortfall** vs. projected demand. Urgent reform of EU PV recycling infrastructure is needed.

**Source:** https://www.pv-tech.org/urgent-reform-of-eu-pv-recycling-needed-to-tackle-growing-waste-volume/

### 7.2 Second-Life Applications

| Application | Description | Requirements |
|------------|-------------|-------------|
| **Repowering** | Replace older modules in utility-scale plants with new ones; redeploy older modules to less demanding sites | Performance testing, degradation assessment, warranty transfer |
| **Off-grid reuse** | Deploy decommissioned modules for off-grid applications (rural electrification, water pumping, agricultural) | Basic functionality verification, reduced performance acceptable |
| **Building-integrated PV (BIPV)** | Integrate modules into building facades, roofs, or canopies where aesthetic/architectural function matters more than peak efficiency | Structural integrity, weather resistance, visual assessment |
| **Research & training** | Use modules for educational institutions, R&D labs, or technician training programs | Minimal performance requirements |
| **Emergency / disaster relief** | Rapid deployment of functional modules for disaster response power generation | Basic safety testing only |

**Second-life market data (2025):**

| Metric | Value |
|--------|-------|
| Used modules as % of resale listings | 1% |
| Total modules listed for resale | 1.62 million (+16.8% from 2020) |
| Average used module price | $0.058/W (Q4 2025, -30% from Jan 2024) |
| Secondary market discount | 20-70% vs. primary |
| Repairable/refurbishable modules | 45-65% of decommissioned with failures |
| Long-term performance validation | 23-year-old modules retain 87-88% power |

**Challenge:** Low new module prices ($0.08-0.12/W for new panels from China) are currently stalling second-life growth.

**Opportunity:** Major repowering wave starting in Western EU (10-15 year old utility-scale plants). IEC-based technical specifications needed for second-life module market.

**Sources:** https://www.pv-magazine.com/2026/03/20/low-new-module-prices-stall-growth-in-secondary-solar-market/, https://www.pv-magazine.com/2026/02/12/iec-based-technical-specifications-needed-for-second-life-pv-module-market/

### 7.3 Recycling Processes

| Technology | Process | Recovery Rates | Advantages | Limitations |
|-----------|---------|---------------|-----------|-------------|
| **Mechanical** (most commercialized) | Crushing, shredding, separation by size/density | Glass/Al: 80-90%; Si/Ag: low | Scalable, low cost | Low-value outputs for critical materials |
| **Thermal (Pyrolysis)** | High-temperature decomposition of EVA/backsheet | Si: up to 99.9999% purity; Ag: >90% | High-purity recovery | >500°C required, energy-intensive |
| **Chemical dissolution** | Solvent-based removal of EVA, acid leaching for metals | Ag: >95%; EVA: near-complete removal | High-value metal recovery | Toxic solvents, long reaction cycles |
| **FRELP** (Full Recovery End of Life PV) | Combined mechanical + thermal + chemical | Recovers Si, Ag, Cu, glass at higher value | Better economics | Baseline ~24% recycling rate, higher complexity |
| **Hybrid** | Combined mechanical + thermal/chemical stages | >85% overall | Meets WEEE targets | More complex process engineering |

**Fraunhofer ISE demonstrated:** 99% recycling rate is technically possible.

**Source:** https://www.intersolar.de/news/recycling-of-photovoltaic-modules

### 7.4 Material Recovery Rates

| Material | % of Module Weight | Recovery Rate | Economic Value | Recovery Technology |
|----------|-------------------|---------------|---------------|-------------------|
| **Glass** | ~62.5% | 80-95%+ | Low (commodity glass) | Mechanical separation |
| **Aluminium** | ~9.5% | 80-90%+ → 100% possible | Medium | Frame removal + smelting |
| **Silicon** | ~3.2% | Up to 99.9999% | High (solar-grade Si) | Thermal/chemical processing |
| **Silver** | ~0.05% | 90-95%+ | Very high ($800-1000/kg) | Acid leaching / electrolysis |
| **Copper** | ~0.6% | High (via FRELP) | Medium-high | Mechanical + chemical |
| **EVA** | ~9.5% | Near-complete removal | Negligible (waste fuel) | Thermal decomposition |
| **Backsheet** | ~3.2% | Limited | Low | Thermal / landfill |

**Strategic insight:** Silver from recycled PV panels could cover demand for new PV manufacturing. Efficient recycling significantly contributes to EU 40% domestic manufacturing target for renewables.

### 7.5 WEEE Compliance

| Obligation | Target | Status |
|-----------|--------|--------|
| Collection rate | 85% of waste generated | Mandatory |
| Material recovery | 85% by weight | Mandatory |
| Reuse and recycling | 80% by mass | Mandatory |
| Producer registration | National WEEE registers | Mandatory |
| EPR financial responsibility | Collection, treatment, recycling costs | Mandatory |
| Take-back schemes | Free take-back from distributors | Mandatory |
| Reporting | Annual volumes to national authorities | Mandatory |
| **Primary PRO for PV** | **PV Cycle** | Active in EU-27 + UK |

### 7.6 Circularity Metrics in the DPP

The passport should track and communicate:

| Metric | Description | Data Source |
|--------|------------|------------|
| **Module circularity status** | in_use → decommissioned → in_recycling → recycled / reused / disposed | Lifecycle events |
| **Recyclability score** | % of module mass that is recyclable by current technology | BOM + recyclability hints |
| **Recycled content %** | % of input materials from recycled sources | Supplier declarations |
| **Material recovery potential** | Expected recovery rates by material | BOM + recovery technology data |
| **Carbon benefit of recycling** | Avoided emissions from material recovery vs. virgin production | LCA calculation |
| **Second-life eligibility** | Remaining capacity, condition grade, reuse readiness | Performance data + inspection |
| **Dismantling complexity** | Estimated time and tools required for disassembly | Design documentation |
| **WEEE compliance status** | Producer registered, collection scheme identified, reporting current | EPR records |

> See also: [docs/10_bom_and_dynamic_data_design.md](./docs/10_bom_and_dynamic_data_design.md)

---

## 8. Case Study: Waaree Energies

### 8.1 Company Profile

| Metric | Value |
|--------|-------|
| **Founded** | 1990 (as Waaree Group) |
| **Global module capacity** | 22.3 GW (19.7 GW India + 2.6 GW US) |
| **Cell capacity** | 5.4 GW |
| **Monthly output** | Crossed 1 GW milestone (December 2025) |
| **Market position** | India's largest PV module manufacturer and exporter |
| **Domestic market share** | 21% of Indian solar module market |
| **Export share** | 44% of India's solar module exports (FY24) |
| **FY24 Revenue** | Rs 11,632 crore (~$1.4B USD), +69% YoY |
| **FY24 Net Profit** | Rs 1,274 crore, +155% YoY |
| **IPO** | October 2024, 76.34x oversubscribed, listed at 70% premium |
| **Employees** | 10,000+ |
| **Markets served** | 400+ customers across 68+ countries |

**Sources:** https://www.pv-magazine.com/2025/12/15/indias-waaree-energies-lifts-global-solar-module-capacity-to-22-3-gw/, https://waaree.com/esg/

### 8.2 Product Lines

| Technology | Product Lines | Wattage Range | Cell Type | Key Specs |
|-----------|--------------|---------------|-----------|-----------|
| **Mono PERC** | Arka Series, Elite Series | 520-590W | P-type mono PERC | Established technology, cost-effective |
| **N-type TOPCon** | Ahnay Series | 550-700W | N-type TOPCon | Higher efficiency, lower degradation, BIS certified up to 625 Wp |
| **HJT (Heterojunction)** | Premium Series | 580-730W+ | N-type HJT | Highest efficiency, lowest temperature coefficient |
| **Bifacial** | Glass-glass options | 550-700W | PERC/TOPCon | Rear-side energy gain, extended warranty |

**EPD-certified module:** 550 Wp TOPCon — carbon footprint: 0.368 kg CO2e/Wp (cradle-to-gate)

### 8.3 Manufacturing Footprint

| Location | Capacity | Technology | Status |
|----------|----------|-----------|--------|
| **Surat, Gujarat (India)** | Primary hub | Multi-technology (PERC, TOPCon, HJT) | Operational |
| **Chikhli, Gujarat (India)** | Cell manufacturing | 5.4 GW cell capacity | Operational |
| **Texas (USA)** | 1.6 GW modules | TOPCon | Operational |
| **Arizona (USA)** | 1.0 GW modules | HJT (acquired from Meyer Burger) | Integration |
| **Nagpur, Maharashtra (India)** | 10 GW ingot/wafer | Planned vertical integration | Under construction |
| **Odisha (India)** | 6 GW integrated hub | Full value chain (ingot → module) | Planned |

### 8.4 Vertical Integration Roadmap

Waaree is transitioning from a module assembler to a fully integrated PV manufacturer:

```
Current State (2026):                    Target State (2028):
                                         
Polysilicon ── External supply           Polysilicon ── Oman investment ($30M)
    │                                        │
    ▼                                        ▼
Ingot/Wafer ── External supply           Ingot/Wafer ── Nagpur 10 GW plant
    │                                        │
    ▼                                        ▼
  Cell ──── 5.4 GW internal               Cell ──── 10+ GW internal
    │                                        │
    ▼                                        ▼
 Module ─── 22.3 GW capacity              Module ─── 30+ GW capacity
```

**Supply chain strategy for US market:**
- Separate UFLPA-compliant supply chain
- $30M polysilicon investment in Oman (non-Xinjiang source)
- US manufacturing (2.6 GW Texas + Arizona) provides domestic content for IRA incentives

### 8.5 Certifications and Standards

| Certification | Status | Issuer |
|--------------|--------|--------|
| IEC 61215-1/1-1/2:2021 | **Certified** | TUV Rheinland |
| IEC 61730-1/2:2023 | **Certified** | TUV Rheinland |
| UL 61730-1, UL 61730-2 | **Certified** | UL Solutions |
| IECEE CB Scheme | **Certified** (53 member countries) | IECEE |
| BIS IS 14286 | **Certified** (TOPCon up to 625 Wp) | Bureau of Indian Standards |
| Sand/dust testing | **Passed** | Third-party lab |
| Salt mist corrosion | **Passed** | Third-party lab |
| Ammonia corrosion | **Passed** | Third-party lab |
| **EcoVadis Gold Medal** | **Achieved** (97th percentile, top 5% globally) | EcoVadis |
| **EPD Certification** | **Achieved** (550 Wp low-carbon modules) | EPD International |

**Distinction:** Waaree is the **first Indian solar PV manufacturer** to achieve EcoVadis Gold Medal.

**Sources:** https://www.prnewswire.com/news-releases/waaree-energies-becomes-first-indian-solar-pv-manufacturer-to-achieve-ecovadis-gold-medal-302394945.html, https://waaree.com/wp-content/uploads/2025/01/certificate_for_550_wp.pdf

### 8.6 DPP Readiness Assessment

| Capability Area | Readiness | What Exists | What's Missing |
|----------------|-----------|-------------|----------------|
| **Product identity & specs** | **High** | Available in ERP/PLM/technical docs | Machine-readable structured schema |
| **Manufacturing records** | **Medium-High** | Production data, QC records | Not passport-ready format |
| **Certifications & test reports** | **High** | IEC/UL/BIS certificates, test reports | Structured metadata, hash-linked documents |
| **Material composition** | **Medium** | Engineering BOM exists partially | Not normalized, no CRM/SoC flags, no recyclability hints |
| **EPD / Carbon footprint** | **Medium-High** | EPD certified for 550 Wp modules | Not linked to individual passports |
| **ESG reporting** | **High** | EcoVadis Gold Medal | Not mapped to DPP data model |
| **Supplier-tier traceability** | **Low-Medium** | Tier 1 traceable, beyond Tier 1 fragmented | No structured chain-of-custody data |
| **Circularity / recycling data** | **Low-Medium** | Weakest enterprise data layer | No dismantling instructions, no recycler data |
| **Dynamic operational data** | **Low** | Plant/system-level monitoring only | Not module-passport-ready |
| **Trust / VC / DID** | **Low** | Not in current technology stack | Full implementation needed |
| **EU importer data** | **Low** | No EU entity established | Need EU importer / authorized representative |

### 8.7 Gap Analysis: Current State vs. ESPR Requirements

| Gap | Need | Current State | Priority | Effort |
|-----|------|--------------|----------|--------|
| **Schema normalization** | Machine-readable structured product schema, consistent product/batch/item identity | Data exists in multiple systems (ERP, PLM, docs) | **P0** | Medium |
| **Material transparency** | Deeper material declaration model with substance and CRM flags, supplier-linked evidence | Partial BOM, not normalized | **P0** | High |
| **EU importer data** | EU importer/authorized representative information for ESPR compliance | No EU entity data | **P0** | Low |
| **Multi-stakeholder access** | Public vs restricted passport views, evidence permissioning, auditor workflows | No role-based access system | **P0** | High |
| **EoL / recycler usability** | Dismantling instructions, recovery routing, outcome reporting | No recycler-facing data | **P1** | Medium |
| **Trust and evidence integrity** | Document hashing, signed approvals, verifiable claims | No integrity model | **P1** | High |
| **Supply chain traceability** | Multi-tier supplier mapping, chain-of-custody events | Only Tier 1 visible | **P1** | Very High |
| **Dynamic operational data** | Module-level performance data in passport format | Plant-level only | **P2** | High |

### 8.8 Recommended Deployment Path

| Phase | Scope | Timeline |
|-------|-------|----------|
| **Phase A** | Create regulatory core passport from existing ERP/PLM data. Digitize certifications and compliance docs. Unify product/batch/manufacturing identity. | Q2-Q3 2026 |
| **Phase B** | Add material composition and substance layer. Map supplier facilities. Link EPD/carbon evidence to passports. | Q3-Q4 2026 |
| **Phase C** | Add circularity/recycler data. Implement dismantling instructions. Add due diligence workflows. Introduce optional VC/DID trust layer. | Q4 2026 - Q1 2027 |
| **Phase D** | Add dynamic asset and degradation intelligence where commercially useful. Enable portfolio analytics. | Q1-Q2 2027 |

### 8.9 Discovery Questions for Waaree Workshop

1. What systems hold model, batch, and serial-level data? (ERP, PLM, MES?)
2. Is BOM available at module level or only engineering level?
3. Which supplier tiers are digitally traceable today?
4. How are EPD/carbon figures currently produced and verified?
5. What recycler / EoL data is currently maintained?
6. What approvals and signatures are already digitized?
7. Which customer/export markets are priority for DPP readiness?
8. What is the current state of EU importer/authorized representative data?
9. How does the EcoVadis reporting map to DPP data requirements?
10. What is the polysilicon sourcing strategy for UFLPA compliance?
11. Is there interest in SSI Traceability Standard certification?

> See also: [docs/07_waaree_gap_analysis.md](./docs/07_waaree_gap_analysis.md)

---

## 9. Implementation Roadmap

### 9.1 Delivery Waves

#### Wave 1 — Compliance Core (MVP) — Target: July 2026

**Goal:** Launch a usable passport platform with regulatory-core data, document integrity, and passport resolution.

| Deliverable | Description | Priority |
|------------|-------------|----------|
| Passport identity service | Create, version, and manage unique passport records | P0 |
| QR/data-carrier resolution | Physical QR → digital passport (GS1 Digital Link) | P0 |
| REST API layer | Business logic layer between frontend and database | P0 |
| Public passport views | Identity, specs, compliance, circularity summary, documents | P0 |
| Product schema v1 | Layer 1 (regulatory core) + basic Layer 2 fields | P0 |
| Document vault with hashing | Upload, store, hash, verify compliance documents | P0 |
| RBAC enforcement | Role-based route guards, permission checks | P0 |
| Manufacturer workspace | Dashboard, passport list, create/edit wizard | P0 |
| Audit trail | Version tracking with field-level change attribution | P0 |
| Restricted partner views | Recycler view (first priority) | P0 |
| Generate Label feature | Printable QR label for physical product marking (ESPR Art. 8) | P1 |

#### Wave 2 — Traceability and Circularity — Target: Q3 2026

**Goal:** Expand toward full DPP readiness with supply-chain and EoL intelligence.

| Deliverable | Description |
|------------|-------------|
| Supplier and facility registry | Structured actor/facility database with tier mapping |
| BOM/material composition workflows | Full BOM authoring, CRM/SoC flagging, recyclability hints |
| Substances-of-concern model | REACH/RoHS substance tracking per component |
| Due diligence report model | CSDDD-aligned evidence management |
| Chain-of-custody events | Custody transfer events with timestamp and evidence |
| Dismantling and recycler workflows | Step-by-step disassembly instructions, hazard warnings |
| Recovery outcome reporting | Actual vs. expected material recovery tracking |
| EU DPP Registry connector | API integration with EU central registry |
| Bulk import | CSV/Excel passport creation for large portfolios |
| IEC 62474 export | Material declaration in standard XML format |

#### Wave 3 — Lifecycle Intelligence — Target: Q4 2026

**Goal:** Differentiate the platform commercially with dynamic data and predictive analytics.

| Deliverable | Description |
|------------|-------------|
| Telemetry pointer architecture | Connect SCADA/IoT with passport-level summaries |
| Maintenance history | Structured maintenance, inspection, and cleaning records |
| Degradation summaries | Measured vs. expected performance, degradation curves |
| Anomaly event model | PID, hotspot, delamination, bypass diode failure tracking |
| Portfolio analytics | Fleet-level KPIs, compliance dashboard, degradation trends |
| Resale / second-life scoring | Condition assessment, remaining value estimation |
| Optional digital twin layer | Asset performance management integration |

### 9.2 Phase Priorities (Immediate — Before July 2026)

| # | Fix | Severity | Description |
|---|-----|----------|-------------|
| 1 | **Build REST API layer** | BLOCKER | Passport CRUD, document upload, approvals endpoints — currently all pages call Supabase directly |
| 2 | **Implement RBAC** | HIGH | Role-based route guards + component-level visibility — types defined but not enforced |
| 3 | **Build recycler view** | HIGH | `/partner/recycler/:id` with material recovery, dismantling, hazards — 0 of 4 restricted views built |
| 4 | **Wire search/filter** | MEDIUM | Passport list, evidence vault — currently UI-only inputs |
| 5 | **Generate Label feature** | MEDIUM | Printable label with QR for physical product marking (ESPR Art. 8) |
| 6 | **History/audit trail** | MEDIUM | Version tracking with field-level diffs — currently a stub |

### 9.3 Team Roles

| Role | Owns |
|------|------|
| **Product / domain lead** | Scope, schema prioritization, regulatory interpretation |
| **Compliance lead** | Field justification, evidence requirements, geographic rollout |
| **Solution architect** | System decomposition, security model, integration patterns |
| **Backend team** | APIs, data model, access control, versioning |
| **Frontend team** | Manufacturer portal, public passport viewer, restricted views |
| **Data / integration engineer** | ERP/MES/PLM connectors, import templates, evidence ingestion |
| **Trust / identity engineer** | DID/VC integration, certificate verification, trust registry |

### 9.4 Backlog Epics

| Epic | Scope | Wave |
|------|-------|------|
| EPIC-01 | Passport identity and registry | 1 |
| EPIC-02 | Product schema and validation | 1 |
| EPIC-03 | Evidence vault and hashing | 1 |
| EPIC-04 | Access control and tenanting | 1 |
| EPIC-05 | BOM and materials | 2 |
| EPIC-06 | Supply-chain graph | 2 |
| EPIC-07 | Circularity and recycling | 2 |
| EPIC-08 | Dynamic performance layer | 3 |
| EPIC-09 | Trust / VC / DID | 2-3 |
| EPIC-10 | Reporting and analytics | 3 |

### 9.5 Decision Gates

Before each wave, confirm:
- Target geography (EU first, then global?)
- Target product scope (TOPCon first, then full range?)
- Minimum regulatory interpretation (which fields are truly mandatory?)
- Customer data availability (what does Waaree actually have in their systems?)
- Whether blockchain anchoring is truly needed (justify cost vs. trust benefit)

> See also: [docs/08_implementation_roadmap.md](./docs/08_implementation_roadmap.md), [docs/17_frontend_delivery_backlog.md](./docs/17_frontend_delivery_backlog.md)

---

## 10. Appendices

### 10.1 Glossary

| Term | Definition |
|------|-----------|
| **AAS** | Asset Administration Shell — Industry 4.0 digital twin framework |
| **BIS** | Bureau of Indian Standards |
| **BIPV** | Building-Integrated Photovoltaics |
| **BOM** | Bill of Materials |
| **CBAM** | Carbon Border Adjustment Mechanism |
| **CdTe** | Cadmium Telluride (thin-film solar cell technology) |
| **CIGS** | Copper Indium Gallium Selenide (thin-film solar cell technology) |
| **CRM** | Critical Raw Material |
| **CSDDD** | Corporate Sustainability Due Diligence Directive |
| **DID** | Decentralized Identifier (W3C standard) |
| **DPP** | Digital Product Passport |
| **EoL** | End of Life |
| **EPD** | Environmental Product Declaration |
| **EPCIS** | Electronic Product Code Information Services |
| **EPR** | Extended Producer Responsibility |
| **ESIA** | European Solar PV Industry Alliance |
| **ESMC** | European Solar Manufacturing Council |
| **ESPR** | Ecodesign for Sustainable Products Regulation |
| **EVA** | Ethylene-vinyl acetate (encapsulant material) |
| **FRELP** | Full Recovery End of Life Photovoltaic |
| **GS1** | Global Standards One (identifier standards organization) |
| **GTIN** | Global Trade Item Number |
| **HJT** | Heterojunction Technology |
| **IEC** | International Electrotechnical Commission |
| **JRC** | Joint Research Centre (EU) |
| **LCA** | Life Cycle Assessment |
| **PCDS** | Product Circularity Data Sheet (ISO 59040) |
| **PEF** | Product Environmental Footprint |
| **PEFCR** | Product Environmental Footprint Category Rules |
| **PERC** | Passivated Emitter and Rear Contact (solar cell technology) |
| **PID** | Potential-Induced Degradation |
| **POE** | Polyolefin Elastomer (alternative encapsulant to EVA) |
| **PV** | Photovoltaic |
| **RBAC** | Role-Based Access Control |
| **REACH** | Registration, Evaluation, Authorisation and Restriction of Chemicals |
| **RoHS** | Restriction of Hazardous Substances |
| **SoC** | Substance of Concern |
| **SSI** | Solar Stewardship Initiative |
| **STC** | Standard Test Conditions (25°C, 1000 W/m², AM 1.5) |
| **SVHC** | Substance of Very High Concern (REACH) |
| **TOPCon** | Tunnel Oxide Passivated Contact (solar cell technology) |
| **UFLPA** | Uyghur Forced Labor Prevention Act |
| **VC** | Verifiable Credential (W3C standard) |
| **WEEE** | Waste Electrical and Electronic Equipment |

### 10.2 Full Data Schema (JSON Schema Format)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://heliotrail.io/schemas/pv-passport/v1",
  "title": "PV Digital Product Passport",
  "description": "Schema for a photovoltaic module digital product passport, aligned with EU ESPR framework",
  "type": "object",
  "required": ["pvPassportId", "moduleIdentifier", "manufacturer", "moduleTechnology", "ratedPowerSTC_W", "passportStatus"],
  "properties": {
    "pvPassportId": { "type": "string", "description": "Unique passport identifier" },
    "moduleIdentifier": { "type": "string", "description": "Module-level identifier" },
    "serialNumber": { "type": "string" },
    "batchId": { "type": "string" },
    "modelId": { "type": "string" },
    "gtin": { "type": "string", "pattern": "^[0-9]{8,14}$" },
    "dataCarrierType": { "type": "string", "enum": ["qr_gs1_digital_link", "data_matrix", "rfid", "nfc"] },
    "passportVersion": { "type": "string" },
    "passportStatus": { "type": "string", "enum": ["draft", "under_review", "approved", "published", "superseded", "archived", "decommissioned"] },
    "manufacturer": {
      "type": "object",
      "required": ["name", "operatorIdentifier"],
      "properties": {
        "name": { "type": "string" },
        "operatorIdentifier": { "type": "string" },
        "address": {
          "type": "object",
          "properties": {
            "country": { "type": "string" },
            "city": { "type": "string" },
            "state": { "type": "string" },
            "postalCode": { "type": "string" }
          }
        },
        "contactUrl": { "type": "string", "format": "uri" }
      }
    },
    "importer": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "operatorIdentifier": { "type": "string" }
      }
    },
    "authorizedRepresentative": { "type": "object" },
    "distributors": { "type": "array", "items": { "type": "object" } },
    "manufacturingFacility": {
      "type": "object",
      "properties": {
        "facilityIdentifier": { "type": "string" },
        "name": { "type": "string" },
        "location": { "type": "object" }
      }
    },
    "manufacturingDate": { "type": "string", "format": "date-time" },
    "moduleCategory": { "type": "string", "enum": ["crystalline_silicon", "thin_film", "multi_junction", "perovskite", "organic"] },
    "moduleTechnology": { "type": "string", "enum": ["perc", "topcon", "hjt", "cigs", "cdte", "perovskite", "shj", "ibc"] },
    "ratedPowerSTC_W": { "type": "number", "minimum": 0 },
    "moduleEfficiency_percent": { "type": "number", "minimum": 0, "maximum": 100 },
    "voc_V": { "type": "number" },
    "isc_A": { "type": "number" },
    "vmp_V": { "type": "number" },
    "imp_A": { "type": "number" },
    "maxSystemVoltage_V": { "type": "number" },
    "moduleDimensions_mm": {
      "type": "object",
      "properties": {
        "length": { "type": "number" },
        "width": { "type": "number" },
        "depth": { "type": "number" }
      }
    },
    "moduleMass_kg": { "type": "number" },
    "compliance": {
      "type": "object",
      "properties": {
        "declarationOfConformity": { "$ref": "#/$defs/hashedDocument" },
        "technicalDocumentationRef": { "$ref": "#/$defs/hashedDocument" },
        "certificates": { "type": "array", "items": { "$ref": "#/$defs/certificate" } },
        "userManual": { "$ref": "#/$defs/hashedDocument" },
        "installationInstructions": { "$ref": "#/$defs/hashedDocument" },
        "safetyInstructions": { "$ref": "#/$defs/hashedDocument" }
      }
    },
    "carbonFootprint": {
      "type": "object",
      "properties": {
        "declaredValue_kgCO2e": { "type": "number" },
        "functionalUnit_gCO2eq_per_kWh": { "type": "number" },
        "boundary": { "type": "string", "enum": ["cradle_to_gate", "cradle_to_grave"] },
        "methodology": { "type": "string" },
        "verificationRef": { "type": "string" }
      }
    },
    "materialComposition": {
      "type": "object",
      "properties": {
        "moduleMaterials": { "type": "array", "items": { "$ref": "#/$defs/material" } },
        "substancesOfConcern": { "type": "array", "items": { "$ref": "#/$defs/substanceOfConcern" } },
        "reachStatus": { "type": "string" },
        "rohsStatus": { "type": "string" }
      }
    },
    "warranty": {
      "type": "object",
      "properties": {
        "productWarranty_years": { "type": "number" },
        "performanceWarranty": { "type": "string" },
        "linearDegradation_percent_per_year": { "type": "number" },
        "expectedLifetime_years": { "type": "number" }
      }
    },
    "supplyChain": {
      "type": "object",
      "properties": {
        "actors": { "type": "array" },
        "facilities": { "type": "array" },
        "supplierTiers": { "type": "array" },
        "chainOfCustodyEvents": { "type": "array" },
        "dueDiligenceReport": { "$ref": "#/$defs/hashedDocument" },
        "thirdPartyAssurances": { "type": "array" }
      }
    },
    "endOfLife": {
      "type": "object",
      "properties": {
        "status": { "type": "string", "enum": ["in_use", "decommissioned", "in_recycling", "recycled", "reused", "disposed"] },
        "dismantlingInstructions": { "type": "string" },
        "collectionScheme": { "type": "string" },
        "recyclerPartner": { "type": "string" },
        "hazardousWarnings": { "type": "array", "items": { "type": "string" } },
        "recoveryOutcomes": { "type": "array" }
      }
    },
    "dynamic": {
      "type": "object",
      "properties": {
        "currentActivePower_W": { "type": "number" },
        "cumulativeEnergyGeneration_kWh": { "type": "number" },
        "moduleTemperature_C": { "type": "number" },
        "ambientTemperature_C": { "type": "number" },
        "operatingHours_h": { "type": "number" },
        "powerRetention_percent": { "type": "number" },
        "estimatedDegradationRate_percent_per_year": { "type": "number" },
        "anomalyFlags": { "type": "array", "items": { "type": "string" } },
        "maintenanceEvents": { "type": "array" },
        "snapshotTimestamp": { "type": "string", "format": "date-time" }
      }
    }
  },
  "$defs": {
    "hashedDocument": {
      "type": "object",
      "properties": {
        "uri": { "type": "string", "format": "uri" },
        "hashAlg": { "type": "string", "enum": ["sha256", "sha384", "sha512"] },
        "hash": { "type": "string" }
      }
    },
    "certificate": {
      "type": "object",
      "properties": {
        "standard": { "type": "string" },
        "issuer": { "type": "string" },
        "validUntil": { "type": "string", "format": "date" },
        "uri": { "type": "string", "format": "uri" },
        "hash": { "type": "string" }
      }
    },
    "material": {
      "type": "object",
      "properties": {
        "materialName": { "type": "string" },
        "componentType": { "type": "string" },
        "mass_g": { "type": "number" },
        "massPercent": { "type": "number" },
        "casNumber": { "type": ["string", "null"] },
        "isCriticalRawMaterial": { "type": "boolean" },
        "supplierId": { "type": "string" },
        "recyclabilityHint": { "type": "string", "enum": ["fully_recyclable", "recoverable", "limited", "not_recyclable"] },
        "recycledContent_percent": { "type": "number" },
        "originCountry": { "type": "string" }
      }
    },
    "substanceOfConcern": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "casNumber": { "type": "string" },
        "concentration_w_w_percent": { "type": "number" },
        "regulatoryBasis": { "type": "string" }
      }
    }
  }
}
```

### 10.3 Regulatory Reference Links

| Regulation / Standard | Document ID | URL |
|----------------------|------------|-----|
| ESPR | (EU) 2024/1781 | https://eur-lex.europa.eu/eli/reg/2024/1781/eng |
| Batteries Regulation | (EU) 2023/1542 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1542 |
| WEEE Directive | 2012/19/EU + (EU) 2024/884 | https://eur-lex.europa.eu/eli/dir/2012/19/oj |
| REACH | (EC) 1907/2006 | https://eur-lex.europa.eu/eli/reg/2006/1907/oj |
| RoHS | 2011/65/EU | https://eur-lex.europa.eu/eli/dir/2011/65/oj |
| CBAM | (EU) 2023/956 | https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en |
| CSDDD | (EU) 2024/1760 | https://eur-lex.europa.eu/eli/dir/2024/1760/oj |
| EU Forced Labour Regulation | (EU) 2024/3015 | https://eur-lex.europa.eu/eli/reg/2024/3015/oj |
| UFLPA | Public Law 117-78 | https://www.cbp.gov/trade/forced-labor/UFLPA |
| JRC PV Carbon Footprint | JRC 2025 | https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/photovoltaic-panels-new-rules-assessment-carbon-footprint-2025-07-07_en |
| ESPR Working Plan 2025-2030 | COM(2025) | https://oneclicklca.com/en/resources/articles/first-espr-working-plan |

### 10.4 Industry Initiative Sources

| Source | URL |
|--------|-----|
| ESIA PV Passport Journey I | https://solaralliance.eu/wp-content/uploads/2024/06/ESIA-PV-Passport_13062024.pdf |
| ESIA PV Passport Journey II | https://solaralliance.eu/wp-content/uploads/2024/11/ESIA-PV-Passport-II.pdf |
| BatteryPass Data Model v1.2.0 | https://batterypass.github.io/BatteryPassDataModel/ |
| Circularise FAIR PV Case Study | https://www.circularise.com/case-studies/building-a-transparent-solar-future-how-circularise-and-fair-pv-pioneered-circularity-with-digital-product-passports |
| PV Cycle Europe | https://pvcycle.org/pv-cycle-europe-services |
| Fraunhofer CSP Material Passport | https://www.csp.fraunhofer.de/en/areas-of-research/material-analytics/material-passport-photovoltaics.html |
| PV Magazine DPP Prototype | https://www.pv-magazine.com/2025/06/03/european-initiative-introduces-digital-product-passport-prototype-for-pv-industry/ |
| ETIP PV | https://etip-pv.eu/ |
| ISO 59040:2025 | https://www.iso.org/standard/82339.html |
| W3C DID Core | https://www.w3.org/TR/did/ |
| W3C Verifiable Credentials 2.0 | https://www.w3.org/news/2025/the-verifiable-credentials-2-0-family-of-specifications-is-now-a-w3c-recommendation/ |
| GS1 Digital Link | https://www.gs1.org/standards/gs1-digital-link |
| GS1 Standards for DPP | https://gs1.eu/wp-content/uploads/2024/12/GS1-Standards-Enabling-DPP.pdf |

### 10.5 Market & Competitor Sources

| Source | URL |
|--------|-----|
| Spherity DPP | https://www.spherity.com/digital-product-passport |
| Circularise | https://www.circularise.com/ |
| Circulor | https://circulor.com/ |
| DPP Market (MarketsandMarkets) | https://www.marketsandmarkets.com/Market-Reports/digital-product-passport-market-163607839.html |
| DPP Software Market (FMI) | https://www.futuremarketinsights.com/reports/digital-product-passport-software-market |

### 10.6 Waaree Energies Sources

| Source | URL |
|--------|-----|
| Waaree 22.3 GW Capacity | https://www.pv-magazine.com/2025/12/15/indias-waaree-energies-lifts-global-solar-module-capacity-to-22-3-gw/ |
| Waaree EU Expansion | https://www.pv-magazine.com/2025/12/26/waaree-targets-europe-expansion-under-eu-net-zero-industry-act/ |
| Waaree EcoVadis Gold | https://www.prnewswire.com/news-releases/waaree-energies-becomes-first-indian-solar-pv-manufacturer-to-achieve-ecovadis-gold-medal-302394945.html |
| Waaree Certifications | https://www.ul.com/news/ul-issues-iec-cb-2016-certification-bifacial-solar-pv-modules-waaree-energies-india |
| Waaree EPD Certificate | https://waaree.com/wp-content/uploads/2025/01/certificate_for_550_wp.pdf |
| Waaree ESG | https://waaree.com/esg/ |

### 10.7 Circularity & Recycling Sources

| Source | URL |
|--------|-----|
| PV Waste Forecasts | https://advanced.onlinelibrary.wiley.com/doi/10.1002/aesr.202500302 |
| EU PV Recycling Reform | https://www.pv-tech.org/urgent-reform-of-eu-pv-recycling-needed-to-tackle-growing-waste-volume/ |
| PV Recycling Approaches | https://now.solar/2026/02/11/recycling-approaches-for-end-of-life-pv-modules-taiyangnews/ |
| PV Recycling 99% Possible | https://www.intersolar.de/news/recycling-of-photovoltaic-modules |
| Second-Life PV Market | https://www.pv-magazine.com/2026/03/20/low-new-module-prices-stall-growth-in-secondary-solar-market/ |
| JRC Renewables Waste | https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/theres-new-waste-coming-transition-renewables-how-reuse-and-recycle-it-2025-03-11_en |
| IEC Second-Life Specs | https://www.pv-magazine.com/2026/02/12/iec-based-technical-specifications-needed-for-second-life-pv-module-market/ |

### 10.8 Local Documentation Cross-Reference

This document synthesizes content from the following project files:

| Section | Source File(s) |
|---------|---------------|
| Executive Summary | `docs/00_MASTER_INDEX.md`, `docs/01_product_vision_and_scope.md` |
| Regulatory Landscape | `docs/02_regulatory_landscape.md` + online research (CBAM, UFLPA, CSDDD, JRC) |
| Industry Initiatives | `docs/09_research_sources.md` + online research (SSI, ISO 59040, PV Cycle, RETRIEVE, FAIR PV) |
| Competitor Benchmarking | `docs/PV_DPP_COMPLETE_SPECIFICATION.md` Section 5 + online research |
| Data Model | `docs/04_pv_passport_data_schema.md`, `docs/10_bom_and_dynamic_data_design.md` |
| Reference Architecture | `docs/05_reference_architecture.md` |
| Circularity | Online research (recycling tech, material recovery, second-life, WEEE) |
| Battery Benchmark | `docs/06_benchmark_battery_vs_pv.md` |
| Waaree Case Study | `docs/07_waaree_gap_analysis.md` + online research (capacity, EPD, EcoVadis, supply chain) |
| Implementation Roadmap | `docs/08_implementation_roadmap.md` |
| Frontend specs | `docs/11_frontend_product_blueprint.md` through `docs/19_cta_and_microcopy_catalog.md` |
| Design system | `docs/14_design_system_and_component_library.md`, `docs/21_DESIGN.md` |

---

*This document was compiled on 2026-04-09 by synthesizing 22+ internal documentation files and comprehensive online research across regulatory, industry, competitive, and technical domains. It serves as the single exhaustive reference for the HelioTrail PV Digital Product Passport platform.*
