import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { renderSidecarHtml } from "../dist/html.js";
import { startSidecarServer } from "../dist/server.js";

function extractFunctionsFromSidecarHtml(html) {
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, "Inline <script> block must exist in rendered HTML");
  const scriptSource = scriptMatch[1];

  // Minimal DOM stub so we can execute the actual client JS bundle inside node:vm
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
        addEventListener(type, fn) {
          this["_on_" + type] = fn;
        },
        querySelectorAll() { return []; },
        querySelector() { return null; },
      });
    }
    return elements.get(id);
  }

  const fetchCalls = [];
  let mockFetchHandler = async () => ({ ok: true, json: async () => ({}) });

  const sandbox = {
    console,
    setTimeout: () => 1,
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    CSS: { escape: (s) => String(s) },
    navigator: { clipboard: { writeText: () => {} } },
    window: { addEventListener: () => {} },
    document: {
      getElementById: (id) => getEl(id),
      querySelectorAll: () => [],
      querySelector: () => null,
      createElementNS: () => ({ setAttribute: () => {}, appendChild: () => {} }),
    },
    fetch: async (url, opts) => {
      fetchCalls.push({ url, opts });
      return mockFetchHandler(url, opts);
    },
  };

  vm.createContext(sandbox);
  vm.runInContext(
    scriptSource +
      "\n;globalThis.__exports = { renderMarkdown, isAgentSeatSession, fetchApprovals, renderApprovals, openApprovalDetailModal, approveItem, quickRejectItem, openRejectModal, getCachedApprovals: () => cachedApprovals };",
    sandbox
  );

  return {
    exports: sandbox.__exports,
    elements,
    getEl,
    fetchCalls,
    setFetchHandler(fn) {
      mockFetchHandler = fn;
    },
  };
}

test("Approval Markdown Rendering, Queue Detail Hydration & Evidence Inspector Suite", async (t) => {
  const html = renderSidecarHtml("http://127.0.0.1:7433");

  await t.test("1. GFM Markdown Renderer: Tables, Safe Links, Dividers, Code & XSS Protection", () => {
    const { exports } = extractFunctionsFromSidecarHtml(html);
    const { renderMarkdown } = exports;

    const sampleProposal = [
      "# `[S1]` Calendar Adjustment: Resolve Weekday Deep Work Overlap",
      "",
      "> **Category**: Google Calendar Mutation (`sawxuezheng01@gmail.com`)",
      "> **Execution Seat**: `ea-scheduler@exec-coordinator`",
      "",
      "---",
      "",
      "## Proposed Calendar Change",
      "",
      "| Field | Current Value | Proposed Value |",
      "| :--- | :---: | ---: |",
      "| **Event Summary** | `Deep Work | Block 1` | **09:30 – 11:00 PST** |",
      "| `snake_case_key` | [Open Chat](conversation://15140af0-0c39-4131-88f9-4874882aaf12) | [Spec](file:///home/xsaw/antigravity/busy-shannon/proposals/s1.md) |",
      "",
      "Action items immediately following text:",
      "- Verify [Docs](https://openrig.dev/docs?a=1&b=2)",
      "- Block [Evil](javascript:alert(1)) and <script>alert('xss')</script>",
    ].join("\n");

    const rendered = renderMarkdown(sampleProposal);

    // Headings & inline code inside heading
    assert.ok(rendered.includes('<h1 class="md-h1"><code class="md-inline-code">[S1]</code> Calendar Adjustment: Resolve Weekday Deep Work Overlap</h1>'));

    // Multi-line blockquote merged cleanly into single blockquote
    assert.equal((rendered.match(/<blockquote class="md-blockquote">/g) || []).length, 1);

    // Horizontal divider
    assert.ok(rendered.includes('<hr class="md-hr">'));

    // Accessible responsive GFM table (tabindex="0" role="region" + sticky thead + alignments + data-label)
    assert.ok(
      rendered.includes('<div tabindex="0" role="region" aria-label="Proposal data table" class="md-table-wrapper"><table class="md-table"><thead>'),
      "GFM table must be wrapped in keyboard-scrollable role=region .md-table-wrapper"
    );
    assert.ok(rendered.includes('<th style="text-align:center;">Current Value</th>'));
    assert.ok(rendered.includes('<th style="text-align:right;">Proposed Value</th>'));
    assert.ok(rendered.includes('data-label="Field"'));
    // Pipe inside inline code did NOT split the table cell!
    assert.ok(rendered.includes('<code class="md-inline-code">Deep Work | Block 1</code>'));
    // snake_case inside inline code and prose preserved without mangling underscores
    assert.ok(rendered.includes('<code class="md-inline-code">snake_case_key</code>'));

    // Safe link protocols allowlisted
    assert.ok(rendered.includes('<a class="md-link" href="conversation://15140af0-0c39-4131-88f9-4874882aaf12">Open Chat</a>'));
    assert.ok(rendered.includes('<a class="md-link" href="https://openrig.dev/docs?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">Docs</a>'));
    assert.ok(rendered.includes('<span class="md-file-ref" title="/home/xsaw/antigravity/busy-shannon/proposals/s1.md">📄 Spec</span>'));

    // List following text without blank line is NOT nested inside <p>
    assert.ok(!rendered.includes('<p class="md-p">Action items immediately following text:<br><ul'), "<ul> must not be nested inside <p>");
    assert.ok(rendered.includes('<ul class="md-ul"><li class="md-li-ul">'));

    // XSS prevention: javascript: URL stripped to plain label & <script> escaped
    assert.ok(!rendered.includes("javascript:alert"), "javascript: scheme must never be rendered in href");
    assert.ok(!rendered.includes("<script>"), "Raw <script> tags must be HTML-escaped");
    assert.ok(rendered.includes("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"));
  });

  await t.test("2. Queue Hydration, Inline Markdown Preview, Detail Modal & Sender Wake Notification", async () => {
    const h = extractFunctionsFromSidecarHtml(html);
    h.getEl("approvals-sort").value = "newest";
    h.getEl("approvals-rig-filter").value = "all";

    h.setFetchHandler(async (url) => {
      if (url === "/api/attention") {
        return {
          ok: true,
          json: async () => ({
            items: [
              {
                id: "queue:qitem-s1",
                kind: "queue",
                urgency: "routine",
                summary: "[S1] Shift Weekday Deep Work Block 1",
                recipient: "human@kernel",
                scope: "instance · project unknown",
                at: "2026-10-31T21:05:22.301Z",
                unblocks: "No dependent task recorded; inspect the request for its intended outcome.",
              },
            ],
          }),
        };
      }
      if (url === "/api/queue/qitem-s1") {
        return {
          ok: true,
          json: async () => ({
            qitemId: "qitem-s1",
            sourceSession: "exec-chief@exec-coordinator",
            destinationSession: "human@kernel",
            priority: "routine",
            humanIntent: "decision",
            tags: ["gate:human"],
            evidenceRef: "/home/xsaw/antigravity/busy-shannon/proposals/2026-10-31-s1.md",
            body: "## Proposed Change\n\n| Slot | Time |\n| --- | --- |\n| Block 1 | `09:30 - 11:00` |",
          }),
        };
      }
      if (url.startsWith("/api/evidence?")) {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            path: "/home/xsaw/antigravity/busy-shannon/proposals/2026-10-31-s1.md",
            basename: "2026-10-31-s1.md",
            content: "# Full Evidence Document\n\nExtended rationale from disk.",
          }),
        };
      }
      return { ok: true, json: async () => ({ ok: true }) };
    });

    await h.exports.fetchApprovals();

    const listHtml = h.getEl("approvals-list").innerHTML;
    // Verify inline rendered GFM markdown preview right on Tab 1 card
    assert.ok(listHtml.includes("approval-markdown-preview"), "Card must render inline markdown preview");
    assert.ok(listHtml.includes('<table class="md-table">'), "Card preview must render GFM markdown table");
    assert.ok(listHtml.includes("From: exec-chief@exec-coordinator"), "Card must display originating sender seat");
    assert.ok(listHtml.includes("2026-10-31-s1.md"), "Card must display evidence artifact basename");
    // Generic boilerplate 'No dependent task recorded...' hidden when full proposal markdown is present
    assert.ok(!listHtml.includes("No dependent task recorded"), "Boilerplate empty unblocks text should be suppressed when body markdown is shown");
    // Reply button targets exec-chief@exec-coordinator instead of human@kernel!
    assert.ok(
      listHtml.includes("openReplyModal('exec-chief@exec-coordinator')"),
      "Reply action on approval card must target sourceSession rather than human@kernel"
    );

    // Verify Rig Filter matches hydrated sourceRig ('exec-coordinator')
    h.getEl("approvals-rig-filter").value = "exec-coordinator";
    h.exports.renderApprovals();
    assert.equal(h.getEl("approvals-count").textContent, 1, "Filtering by source rig exec-coordinator must match hydrated card");

    // Verify Proposal Detail Modal opens with hydrated metadata + linked evidence markdown
    await h.exports.openApprovalDetailModal(0);
    assert.equal(h.getEl("approval-detail-from").textContent, "exec-chief@exec-coordinator");
    assert.equal(h.getEl("approval-detail-to").textContent, "human@kernel");
    assert.ok(h.getEl("approval-detail-body").innerHTML.includes('<table class="md-table">'));
    assert.ok(h.getEl("approval-detail-evidence-body").innerHTML.includes("Extended rationale from disk."));

    // Verify Approve triggers BOTH /api/mission-control/action AND wake message to exec-chief@exec-coordinator
    h.fetchCalls.length = 0;
    await h.exports.approveItem("qitem-s1", "[S1] Shift Weekday Deep Work Block 1", "exec-chief@exec-coordinator");
    const actionCall = h.fetchCalls.find((c) => c.url === "/api/mission-control/action");
    const wakeCall = h.fetchCalls.find((c) => c.url === "/api/transport/send");
    assert.ok(actionCall, "approveItem must call /api/mission-control/action");
    assert.ok(wakeCall, "approveItem must send wake notification via /api/transport/send to originating agent seat");
    const wakePayload = JSON.parse(wakeCall.opts.body);
    assert.equal(wakePayload.session, "exec-chief@exec-coordinator");
    assert.ok(wakePayload.text.includes("APPROVED qitem-s1"));

    // Verify human@kernel is never treated as an agent seat for transport wake
    assert.equal(h.exports.isAgentSeatSession("human@kernel"), false);
    assert.equal(h.exports.isAgentSeatSession("operator@human"), false);
    assert.equal(h.exports.isAgentSeatSession("exec-chief@exec-coordinator"), true);
  });

  await t.test("3. Read-Only /api/evidence Endpoint Enforces Root & Extension Boundaries", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sidecar-evidence-test-"));
    const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), "sidecar-outside-test-"));
    const allowedMd = path.join(tmpRoot, "proposal.md");
    const secretEnv = path.join(tmpRoot, "secrets.env");
    const outsideMd = path.join(outsideDir, "outside.md");

    fs.writeFileSync(allowedMd, "# Test Proposal\n\n| Item | Status |\n| --- | --- |\n| S1 | Ready |\n", "utf8");
    fs.writeFileSync(secretEnv, "API_KEY=secret", "utf8");
    fs.writeFileSync(outsideMd, "# Outside Root", "utf8");

    const sidecar = await startSidecarServer({
      port: 0,
      host: "127.0.0.1",
      daemonUrl: "http://127.0.0.1:59998",
      allowedEvidenceRoots: [tmpRoot],
    });

    try {
      // 1. Allowed .md inside allowed root succeeds
      const okRes = await fetch(`${sidecar.url}/api/evidence?path=${encodeURIComponent(allowedMd)}`);
      assert.equal(okRes.status, 200);
      const okData = await okRes.json();
      assert.equal(okData.ok, true);
      assert.equal(okData.basename, "proposal.md");
      assert.ok(okData.content.includes("# Test Proposal"));

      // 2. Disallowed extension (.env) inside allowed root -> 403
      const envRes = await fetch(`${sidecar.url}/api/evidence?path=${encodeURIComponent(secretEnv)}`);
      assert.equal(envRes.status, 403);

      // 3. Allowed extension (.md) OUTSIDE allowed root -> 403
      const outRes = await fetch(`${sidecar.url}/api/evidence?path=${encodeURIComponent(outsideMd)}`);
      assert.equal(outRes.status, 403);

      // 4. Relative path -> 400
      const relRes = await fetch(`${sidecar.url}/api/evidence?path=relative/proposal.md`);
      assert.equal(relRes.status, 400);
    } finally {
      await new Promise((cb) => sidecar.server.close(cb));
      fs.rmSync(tmpRoot, { recursive: true, force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  });
});
