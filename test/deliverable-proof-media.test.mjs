import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { startSidecarServer } from '../dist/server.js';
import { renderSidecarHtml } from '../dist/html.js';

describe('SDCR.0.6.02: Markdown, Inline Images & Delivered Proofs Test Suite', () => {
  const html = renderSidecarHtml('http://localhost:7433');

  test('1. Lightbox Component & CSS Styles in HTML Output', () => {
    // Lightbox modal markup
    assert.match(html, /id="image-lightbox-modal"/);
    assert.match(html, /id="lightbox-image"/);
    assert.match(html, /id="lightbox-title"/);
    assert.match(html, /class="lightbox-img"/);

    // CSS proof media styles
    assert.match(html, /\.md-image-container\s*\{/);
    assert.match(html, /\.md-proof-image\s*\{/);
    assert.match(html, /\.evidence-image-grid\s*\{/);
    assert.match(html, /\.evidence-image-card\s*\{/);
    assert.match(html, /\.evidence-thumb-img\s*\{/);
    assert.match(html, /\.evidence-doc-preview\s*\{/);
  });

  test('2. Client-Side Markdown Parser: Inline Image and Local Path Rewriting', () => {
    // Extract script
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, 'Client-side script tag must exist');
    const scriptContent = scriptMatch[1];

    const sandbox = {
      window: { addEventListener() {} },
      document: {
        getElementById() { return { innerHTML: '', textContent: '', value: '', classList: { add() {}, remove() {} }, style: {}, addEventListener() {} }; },
        querySelectorAll() { return []; },
        documentElement: { clientWidth: 1024 }
      },
      localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
      fetch: async () => ({ ok: true, json: async () => ({ ok: true }) }),
      setTimeout() {},
      setInterval() {},
      console: { log() {}, warn() {}, error() {} }
    };
    const context = vm.createContext(sandbox);
    const script = new vm.Script(scriptContent);
    script.runInContext(context);

    // 1. Basic Image markdown with relative path
    const renderedRel = sandbox.renderMarkdown('![QA Smoke Check](qa/evidence/smoke_check.png)');
    assert.match(renderedRel, /<div class="md-image-container">/);
    assert.match(renderedRel, /<img class="md-proof-image"/);
    assert.match(renderedRel, /src="\/api\/evidence\/raw\?path=qa%2Fevidence%2Fsmoke_check\.png"/);
    assert.match(renderedRel, /alt="QA Smoke Check"/);
    assert.match(renderedRel, /<div class="md-image-caption">QA Smoke Check<\/div>/);

    // 2. Absolute / file:// path
    const renderedFile = sandbox.renderMarkdown('![Test Screenshot](file:///home/xsaw/evidence/test.jpg)');
    assert.match(renderedFile, /src="\/api\/evidence\/raw\?path=%2Fhome%2Fxsaw%2Fevidence%2Ftest\.jpg"/);

    // 3. External HTTP URL untouched
    const renderedExt = sandbox.renderMarkdown('![Diagram](https://example.com/assets/diagram.svg)');
    assert.match(renderedExt, /src="https:\/\/example\.com\/assets\/diagram\.svg"/);

    // 4. Image parsed before standard links
    const mixed = sandbox.renderMarkdown('Check ![Diagram](proof/diag.png) and link [Docs](https://docs.openrig.dev)');
    assert.match(mixed, /<img class="md-proof-image"/);
    assert.match(mixed, /<a class="md-link" href="https:\/\/docs\.openrig\.dev"/);
  });

  test('3. Backend Evidence Streaming (/api/evidence/raw) & Relative Path Resolution', async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'openrig-sidecar-evidence-test-'));
    const proofDir = path.join(tmpRoot, 'proof');
    fs.mkdirSync(proofDir, { recursive: true });

    // 1x1 valid transparent PNG buffer
    const pngBuffer = Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2d420000000049454e44ae426082',
      'hex'
    );
    const pngPath = path.join(proofDir, 'visual_proof.png');
    fs.writeFileSync(pngPath, pngBuffer);

    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>';
    const svgPath = path.join(proofDir, 'diagram.svg');
    fs.writeFileSync(svgPath, svgContent, 'utf8');

    const mdContent = '# Verification Summary\n- 49/49 tests pass.\n- UI screenshot verified.';
    const mdPath = path.join(proofDir, 'evidence.md');
    fs.writeFileSync(mdPath, mdContent, 'utf8');

    const disallowedFile = path.join(proofDir, 'secret.env');
    fs.writeFileSync(disallowedFile, 'KEY=secret', 'utf8');

    const sidecar = await startSidecarServer({
      port: 0,
      host: '127.0.0.1',
      daemonUrl: 'http://127.0.0.1:59999',
      allowedEvidenceRoots: [tmpRoot]
    });

    try {
      // Test A: Binary PNG streaming
      const pngRes = await fetch(`${sidecar.url}/api/evidence/raw?path=${encodeURIComponent(pngPath)}`);
      assert.equal(pngRes.status, 200);
      assert.equal(pngRes.headers.get('content-type'), 'image/png');
      assert.equal(pngRes.headers.get('cache-control'), 'public, max-age=3600');
      const pngData = Buffer.from(await pngRes.arrayBuffer());
      assert.equal(pngData.compare(pngBuffer), 0);

      // Test B: SVG streaming
      const svgRes = await fetch(`${sidecar.url}/api/evidence/raw?path=${encodeURIComponent(svgPath)}`);
      assert.equal(svgRes.status, 200);
      assert.equal(svgRes.headers.get('content-type'), 'image/svg+xml');
      const svgBody = await svgRes.text();
      assert.ok(svgBody.includes('<circle'));

      // Test C: Relative path resolution against allowedEvidenceRoots
      const relMdRes = await fetch(`${sidecar.url}/api/evidence/raw?path=proof/evidence.md`);
      assert.equal(relMdRes.status, 200);
      assert.equal(relMdRes.headers.get('content-type'), 'text/plain; charset=utf-8');
      const relMdBody = await relMdRes.text();
      assert.ok(relMdBody.includes('# Verification Summary'));

      // Test D: JSON endpoint (/api/evidence) with kind: 'image' and kind: 'text'
      const jsonImgRes = await fetch(`${sidecar.url}/api/evidence?path=proof/visual_proof.png`);
      assert.equal(jsonImgRes.status, 200);
      const jsonImgData = await jsonImgRes.json();
      assert.equal(jsonImgData.ok, true);
      assert.equal(jsonImgData.kind, 'image');
      assert.equal(jsonImgData.basename, 'visual_proof.png');
      assert.ok(jsonImgData.rawUrl.includes('/api/evidence/raw?path='));

      const jsonTextRes = await fetch(`${sidecar.url}/api/evidence?path=proof/evidence.md`);
      assert.equal(jsonTextRes.status, 200);
      const jsonTextData = await jsonTextRes.json();
      assert.equal(jsonTextData.ok, true);
      assert.equal(jsonTextData.kind, 'text');
      assert.ok(jsonTextData.content.includes('# Verification Summary'));

      // Test E: Security - Disallowed extension -> 403
      const envRes = await fetch(`${sidecar.url}/api/evidence/raw?path=${encodeURIComponent(disallowedFile)}`);
      assert.equal(envRes.status, 403);

      // Test F: Security - Relative non-existent file -> 400
      const missingRes = await fetch(`${sidecar.url}/api/evidence/raw?path=proof/nonexistent.png`);
      assert.equal(missingRes.status, 400);
    } finally {
      await new Promise((cb) => sidecar.server.close(cb));
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  test('4. WSL2 IPv6/IPv4 Dual-Stack Server Binding & URL Formatting', async () => {
    // When host is '::', server binds to IPv6 dual-stack with proper URL formatting
    const sidecar = await startSidecarServer({
      port: 0,
      host: '::',
      daemonUrl: 'http://127.0.0.1:59999'
    });

    try {
      assert.ok(sidecar.url.startsWith('http://localhost:'));
      assert.ok(sidecar.port > 0);

      // Request over loopback
      const res = await fetch(`http://127.0.0.1:${sidecar.port}/healthz`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.status, 'ok');
    } finally {
      await new Promise((cb) => sidecar.server.close(cb));
    }
  });

  test('5. Deliverable Cards & Detail Modal Evidence Rendering via Client VM', async () => {
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    const scriptContent = scriptMatch[1];

    const mockElements = {
      'proofs-count': { textContent: '' },
      'dropped-proofs-count': { textContent: '' },
      'deliverables-list': { innerHTML: '' },
      'deliverables-search': { value: '' },
      'deliverables-rig-filter': { value: 'all' },
      'deliverables-sort': { value: 'newest' },
      'detail-badge': { className: '', textContent: '' },
      'detail-title': { textContent: '' },
      'detail-subtitle': { textContent: '' },
      'detail-item-text': { innerHTML: '' },
      'detail-scope-id': { textContent: '' },
      'detail-revision': { textContent: '' },
      'detail-judgment': { innerHTML: '', textContent: '' },
      'detail-evidence': { innerHTML: '', textContent: '' },
      'detail-contract-state': { textContent: '' },
      'detail-actions-left': { innerHTML: '' },
      'detail-doc-previews': { innerHTML: '' },
      'lightbox-image': { src: '', alt: '' },
      'lightbox-title': { textContent: '' },
      'image-lightbox-modal': { classList: { add() {}, remove() {} } },
      'toast': { classList: { add() {}, remove() {} }, textContent: '', style: {} },
      'refresh-btn': { addEventListener() {} },
      'confirm-proof-accept-btn': { addEventListener() {} }
    };

    const sandbox = {
      window: { addEventListener() {} },
      document: {
        getElementById(id) {
          if (!mockElements[id]) {
            mockElements[id] = { innerHTML: '', textContent: '', value: '', classList: { add() {}, remove() {} }, style: {}, addEventListener() {} };
          }
          return mockElements[id];
        },
        querySelectorAll() { return []; },
        documentElement: { clientWidth: 1024 }
      },
      localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
      fetch: async (url) => {
        if (url.includes('/api/evidence?path=')) {
          return {
            ok: true,
            json: async () => ({ ok: true, basename: 'evidence.md', content: '# Verified Test Output\nAll suites passing.' })
          };
        }
        return { ok: true, json: async () => ({ ok: true }) };
      },
      setTimeout() {},
      setInterval() {},
      console: { log() {}, warn() {}, error() {} }
    };

    const context = vm.createContext(sandbox);
    const script = new vm.Script(scriptContent);
    script.runInContext(context);

    // Test openImageLightbox
    sandbox.openImageLightbox('/api/evidence/raw?path=test.png', 'Test Screenshot');
    assert.equal(mockElements['lightbox-image'].src, '/api/evidence/raw?path=test.png');
    assert.equal(mockElements['lightbox-title'].textContent, 'Test Screenshot');

    // Test deliverable with image and document evidence
    vm.runInContext(`cachedDeliverables = [
      {
        id: 'item-100',
        scope: 'rig-sidecar',
        text: 'Visual Regression & Media Streaming',
        evidence: [
          'production/qa/evidence/smoke_check.png',
          'proof/evidence.md'
        ]
      }
    ];
    deliverablesVerdictFilter = 'all';
    renderDeliverables();`, context);

    const listHtml = mockElements['deliverables-list'].innerHTML;
    // Check image card rendered
    assert.match(listHtml, /class="evidence-image-card"/);
    assert.match(listHtml, /class="evidence-thumb-img"/);
    assert.match(listHtml, /smoke_check\.png/);

    // Check document preview trigger button
    assert.match(listHtml, /toggleInlineEvidenceDoc\(0/);
    assert.match(listHtml, /evidence\.md \(preview\)/);

    // Test toggleInlineEvidenceDoc fetches and renders markdown
    await vm.runInContext(`toggleInlineEvidenceDoc(0, 'proof/evidence.md');`, context);
    const inlineContainer = mockElements['inline-evidence-doc-0'];
    assert.ok(inlineContainer, 'inline-evidence-doc-0 must exist');
    assert.match(inlineContainer.innerHTML, /Verified Test Output/);

    // Test openDeliverableDetail renders full-width image preview and triggers doc load
    vm.runInContext(`
      cachedDeliverables = [
        {
          id: 'item-100',
          scope: 'rig-sidecar',
          text: 'Visual Regression & Media Streaming',
          evidence: [
            'production/qa/evidence/smoke_check.png',
            'proof/evidence.md'
          ]
        }
      ];
      openDeliverableDetail(0);
    `, context);
    const detailEvHtml = mockElements['detail-evidence'].innerHTML;
    assert.match(detailEvHtml, /class="md-proof-image"/);
    assert.match(detailEvHtml, /smoke_check\.png/);
    assert.match(detailEvHtml, /id="detail-doc-previews"/);
  });
});
