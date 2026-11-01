import test from "node:test";
import assert from "node:assert/strict";
import { renderSidecarHtml } from "../dist/html.js";

test("SDCR.0.6.04: Deliverables render one full-width card per row", () => {
  const html = renderSidecarHtml("http://127.0.0.1:7433");

  assert.match(
    html,
    /<div id="deliverables-list" class="card-grid">/,
    "Deliverables list must keep the card-grid container"
  );

  const rule = html.match(/#deliverables-list\.card-grid\s*\{([^}]*)\}/);
  assert.ok(rule, "#deliverables-list.card-grid rule must exist");

  const declarations = rule[1];
  assert.match(
    declarations,
    /grid-template-columns:\s*minmax\(0,\s*1fr\);/,
    "Deliverables must use exactly one column on every viewport"
  );
  assert.match(declarations, /gap:\s*16px;/, "Deliverables keep the 16px row gap");

  // The id+class selector must outrank the generic .card-grid auto-fill rule.
  assert.doesNotMatch(
    declarations,
    /repeat\(|auto-fill|auto-fit/,
    "Deliverables must never fall back to a multi-column track template"
  );
});
