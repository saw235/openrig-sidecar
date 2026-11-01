import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { renderSidecarHtml } from '../dist/html.js';

describe('SDCR.0.7.01: Deliverable Sunset, Quick Complete & Drop Controls Test Suite', () => {
  const html = renderSidecarHtml('http://localhost:7433');

  test('1. Antigravity 2.0 Obsidian Styling: Badges & Dropped Card Styles', () => {
    // Purple badge for Sunset / Dropped state
    assert.match(html, /\.badge-purple\s*\{[^}]*color:\s*#bb86fc/i);
    // Counter badge in filter pill
    assert.match(html, /\.pill-badge\s*\{/i);
    // Subtle opacity and purple border for dropped cards
    assert.match(html, /\.card-dropped\s*\{[^}]*border-color:\s*rgba\(187,\s*134,\s*252/i);
  });

  test('2. Tab 3 Filter Pills: Sunset / Dropped Pill with Count Badge', () => {
    assert.match(html, /id="pill-deliverables-dropped"/);
    assert.match(html, /data-filter="dropped"/);
    assert.match(html, /id="dropped-proofs-count">0<\/span>/);
    assert.match(html, /onclick="setDeliverablesVerdictFilter\('dropped',\s*this\)"/);
  });

  test('3. Card Actions: 1-Click Quick Complete and Sunset / Drop Actions', () => {
    // Card should have Quick Complete button for active proof contracts
    assert.match(html, /quickCompleteProof/);
    assert.match(html, /Quick Complete/);
    // Card should have Sunset / Drop button
    assert.match(html, /dropDeliverable/);
    assert.match(html, /Sunset \/ Drop/);
    // Dropped card should have Restore button
    assert.match(html, /restoreDeliverable/);
    assert.match(html, /Restore/);
  });

  test('4. Deliverable Detail Modal: Quick Complete, Sunset/Drop, and Restore Integration', () => {
    // Check detail-actions-left handles both active and dropped states
    assert.match(html, /Restore Deliverable/);
    assert.match(html, /Quick Complete/);
    assert.match(html, /Sunset \/ Drop/);
  });

  test('5. Full Client-Side Script Execution & Functional Unit Testing via VM', async () => {
    // Extract client-side script from rendered HTML
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, 'Client-side script tag must exist');
    const scriptContent = scriptMatch[1];

    // Mock DOM and browser environment
    const mockStorage = new Map();
    const fetchedCalls = [];

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
      'toast': { classList: { add() {}, remove() {} }, textContent: '', style: {} },
      'refresh-btn': { addEventListener() {} },
      'confirm-proof-accept-btn': { addEventListener() {} }
    };

    const sandbox = {
      window: {
        addEventListener() {}
      },
      document: {
        getElementById(id) {
          if (!mockElements[id]) {
            mockElements[id] = { innerHTML: '', textContent: '', value: '', classList: { add() {}, remove() {} }, addEventListener() {}, style: {} };
          }
          if (!mockElements[id].addEventListener) {
            mockElements[id].addEventListener = () => {};
          }
          if (!mockElements[id].classList) {
            mockElements[id].classList = { add() {}, remove() {} };
          }
          if (!mockElements[id].style) {
            mockElements[id].style = {};
          }
          return mockElements[id];
        },
        querySelectorAll() { return []; },
        documentElement: { clientWidth: 1024 }
      },
      localStorage: {
        getItem(key) {
          return mockStorage.get(key) || null;
        },
        setItem(key, val) {
          mockStorage.set(key, String(val));
        },
        removeItem(key) {
          mockStorage.delete(key);
        }
      },
      fetch: async (url, options) => {
        fetchedCalls.push({ url, options });
        return {
          ok: true,
          json: async () => ({ ok: true, status: 'mocked' })
        };
      },
      setTimeout() {},
      setInterval() {},
      console: {
        log() {},
        warn() {},
        error() {}
      },
      navigator: {
        clipboard: {
          writeText() {}
        }
      }
    };

    const context = vm.createContext(sandbox);

    // Ensure entire embedded script compiles and executes without throwing
    assert.doesNotThrow(() => {
      const script = new vm.Script(scriptContent);
      script.runInContext(context);
    }, 'Client script must compile cleanly in VM');

    // Test getDeliverableKey helper
    assert.equal(sandbox.getDeliverableKey({ scope: 'rig1', id: '123' }), 'rig1#123');
    assert.equal(sandbox.getDeliverableKey({ text: 'sample item' }), 'default#sample item');

    // Test localStorage persistence helpers
    assert.equal(sandbox.isDeliverableDropped({ scope: 'rig1', id: '123' }), false);
    sandbox.setDeliverableDropped('rig1#123', true);
    assert.equal(sandbox.isDeliverableDropped({ scope: 'rig1', id: '123' }), true);
    assert.deepEqual(Array.from(sandbox.getDroppedDeliverables()), ['rig1#123']);

    sandbox.setDeliverableDropped('rig1#123', false);
    assert.equal(sandbox.isDeliverableDropped({ scope: 'rig1', id: '123' }), false);
    assert.deepEqual(Array.from(sandbox.getDroppedDeliverables()), []);

    // Test 1-click Quick Complete dispatches accept verdict
    await sandbox.quickCompleteProof('rig-core', 'item-42', 'rev-abc', 'prev-123');
    const quickCompleteCall = fetchedCalls.find(c => c.url === '/api/proof/judge');
    assert.ok(quickCompleteCall, 'quickCompleteProof must invoke /api/proof/judge');
    const qcPayload = JSON.parse(quickCompleteCall.options.body);
    assert.equal(qcPayload.scope, 'rig-core');
    assert.equal(qcPayload.item, 'item-42');
    assert.equal(qcPayload.verdict, 'accept');
    assert.equal(qcPayload.expectedRevision, 'rev-abc');
    assert.equal(qcPayload.expectedPrevious, 'prev-123');

    // Test background withdrawProof dispatches withdraw verdict
    fetchedCalls.length = 0;
    await sandbox.withdrawProof('rig-core', 'item-42', 'rev-abc', 'prev-123');
    const withdrawCall = fetchedCalls.find(c => c.url === '/api/proof/judge');
    assert.ok(withdrawCall, 'withdrawProof must invoke /api/proof/judge');
    const wPayload = JSON.parse(withdrawCall.options.body);
    assert.equal(wPayload.scope, 'rig-core');
    assert.equal(wPayload.item, 'item-42');
    assert.equal(wPayload.verdict, 'withdraw');
    assert.equal(wPayload.reason, 'Sunset / dropped by operator via Sidecar');

    // Test dropDeliverable and restoreDeliverable on cachedDeliverables
    vm.runInContext(`cachedDeliverables = [
      { id: 'item-1', scope: 'rig-a', text: 'Active deliverable 1' },
      { id: 'item-2', scope: 'rig-b', text: 'Deliverable to be dropped' }
    ];`, context);

    // Drop item-2
    await vm.runInContext(`dropDeliverable(1);`, context);
    assert.equal(vm.runInContext(`isDeliverableDropped(cachedDeliverables[1]);`, context), true);
    assert.equal(mockElements['dropped-proofs-count'].textContent, 1);

    // Active view (verdict 'all') should filter out dropped item-2
    vm.runInContext(`deliverablesVerdictFilter = 'all'; renderDeliverables();`, context);
    assert.equal(mockElements['proofs-count'].textContent, 1);
    assert.match(mockElements['deliverables-list'].innerHTML, /Active deliverable 1/);
    assert.doesNotMatch(mockElements['deliverables-list'].innerHTML, /Deliverable to be dropped/);

    // Dropped view (verdict 'dropped') should show only dropped item-2 with Restore button
    vm.runInContext(`deliverablesVerdictFilter = 'dropped'; renderDeliverables();`, context);
    assert.equal(mockElements['proofs-count'].textContent, 1);
    assert.match(mockElements['deliverables-list'].innerHTML, /Deliverable to be dropped/);
    const droppedStageHtml = mockElements['deliverables-stage-inspector'].innerHTML;
    assert.match(droppedStageHtml, /Sunset \/ Dropped/);
    assert.match(droppedStageHtml, /restoreDeliverable\(1\)/);

    // Restore item-2
    vm.runInContext(`restoreDeliverable(1);`, context);
    assert.equal(vm.runInContext(`isDeliverableDropped(cachedDeliverables[1]);`, context), false);
    assert.equal(mockElements['dropped-proofs-count'].textContent, 0);

    // Modal detail view test
    vm.runInContext(`openDeliverableDetail(0);`, context);
    assert.match(mockElements['detail-actions-left'].innerHTML, /Quick Complete/);
    assert.match(mockElements['detail-actions-left'].innerHTML, /Sunset \/ Drop/);

    vm.runInContext(`dropDeliverable(0); openDeliverableDetail(0);`, context);
    assert.match(mockElements['detail-actions-left'].innerHTML, /Restore Deliverable/);
    assert.equal(mockElements['detail-badge'].textContent, 'Sunset / Dropped');
  });
});
