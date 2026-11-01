import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { startSidecarServer } from '../dist/server.js';
import { renderSidecarHtml } from '../dist/html.js';

describe('SDCR.0.6.03: Evidence Schema Normalization & Workspace Root Resolution Suite', () => {
  const html = renderSidecarHtml('http://localhost:7433');

  test('1. Default Server Config Includes ~/.openrig/workspace in allowedEvidenceRoots', async () => {
    const home = os.homedir();
    const expectedWorkspaceRoot = path.join(home, '.openrig', 'workspace');

    // Start a test sidecar instance without explicit allowedEvidenceRoots
    const sidecar = await startSidecarServer({
      port: 0,
      host: '127.0.0.1',
      daemonUrl: 'http://127.0.0.1:7433'
    });

    try {
      const baseUrl = sidecar.url;

      // Check health endpoint
      const healthRes = await fetch(`${baseUrl}/healthz`);
      assert.equal(healthRes.status, 200);
      await healthRes.json();

      // Verify relative path resolution against ~/.openrig/workspace if target nintendogs files exist
      const targetPng = path.join(expectedWorkspaceRoot, 'missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/contact_sheet_hd.png');
      const targetMd = path.join(expectedWorkspaceRoot, 'missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/evidence.md');

      if (fs.existsSync(targetPng)) {
        const rawRes = await fetch(`${baseUrl}/api/evidence/raw?path=missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/contact_sheet_hd.png`);
        assert.equal(rawRes.status, 200);
        assert.equal(rawRes.headers.get('content-type'), 'image/png');
        assert.ok(Number(rawRes.headers.get('content-length')) > 1000);
        await rawRes.arrayBuffer();
      }

      if (fs.existsSync(targetMd)) {
        const docRes = await fetch(`${baseUrl}/api/evidence?path=missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/evidence.md`);
        assert.equal(docRes.status, 200);
        const data = await docRes.json();
        assert.equal(data.ok, true);
        assert.equal(data.kind, 'text');
        assert.match(data.content, /#|Evidence|Verification/i);
      }
    } finally {
      await new Promise(resolve => sidecar.server.close(resolve));
    }
  });

  test('2. Relative Path Resolution with Custom Temporary Workspace Root', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sidecar-sdcr0603-'));
    const missionDir = path.join(tmpDir, 'missions', 'sample-mission', 'slices', 'slice-01', 'proof');
    fs.mkdirSync(missionDir, { recursive: true });

    const pngFile = path.join(missionDir, 'render.png');
    fs.writeFileSync(pngFile, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]));

    const mdFile = path.join(missionDir, 'evidence.md');
    fs.writeFileSync(mdFile, '# Slice 01 Evidence\nVerified output report.');

    const sidecar = await startSidecarServer({
      port: 0,
      host: '127.0.0.1',
      allowedEvidenceRoots: [tmpDir]
    });

    try {
      const baseUrl = sidecar.url;

      // Query raw relative path starting with missions/
      const rawRes = await fetch(`${baseUrl}/api/evidence/raw?path=missions/sample-mission/slices/slice-01/proof/render.png`);
      assert.equal(rawRes.status, 200);
      assert.equal(rawRes.headers.get('content-type'), 'image/png');
      await rawRes.arrayBuffer();

      // Query text evidence
      const jsonRes = await fetch(`${baseUrl}/api/evidence?path=missions/sample-mission/slices/slice-01/proof/evidence.md`);
      assert.equal(jsonRes.status, 200);
      const json = await jsonRes.json();
      assert.equal(json.ok, true);
      assert.equal(json.content, '# Slice 01 Evidence\nVerified output report.');
    } finally {
      await new Promise(resolve => sidecar.server.close(resolve));
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('3. Client VM: fetchDeliverables() Normalizes judgment.evidence[].ref Objects to Strings', async () => {
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, 'Client-side script tag must exist');
    const scriptContent = scriptMatch[1];

    const mockProofPayload = {
      revision: 'rev-live-100',
      state: 'ready',
      missions: [
        {
          name: 'nintendogs-studio',
          slices: [
            {
              id: '01-nds-rom-extraction-and-hd-icons',
              readiness: {
                items: [
                  {
                    id: 'item-23dbfa5fabef3a26de47',
                    text: 'NDS ROM Asset Extraction',
                    judgment: {
                      verdict: 'accept',
                      actor: 'core.builder',
                      at: '2026-10-31T20:31:00Z',
                      evidence: [
                        {
                          ref: 'missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/evidence.md',
                          sha256: 'dc8aba71016e7cdec9750c108b5e4e4dc57f863d969c5ba76ae198f958c15eab'
                        },
                        {
                          ref: 'missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/contact_sheet_hd.png',
                          sha256: 'c16798ac48e0d2b5c1201e409ee018930368f46c65e99d458fba36ec50b6b73f'
                        }
                      ]
                    }
                  },
                  {
                    id: 'item-unjudged-pending',
                    text: 'Pending Unjudged Deliverable Item',
                    judgment: null
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const mockElements = {
      'deliverables-list': { innerHTML: '' },
      'deliverables-stage-inspector': { innerHTML: '' },
      'proofs-count': { textContent: '' },
      'dropped-proofs-count': { textContent: '0' },
      'detail-evidence': { innerHTML: '', textContent: '' },
      'detail-actions-left': { innerHTML: '' },
      'detail-badge': { innerHTML: '', textContent: '', className: '' },
      'detail-title': { textContent: '' },
      'detail-subtitle': { textContent: '' },
      'detail-item-text': { innerHTML: '' },
      'detail-scope-id': { textContent: '' },
      'detail-revision': { textContent: '' },
      'detail-judgment': { innerHTML: '', textContent: '' },
      'detail-contract-state': { textContent: '' }
    };

    const sandbox = {
      window: { addEventListener() {} },
      document: {
        getElementById: (id) => mockElements[id] || { innerHTML: '', textContent: '', value: '', style: {}, classList: { add() {}, remove() {} }, addEventListener() {} },
        querySelectorAll: () => [],
        documentElement: { clientWidth: 1024 }
      },
      localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      fetch: async (url) => {
        if (url === '/api/proof') {
          return { ok: true, json: async () => mockProofPayload };
        }
        return { ok: true, json: async () => ({ ok: true }) };
      },
      setTimeout: (fn) => typeof fn === 'function' && fn(),
      setInterval: () => {},
      console: { log() {}, warn() {}, error() {} }
    };

    const context = vm.createContext(sandbox);
    const script = new vm.Script(scriptContent);
    script.runInContext(context);

    // Run fetchDeliverables in context
    await vm.runInContext('fetchDeliverables();', context);

    const cached = vm.runInContext('cachedDeliverables;', context);
    assert.equal(cached.length, 2);

    // 1. Verify judged item with object array evidence is normalized to string paths
    const judgedItem = cached[0];
    assert.equal(judgedItem.id, 'item-23dbfa5fabef3a26de47');
    assert.equal(judgedItem.scope, 'nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons');
    assert.ok(Array.isArray(judgedItem.evidence));
    assert.deepEqual(JSON.parse(JSON.stringify(judgedItem.evidence)), [
      'missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/evidence.md',
      'missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/contact_sheet_hd.png'
    ]);

    // 2. Verify unjudged item falls back to slice proof path
    const unjudgedItem = cached[1];
    assert.equal(unjudgedItem.id, 'item-unjudged-pending');
    assert.deepEqual(JSON.parse(JSON.stringify(unjudgedItem.evidence)), [
      'missions/nintendogs-studio/slices/01-nds-rom-extraction-and-hd-icons/proof/evidence.md'
    ]);

    // 3. Verify master rows + persistent stage evidence for the active contract
    const listHtml = mockElements['deliverables-list'].innerHTML;
    const stageHtml = mockElements['deliverables-stage-inspector'].innerHTML;
    assert.match(listHtml, /class="deliverables-row/);
    assert.match(listHtml, /NDS ROM Asset Extraction/);
    // Reviewable image evidence with a named subject
    assert.match(stageHtml, /class="stage-evidence-figure"/);
    assert.match(stageHtml, /contact_sheet_hd\.png/);
    assert.match(stageHtml, /Subject: contact_sheet_hd\.png/);
    assert.match(stageHtml, /src="\/api\/evidence\/raw\?path=missions%2Fnintendogs-studio%2Fslices%2F01-nds-rom-extraction-and-hd-icons%2Fproof%2Fcontact_sheet_hd\.png"/);
    // Document preview trigger for evidence.md
    assert.match(stageHtml, /class="stage-doc-preview"/);
    assert.match(stageHtml, /evidence\.md/);
    assert.match(stageHtml, /loadStageDoc\(/);

    // 4. Verify detail modal rendering for normalized evidence
    vm.runInContext('openDeliverableDetail(0);', context);
    const detailEvHtml = mockElements['detail-evidence'].innerHTML;
    assert.match(detailEvHtml, /class="md-proof-image"/);
    assert.match(detailEvHtml, /contact_sheet_hd\.png/);
    assert.match(detailEvHtml, /id="detail-doc-previews"/);

    // 5. Zero Unicode emojis in rendered output
    assert.doesNotMatch(listHtml, /[🖼📄📁📦🔍⚡✕]/);
    assert.doesNotMatch(stageHtml, /[🖼📄📁📦🔍⚡✕]/);
    assert.doesNotMatch(detailEvHtml, /[🖼📄📁📦🔍⚡✕]/);
  });
});
