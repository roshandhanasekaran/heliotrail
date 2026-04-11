# PV Digital Product Passport Product Documentation Pack

This folder contains a **product-development-ready markdown pack** for building a **Digital Product Passport (DPP) solution for photovoltaic (PV) solar modules/panels**.

## What is inside

### Core product and research files
- `00_MASTER_INDEX.md` — single combined entry point
- `01_product_vision_and_scope.md` — product vision, goals, personas, use cases
- `02_regulatory_landscape.md` — official regulatory baseline and certainty levels
- `03_product_requirements.md` — functional and non-functional requirements
- `04_pv_passport_data_schema.md` — deep data attribute catalogue and schema design
- `05_reference_architecture.md` — recommended system architecture
- `06_benchmark_battery_vs_pv.md` — benchmark of battery-passport maturity vs PV
- `07_waaree_gap_analysis.md` — readiness/gap analysis for Waaree Energies
- `08_implementation_roadmap.md` — delivery phases, milestones, team roles
- `09_research_sources.md` — curated source list used for this pack
- `10_bom_and_dynamic_data_design.md` — focused design note for BOM-lite, engineering BOM, recycling BOM, and dynamic-data handling

### Frontend product-development files
- `11_frontend_product_blueprint.md` — end-to-end product surface strategy
- `12_frontend_information_architecture.md` — sitemap, routes, navigation, app shell
- `13_frontend_screen_specifications.md` — page-by-page screen specs
- `14_design_system_and_component_library.md` — UI components, buttons, cards, tables, banners, states
- `15_frontend_user_flows_and_states.md` — user journeys, approval flows, empty/error/loading states
- `16_frontend_data_binding_and_api_contracts.md` — frontend view models and backend contract expectations
- `17_frontend_delivery_backlog.md` — epics, stories, build order, definition of done
- `18_wireframes_and_layout_patterns.md` — logical page layouts and ASCII wireframes
- `19_cta_and_microcopy_catalog.md` — button labels, CTA logic, helper text, alert copy

### Combined reading files
- `PV_DPP_Combined_Dossier.md` — one long combined file for easy reading/export
- `PV_DPP_Frontend_Combined.md` — one long combined file focused on frontend build execution

## How to use this pack

### For product/domain planning
1. Read `00_MASTER_INDEX.md`.
2. Use `03_product_requirements.md` as your working PRD baseline.
3. Use `04_pv_passport_data_schema.md` as the schema/backlog foundation.
4. Use `05_reference_architecture.md` for engineering design reviews.
5. Use `07_waaree_gap_analysis.md` for customer-specific tailoring.
6. Use `08_implementation_roadmap.md` to create Jira/ClickUp/Notion tasks.

### For frontend development
1. Start with `11_frontend_product_blueprint.md`.
2. Then read `12_frontend_information_architecture.md`.
3. Build from `14_design_system_and_component_library.md`.
4. Implement screens using `13_frontend_screen_specifications.md`.
5. Use `15_frontend_user_flows_and_states.md` and `19_cta_and_microcopy_catalog.md` for UX behavior.
6. Wire backend integration using `16_frontend_data_binding_and_api_contracts.md`.
7. Use `17_frontend_delivery_backlog.md` to create engineering tickets.

## Important interpretation note

This pack separates data attributes into three certainty levels:

- **High certainty** — directly grounded in existing law/framework requirements or strong official DPP mechanics
- **Medium certainty** — strong industry-consensus / likely delegated-act candidates
- **Low certainty** — forward-looking design proposals useful for product differentiation

## Frontend design principles used in this pack

- **Trust first** — the UI must make provenance, evidence, verification status, and recency obvious.
- **Role-aware visibility** — public, customer, recycler, auditor, and manufacturer users do not see the same depth.
- **Progressive disclosure** — summary first, evidence and technical detail below.
- **Operational simplicity** — complex DPP data is broken into cards, sections, status rails, and guided wizards.
- **Accessibility by default** — keyboard support, focus visibility, consistent landmarks, touch-friendly actions, and strong contrast should align with WCAG 2.2.
- **Standards-friendly identity and resolution** — identifiers, QR resolution, and credential surfaces are designed to work well with GS1 Digital Link, DIDs, and Verifiable Credentials.

## Source baseline

Primary sources reviewed for this pack:

- ESPR / Ecodesign for Sustainable Products Regulation: https://eur-lex.europa.eu/eli/reg/2024/1781/eng
- EU Batteries Regulation / battery passport: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1542
- BatteryPass Data Model: https://batterypass.github.io/BatteryPassDataModel/
- Fraunhofer CSP material passport work for photovoltaics: https://www.csp.fraunhofer.de/en/areas-of-research/material-analytics/material-passport-photovoltaics.html
- Recent PV DPP prototype reporting: https://www.pv-magazine.com/2025/06/03/european-initiative-introduces-digital-product-passport-prototype-for-pv-industry/
- GS1 Digital Link overview: https://www.gs1.org/standards/gs1-digital-link
- W3C DID Core: https://www.w3.org/TR/did-core/
- W3C Verifiable Credentials 2.0 family: https://www.w3.org/news/2025/the-verifiable-credentials-2-0-family-of-specifications-is-now-a-w3c-recommendation/
- WCAG 2.2: https://www.w3.org/news/2023/web-content-accessibility-guidelines-wcag-2-2-is-a-w3c-recommendation/

Prepared on: 2026-04-08

## Stitch handoff
Use `20_STITCH_UPLOAD_PROMPT.md` as the main project prompt, `21_DESIGN.md` as the design-system upload file, and `22_STITCH_COMPONENT_CONTEXT.md` as the layout reinterpretation brief for the hero and surrounding product surfaces.
