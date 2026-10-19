#!/usr/bin/env node
import { startSidecarServer } from "./server.js";
function parseArgs() {
    const args = process.argv.slice(2);
    const opts = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--port" || arg === "-p") {
            opts.port = Number(args[++i]);
        }
        else if (arg === "--daemon" || arg === "-d") {
            opts.daemonUrl = args[++i];
        }
        else if (arg === "--host" || arg === "-h") {
            opts.host = args[++i];
        }
        else if (arg === "--help") {
            console.log(`
OpenRig Sidecar - Antigravity Studio Control Plane

Usage:
  openrig-sidecar [options]

Options:
  -p, --port <port>       Port to listen on (default: 7434 or OPENRIG_SIDECAR_PORT)
  -d, --daemon <url>      OpenRig daemon URL (default: http://127.0.0.1:7433 or OPENRIG_URL)
  -h, --host <host>       Host to bind to (default: 127.0.0.1)
  --help                  Show this help message
`);
            process.exit(0);
        }
    }
    return opts;
}
const opts = parseArgs();
startSidecarServer(opts)
    .then(({ url }) => {
    console.log(`\x1b[32m✔\x1b[0m OpenRig Sidecar running at \x1b[1m\x1b[36m${url}\x1b[0m`);
    console.log(`  Proxying daemon requests to \x1b[90m${opts.daemonUrl ?? process.env.OPENRIG_URL ?? "http://127.0.0.1:7433"}\x1b[0m`);
    console.log(`  Press Ctrl+C to stop.`);
})
    .catch((err) => {
    console.error(`\x1b[31m✖\x1b[0m Failed to start OpenRig Sidecar:`, err);
    process.exit(1);
});
