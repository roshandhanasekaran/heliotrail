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
