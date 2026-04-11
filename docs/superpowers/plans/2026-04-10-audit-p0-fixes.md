# Audit P0 Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all P0 dead buttons and data credibility issues identified in the platform audit so the demo is client-ready.

**Architecture:** Targeted fixes across 4 areas: (1) Integrations dead Configure buttons → "coming soon" toast, (2) Evidence Vault dead search → client-side filter, (3) AI Analytics model filter dropdown removal, (4) Financial data scale-up 1000x to match manufacturer fleet.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Lucide icons.

---

## File Map

| File | Change |
|---|---|
| `src/app/app/integrations/page.tsx` | Convert to client component, add toast on Configure click |
| `src/app/app/evidence/page.tsx` | Extract client wrapper for search filtering |
| `src/components/app/evidence-vault-client.tsx` | New: client component with search state + filtered table |
| `src/lib/mock/ai-analytics.ts` | Scale financial values 1000x |
| `src/components/app/ai-analytics/analytics-control-bar.tsx` | Remove model filter dropdown |
| `src/components/app/ai-analytics/ai-analytics-sidebar.tsx` | Remove modelFilter prop threading |
| `src/app/app/ai-analytics/page.tsx` | Remove modelFilter state |

---

### Task 1: Fix Integrations Dead Configure Buttons

**Files:**
- Modify: `src/app/app/integrations/page.tsx`

- [ ] **Step 1: Convert to client component and add toast handler**

Replace the entire file with:

```tsx
// src/app/app/integrations/page.tsx
"use client";

import { useState } from "react";
import { Plug, Database, Factory, BarChart3, Shield, Wifi } from "lucide-react";

const integrations = [
  {
    name: "ERP System",
    description: "Connect SAP, Oracle, or other ERP for automated passport data import",
    icon: Database,
    status: "available" as const,
  },
  {
    name: "MES / PLM",
    description: "Sync manufacturing execution and product lifecycle data",
    icon: Factory,
    status: "available" as const,
  },
  {
    name: "LCA / EPD Tools",
    description: "Import lifecycle assessment and environmental product declarations",
    icon: BarChart3,
    status: "available" as const,
  },
  {
    name: "Certification Systems",
    description: "Automated certificate verification and renewal tracking",
    icon: Shield,
    status: "coming_soon" as const,
  },
  {
    name: "SCADA / IoT",
    description: "Connect monitoring systems for real-time performance data",
    icon: Wifi,
    status: "coming_soon" as const,
  },
];

export default function IntegrationsPage() {
  const [toastName, setToastName] = useState<string | null>(null);

  function handleConfigure(name: string) {
    setToastName(name);
    setTimeout(() => setToastName(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect external systems to automate passport data flows
        </p>
      </div>

      {toastName && (
        <div className="flex items-center gap-2 bg-[#E8FAE9] px-4 py-2 text-sm font-medium text-[#0D0D0D]">
          <Plug className="h-4 w-4 text-[#22C55E]" />
          {toastName} integration setup requested. Our team will reach out within 24 hours.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <div key={integration.name} className="clean-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center bg-muted">
                <integration.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              {integration.status === "coming_soon" && (
                <span className="bg-muted px-2 py-0.5 text-[0.6875rem] font-semibold text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </div>
            <h3 className="mt-3 text-sm font-bold text-foreground">
              {integration.name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {integration.description}
            </p>
            {integration.status === "available" && (
              <button
                onClick={() => handleConfigure(integration.name)}
                className="cta-secondary mt-3 w-full justify-center text-xs"
              >
                <span>Configure</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the page renders**

Run: `cd /Users/roshandhanashekeran/Developer/heliotrail && npm run build 2>&1 | grep -E "integrations|error" | head -5`
Expected: Route `/app/integrations` compiles without errors

- [ ] **Step 3: Commit**

```bash
git add src/app/app/integrations/page.tsx
git commit -m "fix(integrations): wire Configure buttons to toast confirmation"
```

---

### Task 2: Fix Evidence Vault Dead Search

**Files:**
- Modify: `src/app/app/evidence/page.tsx`
- Create: `src/components/app/evidence-vault-client.tsx`

The Evidence Vault is a server component (fetches from Supabase). The search needs client-side state. Solution: keep the server component for data fetching, extract the search + table into a client component.

- [ ] **Step 1: Create the client wrapper component**

```tsx
// src/components/app/evidence-vault-client.tsx
"use client";

import { useState, useMemo } from "react";
import { DOCUMENT_TYPE_LABELS, ACCESS_LEVEL_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Search, FileText, Lock, Globe, CheckCircle2, FolderOpen } from "lucide-react";

interface DocumentRow {
  id: string;
  name: string;
  issuer: string | null;
  document_type: string;
  access_level: string;
  document_hash: string | null;
  passports: { model_id: string; pv_passport_id: string } | null;
}

interface EvidenceVaultClientProps {
  documents: DocumentRow[];
}

export function EvidenceVaultClient({ documents }: EvidenceVaultClientProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return documents;
    const q = search.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(q) ||
        (doc.issuer && doc.issuer.toLowerCase().includes(q)) ||
        (doc.document_type && DOCUMENT_TYPE_LABELS[doc.document_type]?.toLowerCase().includes(q)) ||
        (doc.passports && doc.passports.model_id.toLowerCase().includes(q))
    );
  }, [documents, search]);

  return (
    <>
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="h-9 w-full border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
        />
      </div>

      {search && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} of {documents.length} documents match &quot;{search}&quot;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-16 text-center">
          <FolderOpen className="h-10 w-10 text-[#D9D9D9]" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {search ? "No documents match your search" : "Evidence vault is empty"}
          </p>
          {!search && (
            <p className="mt-1 text-xs text-muted-foreground">
              Upload certificates, declarations, or manuals to get started.
            </p>
          )}
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Document
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground md:table-cell">
                  Type
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground lg:table-cell">
                  Linked Passport
                </th>
                <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Access
                </th>
                <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9]">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {doc.name}
                        </p>
                        {doc.issuer && (
                          <p className="text-xs text-muted-foreground">
                            {doc.issuer}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                    {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {doc.passports && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {doc.passports.model_id}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {doc.access_level === "public" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#22C55E]">
                        <Globe className="h-3 w-3" /> Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        {ACCESS_LEVEL_LABELS[doc.access_level]}
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {doc.document_hash ? (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    ) : (
                      <span className="text-xs text-[#D9D9D9]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Update the server page to use the client wrapper**

Replace `src/app/app/evidence/page.tsx` with:

```tsx
// src/app/app/evidence/page.tsx
import { createClient } from "@/lib/supabase/server";
import { UploadEvidenceButton } from "@/components/app/upload-evidence-button";
import { EvidenceVaultClient } from "@/components/app/evidence-vault-client";

export default async function EvidenceVaultPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("passport_documents")
    .select("*, passports(model_id, pv_passport_id)")
    .order("created_at", { ascending: false });

  const docs = (documents ?? []) as {
    id: string;
    name: string;
    issuer: string | null;
    document_type: string;
    access_level: string;
    document_hash: string | null;
    passports: { model_id: string; pv_passport_id: string } | null;
  }[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evidence Vault</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {docs.length} document{docs.length !== 1 ? "s" : ""} across all passports
          </p>
        </div>
        <UploadEvidenceButton />
      </div>

      <EvidenceVaultClient documents={docs} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/app/evidence-vault-client.tsx src/app/app/evidence/page.tsx
git commit -m "fix(evidence): wire search input to filter documents client-side"
```

---

### Task 3: Remove AI Analytics Model Filter Dropdown

The model filter dropdown accepts selections but doesn't filter any charts. Rather than implement full filtering (massive scope), remove the dropdown to eliminate the dead control.

**Files:**
- Modify: `src/components/app/ai-analytics/analytics-control-bar.tsx`
- Modify: `src/app/app/ai-analytics/page.tsx`

- [ ] **Step 1: Read the AI analytics page to find modelFilter state**

Read `src/app/app/ai-analytics/page.tsx` and find where `modelFilter` state is declared and passed to child components.

- [ ] **Step 2: Remove model filter from the control bar**

In `src/components/app/ai-analytics/analytics-control-bar.tsx`:
- Remove `modelFilter` and `onModelFilterChange` from the props interface
- Remove the model filter `<select>` element and its label from the JSX
- Keep the sync indicator that follows it

- [ ] **Step 3: Remove modelFilter state from the page**

In `src/app/app/ai-analytics/page.tsx`:
- Remove the `useState` for `modelFilter`
- Remove `modelFilter` and `onModelFilterChange` props from `<AnalyticsControlBar>`
- Remove `modelFilter` prop from any detail panel components that receive it (they already ignore it, so just stop passing it)

- [ ] **Step 4: Commit**

```bash
git add src/components/app/ai-analytics/analytics-control-bar.tsx src/app/app/ai-analytics/page.tsx
git commit -m "fix(ai-analytics): remove non-functional model filter dropdown"
```

---

### Task 4: Scale Financial Data to Manufacturer Fleet Level

Scale all mock financial values 1000x to represent a realistic manufacturer fleet (~50MW, ~100K modules) instead of a single 5-10kW array.

**Files:**
- Modify: `src/lib/mock/ai-analytics.ts`

- [ ] **Step 1: Update getRevenueIntelligence() values**

In `src/lib/mock/ai-analytics.ts`, change `getRevenueIntelligence()` (around line 235):

```typescript
// BEFORE:
monthlyLoss: 12.4,
annualProjected: 148.8,
optimizationPotential: 2400,

// AFTER:
monthlyLoss: 12400,
annualProjected: 148800,
optimizationPotential: 2400000,
```

And the loss drivers:

```typescript
// BEFORE:
{ category: "Soiling", euroPerMonth: 5.6, percent: 45, color: "#F59E0B", trend: "up" },
{ category: "Clipping", euroPerMonth: 2.4, percent: 19, color: "#3B82F6", trend: "stable" },
{ category: "Degradation", euroPerMonth: 2.8, percent: 23, color: "#737373", trend: "up" },
{ category: "Downtime", euroPerMonth: 1.6, percent: 13, color: "#EF4444", trend: "down" },

// AFTER:
{ category: "Soiling", euroPerMonth: 5600, percent: 45, color: "#F59E0B", trend: "up" },
{ category: "Clipping", euroPerMonth: 2400, percent: 19, color: "#3B82F6", trend: "stable" },
{ category: "Degradation", euroPerMonth: 2800, percent: 23, color: "#737373", trend: "up" },
{ category: "Downtime", euroPerMonth: 1600, percent: 13, color: "#EF4444", trend: "down" },
```

- [ ] **Step 2: Update getMaintenancePredictions() values**

In `src/lib/mock/ai-analytics.ts`, change `getMaintenancePredictions()` (around line 199):

```typescript
// BEFORE:
modulesAtRisk: 2,
...
cleaningCostEur: 85,
annualSavingsEur: 1872,
costIfDelayed: 156,

// AFTER:
modulesAtRisk: 247,
...
cleaningCostEur: 85000,
annualSavingsEur: 1872000,
costIfDelayed: 156000,
```

- [ ] **Step 3: Update display formatting in intelligence-sidebar.tsx**

Read `src/components/app/intelligence-sidebar.tsx` to find where revenue values are displayed. The current display uses `€${revenue.monthlyLoss}` which will now show `€12400`. Update the formatting to use `€XXk` or `€X.Xm` notation.

Find and update these display patterns:
- `€${revenue.monthlyLoss}` → `€${(revenue.monthlyLoss / 1000).toFixed(1)}k`
- `€${revenue.annualProjected}` → `€${(revenue.annualProjected / 1000).toFixed(0)}k`
- The optimization potential already uses `/1000` formatting, so update to: `€${(revenue.optimizationPotential / 1000000).toFixed(1)}m`
- Maintenance cost display: update similarly

Also update the summary-detail.tsx, revenue-detail.tsx, and any other panels that display these EUR values — search for `euroPerMonth`, `monthlyLoss`, `annualProjected`, `cleaningCostEur`, `annualSavingsEur`, `costIfDelayed` across all detail panel files and update the formatting to use `k`/`m` suffixes.

- [ ] **Step 4: Commit**

```bash
git add src/lib/mock/ai-analytics.ts src/components/app/intelligence-sidebar.tsx
git add src/components/app/ai-analytics/detail-panels/
git commit -m "fix(ai-analytics): scale financial data to manufacturer fleet level (1000x)"
```

---

### Task 5: Build & Deploy Verification

- [ ] **Step 1: Run the build**

Run: `cd /Users/roshandhanashekeran/Developer/heliotrail && npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 2: Push and deploy**

```bash
git push origin master
vercel --prod
```

- [ ] **Step 3: Visual verification in Chrome**

Navigate to each fixed page and verify:
1. `/app/integrations` — Click "Configure" on ERP → green toast appears with "Our team will reach out within 24 hours"
2. `/app/evidence` — Type "IEC" in search → table filters to matching documents. Clear search → all documents return.
3. `/app/ai-analytics` — Model filter dropdown is gone. Only Persona + Time Range controls remain.
4. `/app/ai-analytics` — Revenue section shows €12.4k/mo, €148.8k/yr, €2.4m optimization potential
5. Right sidebar → Revenue Intelligence shows scaled values with k/m suffixes
