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
