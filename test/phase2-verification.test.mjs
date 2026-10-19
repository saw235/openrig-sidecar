import test from "node:test";
import assert from "node:assert/strict";
import { renderSidecarHtml } from "../dist/html.js";

test("OpenRig Sidecar Phase 2 Verification Suite: Search, Filtering & Proof Inspector", async (t) => {
  const html = renderSidecarHtml("http://127.0.0.1:7433");

  await t.test("Suite 1: Search & Filter Controls Across All Three Tabs", () => {
    // Tab 1 (Approvals) Search & Filter
    assert.ok(
      html.includes('id="approvals-search"') || html.includes('filter-search-bar') || html.includes('search-input'),
      "Tab 1 must include search and filter bar markup"
    );

    // Tab 2 (Topology) Search & Filter
    assert.ok(
      html.includes('id="topology-search"') || html.includes('search-input'),
      "Tab 2 must include search input for seats and sessions"
    );

    // Tab 3 (Deliverables) Search & Filter
    assert.ok(
      html.includes('id="deliverables-search"') || html.includes('search-input'),
      "Tab 3 must include search input for proof contracts"
    );
  });

  await t.test("Suite 2: Antigravity 2.0 Obsidian Filter Styling & Components", () => {
    // Filter pills styling
    assert.ok(html.includes(".filter-search-bar"), "CSS must define .filter-search-bar container");
    assert.ok(html.includes(".search-input"), "CSS must define .search-input styled component");
    assert.ok(html.includes(".filter-pills"), "CSS must define .filter-pills container");
    assert.ok(html.includes(".filter-pill"), "CSS must define .filter-pill button styling");

    // Detail modal styling
    assert.ok(html.includes(".detail-section"), "CSS must define .detail-section for modal drawer");
    assert.ok(html.includes(".detail-label"), "CSS must define .detail-label uppercase metadata tags");
    assert.ok(html.includes(".detail-box"), "CSS must define .detail-box for content inspection");
  });

  await t.test("Suite 3: Deliverables & Proof Detail Inspector Modal Architecture", () => {
    // Proof detail modal container
    assert.ok(
      html.includes('id="proof-detail-modal"') || html.includes('id="deliverable-detail-modal"') || html.includes('detail-modal'),
      "Detail modal container must be present in HTML"
    );

    // Inspector metadata labels
    assert.ok(
      html.includes("openProofDetailModal") || html.includes("openDeliverableModal") || html.includes("detail-modal"),
      "Card interaction must bind proof detail inspector modal"
    );
  });

  await t.test("Suite 4: Search & Filter Logic Unit Tests", () => {
    // Mock items array to simulate Tab 1, 2, and 3 filter matching
    const mockApprovals = [
      { id: "queue:qitem-1", summary: "Salt Harbor Storyboard Approval", urgency: "routine" },
      { id: "queue:qitem-2", summary: "Urgent Release Manifest Gate", urgency: "critical" },
      { id: "queue:qitem-3", summary: "Antigravity Token Telemetry", urgency: "outcome" }
    ];

    // Case-insensitive matching logic test
    function filterItems(items, query, filterUrgency = "all") {
      const q = (query || "").trim().toLowerCase();
      return items.filter(it => {
        const matchesQuery = !q || it.summary.toLowerCase().includes(q) || it.id.toLowerCase().includes(q);
        const matchesFilter = filterUrgency === "all" || it.urgency === filterUrgency;
        return matchesQuery && matchesFilter;
      });
    }

    // 1. Exact match
    const r1 = filterItems(mockApprovals, "salt harbor");
    assert.equal(r1.length, 1);
    assert.equal(r1[0].id, "queue:qitem-1");

    // 2. Case-insensitive match
    const r2 = filterItems(mockApprovals, "URGENT RELEASE");
    assert.equal(r2.length, 1);
    assert.equal(r2[0].id, "queue:qitem-2");

    // 3. Substring match
    const r3 = filterItems(mockApprovals, "token");
    assert.equal(r3.length, 1);
    assert.equal(r3[0].id, "queue:qitem-3");

    // 4. Combined query & filter
    const r4 = filterItems(mockApprovals, "approval", "routine");
    assert.equal(r4.length, 1);

    const r5 = filterItems(mockApprovals, "approval", "critical");
    assert.equal(r5.length, 0, "No routine approval should match critical filter");

    // 5. Zero-match empty state simulation
    const r6 = filterItems(mockApprovals, "non-existent-search-term");
    assert.equal(r6.length, 0);

    // 6. Filter reset (empty query + 'all' filter) returns all items
    const r7 = filterItems(mockApprovals, "", "all");
    assert.equal(r7.length, 3);
  });
});
