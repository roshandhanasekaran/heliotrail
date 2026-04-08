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
