import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { renderSidecarHtml } from "../dist/html.js";

test("SDCR.0.6.01: Android Phone & Mobile Viewport Compatibility Suite", async (t) => {
  const html = renderSidecarHtml("http://127.0.0.1:7433");

  await t.test("1. Responsive Header & Thumb-Friendly Tab Bar (<= 768px and <= 480px)", () => {
    // 768px media query presence
    assert.ok(html.includes("@media (max-width: 768px)"), "CSS must contain @media (max-width: 768px) breakpoint");

    // Header two-tier flex layout
    assert.ok(
      /@media \(max-width:\s*768px\)[\s\S]*?header\s*\{[\s\S]*?height:\s*auto;/.test(html),
      "Header must expand vertically (height: auto) on <= 768px"
    );
    assert.ok(
      /@media \(max-width:\s*768px\)[\s\S]*?\.brand\s*\{[\s\S]*?order:\s*1;/.test(html),
      ".brand must have order: 1 in mobile header"
    );
    assert.ok(
      /@media \(max-width:\s*768px\)[\s\S]*?\.header-actions\s*\{[\s\S]*?order:\s*2;/.test(html),
      ".header-actions must have order: 2 in mobile header"
    );
    assert.ok(
      /@media \(max-width:\s*768px\)[\s\S]*?\.nav-tabs\s*\{[\s\S]*?order:\s*3;/.test(html),
      ".nav-tabs must take order: 3 spanning bottom row"
    );
    assert.ok(
      /@media \(max-width:\s*768px\)[\s\S]*?\.nav-tabs\s*\{[\s\S]*?width:\s*100%;/.test(html),
      ".nav-tabs must span 100% width on <= 768px"
    );
    assert.ok(
      /@media \(max-width:\s*768px\)[\s\S]*?\.tab-btn\s*\{[\s\S]*?min-height:\s*40px;/.test(html),
      ".tab-btn must have min-height: 40px for comfortable thumb tapping"
    );

    // 640px and 480px rules
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.brand-sub\s*\{[\s\S]*?display:\s*none;/.test(html),
      ".brand-sub subtitle must hide on screens <= 640px"
    );
    assert.ok(
      /@media \(max-width:\s*480px\)[\s\S]*?#daemon-label\s*\{[\s\S]*?display:\s*none;/.test(html),
      "#daemon-label URL text must hide on <= 480px while preserving status dot & refresh button"
    );
  });

  await t.test("2. Zero Horizontal Overflow on Card Grids, Pod Grids & Telemetry Bar (320px-430px)", () => {
    // 640px grid collapse to single column
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.card-grid[\s\S]*?grid-template-columns:\s*1fr/.test(html),
      ".card-grid must collapse to single column (1fr) on mobile viewports"
    );
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.pod-grid[\s\S]*?grid-template-columns:\s*1fr/.test(html),
      ".pod-grid must collapse to single column (1fr) on mobile viewports"
    );

    // Telemetry bar 2x2 layout
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.telemetry-bar\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/.test(html),
      ".telemetry-bar must arrange into a compact 2x2 grid on mobile viewports"
    );

    // Main and rig container padding tightening
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?main\s*\{[\s\S]*?padding:\s*12px 10px;/.test(html),
      "main container padding must tighten on mobile (12px 10px)"
    );
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.rig-container\s*\{[\s\S]*?padding:\s*12px;/.test(html),
      ".rig-container padding must tighten on mobile (12px)"
    );
  });

  await t.test("3. Wrapping Filter & Search Toolbars Across All 3 Tabs", () => {
    // Filter controls group class exists and wraps
    assert.ok(html.includes(".filter-controls-group"), "CSS must define .filter-controls-group container");
    assert.ok(
      /\.filter-controls-group\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-wrap:\s*wrap;/.test(html),
      ".filter-controls-group must enable wrapping for responsive toolbars"
    );

    // Markup across Tabs 1, 2, and 3 uses .filter-controls-group
    const approvalsToolbar = html.match(/id="tab-approvals"[\s\S]*?id="approvals-list"/);
    assert.ok(approvalsToolbar && approvalsToolbar[0].includes('class="filter-controls-group"'), "Tab 1 must use .filter-controls-group");

    const topologyToolbar = html.match(/id="tab-topology"[\s\S]*?id="topology-graph-container"/);
    assert.ok(topologyToolbar && topologyToolbar[0].includes('class="filter-controls-group"'), "Tab 2 must use .filter-controls-group");

    const deliverablesToolbar = html.match(/id="tab-deliverables"[\s\S]*?id="deliverables-list"/);
    assert.ok(deliverablesToolbar && deliverablesToolbar[0].includes('class="filter-controls-group"'), "Tab 3 must use .filter-controls-group");

    // Search input takes full width below 640px
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.search-input-wrapper\s*\{[\s\S]*?width:\s*100%;/.test(html),
      ".search-input-wrapper must expand to 100% width on mobile viewports"
    );

    // Filter pills scroll horizontally without overflow
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.filter-pills\s*\{[\s\S]*?overflow-x:\s*auto;/.test(html),
      ".filter-pills must enable horizontal scrolling without page clipping on mobile viewports"
    );
  });

  await t.test("4. Touch-Ergonomic Action Buttons & Card Footers", () => {
    // .card-actions wraps multi-button actions
    assert.ok(
      /\.card-actions\s*\{[\s\S]*?flex-wrap:\s*wrap;/.test(html),
      ".card-actions must wrap buttons by default"
    );
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.card-actions\s*\{[\s\S]*?flex-wrap:\s*wrap/.test(html),
      ".card-actions must enforce flex-wrap on <= 640px"
    );

    // Touch targets >= 36px and -webkit-tap-highlight-color: transparent
    assert.ok(
      /@media\s*\(max-width:\s*640px\),\s*\(pointer:\s*coarse\)[\s\S]*?\.btn[\s\S]*?min-height:\s*36px;/.test(html),
      "Buttons must enforce minimum touch height of at least 36px on mobile/coarse pointers"
    );
    assert.ok(
      /@media\s*\(max-width:\s*640px\),\s*\(pointer:\s*coarse\)[\s\S]*?-webkit-tap-highlight-color:\s*transparent;/.test(html),
      "Buttons must suppress gray tap flash with -webkit-tap-highlight-color: transparent"
    );
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.card-actions \.btn\s*\{[\s\S]*?min-height:\s*38px;/.test(html),
      "Card action buttons must have min-height: 38px on mobile"
    );
  });

  await t.test("5. Mobile Topology Graph Touch Pan, Pinch-Zoom & Mobile Auto-Fit", () => {
    // Lower zoom floor (0.30 instead of 0.45)
    assert.ok(
      /Math\.max\(0\.30,\s*Math\.min\(1\.85/.test(html),
      "adjustGraphZoom must permit lower zoom floor down to 0.30 for wide multi-pod rigs"
    );
    assert.ok(
      /Math\.max\(0\.30,\s*Math\.min\(1\.35/.test(html),
      "fitGraphZoom must permit zoom floor down to 0.30"
    );

    // Touch pan and pinch-zoom handlers registered on #topology-graph-viewport
    assert.ok(html.includes("vp.addEventListener('touchstart'"), "initGraphViewportPanZoom must register touchstart");
    assert.ok(html.includes("vp.addEventListener('touchmove'"), "initGraphViewportPanZoom must register touchmove");
    assert.ok(html.includes("vp.addEventListener('touchend'"), "initGraphViewportPanZoom must register touchend");
    assert.ok(html.includes("initialPinchDist"), "Touch handlers must calculate pinch distance for pinch-to-zoom");

    // Auto-fit on initial render when viewport width < 768px
    assert.ok(
      html.includes("initialGraphFitApplied") && html.includes("fitGraphZoom()"),
      "Graph render must execute fitGraphZoom on initial mobile load when width < 768px"
    );

    // Mobile resize listener
    assert.ok(
      html.includes("window.addEventListener('resize'") && html.includes("fitGraphZoom"),
      "Window resize listener must re-fit graph on mobile orientation changes"
    );
  });

  await t.test("6. Dynamic Viewport Modals (100dvh) & Mobile Input Sizing", () => {
    // Modal 100dvh constraint with 88vh fallback
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.modal[\s\S]*?max-height:\s*calc\(100dvh - 20px\)/.test(html),
      "Modals must constrain max-height to calc(100dvh - 20px) on mobile viewports"
    );
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.modal[\s\S]*?max-height:\s*calc\(88vh\)/.test(html),
      "Modals must include 88vh fallback before 100dvh"
    );
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.modal-body\s*\{[\s\S]*?overflow-y:\s*auto;/.test(html),
      "Modal body must be scrollable on mobile"
    );

    // 16px font-size to prevent unwanted mobile browser auto-zoom
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.form-input[\s\S]*?font-size:\s*16px !important;/.test(html),
      "Form inputs must set font-size: 16px on <= 640px to prevent mobile browser auto-zoom"
    );
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.form-textarea[\s\S]*?font-size:\s*16px !important;/.test(html),
      "Textareas must set font-size: 16px on <= 640px"
    );
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?\.form-select[\s\S]*?font-size:\s*16px !important;/.test(html),
      "Selects must set font-size: 16px on <= 640px"
    );

    // Toast positioning on mobile
    assert.ok(
      /@media \(max-width:\s*640px\)[\s\S]*?#toast\s*\{[\s\S]*?left:\s*12px;[\s\S]*?right:\s*12px;[\s\S]*?bottom:\s*12px;/.test(html),
      "#toast must anchor across full width (left: 12px; right: 12px; bottom: 12px) on mobile"
    );
  });

  await t.test("7. Client JavaScript Syntax & Execution Verification", () => {
    // Extract script tag and verify syntax via Node VM
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, "HTML must contain inline <script> block");
    assert.doesNotThrow(() => {
      new vm.Script(scriptMatch[1]);
    }, "Client JavaScript inside renderSidecarHtml must parse with zero syntax errors");
  });
});
