import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { startSidecarServer } from "../dist/server.js";
import { renderSidecarHtml } from "../dist/html.js";

// Helper to spawn a mock daemon for resilience and contract tests
function createMockDaemon(routes = {}) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
    const handler = routes[url.pathname] || routes[req.method + " " + url.pathname];

    if (handler) {
      handler(req, res, url);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not_found", path: url.pathname }));
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      resolve({
        server,
        port,
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise((cb) => server.close(cb)),
      });
    });
  });
}

test("OpenRig Sidecar Phase 1 Verification Suite", async (t) => {
  let mockDaemon;
  let sidecar;

  t.before(async () => {
    mockDaemon = await createMockDaemon({
      "GET /healthz": (req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", healthy: true }));
      },
      "GET /api/rigs": (req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify([{ id: "rig-1", name: "sidecar-dev" }]));
      },
      "GET /api/rigs/rig-1/nodes": (req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify([
          {
            logicalId: "core.builder",
            canonicalSessionName: "core-builder@sidecar-dev",
            runtime: "antigravity",
            activityState: { display: "working" },
            resumeToken: "conv-1234567890abcdef",
          },
        ]));
      },
      "POST /api/transport/capture": async (req, res) => {
        let body = "";
        for await (const chunk of req) body += chunk;
        const parsed = JSON.parse(body || "{}");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          ok: true,
          sessionName: parsed.session,
          lines: parsed.lines || 50,
          content: "\u001b[32m✔ Build complete\u001b[0m\nListening on port 7434",
        }));
      },
      "GET /api/telemetry/usage/cost": (req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ totalCostFormatted: "$0.42" }));
      },
      "GET /api/telemetry/usage/top": (req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ranked: [{ seat: "core.builder", burn: 15420 }] }));
      },
    });

    sidecar = await startSidecarServer({
      port: 0,
      host: "127.0.0.1",
      daemonUrl: mockDaemon.url,
    });
  });

  t.after(async () => {
    if (sidecar?.server) await new Promise((cb) => sidecar.server.close(cb));
    if (mockDaemon) await mockDaemon.close();
  });

  await t.test("Suite 1: Health Diagnostics Endpoint (/healthz)", async () => {
    const res = await fetch(`${sidecar.url}/healthz`);
    assert.equal(res.status, 200, "Should return 200 OK");
    assert.equal(res.headers.get("content-type"), "application/json");
    assert.equal(res.headers.get("access-control-allow-origin"), "*");

    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.equal(data.sidecar, true);
    assert.equal(data.version, "0.1.0");
    assert.equal(data.daemonUrl, mockDaemon.url);
  });

  await t.test("Suite 2: Antigravity 2.0 Obsidian Theme & Contrast Audit", () => {
    const html = renderSidecarHtml(mockDaemon.url);

    // Verify Obsidian Palette CSS custom properties
    assert.ok(html.includes("--bg-base: #121212"), "Theme base background must be matte dark #121212");
    assert.ok(html.includes("--bg-surface: #181818"), "Theme surface background must be #181818");
    assert.ok(html.includes("--bg-card: #1e1e1e"), "Theme card background must be #1e1e1e");
    assert.ok(html.includes("--bg-elevated: #262626"), "Theme modal/elevated surface must be #262626");
    assert.ok(html.includes("--border-subtle: #2d2d2d"), "Hairline borders must be #2d2d2d");
    assert.ok(html.includes("--border-focus: #444444"), "Focus hairline borders must be #444444");
    assert.ok(html.includes("#0d0d0d"), "Terminal pane canvas must use deep terminal background #0d0d0d");

    // Verify Typography fonts
    assert.ok(html.includes("'Inter'"), "Primary UI typography must be Inter");
    assert.ok(html.includes("'JetBrains Mono'"), "Terminal & hash typography must be JetBrains Mono");
  });

  await t.test("Suite 3: Tab 2 Topology Enhancements & Modal Interaction", () => {
    const html = renderSidecarHtml(mockDaemon.url);

    // Verify Modal Structure & Controls
    assert.ok(html.includes('id="capture-modal"'), "Capture modal overlay must be present in HTML");
    assert.ok(html.includes('id="capture-lines-select"'), "Line count selector must be present");
    assert.ok(html.includes('id="capture-autorefresh"'), "Auto-refresh toggle must be present");
    assert.ok(html.includes('id="capture-terminal-content"'), "Terminal content block must be present");

    // Verify Fleet Telemetry Bar
    assert.ok(html.includes('id="fleet-telemetry-bar"'), "Fleet telemetry bar must be present in Tab 2");
    assert.ok(html.includes('id="telem-active-seats"'), "Active seats metric present");
    assert.ok(html.includes('id="telem-burn-rate"'), "Burn rate metric present");
    assert.ok(html.includes('id="telem-top-seat"'), "Top consuming seat present");

    // Verify Screen Action Button in Topology Seat Item
    assert.ok(html.includes("openCaptureModal"), "Seat card must bind openCaptureModal action");
    assert.ok(html.includes("ICONS.monitor + 'Screen"), "Screen button label present via inline SVG icon");
    assert.ok(html.includes("stripAnsi"), "ANSI stripper function must be present to remove raw escape sequences");
  });

  await t.test("Suite 4: Convenience Capture Proxy (/api/capture)", async () => {
    // GET /api/capture?session=...&lines=... should bridge to daemon POST /api/transport/capture
    const res = await fetch(`${sidecar.url}/api/capture?session=core-builder@sidecar-dev&lines=30`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.sessionName, "core-builder@sidecar-dev");
    assert.equal(data.lines, 30);
    assert.ok(data.content.includes("Build complete"));
  });

  await t.test("Suite 5: API Proxying & Header Forwarding (/api/*)", async () => {
    // GET /api/rigs
    const resRigs = await fetch(`${sidecar.url}/api/rigs`);
    assert.equal(resRigs.status, 200);
    const rigs = await resRigs.json();
    assert.equal(rigs[0].name, "sidecar-dev");

    // GET /api/telemetry/usage/cost
    const resCost = await fetch(`${sidecar.url}/api/telemetry/usage/cost`);
    assert.equal(resCost.status, 200);
    const cost = await resCost.json();
    assert.equal(cost.totalCostFormatted, "$0.42");

    // OPTIONS preflight request
    const resOptions = await fetch(`${sidecar.url}/api/rigs`, { method: "OPTIONS" });
    assert.equal(resOptions.status, 204);
    assert.equal(resOptions.headers.get("access-control-allow-origin"), "*");
    assert.ok(resOptions.headers.get("access-control-allow-methods").includes("GET"));
  });

  await t.test("Suite 6: API Resilience & Error Handling (Daemon Offline)", async () => {
    // Spawn sidecar pointing to an unreachable port
    const offlineSidecar = await startSidecarServer({
      port: 0,
      host: "127.0.0.1",
      daemonUrl: "http://127.0.0.1:59999",
    });

    try {
      const res = await fetch(`${offlineSidecar.url}/api/rigs`);
      assert.equal(res.status, 502, "Should return 502 Bad Gateway when daemon is unreachable");
      assert.equal(res.headers.get("content-type"), "application/json");

      const err = await res.json();
      assert.equal(err.error, "daemon_unreachable");
      assert.ok(err.message.includes("ECONNREFUSED") || err.message.length > 0);
    } finally {
      await new Promise((cb) => offlineSidecar.server.close(cb));
    }
  });
});
