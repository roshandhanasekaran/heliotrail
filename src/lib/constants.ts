export const PASSPORT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  under_review: "Under Review",
  approved: "Approved",
  published: "Published",
  superseded: "Superseded",
  archived: "Archived",
  decommissioned: "Decommissioned",
};

export const VERIFICATION_STATUS_LABELS: Record<string, string> = {
  verified: "Verified",
  pending: "Pending",
  unverifiable: "Unverifiable",
  outdated: "Outdated",
};

export const MODULE_TECHNOLOGY_LABELS: Record<string, string> = {
  crystalline_silicon_topcon: "TOPCon",
  crystalline_silicon_perc: "PERC",
  crystalline_silicon_hjt: "HJT",
  thin_film_cdte: "CdTe",
  thin_film_cigs: "CIGS",
  other: "Other",
};

export const CERTIFICATE_STATUS_LABELS: Record<string, string> = {
  valid: "Valid",
  expired: "Expired",
  revoked: "Revoked",
  pending: "Pending",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  declaration_of_conformity: "Declaration of Conformity",
  test_report: "Test Report",
  user_manual: "User Manual",
  installation_instructions: "Installation Instructions",
  safety_instructions: "Safety Instructions",
  datasheet: "Datasheet",
  epd: "EPD",
  due_diligence_report: "Due Diligence Report",
  recycling_guide: "Recycling Guide",
  other: "Other",
};

export const ACCESS_LEVEL_LABELS: Record<string, string> = {
  public: "Public",
  restricted: "Restricted",
  recycler: "Recycler",
  authority: "Authority",
  internal: "Internal",
};

export const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  error: "Error",
};

export const ANCHOR_TYPE_LABELS: Record<string, string> = {
  local: "Local Hash",
  blockchain: "Blockchain",
};

export const SITE_CONFIG = {
  name: "HelioTrail",
  description:
    "Digital Product Passport platform for PV solar modules. Traceability, compliance, and circularity in one trusted system.",
  url: "https://heliotrail.com",
} as const;
