import test from "node:test";
import assert from "node:assert/strict";
import { renderSidecarHtml } from "../dist/html.js";

test("Proof Usability & Quick Reject Workflow Test Suite", async (t) => {
  const html = renderSidecarHtml("http://127.0.0.1:4040");

  await t.test("Accept Confirmation Modal Architecture", () => {
    // Modal container
    assert.ok(html.includes('id="proof-accept-modal"'), "Must include dedicated accept confirmation modal");
    // Claim box
    assert.ok(html.includes('id="proof-accept-claim"'), "Must display deliverable claim and contract spec");
    // Scope and item display
    assert.ok(html.includes('id="proof-accept-scope-display"'), "Must display scope and item identifier");
    // Revision display
    assert.ok(html.includes('id="proof-accept-revision-display"'), "Must display revision and git commit hash");
    // Evidence preview container
    assert.ok(html.includes('id="proof-accept-evidence"'), "Must display submitted verification evidence");
    // Certification warning box
    assert.ok(html.includes("Certification:"), "Must display legal/certification explanation before accepting");
    // Confirmation action button
    assert.ok(html.includes('id="confirm-proof-accept-btn"'), "Must include explicit confirm accept button");
  });

  await t.test("Deliverable Cards Usability & Verification Evidence", () => {
    // Deliverables cards must show verification evidence preview
    assert.ok(html.includes("Verification Evidence") || html.includes("📁 Evidence:"), "Card must display verification evidence badge/preview");
    // Deliverables detail modal must include dedicated evidence section
    assert.ok(html.includes('id="detail-evidence"'), "Deliverable detail modal must include detail-evidence section");
    // Cards must wire accept action to openProofAcceptModal / openProofAcceptModalByIndex
    assert.ok(html.includes("openProofAcceptModal"), "Deliverable card accept button must trigger acceptance modal inspection");
  });

  await t.test("Tab 1 Approvals 1-Click Quick Reject & Optional Reason", () => {
    // Quick reject function for queue items
    assert.ok(html.includes("quickRejectItem"), "Must implement quickRejectItem for 1-click denial");
    // Action buttons in renderApprovals must render Quick Reject
    assert.ok(html.includes("⚡ Quick Reject"), "Approvals cards must render ⚡ Quick Reject button");
    // Rejection reason default value
    assert.ok(html.includes("Rejected by operator"), "Default rejection reason must be 'Rejected by operator'");
    // Reject modal textarea placeholder and label must indicate optionality
    assert.ok(html.includes('for="reject-reason">Reason for Rejection (Optional'), "Reject modal label must state optionality");
  });

  await t.test("Tab 3 Proof 1-Click Quick Reject & Optional Reason", () => {
    // Quick reject function for proof contracts
    assert.ok(html.includes("quickRejectProof"), "Must implement quickRejectProof for 1-click proof rejection");
    // Proof cards must render Quick Reject button
    assert.ok(html.includes("quickRejectProof"), "Proof cards must wire quickRejectProof");
    // Proof reject modal textarea placeholder and label must indicate optionality
    assert.ok(html.includes('for="proof-reject-reason">Rejection Reason (Optional'), "Proof reject modal label must state optionality");
  });

  await t.test("Client JavaScript Helper Functions", () => {
    // openProofAcceptModal function
    assert.ok(html.includes("function openProofAcceptModal("), "Must export openProofAcceptModal helper");
    // openProofAcceptModalByIndex function
    assert.ok(html.includes("function openProofAcceptModalByIndex("), "Must export openProofAcceptModalByIndex helper");
  });
});
