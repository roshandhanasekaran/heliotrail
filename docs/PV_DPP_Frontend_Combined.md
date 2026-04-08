# PV DPP Frontend Combined Blueprint

This file combines the frontend product-development docs into one reading flow.


---

# Source file: 11_frontend_product_blueprint.md

# Frontend Product Blueprint

## Purpose of this document
This file turns the PV DPP concept into a **buildable frontend product**. It defines:
- what surfaces exist
- who uses them
- how they connect
- what must be visible first
- what should stay hidden until needed
- how the product should feel operationally

This is not a graphic design brief. It is a **product-logic blueprint** for frontend implementation.

---

## 1. Product philosophy

The frontend should not look like:
- a PDF archive
- a compliance spreadsheet
- a blockchain demo
- a document dump

It should look like:
- a serious industrial SaaS product
- a traceability and compliance workspace
- a trusted product identity system
- an operational console that can be used daily

### Core UX principles
1. **Trust first**  
   Verification status, evidence links, timestamps, version, and scope must be obvious.

2. **Summary before detail**  
   Every major page should begin with a short summary/hero band, then allow drill-down.

3. **Role-aware depth**  
   Public users see basic truth. Internal or trusted users see deeper BOM, evidence, and lifecycle data.

4. **Progressive complexity**  
   Never show the full schema at once. Break it into logical sections.

5. **Operational clarity**  
   The user should always know:
   - where they are
   - what status the passport is in
   - what action is required next
   - who owns the next step

6. **Accessibility by design**  
   Keyboard navigation, focus states, meaningful headings, consistent actions, and mobile readability are non-negotiable.

---

## 2. Product surfaces

The full frontend product should have **three surfaces**.

### Surface A — Public experience
Audience:
- buyer
- installer
- end customer
- asset owner
- public regulator viewer
- market surveillance investigator at a basic level

Goal:
- identify the module
- verify authenticity
- see high-level compliance, warranty, and circularity data
- access public evidence and instructions

Pages:
- marketing / landing page
- QR resolver page
- public passport page
- public evidence summary
- public circularity summary

### Surface B — Authenticated operational workspace
Audience:
- manufacturer compliance user
- document manager
- supply-chain user
- quality user
- approver
- admin

Goal:
- create, edit, review, approve, and publish passport records
- manage documents and evidence
- maintain traceability and material data
- handle updates over the lifecycle

Pages:
- dashboard
- passport list
- create/edit wizard
- passport workspace
- evidence vault
- approvals inbox
- settings and integrations

### Surface C — Restricted stakeholder views
Audience:
- recycler
- auditor
- authority
- operator / asset owner
- service partner

Goal:
- reveal the right depth of information for each trusted role without exposing everything

Pages:
- recycler material and disassembly view
- auditor evidence and approval history
- authority compliance trace
- operator performance and maintenance view

---

## 3. Frontend architecture recommendation

### Recommended product shape
Use a **two-shell model**:

1. **Public shell**
   - lightweight
   - fast
   - mobile friendly
   - minimal navigation
   - brand-forward
   - optimized for QR-entry

2. **Authenticated app shell**
   - left sidebar
   - top utility bar
   - persistent status rail / header summary
   - deeper table/forms/workflow patterns
   - desktop-first, tablet-usable

### Recommended technology approach
Framework-agnostic logic, but easiest implementation is:
- React + TypeScript
- Tailwind or tokenized CSS system
- reusable headless UI primitives
- schema-driven forms
- table abstraction
- route-based code splitting
- strong query/cache layer

If the product must be enterprise portal-first:
- server rendering for public pages is helpful
- client-side data fetching for app workflows is ideal

---

## 4. Primary personas and jobs-to-be-done

## 4.1 Public buyer / installer
Needs:
- prove the product is genuine
- see core specs quickly
- see certificates/warranty/instructions
- know what is public vs restricted

Success metric:
- can trust the module in under 60 seconds

## 4.2 Compliance manager
Needs:
- create and update passports fast
- upload evidence once
- reuse model/batch data
- pass audits

Success metric:
- publish a passport without emailing spreadsheets around

## 4.3 Approver / auditor
Needs:
- inspect changes
- compare versions
- verify evidence
- approve or reject cleanly

Success metric:
- decision made from one screen with evidence traceability

## 4.4 Recycler
Needs:
- access material composition
- understand hazards
- follow disassembly order
- see recovery hints

Success metric:
- safe, efficient treatment without digging through documents

## 4.5 Operator / asset owner
Needs:
- see current status
- see maintenance and lifecycle events
- view summarized performance
- identify degraded or replaced modules

Success metric:
- passport remains useful after installation

---

## 5. Global app behaviors

### Global behavior 1 — Every page needs a clear state header
At the top of the page show:
- page title
- object title (passport/model/module)
- status
- last updated
- verification indicator
- primary actions

### Global behavior 2 — Data depth should be layered
Show:
- hero summary
- section cards
- detail tables
- evidence drawer/modal
- raw JSON/export only when truly needed

### Global behavior 3 — Action placement should be predictable
Primary actions:
- top right in page header
- sticky footer in forms/wizards
- row action menus for tables

Destructive or sensitive actions:
- never next to primary save/publish without separation

### Global behavior 4 — Trust metadata is always visible
Important areas should show:
- source
- owner
- last approved by
- confidence / certainty
- restricted/public classification

---

## 6. High-level route map

### Public routes
- `/`
- `/scan`
- `/passport/:publicId`
- `/passport/:publicId/specs`
- `/passport/:publicId/compliance`
- `/passport/:publicId/circularity`
- `/passport/:publicId/documents`
- `/passport/:publicId/request-access`

### Authenticated app routes
- `/app`
- `/app/passports`
- `/app/passports/new`
- `/app/passports/:id/overview`
- `/app/passports/:id/specs`
- `/app/passports/:id/composition`
- `/app/passports/:id/traceability`
- `/app/passports/:id/compliance`
- `/app/passports/:id/evidence`
- `/app/passports/:id/lifecycle`
- `/app/passports/:id/dynamic-data`
- `/app/passports/:id/history`
- `/app/approvals`
- `/app/evidence`
- `/app/integrations`
- `/app/settings`

### Restricted-view routes
- `/partner/recycler/:id`
- `/partner/auditor/:id`
- `/partner/authority/:id`
- `/partner/operator/:id`

---

## 7. Screen hierarchy logic

### Level 1 — Portfolio and navigation
Examples:
- dashboard
- passport list
- approval inbox

### Level 2 — Passport workspace
Examples:
- overview
- specs
- materials
- evidence
- lifecycle

### Level 3 — Object detail views
Examples:
- specific evidence document
- chain-of-custody event
- maintenance event
- certificate verification view

### Level 4 — Supporting flows
Examples:
- create passport wizard
- request access flow
- upload document flow
- approve/reject flow

---

## 8. Hero, sidebar, and action philosophy

## 8.1 Hero sections
Use hero sections in exactly these places:
- marketing landing page
- public passport overview
- authenticated dashboard
- passport overview/workspace header

A hero section must contain:
- concise title
- object identity
- summary KPIs
- status and verification
- one primary CTA
- one secondary CTA

## 8.2 Sidebar design
Use **two sidebar types**:

### Global app sidebar
Used in authenticated product shell.
Contains:
- dashboard
- passports
- evidence
- approvals
- integrations
- settings

### Context sidebar
Used inside a passport workspace.
Contains:
- overview
- specs
- composition
- traceability
- compliance
- evidence
- lifecycle
- dynamic data
- history

This context sidebar should be sticky on desktop.

## 8.3 Buttons and action system
Buttons must follow a strict hierarchy:
- primary
- secondary
- tertiary / ghost
- destructive
- success / approve
- link
- icon-only

Do not invent ad-hoc button styles per page.

---

## 9. Required page groups for MVP

### Group A — Public trust experience
Must exist in MVP:
- public passport page
- public documents summary
- circularity summary
- request-access page

### Group B — Manufacturer operations
Must exist in MVP:
- dashboard
- passport list
- create/edit wizard
- passport detail workspace
- evidence vault

### Group C — Approval and auditability
Must exist in MVP:
- approvals inbox
- version history
- change comparison
- document verification state

### Group D — Recycler relevance
Must exist in MVP:
- material composition page
- disassembly guidance page
- hazardous material notes
- recovery route hints

---

## 10. Responsive strategy

### Mobile priority
Public passport pages must be mobile-first because many scans start on a phone.

### Desktop priority
Authenticated workflows must be optimized for desktop because:
- complex data entry
- table-heavy interfaces
- evidence review
- approvals
- multi-pane workflows

### Tablet support
Important for field auditors, sales, service, and plant users.

---

## 11. Accessibility baseline
Adopt the following as build constraints:
- semantic headings
- keyboard-focus order
- visible focus ring
- sufficient target sizes
- no color-only status communication
- descriptive button labels
- structured tables with proper headers
- screen-reader labels for icon-only controls

Reference baseline:
- WCAG 2.2
- consistent landmarks and heading structure
- reduced-motion support for non-essential animation

---

## 12. Success criteria for the frontend
The frontend is successful when:
- a public user can verify a product quickly
- a manufacturer can publish and update without confusion
- a reviewer can approve or reject with traceability
- a recycler can find actionable material data
- the same design system supports all major screens
- the product feels coherent rather than stitched together

---

## 13. What not to do
Avoid:
- dumping raw schema into one screen
- mixing public and restricted information in the same card without labels
- relying on PDF downloads as the main experience
- using tabs for every kind of navigation
- building completely different patterns for every role
- hiding status or timestamps in tiny metadata text


---

# Source file: 12_frontend_information_architecture.md

# Frontend Information Architecture and Navigation

## Goal
Define the **sitemap, app shell, route hierarchy, navigation logic, and page grouping** so the product remains coherent as it scales.

---

## 1. Information architecture model

The frontend should be organized around **three navigation layers**:

1. **Product layer**
   - where the user is in the overall application

2. **Object layer**
   - which passport or object the user is working on

3. **Action layer**
   - what the user can do right now

---

## 2. Top-level sitemap

```text
Public
├── Home
├── Scan / Resolve
├── Passport Public View
│   ├── Overview
│   ├── Specifications
│   ├── Compliance
│   ├── Circularity
│   └── Documents
└── Request Restricted Access

Authenticated App
├── Dashboard
├── Passports
│   ├── List
│   ├── Create New
│   ├── Overview
│   ├── Specifications
│   ├── Composition / BOM
│   ├── Traceability
│   ├── Compliance
│   ├── Evidence
│   ├── Lifecycle
│   ├── Dynamic Data
│   └── History
├── Evidence Vault
├── Approvals
├── Integrations
└── Settings

Restricted Views
├── Recycler Workspace
├── Auditor Workspace
├── Authority Workspace
└── Operator Workspace
```

---

## 3. Navigation model

## 3.1 Public navigation
Keep it minimal:
- logo
- scan
- product/passport access
- documentation/help
- sign in

Public users should not see app-level complexity.

## 3.2 Authenticated navigation
Use a left sidebar with:
- Dashboard
- Passports
- Evidence
- Approvals
- Integrations
- Settings

Top utility bar:
- tenant switcher if needed
- search
- notifications
- help
- user menu

## 3.3 Passport workspace navigation
Within a specific passport, use a context sidebar or secondary nav:
- Overview
- Specifications
- Composition
- Traceability
- Compliance
- Evidence
- Lifecycle
- Dynamic Data
- History

On smaller screens, collapse to a section menu / tab dropdown.

---

## 4. Route structure

## 4.1 Public route design

### `/`
Purpose:
- explain product
- invite scan/search/demo
- establish trust

### `/scan`
Purpose:
- QR landing and resolution helper
- fallback when scan data is malformed or expired

### `/passport/:publicId`
Purpose:
- public overview

### `/passport/:publicId/:section`
Sections:
- specs
- compliance
- circularity
- documents

### `/passport/:publicId/request-access`
Purpose:
- request recycler/auditor/authority access

---

## 4.2 Authenticated route design

### `/app`
Purpose:
- dashboard / work queue entry point

### `/app/passports`
Purpose:
- searchable portfolio view

### `/app/passports/new`
Purpose:
- wizard for creation

### `/app/passports/:id/overview`
Purpose:
- high-level working summary for one passport

### `/app/passports/:id/specs`
Purpose:
- technical and manufacturing attributes

### `/app/passports/:id/composition`
Purpose:
- BOM-lite
- engineering BOM if permitted
- recycling BOM

### `/app/passports/:id/traceability`
Purpose:
- supplier tiers
- chain-of-custody
- due diligence

### `/app/passports/:id/compliance`
Purpose:
- declarations, standards, status, open gaps

### `/app/passports/:id/evidence`
Purpose:
- documents, hashes, VC links, upload and verification

### `/app/passports/:id/lifecycle`
Purpose:
- maintenance, ownership, refurbishment, recycling, decommissioning

### `/app/passports/:id/dynamic-data`
Purpose:
- dynamic snapshot
- performance summary
- telemetry references

### `/app/passports/:id/history`
Purpose:
- versions
- approvals
- compare changes

### `/app/approvals`
Purpose:
- review and decision inbox

### `/app/evidence`
Purpose:
- tenant-wide evidence library

### `/app/integrations`
Purpose:
- ERP, PLM, MES, LCA, telemetry, trust systems

### `/app/settings`
Purpose:
- tenant, roles, permissions, branding, policy

---

## 5. Recommended page-grouping rules

### Group pages by user intent, not database entity names
Good:
- Compliance
- Evidence
- Lifecycle

Bad:
- “Object Metadata 1”
- “Registry Payload”
- “Hash Table”

### Keep no more than 8–10 items in a persistent passport section nav
If more sections are needed:
- move lower-value sections into drawers
- use subsections within a page
- merge related areas

---

## 6. App shell design

## 6.1 Public shell
Structure:
- top nav
- hero / page title
- main content
- footer

No sidebar.

## 6.2 Authenticated shell
Structure:
- left global sidebar
- top utility bar
- content region
- optional right detail panel
- sticky footer actions only during guided flows

## 6.3 Passport workspace shell
Structure:
- page header / hero summary
- context sidebar on left
- section content in center
- right-side evidence/activity panel optional

---

## 7. Sidebar rules

### Global sidebar must contain
- icon
- label
- active state
- compact/collapsed mode
- optional badge for counts

### Context sidebar must contain
- section label
- completion state
- warning state if data missing
- active location
- ability to jump to sections

### Do not place destructive actions in sidebars
Examples to avoid in sidebar:
- delete passport
- revoke access
- irreversible publish overwrite

Keep those in controlled action menus or modals.

---

## 8. Breadcrumb strategy

Use breadcrumbs on:
- passport workspace
- evidence detail
- approval review pages

Example:
`Passports / WRM-600-2026-LOT-01 / Evidence / IEC 61730 Certificate`

Do not use breadcrumbs on small public mobile pages unless necessary.

---

## 9. Search and filtering logic

## 9.1 Global search
Available in authenticated shell.
Should search:
- passport IDs
- serial numbers
- model names
- batch IDs
- document names
- suppliers

## 9.2 Table-level filters
Use on list pages:
- status
- manufacturer site
- date updated
- technology
- approval state
- evidence completeness
- circularity readiness

## 9.3 Inline section filters
Use only when data is large:
- documents
- chain-of-custody events
- maintenance events
- telemetry summaries

---

## 10. Permission-aware IA

The same route structure can be reused with role-aware visibility.

### Public can see
- overview
- selected specs
- certificate summary
- warranty summary
- public circularity guidance

### Recycler can additionally see
- recycling BOM
- hazardous notes
- disassembly order
- recovery route hints

### Auditor/authority can additionally see
- evidence details
- approval history
- restricted compliance documents
- traceability records

### Manufacturer/internal can see
- draft fields
- edit controls
- workflow and task state
- engineering BOM
- integration health

---

## 11. Notification and task architecture

Use a notification center for:
- approval requests
- evidence verification failures
- missing mandatory fields
- integration sync problems
- published/rejected changes

Use task cards on dashboard for:
- passports missing evidence
- expiring certificates
- pending approvals
- dynamic data disconnects
- unresolved compliance flags

---

## 12. Error-routing logic

### Resolver errors
If QR is invalid:
- show friendly error
- offer manual ID search
- show support link

### Permission errors
If access denied:
- explain why
- show who can grant access
- allow request-access flow

### Object missing
If passport archived or not found:
- show status-aware explanation
- offer related search

### Integration errors
In authenticated app:
- show inline error banner
- allow retry
- show last successful sync timestamp

---

## 13. Localization and region handling
Prepare IA to support:
- multiple languages
- multiple regulatory profiles
- customer branding / white-labeling
- unit display consistency
- market-specific evidence bundles

Do not hard-code labels that may vary by geography.

---

## 14. IA checklist
Before development starts, confirm:
- route naming
- public/app split
- sidebar labels
- passport section list
- permission model
- document viewer entry points
- access request flow
- notification strategy


---

# Source file: 13_frontend_screen_specifications.md

# Frontend Screen Specifications

## How to use this file
Each screen spec defines:
- purpose
- key user
- layout
- sections
- primary buttons
- states
- notes for engineering

---

# 1. Marketing / Landing Page

## Purpose
Introduce the product and route users to:
- scan
- search
- log in
- request demo/access

## Key user
Public visitor, buyer, partner, regulator, sales lead.

## Layout
- top nav
- hero section
- problem/solution blocks
- trust/standards section
- feature sections
- footer

## Hero content
Must include:
- product title
- short value statement
- scan / view example CTA
- secondary CTA for sign in or contact

## Primary buttons
- `Scan a Passport`
- `Explore Example Passport`
- `Sign in`

## States
- default
- logged-in shortcut state

---

# 2. QR Resolver Page

## Purpose
Resolve scanned codes safely and explain what will happen next.

## Layout
- compact header
- resolver card
- status/result area
- fallback search field
- help block

## Components
- code input
- loading indicator
- result card
- error banner
- retry action

## Primary buttons
- `Open Passport`
- `Search by ID`
- `Retry`

## States
- loading resolution
- valid resolution
- malformed code
- expired link
- archived passport
- access-restricted resolution

---

# 3. Public Passport Overview Page

## Purpose
Provide a trusted public view of the module/passport.

## Layout
- top page hero
- optional sticky section nav
- summary cards
- section stack

## Hero section content
- product/model title
- serial/batch/model identity
- verification badge
- status badge
- last updated
- manufacturer name
- primary CTA: `View Documents`
- secondary CTA: `Request Restricted Access`

## Summary cards
- product identity
- performance summary
- warranty summary
- compliance summary
- circularity summary

## Sections
1. Overview
2. Key specifications
3. Compliance and certificates
4. Circularity and end-of-life
5. Public documents
6. Change/version summary

## Primary buttons
- `Download Public Summary`
- `View Documents`
- `Request Restricted Access`

## Empty/error states
- missing public documents
- no circularity info yet
- not publicly available

---

# 4. Public Passport Section Detail Pages

## 4.1 Specifications
Components:
- spec cards
- structured tables
- comparison/summary chips

Buttons:
- `Back to Overview`
- `Download Spec Sheet`

## 4.2 Compliance
Components:
- certificate cards
- evidence availability
- compliance status rail

Buttons:
- `View Certificate`
- `Download Declaration`

## 4.3 Circularity
Components:
- recyclability summary
- material groups
- end-of-life guidance
- recovery hints

Buttons:
- `View Recovery Guidance`
- `Request Recycler Access`

## 4.4 Documents
Components:
- document list
- search
- tags
- download/open actions

Buttons:
- `Open`
- `Download`
- `Copy Share Link`

---

# 5. Authenticated Dashboard

## Purpose
Give internal users a work-oriented entry point.

## Layout
- hero summary band
- KPI cards
- task/approval columns
- recent activity
- system health widgets

## Hero band content
- tenant name
- number of active passports
- pending approvals
- expiring certificates
- sync health
- primary CTA: `Create Passport`

## KPI cards
- total passports
- drafts
- published
- pending approval
- evidence completeness
- expiring documents

## Work queue panels
- passports needing action
- approvals awaiting decision
- evidence upload failures
- data completeness alerts

## Primary buttons
- `Create Passport`
- `Open Approvals`
- `Open Evidence Vault`

## States
- normal
- no data yet / onboarding
- degraded integration state

---

# 6. Passport List Page

## Purpose
Portfolio-level management of passports.

## Layout
- page header
- filter row
- bulk actions row
- data table
- pagination or infinite scroll

## Table columns
- passport ID
- model
- serial/batch
- status
- verification state
- completeness
- last updated
- owner
- actions

## Row actions
- view
- edit
- compare version
- duplicate
- archive
- export

## Primary buttons
- `Create Passport`
- `Import CSV/JSON`
- `Export List`

## States
- empty portfolio
- no results for filters
- loading skeleton
- partial sync warning

---

# 7. Create Passport Wizard

## Purpose
Guide the user through passport creation without exposing the entire schema at once.

## Wizard steps
1. Identity
2. Technical specifications
3. BOM and composition
4. Traceability
5. Compliance and certificates
6. Circularity / EoL
7. Dynamic data setup
8. Review and publish

## Layout
- page title
- left stepper or top stepper
- main form panel
- right helper panel with tips/requirements
- sticky footer actions

## Sticky footer buttons
- `Save Draft`
- `Back`
- `Next`
- `Submit for Approval`
- `Publish` (only when allowed)

## Step-specific rules
### Identity
Fields:
- model
- serial/batch
- facility
- identifiers
- data carrier configuration

### Technical specifications
Use grouped cards and validation.

### BOM and composition
Use tabs:
- BOM-lite
- Engineering BOM (if role allowed)
- Recycling BOM

### Traceability
Use actor cards and event timeline.

### Compliance
Use upload zones and structured metadata.

### Review and publish
Show missing fields, warnings, completeness percentage, and access classification.

## States
- unsaved draft
- validation errors
- auto-saved
- submit success
- publish blocked

---

# 8. Passport Workspace Overview

## Purpose
Main internal page for one passport.

## Layout
- hero summary header
- left context sidebar
- overview cards
- recent activity / right panel
- section summaries

## Hero summary content
- passport title
- status
- approval state
- completeness
- verification state
- last edited by
- primary CTA: `Edit Passport`
- secondary CTA: `Submit for Approval`
- tertiary actions in overflow menu

## Overview cards
- identity
- specs
- compliance
- evidence
- composition
- traceability
- lifecycle
- dynamic data

Each card should show:
- summary
- completeness
- last updated
- warning count

## Primary buttons
- `Edit Passport`
- `Submit for Approval`
- `Preview Public View`

---

# 9. Specifications Screen

## Purpose
Show technical, manufacturing, and warranty information in structured form.

## Layout
- section header
- summary metrics row
- grouped accordions/cards

## Groups
- electrical specs
- mechanical specs
- manufacturing details
- warranty and reliability

## Components
- definition lists
- tables
- metric cards
- edit drawer or inline edit pattern

## Buttons
- `Edit Specifications`
- `Export Specs`
- `View Source Evidence`

---

# 10. Composition Screen

## Purpose
Represent materials in the most useful way for the user’s role.

## Layout
- section header
- disclosure-level switcher
- summary cards
- detail tables
- warnings panel

## Subsections
### BOM-lite
- high-level material composition
- critical materials
- substances-of-concern summary

### Engineering BOM
- controlled access
- part-level structure
- supplier/site linkage
- quality references

### Recycling BOM
- disassembly order
- hazardous flags
- recovery-route hints

## Primary buttons
- `Edit Composition`
- `Import BOM`
- `Open Recycler View`

## States
- no BOM yet
- partial supplier disclosure
- recycler-ready
- restricted-content hidden

---

# 11. Traceability Screen

## Purpose
Show where the module came from and what evidence exists for that lineage.

## Layout
- actor summary cards
- chain-of-custody timeline
- supplier tier tables
- due diligence panel

## Components
- actor cards
- facility cards
- event timeline
- evidence chips
- country/origin tags

## Buttons
- `Add Traceability Event`
- `Link Evidence`
- `Export Traceability`

---

# 12. Compliance Screen

## Purpose
Operational compliance workspace.

## Layout
- compliance summary hero
- standards/certificates grid
- gaps/issues panel
- declarations panel
- access-controlled regulatory details

## Components
- status rail
- certificate cards
- issue list
- required-vs-available matrix
- verification badge

## Buttons
- `Upload Certificate`
- `Open Declaration`
- `Resolve Gap`
- `Submit for Review`

## States
- compliant
- partially compliant
- evidence missing
- expired certificate
- awaiting approval

---

# 13. Evidence Vault Screen

## Purpose
Centralized document and evidence management.

## Layout
- page header
- search/filter bar
- document table
- preview pane or drawer
- metadata panel

## Document card/table fields
- document name
- type
- linked passport(s)
- issuer
- uploaded by
- hash / signature state
- last updated
- access level

## Buttons
- `Upload Evidence`
- `Verify Hash`
- `Link to Passport`
- `Replace Version`

## States
- empty vault
- upload in progress
- failed verification
- unsupported format

---

# 14. Lifecycle Screen

## Purpose
Show changes after the product is produced.

## Sections
- ownership / custody changes
- maintenance events
- refurbishment / repair
- reuse state
- decommissioning / recycling

## Components
- event timeline
- status change cards
- notes drawer
- evidence-linked event records

## Buttons
- `Add Lifecycle Event`
- `Mark Refurbished`
- `Mark Decommissioned`

---

# 15. Dynamic Data Screen

## Purpose
Present dynamic data without turning the passport UI into a raw SCADA interface.

## Layout
- snapshot KPI cards
- health/performance summary
- trend charts
- telemetry pointer panel
- data-quality panel

## Snapshot cards
- active power output
- cumulative generation
- irradiance
- ambient temperature
- module temperature
- data freshness

## Recommended approach
Store and display:
- latest values
- recent summaries
- degradation indicators
- anomalies
- data-quality status
- telemetry source references

Do not use the passport UI to show dense raw time-series tables by default.

## Buttons
- `Refresh Snapshot`
- `Open Data Source`
- `Acknowledge Anomaly`

## States
- no telemetry connected
- stale telemetry
- partial data
- anomaly detected
- degraded confidence

---

# 16. History and Version Comparison Screen

## Purpose
Make changes auditable and easy to compare.

## Layout
- version table
- compare selector
- diff viewer
- approval record panel

## Components
- version list
- field-level diff
- document diff summary
- approver comments
- publish/reject indicators

## Buttons
- `Compare Versions`
- `Restore Draft`
- `Download Audit Record`

---

# 17. Approvals Inbox

## Purpose
Central place for reviewers to approve or reject work.

## Layout
- queue filters
- approval cards/table
- detail pane
- decision footer

## Review pane should show
- what changed
- which fields changed
- which evidence supports the change
- risk/completeness/warnings
- previous approved value

## Buttons
- `Approve`
- `Reject`
- `Request Changes`
- `Open Full Passport`

---

# 18. Recycler View

## Purpose
Provide a specialized operational view for end-of-life handling.

## Layout
- recycler hero summary
- hazard warning banner
- material recovery table
- disassembly sequence
- treatment guidance
- recycler notes

## Buttons
- `Download Recycler Summary`
- `Open Disassembly Guidance`
- `Record Recovery Outcome`

---

# 19. Settings and Integrations

## Purpose
Manage tenant-wide product behavior.

## Sections
- branding
- user roles
- access policies
- identifier settings
- QR behavior
- API keys/integrations
- workflow policy
- localization

## Buttons
- `Save Settings`
- `Test Connection`
- `Invite User`
- `Rotate Key`

---

## Engineering note
For every screen above, implement:
- loading skeleton
- empty state
- permission state
- error state
- success/confirmation feedback


---

# Source file: 14_design_system_and_component_library.md

# Design System and Component Library

## Goal
Define a **reusable, logical component system** so the frontend can be built once and extended cleanly.

---

## 1. Design system principles
- consistent hierarchy
- strong trust cues
- dense but readable enterprise data layout
- no one-off components unless absolutely necessary
- mobile usability for public pages
- desktop efficiency for app workflows
- accessibility first

---

## 2. Foundations

## 2.1 Layout
Use a consistent grid:
- page max width for public pages
- fluid application layout for authenticated pages
- sticky sidebars where useful
- card-based content groups

## 2.2 Spacing
Adopt fixed spacing tokens.
Do not hand-tune spacing page by page.

## 2.3 Typography
Need at least:
- display / hero heading
- page heading
- section heading
- card title
- body
- small meta text
- mono for IDs/hashes if needed

## 2.4 Color semantics
Use color for meaning, not decoration:
- neutral
- info
- success
- warning
- error
- verified / trusted
- restricted / locked

Status must never rely on color alone.

---

## 3. App-shell components

## 3.1 Global sidebar
Props:
- items
- icon
- label
- badge count
- active state
- collapsed mode

States:
- expanded
- collapsed
- hover
- active
- disabled

## 3.2 Top utility bar
Contents:
- search
- tenant switcher
- notifications
- help
- user menu

## 3.3 Page header
Must support:
- title
- subtitle
- breadcrumbs
- status chips
- last updated
- action group

---

## 4. Hero components

## 4.1 Marketing hero
Use on home page.
Contains:
- headline
- supporting text
- primary CTA
- secondary CTA
- trust markers

## 4.2 Passport hero
Use on public and internal passport overview.
Contains:
- object title
- identifiers
- verification state
- status
- key metrics
- primary action
- secondary action

## 4.3 Dashboard hero
Contains:
- workspace title
- KPI summaries
- main CTA
- alert strip if needed

---

## 5. Button system

## 5.1 Primary button
Use for the main action on a screen.
Examples:
- Create Passport
- Save Draft
- Submit for Approval
- Publish

## 5.2 Secondary button
Use for meaningful but non-dominant actions.
Examples:
- Preview Public View
- Export
- View Documents

## 5.3 Tertiary / ghost button
Use for supporting actions with low visual weight.
Examples:
- Cancel
- Back
- Clear filter

## 5.4 Destructive button
Use for:
- archive
- revoke
- delete
- reject with destructive intent

Must be visually distinct and require confirmation where needed.

## 5.5 Success / approval button
Use for:
- Approve
- Confirm publishing

## 5.6 Link button
Use within cards or content sections when navigation is lightweight.

## 5.7 Icon-only button
Use only with:
- tooltip
- aria-label
- obvious affordance

## 5.8 Button sizes
At minimum:
- small
- medium
- large

## 5.9 Button states
Every button needs:
- default
- hover
- active
- focus
- disabled
- loading

---

## 6. Form components

### Inputs
- text
- textarea
- select
- multi-select
- combobox
- date picker
- number input
- unit-aware input
- switch
- checkbox
- radio
- tag input
- file upload

### DPP-specific form patterns
- identifier input with validation
- evidence upload with metadata
- country/origin selector
- BOM row editor
- standards/certificate selector
- lifecycle event form
- dynamic snapshot settings

### Form helpers
- inline validation
- helper text
- required marker
- auto-save feedback
- field ownership/source tag

---

## 7. Data display components

### Cards
Types:
- summary card
- metric card
- section card
- evidence card
- warning card
- task card

### Tables
Use for:
- passport lists
- evidence lists
- BOM rows
- traceability actors
- version history

Features:
- sticky header when helpful
- sortable columns
- filter hooks
- row actions
- compact and comfortable density modes

### Definition list blocks
Use for:
- product identity
- core technical data
- warranty terms
- facility metadata

### Accordions
Use to collapse detailed sections inside large pages.

### Tabs
Use only for closely related sibling views, not as a substitute for all navigation.

---

## 8. Trust and compliance components

### Verification badge
Values:
- verified
- pending verification
- unverifiable
- outdated

### Access-scope badge
Values:
- public
- restricted
- recycler
- authority
- internal

### Evidence chip
Displays:
- document type
- verification state
- issuer
- date

### Hash / integrity badge
Displays:
- hash present
- signed
- mismatch detected
- unavailable

### Certificate card
Displays:
- standard/certificate name
- issuer
- validity dates
- status
- quick actions

---

## 9. Workflow components

### Stepper
Use for create/edit wizard and onboarding.

### Timeline
Use for:
- lifecycle events
- chain-of-custody
- version history
- approvals

### Diff viewer
Use for comparing versions and approvals.

### Task panel
Use on dashboard and approvals.

### Completion tracker
Shows per-section completion:
- complete
- incomplete
- blocked
- pending review

---

## 10. Evidence and document components

### Document table
Columns:
- name
- type
- linked object
- hash/signature
- issuer
- updated date
- actions

### Document preview drawer
Support:
- metadata panel
- file preview
- verify action
- download action
- related links

### Upload dropzone
Support:
- drag/drop
- progress
- retry
- file type validation
- metadata capture

---

## 11. DPP-specific components

### Passport status rail
Fields:
- draft
- under review
- approved
- published
- superseded
- archived
- decommissioned

### BOM summary strip
Fields:
- material coverage %
- SoC count
- critical material count
- recycler readiness

### Recycler readiness card
Fields:
- hazardous flags
- disassembly quality
- recovery-route completeness

### Dynamic data snapshot panel
Fields:
- current active power
- cumulative generation
- irradiance
- ambient temperature
- module temperature
- freshness

### Completeness gauge
Use on dashboard, list pages, and passport overview.

---

## 12. Overlay components

### Modal
Use for:
- confirm destructive action
- publish confirmation
- reject request

### Drawer
Use for:
- quick edit
- evidence preview
- side details

### Toast
Use for short action feedback only.

### Banner
Use for page-level warnings or system issues.

---

## 13. Empty, loading, and error states

Every reusable component must have a state story.

### Empty states
Need:
- title
- explanation
- next step
- optional CTA

### Loading states
Prefer skeletons over generic spinners on data pages.

### Error states
Need:
- what failed
- what the user can do
- retry where safe
- support or escalation path if not recoverable

---

## 14. Accessibility requirements
The design system must support WCAG 2.2-aligned implementation:
- visible focus
- meaningful labels
- keyboard navigation
- touch target size
- drag/drop alternatives
- table semantics
- no color-only meaning
- reduced-motion support

---

## 15. Component inventory table

| Component | Required for MVP | Surface |
|---|---|---|
| Global sidebar | Yes | Authenticated app |
| Context sidebar | Yes | Passport workspace |
| Passport hero | Yes | Public + authenticated |
| Primary button | Yes | All |
| Table | Yes | Authenticated app |
| Summary card | Yes | All |
| Evidence card | Yes | Public + authenticated |
| Verification badge | Yes | All |
| Upload dropzone | Yes | Authenticated app |
| Timeline | Yes | Lifecycle/history |
| Stepper | Yes | Create/edit flow |
| Diff viewer | Yes | Approvals/history |
| Dynamic snapshot panel | Phase 2 | Operator/internal |
| Recycler readiness card | Yes | Recycler/internal |


---

# Source file: 15_frontend_user_flows_and_states.md

# Frontend User Flows and States

## Purpose
Define the **end-to-end journeys** and the **state model** for the product.

---

## 1. Primary end-to-end flows

## Flow 1 — Public QR verification
1. User scans QR.
2. Resolver validates code.
3. User lands on public passport overview.
4. User checks status, manufacturer, specs, and compliance summary.
5. User opens documents or requests restricted access.

### Success condition
User can determine authenticity and key compliance quickly.

### Failure states
- invalid QR
- archived passport
- public view disabled
- resolver timeout

---

## Flow 2 — Manufacturer creates and publishes a passport
1. User opens dashboard.
2. Clicks `Create Passport`.
3. Completes wizard steps.
4. Saves draft.
5. Uploads evidence.
6. Reviews missing fields.
7. Submits for approval or publishes directly if permitted.

### Key UX rules
- auto-save drafts
- preserve step state
- surface mandatory-field gaps early
- show completeness score

### Failure states
- validation errors
- upload failure
- duplicate identifiers
- permission issue
- publish blocked by policy

---

## Flow 3 — Reviewer approves a pending update
1. Reviewer opens approvals inbox.
2. Selects request.
3. Sees diff, evidence, warnings, and previous values.
4. Chooses approve / reject / request changes.
5. Decision recorded in history.

### Success condition
Decision happens without leaving review context.

### Failure states
- evidence missing
- stale review
- conflicting newer version
- authorization expired

---

## Flow 4 — Recycler accesses recycler view
1. Recycler resolves passport or signs into partner workspace.
2. Recycler lands on recycler-specific view.
3. Reviews hazard flags, disassembly order, material fractions.
4. Downloads recycler summary or records recovery outcome.

### Failure states
- access not granted
- recycler-specific data incomplete
- hazardous information withheld by policy

---

## Flow 5 — Operator checks dynamic data
1. Operator opens dynamic-data view.
2. Sees latest snapshot and trends.
3. Checks freshness and data quality.
4. Opens lifecycle notes or source system if needed.

### Failure states
- telemetry unavailable
- stale data
- anomaly detected
- access scope insufficient

---

## 2. Cross-cutting UX states

## 2.1 Record state
Every passport should visibly show:
- draft
- under review
- approved
- published
- superseded
- archived
- decommissioned

## 2.2 Verification state
- verified
- pending verification
- failed verification
- unverifiable

## 2.3 Completeness state
- complete
- mostly complete
- partial
- insufficient

## 2.4 Access state
- public
- restricted
- partner
- internal only

---

## 3. Standard page states

## 3.1 Loading
Use skeletons:
- hero skeleton
- card skeleton
- table skeleton
- document-preview skeleton

## 3.2 Empty
Empty states should always answer:
- what is missing
- why it matters
- what to do next

Examples:
- no passports yet
- no evidence uploaded
- no traceability events
- no dynamic data connected

## 3.3 Error
Error states should show:
- plain-language explanation
- safe retry if possible
- support/help path if not

Examples:
- document preview failed
- save failed
- permission denied
- network issue

## 3.4 Success
Show confirmation for:
- saved draft
- uploaded evidence
- approved change
- published passport
- exported summary

Use toast for lightweight success; use page/banner state for major milestones.

---

## 4. State catalogue by screen

## Dashboard
- loading
- onboarding-empty
- normal
- degraded integration
- no pending tasks

## Passport list
- loading
- empty portfolio
- filtered-empty
- partial sync
- permission-restricted rows

## Wizard
- pristine
- dirty
- auto-saved
- validation error
- step complete
- submit success
- publish blocked

## Public overview
- loading
- public available
- limited public data
- archived
- invalid passport
- request-access prompt

## Evidence vault
- empty
- upload in progress
- upload failed
- verification failed
- verification passed

## Dynamic data
- connected and fresh
- connected but stale
- disconnected
- partial data
- anomaly flagged

---

## 5. CTA behavior rules

### Rule 1
Each page must have one obvious primary action.

### Rule 2
If the user cannot act because of permissions, replace the CTA with:
- explanation
- request-access or contact path

### Rule 3
If action is blocked by missing data, show:
- exact missing items
- fix-now CTA

### Rule 4
Destructive flows require confirmation and a clear consequence statement.

---

## 6. Approval-state UX logic

### When a draft is under review
Hide direct-edit controls for non-authorized users.
Show:
- review status
- reviewer
- submitted time
- compare changes action

### When rejected
Show:
- rejection reason
- fields impacted
- return-to-edit CTA

### When approved
Show:
- approver
- approved timestamp
- publish action if separate

---

## 7. Data freshness logic

Dynamic or evidence-driven screens should show:
- last updated
- last verified
- source system
- freshness label

Suggested freshness labels:
- live
- today
- stale
- unknown

---

## 8. Empty-state content model

Every empty state card should have:
- icon/illustration
- title
- 1–2 sentence explanation
- primary CTA
- optional secondary help link

Example:
`No evidence uploaded yet`
`Upload certificates, declarations, or manuals so this passport can move to review.`
CTA: `Upload Evidence`

---

## 9. Alert and banner model

### Info banner
Use for contextual explanations.

### Warning banner
Use for incomplete, expiring, or stale information.

### Error banner
Use for blocking issues.

### Success banner
Use for high-value milestone completion.

---

## 10. Notification logic
Notifications should exist for:
- approval requested
- approval completed
- document verification failed
- certificate expiry approaching
- missing mandatory fields
- integration sync failed
- dynamic data stale

---

## 11. Flow acceptance checklist
A flow is ready when:
- entry point exists
- happy path works
- blocking states are handled
- error messaging exists
- action ownership is clear
- timestamps and status are visible


---

# Source file: 16_frontend_data_binding_and_api_contracts.md

# Frontend Data Binding and API Contracts

## Purpose
Define what the frontend should expect from the backend so screens can be implemented cleanly and consistently.

This is not the final backend API spec. It is the **frontend integration contract**.

---

## 1. Frontend data layers

The frontend should separate data into:
1. **route-level summary data**
2. **section detail data**
3. **action payloads**
4. **reference/evidence data**
5. **dynamic telemetry summaries**

Do not force every screen to load the full passport blob.

---

## 2. Route-level view models

## 2.1 Public passport overview view model
```json
{
  "passportId": "string",
  "publicId": "string",
  "title": "string",
  "status": "published",
  "verificationStatus": "verified",
  "lastUpdatedAt": "ISO-8601",
  "manufacturer": {
    "name": "string",
    "country": "string"
  },
  "summaryMetrics": {
    "ratedPowerSTC_W": 0,
    "moduleEfficiency_percent": 0,
    "productWarranty_years": 0
  },
  "publicSections": {
    "specs": true,
    "compliance": true,
    "circularity": true,
    "documents": true
  }
}
```

## 2.2 Dashboard view model
```json
{
  "tenant": {
    "id": "string",
    "name": "string"
  },
  "kpis": {
    "totalPassports": 0,
    "drafts": 0,
    "published": 0,
    "pendingApprovals": 0,
    "expiringCertificates": 0
  },
  "taskCards": [],
  "alerts": [],
  "recentActivity": []
}
```

## 2.3 Passport workspace header view model
```json
{
  "passportId": "string",
  "title": "string",
  "status": "draft|under_review|approved|published|superseded|archived",
  "verificationStatus": "verified|pending|failed",
  "completenessPercent": 0,
  "lastUpdatedAt": "ISO-8601",
  "lastUpdatedBy": "string",
  "actions": {
    "canEdit": true,
    "canSubmit": true,
    "canApprove": false,
    "canPublish": false,
    "canArchive": false
  }
}
```

---

## 3. Section-level API expectations

## 3.1 Identity/specification endpoints
- `GET /passports/:id/overview`
- `GET /passports/:id/specs`
- `PATCH /passports/:id/specs`

## 3.2 Composition endpoints
- `GET /passports/:id/composition?view=bom-lite`
- `GET /passports/:id/composition?view=engineering`
- `GET /passports/:id/composition?view=recycling`
- `PATCH /passports/:id/composition`

## 3.3 Traceability endpoints
- `GET /passports/:id/traceability`
- `POST /passports/:id/traceability/events`
- `PATCH /passports/:id/traceability/events/:eventId`

## 3.4 Compliance endpoints
- `GET /passports/:id/compliance`
- `POST /passports/:id/compliance/certificates`
- `POST /passports/:id/compliance/declarations`

## 3.5 Evidence endpoints
- `GET /evidence`
- `GET /passports/:id/evidence`
- `POST /evidence/upload`
- `POST /evidence/:id/verify`
- `POST /evidence/:id/link`

## 3.6 Lifecycle endpoints
- `GET /passports/:id/lifecycle`
- `POST /passports/:id/lifecycle/events`

## 3.7 Dynamic-data endpoints
- `GET /passports/:id/dynamic-data/summary`
- `GET /passports/:id/dynamic-data/freshness`
- `GET /passports/:id/dynamic-data/source-links`
- `POST /passports/:id/dynamic-data/refresh`

## 3.8 History/approval endpoints
- `GET /passports/:id/history`
- `GET /passports/:id/diff?from=v1&to=v2`
- `GET /approvals`
- `POST /approvals/:id/approve`
- `POST /approvals/:id/reject`
- `POST /approvals/:id/request-changes`

---

## 4. Permissions and visibility

The frontend should not only rely on hidden buttons.  
The backend should return action permissions in payloads.

Example:
```json
{
  "permissions": {
    "canViewEngineeringBom": false,
    "canEditComposition": true,
    "canApprove": false,
    "canDownloadRestrictedEvidence": false
  }
}
```

Use this to:
- hide actions
- disable actions with explanation
- choose which sections appear

---

## 5. Evidence/document flow contract

## Upload flow
1. frontend requests upload slot or signed URL
2. uploads file
3. submits metadata
4. backend returns evidence object
5. frontend refreshes evidence list

Suggested evidence object:
```json
{
  "evidenceId": "string",
  "name": "IEC 61730 Certificate",
  "type": "certificate",
  "issuer": "UL",
  "hash": "string",
  "signatureStatus": "verified|pending|failed|none",
  "linkedPassportIds": ["string"],
  "accessLevel": "public|restricted|internal",
  "createdAt": "ISO-8601"
}
```

---

## 6. Wizard save contract

The wizard should support:
- partial saves
- per-step validation
- auto-save
- publish readiness check

Suggested endpoints:
- `POST /passports/drafts`
- `PATCH /passports/:id/draft`
- `POST /passports/:id/validate`
- `POST /passports/:id/submit`
- `POST /passports/:id/publish`

Validation response should distinguish:
- blocking errors
- warnings
- missing recommended fields

---

## 7. Dynamic-data contract

Dynamic data should be split into:
1. latest snapshot
2. rollup metrics
3. anomalies
4. source references

Example:
```json
{
  "snapshot": {
    "capturedAt": "ISO-8601",
    "activePower_W": 0,
    "cumulativeGeneration_kWh": 0,
    "irradiance_Wm2": 0,
    "ambientTemperature_C": 0,
    "moduleTemperature_C": 0
  },
  "rollups": {
    "dailyEnergy_kWh": 0,
    "monthlyEnergy_kWh": 0,
    "degradationEstimate_percent": 0
  },
  "dataQuality": {
    "freshness": "live|today|stale|unknown",
    "sourceSystem": "string",
    "confidence": "high|medium|low"
  },
  "anomalies": []
}
```

---

## 8. Diff/approval contract

For approval UX, the frontend needs field-level diffs.

Example:
```json
{
  "fromVersion": "v4",
  "toVersion": "v5",
  "fieldChanges": [
    {
      "section": "composition",
      "field": "bomLite.moduleMaterials[2].massPercent",
      "oldValue": 3.2,
      "newValue": 3.4,
      "evidenceRefs": ["ev_123"]
    }
  ],
  "summary": {
    "changedSections": ["composition", "compliance"],
    "riskLevel": "medium"
  }
}
```

---

## 9. Caching and invalidation rules

### Cache aggressively
- public overview
- static specs
- public documents summary

### Revalidate more often
- approvals
- evidence verification state
- dynamic snapshot
- dashboard tasks

### Always refresh after actions
- publish
- approval
- upload evidence
- lifecycle event creation

---

## 10. Frontend form source-of-truth rules
- use backend enums, not frontend-invented ones
- preserve unknown fields where possible
- support schema-version display
- record source and evidence linkage per major field group

---

## 11. Integration checklist for frontend devs
Before building a screen, confirm:
- route payload
- section payload
- action endpoints
- permission flags
- loading and error contracts
- audit metadata
- export/download behavior


---

# Source file: 17_frontend_delivery_backlog.md

# Frontend Delivery Backlog

## Goal
Turn the frontend into a set of implementable epics, stories, and build order.

---

## 1. Delivery strategy
Build in this order:
1. design system
2. app shell + routing
3. public experience
4. passport list/workspace
5. create/edit wizard
6. evidence vault
7. approvals
8. recycler and restricted views
9. dynamic-data view
10. polish, accessibility, analytics

---

## 2. Epics

## EPIC FE-01 — Foundations
Stories:
- setup frontend repo structure
- implement design tokens
- create typography primitives
- create button system
- create card system
- create table system
- implement toast, modal, drawer, banner

## EPIC FE-02 — App shell and navigation
Stories:
- public shell
- authenticated shell
- global sidebar
- utility bar
- breadcrumbs
- section sidebar
- route guards
- permission-aware navigation

## EPIC FE-03 — Public passport experience
Stories:
- landing page
- QR resolver
- public passport overview
- public specs/compliance/circularity/documents pages
- request-access flow

## EPIC FE-04 — Manufacturer workspace
Stories:
- dashboard
- passport list
- filter/search
- passport overview/workspace
- section summary cards

## EPIC FE-05 — Passport authoring wizard
Stories:
- wizard shell
- stepper
- identity step
- specs step
- BOM step
- traceability step
- compliance step
- circularity step
- review/publish step

## EPIC FE-06 — Evidence vault
Stories:
- evidence list
- upload flow
- metadata form
- preview drawer
- verification state
- link-to-passport flow

## EPIC FE-07 — Compliance and approvals
Stories:
- approvals inbox
- diff view
- approve/reject/request-changes flow
- version history
- audit summary

## EPIC FE-08 — Recycler and partner views
Stories:
- recycler hero page
- material recovery view
- disassembly sequence
- hazard notes
- restricted-view gating

## EPIC FE-09 — Dynamic data and lifecycle
Stories:
- lifecycle timeline
- dynamic snapshot cards
- trend charts
- freshness and anomaly states
- source linkouts

## EPIC FE-10 — Quality, accessibility, and readiness
Stories:
- responsive QA
- WCAG pass
- keyboard pass
- performance optimization
- analytics instrumentation
- empty/loading/error-state audit

---

## 3. Recommended sprint order

### Sprint 1
- repo setup
- tokens
- buttons
- cards
- tables
- app shell
- routing scaffold

### Sprint 2
- public landing
- resolver
- public passport overview
- public detail pages

### Sprint 3
- dashboard
- passport list
- passport overview workspace
- summary cards

### Sprint 4
- wizard foundation
- identity/specs/compliance steps
- save draft flow

### Sprint 5
- BOM/traceability/circularity steps
- review/publish step
- completion logic

### Sprint 6
- evidence vault
- upload flow
- document preview
- verification state

### Sprint 7
- approvals inbox
- diff view
- version history
- approval decision flow

### Sprint 8
- recycler view
- lifecycle page
- restricted-role views

### Sprint 9
- dynamic data page
- charts
- freshness/anomaly states
- source links

### Sprint 10
- accessibility remediation
- responsiveness
- polish
- analytics
- release hardening

---

## 4. Definition of done by screen
A screen is not done until it has:
- final layout
- loading state
- empty state
- error state
- permission state
- success feedback
- analytics events
- responsive behavior
- keyboard navigation
- copy reviewed
- API integration complete

---

## 5. Component build order
Build these first:
1. buttons
2. badges/chips
3. cards
4. page header
5. sidebars
6. table
7. form controls
8. stepper
9. timeline
10. drawer/modal
11. upload dropzone
12. diff viewer
13. charts

---

## 6. QA checklist
- QR flow works on mobile
- public page readable without login
- all page actions visible and logical
- destructive actions confirmed
- permissions enforced
- timestamps consistent
- evidence actions work
- version history accurate
- no orphan pages without back-navigation
- screen-reader labels present
- focus order correct

---

## 7. Handoff checklist for engineering
Before development handoff, confirm:
- routes named
- page inventory approved
- component inventory approved
- CTA labels approved
- permission matrix approved
- API shape confirmed
- upload strategy confirmed
- charting approach confirmed
- document preview strategy confirmed


---

# Source file: 18_wireframes_and_layout_patterns.md

# Wireframes and Layout Patterns

## Purpose
Provide **logical page layouts** so development is easy even before polished visual design exists.

---

## 1. Public passport overview layout

```text
+--------------------------------------------------------------------------------+
| Logo | Scan | Help | Sign in                                                   |
+--------------------------------------------------------------------------------+
| PASSPORT HERO                                                                  |
| [Product/Model Title]     [Verified] [Published]                               |
| Manufacturer | Serial/Batch | Last updated                                     |
| ------------------------------------------------------------------------------ |
| KPI 1 | KPI 2 | KPI 3 | KPI 4                                                  |
| [View Documents] [Request Restricted Access]                                   |
+--------------------------------------------------------------------------------+
| Section Nav: Overview | Specs | Compliance | Circularity | Documents           |
+--------------------------------------------------------------------------------+
| Summary Cards Row                                                               |
| [Identity] [Warranty] [Compliance] [Circularity]                               |
+--------------------------------------------------------------------------------+
| Main Content                                                                    |
| - Key overview block                                                            |
| - Product summary                                                               |
| - Public evidence summary                                                       |
| - Circularity summary                                                           |
+--------------------------------------------------------------------------------+
```

---

## 2. Authenticated app shell

```text
+--------------------------------------------------------------------------------+
| Sidebar         | Top Utility Bar                                              |
| Dashboard       | Search | Notifications | Help | User                         |
| Passports       +-------------------------------------------------------------+
| Evidence        | Page Header                                                  |
| Approvals       | Title / Breadcrumb / Status / Actions                        |
| Integrations    +-------------------------------------------------------------+
| Settings        | Main Content                                                 |
|                 |                                                             |
|                 |                                                             |
|                 |                                                             |
+--------------------------------------------------------------------------------+
```

---

## 3. Passport workspace layout

```text
+--------------------------------------------------------------------------------+
| Global Sidebar   | Passport Header / Hero                                      |
|                  | [Passport Title] [Status] [Verification] [Completeness]     |
|                  | Last updated | Owner | Actions                              |
+------------------+-------------------------------------------------------------+
| Context Sidebar  | Main Section Content                                        |
| Overview         |                                                             |
| Specs            | Overview cards                                              |
| Composition      |                                                             |
| Traceability     | Detail blocks                                               |
| Compliance       |                                                             |
| Evidence         | Optional right activity/evidence panel                      |
| Lifecycle        |                                                             |
| Dynamic Data     |                                                             |
| History          |                                                             |
+--------------------------------------------------------------------------------+
```

---

## 4. Wizard layout

```text
+--------------------------------------------------------------------------------+
| Page Title: Create Passport                                                    |
+--------------------------------------------------------------------------------+
| Stepper / Progress                                                              |
| 1 Identity | 2 Specs | 3 BOM | 4 Traceability | 5 Compliance | 6 Review       |
+--------------------------------------------------------------------------------+
| Main Form Panel                        | Help / Guidance Panel                 |
|                                        | - What is required                    |
|                                        | - Validation tips                     |
|                                        | - Standards reference                 |
|                                        | - Evidence needed                     |
+--------------------------------------------------------------------------------+
| [Save Draft] [Back]                                        [Next / Submit]     |
+--------------------------------------------------------------------------------+
```

---

## 5. Evidence vault layout

```text
+--------------------------------------------------------------------------------+
| Header: Evidence Vault                              [Upload Evidence]           |
+--------------------------------------------------------------------------------+
| Search | Filters | Sort                                                      |
+--------------------------------------------------------------------------------+
| Evidence Table                         | Preview / Metadata Drawer             |
|----------------------------------------|---------------------------------------|
| Doc 1                                  | File preview                          |
| Doc 2                                  | Hash state                            |
| Doc 3                                  | Linked passports                      |
| ...                                    | Actions                               |
+--------------------------------------------------------------------------------+
```

---

## 6. Approvals layout

```text
+--------------------------------------------------------------------------------+
| Header: Approvals                                      [Filter] [Export]       |
+--------------------------------------------------------------------------------+
| Queue List                            | Review Detail                          |
|---------------------------------------|----------------------------------------|
| Approval Item A                       | What changed                           |
| Approval Item B                       | Evidence linked                        |
| Approval Item C                       | Diff summary                           |
|                                       | Previous approved values               |
|                                       | Reviewer comments                      |
|                                       | [Approve] [Reject] [Request Changes]   |
+--------------------------------------------------------------------------------+
```

---

## 7. Recycler layout

```text
+--------------------------------------------------------------------------------+
| Recycler Hero                                                                   |
| [Passport Title] [Recycler View] [Hazard Warnings]                             |
| [Download Recycler Summary] [Record Recovery Outcome]                          |
+--------------------------------------------------------------------------------+
| Summary Cards: Material Coverage | SoC Flags | Recoverability | Last Update    |
+--------------------------------------------------------------------------------+
| Left: Disassembly Order            | Right: Recovery Guidance                  |
|------------------------------------|-------------------------------------------|
| Step 1                             | Glass recovery                            |
| Step 2                             | Aluminium recovery                        |
| Step 3                             | Copper recovery                           |
| ...                                | Hazard handling                           |
+--------------------------------------------------------------------------------+
| Material Fractions Table                                                       |
+--------------------------------------------------------------------------------+
```

---

## 8. Dynamic data layout

```text
+--------------------------------------------------------------------------------+
| Dynamic Data Hero                                                               |
| Freshness | Source | Confidence | Last Snapshot                                |
| [Refresh Snapshot] [Open Data Source]                                          |
+--------------------------------------------------------------------------------+
| Snapshot Cards                                                                  |
| Power | Energy | Irradiance | Ambient Temp | Module Temp                       |
+--------------------------------------------------------------------------------+
| Trend Charts                                                                    |
+--------------------------------------------------------------------------------+
| Anomalies / Data Quality                                                        |
+--------------------------------------------------------------------------------+
```

---

## 9. Sidebar behavior rules
- global sidebar persistent on desktop
- context sidebar sticky inside workspace
- collapse global sidebar on medium screens
- convert context sidebar to dropdown on small screens
- never hide the current page title when the sidebar collapses

---

## 10. Hero behavior rules
A hero block should:
- summarize the object or workspace
- show status and trust
- show 1 main CTA and 1 secondary CTA
- never become so tall that it pushes core content below the fold on laptop screens

---

## 11. Button placement rules
- primary action: top-right or sticky footer
- secondary actions: beside primary or below hero metrics
- destructive actions: overflow menu or clearly separated footer zone


---

# Source file: 19_cta_and_microcopy_catalog.md

# CTA and Microcopy Catalog

## Purpose
Standardize **button labels, helper text, banner copy, and empty-state messaging** across the product.

---

## 1. Global primary CTAs

### Public surface
- `Scan a Passport`
- `Open Passport`
- `View Documents`
- `Request Restricted Access`
- `Download Public Summary`

### Authenticated surface
- `Create Passport`
- `Save Draft`
- `Submit for Approval`
- `Publish`
- `Upload Evidence`
- `Edit Passport`
- `Open Approvals`

### Restricted/partner surface
- `Download Recycler Summary`
- `Record Recovery Outcome`
- `View Audit Trail`
- `Open Data Source`

---

## 2. Button-label rules
Use verbs first.
Good:
- `Upload Certificate`
- `Add Lifecycle Event`
- `Compare Versions`

Avoid vague labels:
- `Proceed`
- `Continue Anyway`
- `Manage`
- `Action`

---

## 3. Recommended button text by screen

## Dashboard
Primary:
- `Create Passport`

Secondary:
- `Open Approvals`
- `Open Evidence Vault`

## Passport list
Primary:
- `Create Passport`

Secondary:
- `Import`
- `Export List`

## Wizard
Primary:
- `Next`
- `Submit for Approval`
- `Publish`

Secondary:
- `Save Draft`
- `Back`

## Evidence vault
Primary:
- `Upload Evidence`

Secondary:
- `Verify Hash`
- `Link to Passport`

## Approvals
Primary:
- `Approve`

Secondary:
- `Reject`
- `Request Changes`

## Recycler view
Primary:
- `Download Recycler Summary`

Secondary:
- `Record Recovery Outcome`

---

## 4. Empty-state microcopy

### No passports yet
Title:
`No passports yet`

Body:
`Create your first passport to start publishing product identity, compliance, and circularity data.`

CTA:
`Create Passport`

### No evidence uploaded
Title:
`No evidence uploaded yet`

Body:
`Add certificates, declarations, manuals, or reports so this passport can move through review and publication.`

CTA:
`Upload Evidence`

### No dynamic data connected
Title:
`No dynamic data connected`

Body:
`Connect a telemetry source or add a snapshot feed to show post-installation performance and health data.`

CTA:
`Configure Dynamic Data`

### No approvals pending
Title:
`Nothing waiting for review`

Body:
`All approval tasks are up to date right now.`

CTA:
`Return to Dashboard`

---

## 5. Error-state microcopy

### QR invalid
Title:
`We couldn’t resolve that passport`

Body:
`The QR code or link may be invalid, expired, or no longer available.`

Actions:
- `Retry`
- `Search by ID`

### Upload failed
Title:
`Upload failed`

Body:
`The file could not be uploaded. Check the connection or try again.`

Actions:
- `Retry Upload`

### Permission denied
Title:
`You do not have access to this section`

Body:
`This data is restricted to authorized roles. Request access if you believe you should see it.`

Actions:
- `Request Access`
- `Back`

### Save failed
Title:
`Your changes were not saved`

Body:
`We couldn’t save the latest edits. Retry now or copy your changes before leaving the page.`

Actions:
- `Retry Save`

---

## 6. Success-state microcopy

### Draft saved
`Draft saved`

### Evidence uploaded
`Evidence uploaded successfully`

### Approval completed
`Change approved`

### Rejection submitted
`Review sent back with comments`

### Passport published
`Passport published successfully`

---

## 7. Banner copy

### Warning banner — missing required fields
`Some required fields are still missing. Complete them before you submit this passport for approval.`

### Warning banner — stale telemetry
`Dynamic data is stale. The latest snapshot is older than the expected refresh window.`

### Error banner — verification failed
`Document verification failed. Review the file, issuer, or signature data before continuing.`

### Info banner — restricted view
`You are viewing a restricted section. Some fields are hidden or summarized based on your role.`

---

## 8. Helper text patterns

### Identifier fields
`Use the persistent identifier that will also be encoded in the QR or data carrier.`

### BOM-lite section
`Add the minimum material disclosure required for sustainability, traceability, and recyclability use cases.`

### Engineering BOM section
`This section is intended for controlled internal or trusted-access engineering detail.`

### Recycling BOM section
`Focus on recovery routes, hazardous handling, and disassembly sequence rather than engineering assembly detail.`

### Dynamic data section
`Store only snapshots and summary metrics here. Keep raw telemetry in the source system and reference it from the passport.`

---

## 9. Confirmation-dialog copy

### Archive passport
Title:
`Archive this passport?`

Body:
`Archived passports remain in history but will no longer appear as active records.`

Primary:
`Archive Passport`

Secondary:
`Cancel`

### Publish passport
Title:
`Publish this passport?`

Body:
`Publishing makes the latest approved version available to public or partner-facing views based on access policy.`

Primary:
`Publish`

Secondary:
`Review Again`

### Reject approval
Title:
`Reject this update?`

Body:
`The submitter will need to revise the record before it can move forward.`

Primary:
`Reject Update`

Secondary:
`Cancel`

---

## 10. Tooltip text examples
- verification badge: `This status reflects the latest evidence and validation checks available to the platform.`
- freshness chip: `Shows how recent the connected dynamic data snapshot is.`
- completeness score: `Calculated from required and recommended field coverage for this passport.`
