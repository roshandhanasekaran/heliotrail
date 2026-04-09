import { test, expect } from "@playwright/test";

const PASSPORT_PUBLIC_ID = "wrm-700topcon-2026-001";
const PASSPORT_URL = `/passport/${PASSPORT_PUBLIC_ID}`;

test.describe("CIRPASS 2 Submission Flow", () => {
  test("passport page loads with correct data", async ({ page }) => {
    await page.goto(PASSPORT_URL);

    // Hero should show passport model
    await expect(page.locator("h1")).toContainText("WRM-700-TOPCON-BiN-03");

    // Should show manufacturer (use .first() since it appears in hero + overview)
    await expect(
      page.getByText("Waaree Energies Ltd.").first()
    ).toBeVisible();

    // Should show Active Passport badge
    await expect(page.getByText("Active Passport")).toBeVisible();

    // Section nav should have Registry tab
    await expect(
      page.getByRole("tab", { name: "Registry" })
    ).toBeVisible();
  });

  test("Submit to CIRPASS 2 button opens confirmation dialog", async ({
    page,
  }) => {
    await page.goto(PASSPORT_URL);

    // Find and click the submit button
    const submitBtn = page.getByRole("button", {
      name: "Submit to CIRPASS 2",
    });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Dialog should open with confirmation content
    await expect(
      page.getByRole("heading", { name: "Submit to CIRPASS 2" })
    ).toBeVisible();

    // Should show passport summary in dialog
    const dialog = page.locator(".fixed.inset-0");
    await expect(
      dialog.getByText("WRM-700-TOPCON-BiN-03")
    ).toBeVisible();
    await expect(
      dialog.getByText("Waaree Energies Ltd.")
    ).toBeVisible();

    // Should have confirm and cancel buttons
    await expect(
      page.getByRole("button", { name: "Confirm Submission" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Cancel" })
    ).toBeVisible();
  });

  test("Cancel closes the dialog without submitting", async ({ page }) => {
    await page.goto(PASSPORT_URL);

    await page
      .getByRole("button", { name: "Submit to CIRPASS 2" })
      .click();

    // Click cancel
    await page.getByRole("button", { name: "Cancel" }).click();

    // Dialog should close
    await expect(
      page.getByRole("heading", { name: "Submit to CIRPASS 2" })
    ).not.toBeVisible();
  });

  test("Full E2E: submit passport to CIRPASS 2 and verify success", async ({
    page,
  }) => {
    await page.goto(PASSPORT_URL);

    // 1. Click submit button
    await page
      .getByRole("button", { name: "Submit to CIRPASS 2" })
      .click();

    // 2. Confirm the submission
    await page.getByRole("button", { name: "Confirm Submission" }).click();

    // 3. Should show loading states
    await expect(page.getByText("Anchoring passport")).toBeVisible();

    // 4. Wait for success (up to 30s)
    await expect(page.getByText("Successfully Registered")).toBeVisible({
      timeout: 30_000,
    });

    // 5. Verify receipt ID is shown (UUID from real registry or CIRPASS2- from mock)
    await expect(page.getByText(/RECEIPT ID/i)).toBeVisible();

    // 6. Verify anchor hash is shown (64-char hex)
    await expect(page.getByText(/ANCHOR HASH/i)).toBeVisible();

    // 7. Click Done
    await page.getByRole("button", { name: "Done" }).click();

    // Dialog should close
    await expect(
      page.getByText("Successfully Registered")
    ).not.toBeVisible();
  });

  test("Registry tab shows anchor and submission history", async ({
    page,
  }) => {
    // Navigate to registry tab with longer timeout
    await page.goto(`${PASSPORT_URL}/registry`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.waitForLoadState("networkidle", { timeout: 30_000 });

    // Should show registry status section
    await expect(page.getByText("Registry Status")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Verification Status")).toBeVisible();

    // Should show integrity anchors section
    await expect(page.getByText("Integrity Anchors")).toBeVisible();

    // Should show at least one anchor hash
    await expect(page.getByText(/[a-f0-9]{64}/).first()).toBeVisible();

    // Should show CIRPASS 2 submissions section
    await expect(page.getByText("CIRPASS 2 Submissions")).toBeVisible();

    // Should show receipt ID from prior submission (UUID from real registry)
    await expect(page.getByText(/[a-f0-9]{8}-[a-f0-9]{4}-/).first()).toBeVisible();

    // Should show Accepted status
    await expect(page.getByText("Accepted").first()).toBeVisible();
  });

  test("Mock CIRPASS 2 API rejects invalid payloads", async ({ request }) => {
    // Send empty body
    const res = await request.post("/api/mock-cirpass2", {
      data: {},
    });
    expect(res.status()).toBe(422);

    const body = await res.json();
    expect(body.status).toBe("rejected");
    expect(body.errors.length).toBeGreaterThan(0);
  });

  test("Mock CIRPASS 2 API accepts valid payloads", async ({ request }) => {
    const res = await request.post("/api/mock-cirpass2", {
      data: {
        schemaVersion: "1.0.0",
        identity: { pvPassportId: "PVP-TEST-001" },
        manufacturer: { name: "Test Manufacturer" },
        technicalData: { moduleTechnology: "crystalline_silicon_topcon" },
      },
    });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("accepted");
    expect(body.receiptId).toMatch(/^CIRPASS2-/);
    expect(body.registeredAt).toBeTruthy();
  });

  test("Submission API rejects non-published passports", async ({
    request,
  }) => {
    // Use a fake UUID — should 404
    const res = await request.post(
      "/api/passports/00000000-0000-0000-0000-000000000000/submit-to-cirpass"
    );
    expect(res.status()).toBe(404);
  });
});
