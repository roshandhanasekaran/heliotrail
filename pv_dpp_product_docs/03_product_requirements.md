# Product Requirements

## Functional requirements

### FR-1 Passport creation
The system shall create a unique PV passport record for:
- product model
- batch / lot
- individual module where applicable

### FR-2 Identity resolution
The system shall resolve a QR code / data carrier to:
- public passport view
- authorized stakeholder views
- latest approved version

### FR-3 Evidence management
The system shall store or reference:
- declarations of conformity
- certificates
- manuals
- safety documents
- EPD / carbon documents
- test reports

### FR-4 Structured schema support
The system shall support:
- static product attributes
- material composition
- supply-chain entities
- circularity/EoL data
- optional dynamic performance data

### FR-5 Access control
The system shall support role-based access for:
- public
- manufacturer
- importer
- auditor/certifier
- recycler
- authority / regulator
- customer / asset owner
- service partner

### FR-6 Change management
The system shall:
- version all passport updates
- preserve audit history
- track who changed what and when
- allow approval workflows for sensitive data

### FR-7 Integrity
The system shall:
- hash referenced documents
- protect signed/approved fields from tampering
- maintain evidence provenance

### FR-8 Interoperability
The system shall provide:
- APIs
- import/export templates
- JSON schema-based exchange
- optional VC/DID support for trusted credentials

### FR-9 Circularity support
The system shall support:
- dismantling instructions
- reuse / refurbishment state changes
- recycler handover
- recovery reporting

### FR-10 Optional lifecycle intelligence
The system should support:
- telemetry pointers
- cumulative generation
- maintenance logs
- degradation indicators

## Non-functional requirements

### NFR-1 Security
- encryption at rest and in transit
- strong authentication
- tenant isolation
- signed audit logs

### NFR-2 Scalability
Must scale across:
- multiple customers
- multiple product lines
- millions of modules
- high document volumes

### NFR-3 Availability
- high availability for public passport resolution
- backup copy strategy
- archival strategy after company/tenant inactivity

### NFR-4 Regulatory explainability
Every important field should have:
- source
- owner
- update responsibility
- confidence / certainty classification

### NFR-5 Extensibility
New delegated-act fields must be added without platform redesign.

## User stories

### Manufacturer compliance manager
As a compliance manager, I want to generate a passport from ERP/MES/PLM data so that I can place products on the market with lower manual effort.

### Recycler
As a recycler, I want material composition and dismantling guidance so that I can process modules safely and efficiently.

### Buyer / installer
As a buyer, I want to verify identity, compliance, and warranty data from a QR code so that I can trust the product.

### Auditor / authority
As an auditor, I want a tamper-evident change log and source documents so that I can verify claims.

## MVP acceptance criteria
- passport can be created and resolved from QR
- public and restricted views work
- compliance docs can be attached and hashed
- material composition can be represented structurally
- EoL / dismantling data can be added
- all changes are auditable


## Frontend-specific requirements

### FR-11 Public passport experience
The system shall provide a public-facing passport experience that supports:
- QR resolution
- public summary page
- identity and compliance overview
- evidence summary
- circularity and EoL summary
- role-aware escalation to restricted views

### FR-12 Frontend workspace for manufacturers
The system shall provide an authenticated workspace that supports:
- dashboard
- passport list and search
- create/edit wizard
- version history
- approvals
- document/evidence management
- traceability and circularity authoring

### FR-13 Role-aware restricted views
The system shall expose tailored views for:
- recycler
- auditor
- authority
- asset owner / operator
- service provider

### FR-14 Reusable design system
The frontend shall provide:
- button hierarchy
- reusable cards
- tables
- steppers
- timeline views
- evidence components
- navigation shell
- sidebar patterns
- empty/loading/error/success states

### FR-15 Accessibility and responsiveness
The frontend shall support:
- desktop-first authenticated workflows
- mobile-friendly public QR experience
- keyboard navigation
- clear focus states
- sufficient contrast
- screen-reader-friendly structure

### FR-16 Data freshness and trust communication
The frontend shall visibly show:
- verification status
- last updated timestamp
- source/evidence availability
- approval state
- data completeness

## Frontend acceptance criteria
- a user can scan a QR and land on a readable public passport page
- a manufacturer can create a passport through a guided wizard
- an approver can approve or reject a pending update
- a recycler can access recycler-facing material and dismantling data
- loading, empty, and error states exist for all primary screens
- component patterns are reused consistently across pages
