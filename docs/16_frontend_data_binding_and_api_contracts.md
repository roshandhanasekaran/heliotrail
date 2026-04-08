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
