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
