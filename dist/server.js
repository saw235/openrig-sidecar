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
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".svg",
]);
const IMAGE_EXTENSIONS = new Set([
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".svg",
]);
const MAX_EVIDENCE_BYTES = 256 * 1024;
function getMimeType(ext) {
    switch (ext.toLowerCase()) {
        case ".png": return "image/png";
        case ".jpg":
        case ".jpeg": return "image/jpeg";
        case ".webp": return "image/webp";
        case ".gif": return "image/gif";
        case ".svg": return "image/svg+xml";
        case ".json": return "application/json; charset=utf-8";
        case ".yaml":
        case ".yml": return "text/yaml; charset=utf-8";
        case ".md":
        case ".markdown":
        case ".txt":
        case ".log":
        default:
            return "text/plain; charset=utf-8";
    }
}
function resolveEvidenceFile(rawParam, roots) {
    const trimmed = (rawParam || "").trim();
    if (!trimmed) {
        return { error: "invalid_evidence_path", status: 400, details: { message: "Evidence path cannot be empty." } };
    }
    const cleaned = trimmed.startsWith("file://")
        ? decodeURIComponent(trimmed.slice("file://".length))
        : trimmed;
    let candidatePath = null;
    if (path.isAbsolute(cleaned)) {
        candidatePath = cleaned;
    }
    else {
        // Relative path: search roots for existing matching file
        for (const root of roots) {
            const testPath = path.resolve(root, cleaned);
            if (fs.existsSync(testPath)) {
                candidatePath = testPath;
                break;
            }
        }
    }
    if (!candidatePath) {
        return {
            error: "invalid_evidence_path",
            status: 400,
            details: { message: "Evidence path must be absolute or resolve to an existing artifact within an allowed root." },
        };
    }
    const ext = path.extname(candidatePath).toLowerCase();
    if (!ALLOWED_EVIDENCE_EXTENSIONS.has(ext)) {
        return { error: "unsupported_evidence_extension", status: 403, details: { ext } };
    }
    let realPath;
    try {
        realPath = fs.realpathSync(candidatePath);
    }
    catch {
        return { error: "evidence_not_found", status: 404, details: { path: cleaned } };
    }
    const withinAllowedRoot = roots.some((root) => realPath === root || realPath.startsWith(root + path.sep));
    if (!withinAllowedRoot) {
        return { error: "evidence_outside_allowed_roots", status: 403 };
    }
    try {
        const stat = fs.statSync(realPath);
        if (!stat.isFile()) {
            return { error: "evidence_not_a_file", status: 400 };
        }
    }
    catch (err) {
        return {
            error: "evidence_stat_failed",
            status: 500,
            details: { message: err instanceof Error ? err.message : String(err) },
        };
    }
    return { realPath, ext };
}
export function startSidecarServer(opts) {
    const port = opts?.port ?? (process.env.OPENRIG_SIDECAR_PORT ? Number(process.env.OPENRIG_SIDECAR_PORT) : 7434);
    const host = opts?.host ?? "127.0.0.1";
    const daemonUrl = (opts?.daemonUrl ?? process.env.OPENRIG_URL ?? "http://127.0.0.1:7433").replace(/\/$/, "");
    const home = os.homedir();
    const allowedEvidenceRoots = (opts?.allowedEvidenceRoots ?? [
        path.join(home, "antigravity"),
        path.join(home, ".openrig", "workspace"),
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
            const rawParam = url.searchParams.get("path") || "";
            const resolved = resolveEvidenceFile(rawParam, allowedEvidenceRoots);
            if ("error" in resolved) {
                res.writeHead(resolved.status, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: resolved.error, ...resolved.details }));
                return;
            }
            const { realPath, ext } = resolved;
            const isImage = IMAGE_EXTENSIONS.has(ext);
            try {
                const buf = fs.readFileSync(realPath);
                const truncated = buf.byteLength > MAX_EVIDENCE_BYTES;
                const content = isImage
                    ? null
                    : (truncated
                        ? buf.subarray(0, MAX_EVIDENCE_BYTES).toString("utf8") + "\n\n*(Evidence truncated at 256 KB)*"
                        : buf.toString("utf8"));
                res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                res.end(JSON.stringify({
                    ok: true,
                    path: realPath,
                    basename: path.basename(realPath),
                    kind: isImage ? "image" : "text",
                    ext,
                    byteLength: buf.byteLength,
                    rawUrl: `/api/evidence/raw?path=${encodeURIComponent(realPath)}`,
                    truncated: isImage ? false : truncated,
                    content,
                }));
            }
            catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: "evidence_read_failed", message: err instanceof Error ? err.message : String(err) }));
            }
            return;
        }
        // Binary / raw evidence artifact streaming endpoint (images, markdown, documents)
        if (url.pathname === "/api/evidence/raw" && req.method === "GET") {
            const rawParam = url.searchParams.get("path") || "";
            const resolved = resolveEvidenceFile(rawParam, allowedEvidenceRoots);
            if ("error" in resolved) {
                res.writeHead(resolved.status, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: resolved.error, ...resolved.details }));
                return;
            }
            const { realPath, ext } = resolved;
            try {
                const stat = fs.statSync(realPath);
                const mime = getMimeType(ext);
                res.writeHead(200, {
                    "Content-Type": mime,
                    "Content-Length": stat.size,
                    "Cache-Control": "public, max-age=3600",
                    "Access-Control-Allow-Origin": "*",
                });
                const stream = fs.createReadStream(realPath);
                stream.pipe(res);
            }
            catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: "evidence_stream_failed", message: err instanceof Error ? err.message : String(err) }));
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
        const bindHost = (host === "0.0.0.0" || host === "::") ? "::" : host;
        function tryListen(targetHost, fallbackToIpv4) {
            const errorHandler = (err) => {
                if (fallbackToIpv4 && (err.code === "EAFNOSUPPORT" || err.code === "EADDRNOTAVAIL")) {
                    server.removeListener("error", errorHandler);
                    tryListen("0.0.0.0", false);
                }
                else {
                    reject(err);
                }
            };
            server.once("error", errorHandler);
            server.listen(port, targetHost, () => {
                server.removeListener("error", errorHandler);
                server.on("error", (err) => console.error("Sidecar runtime server error:", err));
                const addr = server.address();
                const actualPort = typeof addr === "object" && addr ? addr.port : port;
                const formattedHost = targetHost === "::"
                    ? "localhost"
                    : (targetHost.includes(":") ? `[${targetHost}]` : targetHost);
                const sidecarUrl = `http://${formattedHost}:${actualPort}`;
                resolve({ server, url: sidecarUrl, port: actualPort });
            });
        }
        tryListen(bindHost, bindHost === "::");
    });
}
