import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { renderSidecarHtml } from "../dist/html.js";

function createHarness(html) {
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, "Inline <script> block must exist");
  const scriptSource = scriptMatch[1];

  const elements = new Map();
  function getEl(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        value: "",
        textContent: "",
        innerHTML: "",
        className: "",
        checked: false,
        dataset: {},
        style: {},
        href: "",
        classList: {
          _set: new Set(),
          add(c) { this._set.add(c); },
          remove(c) { this._set.delete(c); },
          contains(c) { return this._set.has(c); },
        },
        addEventListener(type, fn) { this["_on_" + type] = fn; },
        querySelectorAll() { return []; },
        querySelector() { return null; },
        getAttribute() { return null; },
      });
    }
    return elements.get(id);
  }

  const fetchCalls = [];
  let fetchHandler = async () => ({ ok: true, json: async () => ({}) });
  const keydownHandlers = [];

  const sandbox = {
    console,
    Date,
    setTimeout: () => 1,
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    CSS: { escape: (s) => String(s) },
    navigator: { clipboard: { writeText: () => {} } },
    window: { addEventListener: (type, fn) => { if (type === "keydown") keydownHandlers.push(fn); } },
    document: {
      activeElement: null,
      getElementById: (id) => getEl(id),
      querySelectorAll: () => [],
      querySelector: () => null,
      createElementNS: () => ({ setAttribute: () => {}, appendChild: () => {} }),
    },
    fetch: async (url, opts) => {
      fetchCalls.push({ url, opts });
      return fetchHandler(url, opts);
    },
  };

  vm.createContext(sandbox);
  vm.runInContext(
    scriptSource +
      "\n;globalThis.__exports = { renderApprovals, fetchApprovals, requestApprove, requestQuickReject, openRejectModal, " +
      "setApprovals: (v) => { cachedApprovals = v; }, setDeliverables: (v) => { cachedDeliverables = v; } };",
    sandbox
  );

  getEl("tab-approvals").classList.add("active");

  return {
    exports: sandbox.__exports,
    sandbox,
    elements,
    getEl,
    fetchCalls,
    keydownHandlers,
    setFetchHandler(fn) { fetchHandler = fn; },
    dispatchKey(key, extra = {}) {
      const event = { key, preventDefault() {}, metaKey: false, ctrlKey: false, altKey: false, ...extra };
      for (const handler of keydownHandlers) handler(event);
    },
  };
}

const html = renderSidecarHtml("http://127.0.0.1:7433");
const parentItem = {
  id: "queue:qitem-parent",
  summary: "Approve the Stage 5 silhouette direction",
  kind: "action",
  urgency: "routine",
  humanIntent: "decision",
  tags: ["slice:01-silhouettes"],
  at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  sourceSession: "direction-art-director@design-studio",
};
const sweepItem = {
  id: "queue:qitem-sweep",
  summary: "Stuck sweep: stalled-after-claim on qitem-parent (5 min)",
  kind: "notice",
  urgency: "routine",
  tags: ["stuck-sweep-finding", "recovery-for:qitem-parent"],
  at: new Date().toISOString(),
};

test("SDCR.0.8.01: Approvals triage & deduplication engine", async (t) => {
  await t.test("1. Sweep rows nest under their parent card instead of standing alone", () => {
    const h = createHarness(html);
    h.exports.setApprovals([parentItem, sweepItem]);
    h.exports.renderApprovals();

    const listHtml = h.getEl("approvals-list").innerHTML;
    assert.ok(listHtml.includes("nested-sweep-banner"), "Parent card must show a nested sweep banner");
    assert.ok(listHtml.includes("Watchdog Wake:"), "Banner must label the watchdog wake");
    assert.ok(listHtml.includes('data-approval-id="queue:qitem-parent"'), "Parent card must render");
    assert.ok(!listHtml.includes('data-approval-id="queue:qitem-sweep"'), "Sweep must not render as a top-level card");
    assert.equal(h.getEl("approvals-count").textContent, 1, "Nested sweep must not inflate the count");
    assert.ok(h.getEl("approvals-list").classList.contains("sectioned"), "List must switch to sectioned layout");
  });

  await t.test("2. Orphaned sweeps fall back into the diagnostic tier", () => {
    const h = createHarness(html);
    h.exports.setApprovals([{
      id: "queue:qitem-orphan",
      summary: "Stuck sweep: undelivered-wake on qitem-missing (9 min)",
      kind: "notice",
      tags: ["stuck-sweep-finding", "recovery-for:qitem-missing"],
      at: new Date().toISOString(),
    }]);
    h.exports.renderApprovals();

    const listHtml = h.getEl("approvals-list").innerHTML;
    assert.ok(listHtml.includes("Diagnostic & Maintenance Notices"), "Tier 3 heading must render");
    assert.ok(listHtml.includes('data-approval-id="queue:qitem-orphan"'), "Orphan sweep must stay visible");
    assert.ok(listHtml.includes('data-tier="3"'), "Orphan must land in tier 3");
    assert.ok(listHtml.includes('<details class="triage-details" open>'), "Orphan diagnostics open by default");
  });

  await t.test("3. Items section into decisions, gates, and diagnostics", () => {
    const h = createHarness(html);
    h.exports.setApprovals([
      parentItem,
      {
        id: "queue:qitem-gate",
        summary: "Milestone gate: merge sprint 03",
        kind: "action",
        tags: ["gate:human"],
        at: new Date().toISOString(),
      },
      {
        id: "queue:qitem-update",
        summary: "Informational update on the queue worker",
        kind: "update",
        humanIntent: "update",
        tags: [],
        at: new Date().toISOString(),
      },
    ]);
    h.exports.renderApprovals();

    const listHtml = h.getEl("approvals-list").innerHTML;
    assert.ok(listHtml.includes("High-Stakes Decisions (1)"), "Tier 1 heading with count");
    assert.ok(listHtml.includes("Milestone & Gate Approvals (1)"), "Tier 2 heading with count");
    assert.ok(listHtml.includes("Diagnostic & Maintenance Notices (1)"), "Tier 3 heading with count");
    assert.ok(listHtml.includes("card-tier-1") && listHtml.includes("card-tier-2") && listHtml.includes("card-tier-3"), "Cards carry tier classes");
    assert.ok(listHtml.includes("DECISION") && listHtml.includes("GATE"), "Tier badges render");
    assert.ok(listHtml.includes("Owed 3h"), "High-stakes card shows time owed");
    assert.ok(listHtml.indexOf("High-Stakes Decisions") < listHtml.indexOf("Milestone & Gate Approvals"), "Tier 1 sorts before tier 2");
  });

  await t.test("4. Generic unblocks boilerplate is replaced with slice context", () => {
    const h = createHarness(html);
    h.exports.setDeliverables([
      { scope: "demo-mission/slices/01-silhouettes", judgment: null },
      { scope: "demo-mission/slices/01-silhouettes", judgment: { verdict: "accept" } },
      { scope: "other-mission/slices/01-other", judgment: null },
    ]);
    h.exports.setApprovals([{
      ...parentItem,
      unblocks: "No dependent task recorded; inspect the request for its intended outcome.",
    }]);
    h.exports.renderApprovals();

    const listHtml = h.getEl("approvals-list").innerHTML;
    assert.ok(listHtml.includes("unblocks-context-card"), "Structured unblocks card must render");
    assert.ok(listHtml.includes("What This Unblocks:"), "Unblocks card must carry a title");
    assert.ok(listHtml.includes("<code>01-silhouettes</code>"), "Slice id must be shown");
    assert.ok(listHtml.includes("1 pending deliverable awaiting sign-off"), "Pending count must exclude accepted items and other slices");
    assert.ok(!listHtml.includes("No dependent task recorded"), "Generic boilerplate must be suppressed");
  });

  await t.test("5. Approve and quick reject open a confirmation before any POST", async () => {
    const h = createHarness(html);
    h.exports.setApprovals([parentItem]);
    h.exports.renderApprovals();

    const listHtml = h.getEl("approvals-list").innerHTML;
    assert.ok(listHtml.includes('onclick="requestApprove('), "Card approve must route through confirmation");
    assert.ok(listHtml.includes('onclick="requestQuickReject('), "Card quick reject must route through confirmation");

    h.exports.requestApprove("qitem-parent", parentItem.summary, parentItem.sourceSession);
    assert.ok(h.getEl("triage-confirm-modal").classList.contains("open"), "Confirmation modal must open");
    assert.equal(h.fetchCalls.filter(c => c.url.includes("/api/mission-control/action")).length, 0, "No POST before confirmation");

    await h.getEl("triage-confirm-btn")._on_click();
    const posts = h.fetchCalls.filter(c => c.url.includes("/api/mission-control/action"));
    assert.equal(posts.length, 1, "Confirmation must issue exactly one mission-control POST");
    assert.equal(JSON.parse(posts[0].opts.body).verb, "approve", "Confirmed action must approve");
  });

  await t.test("6. Hotkeys no-op while a text input has focus", () => {
    const h = createHarness(html);
    h.exports.setApprovals([parentItem]);
    h.exports.renderApprovals();

    h.sandbox.document.activeElement = { tagName: "INPUT", isContentEditable: false, closest: () => null };
    h.dispatchKey("a");
    assert.ok(!h.getEl("triage-confirm-modal").classList.contains("open"), "Typing in an input must not trigger triage hotkeys");
    assert.equal(h.fetchCalls.filter(c => c.url.includes("/api/mission-control/action")).length, 0, "No POST from a guarded hotkey");

    h.sandbox.document.activeElement = {
      tagName: "DIV",
      isContentEditable: false,
      closest: () => ({ getAttribute: () => "queue:qitem-parent" }),
    };
    h.dispatchKey("a");
    assert.ok(h.getEl("triage-confirm-modal").classList.contains("open"), "Focused card + 'a' opens the confirmation gate");
    assert.equal(h.fetchCalls.filter(c => c.url.includes("/api/mission-control/action")).length, 0, "Hotkey still confirms before POST");
  });
});
