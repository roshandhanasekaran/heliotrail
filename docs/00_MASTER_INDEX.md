# PV DPP Product Development Master Index

This is the **single navigation file** for the PV Digital Product Passport product documentation set.

## Objective

Build a **production-grade Digital Product Passport platform for PV modules** that is:
- aligned with the **ESPR DPP model**
- informed by the **battery passport implementation pattern**
- practical for **manufacturers, importers, installers, asset owners, service providers, refurbishers, recyclers, and regulators**
- extensible from **compliance-focused static data** to **dynamic lifecycle intelligence**

## Current strategic conclusion

### 1) There is not yet a battery-passport-equivalent PV schema
PV does **not yet** have the same level of sector-specific, ready-to-implement, regulated schema maturity that batteries have today.

### 2) The safest product strategy is a tiered schema
Your PV passport product should clearly separate:
- **Regulatory core**
- **Industry-ready supply chain and circularity layer**
- **Advanced operational / telemetry layer**

### 3) The best technical pattern is hybrid
Use:
- **structured cloud storage / database** for full records
- **hashes / immutable registry entries** for integrity
- **DID / VC** for certificates and issuer trust
- optional **blockchain anchoring** only where it adds multi-party trust

### 4) The frontend should be built like a product, not a document viewer
The UI must behave as a **real SaaS product**:
- clear app shell
- role-based navigation
- guided creation and approval workflows
- evidence-centric detail pages
- public and restricted views
- strong empty, loading, and error states
- accessible, reusable component system

## Recommended reading order

### Product, data, and architecture
1. `01_product_vision_and_scope.md`
2. `02_regulatory_landscape.md`
3. `03_product_requirements.md`
4. `04_pv_passport_data_schema.md`
5. `05_reference_architecture.md`
6. `06_benchmark_battery_vs_pv.md`
7. `07_waaree_gap_analysis.md`
8. `08_implementation_roadmap.md`

### Frontend execution
9. `11_frontend_product_blueprint.md`
10. `12_frontend_information_architecture.md`
11. `14_design_system_and_component_library.md`
12. `13_frontend_screen_specifications.md`
13. `15_frontend_user_flows_and_states.md`
14. `16_frontend_data_binding_and_api_contracts.md`
15. `18_wireframes_and_layout_patterns.md`
16. `19_cta_and_microcopy_catalog.md`
17. `17_frontend_delivery_backlog.md`

## Quick design decisions

### MVP should include
- Unique passport identity and QR/data-carrier model
- Manufacturer / importer / facility / product identity
- Product specifications and compliance documents
- Material composition and substances-of-concern layer
- EoL / dismantling / recycler-facing data
- Controlled access model
- Evidence/document hash model
- Public passport landing page
- Manufacturer workspace
- Passport creation wizard
- Evidence vault UI
- Approval inbox
- Recycler-facing restricted view

### Phase 2 should include
- supplier-tier traceability
- due diligence reports
- chain-of-custody events
- refurbishment / reuse workflows
- certificate verification using VC/DID
- dynamic data summaries
- portfolio and operations dashboard

### Phase 3 should include
- telemetry pointers
- degradation/performance analytics
- digital twin or asset performance layer
- cross-border interoperability APIs
- workflow automation and notifications
- advanced portfolio intelligence

## File map

### Core
- [README](README.md)
- [Product vision and scope](01_product_vision_and_scope.md)
- [Regulatory landscape](02_regulatory_landscape.md)
- [Product requirements](03_product_requirements.md)
- [PV passport data schema](04_pv_passport_data_schema.md)
- [Reference architecture](05_reference_architecture.md)
- [Benchmark: Battery vs PV](06_benchmark_battery_vs_pv.md)
- [Waaree gap analysis](07_waaree_gap_analysis.md)
- [Implementation roadmap](08_implementation_roadmap.md)
- [Research sources](09_research_sources.md)
- [BOM and dynamic-data note](10_bom_and_dynamic_data_design.md)

### Frontend
- [Frontend product blueprint](11_frontend_product_blueprint.md)
- [Frontend IA and navigation](12_frontend_information_architecture.md)
- [Frontend screen specifications](13_frontend_screen_specifications.md)
- [Design system and component library](14_design_system_and_component_library.md)
- [Frontend user flows and states](15_frontend_user_flows_and_states.md)
- [Frontend data binding and API contracts](16_frontend_data_binding_and_api_contracts.md)
- [Frontend delivery backlog](17_frontend_delivery_backlog.md)
- [Wireframes and layout patterns](18_wireframes_and_layout_patterns.md)
- [CTA and microcopy catalog](19_cta_and_microcopy_catalog.md)

### Combined
- [Combined dossier](PV_DPP_Combined_Dossier.md)
- [Frontend combined](PV_DPP_Frontend_Combined.md)

## Additional build note
If you only have time to start with three files for development, use:
1. `12_frontend_information_architecture.md`
2. `13_frontend_screen_specifications.md`
3. `14_design_system_and_component_library.md`

## Stitch handoff files
- `20_STITCH_UPLOAD_PROMPT.md`
- `21_DESIGN.md`
- `22_STITCH_COMPONENT_CONTEXT.md`
