# Stitch Component Context — Hero and App Pattern Mapping

## Purpose
This file explains how to reinterpret the provided React component and supporting theme into the PV DPP product.

## Provided reference
The reference component is `tech-solutions-hero-section.tsx` with:
- an editorial grid layout
- background slot support
- top-left, top-center, top-right metadata blocks
- central content area
- logo / center element
- bottom metric area
- bottom-right action affordance
- animated blue background dependency

## How to reinterpret it for this product
Do not preserve the original branding text.
Preserve the **layout logic** and **high-end editorial composition**, but remap it into a product hero.

## Hero mapping
### Top-left block
Use for:
- passport program label
- deployment scope
- product category

Example:
- “PV DIGITAL PRODUCT PASSPORT”
- “Enterprise platform”

### Top-center block
Use for:
- year or release badge
- current program maturity
- demo environment tag

Example:
- “2026”
- “Release candidate”

### Top-right block
Use for:
- solution label and value
- example: “COVERAGE / TRACEABILITY + COMPLIANCE”

### Main content block
Use for:
- primary headline
- supporting product subheadline
- one supporting KPI block

Example headline:
- “Build trusted PV passports across manufacturing, traceability, performance, and circularity.”

### Center element
Use for:
- passport card visual
- QR / digital identifier tile
- module ID
- layered card stack showing passport summary

### Bottom-left block
Use for:
- adoption or performance KPI
- modules tracked
- evidence completeness
- recyclability readiness

### Bottom-right block
Use for:
- primary action or quick launch affordance
- “Create passport”
- “Open workspace”
- “View example”

## Background treatment
The animated reference background should be reinterpreted into:
- a subtle signal field
- data rays
- environmental grid
- low-contrast motion backdrop

Do not let the animation overpower readability.

## Resulting system pattern
The hero should establish a reusable pattern that later informs:
- dashboard summary banner
- passport summary banner
- case study highlight banner

## App shell mapping
The same aesthetic should extend into:
- structured sidebars
- premium dashboard cards
- clean evidence tables
- layered data panels
- modern charts and status widgets

## Content priorities for generated screens
The generated UI should prioritize:
1. trust and credibility
2. product clarity
3. ease of scanning
4. enterprise workflow maturity
5. readiness for React + shadcn implementation
