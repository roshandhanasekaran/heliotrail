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
