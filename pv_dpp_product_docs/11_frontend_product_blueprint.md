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
