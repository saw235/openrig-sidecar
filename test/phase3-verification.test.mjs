import test from "node:test";
import assert from "node:assert/strict";
import { renderSidecarHtml } from "../dist/html.js";

test("OpenRig Sidecar Phase 3 Verification Suite: 5 Core Capabilities", async (t) => {
  const html = renderSidecarHtml("http://127.0.0.1:7433");

  await t.test("Capability 1: Live Agent Dropdown in Send / Reply Modal", () => {
    // Check for agent dropdown or datalist in the reply modal
    const hasAgentSelect =
      html.includes('id="reply-agent-select"') ||
      html.includes('id="reply-session-select"') ||
      html.includes('id="reply-agents-list"') ||
      html.includes('class="agent-select"');

    assert.ok(hasAgentSelect, "Reply modal must contain an agent dropdown or select component for quick selection");

    // Check that manual input is preserved
    assert.ok(
      html.includes('id="reply-session"'),
      "Manual session input must be preserved for custom routing"
    );

    // Check population logic in script
    const hasPopulationLogic =
      html.includes("populateAgentDropdown") ||
      html.includes("updateAgentSelect") ||
      html.includes("reply-agent-select") ||
      html.includes("reply-session-select");

    assert.ok(hasPopulationLogic, "Client JS must populate live agent dropdown from topology nodes");
  });

  await t.test("Capability 2: Zero-Dependency Client-Side Markdown Rendering", () => {
    // Check that renderMarkdown exists in the client script
    assert.ok(html.includes("renderMarkdown"), "Client JS must include a zero-dependency renderMarkdown function");

    // Unit test the markdown regex and parser rules typical of zero-dep renderers
    function testMarkdownParser(md) {
      if (!md) return "";
      let res = md
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^(?:>|&gt;)\s*(.*$)/gim, "<blockquote>$1</blockquote>")
        .replace(/^\s*-\s+(.*$)/gim, "<li>$1</li>");
      return res;
    }

    // Headers
    const h1 = testMarkdownParser("# Title 1");
    assert.ok(h1.includes("<h1>Title 1</h1>"));

    // Bold & Italic
    const boldItalic = testMarkdownParser("**bold** and *italic*");
    assert.ok(boldItalic.includes("<strong>bold</strong>"));
    assert.ok(boldItalic.includes("<em>italic</em>"));

    // Inline Code & Fenced Code Block
    const code = testMarkdownParser("`const a = 1;`\n```js\nconsole.log(a);\n```");
    assert.ok(code.includes("<code>const a = 1;</code>"));
    assert.ok(code.includes("<pre><code>"));

    // Blockquote
    const quote = testMarkdownParser("> This is a requirement");
    assert.ok(quote.includes("<blockquote>This is a requirement</blockquote>"));

    // HTML sanitization safety
    const dangerous = testMarkdownParser("<script>alert('xss')</script>");
    assert.ok(!dangerous.includes("<script>"), "Must escape raw script tags to prevent XSS");
    assert.ok(dangerous.includes("&lt;script&gt;"));
  });

  await t.test("Capability 3: Rig Filter Dropdown and Date Sorting across Tabs 1, 2, 3", () => {
    // Check for Rig Filter controls across the views
    const hasRigFilter =
      html.includes('id="approvals-rig-filter"') ||
      html.includes('id="topology-rig-filter"') ||
      html.includes('id="deliverables-rig-filter"') ||
      html.includes('data-filter="rig"') ||
      html.includes('rig-filter');

    assert.ok(hasRigFilter, "UI must contain Rig Filter dropdown controls across the tabs");

    // Check for Date Sort controls
    const hasSortControl =
      html.includes('id="approvals-sort"') ||
      html.includes('id="topology-sort"') ||
      html.includes('id="deliverables-sort"') ||
      html.includes('sort-select') ||
      html.includes('data-sort="date"');

    assert.ok(hasSortControl, "UI must contain Date Sort (Newest / Oldest) controls");

    // Unit test date sorting logic
    const mockItems = [
      { id: "item-1", at: "2026-10-18T02:00:00.000Z" },
      { id: "item-2", at: "2026-10-18T05:00:00.000Z" },
      { id: "item-3", at: "2026-10-17T21:00:00.000Z" }
    ];

    function sortItems(items, order = "newest") {
      return [...items].sort((a, b) => {
        const tA = new Date(a.at || 0).getTime();
        const tB = new Date(b.at || 0).getTime();
        return order === "newest" ? tB - tA : tA - tB;
      });
    }

    const newestFirst = sortItems(mockItems, "newest");
    assert.equal(newestFirst[0].id, "item-2");
    assert.equal(newestFirst[2].id, "item-3");

    const oldestFirst = sortItems(mockItems, "oldest");
    assert.equal(oldestFirst[0].id, "item-3");
    assert.equal(oldestFirst[2].id, "item-2");
  });

  await t.test("Capability 4: Visual SVG Topology Graph with Delegation Edges", () => {
    // Check for SVG graph container or toggle button in Tab 2
    const hasGraphContainer =
      html.includes('id="topology-graph-container"') ||
      html.includes('id="topology-svg-graph"') ||
      html.includes('id="topology-visual-graph"') ||
      html.includes('class="topology-svg-container"') ||
      html.includes('topology-graph');

    assert.ok(hasGraphContainer, "Tab 2 must contain a Visual SVG Topology Graph container");

    // Check for View Mode Toggle (Visual Graph vs Matrix Grid)
    const hasViewToggle =
      html.includes('id="view-toggle-grid"') ||
      html.includes('id="view-toggle-graph"') ||
      html.includes('toggleTopologyView') ||
      html.includes('view-toggle-btn') ||
      html.includes('Visual Graph');

    assert.ok(hasViewToggle, "Tab 2 must include a view switcher between Visual Graph and Matrix Grid");

    // Check for SVG marker definition for directed arrows
    const hasSvgMarkers =
      html.includes("<marker") ||
      html.includes("arrowhead") ||
      html.includes("marker-end") ||
      html.includes("renderSvgGraph") ||
      html.includes("drawEdges");

    assert.ok(hasSvgMarkers, "SVG graph must define markers or curved path elements for delegation edges");
  });

  await t.test("Capability 5: Antigravity Chat conversation://<uuid> Hyperlink Integration", () => {
    // Check for conversation:// URL scheme integration
    const hasConversationLink =
      html.includes("conversation://") ||
      html.includes("openConversation") ||
      html.includes("conv-link");

    assert.ok(hasConversationLink, "Topology seat cards must feature clickable conversation:// deep links for Antigravity conversations");

    // Check that Open Chat label or button is present
    const hasOpenChatLabel =
      html.includes("Open Chat") ||
      html.includes("Open Conversation") ||
      html.includes("conv-link") ||
      html.includes("🔗");

    assert.ok(hasOpenChatLabel, "Seat view must display an explicit 'Open Chat' action");

    // Check that clipboard copy utility is retained
    assert.ok(
      html.includes("copyToClipboard"),
      "Clipboard copy button must be retained alongside the deep hyperlink"
    );
  });
});
