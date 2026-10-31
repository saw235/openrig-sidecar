import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";
import vm from "node:vm";
import { renderSidecarHtml } from "../dist/html.js";
import { startSidecarServer } from "../dist/server.js";

const require = createRequire(import.meta.url);
const dagre = require("dagre");

test("Graph-First Agent Topology & Origin Proxy Verification Suite", async (t) => {
  const html = renderSidecarHtml("http://127.0.0.1:7433");

  await t.test("1. Embedded Client JavaScript Compiles Cleanly & Loads Vendored Dagre Engine", () => {
    assert.ok(
      html.includes('<script src="/vendor/dagre.min.js"></script>'),
      "HTML must load local vendored /vendor/dagre.min.js bundle"
    );
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, "HTML must contain inline <script> block");
    assert.doesNotThrow(() => {
      new vm.Script(scriptMatch[1]);
    }, "Client JavaScript inside renderSidecarHtml must parse with zero syntax errors");
  });

  await t.test("2. Topology Tab Defaults to Interactive Visual Graph View", () => {
    assert.ok(
      html.includes("let topologyViewMode = 'graph';"),
      "topologyViewMode must default to 'graph'"
    );
    assert.ok(
      html.includes('class="view-toggle-btn active" id="view-toggle-graph"'),
      "Visual Graph toggle button must carry active class by default"
    );
    assert.ok(
      html.includes('class="view-toggle-btn" id="view-toggle-grid"'),
      "Matrix Grid toggle button must remain available as secondary view"
    );
    assert.ok(
      /#topology-graph-container\s*\{[\s\S]*?display:\s*block;/.test(html),
      "#topology-graph-container must be visible (display: block) by default"
    );
    assert.ok(
      /#topology-list\s*\{[\s\S]*?display:\s*none;/.test(html),
      "#topology-list must be hidden (display: none) by default"
    );
  });

  await t.test("3. Rig → Pod → Seat Hierarchy, Edge Layer Controls, Zoom/Pan, & Seat Inspector", () => {
    // Edge layer toggles
    assert.ok(html.includes('id="layer-btn-ownership"'), "Must include Rig → Seat ownership layer toggle");
    assert.ok(html.includes('id="layer-btn-delegates_to"'), "Must include Delegates edge layer toggle");
    assert.ok(html.includes('id="layer-btn-collaborates_with"'), "Must include Collaborates edge layer toggle");
    assert.ok(html.includes('id="layer-btn-escalates_to"'), "Must include Escalates edge layer toggle");

    // Zoom & pan controls
    assert.ok(html.includes('id="graph-zoom-in"'), "Must include zoom-in control");
    assert.ok(html.includes('id="graph-zoom-out"'), "Must include zoom-out control");
    assert.ok(html.includes('id="graph-zoom-reset"'), "Must include zoom-reset control");
    assert.ok(html.includes('id="graph-zoom-fit"'), "Must include fit-to-width control");
    assert.ok(html.includes("initGraphViewportPanZoom"), "Must initialize canvas drag-to-pan and Ctrl+wheel zoom");

    // Directed relationship markers & hub/inspector architecture
    assert.ok(html.includes('id="arrow-delegates"'), "Must define arrow-delegates SVG marker");
    assert.ok(html.includes('id="arrow-escalates"'), "Must define arrow-escalates SVG marker");
    assert.ok(html.includes('id="arrow-collaborates"'), "Must define arrow-collaborates SVG marker");
    assert.ok(html.includes('id="arrow-ownership"'), "Must define arrow-ownership SVG marker");
    assert.ok(html.includes("graph-rig-hub"), "Must render Rig Hub root nodes in graph");
    assert.ok(html.includes('id="topology-seat-inspector"'), "Must include interactive seat & rig relationship inspector");
    assert.ok(html.includes("selectGraphSeat"), "Must support clicking seats to inspect incoming/outgoing relationships");
    assert.ok(html.includes("selectGraphRig"), "Must support clicking rig hubs to focus a rig's seats");

    // Real edges fetched from /api/rigs/:id
    assert.ok(
      html.includes("fetch('/api/rigs/' + rig.id)"),
      "fetchTopology must query /api/rigs/:id to load real directed topology edges"
    );
  });

  await t.test("4. Sidecar Proxy Strips Browser Origin/Referer & Proxies Real Rig Edges", async () => {
    let observedHeaders = null;
    const mockDaemon = http.createServer((req, res) => {
      observedHeaders = req.headers;
      // Simulate strict OpenRig daemon browser boundary that rejects foreign Origin headers
      if (req.headers.origin && req.headers.origin !== "http://127.0.0.1:7433") {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ code: "browser_origin_refused", origin: req.headers.origin }));
        return;
      }
      if (req.url === "/api/rigs/rig-1") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          rig: { id: "rig-1", name: "openrig-dev" },
          nodes: [
            { id: "n1", logicalId: "core.lead" },
            { id: "n2", logicalId: "core.builder" },
            { id: "n3", logicalId: "qa.reviewer" }
          ],
          edges: [
            { id: "e1", rigId: "rig-1", sourceId: "n1", targetId: "n2", kind: "delegates_to" },
            { id: "e2", rigId: "rig-1", sourceId: "n2", targetId: "n3", kind: "delegates_to" }
          ]
        }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ items: [] }));
    });

    await new Promise((resolve) => mockDaemon.listen(0, "127.0.0.1", resolve));
    const daemonPort = mockDaemon.address().port;
    const sidecar = await startSidecarServer({
      port: 0,
      host: "127.0.0.1",
      daemonUrl: `http://127.0.0.1:${daemonPort}`
    });

    try {
      const res = await fetch(`${sidecar.url}/api/rigs/rig-1`, {
        headers: {
          Origin: "http://127.0.0.1:7434",
          Referer: "http://127.0.0.1:7434/"
        }
      });
      assert.equal(res.status, 200, "Sidecar proxy must succeed without triggering daemon browser_origin_refused");
      assert.equal(observedHeaders.origin, undefined, "Origin header must be stripped on proxied API call");
      assert.equal(observedHeaders.referer, undefined, "Referer header must be stripped on proxied API call");

      const payload = await res.json();
      assert.equal(payload.edges.length, 2);
      assert.equal(payload.edges[0].kind, "delegates_to");

      // Also verify /vendor/dagre.min.js is served locally with zero external CDN reliance
      const dagreRes = await fetch(`${sidecar.url}/vendor/dagre.min.js`);
      assert.equal(dagreRes.status, 200, "Sidecar must serve /vendor/dagre.min.js with HTTP 200");
      assert.ok(
        (dagreRes.headers.get("content-type") || "").includes("javascript"),
        "/vendor/dagre.min.js must return application/javascript content-type"
      );
      const dagreCode = await dagreRes.text();
      assert.ok(dagreCode.length > 50000, "Vendored dagre.min.js bundle must be non-empty");
    } finally {
      await new Promise((cb) => sidecar.server.close(cb));
      await new Promise((cb) => mockDaemon.close(cb));
    }
  });

  await t.test("5. Dagre Top-Down (TB) Compound Layout Places Rig Hub at Top & Flows Seats Vertically", () => {
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    const elements = new Map();
    const makeEl = (id, initialValue = "") => ({
      id,
      value: initialValue,
      innerHTML: "",
      textContent: "",
      clientWidth: 1100,
      offsetLeft: 0,
      offsetTop: 0,
      scrollLeft: 0,
      scrollTop: 0,
      style: {},
      attributes: {},
      classList: {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); }
      },
      setAttribute(k, v) { this.attributes[k] = v; },
      addEventListener() {}
    });

    for (const id of [
      "refresh-btn", "topology-graph-stage", "topology-graph-container",
      "topology-graph-viewport", "topology-seat-inspector", "topology-rig-filter",
      "topology-search", "topology-runtime-filter", "topology-status-filter",
      "topology-sort", "topology-list", "seats-count", "telem-active-seats",
      "telem-burn-rate", "telem-cost", "telem-top-seat", "telem-top-detail",
      "graph-zoom-reset", "view-toggle-grid", "view-toggle-graph"
    ]) {
      const val = id.endsWith("-filter") ? "all" : id === "topology-sort" ? "newest" : "";
      elements.set(id, makeEl(id, val));
    }

    const sandbox = {
      console,
      dagre,
      setTimeout: () => 1,
      clearTimeout: () => {},
      setInterval: () => 1,
      clearInterval: () => {},
      fetch: () => Promise.resolve({ ok: true, json: async () => ({ items: [] }) }),
      window: { dagre, addEventListener() {}, open() {} },
      navigator: { clipboard: { writeText() {} } },
      document: {
        getElementById(id) {
          if (!elements.has(id)) elements.set(id, makeEl(id));
          return elements.get(id);
        },
        querySelectorAll() { return []; }
      }
    };

    vm.createContext(sandbox);
    vm.runInContext(
      scriptMatch[1] + "\n;globalThis.__testHooks = { setCached: (v) => { cachedTopology = v; }, getSeats: () => graphSeatRegistry, getHubs: () => graphRigHubRegistry, getDims: () => ({ w: lastGraphLogicalWidth, h: lastGraphLogicalHeight }), renderSvgGraph, selectGraphSeat, selectGraphRig, toggleGraphEdgeLayer, adjustGraphZoom };",
      sandbox
    );

    sandbox.__testHooks.setCached({
      rigs: [
        {
          id: "r1",
          name: "openrig-dev",
          nodes: [
            { _id: "n1", nodeId: "n1", logicalId: "core.lead", podNamespace: "core", runtime: "antigravity", model: "gemini-3.8-flash", activityState: { display: "working" }, resumeToken: "uuid-lead-1234" },
            { _id: "n2", nodeId: "n2", logicalId: "core.builder", podNamespace: "core", runtime: "antigravity", model: "gemini-3.8-flash", activityState: { display: "working" }, resumeToken: "uuid-builder-5678" },
            { _id: "n3", nodeId: "n3", logicalId: "qa.reviewer", podNamespace: "qa", runtime: "omp", model: "gemini-3.8-flash", activityState: { display: "idle" } }
          ],
          edges: [
            { sourceId: "n1", targetId: "n2", kind: "delegates_to" },
            { sourceId: "n2", targetId: "n3", kind: "delegates_to" },
            { sourceId: "n3", targetId: "n2", kind: "escalates_to" }
          ]
        },
        {
          id: "r2",
          name: "kernel",
          nodes: [
            { _id: "k1", nodeId: "k1", logicalId: "advisor.lead", podNamespace: "advisor", runtime: "antigravity", activityState: { display: "idle" } },
            { _id: "k2", nodeId: "k2", logicalId: "operator.agent", podNamespace: "operator", runtime: "antigravity", activityState: { display: "idle" } },
            { _id: "k3", nodeId: "k3", logicalId: "operator.human", podNamespace: "operator", nodeKind: "human", runtime: "human", activityState: { display: "working" } }
          ],
          edges: [
            { sourceId: "k1", targetId: "k2", kind: "delegates_to" },
            { sourceId: "k2", targetId: "k3", kind: "collaborates_with" }
          ]
        }
      ],
      costData: null,
      topData: null,
      seatUsageMap: {}
    });

    sandbox.__testHooks.renderSvgGraph();

    const svgOut = elements.get("topology-graph-stage").innerHTML;
    assert.ok(svgOut.includes('id="topology-svg-canvas"'), "Must render topology-svg-canvas SVG element");
    assert.ok(svgOut.includes("openrig-dev") && svgOut.includes("kernel"), "Must render both Rig Hub root nodes");
    assert.ok(svgOut.includes("POD: core (2)") && svgOut.includes("POD: qa (1)"), "Must render Pod cluster containers");
    assert.ok(svgOut.includes("graph-edge-ownership"), "Must render Rig → Pod structural ownership edges");
    assert.ok(svgOut.includes('data-kind="delegates_to"'), "Must render delegates_to edges");
    assert.ok(svgOut.includes('data-kind="escalates_to"'), "Must render escalates_to edges");
    assert.ok(svgOut.includes('data-kind="collaborates_with"'), "Must render collaborates_with edges");
    assert.ok(svgOut.includes("conversation://uuid-builder-5678"), "Must embed 1-click Antigravity Chat deep link on SVG seat card");

    // Verify Dagre Top-Down (TB) vertical coordinates: Rig Hub at TOP, followed vertically by seats
    const hubs = sandbox.__testHooks.getHubs();
    const seats = sandbox.__testHooks.getSeats();
    const dims = sandbox.__testHooks.getDims();

    assert.ok(hubs["openrig-dev"].y < seats["openrig-dev::n1"].y, "Rig Hub must sit vertically ABOVE core.lead");
    assert.ok(seats["openrig-dev::n1"].y < seats["openrig-dev::n2"].y, "core.lead must sit vertically ABOVE core.builder");
    assert.ok(seats["openrig-dev::n2"].y < seats["openrig-dev::n3"].y, "core.builder must sit vertically ABOVE qa.reviewer");

    assert.ok(hubs["kernel"].y < seats["kernel::k1"].y, "kernel Rig Hub must sit vertically ABOVE advisor.lead");
    assert.ok(seats["kernel::k1"].y < seats["kernel::k2"].y, "advisor.lead must sit vertically ABOVE operator.agent");
    assert.ok(dims.w <= 1140, `Top-down Dagre graph width (${dims.w}px) must stay compact and not scale excessively rightwards`);

    // Select core.builder seat and inspect causal relationships in inspector
    sandbox.__testHooks.selectGraphSeat("openrig-dev::n2");
    const inspectorHtml = elements.get("topology-seat-inspector").innerHTML;
    assert.ok(inspectorHtml.includes("core.builder"), "Inspector must focus selected seat core.builder");
    assert.ok(inspectorHtml.includes("← core.lead") && inspectorHtml.includes("(delegates_to)"), "Inspector must display upstream incoming delegates_to edge from core.lead");
    assert.ok(inspectorHtml.includes("→ qa.reviewer") && inspectorHtml.includes("(delegates_to)"), "Inspector must display downstream outgoing delegates_to edge to qa.reviewer");
    assert.ok(inspectorHtml.includes("← qa.reviewer") && inspectorHtml.includes("(escalates_to)"), "Inspector must display incoming escalates_to edge from qa.reviewer");
    assert.ok(inspectorHtml.includes("conversation://uuid-builder-5678"), "Inspector must expose Open Chat conversation:// link");

    // Select kernel rig hub
    sandbox.__testHooks.selectGraphRig("kernel");
    const rigInspectorHtml = elements.get("topology-seat-inspector").innerHTML;
    assert.ok(rigInspectorHtml.includes("RIG FOCUS") && rigInspectorHtml.includes("kernel"), "Inspector must display Rig Focus summary when Rig Hub is clicked");
  });
});
