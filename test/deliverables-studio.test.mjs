import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { renderSidecarHtml } from "../dist/html.js";

const html = renderSidecarHtml("http://127.0.0.1:7433");

function createHarness() {
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, "Inline <script> block must exist");
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
        scrollIntoView() {},
      });
    }
    return elements.get(id);
  }

  const fetchCalls = [];
  const keydownHandlers = [];
  let fetchHandler = async () => ({ ok: true, json: async () => ({}) });
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
      documentElement: { clientWidth: 1600 },
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: async (url, opts) => {
      fetchCalls.push({ url, opts });
      return fetchHandler(url, opts);
    },
  };

  vm.createContext(sandbox);
  vm.runInContext(
    scriptMatch[1] +
      "\n;globalThis.__exports = { renderDeliverables, setDeliverables: (v) => { cachedDeliverables = v; }, requestBatchAcceptConfirmation, " +
      "toggleDeliverableSelection, clearDeliverablesSelection, selectNextDeliverable, selectPrevDeliverable, " +
      "getActiveIndex: () => activeDeliverableIndex, getSelection: () => Array.from(selectedDeliverableKeys), " +
      "setFilter: (v) => { deliverablesVerdictFilter = v; } };",
    sandbox
  );

  getEl("tab-deliverables").classList.add("active");
  return {
    exports: sandbox.__exports,
    getEl,
    sandbox,
    fetchCalls,
    keydownHandlers,
    dispatchKey(key) {
      const event = { key, preventDefault() {}, metaKey: false, ctrlKey: false, altKey: false };
      for (const handler of keydownHandlers) handler(event);
    },
    load(items) {
      sandbox.__exports.setDeliverables(items);
      sandbox.__exports.setFilter("all");
      sandbox.__exports.renderDeliverables();
    },
  };
}

const baseItems = [
  {
    id: "item-1",
    scope: "demo-mission/slices/01-alpha",
    text: "Alpha visual contract",
    revision: "abcdef123456",
    judgment: null,
    evidence: ["proof/alpha.png", "proof/alpha.md"],
  },
  {
    id: "item-2",
    scope: "demo-mission/slices/01-alpha",
    text: "Alpha judged contract",
    revision: "bcdef123456",
    judgment: { id: "judge-1", verdict: "accept", actor: "qa.reviewer", at: new Date().toISOString(), reason: "Verified." },
    evidence: [],
  },
  {
    id: "item-3",
    scope: "other-mission/slices/02-beta",
    text: "Beta rejected contract",
    revision: "cdef123456",
    judgment: { id: "judge-2", verdict: "reject", actor: "qa.reviewer", at: new Date().toISOString(), reason: "Broken." },
    evidence: [],
  },
];

test("SDCR.0.8.02: Deliverables master-detail studio", async (t) => {
  await t.test("1. Master rail groups rows and marks the active deliverable", () => {
    const h = createHarness();
    h.load(baseItems);

    const listHtml = h.getEl("deliverables-list").innerHTML;
    assert.match(listHtml, /class="deliverables-group-header"/);
    assert.match(listHtml, /demo-mission \/ 01-alpha/);
    assert.match(listHtml, /other-mission \/ 02-beta/);
    assert.equal((listHtml.match(/class="deliverables-row/g) || []).length, 3);
    assert.match(listHtml, /class="deliverables-row active"/);
    assert.match(listHtml, /class="row-checkbox"/);
    assert.match(listHtml, /class="status-dot"/);
    assert.match(listHtml, /class="revision-pill">rev #abcdef1</);
    assert.match(listHtml, /class="time-pill"/);
    assert.match(listHtml, /02-beta[^<]*<\/span><span class="badge badge-muted">1 contract/);
    assert.equal(h.getEl("proofs-count").textContent, 3);
  });

  await t.test("2. Stage inspector renders breadcrumbs, subject-labeled evidence, and docked actions", () => {
    const h = createHarness();
    h.load(baseItems);

    const stageHtml = h.getEl("deliverables-stage-inspector").innerHTML;
    assert.match(stageHtml, /class="stage-container"/);
    assert.match(stageHtml, /class="stage-breadcrumbs"/);
    assert.match(stageHtml, /Rig: <strong>demo-mission<\/strong>/);
    assert.match(stageHtml, /Scope: <strong>01-alpha<\/strong>/);
    assert.match(stageHtml, /Alpha visual contract/);
    assert.match(stageHtml, /class="stage-evidence-figure"/);
    assert.match(stageHtml, /Subject: alpha\.png/);
    assert.match(stageHtml, /api\/evidence\/raw\?path=proof%2Falpha\.png/);
    assert.match(stageHtml, /class="stage-doc-preview"/);
    assert.match(stageHtml, /loadStageDoc\(/);
    assert.match(stageHtml, /Accept Deliverable/);
    assert.match(stageHtml, /Request Revision/);
    assert.match(stageHtml, /Sunset \/ Drop/);
    assert.doesNotMatch(stageHtml, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  });

  await t.test("3. Stage shows verdict banner and Tab 1 cross-link when linked", () => {
    const h = createHarness();
    h.load([
      {
        ...baseItems[2],
        queueItemId: "qitem-20261101000000-abc123",
      },
    ]);
    const stageHtml = h.getEl("deliverables-stage-inspector").innerHTML;
    assert.match(stageHtml, /REJECT/);
    assert.match(stageHtml, /qa\.reviewer/);
    assert.match(stageHtml, /Broken\./);
    assert.match(stageHtml, /Jump to Approvals Gate/);
    assert.match(stageHtml, /navigateToApprovals\('qitem-20261101000000-abc123'\)/);
  });

  await t.test("4. J/K/A/R/Space navigate the studio and stay guarded while typing", () => {
    const h = createHarness();
    h.load(baseItems);

    h.dispatchKey("j");
    assert.equal(h.exports.getActiveIndex(), 1, "J selects the next deliverable");
    h.dispatchKey("k");
    assert.equal(h.exports.getActiveIndex(), 0, "K selects the previous deliverable");

    h.dispatchKey(" ");
    assert.deepEqual(Array.from(h.exports.getSelection()), ["demo-mission/slices/01-alpha#item-1"], "Space selects the active row");
    h.dispatchKey(" ");
    assert.deepEqual(Array.from(h.exports.getSelection()), [], "Space toggles selection off");

    h.dispatchKey("a");
    assert.ok(h.getEl("proof-accept-modal").classList.contains("open"), "A opens the accept confirmation");
    assert.equal(h.fetchCalls.filter(c => c.url === "/api/proof/judge").length, 0, "A must not post before confirmation");
    h.getEl("proof-accept-modal").classList.remove("open");

    h.dispatchKey("r");
    assert.ok(h.getEl("proof-reject-modal").classList.contains("open"), "R opens the revision modal");

    h.sandbox.document.activeElement = { tagName: "INPUT", isContentEditable: false };
    h.dispatchKey("j");
    assert.notEqual(h.exports.getActiveIndex(), 1, "No navigation while a text input has focus");
  });

  await t.test("5. Batch accept confirms first, then judges every selected deliverable", async () => {
    const h = createHarness();
    h.load(baseItems);
    h.exports.toggleDeliverableSelection(0);
    h.exports.toggleDeliverableSelection(1);
    assert.equal(h.exports.getSelection().length, 2);
    assert.match(h.getEl("deliverables-batch-bar").style.display || "", /flex/);

    h.exports.requestBatchAcceptConfirmation();
    assert.ok(h.getEl("triage-confirm-modal").classList.contains("open"), "Batch accept must confirm first");
    assert.equal(h.fetchCalls.filter(c => c.url === "/api/proof/judge").length, 0);

    await h.getEl("triage-confirm-btn")._on_click();
    const posts = h.fetchCalls.filter(c => c.url === "/api/proof/judge");
    assert.equal(posts.length, 2, "Each selected deliverable is judged");
    for (const call of posts) {
      const payload = JSON.parse(call.opts.body);
      assert.equal(payload.verdict, "accept");
      assert.equal(payload.reason, "Batch accepted via Deliverables Studio");
      assert.ok(payload.scope && payload.item);
    }
    assert.deepEqual(Array.from(h.exports.getSelection()), [], "Selection clears after batch accept");
  });

  await t.test("6. Tab 1 offers a jump link into the proof studio; responsive CSS stacks at 900px", () => {
    assert.ok(html.includes("Jump to Target Proof Contract"), "Tab 1 unblocks card must expose the jump action");
    assert.ok(html.includes("function navigateToDeliverable"), "navigateToDeliverable helper must exist");
    assert.ok(html.includes("isInputElementActive"), "Shared input-focus guard must exist");
    assert.ok(/\.deliverables-studio\s*\{[\s\S]*?grid-template-columns:\s*minmax\(320px,\s*38%\)/.test(html), "Studio uses a two-pane grid");
    assert.ok(/@media \(max-width:\s*900px\)[\s\S]*?\.deliverables-studio\s*\{[\s\S]*?grid-template-columns:\s*1fr;/.test(html), "Studio stacks under 900px");
    assert.ok(/\.deliverables-row\s*\{[\s\S]*?height:\s*44px;[\s\S]*?min-height:\s*44px;[\s\S]*?max-height:\s*44px;/.test(html), "Master rows are 44px tall");
  });
});
