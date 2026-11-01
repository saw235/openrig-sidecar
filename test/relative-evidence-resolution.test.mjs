import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { startSidecarServer } from "../dist/server.js";
import { renderSidecarHtml } from "../dist/html.js";

const EMOJI_PATTERN = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{21A9}\u{2197}]/u;

test("SDCR.0.6.05: Relative evidence resolution across rig cwds", async (t) => {
  const realHome = process.env.HOME;
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "sidecar-evidence-"));
  const dndCwd = path.join(home, "research", "openrig-dnd-world");
  const gameCwd = path.join(home, "projects", "game-studio");
  const dndFile = path.join(dndCwd, "canon", "beast-yard.md");
  const gameFile = path.join(gameCwd, "production", "build", "build-pipeline-assessment.md");
  const outsideFile = path.join(home, "outside.md");

  fs.mkdirSync(path.dirname(dndFile), { recursive: true });
  fs.mkdirSync(path.dirname(gameFile), { recursive: true });
  fs.writeFileSync(dndFile, "# Beast Yard\n\nResolved from the originating rig cwd.\n");
  fs.writeFileSync(gameFile, "# Build Pipeline\n\nAll gates green.\n");
  fs.writeFileSync(outsideFile, "# Outside\n\nShould never be served.\n");

  fs.mkdirSync(path.join(home, ".openrig"), { recursive: true });
  const db = new DatabaseSync(path.join(home, ".openrig", "openrig.sqlite"));
  db.exec(`
    CREATE TABLE rigs (id TEXT PRIMARY KEY, name TEXT NOT NULL, archived_at TEXT);
    CREATE TABLE nodes (id TEXT PRIMARY KEY, rig_id TEXT NOT NULL, logical_id TEXT NOT NULL, cwd TEXT);
    CREATE TABLE sessions (id TEXT PRIMARY KEY, node_id TEXT NOT NULL, session_name TEXT NOT NULL);
  `);
  const insertRig = db.prepare("INSERT INTO rigs (id, name, archived_at) VALUES (?, ?, ?)");
  insertRig.run("rig-dnd", "dnd-world", null);
  insertRig.run("rig-game", "game-studio", null);
  insertRig.run("rig-archived", "archived-rig", "2026-01-01T00:00:00Z");
  const insertNode = db.prepare("INSERT INTO nodes (id, rig_id, logical_id, cwd) VALUES (?, ?, ?, ?)");
  insertNode.run("node-dnd", "rig-dnd", "editorial-canon", dndCwd);
  insertNode.run("node-game", "rig-game", "ops-devops", gameCwd);
  insertNode.run("node-archived", "rig-archived", "ghost", path.join(home, "projects", "archived"));
  const insertSession = db.prepare("INSERT INTO sessions (id, node_id, session_name) VALUES (?, ?, ?)");
  insertSession.run("session-dnd", "node-dnd", "editorial-canon@dnd-world");
  db.close();

  process.env.HOME = home;
  const sidecar = await startSidecarServer({
    port: 0,
    host: "127.0.0.1",
    daemonUrl: "http://127.0.0.1:1",
  });

  t.after(async () => {
    await new Promise((resolve) => sidecar.server.close(resolve));
    process.env.HOME = realHome;
    fs.rmSync(home, { recursive: true, force: true });
  });

  await t.test("1. Session-scoped relative path resolves against the rig cwd", async () => {
    const res = await fetch(
      `${sidecar.url}/api/evidence?path=${encodeURIComponent("canon/beast-yard.md")}&session=${encodeURIComponent("editorial-canon@dnd-world")}`
    );
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.basename, "beast-yard.md");
    assert.equal(data.kind, "text");
    assert.equal(data.path, fs.realpathSync(dndFile));
    assert.match(data.content, /Resolved from the originating rig cwd/);
  });

  await t.test("2. Rig-scoped relative path resolves against the rig cwd", async () => {
    const res = await fetch(
      `${sidecar.url}/api/evidence?path=${encodeURIComponent("production/build/build-pipeline-assessment.md")}&rig=game-studio`
    );
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.basename, "build-pipeline-assessment.md");
    assert.equal(data.path, fs.realpathSync(gameFile));
  });

  await t.test("3. Relative path without session/rig falls back to active rig cwds", async () => {
    const res = await fetch(`${sidecar.url}/api/evidence?path=${encodeURIComponent("canon/beast-yard.md")}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.path, fs.realpathSync(dndFile));
  });

  await t.test("4. Relative raw streaming resolves and serves the artifact", async () => {
    const res = await fetch(
      `${sidecar.url}/api/evidence/raw?path=${encodeURIComponent("canon/beast-yard.md")}&session=${encodeURIComponent("editorial-canon@dnd-world")}`
    );
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/plain/);
    assert.match(await res.text(), /Beast Yard/);
  });

  await t.test("5. Relative traversal outside allowed roots is rejected", async () => {
    const res = await fetch(
      `${sidecar.url}/api/evidence?path=${encodeURIComponent("../../outside.md")}&session=${encodeURIComponent("editorial-canon@dnd-world")}`
    );
    assert.equal(res.status, 403);
    const data = await res.json();
    assert.equal(data.ok, false);
    assert.equal(data.error, "evidence_outside_allowed_roots");
  });

  await t.test("6. HTTP evidence renders Google Docs and external link actions", () => {
    const html = renderSidecarHtml("http://127.0.0.1:7433");
    assert.ok(html.includes("function isGoogleDocUrl"), "isGoogleDocUrl helper must exist");
    assert.ok(html.includes("Open in Google Docs"), "Google Docs action label must exist");
    assert.ok(html.includes("Open Link"), "generic external link label must exist");
    assert.ok(html.includes("Inspect Full Artifact"), "file evidence action label must exist");
    assert.ok(html.includes("approval-detail-open-external-btn"), "modal external action button must exist");
    assert.doesNotMatch(html, EMOJI_PATTERN, "evidence UI must stay emoji-free");
  });
});
