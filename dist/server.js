import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderSidecarHtml } from "./html.js";
let cachedDagreBundle = null;
function getDagreBundle() {
    if (cachedDagreBundle)
        return cachedDagreBundle;
    const bundledVendorPath = fileURLToPath(new URL("./vendor/dagre.min.js", import.meta.url));
    if (fs.existsSync(bundledVendorPath)) {
        cachedDagreBundle = fs.readFileSync(bundledVendorPath);
        return cachedDagreBundle;
    }
    const req = createRequire(import.meta.url);
    const resolved = req.resolve("dagre/dist/dagre.min.js");
    cachedDagreBundle = fs.readFileSync(resolved);
    return cachedDagreBundle;
}
const ALLOWED_EVIDENCE_EXTENSIONS = new Set([
    ".md",
    ".markdown",
    ".txt",
    ".json",
    ".yaml",
    ".yml",
    ".log",
]);
const MAX_EVIDENCE_BYTES = 256 * 1024;
export function startSidecarServer(opts) {
    const port = opts?.port ?? (process.env.OPENRIG_SIDECAR_PORT ? Number(process.env.OPENRIG_SIDECAR_PORT) : 7434);
    const host = opts?.host ?? "127.0.0.1";
    const daemonUrl = (opts?.daemonUrl ?? process.env.OPENRIG_URL ?? "http://127.0.0.1:7433").replace(/\/$/, "");
    const home = os.homedir();
    const allowedEvidenceRoots = (opts?.allowedEvidenceRoots ?? [
        path.join(home, "antigravity"),
        path.join(home, ".openrig"),
    ]).map((r) => {
        try {
            return fs.realpathSync(r);
        }
        catch {
            return path.resolve(r);
        }
    });
    const server = http.createServer(async (req, res) => {
        const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
        // CORS headers for all requests
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-OpenRig-Session");
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }
        // Health check endpoint
        if (url.pathname === "/healthz") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", sidecar: true, daemonUrl, version: "0.1.0" }));
            return;
        }
        // Vendored open-source Dagre hierarchical graph layout engine
        if (url.pathname === "/vendor/dagre.min.js" && req.method === "GET") {
            try {
                const bundle = getDagreBundle();
                res.writeHead(200, {
                    "Content-Type": "application/javascript; charset=utf-8",
                    "Cache-Control": "public, max-age=86400",
                    "Content-Length": bundle.byteLength,
                });
                res.end(bundle);
            }
            catch (err) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("Failed to load vendored dagre bundle");
            }
            return;
        }
        // Read-only local evidence artifact viewer (scoped to workspace & OpenRig roots)
        if (url.pathname === "/api/evidence" && req.method === "GET") {
            const rawParam = (url.searchParams.get("path") || "").trim();
            const cleaned = rawParam.startsWith("file://")
                ? decodeURIComponent(rawParam.slice("file://".length))
                : rawParam;
            if (!cleaned || !path.isAbsolute(cleaned)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: "invalid_evidence_path", message: "Evidence path must be absolute." }));
                return;
            }
            const ext = path.extname(cleaned).toLowerCase();
            if (!ALLOWED_EVIDENCE_EXTENSIONS.has(ext)) {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: "unsupported_evidence_extension", ext }));
                return;
            }
            let realPath;
            try {
                realPath = fs.realpathSync(cleaned);
            }
            catch {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: "evidence_not_found", path: cleaned }));
                return;
            }
            const withinAllowedRoot = allowedEvidenceRoots.some((root) => realPath === root || realPath.startsWith(root + path.sep));
            if (!withinAllowedRoot) {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: "evidence_outside_allowed_roots" }));
                return;
            }
            try {
                const stat = fs.statSync(realPath);
                if (!stat.isFile()) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ ok: false, error: "evidence_not_a_file" }));
                    return;
                }
                const buf = fs.readFileSync(realPath);
                const truncated = buf.byteLength > MAX_EVIDENCE_BYTES;
                const content = truncated
                    ? buf.subarray(0, MAX_EVIDENCE_BYTES).toString("utf8") + "\n\n*(Evidence truncated at 256 KB)*"
                    : buf.toString("utf8");
                res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                res.end(JSON.stringify({ ok: true, path: realPath, basename: path.basename(realPath), truncated, content }));
            }
            catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: "evidence_read_failed", message: err instanceof Error ? err.message : String(err) }));
            }
            return;
        }
        // Convenience alias: GET /api/capture?session=...&lines=...
        if (url.pathname === "/api/capture" && req.method === "GET") {
            const session = url.searchParams.get("session") || "";
            const lines = Number(url.searchParams.get("lines")) || 50;
            const targetUrl = new URL("/api/transport/capture", daemonUrl);
            const postBody = JSON.stringify({ session, lines });
            const proxyHeaders = {
                ...req.headers,
                host: targetUrl.host,
                "content-type": "application/json",
                "content-length": Buffer.byteLength(postBody),
            };
            delete proxyHeaders.origin;
            delete proxyHeaders.referer;
            if (opts?.bearerToken && !proxyHeaders["authorization"]) {
                proxyHeaders["authorization"] = `Bearer ${opts.bearerToken}`;
            }
            const proxyReq = http.request(targetUrl, {
                method: "POST",
                headers: proxyHeaders,
            }, (proxyRes) => {
                res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
                proxyRes.pipe(res);
            });
            proxyReq.on("error", (err) => {
                res.writeHead(502, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "daemon_unreachable", message: err.message, daemonUrl }));
            });
            proxyReq.end(postBody);
            return;
        }
        // Proxy /api/* to OpenRig daemon
        if (url.pathname.startsWith("/api/")) {
            const targetPath = url.pathname === "/api/capture" ? "/api/transport/capture" : url.pathname;
            const targetUrl = new URL(targetPath + url.search, daemonUrl);
            const proxyHeaders = { ...req.headers, host: targetUrl.host };
            delete proxyHeaders.origin;
            delete proxyHeaders.referer;
            if (opts?.bearerToken && !proxyHeaders["authorization"]) {
                proxyHeaders["authorization"] = `Bearer ${opts.bearerToken}`;
            }
            const proxyReq = http.request(targetUrl, {
                method: req.method,
                headers: proxyHeaders,
            }, (proxyRes) => {
                res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
                proxyRes.pipe(res);
            });
            proxyReq.on("error", (err) => {
                res.writeHead(502, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "daemon_unreachable", message: err.message, daemonUrl }));
            });
            req.pipe(proxyReq);
            return;
        }
        // Serve Single Page Application
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(renderSidecarHtml(daemonUrl));
    });
    return new Promise((resolve, reject) => {
        server.listen(port, host, () => {
            const addr = server.address();
            const actualPort = typeof addr === "object" && addr ? addr.port : port;
            const sidecarUrl = `http://${host}:${actualPort}`;
            resolve({ server, url: sidecarUrl, port: actualPort });
        });
        server.on("error", reject);
    });
}
