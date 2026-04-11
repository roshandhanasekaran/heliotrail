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
