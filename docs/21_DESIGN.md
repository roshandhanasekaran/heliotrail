# DESIGN.md — PV Digital Product Passport

## Design intent
This product is a premium enterprise platform for photovoltaic digital product passports.
The UI must feel credible, precise, sustainable, and operationally mature.
It should combine the calmness of climate-tech with the rigor of industrial and compliance software.

## Brand personality
- Trustworthy
- Structured
- Calm
- Data-rich
- Premium
- Technical
- Sustainable without eco-cliche visuals

## Visual identity
### Theme
Use a modern enterprise sustainability theme with warm neutrals and controlled green accents.

### Typography
- Primary sans: Montserrat
- Editorial serif: Merriweather
- Technical mono: Source Code Pro

Use Montserrat for product UI, navigation, metrics, labels, and interface copy.
Use Merriweather sparingly for major editorial hero headlines or premium section titles.
Use Source Code Pro for IDs, serials, hashes, evidence references, timestamps, and technical metadata.

## Color tokens
### Light theme
- background: #f8f5f0
- foreground: #3e2723
- primary: #2e7d32
- primary-foreground: #ffffff
- secondary: #e8f5e9
- secondary-foreground: #1b5e20
- accent: #c8e6c9
- accent-foreground: #1b5e20
- muted: #f0e9e0
- muted-foreground: #6d4c41
- border: #e0d6c9
- input: #e0d6c9
- ring: #2e7d32
- card: #f8f5f0
- card-foreground: #3e2723
- sidebar: #f0e9e0
- sidebar-primary: #2e7d32
- sidebar-foreground: #3e2723
- destructive: #c62828

### Dark theme
- background: #1c2a1f
- foreground: #f0ebe5
- primary: #4caf50
- primary-foreground: #0a1f0c
- secondary: #3e4a3d
- secondary-foreground: #d7e0d6
- accent: #388e3c
- accent-foreground: #f0ebe5
- muted: #2d3a2e
- muted-foreground: #d7cfc4
- border: #3e4a3d
- input: #3e4a3d
- ring: #4caf50
- card: #2d3a2e
- card-foreground: #f0ebe5
- sidebar: #1c2a1f
- sidebar-primary: #4caf50
- sidebar-foreground: #f0ebe5
- destructive: #c62828

### Chart palette
- #4caf50
- #388e3c
- #2e7d32
- #1b5e20
- #0a1f0c

## Radius and elevation
- base radius: 0.5rem
- cards: medium radius
- dialogs: medium radius
- buttons: medium radius
- avoid overly soft playful curvature
- use low, soft shadows
- keep surfaces clean and layered through borders more than heavy shadows

## Layout system
### Public landing pages
- broad hero with structured content blocks
- trust bar under hero
- 2-column or 3-column feature sections
- generous whitespace
- clear CTA rhythm

### App shell
- left global sidebar
- top page header
- main content canvas
- optional right context sidebar
- responsive collapse on tablet/mobile

## Hero guidance
The product hero should be inspired by the editorial grid composition of the provided `tech-solutions-hero-section.tsx` reference, but adapted into a product narrative.

Hero should include:
- status chips
- large enterprise headline
- supporting subheadline
- compact metrics
- a central passport or system visualization
- primary and secondary actions
- subtle animated signal or environmental background treatment

Avoid portfolio-style wording or creative studio vibes.

## Component rules
### Buttons
Primary buttons:
- green fill
- high contrast text
- reserved for important workflow actions

Secondary buttons:
- light surface or subtle border
- lower emphasis than primary

Ghost buttons:
- minimal chrome
- used in toolbars and card actions

Destructive buttons:
- red emphasis
- use only for irreversible or rejection actions

### Cards
- use cards heavily for KPI blocks, evidence, workflow, BOM summaries, and passport status
- keep padding comfortable
- title + metadata + action structure
- use tags/chips inside cards where useful

### Tables
- enterprise-grade, clean, sortable
- include column alignment discipline
- zebra striping only if subtle
- strong header contrast
- mobile fallback must be cardized rows

### Status chips
Use consistent categories:
- draft
- in review
- approved
- published
- incomplete
- expired
- blocked
- recycled
- reused

### Navigation
Sidebar should clearly separate:
- dashboard
- passports
- BOM & materials
- traceability
- dynamic data
- evidence
- workflows
- circularity
- reports
- settings

## Imagery and illustration guidance
Use diagrams, identifiers, QR references, supply chain maps, and abstract data visuals.
Avoid cheesy stock solar farm hero imagery dominating the UI.
If imagery is used, it should support the product story rather than replace it.

## Motion guidance
- subtle fades
- modest hover elevation
- panel slide-ins
- chart transitions only when useful
- avoid excessive animation

## Accessibility rules
- preserve contrast
- do not use color alone for status
- support keyboard navigation
- strong focus rings
- readable type scale
- clear hit targets

## Product sections to prioritize
- landing page
- dashboard
- passport detail
- wizard
- BOM workspace
- traceability workspace
- dynamic data workspace
- evidence vault
- approvals center
- recycling workspace

## Engineering handoff compatibility
Design outputs must be suitable for:
- React
- TypeScript
- Tailwind CSS
- shadcn-style component structure

The design should look easy to translate into reusable UI primitives and layout components.
