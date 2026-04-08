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
