import test from "node:test";
import assert from "node:assert/strict";
import { renderSidecarHtml } from "../dist/html.js";

// Pictographic / dingbat ranges plus the directional glyphs that carry emoji
// presentation (U+21A9, U+2197). Arrow punctuation such as U+2190/U+2192 is
// intentionally excluded: it stays legible in every monospace UI font.
const EMOJI_PATTERN = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{21A9}\u{2197}]/u;

test("Zero-Emoji Fleet UI Compliance", async (t) => {
  const html = renderSidecarHtml("http://127.0.0.1:7433");

  await t.test("Rendered page contains no Unicode emoji glyphs", () => {
    assert.doesNotMatch(
      html,
      EMOJI_PATTERN,
      "UI must use inline SVG icons, never Unicode emoji glyphs"
    );
  });

  await t.test("Tab 1 Approvals actions use inline SVG icons", () => {
    for (const icon of ["paperclip", "doc", "check", "bolt", "cross", "reply"]) {
      assert.ok(html.includes(`ICONS.${icon}`), `Approvals must use ICONS.${icon}`);
    }
  });

  await t.test("Tab 2 Topology actions use inline SVG icons", () => {
    for (const icon of ["link", "external", "monitor", "mail", "arrowLeft", "arrowRight"]) {
      assert.ok(html.includes(`ICONS.${icon}`), `Topology must use ICONS.${icon}`);
    }
  });

  await t.test("No emoji literals survive in the client script source", () => {
    const scriptStart = html.indexOf("<script>");
    const scriptEnd = html.lastIndexOf("</script>");
    assert.ok(scriptStart !== -1 && scriptEnd > scriptStart, "inline client script present");
    assert.doesNotMatch(
      html.slice(scriptStart, scriptEnd),
      EMOJI_PATTERN,
      "client script must not carry legacy emoji labels"
    );
  });
});
