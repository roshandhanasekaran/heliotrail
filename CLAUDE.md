@AGENTS.md

# HelioTrail — Project Operating System

## Purpose
This repository builds **HelioTrail**, a PV Digital Product Passport SaaS platform. The goal is to produce a system that is commercially viable, technically maintainable, regulation-aware, and traceable from product requirements to implementation and tests.

Claude must optimize for long-term alignment with product goals, architecture, and regulatory constraints — not just code generation speed.

---

## Priority Order of Truth
When information conflicts, use this priority order:

1. This `CLAUDE.md`
2. Canonical feature specs in `/docs/04-features/`
3. ADRs in `/docs/05-decisions/`
4. Architecture docs in `/docs/02-architecture/` and `/docs/05_reference_architecture.md`
5. Regulation mappings in `/docs/03-regulations/` and `/docs/02_regulatory_landscape.md`
6. Product requirements in `/docs/03_product_requirements.md`
7. Tests, schemas (`/schemas/pv-passport-v1.json`), and API contracts
8. Numbered docs in `/docs/` (01-22 series) — baseline specifications
9. Other markdown notes, drafts, brainstorm docs
10. Unstructured assumptions

Do **not** treat all markdown files equally. `/pv_dpp_product_docs/` is an archive copy — never use it as source of truth.

---

## Non-Negotiables
- Do not drift from the product goal: a trusted PV passport platform for regulatory compliance, traceability, and circularity.
- Do not invent requirements, user flows, or regulatory obligations.
- Do not bypass architecture constraints for short-term convenience.
- Do not implement substantial features without locating the relevant canonical spec.
- Do not rely on stale notes when a canonical document exists.
- Always surface contradictions or ambiguity explicitly before proceeding.
- Always prefer maintainability, traceability, and correctness over speed.
- Use the battery passport (EU 2023/1542) as an architectural benchmark, but never claim PV has the same legal data obligations.
- Treat regulatory-core fields as immutable for audit; industry extensions as configurable.

---

## Tech Stack
- **Framework:** Next.js 16 (App Router) — React 19, TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui + Lucide icons
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Charts:** Recharts 3
- **PDF/Excel:** @react-pdf/renderer, ExcelJS
- **Testing:** Playwright (E2E)
- **Validation:** Docker-based validator stack (JSON Schema, SHACL, CIRPASS-2 7-layer)
- **Deployment:** Vercel

### Next.js Warning
This is Next.js 16 with breaking changes. Read `node_modules/next/dist/docs/` before writing any Next.js code. Do not assume training-data conventions are current.

---

## Operating Mode
For every substantial task, follow this sequence:

1. **Identify** the exact task and its scope.
2. **Find** the canonical feature spec in `/docs/04-features/`.
3. **Find** relevant architecture docs, ADRs, and regulation mappings.
4. **List** assumptions, dependencies, and affected modules.
5. **Flag** any contradictions or missing information before implementation.
6. **Propose** a concise plan.
7. **Implement** in the smallest correct increments.
8. **Test** — run or update tests.
9. **Update** affected docs if the change alters behavior, architecture, or decisions.
10. **Summarize** what changed, what remains, and any risks.

---

## Documentation Hierarchy

### Canonical hierarchy (preferred for new docs)
```
/docs/00-foundation/     — product vision, non-negotiables, mission
/docs/01-product/         — product requirements, personas, flows
/docs/02-architecture/    — system architecture, data model, integrations
/docs/03-regulations/     — regulation mappings, compliance requirements
/docs/04-features/        — canonical feature specs (one per feature)
/docs/05-decisions/       — ADRs (Architecture Decision Records)
/docs/06-operations/      — deployment, monitoring, runbooks
/docs/07-testing/         — test strategy, acceptance checklists
/docs/99-archive/         — superseded or stale material
```

### Legacy numbered docs (baseline reference)
The `/docs/01_product_vision_and_scope.md` through `/docs/22_STITCH_COMPONENT_CONTEXT.md` series contains the original product specification. These remain valid baseline references. When a canonical doc exists in the hierarchy, prefer it. When it doesn't, the numbered doc is authoritative.

Archive or supersede rather than delete — use `/docs/99-archive/`.

---

## Feature Work Rules
Every meaningful feature should map to one canonical spec in `/docs/04-features/`.

Use the template at `/docs/04-features/FEATURE-template.md`. A feature spec must include:
- objective, user/problem, scope, out of scope
- user flows, wireframe/reference links
- data model impact, API impact, frontend impact, backend impact
- security/compliance impact
- acceptance criteria, open questions, definition of done

If no canonical spec exists for a feature, propose creating one before major implementation.

---

## Regulation and Compliance Rules
Regulatory documents must be converted into implementation-ready mappings using the template at `/docs/03-regulations/regulation-requirement-template.md`.

Every implementation-relevant compliance item must be expressed as:
- requirement ID, source regulation, clause/reference
- interpretation, affected module
- mandatory vs optional
- implementation notes, validation/evidence required

When building regulated flows, always check:
- Is access control defined for this data tier?
- Is auditability required?
- Do data retention rules apply?
- Are disclosure fields complete for the target audience?
- Are role-specific views constrained correctly?
- Must evidence or provenance be recorded?

Key regulation sources: `/docs/02_regulatory_landscape.md`, `/docs/03-regulations/regulation-map.md`

---

## Architecture Rules
- Prefer clear module boundaries (see 6-layer architecture in `/docs/05_reference_architecture.md`).
- Reuse existing patterns unless an ADR justifies change.
- Avoid accidental duplication of business logic across routes.
- Keep frontend, backend, data, compliance, and infra responsibilities explicit.
- Any major architectural change must create or update an ADR.
- Blockchain/DID/VC layers are optional — the product must work without them.

---

## ADR Rules
Create or update an ADR (in `/docs/05-decisions/`) when:
- Choosing a new core technology or dependency
- Changing system boundaries or module responsibilities
- Changing compliance data representation
- Changing tenancy, authorization, or access-control design
- Introducing a major integration
- Making a decision future contributors must not rediscover

Use the template at `/docs/05-decisions/ADR-template.md`.

---

## Coding Standards
- Make the smallest correct change first.
- Preserve existing style unless a documented standard says otherwise.
- shadcn/ui components for UI; Tailwind for styling; server components by default.
- Avoid broad refactors unless required by the task.
- Prefer explicitness over cleverness.
- Add or update tests when behavior changes.
- Do not claim completion without validation.
- Design: premium climate-tech/industrial SaaS aesthetic — warm neutrals, controlled green accents.

---

## Testing and Validation
Before calling work complete:
- Verify acceptance criteria from the feature spec.
- Verify impacted tests pass.
- Verify no architecture contradiction introduced.
- Verify no regulatory requirement was silently bypassed.
- Verify docs remain aligned with the implementation.

---

## Output Format for Substantial Tasks
When completing a task, summarize:
1. What changed (files, modules)
2. Why (which spec/requirement drove the change)
3. Source-of-truth docs consulted
4. Assumptions made
5. What remains unresolved
6. Risks or follow-up actions

---

## Behavior Expectations
Be critical. Be precise. Do not flatter. Do not hide uncertainty. Do not overgeneralize from weak evidence. If the repo is messy, improve structure as part of the work.

---

## Reusable Commands
Available via `/command-name` in Claude Code:
- `/feature-start` — find canonical spec, map dependencies, plan before coding
- `/spec-audit` — audit repo for specification drift and doc quality
- `/compliance-check` — review changes against regulation mappings
- `/adr-create` — draft an Architecture Decision Record
- `/repo-map` — generate a current repo structure overview

---

## Key File Locations
| Purpose | Path |
|---------|------|
| Product vision | `/docs/01_product_vision_and_scope.md` |
| Regulatory landscape | `/docs/02_regulatory_landscape.md` |
| Product requirements | `/docs/03_product_requirements.md` |
| Data schema | `/docs/04_pv_passport_data_schema.md` |
| Architecture | `/docs/05_reference_architecture.md` |
| JSON schema | `/schemas/pv-passport-v1.json` |
| Regulation map | `/docs/03-regulations/regulation-map.md` |
| Feature template | `/docs/04-features/FEATURE-template.md` |
| ADR template | `/docs/05-decisions/ADR-template.md` |
| Non-negotiables | `/docs/00-foundation/non-negotiables.md` |
| DB migrations | `/supabase/migrations/` |
| Validator stack | `/validator/` + `docker-compose.yml` |
| E2E tests | `/e2e/` |
