# Stitch Upload Prompt — PV Digital Product Passport Product

## What to build
Design a production-grade B2B SaaS product for **PV Digital Product Passports (PV DPP)**. The product should feel like a modern enterprise platform used by manufacturers, suppliers, auditors, compliance managers, recyclers, and regulators.

This is **not** a marketing-only site. It is a complete product with:
- a public-facing landing page
- authenticated product workspace
- passport creation and editing flows
- BOM and material traceability views
- dynamic performance data views
- approvals, evidence, and audit workflows
- recycling and end-of-life workflows

The output should look implementation-ready for a React + shadcn + Tailwind + TypeScript codebase.

## Business objective
Help organizations create, manage, verify, and share PV Digital Product Passports across the full lifecycle of photovoltaic modules.

The product must clearly support:
- product identity and serial-level passport lookup
- BOM-lite, engineering BOM, and recycling BOM / material disclosure BOM
- compliance and certification management
- supplier and chain-of-custody traceability
- operational and dynamic lifecycle data
- role-based access for internal and external stakeholders
- circularity, repair, reuse, recycling, and end-of-life reporting

## Product personality
The UI should feel:
- **credible**
- **high-trust**
- **clean and premium**
- **technical but not cold**
- **sustainability-forward without looking generic or eco-cliche**
- **enterprise-grade and investor/demo ready**

Avoid looking like a crypto dashboard, generic admin template, or toy prototype.

## Design direction
Use the following visual direction:
- premium climate-tech / industrial-tech SaaS
- light theme by default, dark theme supported
- calm, structured, spacious layouts
- subtle contrast, elegant typography, strong readability
- data-rich but never crowded
- refined cards, sidebars, tables, charts, status chips, and workflow panels

## Theme and tokens to follow
Use these exact fonts and color families as the base design system.

### Fonts
- Sans: **Montserrat**
- Serif: **Merriweather**
- Mono: **Source Code Pro**

### Core light theme tokens
- Background: `#f8f5f0`
- Foreground: `#3e2723`
- Primary: `#2e7d32`
- Primary foreground: `#ffffff`
- Secondary: `#e8f5e9`
- Secondary foreground: `#1b5e20`
- Accent: `#c8e6c9`
- Accent foreground: `#1b5e20`
- Muted: `#f0e9e0`
- Muted foreground: `#6d4c41`
- Border: `#e0d6c9`
- Input: `#e0d6c9`
- Ring: `#2e7d32`
- Card: `#f8f5f0`
- Card foreground: `#3e2723`
- Sidebar: `#f0e9e0`
- Sidebar primary: `#2e7d32`
- Sidebar foreground: `#3e2723`
- Destructive: `#c62828`
- Radius: `0.5rem`

### Core dark theme tokens
- Background: `#1c2a1f`
- Foreground: `#f0ebe5`
- Primary: `#4caf50`
- Primary foreground: `#0a1f0c`
- Secondary: `#3e4a3d`
- Secondary foreground: `#d7e0d6`
- Accent: `#388e3c`
- Accent foreground: `#f0ebe5`
- Muted: `#2d3a2e`
- Muted foreground: `#d7cfc4`
- Border: `#3e4a3d`
- Input: `#3e4a3d`
- Ring: `#4caf50`
- Card: `#2d3a2e`
- Card foreground: `#f0ebe5`
- Sidebar: `#1c2a1f`
- Sidebar primary: `#4caf50`
- Sidebar foreground: `#f0ebe5`
- Destructive: `#c62828`
- Radius: `0.5rem`

### Chart palette
- `#4caf50`
- `#388e3c`
- `#2e7d32`
- `#1b5e20`
- `#0a1f0c`

## Important stylistic adaptation
I am providing a hero component reference called `tech-solutions-hero-section.tsx` with a strong editorial grid structure and animated background.

Do **not** copy it literally for branding content.
Instead, reinterpret its composition into a **PV DPP product hero** that includes:
- passport status and coverage chips
- headline focused on traceability, compliance, and circularity
- supporting subheadline
- one strong primary CTA and one secondary CTA
- compact metrics such as modules tracked, suppliers onboarded, recyclability coverage, and dynamic data coverage
- a center visual showing a passport card, module ID, QR/identifier, or system map
- optional animated environmental or signal background inspired by the provided raycast/unicorn backdrop

The hero should feel like a premium enterprise product introduction, not a portfolio showcase.

## Information architecture to generate
Create the app with the following top-level structure.

### Public / pre-login
1. Landing page
2. Product overview
3. Capabilities
4. Compliance and standards
5. Architecture and security
6. Case study / example passport
7. Pricing or contact/demo

### Authenticated product
1. Dashboard
2. Passports
3. BOM & materials
4. Traceability
5. Dynamic data
6. Evidence vault
7. Approvals & workflows
8. Circularity & recycling
9. Reports
10. Settings

## Core screens to design
Generate a coherent end-to-end product with these screens.

### 1. Landing page
Include:
- premium hero section
- trust bar with standards and enterprise signals
- capability blocks
- architecture section
- BOM / traceability / dynamic data / circularity cards
- user roles section
- case study section
- CTA footer

### 2. Product dashboard
Include:
- page header with account context
- left global sidebar
- KPI cards
- passport status overview
- compliance alerts
- workflow queue
- recent activity
- data completeness / readiness chart
- right-side context panel for selected item details

### 3. Passport list view
Include:
- search
- filter chips
- status tabs
- sortable data table
- row selection
- quick actions
- bulk actions
- passport readiness score

### 4. Passport detail view
Include:
- hero summary banner
- identity block
- tabs for Overview, BOM, Traceability, Dynamic Data, Evidence, Approvals, Circularity
- sticky action bar
- status timeline
- share/export buttons

### 5. Passport creation wizard
Include stepper flow with steps:
- identity
- manufacturing data
- BOM-lite
- full engineering BOM
- recycling/material disclosure BOM
- certifications
- traceability
- dynamic data setup
- evidence attachments
- review and publish

### 6. BOM and material workspace
Include:
- component hierarchy view
- material composition table
- supplier mapping
- risk / substance flags
- compare revisions
- recycler disclosure view

### 7. Traceability workspace
Include:
- supplier tier map
- chain-of-custody timeline
- certificates and attestations
- risk flags
- geographic provenance indicators

### 8. Dynamic data workspace
Include:
- latest module snapshot
- performance rollups
- telemetry source cards
- maintenance and anomaly timeline
- degradation trends
- note that raw high-frequency telemetry stays outside the passport and is linked via connectors or dataset references

### 9. Evidence vault
Include:
- file library
- document cards
- verification states
- expiry indicators
- document preview panel

### 10. Approvals and workflow center
Include:
- tasks inbox
- review queue
- comments
- approvals / rejections / requests for evidence
- audit log timeline

### 11. Circularity and recycling workspace
Include:
- recovery potential panel
- disassembly guidance
- recovery outputs
- reuse / repair / refurbish / recycle path cards
- recycler-facing disclosure panel

### 12. Reports and exports
Include:
- compliance exports
- management dashboards
- lifecycle reports
- download and share actions

## Required UI patterns
Use shadcn-style components and Tailwind-friendly layouts.

Create a coherent design system including:
- App shell
- Primary sidebar
- Secondary/context sidebar
- Page header
- Tabs
- Cards
- Tables
- Status chips
- Buttons
- Empty states
- Loaders
- Drawers
- Dialogs
- Charts
- Timelines
- Stepper/wizard
- Upload areas
- Evidence cards
- Passport summary cards
- KPI widgets

## Button system
Create a clear button hierarchy.

### Primary buttons
Use for:
- Create passport
- Publish passport
- Request review
- Approve
- Book demo
- Start now

### Secondary buttons
Use for:
- Save draft
- Export
- Compare
- Add evidence
- Open details

### Tertiary / ghost buttons
Use for:
- View history
- Copy ID
- Filter
- Open panel
- Show more

### Destructive buttons
Use for:
- Archive
- Delete
- Reject
- Remove data source

## Micro-interactions and states
Design all major states:
- empty
- loading
- syncing
- success
- warning
- failed validation
- incomplete passport
- rejected evidence
- expired certificate
- missing dynamic data source

Use subtle motion only. Keep it premium and restrained.

## Responsive behavior
Generate responsive layouts for:
- desktop first
- laptop
- tablet
- mobile

On mobile:
- collapse the global sidebar
- transform dense tables into cards or stacked records
- keep sticky primary actions available
- preserve readability and scanning ability

## Accessibility
Ensure the design communicates:
- strong heading hierarchy
- sufficient contrast
- keyboard-friendly layouts
- clear focus states
- icon + label pairing where needed
- status not conveyed by color alone

## What to optimize for
Optimize for:
- fast scanning of complex data
- high trust for enterprise stakeholders
- logical progression from passport summary to evidence to action
- demo quality for customers and investors
- implementation clarity for React developers

## What to avoid
Avoid:
- generic green-energy illustrations everywhere
- overcrowded dashboards
- crypto-style neon visuals
- weak hierarchy
- marketing fluff without operational depth
- consumer-app styling
- overly rounded playful UI

## Deliverable format requested from Stitch
Generate:
1. a polished landing page
2. an authenticated app shell
3. the most important core product screens
4. coherent reusable patterns across all screens
5. a design that can be handed off cleanly into a shadcn + Tailwind + TypeScript React app
