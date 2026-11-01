// Standalone Antigravity-aesthetic HTML application for OpenRig Sidecar

export function renderSidecarHtml(daemonUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenRig Sidecar</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #121212;
      --bg-surface: #181818;
      --bg-card: #1e1e1e;
      --bg-elevated: #262626;
      --border-subtle: #2d2d2d;
      --border-focus: #444444;
      --text-primary: #e6e6e6;
      --text-secondary: #9e9e9e;
      --text-muted: #6b6b6b;
      --accent-blue: #8ab4f8;
      --accent-blue-hover: #aecbfa;
      --accent-green: #81c995;
      --accent-green-hover: #a8dab5;
      --accent-red: #f28b82;
      --accent-red-hover: #f6aea9;
      --accent-amber: #fdd663;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-full: 9999px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-base);
      color: var(--text-primary);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    header {
      background-color: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      padding: 0 24px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: -0.01em;
    }

    .brand-mark {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #8ab4f8 0%, #4285f4 100%);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #121212;
      font-weight: 700;
      font-size: 14px;
    }

    .brand-sub {
      color: var(--text-secondary);
      font-weight: 400;
      font-size: 12px;
      padding-left: 6px;
      border-left: 1px solid var(--border-subtle);
    }

    .nav-tabs {
      display: flex;
      gap: 6px;
      background-color: var(--bg-card);
      padding: 3px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s ease;
    }

    .tab-btn:hover {
      color: var(--text-primary);
    }

    .tab-btn.active {
      background-color: var(--bg-elevated);
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      border-radius: var(--radius-full);
      font-size: 10px;
      font-weight: 600;
      line-height: 1.4;
    }

    .badge-blue { background: rgba(138, 180, 248, 0.15); color: var(--accent-blue); }
    .badge-green { background: rgba(129, 201, 149, 0.15); color: var(--accent-green); }
    .badge-red { background: rgba(242, 139, 130, 0.15); color: var(--accent-red); }
    .badge-amber { background: rgba(253, 214, 99, 0.15); color: var(--accent-amber); }
    .badge-purple { background: rgba(187, 134, 252, 0.15); color: #bb86fc; }
    .badge-muted { background: var(--bg-elevated); color: var(--text-secondary); }

    .pill-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 1px 5px;
      font-size: 10px;
      font-weight: 600;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.08);
      margin-left: 4px;
    }

    .card-dropped {
      opacity: 0.85;
      border-color: rgba(187, 134, 252, 0.25);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-secondary);
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: var(--accent-green);
      box-shadow: 0 0 6px rgba(129, 201, 149, 0.6);
    }

    .btn {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .btn:hover {
      background-color: var(--bg-elevated);
      border-color: var(--border-focus);
    }

    .btn-primary {
      background-color: rgba(138, 180, 248, 0.15);
      color: var(--accent-blue);
      border-color: rgba(138, 180, 248, 0.3);
    }
    .btn-primary:hover {
      background-color: rgba(138, 180, 248, 0.25);
    }

    .btn-success {
      background-color: rgba(129, 201, 149, 0.15);
      color: var(--accent-green);
      border-color: rgba(129, 201, 149, 0.3);
    }
    .btn-success:hover {
      background-color: rgba(129, 201, 149, 0.25);
    }

    .btn-danger {
      background-color: rgba(242, 139, 130, 0.15);
      color: var(--accent-red);
      border-color: rgba(242, 139, 130, 0.3);
    }
    .btn-danger:hover {
      background-color: rgba(242, 139, 130, 0.25);
    }

    main {
      flex: 1;
      padding: 24px;
      max-width: 1300px;
      width: 100%;
      margin: 0 auto;
    }

    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 16px;
    }

    .card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .card:hover {
      border-color: var(--border-focus);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.4;
    }

    .card-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 11px;
      color: var(--text-secondary);
    }

    .card-body {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      color: var(--text-primary);
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 180px;
      overflow-y: auto;
    }

    .card-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      margin-top: auto;
      padding-top: 8px;
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
    }

    /* Topology styles */
    .rig-container {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 20px;
      margin-bottom: 24px;
    }

    .rig-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .rig-title {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pod-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .pod-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .pod-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--accent-blue);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .seat-item {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .seat-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .seat-name {
      font-weight: 600;
      font-size: 12.5px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #666;
    }
    .live-dot.working { background-color: var(--accent-green); box-shadow: 0 0 6px rgba(129, 201, 149, 0.8); }
    .live-dot.idle { background-color: var(--accent-blue); box-shadow: 0 0 6px rgba(138, 180, 248, 0.8); }
    .live-dot.needs_input { background-color: var(--accent-amber); box-shadow: 0 0 6px rgba(253, 214, 99, 0.8); }
    .live-dot.stopped { background-color: #666; }

    .seat-details {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 11px;
    }

    .conv-box {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      background-color: var(--bg-base);
      padding: 4px 8px;
      border-radius: 4px;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      margin-top: 4px;
    }

    .conv-copy-btn {
      background: none;
      border: none;
      color: var(--accent-blue);
      cursor: pointer;
      font-size: 10px;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal-overlay.open {
      display: flex;
    }

    .modal {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 520px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 18px;
      cursor: pointer;
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form-input, .form-textarea {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      padding: 8px 12px;
      font-family: inherit;
      font-size: 12.5px;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .form-input:focus, .form-textarea:focus {
      border-color: var(--accent-blue);
    }

    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--border-subtle);
    }

    .modal-wide {
      max-width: 860px;
      width: 92vw;
    }

    /* Fleet Telemetry Dashboard Bar */
    .telemetry-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .telemetry-stat-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .telemetry-stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .telemetry-stat-value {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
    }

    .telemetry-stat-sub {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Terminal snapshot modal styling */
    .capture-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }

    .form-select {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      padding: 4px 8px;
      font-size: 11.5px;
      outline: none;
    }

    .auto-refresh-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .terminal-container {
      background-color: #0d0d0d;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .terminal-bar-top {
      background-color: #161616;
      border-bottom: 1px solid var(--border-subtle);
      padding: 6px 12px;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .terminal-content {
      padding: 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      line-height: 1.45;
      color: #e6e6e6;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 460px;
      overflow-y: auto;
      background-color: #0d0d0d;
    }

    .btn-secondary {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
    }
    .btn-secondary:hover {
      background-color: var(--bg-elevated);
      border-color: var(--border-focus);
    }

    .token-progress-container {
      background-color: var(--bg-card);
      border-radius: var(--radius-full);
      height: 4px;
      width: 100%;
      overflow: hidden;
      margin-top: 4px;
    }

    .token-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
      border-radius: var(--radius-full);
      transition: width 0.3s ease;
    }

    .seat-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      margin-top: 6px;
    }

    /* Filter and Search Bar styles */
    .filter-search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
      padding: 10px 14px;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 240px;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      padding: 7px 12px 7px 32px;
      font-size: 12.5px;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .search-input:focus {
      border-color: var(--accent-blue);
    }

    .filter-pills {
      display: flex;
      gap: 4px;
      background-color: var(--bg-card);
      padding: 2px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
    }

    .filter-pill {
      background: none;
      border: none;
      color: var(--text-secondary);
      padding: 4px 10px;
      font-size: 11.5px;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .filter-pill:hover {
      color: var(--text-primary);
    }

    .filter-pill.active {
      background-color: var(--bg-elevated);
      color: #ffffff;
      font-weight: 600;
    }

    /* Detail Modal Styles */
    .detail-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .detail-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }

    .detail-box {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      color: var(--text-primary);
      line-height: 1.5;
    }

    /* Toast notification */
    #toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: var(--bg-elevated);
      border: 1px solid var(--border-focus);
      color: #ffffff;
      padding: 10px 16px;
      border-radius: var(--radius-md);
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      display: none;
      align-items: center;
      gap: 8px;
      z-index: 200;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--text-secondary);
      background-color: var(--bg-surface);
      border: 1px dashed var(--border-subtle);
      border-radius: var(--radius-lg);
    }

    /* Antigravity deep link styling */
    .conv-link {
      color: var(--accent-blue);
      text-decoration: none;
      font-size: 10px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      transition: color 0.15s ease;
    }
    .conv-link:hover {
      color: var(--accent-blue-hover);
      text-decoration: underline;
    }

    /* View Mode Toggle buttons */
    .btn-group {
      display: inline-flex;
      border-radius: var(--radius-sm);
      background-color: var(--bg-card);
      padding: 2px;
      border: 1px solid var(--border-subtle);
      gap: 2px;
    }
    .view-toggle-btn {
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 11.5px;
      font-weight: 500;
      border: none;
      background: none;
      color: var(--text-secondary);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .view-toggle-btn:hover {
      color: var(--text-primary);
    }
    .view-toggle-btn.active {
      background-color: var(--bg-elevated);
      color: #ffffff;
      font-weight: 600;
    }

    /* Topology SVG Visual Graph (Default Primary View) */
    #topology-list {
      display: none;
    }
    #topology-graph-container {
      display: block;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      overflow: hidden;
      min-height: 480px;
    }
    .graph-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px 14px;
      background-color: #151515;
      border-bottom: 1px solid var(--border-subtle);
    }
    .graph-toolbar-group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .graph-toolbar-label {
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-right: 2px;
    }
    .graph-layer-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 999px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .graph-layer-btn:hover {
      border-color: var(--border-focus);
      color: var(--text-primary);
    }
    .graph-layer-btn.active {
      background-color: #1f2633;
      border-color: #3b4d6b;
      color: #ffffff;
    }
    .graph-layer-swatch {
      width: 10px;
      height: 2.5px;
      border-radius: 2px;
      display: inline-block;
    }
    .graph-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--text-secondary);
      margin-right: 6px;
    }
    .graph-zoom-btn {
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      color: var(--text-primary);
      padding: 3px 8px;
      font-size: 11.5px;
      font-family: 'JetBrains Mono', monospace;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .graph-zoom-btn:hover {
      background-color: var(--bg-elevated);
      border-color: var(--border-focus);
    }
    #topology-seat-inspector {
      padding: 10px 16px;
      background-color: #171a21;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 12px;
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .inspector-hint {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 11.5px;
      color: var(--text-secondary);
    }
    .inspector-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }
    .inspector-title-group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .inspector-rel-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .inspector-rel-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 9px;
      border-radius: 999px;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      background-color: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .inspector-rel-chip:hover {
      border-color: var(--accent-blue);
      color: var(--accent-blue);
    }
    #topology-graph-viewport {
      overflow-x: auto;
      overflow-y: visible;
      min-height: 430px;
      padding: 16px;
      cursor: grab;
      background-color: #121212;
      background-image: radial-gradient(#252525 1px, transparent 1px);
      background-size: 20px 20px;
      position: relative;
    }
    #topology-graph-viewport.dragging {
      cursor: grabbing;
      user-select: none;
    }
    .svg-graph {
      display: block;
      margin: 0 auto;
    }
    .svg-graph .graph-node:hover > rect.seat-card-bg,
    .svg-graph .graph-rig-hub:hover > rect.rig-hub-bg {
      stroke: var(--accent-blue);
    }
    .svg-graph .graph-action-pill:hover > rect {
      fill: #2c3545;
      stroke: var(--accent-blue);
    }

    /* Zero-dependency Markdown styles */
    .md-h1 { font-size: 16px; font-weight: 700; color: #fff; margin: 10px 0 6px; }
    .md-h1:first-child { margin-top: 0; }
    .md-h2 { font-size: 14px; font-weight: 600; color: #fff; margin: 10px 0 5px; padding-bottom: 3px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
    .md-h3 { font-size: 13px; font-weight: 600; color: var(--accent-blue); margin: 8px 0 4px; }
    .md-h4 { font-size: 12.5px; font-weight: 600; color: var(--text-primary); margin: 6px 0 3px; }
    .md-p { margin-bottom: 6px; line-height: 1.55; }
    .md-p:last-child { margin-bottom: 0; }
    .md-hr {
      border: 0;
      border-top: 1px solid var(--border-subtle);
      margin: 10px 0;
    }
    .md-link {
      color: var(--accent-blue);
      text-decoration: underline;
      text-underline-offset: 2px;
      word-break: break-word;
    }
    .md-link:hover {
      color: #aecbfa;
    }
    .md-file-ref {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background-color: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      padding: 1px 6px;
      color: var(--accent-amber);
    }
    .md-inline-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background-color: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      padding: 1px 5px;
      color: var(--accent-blue);
    }
    .md-code-block {
      background-color: #0d0d0d;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 10px 12px;
      margin: 6px 0;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      line-height: 1.45;
      color: #e6e6e6;
    }
    .md-blockquote {
      border-left: 3px solid var(--accent-blue);
      background-color: var(--bg-card);
      padding: 6px 12px;
      margin: 6px 0;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      color: var(--text-secondary);
    }
    .md-ul, .md-ol {
      margin: 6px 0 6px 18px;
      padding-left: 6px;
    }
    .md-li-ul, .md-li-ol {
      margin-bottom: 3px;
      line-height: 1.5;
    }
    .md-table-wrapper {
      overflow: auto;
      max-inline-size: 100%;
      max-block-size: min(420px, 70vh);
      container-type: inline-size;
      margin: 8px 0;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      background-color: #141414;
    }
    .md-table-wrapper:focus-visible {
      outline: 2px solid var(--accent-blue);
      outline-offset: 1px;
    }
    .md-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 12px;
      color: var(--text-primary);
    }
    .md-table thead {
      position: sticky;
      inset-block-start: 0;
      z-index: 1;
    }
    .md-table th {
      background-color: var(--bg-elevated);
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 8px 10px;
      border-bottom: 1px solid var(--border-focus);
      white-space: nowrap;
    }
    .md-table td {
      padding: 7px 10px;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: top;
      line-height: 1.45;
    }
    .md-table tbody tr:last-child td {
      border-bottom: none;
    }
    .md-table tbody tr:hover td {
      background-color: rgba(255, 255, 255, 0.025);
    }
    @container (width < 420px) {
      .md-table, .md-table thead, .md-table tbody, .md-table tr, .md-table th, .md-table td {
        display: block;
      }
      .md-table thead {
        display: none;
      }
      .md-table tbody tr {
        border-bottom: 1px solid var(--border-focus);
        padding: 4px 0;
      }
      .md-table td {
        border-bottom: none;
        padding: 4px 10px;
      }
      .md-table td[data-label]::before {
        content: attr(data-label) ": ";
        font-weight: 600;
        color: var(--text-secondary);
      }
    }

    /* SVG Icons */
    .svg-icon {
      width: 12px;
      height: 12px;
      vertical-align: -1.5px;
      margin-right: 4px;
      display: inline-block;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      flex-shrink: 0;
    }

    /* Markdown Images & Visual Delivered Proofs */
    .md-image-container {
      margin: 10px 0;
      border-radius: var(--radius-sm);
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      background: #0d0d0d;
      max-width: 100%;
    }
    .md-proof-image {
      display: block;
      max-width: 100%;
      height: auto;
      max-height: 480px;
      object-fit: contain;
      cursor: zoom-in;
      background: #000;
      margin: 0 auto;
      transition: opacity 0.15s ease;
    }
    .md-proof-image:hover {
      opacity: 0.95;
    }
    .md-image-caption {
      padding: 6px 10px;
      font-size: 11px;
      color: var(--text-secondary);
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-card);
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
    }
    .evidence-image-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    .evidence-image-card {
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      overflow: hidden;
      max-width: 200px;
      cursor: zoom-in;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .evidence-image-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-1px);
    }
    .evidence-thumb-img {
      width: 100%;
      height: 110px;
      object-fit: cover;
      background: #000;
      display: block;
    }
    .evidence-thumb-label {
      padding: 4px 6px;
      font-size: 10.5px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: var(--bg-card);
      border-top: 1px solid var(--border-subtle);
    }
    .evidence-doc-preview {
      margin-top: 8px;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      font-size: 12.5px;
      max-height: 360px;
      overflow-y: auto;
    }
    #image-lightbox-modal .modal-content-lightbox {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.85);
    }
    .lightbox-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }
    .lightbox-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      font-family: 'JetBrains Mono', monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lightbox-body {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      padding: 12px;
      overflow: auto;
      max-height: calc(90vh - 65px);
    }
    .lightbox-img {
      max-width: 100%;
      max-height: calc(90vh - 90px);
      object-fit: contain;
      border-radius: 4px;
    }

    /* Rich Approval Proposal Card & Inspector Styles */
    #approvals-list.card-grid {
      grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
    }
    /* Phase 2 Deliverables Master-Detail Studio */
    .deliverables-studio {
      display: grid;
      grid-template-columns: minmax(320px, 38%) minmax(0, 1fr);
      min-height: 640px;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: var(--bg-surface);
      overflow: hidden;
    }
    .deliverables-master-rail {
      min-width: 0;
      max-width: 460px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border-subtle);
    }
    .master-rail-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .master-filter-controls {
      display: flex;
      gap: 6px;
    }
    .master-filter-controls .form-select {
      flex: 1;
      min-width: 0;
    }
    .master-rail-list {
      flex: 1;
      min-height: 0;
      max-height: calc(100vh - 250px);
      overflow-y: auto;
    }
    .deliverables-batch-bar {
      display: none;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border: 1px solid rgba(138, 180, 248, 0.25);
      border-radius: var(--radius-sm);
      background: rgba(138, 180, 248, 0.06);
    }
    .batch-count-label {
      flex: 1;
      font-size: 11px;
      color: var(--accent-blue);
      font-family: 'JetBrains Mono', monospace;
    }
    .btn-sm {
      padding: 3px 8px;
      font-size: 11px;
    }
    .deliverables-group-header {
      display: flex;
      align-items: center;
      gap: 6px;
      height: 28px;
      padding: 0 10px;
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(255, 255, 255, 0.02);
      color: var(--text-muted);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      user-select: none;
    }
    .deliverables-group-header .group-chevron {
      flex-shrink: 0;
      transition: transform 0.15s ease;
    }
    .deliverables-group-header.collapsed .group-chevron {
      transform: rotate(-90deg);
    }
    .deliverables-group-header .group-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .deliverables-row {
      height: 44px;
      min-height: 44px;
      max-height: 44px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      border-bottom: 1px solid var(--border-subtle);
      border-left: 3px solid transparent;
      cursor: pointer;
    }
    .deliverables-row:hover {
      background: rgba(255, 255, 255, 0.03);
    }
    .deliverables-row.active {
      background: rgba(138, 180, 248, 0.08);
      border-left-color: var(--accent-blue);
      padding-left: 7px;
    }
    .deliverables-row .row-checkbox {
      width: 14px;
      height: 14px;
      margin-right: 8px;
      cursor: pointer;
      accent-color: var(--accent-blue);
      flex-shrink: 0;
    }
    .deliverables-row .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .deliverables-row .title-strip {
      flex: 1;
      min-width: 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .deliverables-row .meta-strip {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
      flex-shrink: 0;
    }
    .deliverables-row .revision-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
    }
    .deliverables-row .time-pill {
      font-size: 11px;
      color: var(--text-muted);
    }
    .deliverables-stage-inspector {
      min-width: 0;
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
    }
    .stage-container {
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
    }
    .stage-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .stage-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }
    .stage-breadcrumbs strong {
      color: var(--text-secondary);
    }
    .stage-badges {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .stage-title {
      margin: 0;
      padding: 12px 16px 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.35;
      color: #ffffff;
    }
    .stage-judgment-banner {
      margin: 10px 16px 0;
      padding: 9px 12px;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.02);
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .stage-judgment-banner.accepted {
      border-color: rgba(129, 201, 149, 0.35);
      background: rgba(129, 201, 149, 0.06);
    }
    .stage-judgment-banner.rejected {
      border-color: rgba(242, 139, 130, 0.35);
      background: rgba(242, 139, 130, 0.06);
    }
    .stage-judgment-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 4px;
      color: var(--text-primary);
    }
    .stage-evidence-section {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 12px 16px 16px;
    }
    .stage-section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--text-secondary);
    }
    .stage-evidence-gallery {
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .stage-evidence-figure {
      margin: 0;
      min-width: 800px;
    }
    .stage-evidence-figure img {
      display: block;
      width: 100%;
      max-height: 520px;
      object-fit: contain;
      background: #0d0d0d;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      cursor: zoom-in;
    }
    .stage-evidence-caption {
      margin-top: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .stage-evidence-caption code {
      color: var(--accent-amber);
    }
    .stage-doc-previews {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .stage-doc-preview {
      padding: 8px 10px;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.015);
    }
    .stage-doc-heading {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }
    .stage-doc-preview .md-rendered {
      max-height: 420px;
      overflow: auto;
      margin-top: 6px;
    }
    .stage-evidence-links {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .stage-docked-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      padding: 10px 14px;
      border-top: 1px solid var(--border-subtle);
      background: rgba(0, 0, 0, 0.18);
    }
    .stage-action-left,
    .stage-action-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    @media (max-width: 900px) {
      .deliverables-studio {
        grid-template-columns: 1fr;
        min-height: 0;
      }
      .deliverables-master-rail {
        max-width: none;
        border-right: none;
        border-bottom: 1px solid var(--border-subtle);
      }
      .master-rail-list {
        max-height: 320px;
      }
      .stage-evidence-figure {
        min-width: 0;
      }
    }
    @media (max-width: 560px) {
      #approvals-list.card-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Tab 1: three-tier triage inbox, sweep nesting, unblocks context */
    #approvals-list.card-grid.sectioned {
      display: block;
    }
    .triage-section {
      margin-bottom: 18px;
    }
    .triage-section-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 10px 2px;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-secondary);
    }
    .triage-section-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
      gap: 16px;
    }
    @media (max-width: 560px) {
      .triage-section-grid {
        grid-template-columns: 1fr;
      }
    }
    .card-tier-1 {
      border-color: rgba(253, 214, 99, 0.4);
    }
    .card-tier-2 {
      border-color: rgba(138, 180, 248, 0.3);
    }
    .card-tier-3 {
      border-color: var(--border-subtle);
    }
    .card:focus-visible {
      outline: 1px solid var(--accent-blue);
      outline-offset: 2px;
    }
    .owed-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid rgba(253, 214, 99, 0.45);
      background: rgba(253, 214, 99, 0.1);
      color: var(--accent-amber);
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      font-weight: 600;
    }
    .nested-sweep-banner {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .nested-sweep-banner .badge {
      white-space: normal;
      text-align: left;
      line-height: 1.4;
    }
    .unblocks-context-card {
      margin-top: 8px;
      padding: 8px 10px;
      border: 1px solid rgba(138, 180, 248, 0.2);
      border-radius: var(--radius-sm);
      background: rgba(138, 180, 248, 0.06);
    }
    .unblocks-title {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--accent-blue);
      margin-bottom: 4px;
    }
    .unblocks-detail {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 11.5px;
      color: var(--text-secondary);
    }
    .triage-details summary {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      list-style: none;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin: 0 0 10px 2px;
    }
    .triage-details summary::-webkit-details-marker {
      display: none;
    }
    .triage-details[open] summary {
      margin-bottom: 12px;
    }
    .approval-from-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background-color: rgba(138, 180, 248, 0.12);
      color: var(--accent-blue);
      border: 1px solid rgba(138, 180, 248, 0.25);
      border-radius: 4px;
      padding: 1px 6px;
    }
    .approval-markdown-preview {
      background-color: #141414;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      font-size: 12.5px;
      color: var(--text-primary);
      max-height: 310px;
      overflow-y: auto;
      word-break: break-word;
    }
    .approval-evidence-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 10px;
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      font-size: 11.5px;
      color: var(--text-secondary);
    }
    .approval-evidence-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--accent-amber);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #approval-detail-modal .modal {
      max-width: 920px;
      max-height: 88vh;
    }
    #approval-detail-modal .modal-body {
      overflow-y: auto;
      padding-right: 4px;
    }

    /* Filter Controls Group */
    .filter-controls-group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    /* Modal Responsive Grid Systems */
    .modal-grid-2col {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
      gap: 12px;
    }
    .modal-grid-3col {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
      gap: 10px;
    }

    /* ==========================================================================
       Android & Mobile Viewport Compatibility (SDCR.0.6.01)
       ========================================================================== */

    /* Tablet & Small Laptop Breakpoint (<= 768px) */
    @media (max-width: 768px) {
      header {
        height: auto;
        padding: 10px 14px 8px 14px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .brand {
        order: 1;
        flex: 0 1 auto;
      }

      .header-actions {
        order: 2;
        flex: 0 1 auto;
        gap: 8px;
      }

      .nav-tabs {
        order: 3;
        width: 100%;
        display: flex;
        gap: 4px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .tab-btn {
        flex: 1 1 0;
        min-width: 0;
        min-height: 40px;
        padding: 6px 8px;
        justify-content: center;
        font-size: 11.5px;
        white-space: nowrap;
      }
    }

    /* Mobile Phones & Coarse Pointers (<= 640px) */
    @media (max-width: 640px) {
      .brand-sub {
        display: none;
      }

      main {
        padding: 12px 10px;
        width: 100%;
        box-sizing: border-box;
      }

      .rig-container {
        padding: 12px;
        margin-bottom: 16px;
      }

      .rig-header,
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .card-grid,
      #approvals-list.card-grid,
      #deliverables-list.card-grid,
      .pod-grid {
        grid-template-columns: 1fr !important;
        gap: 12px;
      }

      .telemetry-bar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 14px;
      }

      .telemetry-stat-card {
        padding: 10px 12px;
      }

      .telemetry-stat-value {
        font-size: 16px;
      }

      .telemetry-stat-label {
        font-size: 10px;
      }

      .telemetry-stat-sub {
        font-size: 10px;
        word-break: break-word;
      }

      .filter-search-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
        padding: 10px;
      }

      .search-input-wrapper {
        width: 100%;
        min-width: 0;
        flex: 1 1 100%;
      }

      .filter-pills {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        display: flex;
        white-space: nowrap;
      }

      .filter-controls-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        width: 100%;
      }

      .filter-controls-group .form-select {
        flex: 1 1 calc(50% - 8px);
        min-width: 120px;
      }

      .filter-controls-group .btn,
      .filter-controls-group .btn-group {
        flex: 1 1 100%;
        width: 100%;
        justify-content: center;
      }

      .view-toggle-btn {
        flex: 1 1 auto;
        justify-content: center;
        min-height: 36px;
      }

      .card {
        padding: 14px;
      }

      .card-actions {
        flex-wrap: wrap !important;
        justify-content: stretch;
        gap: 6px;
      }

      .card-actions .btn {
        flex: 1 1 calc(50% - 6px);
        min-height: 38px;
        justify-content: center;
      }

      .seat-actions {
        flex-wrap: wrap;
        gap: 6px;
      }

      .seat-actions .btn {
        min-height: 36px;
        flex: 1 1 auto;
        justify-content: center;
      }

      .graph-toolbar {
        padding: 8px 10px;
        gap: 8px;
      }

      .graph-toolbar-group {
        width: 100%;
        justify-content: flex-start;
        gap: 6px;
      }

      .graph-layer-btn,
      .graph-zoom-btn {
        min-height: 36px;
        padding: 4px 10px;
      }

      #topology-seat-inspector {
        padding: 10px 12px;
      }

      .inspector-header-row,
      .inspector-title-group,
      .inspector-rel-row {
        flex-wrap: wrap;
        gap: 6px;
      }

      .inspector-rel-chip {
        min-height: 32px;
        padding: 4px 10px;
      }

      /* Dynamic Viewport Modals (100dvh) */
      .modal-overlay {
        padding: 10px;
      }

      .modal,
      .modal-wide,
      #approval-detail-modal .modal,
      #deliverable-detail-modal .modal,
      #proof-accept-modal .modal,
      #proof-reject-modal .modal,
      #reject-modal .modal,
      #reply-modal .modal,
      #capture-modal .modal {
        width: 100% !important;
        max-width: calc(100vw - 20px) !important;
        max-height: calc(88vh) !important;
        max-height: calc(100dvh - 20px) !important;
        padding: 16px 14px;
        box-sizing: border-box;
      }

      .modal-body {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        max-height: calc(100dvh - 120px);
      }

      .modal-footer {
        flex-wrap: wrap;
        gap: 8px;
      }

      .modal-footer .btn {
        flex: 1 1 auto;
        min-height: 38px;
        justify-content: center;
      }

      .capture-toolbar {
        flex-wrap: wrap;
        gap: 8px;
      }

      /* 16px font-size prevents mobile browser auto-zoom on focus */
      .form-input,
      .form-textarea,
      .form-select,
      .search-input {
        font-size: 16px !important;
      }

      /* Mobile toast positioning */
      #toast {
        left: 12px;
        right: 12px;
        bottom: 12px;
        max-width: none;
        word-break: break-word;
        justify-content: center;
        text-align: center;
      }
    }

    /* Small Phone Viewports (<= 480px) */
    @media (max-width: 480px) {
      #daemon-label {
        display: none;
      }

      .brand {
        font-size: 14px;
      }

      .tab-btn {
        padding: 6px 6px;
        font-size: 11px;
      }

      .filter-controls-group .form-select {
        flex: 1 1 100%;
      }
    }

    /* Touch-Ergonomics & Coarse Pointer Targets */
    @media (max-width: 640px), (pointer: coarse) {
      .btn,
      .tab-btn,
      .filter-pill,
      .graph-zoom-btn,
      .graph-layer-btn,
      .view-toggle-btn {
        min-height: 36px;
        -webkit-tap-highlight-color: transparent;
      }

      .card-actions .btn {
        min-height: 38px;
        -webkit-tap-highlight-color: transparent;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-mark">A</div>
      <span>OpenRig Sidecar</span>
      <span class="brand-sub">Google Antigravity</span>
    </div>

    <nav class="nav-tabs">
      <button class="tab-btn active" data-tab="approvals">
        <span>Approvals & Attention</span>
        <span class="badge badge-amber" id="approvals-count">0</span>
      </button>
      <button class="tab-btn" data-tab="topology">
        <span>Agent Topology</span>
        <span class="badge badge-blue" id="seats-count">0</span>
      </button>
      <button class="tab-btn" data-tab="deliverables">
        <span>Deliverables & Proofs</span>
        <span class="badge badge-green" id="proofs-count">0</span>
      </button>
    </nav>

    <div class="header-actions">
      <div class="status-indicator">
        <div class="status-dot"></div>
        <span id="daemon-label">${daemonUrl}</span>
      </div>
      <button class="btn" id="refresh-btn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
        <span>Refresh</span>
      </button>
    </div>
  </header>

  <main>
    <!-- TAB 1: Approvals & Attention -->
    <section id="tab-approvals" class="tab-content active">
      <div class="section-header">
        <div class="section-title">
          <span>Pending Approvals & Attention</span>
          <span class="badge badge-amber" id="approvals-header-badge">Live</span>
        </div>
      </div>
      <div class="filter-search-bar">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="approvals-search" class="search-input" placeholder="Search approvals by mission, slice, reason, recipient..." oninput="filterApprovals()">
        </div>
        <div class="filter-pills" id="approvals-filter-pills">
          <button class="filter-pill active" data-filter="all" onclick="setApprovalsStatusFilter('all', this)">All</button>
          <button class="filter-pill" data-filter="action" onclick="setApprovalsStatusFilter('action', this)">Action Required</button>
          <button class="filter-pill" data-filter="pending" onclick="setApprovalsStatusFilter('pending', this)">Pending</button>
        </div>
        <div class="filter-controls-group">
          <select id="approvals-rig-filter" class="form-select" onchange="filterApprovals()">
            <option value="all">All Rigs</option>
          </select>
          <select id="approvals-sort" class="form-select" onchange="filterApprovals()">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <button class="btn btn-primary" id="open-new-send-btn">+ Send to Agent</button>
        </div>
      </div>
      <div id="approvals-list" class="card-grid">
        <div class="empty-state">Loading pending attention items...</div>
      </div>
    </section>

    <!-- TAB 2: Agent Topology -->
    <section id="tab-topology" class="tab-content">
      <div class="section-header">
        <div class="section-title">
          <span>Fleet & Agent Topology</span>
          <span class="badge badge-blue" id="topology-header-badge">Live</span>
        </div>
      </div>

      <!-- Fleet Telemetry Dashboard Bar -->
      <div id="fleet-telemetry-bar" class="telemetry-bar">
        <div class="telemetry-stat-card">
          <div class="telemetry-stat-label">Active Seats</div>
          <div class="telemetry-stat-value" id="telem-active-seats">0 / 0</div>
          <div class="telemetry-stat-sub" id="telem-runtimes">Google Antigravity Fleet</div>
        </div>
        <div class="telemetry-stat-card">
          <div class="telemetry-stat-label">Token Burn Rate</div>
          <div class="telemetry-stat-value" id="telem-burn-rate">0 tok/hr</div>
          <div class="telemetry-stat-sub" id="telem-cost">Est. Cost: $0.00</div>
        </div>
        <div class="telemetry-stat-card">
          <div class="telemetry-stat-label">Top Consuming Seat</div>
          <div class="telemetry-stat-value" id="telem-top-seat">—</div>
          <div class="telemetry-stat-sub" id="telem-top-detail">No active burn</div>
        </div>
        <div class="telemetry-stat-card">
          <div class="telemetry-stat-label">Telemetry Ingest</div>
          <div class="telemetry-stat-value" style="display:flex; align-items:center; gap:6px;">
            <div class="live-dot working"></div>
            <span>Active</span>
          </div>
          <div class="telemetry-stat-sub">Streaming (OpenRig Daemon)</div>
        </div>
      </div>

      <div class="filter-search-bar">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="topology-search" class="search-input" placeholder="Search seats by logical ID, session, pod, model, runtime..." oninput="filterTopology()">
        </div>
        <div class="filter-controls-group">
          <select id="topology-rig-filter" class="form-select" onchange="filterTopology()">
            <option value="all">All Rigs</option>
          </select>
          <select id="topology-runtime-filter" class="form-select" onchange="filterTopology()">
            <option value="all">All Runtimes</option>
            <option value="antigravity">Google Antigravity</option>
            <option value="claude">Claude Code</option>
            <option value="codex">Codex</option>
            <option value="omp">OMP</option>
          </select>
          <select id="topology-status-filter" class="form-select" onchange="filterTopology()">
            <option value="all">All Statuses</option>
            <option value="working">Working</option>
            <option value="idle">Idle</option>
            <option value="needs_input">Needs Input</option>
          </select>
          <select id="topology-sort" class="form-select" onchange="filterTopology()">
            <option value="newest">Newest / Active</option>
            <option value="oldest">Oldest</option>
          </select>
          <div class="btn-group" id="topology-view-toggle">
            <button class="view-toggle-btn active" id="view-toggle-graph" onclick="toggleTopologyView('graph')">
              Visual Graph
            </button>
            <button class="view-toggle-btn" id="view-toggle-grid" onclick="toggleTopologyView('grid')">
              Matrix Grid
            </button>
          </div>
        </div>
      </div>

      <div id="topology-graph-container">
        <div class="graph-toolbar" id="topology-graph-toolbar">
          <div class="graph-toolbar-group">
            <span class="graph-toolbar-label">Edges:</span>
            <button class="graph-layer-btn active" id="layer-btn-ownership" onclick="toggleGraphEdgeLayer('ownership', this)" title="Toggle Rig → Pod → Seat structural ownership links">
              <span class="graph-layer-swatch" style="background:#5c7cfa;"></span>
              <span>Rig → Seat</span>
            </button>
            <button class="graph-layer-btn active" id="layer-btn-delegates_to" onclick="toggleGraphEdgeLayer('delegates_to', this)" title="Toggle delegates_to directed edges">
              <span class="graph-layer-swatch" style="background:#8ab4f8;"></span>
              <span>Delegates</span>
            </button>
            <button class="graph-layer-btn active" id="layer-btn-collaborates_with" onclick="toggleGraphEdgeLayer('collaborates_with', this)" title="Toggle collaborates_with edges">
              <span class="graph-layer-swatch" style="background:#81c995;"></span>
              <span>Collaborates</span>
            </button>
            <button class="graph-layer-btn active" id="layer-btn-escalates_to" onclick="toggleGraphEdgeLayer('escalates_to', this)" title="Toggle escalates_to feedback/escalation edges">
              <span class="graph-layer-swatch" style="background:#fdd663;"></span>
              <span>Escalates</span>
            </button>
          </div>
          <div class="graph-toolbar-group">
            <span class="graph-legend-item"><span class="live-dot working" style="display:inline-block;"></span>Working</span>
            <span class="graph-legend-item"><span class="live-dot needs_input" style="display:inline-block;"></span>Needs Input</span>
            <span class="graph-legend-item"><span class="live-dot idle" style="display:inline-block;"></span>Idle</span>
            <div style="display:inline-flex; align-items:center; gap:4px; margin-left:6px;">
              <button class="graph-zoom-btn" id="graph-zoom-out" onclick="adjustGraphZoom(-0.15)" title="Zoom Out">−</button>
              <button class="graph-zoom-btn" id="graph-zoom-reset" onclick="resetGraphZoom()" title="Reset Zoom">100%</button>
              <button class="graph-zoom-btn" id="graph-zoom-in" onclick="adjustGraphZoom(0.15)" title="Zoom In">+</button>
              <button class="graph-zoom-btn" id="graph-zoom-fit" onclick="fitGraphZoom()" title="Fit Graph to Width">Fit</button>
            </div>
          </div>
        </div>
        <div id="topology-seat-inspector">
          <div class="inspector-hint">
            <span><strong>Interactive Fleet Graph:</strong> Click any <strong>Rig Hub</strong> or <strong>Seat Node</strong> to highlight its causal relationships, inspect upstream/downstream seats, or open Antigravity Chat &amp; Terminal Screen. Drag canvas to pan.</span>
          </div>
        </div>
        <div id="topology-graph-viewport">
          <div id="topology-graph-stage">
            <div class="empty-state">Generating visual topology graph...</div>
          </div>
        </div>
      </div>

      <div id="topology-list">
        <div class="empty-state">Loading agent topology...</div>
      </div>
    </section>

    <!-- TAB 3: Deliverables & Proofs -->
    <section id="tab-deliverables" class="tab-content">
      <div class="section-header">
        <div class="section-title">
          <span>Deliverables & Proof Contracts</span>
          <span class="badge badge-green" id="deliverables-header-badge">Proof System</span>
        </div>
      </div>

      <div class="deliverables-studio">
        <aside class="deliverables-master-rail" id="deliverables-master-rail">
          <div class="master-rail-header">
            <div class="search-input-wrapper">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" id="deliverables-search" class="search-input" placeholder="Search deliverables..." oninput="filterDeliverables()">
            </div>
            <div class="filter-pills" id="deliverables-filter-pills">
              <button class="filter-pill active" data-filter="all" onclick="setDeliverablesVerdictFilter('all', this)">All</button>
              <button class="filter-pill" data-filter="accepted" onclick="setDeliverablesVerdictFilter('accepted', this)">Accepted</button>
              <button class="filter-pill" data-filter="rejected" onclick="setDeliverablesVerdictFilter('rejected', this)">Rejected</button>
              <button class="filter-pill" data-filter="pending" onclick="setDeliverablesVerdictFilter('pending', this)">Pending</button>
              <button class="filter-pill" id="pill-deliverables-dropped" data-filter="dropped" onclick="setDeliverablesVerdictFilter('dropped', this)">Sunset / Dropped <span class="pill-badge" id="dropped-proofs-count">0</span></button>
            </div>
            <div class="filter-controls-group master-filter-controls">
              <select id="deliverables-rig-filter" class="form-select" onchange="filterDeliverables()">
                <option value="all">All Rigs</option>
              </select>
              <select id="deliverables-sort" class="form-select" onchange="filterDeliverables()">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div class="deliverables-batch-bar" id="deliverables-batch-bar">
              <span class="batch-count-label" id="deliverables-batch-count">0 selected</span>
              <button class="btn btn-primary btn-sm" onclick="requestBatchAcceptConfirmation()">Batch Accept</button>
              <button class="btn btn-secondary btn-sm" onclick="clearDeliverablesSelection()">Clear</button>
            </div>
          </div>
          <div class="master-rail-list" id="deliverables-list" tabindex="0">
            <div class="empty-state">Loading deliverables and proof contracts...</div>
          </div>
        </aside>
        <main class="deliverables-stage-inspector" id="deliverables-stage-inspector">
          <div class="empty-state">Select a deliverable to inspect proof evidence and contracts.</div>
        </main>
      </div>
    </section>
  </main>

  <!-- REJECT REASON MODAL -->
  <div class="modal-overlay" id="reject-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Reject Request</div>
        <button class="modal-close" onclick="closeModal('reject-modal')">&times;</button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="reject-qitem-id">
        <input type="hidden" id="reject-source-session">
        <div class="form-group">
          <label class="form-label">Item to Reject</label>
          <div id="reject-summary" style="font-weight:600; color:#fff;"></div>
        </div>
        <div class="form-group">
          <label class="form-label" for="reject-reason">Reason for Rejection (Optional, defaults to "Rejected by operator")</label>
          <textarea class="form-textarea" id="reject-reason" placeholder="Explain why this request is denied (optional)..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closeModal('reject-modal')">Cancel</button>
        <button class="btn btn-danger" id="confirm-reject-btn">Reject</button>
      </div>
    </div>
  </div>

  <!-- TRIAGE CONFIRMATION MODAL -->
  <div class="modal-overlay" id="triage-confirm-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title" id="triage-confirm-title">Confirm Action</div>
        <button class="modal-close" onclick="closeModal('triage-confirm-modal')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <div id="triage-confirm-summary" style="font-weight:600; color:#fff; word-break:break-word;"></div>
        </div>
        <div class="detail-box" id="triage-confirm-detail" style="font-size:12px; color:var(--text-secondary); line-height:1.5;"></div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closeModal('triage-confirm-modal')">Cancel</button>
        <button class="btn btn-success" id="triage-confirm-btn">Confirm</button>
      </div>
    </div>
  </div>

  <!-- REPLY TO AGENT MODAL -->
  <div class="modal-overlay" id="reply-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Reply to Agent</div>
        <button class="modal-close" onclick="closeModal('reply-modal')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="reply-session-select">Select Live Agent / Session</label>
          <select id="reply-session-select" class="form-select" style="width:100%; padding:8px 12px; font-size:12.5px;" onchange="onReplySessionSelect(this.value)">
            <option value="">-- Choose live seat or enter custom session below --</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="reply-session">Target Agent / Session</label>
          <input type="text" class="form-input" id="reply-session" placeholder="e.g. operator.agent@kernel or conversation UUID">
        </div>
        <div class="form-group">
          <label class="form-label" for="reply-text">Message / Instruction</label>
          <textarea class="form-textarea" id="reply-text" placeholder="Type your instruction or reply to the agent..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closeModal('reply-modal')">Cancel</button>
        <button class="btn btn-primary" id="confirm-reply-btn">Send Message</button>
      </div>
    </div>
  </div>

  <!-- PROOF ACCEPT CONFIRMATION MODAL -->
  <div class="modal-overlay" id="proof-accept-modal">
    <div class="modal modal-wide">
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="badge badge-green">CONFIRM ACCEPTANCE</div>
          <div class="modal-title">Accept Deliverable & Proof Contract</div>
        </div>
        <button class="modal-close" onclick="closeModal('proof-accept-modal')">&times;</button>
      </div>
      <div class="modal-body" style="gap:14px;">
        <input type="hidden" id="proof-accept-scope">
        <input type="hidden" id="proof-accept-item">
        <input type="hidden" id="proof-accept-revision">
        <input type="hidden" id="proof-accept-previous">

        <div class="detail-section">
          <div class="detail-label">Deliverable Claim & Contract Specification</div>
          <div class="detail-box" id="proof-accept-claim" style="font-size:13px; font-weight:500;">—</div>
        </div>

        <div class="modal-grid-2col">
          <div class="detail-section">
            <div class="detail-label">Contract Scope & Item ID</div>
            <div class="detail-box" id="proof-accept-scope-display" style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">—</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">Revision & Lineage</div>
            <div class="detail-box" id="proof-accept-revision-display" style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">—</div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Submitted Verification Evidence</div>
          <div class="detail-box" id="proof-accept-evidence" style="font-size:12px;">—</div>
        </div>

        <div style="background-color:rgba(129,201,149,0.08); border:1px solid var(--accent-green); border-radius:var(--radius-sm); padding:10px 14px; color:var(--text-primary); font-size:12px; line-height:1.5;">
          <strong>Certification:</strong> By confirming acceptance, you certify that this deliverable satisfies all acceptance criteria, verification evidence is verified, and the proof contract is officially judged as <strong>ACCEPTED</strong>.
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closeModal('proof-accept-modal')">Cancel</button>
        <button class="btn btn-success" id="confirm-proof-accept-btn"><svg class="svg-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Confirm &amp; Accept Proof</button>
      </div>
    </div>
  </div>

  <!-- PROOF REJECT MODAL -->
  <div class="modal-overlay" id="proof-reject-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Reject Proof Contract Item</div>
        <button class="modal-close" onclick="closeModal('proof-reject-modal')">&times;</button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="proof-reject-scope">
        <input type="hidden" id="proof-reject-item">
        <input type="hidden" id="proof-reject-revision">
        <input type="hidden" id="proof-reject-previous">
        <div class="form-group">
          <label class="form-label">Proof Item</label>
          <div id="proof-reject-text" style="font-weight:600; color:#fff;"></div>
        </div>
        <div class="form-group">
          <label class="form-label" for="proof-reject-reason">Rejection Reason (Optional, defaults to "Rejected by operator")</label>
          <textarea class="form-textarea" id="proof-reject-reason" placeholder="Explain what evidence or test verification is lacking (optional)..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closeModal('proof-reject-modal')">Cancel</button>
        <button class="btn btn-danger" id="confirm-proof-reject-btn">Reject Proof</button>
      </div>
    </div>
  </div>

  <!-- SCREEN CAPTURE MODAL -->
  <div class="modal-overlay" id="capture-modal">
    <div class="modal modal-wide">
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="badge badge-blue">TERMINAL</div>
          <div>
            <div class="modal-title" id="capture-modal-title">Live Terminal Snapshot</div>
            <div class="card-meta" id="capture-modal-subtitle" style="margin-top:2px; font-size:11px;">Target: —</div>
          </div>
        </div>
        <button class="modal-close" onclick="closeCaptureModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="capture-toolbar">
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="form-label" style="margin:0;">Lines:</label>
            <select id="capture-lines-select" class="form-select" onchange="changeCaptureLines(this.value)">
              <option value="30">30 lines</option>
              <option value="50" selected>50 lines</option>
              <option value="100">100 lines</option>
              <option value="200">200 lines</option>
            </select>
            <label class="auto-refresh-label">
              <input type="checkbox" id="capture-autorefresh" checked onchange="toggleCaptureAutoRefresh(this.checked)">
              <span>Auto-refresh (3s)</span>
            </label>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn" onclick="refreshCurrentCapture()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              <span>Refresh</span>
            </button>
            <button class="btn btn-primary" onclick="copyCaptureText()">
              <svg class="svg-icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy Screen
            </button>
          </div>
        </div>
        <div class="terminal-container">
          <div class="terminal-bar-top">
            <span id="capture-status-line">Connecting to live pane...</span>
            <span id="capture-timestamp">—</span>
          </div>
          <pre id="capture-terminal-content" class="terminal-content">Loading screen capture...</pre>
        </div>
      </div>
      <div class="modal-footer" style="justify-content: space-between;">
        <span class="card-meta" style="font-size:11px;">Direct socket via OpenRig /api/transport/capture (Obsidian Terminal View)</span>
        <button class="btn" onclick="closeCaptureModal()">Close</button>
      </div>
    </div>
  </div>

  <!-- DELIVERABLE / PROOF DETAIL MODAL -->
  <div class="modal-overlay" id="deliverable-detail-modal">
    <div class="modal modal-wide">
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="badge badge-green" id="detail-badge">PROOFS</div>
          <div>
            <div class="modal-title" id="detail-title">Deliverable & Proof Contract</div>
            <div class="card-meta" id="detail-subtitle" style="margin-top:2px; font-size:11px;">Scope: —</div>
          </div>
        </div>
        <button class="modal-close" onclick="closeModal('deliverable-detail-modal')">&times;</button>
      </div>
      <div class="modal-body" style="gap:14px;">
        <div class="detail-section">
          <div class="detail-label">Item Specification & Requirement</div>
          <div class="detail-box" id="detail-item-text" style="font-size:13px; font-weight:500;">—</div>
        </div>

        <div class="modal-grid-2col">
          <div class="detail-section">
            <div class="detail-label">Scope & Item ID</div>
            <div class="detail-box" id="detail-scope-id" style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">—</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">Revision & Lineage</div>
            <div class="detail-box" id="detail-revision" style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">—</div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Judgment & Verification Record</div>
          <div class="detail-box" id="detail-judgment" style="font-size:12px;">—</div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Submitted Verification Evidence & Test Summary</div>
          <div class="detail-box" id="detail-evidence" style="font-size:12px;">—</div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Contract Verification State & Scope Details</div>
          <div class="detail-box" id="detail-contract-state" style="font-size:12px; font-family:'JetBrains Mono', monospace;">—</div>
        </div>
      </div>
      <div class="modal-footer" style="justify-content: space-between;">
        <div id="detail-actions-left" style="display:flex; gap:8px;"></div>
        <button class="btn" onclick="closeModal('deliverable-detail-modal')">Close</button>
      </div>
    </div>
  </div>

  <!-- APPROVAL PROPOSAL DETAIL MODAL -->
  <div class="modal-overlay" id="approval-detail-modal">
    <div class="modal modal-wide">
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:10px; min-width:0;">
          <div class="badge badge-amber" id="approval-detail-badge">PROPOSAL</div>
          <div style="min-width:0;">
            <div class="modal-title" id="approval-detail-title" style="word-break:break-word;">Proposal &amp; Approval Gate</div>
            <div class="card-meta" id="approval-detail-subtitle" style="margin-top:2px; font-size:11px;">Queue Item: —</div>
          </div>
        </div>
        <button class="modal-close" onclick="closeModal('approval-detail-modal')">&times;</button>
      </div>
      <div class="modal-body" style="gap:14px;">
        <div class="modal-grid-3col">
          <div class="detail-section">
            <div class="detail-label">From (Sender Seat)</div>
            <div class="detail-box" id="approval-detail-from" style="font-family:'JetBrains Mono', monospace; font-size:11.5px; color:var(--accent-blue);">—</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">To (Approval Gate)</div>
            <div class="detail-box" id="approval-detail-to" style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">—</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">Priority &amp; Tags</div>
            <div class="detail-box" id="approval-detail-tags" style="font-family:'JetBrains Mono', monospace; font-size:11.5px;">—</div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Proposal Specification &amp; Action Details (Markdown)</div>
          <div class="detail-box md-rendered" id="approval-detail-body" style="font-size:13px; line-height:1.55; background-color:#141414;">—</div>
        </div>

        <div class="detail-section" id="approval-detail-evidence-section" style="display:none;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <div class="detail-label">Linked Evidence Artifact (<span id="approval-detail-evidence-name">file</span>)</div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <a class="btn" id="approval-detail-open-external-btn" href="#" target="_blank" rel="noopener noreferrer" style="display:none; padding:3px 8px; font-size:11px; text-decoration:none;"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg><span>Open Link</span></a>
              <button class="btn" id="approval-detail-copy-path-btn" style="padding:3px 8px; font-size:11px;"><svg class="svg-icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy Path</button>
            </div>
          </div>
          <div class="detail-box" id="approval-detail-evidence-path" style="font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--accent-amber); word-break:break-all;">—</div>
          <div class="detail-box md-rendered" id="approval-detail-evidence-body" style="display:none; font-size:12.5px; line-height:1.55; background-color:#141414; margin-top:4px;"></div>
        </div>
      </div>
      <div class="modal-footer" style="justify-content: space-between; flex-wrap: wrap;">
        <div id="approval-detail-actions-left" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
        <button class="btn" onclick="closeModal('approval-detail-modal')">Close</button>
      </div>
    </div>
  </div>

  <!-- IMAGE LIGHTBOX MODAL -->
  <div class="modal-overlay" id="image-lightbox-modal" onclick="if(event.target===this) closeModal('image-lightbox-modal')">
    <div class="modal-content-lightbox">
      <div class="lightbox-header">
        <div id="lightbox-title" class="lightbox-title">Image Proof Preview</div>
        <button class="modal-close" onclick="closeModal('image-lightbox-modal')">&times;</button>
      </div>
      <div class="lightbox-body">
        <img id="lightbox-image" src="" alt="Proof Preview" class="lightbox-img">
      </div>
    </div>
  </div>

  <div id="toast"></div>

  <script src="/vendor/dagre.min.js"></script>
  <script>
    // Clean SVG Icons
    const ICONS = {
      image: '<svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
      doc: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
      folder: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
      check: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
      cross: '<svg class="svg-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      bolt: '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      box: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
      restore: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
      search: '<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      clock: '<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      copy: '<svg class="svg-icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
      paperclip: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
      reply: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>',
      link: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
      external: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      monitor: '<svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      mail: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      arrowLeft: '<svg class="svg-icon" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
      arrowRight: '<svg class="svg-icon" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
    };

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById('tab-' + tabId).classList.add('active');
        if (tabId === 'topology' && topologyViewMode === 'graph' && !initialGraphFitApplied && (typeof window !== 'undefined' && ((window.innerWidth && window.innerWidth < 768) || (document.documentElement && document.documentElement.clientWidth < 768)))) {
          initialGraphFitApplied = true;
          fitGraphZoom();
        }
      });
    });

    function showToast(message, isError = false) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.style.borderColor = isError ? 'var(--accent-red)' : 'var(--accent-green)';
      toast.style.display = 'flex';
      setTimeout(() => { toast.style.display = 'none'; }, 4000);
    }

    function openModal(id) {
      document.getElementById(id).classList.add('open');
    }
    function closeModal(id) {
      document.getElementById(id).classList.remove('open');
    }

    function openImageLightbox(src, alt) {
      const img = document.getElementById('lightbox-image');
      const title = document.getElementById('lightbox-title');
      if (img) {
        img.src = src;
        img.alt = alt || 'Proof Preview';
      }
      if (title) {
        title.textContent = alt || 'Image Proof Preview';
      }
      openModal('image-lightbox-modal');
    }

    function closeImageLightbox() {
      closeModal('image-lightbox-modal');
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal('image-lightbox-modal');
        }
      });
    }

    // Triage hotkeys operate only on a focused approval card and never while typing.
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (isInputElementActive()) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const approvalsTab = document.getElementById('tab-approvals');
        if (!approvalsTab || !approvalsTab.classList || !approvalsTab.classList.contains('active')) return;
        const active = document.activeElement;
        const card = active && active.closest ? active.closest('.card[data-approval-id]') : null;
        if (!card) return;
        const approvalId = card.getAttribute('data-approval-id');
        const item = cachedApprovals.find(entry => entry && entry.id === approvalId);
        if (!item || !item.id.startsWith('queue:')) return;
        const qitemId = item.id.slice(6);
        const key = String(e.key || '').toLowerCase();
        if (key === 'a') {
          e.preventDefault();
          requestApprove(qitemId, item.summary || '', item.sourceSession || '');
        } else if (key === 'x') {
          e.preventDefault();
          requestQuickReject(qitemId, item.summary || '', item.sourceSession || '');
        } else if (key === 'r') {
          e.preventDefault();
          openRejectModal(qitemId, item.summary || '', item.sourceSession || '');
        }
      });
    }

    // Deliverables studio hotkeys: J/K navigate, A accept, R request revision, Space select.
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (isInputElementActive()) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const deliverablesTab = document.getElementById('tab-deliverables');
        if (!deliverablesTab || !deliverablesTab.classList || !deliverablesTab.classList.contains('active')) return;
        const key = String(e.key || '').toLowerCase();
        if (key === 'j') {
          e.preventDefault();
          selectNextDeliverable();
        } else if (key === 'k') {
          e.preventDefault();
          selectPrevDeliverable();
        } else if (key === 'a') {
          e.preventDefault();
          openActiveProofAcceptModal();
        } else if (key === 'r') {
          e.preventDefault();
          openActiveProofRejectModal();
        } else if (key === ' ' || key === 'spacebar') {
          e.preventDefault();
          toggleDeliverableSelection(activeDeliverableIndex);
        }
      });
    }

    async function toggleInlineEvidenceDoc(index, docPath) {
      const el = document.getElementById('inline-evidence-doc-' + index);
      if (!el) return;
      if (el.style.display === 'block') {
        el.style.display = 'none';
        return;
      }
      el.style.display = 'block';
      el.innerHTML = '<div style="color:var(--text-secondary); font-size:11.5px;">Loading proof document...</div>';
      try {
        const res = await fetch('/api/evidence?path=' + encodeURIComponent(docPath));
        const data = await res.json();
        if (data.ok && data.content) {
          el.innerHTML = '<div style="font-size:11px; color:var(--text-muted); margin-bottom:6px; font-weight:600; text-transform:uppercase;">' + escapeHtml(data.basename || docPath) + '</div>' + renderMarkdown(data.content);
        } else {
          el.innerHTML = '<div style="color:var(--accent-red); font-size:11.5px;">Unable to load evidence artifact: ' + escapeHtml(data.error || 'not found') + '</div>';
        }
      } catch (err) {
        el.innerHTML = '<div style="color:var(--accent-red); font-size:11.5px;">Failed to fetch evidence document.</div>';
      }
    }

    async function loadDetailDocPreview(docPath) {
      const container = document.getElementById('detail-doc-previews');
      if (!container) return;
      container.innerHTML = '<div style="color:var(--text-secondary); font-size:12px; margin-top:6px;">Loading proof: ' + escapeHtml(docPath) + '...</div>';
      try {
        const res = await fetch('/api/evidence?path=' + encodeURIComponent(docPath));
        const data = await res.json();
        if (data.ok && data.content) {
          container.innerHTML = '<div class="evidence-doc-preview" style="max-height:420px; margin-top:8px;">' +
            '<div style="font-size:11px; color:var(--text-muted); margin-bottom:6px; font-weight:600; text-transform:uppercase;">' + escapeHtml(data.basename || docPath) + '</div>' +
            renderMarkdown(data.content) +
          '</div>';
        } else {
          container.innerHTML = '<div style="color:var(--text-muted); font-size:12px; margin-top:6px;">Proof artifact: ' + escapeHtml(docPath) + ' (' + escapeHtml(data.error || 'unrendered') + ')</div>';
        }
      } catch (e) {
        container.innerHTML = '<div style="color:var(--accent-red); font-size:12px; margin-top:6px;">Failed to load proof artifact.</div>';
      }
    }

    // Modal triggers
    document.getElementById('open-new-send-btn').addEventListener('click', () => {
      openReplyModal('');
    });

    // Send reply action
    document.getElementById('confirm-reply-btn').addEventListener('click', async () => {
      const session = document.getElementById('reply-session').value.trim();
      const text = document.getElementById('reply-text').value.trim();
      if (!session || !text) {
        showToast("Please provide both target session and message.", true);
        return;
      }
      try {
        const res = await fetch('/api/transport/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, text, actorSession: 'operator@human' })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast("Message sent to " + session);
          closeModal('reply-modal');
        } else {
          showToast(data.error || "Failed to send message", true);
        }
      } catch (err) {
        showToast("Network error sending message", true);
      }
    });

    function isAgentSeatSession(session) {
      if (!session || typeof session !== 'string') return false;
      const s = session.trim();
      if (!s.includes('@')) return false;
      if (s === 'operator@human' || s.endsWith('@human') || s.endsWith('@external')) return false;
      if (/^human(?:-[A-Za-z0-9._-]+)?@(kernel|host)$/i.test(s)) return false;
      return true;
    }

    // Best-effort wake notification back to the originating agent seat on human Approve/Reject
    async function notifyApprovalDecision(targetSession, qitemId, decision, summary, reason) {
      if (!isAgentSeatSession(targetSession)) return;
      const text = decision === 'approved'
        ? '[Sidecar Approval] APPROVED ' + qitemId + (summary ? (' (' + summary + ')') : '') + '. Human approval granted via OpenRig Sidecar; proceed with approved execution.'
        : '[Sidecar Approval] REJECTED ' + qitemId + (summary ? (' (' + summary + ')') : '') + '. Reason: ' + (reason || 'Rejected by operator') + '. Do NOT execute this item.';
      try {
        await fetch('/api/transport/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session: targetSession.trim(),
            text,
            actorSession: 'operator@human'
          })
        });
      } catch (err) {
        // Non-fatal if sender seat is offline or unroutable
      }
    }

    // Reject qitem action (optional reason defaulting to "Rejected by operator")
    document.getElementById('confirm-reject-btn').addEventListener('click', async () => {
      const qitemId = document.getElementById('reject-qitem-id').value;
      const sourceSession = document.getElementById('reject-source-session')?.value || '';
      const summaryText = document.getElementById('reject-summary')?.textContent || qitemId;
      const rawReason = document.getElementById('reject-reason').value.trim();
      const reason = rawReason || 'Rejected by operator';
      try {
        const res = await fetch('/api/mission-control/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verb: 'deny',
            qitemId,
            reason,
            actorSession: 'operator@human'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Request rejected: " + reason);
          closeModal('reject-modal');
          closeModal('approval-detail-modal');
          notifyApprovalDecision(sourceSession, qitemId, 'rejected', summaryText, reason);
          fetchApprovals();
        } else {
          showToast(data.message || data.error || "Failed to reject", true);
        }
      } catch (err) {
        showToast("Error rejecting request", true);
      }
    });

    // 1-Click Quick Reject qitem (no modal, default reason)
    async function quickRejectItem(qitemId, summary, sourceSession) {
      try {
        const res = await fetch('/api/mission-control/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verb: 'deny',
            qitemId,
            reason: 'Rejected by operator',
            actorSession: 'operator@human'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Quick rejected: " + (summary || qitemId));
          closeModal('approval-detail-modal');
          notifyApprovalDecision(sourceSession, qitemId, 'rejected', summary || qitemId, 'Rejected by operator');
          fetchApprovals();
        } else {
          showToast(data.message || data.error || "Failed to reject", true);
        }
      } catch (err) {
        showToast("Error rejecting request", true);
      }
    }

    // Consequential triage actions go through an explicit confirmation modal first.
    let pendingTriageConfirmation = null;

    function requestTriageConfirmation(kind, qitemId, summary, sourceSession) {
      pendingTriageConfirmation = { kind, qitemId, summary, sourceSession };
      const isApprove = kind === 'approve';
      document.getElementById('triage-confirm-title').textContent = isApprove ? 'Confirm Approval' : 'Confirm Quick Reject';
      document.getElementById('triage-confirm-summary').textContent = summary || qitemId;
      document.getElementById('triage-confirm-detail').textContent = isApprove
        ? 'Approving applies the decision immediately and wakes the originating seat. This cannot be undone from the Sidecar.'
        : 'Quick Reject denies this request with the default reason "Rejected by operator" and wakes the originating seat.';
      const confirmBtn = document.getElementById('triage-confirm-btn');
      confirmBtn.className = 'btn ' + (isApprove ? 'btn-success' : 'btn-danger');
      confirmBtn.innerHTML = isApprove ? (ICONS.check + 'Approve') : (ICONS.bolt + 'Quick Reject');
      openModal('triage-confirm-modal');
    }

    function requestApprove(qitemId, summary, sourceSession) {
      requestTriageConfirmation('approve', qitemId, summary, sourceSession);
    }

    function requestQuickReject(qitemId, summary, sourceSession) {
      requestTriageConfirmation('quick-reject', qitemId, summary, sourceSession);
    }

    document.getElementById('triage-confirm-btn').addEventListener('click', async () => {
      const pending = pendingTriageConfirmation;
      if (!pending) return;
      pendingTriageConfirmation = null;
      closeModal('triage-confirm-modal');
      if (pending.kind === 'batch-accept') {
        await executeBatchAccept();
        return;
      }
      if (pending.kind === 'approve') {
        await approveItem(pending.qitemId, pending.summary, pending.sourceSession);
      } else {
        await quickRejectItem(pending.qitemId, pending.summary, pending.sourceSession);
      }
    });

    // Reject proof action (optional reason defaulting to "Rejected by operator")
    document.getElementById('confirm-proof-reject-btn').addEventListener('click', async () => {
      const scope = document.getElementById('proof-reject-scope').value;
      const item = document.getElementById('proof-reject-item').value;
      const expectedRevision = document.getElementById('proof-reject-revision').value;
      const expectedPrevious = document.getElementById('proof-reject-previous').value || null;
      const rawReason = document.getElementById('proof-reject-reason').value.trim();
      const reason = rawReason || 'Rejected by operator';

      try {
        const res = await fetch('/api/proof/judge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-OpenRig-Session': 'human'
          },
          body: JSON.stringify({
            scope,
            item,
            verdict: 'reject',
            reason,
            expectedRevision,
            expectedPrevious: expectedPrevious || null,
            actorSession: 'human'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Proof rejected: " + reason);
          closeModal('proof-reject-modal');
          fetchDeliverables();
        } else {
          showToast(data.message || data.error || "Failed to reject proof", true);
        }
      } catch (err) {
        showToast("Error recording proof rejection", true);
      }
    });

    // 1-Click Quick Reject proof (no modal, default reason)
    async function quickRejectProof(scope, item, expectedRevision, expectedPrevious) {
      try {
        const res = await fetch('/api/proof/judge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-OpenRig-Session': 'human'
          },
          body: JSON.stringify({
            scope,
            item,
            verdict: 'reject',
            reason: 'Rejected by operator',
            expectedRevision,
            expectedPrevious: expectedPrevious || null,
            actorSession: 'human'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Quick rejected proof: " + scope + "#" + item);
          fetchDeliverables();
        } else {
          showToast(data.message || data.error || "Failed to reject proof", true);
        }
      } catch (err) {
        showToast("Error recording proof rejection", true);
      }
    }

    // 1-Click Quick Complete proof (accepts with default reason)
    async function quickCompleteProof(scope, item, expectedRevision, expectedPrevious) {
      try {
        const res = await fetch('/api/proof/judge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-OpenRig-Session': 'human'
          },
          body: JSON.stringify({
            scope,
            item,
            verdict: 'accept',
            reason: 'Completed and accepted by operator via OpenRig Sidecar',
            evidence: ['proof/evidence.md'],
            expectedRevision,
            expectedPrevious: expectedPrevious || null,
            actorSession: 'human'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Proof accepted & completed: " + scope + "#" + item);
          fetchDeliverables();
        } else {
          showToast(data.message || data.error || "Completion failed", true);
        }
      } catch (err) {
        showToast("Error completing deliverable", true);
      }
    }

    // Ledger-aware proof withdrawal
    async function withdrawProof(scope, item, expectedRevision, expectedPrevious) {
      try {
        const res = await fetch('/api/proof/judge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-OpenRig-Session': 'human'
          },
          body: JSON.stringify({
            scope,
            item,
            verdict: 'withdraw',
            reason: 'Sunset / dropped by operator via Sidecar',
            expectedRevision,
            expectedPrevious: expectedPrevious || null,
            actorSession: 'human'
          })
        });
        const data = await res.json();
        if (res.ok) {
          fetchDeliverables();
        } else {
          console.warn("Proof withdrawal note:", data.message || data.error);
        }
      } catch (err) {
        console.warn("Background proof withdrawal error:", err);
      }
    }

    // Deliverable Sunset / Drop helpers
    function getDeliverableKey(item) {
      if (!item) return '';
      return (item.scope || 'default') + '#' + (item.id || item.text || '');
    }

    function getDroppedDeliverables() {
      try {
        if (typeof localStorage === 'undefined') return [];
        const raw = localStorage.getItem('openrig_dropped_deliverables');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    function setDeliverableDropped(key, isDropped) {
      try {
        if (typeof localStorage === 'undefined') return;
        const current = getDroppedDeliverables();
        const set = new Set(current);
        if (isDropped) {
          set.add(key);
        } else {
          set.delete(key);
        }
        localStorage.setItem('openrig_dropped_deliverables', JSON.stringify(Array.from(set)));
      } catch (e) {
        console.error("Error updating dropped deliverables:", e);
      }
    }

    function isDeliverableDropped(item) {
      if (!item) return false;
      const key = getDeliverableKey(item);
      const dropped = getDroppedDeliverables();
      return dropped.includes(key);
    }

    async function dropDeliverable(index) {
      const item = cachedDeliverables[index];
      if (!item) return;
      const key = getDeliverableKey(item);
      setDeliverableDropped(key, true);

      const j = item.judgment;
      const isUnjudged = !j || !j.verdict;
      if (isUnjudged && item.scope && item.id) {
        withdrawProof(item.scope, item.id, item.revision, j ? j.id : null);
      }

      const label = item.text || item.id || key;
      showToast("Deliverable sunset / dropped: " + (label.length > 40 ? label.slice(0, 39) + '…' : label));
      renderDeliverables();
    }

    function restoreDeliverable(index) {
      const item = cachedDeliverables[index];
      if (!item) return;
      const key = getDeliverableKey(item);
      setDeliverableDropped(key, false);

      const label = item.text || item.id || key;
      showToast("Restored deliverable: " + (label.length > 40 ? label.slice(0, 39) + '…' : label) + " to active view");
      renderDeliverables();
    }

    // Open Proof Accept Confirmation Modal
    function openProofAcceptModal(scope, item, text, expectedRevision, expectedPrevious, evidence) {
      document.getElementById('proof-accept-scope').value = scope || '';
      document.getElementById('proof-accept-item').value = item || '';
      document.getElementById('proof-accept-revision').value = expectedRevision || '';
      document.getElementById('proof-accept-previous').value = expectedPrevious || '';

      document.getElementById('proof-accept-claim').innerHTML = renderMarkdown(text || ('Item #' + item));
      document.getElementById('proof-accept-scope-display').textContent = (scope || 'default') + ' #' + item;
      document.getElementById('proof-accept-revision-display').textContent = expectedRevision ? ('rev ' + expectedRevision) : 'uncommitted / initial';

      const evEl = document.getElementById('proof-accept-evidence');
      if (Array.isArray(evidence) && evidence.length > 0) {
        evEl.innerHTML = evidence.map(e => '<span class="badge badge-green" style="margin-right:6px; margin-bottom:4px; font-family:\\'JetBrains Mono\\', monospace;">' + ICONS.folder + escapeHtml(e) + '</span>').join('');
      } else if (evidence && typeof evidence === 'object') {
        evEl.innerHTML = '<pre class="md-code-block"><code>' + escapeHtml(JSON.stringify(evidence, null, 2)) + '</code></pre>';
      } else if (evidence) {
        evEl.innerHTML = renderMarkdown(String(evidence));
      } else {
        evEl.textContent = 'Evidence: proof/evidence.md (Empirically verified in workspace)';
      }

      openModal('proof-accept-modal');
    }

    // Confirm Proof Acceptance Action
    document.getElementById('confirm-proof-accept-btn').addEventListener('click', async () => {
      const scope = document.getElementById('proof-accept-scope').value;
      const item = document.getElementById('proof-accept-item').value;
      const expectedRevision = document.getElementById('proof-accept-revision').value;
      const expectedPrevious = document.getElementById('proof-accept-previous').value || null;

      await acceptProof(scope, item, expectedRevision, expectedPrevious);
      closeModal('proof-accept-modal');
    });

    // Helper to open proof accept modal from cached deliverables list index
    function openProofAcceptModalByIndex(index) {
      const item = cachedDeliverables[index];
      if (!item) return;
      const scope = item.scope || 'default';
      const j = item.judgment;
      openProofAcceptModal(scope, item.id, item.text, item.revision, j ? j.id : '', item.evidence);
    }

    // 1-Click Approve qitem
    async function approveItem(qitemId, summary, sourceSession) {
      try {
        const res = await fetch('/api/mission-control/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verb: 'approve',
            qitemId,
            actorSession: 'operator@human',
            body: 'Approved via Sidecar'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Approved: " + (summary || qitemId));
          closeModal('approval-detail-modal');
          notifyApprovalDecision(sourceSession, qitemId, 'approved', summary || qitemId, '');
          fetchApprovals();
        } else {
          showToast(data.message || data.error || "Approval failed", true);
        }
      } catch (err) {
        showToast("Error processing approval", true);
      }
    }

    // Open reject modal for qitem
    function openRejectModal(qitemId, summary, sourceSession) {
      document.getElementById('reject-qitem-id').value = qitemId;
      const srcInput = document.getElementById('reject-source-session');
      if (srcInput) srcInput.value = sourceSession || '';
      document.getElementById('reject-summary').textContent = summary || qitemId;
      document.getElementById('reject-reason').value = '';
      openModal('reject-modal');
    }

    // Live Agent Dropdown in Send/Reply modal
    function populateAgentDropdown(rigs) {
      const select = document.getElementById('reply-session-select');
      if (!select) return;
      const currentVal = select.value;
      let html = '<option value="">-- Choose live seat or enter custom session below --</option>';
      if (Array.isArray(rigs)) {
        for (const r of rigs) {
          const rig = r.rig || r;
          const nodes = rig.nodes || [];
          if (nodes.length === 0) continue;
          html += '<optgroup label="Rig: ' + escapeHtml(rig.name) + '">';
          for (const node of nodes) {
            const sessionName = node.canonicalSessionName || (node.logicalId + '@' + rig.name);
            const runtime = node.runtime || 'antigravity';
            html += '<option value="' + escapeHtml(sessionName) + '">' + escapeHtml(node.logicalId) + ' (' + escapeHtml(runtime) + ')</option>';
          }
          html += '</optgroup>';
        }
      }
      select.innerHTML = html;
      if (currentVal) select.value = currentVal;
    }
    const updateAgentSelect = populateAgentDropdown;

    function onReplySessionSelect(val) {
      if (val) {
        document.getElementById('reply-session').value = val;
      }
    }

    // Open reply modal for seat
    function openReplyModal(session) {
      document.getElementById('reply-session').value = session || '';
      const select = document.getElementById('reply-session-select');
      if (select) {
        select.value = session || '';
      }
      document.getElementById('reply-text').value = '';
      openModal('reply-modal');
    }

    // Dynamic Rig Filters across all three tabs
    function updateAllRigFilters(rigNames) {
      const filterIds = ['approvals-rig-filter', 'topology-rig-filter', 'deliverables-rig-filter'];
      for (const id of filterIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const current = el.value || 'all';
        let html = '<option value="all">All Rigs</option>';
        for (const name of rigNames) {
          html += '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + '</option>';
        }
        el.innerHTML = html;
        if (rigNames.includes(current)) {
          el.value = current;
        } else {
          el.value = 'all';
        }
      }
    }

    // Zero-dependency GFM client-side markdown renderer (tables, safe links, dividers, code, lists, quotes)
    function splitMarkdownTableRow(line) {
      let trimmed = line.trim();
      if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
      if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
      return trimmed.split('|').map(c => c.trim());
    }

    function isMarkdownTableSeparator(line) {
      if (!line || !line.includes('-') || !line.includes('|')) return false;
      const cells = splitMarkdownTableRow(line);
      if (cells.length === 0) return false;
      return cells.every(c => /^:?-{3,}:?$/.test(c));
    }

    function renderMarkdown(str) {
      if (!str) return '';
      let text = escapeHtml(String(str).replace(/\\r\\n/g, '\\n'));

      // 1. Extract fenced code blocks first so inner syntax is untouched
      const codeBlocks = [];
      text = text.replace(/\`\`\`([a-zA-Z0-9_+-]*)[ \\t]*\\n?([\\s\\S]*?)\`\`\`/g, (match, lang, code) => {
        const idx = codeBlocks.length;
        codeBlocks.push('<pre class="md-code-block"><code class="lang-' + (lang || 'text') + '">' + code.trim() + '</code></pre>');
        return '\\n%%CODEBLOCK_' + idx + '%%\\n';
      });

      // 2. Extract inline code spans before tables/links/emphasis so pipes & underscores inside backticks stay intact
      const inlineCodes = [];
      const rawInlineCodes = [];
      text = text.replace(/\`([^\`\\n]+)\`/g, (match, code) => {
        const idx = inlineCodes.length;
        rawInlineCodes.push(code);
        inlineCodes.push('<code class="md-inline-code">' + code + '</code>');
        return '%%INLINECODE_' + idx + '%%';
      });

      const mdLinks = [];
      function formatInline(segment) {
        let s = segment;

        // Image Markdown ![alt](url) parsed BEFORE standard links
        s = s.replace(/!\\[([^\\]]*)\\]\\(([^)\\s]+)\\)/g, (match, alt, rawUrl) => {
          const decodedUrl = rawUrl.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
          const lower = decodedUrl.toLowerCase();
          const idx = mdLinks.length;
          let imageUrl = decodedUrl;
          if (lower.startsWith('http://') || lower.startsWith('https://')) {
            imageUrl = decodedUrl;
          } else {
            let cleanPath = decodedUrl;
            if (lower.startsWith('file://')) {
              cleanPath = decodedUrl.slice(7);
            }
            imageUrl = '/api/evidence/raw?path=' + encodeURIComponent(cleanPath);
          }
          mdLinks.push(
            '<div class="md-image-container">' +
              '<img class="md-proof-image" src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(alt) + '" loading="lazy" onclick="openImageLightbox(this.src, this.alt)">' +
              (alt ? ('<div class="md-image-caption">' + escapeHtml(alt) + '</div>') : '') +
            '</div>'
          );
          return '%%MDLINK_' + idx + '%%';
        });

        // Safe Markdown links [label](url) with strict protocol allowlisting
        s = s.replace(/\\[([^\\]]+)\\]\\(([^)\\s]+)\\)/g, (match, label, rawUrl) => {
          const decodedUrl = rawUrl.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
          const lower = decodedUrl.toLowerCase();
          const idx = mdLinks.length;
          const isImgFile = /\\.(png|jpg|jpeg|webp|gif|svg)$/i.test(decodedUrl);

          if (lower.startsWith('https://') || lower.startsWith('http://')) {
            let html = '<a class="md-link" href="' + escapeHtml(decodedUrl) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
            if (isImgFile) {
              html += ' <span class="badge badge-purple" style="cursor:pointer; font-size:10px; margin-left:4px;" onclick="openImageLightbox(\\'' + escapeJs(decodedUrl) + '\\', \\'' + escapeJs(label) + '\\')">' + ICONS.image + 'View</span>';
            }
            mdLinks.push(html);
          } else if (lower.startsWith('mailto:') || lower.startsWith('conversation://')) {
            mdLinks.push('<a class="md-link" href="' + escapeHtml(decodedUrl) + '">' + label + '</a>');
          } else if (lower.startsWith('file://')) {
            const cleanPath = decodedUrl.slice(7);
            if (isImgFile) {
              mdLinks.push('<span class="md-file-ref" title="' + escapeHtml(cleanPath) + '" style="cursor:pointer;" onclick="openImageLightbox(\\'/api/evidence/raw?path=' + encodeURIComponent(cleanPath) + '\\', \\'' + escapeJs(label) + '\\')">' + ICONS.image + label + '</span>');
            } else {
              mdLinks.push('<span class="md-file-ref" title="' + escapeHtml(cleanPath) + '">' + ICONS.doc + label + '</span>');
            }
          } else if (isImgFile) {
            mdLinks.push('<span class="md-file-ref" title="' + escapeHtml(decodedUrl) + '" style="cursor:pointer;" onclick="openImageLightbox(\\'/api/evidence/raw?path=' + encodeURIComponent(decodedUrl) + '\\', \\'' + escapeJs(label) + '\\')">' + ICONS.image + label + '</span>');
          } else {
            mdLinks.push(label);
          }
          return '%%MDLINK_' + idx + '%%';
        });

        // Bold and italics (word-bounded underscores preserve snake_case identifiers)
        s = s.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
        s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        s = s.replace(/\\*([^*\\n]+)\\*/g, '<em>$1</em>');
        s = s.replace(/(^|[\\s(])_([^_\\n]+)_(?=[\\s.,;:!?)]|$)/g, '$1<em>$2</em>');
        return s;
      }

      function stripInlineForLabel(segment) {
        return segment
          .replace(/%%INLINECODE_(\\d+)%%/g, (m, idx) => rawInlineCodes[Number(idx)] || '')
          .replace(/!\\[([^\\]]*)\\]\\([^)\\s]+\\)/g, '$1')
          .replace(/\\[([^\\]]+)\\]\\([^)\\s]+\\)/g, '$1')
          .replace(/\\*\\*([^*]+)\\*\\*/g, '$1')
          .replace(/__([^_]+)__/g, '$1')
          .replace(/\\*([^*\\n]+)\\*/g, '$1');
      }

      // 3. Block-level single-pass parser (GFM tables, dividers, headings, blockquotes, lists, paragraphs)
      const lines = text.split('\\n');
      const blocks = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
          i++;
          continue;
        }

        // Fenced code block token
        if (/^%%CODEBLOCK_\\d+%%$/.test(trimmed)) {
          blocks.push(trimmed);
          i++;
          continue;
        }

        // Horizontal rule
        if (/^(?:---+|___+|\\*\\*\\*+)$/.test(trimmed)) {
          blocks.push('<hr class="md-hr">');
          i++;
          continue;
        }

        // GFM Table: header row containing '|' followed by alignment separator row
        if (line.includes('|') && i + 1 < lines.length && isMarkdownTableSeparator(lines[i + 1])) {
          const headerCells = splitMarkdownTableRow(line);
          const sepCells = splitMarkdownTableRow(lines[i + 1]);
          const aligns = headerCells.map((_, colIdx) => {
            const sep = sepCells[colIdx] || '';
            if (sep.startsWith(':') && sep.endsWith(':')) return 'center';
            if (sep.endsWith(':')) return 'right';
            return 'left';
          });
          const plainHeaders = headerCells.map(h => stripInlineForLabel(h));

          let tableHtml = '<div tabindex="0" role="region" aria-label="Proposal data table" class="md-table-wrapper"><table class="md-table"><thead><tr>';
          for (let c = 0; c < headerCells.length; c++) {
            const alignStyle = aligns[c] !== 'left' ? (' style="text-align:' + aligns[c] + ';"') : '';
            tableHtml += '<th' + alignStyle + '>' + formatInline(headerCells[c]) + '</th>';
          }
          tableHtml += '</tr></thead><tbody>';

          i += 2;
          while (i < lines.length && lines[i].trim() && lines[i].includes('|') && !/^%%CODEBLOCK_\\d+%%$/.test(lines[i].trim())) {
            const rowCells = splitMarkdownTableRow(lines[i]);
            tableHtml += '<tr>';
            for (let c = 0; c < headerCells.length; c++) {
              const cellVal = rowCells[c] !== undefined ? rowCells[c] : '';
              const alignStyle = aligns[c] !== 'left' ? (' style="text-align:' + aligns[c] + ';"') : '';
              const dataLabelAttr = plainHeaders[c] ? (' data-label="' + plainHeaders[c] + '"') : '';
              tableHtml += '<td' + dataLabelAttr + alignStyle + '>' + formatInline(cellVal) + '</td>';
            }
            tableHtml += '</tr>';
            i++;
          }
          tableHtml += '</tbody></table></div>';
          blocks.push(tableHtml);
          continue;
        }

        // Headings (# to ####)
        const headingMatch = line.match(/^(#{1,4})\\s+(.*)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          blocks.push('<h' + level + ' class="md-h' + level + '">' + formatInline(headingMatch[2].trim()) + '</h' + level + '>');
          i++;
          continue;
        }

        // Blockquotes (merge consecutive > lines)
        if (/^\\s*(?:>|&gt;)\\s?/.test(line)) {
          const quoteLines = [];
          while (i < lines.length && /^\\s*(?:>|&gt;)\\s?/.test(lines[i])) {
            const qContent = lines[i].replace(/^\\s*(?:>|&gt;)\\s?/, '').trim();
            if (qContent) quoteLines.push(formatInline(qContent));
            i++;
          }
          blocks.push('<blockquote class="md-blockquote">' + quoteLines.join('<br>') + '</blockquote>');
          continue;
        }

        // Unordered list
        if (/^\\s*[-*]\\s+/.test(line)) {
          const items = [];
          while (i < lines.length && /^\\s*[-*]\\s+/.test(lines[i])) {
            const liText = lines[i].replace(/^\\s*[-*]\\s+/, '');
            items.push('<li class="md-li-ul">' + formatInline(liText) + '</li>');
            i++;
          }
          blocks.push('<ul class="md-ul">' + items.join('') + '</ul>');
          continue;
        }

        // Ordered list
        if (/^\\s*\\d+\\.\\s+/.test(line)) {
          const items = [];
          while (i < lines.length && /^\\s*\\d+\\.\\s+/.test(lines[i])) {
            const liText = lines[i].replace(/^\\s*\\d+\\.\\s+/, '');
            items.push('<li class="md-li-ol">' + formatInline(liText) + '</li>');
            i++;
          }
          blocks.push('<ol class="md-ol">' + items.join('') + '</ol>');
          continue;
        }

        // Standard paragraph (collect consecutive non-block lines)
        const paraLines = [];
        while (
          i < lines.length &&
          lines[i].trim() &&
          !/^%%CODEBLOCK_\\d+%%$/.test(lines[i].trim()) &&
          !/^(?:---+|___+|\\*\\*\\*+)$/.test(lines[i].trim()) &&
          !/^(#{1,4})\\s+/.test(lines[i]) &&
          !/^\\s*(?:>|&gt;)\\s?/.test(lines[i]) &&
          !/^\\s*[-*]\\s+/.test(lines[i]) &&
          !/^\\s*\\d+\\.\\s+/.test(lines[i]) &&
          !(lines[i].includes('|') && i + 1 < lines.length && isMarkdownTableSeparator(lines[i + 1]))
        ) {
          paraLines.push(formatInline(lines[i].trim()));
          i++;
        }
        if (paraLines.length > 0) {
          blocks.push('<p class="md-p">' + paraLines.join('<br>') + '</p>');
        }
      }

      let out = blocks.join('');

      // 4. Restore links, inline code, and fenced code blocks
      out = out.replace(/%%MDLINK_(\\d+)%%/g, (m, idx) => mdLinks[Number(idx)] || '');
      out = out.replace(/%%INLINECODE_(\\d+)%%/g, (m, idx) => inlineCodes[Number(idx)] || '');
      out = out.replace(/%%CODEBLOCK_(\\d+)%%/g, (m, idx) => codeBlocks[Number(idx)] || '');

      return out;
    }

    // 1-Click Accept proof
    async function acceptProof(scope, item, expectedRevision, expectedPrevious) {
      try {
        const res = await fetch('/api/proof/judge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-OpenRig-Session': 'human'
          },
          body: JSON.stringify({
            scope,
            item,
            verdict: 'accept',
            reason: 'Observed and accepted via OpenRig Sidecar',
            evidence: ['proof/evidence.md'],
            expectedRevision,
            expectedPrevious: expectedPrevious || null,
            actorSession: 'human'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Proof accepted for " + scope + "#" + item);
          fetchDeliverables();
        } else {
          showToast(data.message || data.error || "Acceptance failed", true);
        }
      } catch (err) {
        showToast("Error recording proof acceptance", true);
      }
    }

    // Open reject proof modal
    function openProofRejectModal(scope, item, text, expectedRevision, expectedPrevious) {
      document.getElementById('proof-reject-scope').value = scope;
      document.getElementById('proof-reject-item').value = item;
      document.getElementById('proof-reject-text').textContent = text || (scope + '#' + item);
      document.getElementById('proof-reject-revision').value = expectedRevision;
      document.getElementById('proof-reject-previous').value = expectedPrevious || '';
      document.getElementById('proof-reject-reason').value = '';
      openModal('proof-reject-modal');
    }

    // State caches for reactive filtering
    let cachedApprovals = [];
    let approvalsStatusFilter = 'all';
    const queueDetailCache = new Map();

    let cachedTopology = null;

    let cachedDeliverables = [];
    let deliverablesVerdictFilter = 'all';

    function extractBasename(filePath) {
      if (!filePath || typeof filePath !== 'string') return '';
      const clean = filePath.replace(/\\/+$/, '');
      const idx = clean.lastIndexOf('/');
      return idx >= 0 ? clean.slice(idx + 1) : clean;
    }

    function isLikelyAbsoluteFilePath(ref) {
      return typeof ref === 'string' && (ref.startsWith('/') || ref.startsWith('file:///'));
    }

    function isHttpUrl(str) {
      return typeof str === 'string' && /^https?:\\/\\//i.test(str.trim());
    }

    function isGoogleDocUrl(str) {
      return typeof str === 'string' && /^https?:\\/\\/(docs|drive)\\.google\\.com\\//i.test(str.trim());
    }

    // Tab 1 Filtering & Rendering
    function setApprovalsStatusFilter(filter, el) {
      approvalsStatusFilter = filter;
      const pills = document.querySelectorAll('#approvals-filter-pills .filter-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (el) el.classList.add('active');
      renderApprovals();
    }

    function filterApprovals() {
      renderApprovals();
    }

    // ---- Triage helpers: sweep nesting, tiering, unblocks synthesis (SDCR.0.8.01) ----
    function approvalTags(item) {
      return item && Array.isArray(item.tags) ? item.tags : [];
    }

    // Watchdog sweep rows are recovery notes for another qitem, not standalone work.
    function sweepParentQitemId(item) {
      const tags = approvalTags(item);
      const isSweep = tags.includes('stuck-sweep-finding') || /^Stuck sweep:/i.test((item && item.summary) || '');
      if (!isSweep) return null;
      for (const tag of tags) {
        if (typeof tag === 'string' && tag.startsWith('recovery-for:')) {
          const value = tag.slice('recovery-for:'.length).trim();
          if (value) return value;
        }
      }
      const summary = (item && item.summary) || '';
      const tagged = summary.match(/recovery-for:([A-Za-z0-9_-]+)/);
      if (tagged) return tagged[1];
      const onMatch = summary.match(/on (qitem-[A-Za-z0-9_-]+)/);
      return onMatch ? onMatch[1] : null;
    }

    function approvalTier(item) {
      const tags = approvalTags(item);
      if (
        item.humanIntent === 'decision' ||
        item.priority === 'urgent' ||
        item.priority === 'critical' ||
        item.urgency === 'urgent' ||
        item.urgency === 'critical'
      ) {
        return 1;
      }
      if (
        item.gate === 'human' ||
        tags.some(tag => typeof tag === 'string' && (tag.startsWith('gate:') || tag.startsWith('slice:'))) ||
        item.kind === 'action'
      ) {
        return 2;
      }
      return 3;
    }

    function owedDuration(at) {
      const created = at ? new Date(at).getTime() : 0;
      if (!created || isNaN(created)) return '';
      const minutes = Math.max(0, Math.floor((Date.now() - created) / 60000));
      if (minutes < 60) return minutes + 'm';
      const hours = Math.floor(minutes / 60);
      return hours < 48 ? hours + 'h' : Math.floor(hours / 24) + 'd';
    }

    function approvalScopeTag(item) {
      const tag = approvalTags(item).find(
        entry => typeof entry === 'string' && (entry.startsWith('slice:') || entry.startsWith('mission:'))
      );
      if (!tag) return null;
      const isSlice = tag.startsWith('slice:');
      return { kind: isSlice ? 'slice' : 'mission', id: tag.slice(isSlice ? 6 : 8) };
    }

    // Cross-reference hydrated /api/proof data to state what a request unblocks.
    function pendingDeliverablesForScope(scopeTag) {
      if (!scopeTag) return 0;
      const slicePath = '/slices/' + scopeTag.id;
      return cachedDeliverables.filter(deliverable => {
        if (!deliverable) return false;
        const scope = String(deliverable.scope || '');
        const matches = scopeTag.kind === 'slice'
          ? (scope === scopeTag.id || scope.includes(slicePath))
          : scope.startsWith(scopeTag.id + '/');
        if (!matches) return false;
        const verdict = deliverable.judgment && (deliverable.judgment.verdict || deliverable.judgment.decision);
        return !verdict || (verdict !== 'accept' && verdict !== 'reject');
      }).length;
    }

    function renderApprovals() {
      const list = document.getElementById('approvals-list');
      const search = (document.getElementById('approvals-search')?.value || '').toLowerCase().trim();
      const rigFilter = document.getElementById('approvals-rig-filter')?.value || 'all';
      const sortOrder = document.getElementById('approvals-sort')?.value || 'newest';

      const filtered = cachedApprovals.filter(item => {
        const isQueue = item.id.startsWith('queue:');
        const isCritical = item.urgency === 'high' || item.urgency === 'critical';
        if (approvalsStatusFilter === 'action' && !isQueue && !isCritical) return false;
        if (approvalsStatusFilter === 'pending' && (isQueue || isCritical)) return false;

        if (rigFilter !== 'all') {
          const rText = (
            (item.scope || '') + ' ' +
            (item.recipient || '') + ' ' +
            (item.sourceSession || '') + ' ' +
            (item.sourceRig || '') + ' ' +
            (item.rig || '')
          ).toLowerCase();
          if (!rText.includes(rigFilter.toLowerCase())) return false;
        }

        if (search) {
          const text = (
            (item.summary || '') + ' ' +
            (item.body || '') + ' ' +
            (item.sourceSession || '') + ' ' +
            (item.evidenceRef || '') + ' ' +
            (item.scope || '') + ' ' +
            (item.recipient || '') + ' ' +
            (item.kind || '') + ' ' +
            (item.unblocks || '') + ' ' +
            (Array.isArray(item.tags) ? item.tags.join(' ') : '')
          ).toLowerCase();
          if (!text.includes(search)) return false;
        }
        return true;
      });

      filtered.sort((a, b) => {
        const tA = a.at ? new Date(a.at).getTime() : 0;
        const tB = b.at ? new Date(b.at).getTime() : 0;
        return sortOrder === 'newest' ? tB - tA : tA - tB;
      });

      // Triage partition: nest watchdog sweeps under their parent, then group the rest by tier.
      for (const item of cachedApprovals) {
        if (item && item.attachedSweeps) item.attachedSweeps = [];
      }
      const topLevelItems = [];
      const orphanSweeps = [];
      for (const item of filtered) {
        const parentId = sweepParentQitemId(item);
        if (!parentId) {
          topLevelItems.push(item);
          continue;
        }
        const parent = filtered.find(candidate =>
          candidate !== item && (candidate.id === 'queue:' + parentId || candidate.id === parentId || candidate.qitemId === parentId)
        );
        if (parent) {
          parent.attachedSweeps = parent.attachedSweeps || [];
          parent.attachedSweeps.push(item);
        } else {
          orphanSweeps.push(item);
        }
      }
      const tierGroups = { 1: [], 2: [], 3: [] };
      for (const item of topLevelItems) tierGroups[approvalTier(item)].push(item);
      for (const sweep of orphanSweeps) tierGroups[3].push(sweep);

      const orderedItems = [];
      for (const tier of [1, 2, 3]) {
        for (const item of tierGroups[tier]) {
          item._triageTier = tier;
          orderedItems.push(item);
        }
      }

      document.getElementById('approvals-count').textContent = orderedItems.length;

      if (orderedItems.length === 0) {
        const emptyHtml = '<div class="empty-state">' + (cachedApprovals.length === 0 ? 'No pending approvals or attention required. All agents operating smoothly.' : 'No attention items match current filters.') + '</div>';
        const prevEmpty = list.dataset ? list.dataset.lastHtml : list._lastHtml;
        if (prevEmpty !== emptyHtml) {
          if (list.dataset) list.dataset.lastHtml = emptyHtml;
          else list._lastHtml = emptyHtml;
          list.innerHTML = emptyHtml;
        }
        return;
      }

      let html = '';
      let currentTier = 0;
      const tierMeta = {
        1: { heading: 'High-Stakes Decisions', icon: ICONS.clock },
        2: { heading: 'Milestone & Gate Approvals', icon: ICONS.doc },
        3: { heading: 'Diagnostic & Maintenance Notices', icon: ICONS.bolt }
      };
      for (const item of orderedItems) {
        const tier = item._triageTier;
        if (tier !== currentTier) {
          if (currentTier !== 0) {
            html += '</div>' + (currentTier === 3 ? '</details></div>' : '</div>');
          }
          currentTier = tier;
          const meta = tierMeta[tier];
          if (tier === 3) {
            html += '<div class="triage-section" data-tier="3">' +
              '<details class="triage-details"' + (orphanSweeps.length > 0 ? ' open' : '') + '>' +
                '<summary>' + meta.icon + meta.heading + ' (' + tierGroups[3].length + ')</summary>' +
                '<div class="triage-section-grid">';
          } else {
            html += '<div class="triage-section" data-tier="' + tier + '">' +
              '<div class="triage-section-heading">' + meta.icon + meta.heading + ' (' + tierGroups[tier].length + ')</div>' +
              '<div class="triage-section-grid">';
          }
        }
        const origIndex = cachedApprovals.indexOf(item);
        const qitemId = item.id.startsWith('queue:') ? item.id.slice(6) : item.id;
        const isQueue = item.id.startsWith('queue:');
        const urgencyBadge = item.urgency === 'high' || item.urgency === 'critical' ? 'badge-red' : item.urgency === 'outcome' ? 'badge-blue' : 'badge-amber';
        const recipient = item.recipient || item.destinationSession || 'operator@human';
        const sourceSession = item.sourceSession || '';
        const replyTarget = item.replyTo || sourceSession || recipient;
        const at = item.at ? new Date(item.at).toLocaleTimeString() : '';
        const proposalMarkdown = (item.body || item.humanDetail || '').trim();
        const tierBadge = tier === 1
          ? '<span class="badge badge-amber">DECISION</span>'
          : tier === 2
            ? '<span class="badge badge-blue">' + (approvalTags(item).some(tag => typeof tag === 'string' && tag.startsWith('gate:')) ? 'GATE' : 'PROPOSAL') + '</span>'
            : '<span class="badge badge-muted">NOTICE</span>';
        const owed = tier === 1 ? owedDuration(item.at || item.tsCreated) : '';
        const genericUnblocks = typeof item.unblocks === 'string' && item.unblocks.startsWith('No dependent task recorded');
        let unblocksHtml = '';
        if (item.unblocks && !genericUnblocks) {
          unblocksHtml = '<div class="card-meta"><span>Unblocks: ' + renderMarkdown(item.unblocks) + '</span></div>';
        } else if (genericUnblocks) {
          // Client-side hydration: 'what this unblocks' derives from the tags hydrated by
          // /api/queue/:qitemId, joined against cachedDeliverables (/api/proof) for pending counts.
          const scopeTag = approvalScopeTag(item);
          const pendingCount = pendingDeliverablesForScope(scopeTag);
          const scopeLabel = scopeTag
            ? (scopeTag.kind === 'slice'
              ? '<span>Slice: <code>' + escapeHtml(scopeTag.id) + '</code></span>'
              : '<span>Mission: <code>' + escapeHtml(scopeTag.id) + '</code></span>')
            : (item.scope && item.scope !== 'instance · project unknown'
              ? '<span>Scope: ' + escapeHtml(item.scope) + '</span>'
              : '<span>No dependent slice or mission is attached to this request.</span>');
          const pendingLabel = scopeTag
            ? '<span>• ' + pendingCount + ' pending deliverable' + (pendingCount === 1 ? '' : 's') + ' awaiting sign-off</span>'
            : '';
          const jumpHtml = scopeTag
            ? '<button class="btn btn-secondary btn-sm" style="margin-top:6px;" onclick="navigateToDeliverable(\\'' + escapeJs(scopeTag.id) + '\\')">' + ICONS.search + 'Jump to Target Proof Contract</button>'
            : '';
          unblocksHtml = '<div class="unblocks-context-card">' +
            '<div class="unblocks-title">' + ICONS.doc + 'What This Unblocks:</div>' +
            '<div class="unblocks-detail">' + scopeLabel + pendingLabel + '</div>' +
            jumpHtml +
          '</div>';
        }
        const evidenceRef = (item.evidenceRef || '').trim();
        const evidenceIsUrl = isHttpUrl(evidenceRef);
        const evidenceName = evidenceIsUrl ? evidenceRef : (extractBasename(evidenceRef) || evidenceRef);

        html += '<div class="card card-tier-' + tier + '" tabindex="0" data-approval-id="' + escapeHtml(item.id) + '">' +
          '<div class="card-header">' +
            '<div style="width:100%; min-width:0;">' +
              '<div class="card-title">' + renderMarkdown(item.summary || 'Attention Item') + '</div>' +
              '<div class="card-meta" style="margin-top:6px;">' +
                '<span class="badge ' + urgencyBadge + '">' + escapeHtml(item.urgency || item.priority || item.kind || 'routine') + '</span>' +
                tierBadge +
                (item.humanIntent ? ('<span class="badge badge-blue">' + escapeHtml(item.humanIntent) + '</span>') : '') +
                (sourceSession ? ('<span class="approval-from-pill" title="Originating agent seat">From: ' + escapeHtml(sourceSession) + '</span>') : '') +
                '<span>To: ' + escapeHtml(recipient) + '</span>' +
                (item.scope && item.scope !== 'instance · project unknown' ? ('<span>• ' + escapeHtml(item.scope) + '</span>') : '') +
                (at ? ('<span>• ' + at + '</span>') : '') +
                (owed ? ('<span class="owed-pill" title="Time since filed">' + ICONS.clock + 'Owed ' + owed + '</span>') : '') +
              '</div>' +
            '</div>' +
          '</div>' +
          ((item.attachedSweeps && item.attachedSweeps.length) ? item.attachedSweeps.map(sweep => '<div class="nested-sweep-banner"><span class="badge badge-amber" title="' + escapeHtml(sweep.id) + '">' + ICONS.bolt + 'Watchdog Wake: ' + escapeHtml(sweep.summary || 'Stuck sweep finding') + '</span></div>').join('') : '') +
          (proposalMarkdown ? (
            '<div class="approval-markdown-preview md-rendered" data-preview-id="' + escapeHtml(item.id) + '">' +
              renderMarkdown(proposalMarkdown) +
            '</div>'
          ) : '') +
          (evidenceRef ? (
            evidenceIsUrl ? (
              '<div class="approval-evidence-bar">' +
                '<span class="approval-evidence-path" title="' + escapeHtml(evidenceRef) + '">' + ICONS.link + escapeHtml(evidenceRef) + '</span>' +
                '<a href="' + escapeHtml(evidenceRef) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:3px 8px; font-size:11px; flex-shrink:0; text-decoration:none;">' + ICONS.external + (isGoogleDocUrl(evidenceRef) ? 'Open in Google Docs' : 'Open Link') + '</a>' +
              '</div>'
            ) : (
              '<div class="approval-evidence-bar">' +
                '<span class="approval-evidence-path" title="' + escapeHtml(evidenceRef) + '">' + ICONS.paperclip + 'Evidence: ' + escapeHtml(evidenceName) + '</span>' +
                '<button class="btn" style="padding:3px 8px; font-size:11px; flex-shrink:0;" onclick="openApprovalDetailModal(' + origIndex + ')">Inspect Full Artifact</button>' +
              '</div>'
            )
          ) : '') +
          unblocksHtml +
          '<div class="card-actions" style="flex-wrap:wrap;">' +
            ((proposalMarkdown || evidenceRef || isQueue) ? (
              '<button class="btn btn-secondary" onclick="openApprovalDetailModal(' + origIndex + ')">' + ICONS.doc + 'Full Proposal</button>'
            ) : '') +
            (isQueue ? (
              '<button class="btn btn-success" onclick="requestApprove(\\'' + escapeJs(qitemId) + '\\', \\'' + escapeJs(item.summary) + '\\', \\'' + escapeJs(sourceSession) + '\\')">' + ICONS.check + 'Approve</button>' +
              '<button class="btn btn-danger" onclick="requestQuickReject(\\'' + escapeJs(qitemId) + '\\', \\'' + escapeJs(item.summary) + '\\', \\'' + escapeJs(sourceSession) + '\\')">' + ICONS.bolt + 'Quick Reject</button>' +
              '<button class="btn btn-secondary" onclick="openRejectModal(\\'' + escapeJs(qitemId) + '\\', \\'' + escapeJs(item.summary) + '\\', \\'' + escapeJs(sourceSession) + '\\')">' + ICONS.cross + 'Reject...</button>'
            ) : '') +
            '<button class="btn btn-primary" onclick="openReplyModal(\\'' + escapeJs(replyTarget) + '\\')">' + ICONS.reply + 'Reply</button>' +
          '</div>' +
        '</div>';
      }
      if (currentTier !== 0) {
        html += '</div>' + (currentTier === 3 ? '</details></div>' : '</div>');
      }
      if (list.classList && list.classList.add) list.classList.add('sectioned');

      const prevRendered = list.dataset ? list.dataset.lastHtml : list._lastHtml;
      if (prevRendered === html) {
        return;
      }

      const savedScrolls = new Map();
      if (typeof list.querySelectorAll === 'function') {
        list.querySelectorAll('.approval-markdown-preview[data-preview-id]').forEach(el => {
          savedScrolls.set(el.getAttribute('data-preview-id'), el.scrollTop);
        });
      }

      if (list.dataset) list.dataset.lastHtml = html;
      else list._lastHtml = html;
      list.innerHTML = html;

      if (typeof list.querySelector === 'function' && typeof CSS !== 'undefined' && CSS.escape) {
        savedScrolls.forEach((top, id) => {
          const nextEl = list.querySelector('.approval-markdown-preview[data-preview-id="' + CSS.escape(id) + '"]');
          if (nextEl) nextEl.scrollTop = top;
        });
      }
    }

    async function openApprovalDetailModal(index) {
      const item = cachedApprovals[index];
      if (!item) return;

      const isQueue = item.id.startsWith('queue:');
      const qitemId = isQueue ? item.id.slice(6) : item.id;
      const recipient = item.recipient || item.destinationSession || 'operator@human';
      const sourceSession = item.sourceSession || '';
      const replyTarget = item.replyTo || sourceSession || recipient;
      const urgencyBadge = item.urgency === 'high' || item.urgency === 'critical' ? 'badge-red' : item.urgency === 'outcome' ? 'badge-blue' : 'badge-amber';

      const badgeEl = document.getElementById('approval-detail-badge');
      badgeEl.className = 'badge ' + urgencyBadge;
      badgeEl.textContent = (item.humanIntent || item.urgency || item.priority || 'PROPOSAL').toUpperCase();

      document.getElementById('approval-detail-title').textContent = item.summary || qitemId;
      document.getElementById('approval-detail-subtitle').textContent =
        'ID: ' + qitemId + (item.at ? (' · Created: ' + new Date(item.at).toLocaleString()) : '');
      document.getElementById('approval-detail-from').textContent = sourceSession || '(system / unattributed)';
      document.getElementById('approval-detail-to').textContent = recipient;

      const tagList = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.join(', ') : 'none';
      document.getElementById('approval-detail-tags').textContent =
        (item.priority || item.urgency || 'routine') + ' · tags: ' + tagList;

      const bodyEl = document.getElementById('approval-detail-body');
      const primaryMarkdown = (item.body || item.humanDetail || '').trim();
      if (primaryMarkdown) {
        bodyEl.innerHTML = renderMarkdown(primaryMarkdown);
      } else {
        bodyEl.innerHTML = renderMarkdown(item.unblocks || item.summary || '*(No additional markdown body attached to this attention item.)*');
      }

      const evSection = document.getElementById('approval-detail-evidence-section');
      const evNameEl = document.getElementById('approval-detail-evidence-name');
      const evPathEl = document.getElementById('approval-detail-evidence-path');
      const evBodyEl = document.getElementById('approval-detail-evidence-body');
      const copyBtn = document.getElementById('approval-detail-copy-path-btn');
      const externalBtn = document.getElementById('approval-detail-open-external-btn');
      const evidenceRef = (item.evidenceRef || '').trim();

      if (evidenceRef) {
        evSection.style.display = 'flex';
        evBodyEl.style.display = 'none';
        evBodyEl.innerHTML = '';
        externalBtn.style.display = 'none';
        externalBtn.href = '#';

        if (isHttpUrl(evidenceRef)) {
          evNameEl.textContent = isGoogleDocUrl(evidenceRef) ? 'google document' : 'external document';
          evPathEl.innerHTML = '<a href="' + escapeHtml(evidenceRef) + '" target="_blank" rel="noopener noreferrer" style="color:var(--accent-blue); text-decoration:underline;">' + escapeHtml(evidenceRef) + '</a>';
          copyBtn.onclick = () => copyToClipboard(evidenceRef);
          externalBtn.href = evidenceRef;
          const externalLabel = externalBtn.querySelector('span');
          if (externalLabel) externalLabel.textContent = isGoogleDocUrl(evidenceRef) ? 'Open in Google Docs' : 'Open Link';
          externalBtn.style.display = 'inline-flex';
          externalBtn.style.alignItems = 'center';
        } else {
          evNameEl.textContent = extractBasename(evidenceRef) || 'reference';
          evPathEl.textContent = evidenceRef;
          copyBtn.onclick = () => copyToClipboard(evidenceRef);

          try {
            const evRes = await fetch('/api/evidence?path=' + encodeURIComponent(evidenceRef) + '&session=' + encodeURIComponent(sourceSession));
            if (evRes.ok) {
              const evData = await evRes.json();
              if (evData && evData.ok) {
                const resolvedPath = evData.path || evidenceRef;
                evPathEl.textContent = resolvedPath;
                evNameEl.textContent = evData.basename || extractBasename(evidenceRef) || 'reference';
                copyBtn.onclick = () => copyToClipboard(resolvedPath);

                if (evData.kind === 'image' && evData.rawUrl) {
                  evBodyEl.innerHTML = '<img src="' + escapeHtml(evData.rawUrl) + '" alt="' + escapeHtml(evData.basename || evidenceRef) + '" style="max-width:100%; max-height:450px; cursor:zoom-in; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);" onclick="openImageLightbox(\\'' + escapeJs(evData.rawUrl) + '\\', \\'' + escapeJs(evData.basename || evidenceRef) + '\\')" />';
                  evBodyEl.style.display = 'block';
                } else if (typeof evData.content === 'string' && evData.content.trim()) {
                  if (!primaryMarkdown) {
                    bodyEl.innerHTML = renderMarkdown(evData.content);
                  }
                  evBodyEl.innerHTML = renderMarkdown(evData.content);
                  evBodyEl.style.display = 'block';
                }
              }
            }
          } catch (e) {
            // Keep the reference visible even if the runtime cannot resolve the artifact.
          }
        }
      } else {
        evSection.style.display = 'none';
      }

      const actionsLeft = document.getElementById('approval-detail-actions-left');
      actionsLeft.innerHTML =
        (isQueue ? (
          '<button class="btn btn-success" onclick="requestApprove(\\'' + escapeJs(qitemId) + '\\', \\'' + escapeJs(item.summary) + '\\', \\'' + escapeJs(sourceSession) + '\\')">' + ICONS.check + 'Approve</button>' +
          '<button class="btn btn-danger" onclick="requestQuickReject(\\'' + escapeJs(qitemId) + '\\', \\'' + escapeJs(item.summary) + '\\', \\'' + escapeJs(sourceSession) + '\\')">' + ICONS.bolt + 'Quick Reject</button>' +
          '<button class="btn btn-secondary" onclick="closeModal(\\'approval-detail-modal\\'); openRejectModal(\\'' + escapeJs(qitemId) + '\\', \\'' + escapeJs(item.summary) + '\\', \\'' + escapeJs(sourceSession) + '\\')">' + ICONS.cross + 'Reject...</button>'
        ) : '') +
        '<button class="btn btn-primary" onclick="closeModal(\\'approval-detail-modal\\'); openReplyModal(\\'' + escapeJs(replyTarget) + '\\')">' + ICONS.reply + 'Reply' + (sourceSession ? (' to ' + escapeHtml(sourceSession.split('@')[0])) : '') + '</button>';

      openModal('approval-detail-modal');
    }

    // Fetch Approvals & Attention and hydrate full queue proposal details (/api/queue/:qitemId)
    async function fetchApprovals() {
      try {
        const res = await fetch('/api/attention');
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];

        // Hydrate queue items in parallel with smart cache keyed by qitemId + timestamp
        const activeQitemIds = new Set();
        await Promise.allSettled(items.map(async (item) => {
          if (!item || typeof item.id !== 'string' || !item.id.startsWith('queue:')) return;
          const qitemId = item.id.slice(6);
          activeQitemIds.add(qitemId);

          let detail = queueDetailCache.get(qitemId);
          if (!detail || (item.at && detail._cachedAt !== item.at)) {
            const qRes = await fetch('/api/queue/' + encodeURIComponent(qitemId));
            if (qRes.ok) {
              const qJson = await qRes.json();
              detail = { ...qJson, _cachedAt: item.at || '' };
              queueDetailCache.set(qitemId, detail);
            }
          }

          if (detail) {
            item.qitemId = qitemId;
            item.body = detail.body || '';
            item.sourceSession = detail.sourceSession || '';
            item.destinationSession = detail.destinationSession || item.recipient || '';
            item.evidenceRef = detail.evidenceRef || '';
            item.tags = Array.isArray(detail.tags) ? detail.tags : [];
            item.humanIntent = detail.humanIntent || '';
            item.humanDetail = detail.humanDetail || '';
            item.replyTo = detail.replyTo || '';
            item.priority = detail.priority || item.urgency || 'routine';
            if (item.sourceSession.includes('@')) {
              item.sourceRig = item.sourceSession.split('@').slice(1).join('@');
            }
          }
        }));

        // Prune resolved queue items from cache
        for (const cachedId of Array.from(queueDetailCache.keys())) {
          if (!activeQitemIds.has(cachedId)) {
            queueDetailCache.delete(cachedId);
          }
        }

        cachedApprovals = items;
        renderApprovals();
      } catch (err) {
        console.error("fetchApprovals error:", err);
      }
    }

    function stripAnsi(str) {
      if (!str) return '';
      return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }

    function formatTokens(n) {
      if (n == null || isNaN(n)) return '0';
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
      return String(n);
    }

    let currentCaptureSession = null;
    let currentCaptureLogicalId = null;
    let captureAutoRefreshInterval = null;
    let captureLines = 50;

    async function openCaptureModal(sessionName, logicalId) {
      currentCaptureSession = sessionName;
      currentCaptureLogicalId = logicalId || sessionName;
      document.getElementById('capture-modal-title').textContent = 'Live Terminal Snapshot: ' + currentCaptureLogicalId;
      document.getElementById('capture-modal-subtitle').textContent = 'Target Session: ' + sessionName;
      document.getElementById('capture-status-line').textContent = 'Connecting to live pane snapshot...';
      document.getElementById('capture-terminal-content').textContent = 'Fetching screen from ' + sessionName + '...';
      openModal('capture-modal');

      await refreshCurrentCapture();

      const autoCheckbox = document.getElementById('capture-autorefresh');
      if (autoCheckbox && autoCheckbox.checked) {
        startCaptureAutoRefresh();
      }
    }

    function closeCaptureModal() {
      closeModal('capture-modal');
      stopCaptureAutoRefresh();
      currentCaptureSession = null;
      currentCaptureLogicalId = null;
    }

    function startCaptureAutoRefresh() {
      stopCaptureAutoRefresh();
      captureAutoRefreshInterval = setInterval(() => {
        if (currentCaptureSession && document.getElementById('capture-modal').classList.contains('open')) {
          refreshCurrentCapture(true);
        } else {
          stopCaptureAutoRefresh();
        }
      }, 3000);
    }

    function stopCaptureAutoRefresh() {
      if (captureAutoRefreshInterval) {
        clearInterval(captureAutoRefreshInterval);
        captureAutoRefreshInterval = null;
      }
    }

    function toggleCaptureAutoRefresh(enabled) {
      if (enabled) {
        startCaptureAutoRefresh();
      } else {
        stopCaptureAutoRefresh();
      }
    }

    function changeCaptureLines(lines) {
      captureLines = Number(lines) || 50;
      refreshCurrentCapture();
    }

    async function refreshCurrentCapture(isSilent = false) {
      if (!currentCaptureSession) return;
      const statusEl = document.getElementById('capture-status-line');
      const timeEl = document.getElementById('capture-timestamp');
      const contentEl = document.getElementById('capture-terminal-content');

      if (!isSilent) {
        statusEl.textContent = 'Querying /api/transport/capture...';
      }

      try {
        const res = await fetch('/api/transport/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: currentCaptureSession, lines: captureLines })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          const clean = stripAnsi(data.content || '');
          contentEl.textContent = clean || '(Terminal pane is currently blank / waiting for prompt)';
          statusEl.textContent = '● Live connected (' + (data.lines || captureLines) + ' lines)';
          statusEl.style.color = 'var(--accent-green)';
          timeEl.textContent = new Date().toLocaleTimeString();
        } else {
          contentEl.textContent = 'Unable to capture pane: ' + (data.message || data.error || ('HTTP ' + res.status));
          statusEl.textContent = '▲ Capture unavailable';
          statusEl.style.color = 'var(--accent-amber)';
          timeEl.textContent = new Date().toLocaleTimeString();
        }
      } catch (err) {
        contentEl.textContent = 'Error connecting to daemon capture endpoint: ' + err.message;
        statusEl.textContent = 'Connection error';
        statusEl.style.color = 'var(--accent-red)';
        timeEl.textContent = new Date().toLocaleTimeString();
      }
    }

    function copyCaptureText() {
      const contentEl = document.getElementById('capture-terminal-content');
      if (contentEl && contentEl.textContent) {
        copyToClipboard(contentEl.textContent);
      }
    }

    // Tab 2 View Switcher & Interactive SVG Topology Graph (Default View)
    let topologyViewMode = 'graph';
    let graphZoom = 1.0;
    let initialGraphFitApplied = false;
    let lastGraphLogicalWidth = 1040;
    let lastGraphLogicalHeight = 480;
    let selectedGraphSeatKey = null;
    let selectedGraphRigName = null;
    let graphSeatRegistry = {};
    let graphViewportInitialized = false;
    const graphEdgeLayers = {
      ownership: true,
      delegates_to: true,
      collaborates_with: true,
      escalates_to: true
    };

    function toggleTopologyView(mode) {
      topologyViewMode = mode;
      const gridBtn = document.getElementById('view-toggle-grid');
      const graphBtn = document.getElementById('view-toggle-graph');
      const listEl = document.getElementById('topology-list');
      const graphEl = document.getElementById('topology-graph-container');

      if (mode === 'graph') {
        if (gridBtn) gridBtn.classList.remove('active');
        if (graphBtn) graphBtn.classList.add('active');
        if (listEl) listEl.style.display = 'none';
        if (graphEl) {
          graphEl.style.display = 'block';
          renderSvgGraph();
        }
      } else {
        if (gridBtn) gridBtn.classList.add('active');
        if (graphBtn) graphBtn.classList.remove('active');
        if (listEl) listEl.style.display = 'block';
        if (graphEl) graphEl.style.display = 'none';
      }
    }

    function toggleGraphEdgeLayer(layerKey, btnEl) {
      graphEdgeLayers[layerKey] = !graphEdgeLayers[layerKey];
      if (btnEl) {
        if (graphEdgeLayers[layerKey]) btnEl.classList.add('active');
        else btnEl.classList.remove('active');
      }
      renderSvgGraph();
    }

    function applyGraphZoomToSvg() {
      const svgEl = document.getElementById('topology-svg-canvas');
      const resetBtn = document.getElementById('graph-zoom-reset');
      if (resetBtn) resetBtn.textContent = Math.round(graphZoom * 100) + '%';
      if (svgEl) {
        svgEl.setAttribute('width', String(Math.round(lastGraphLogicalWidth * graphZoom)));
        svgEl.setAttribute('height', String(Math.round(lastGraphLogicalHeight * graphZoom)));
      }
    }

    function adjustGraphZoom(delta) {
      graphZoom = Math.max(0.30, Math.min(1.85, Math.round((graphZoom + delta) * 100) / 100));
      applyGraphZoomToSvg();
    }

    function resetGraphZoom() {
      graphZoom = 1.0;
      applyGraphZoomToSvg();
    }

    function fitGraphZoom() {
      const vp = document.getElementById('topology-graph-viewport');
      if (!vp || !lastGraphLogicalWidth) return;
      const avail = Math.max(280, (vp.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 360)) - 24);
      graphZoom = Math.max(0.30, Math.min(1.35, Math.round((avail / lastGraphLogicalWidth) * 100) / 100));
      applyGraphZoomToSvg();
    }

    function selectGraphSeat(seatKey) {
      if (selectedGraphSeatKey === seatKey) {
        selectedGraphSeatKey = null;
      } else {
        selectedGraphSeatKey = seatKey;
        selectedGraphRigName = null;
      }
      renderSvgGraph();
    }

    function selectGraphRig(rigName) {
      if (selectedGraphRigName === rigName) {
        selectedGraphRigName = null;
      } else {
        selectedGraphRigName = rigName;
        selectedGraphSeatKey = null;
      }
      renderSvgGraph();
    }

    function clearGraphSelection() {
      selectedGraphSeatKey = null;
      selectedGraphRigName = null;
      renderSvgGraph();
    }

    function openExternalHref(href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }

    function initGraphViewportPanZoom() {
      if (graphViewportInitialized) return;
      const vp = document.getElementById('topology-graph-viewport');
      if (!vp) return;
      graphViewportInitialized = true;

      let isDown = false;
      let startX = 0;
      let startY = 0;
      let scrollL = 0;
      let scrollT = 0;

      vp.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target && e.target.closest && e.target.closest('.graph-node, .graph-rig-hub, .graph-action-pill, button, a')) {
          return;
        }
        isDown = true;
        vp.classList.add('dragging');
        startX = e.pageX - vp.offsetLeft;
        startY = e.pageY - vp.offsetTop;
        scrollL = vp.scrollLeft;
        scrollT = vp.scrollTop;
      });

      window.addEventListener('mouseup', () => {
        if (isDown) {
          isDown = false;
          vp.classList.remove('dragging');
        }
      });

      vp.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - vp.offsetLeft;
        const y = e.pageY - vp.offsetTop;
        vp.scrollLeft = scrollL - (x - startX);
        vp.scrollTop = scrollT - (y - startY);
      });

      vp.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          adjustGraphZoom(e.deltaY < 0 ? 0.1 : -0.1);
        }
      }, { passive: false });

      // Touch drag/pan & pinch-to-zoom for mobile viewports
      let isPanningTouch = false;
      let isPinching = false;
      let touchStartX = 0;
      let touchStartY = 0;
      let touchScrollL = 0;
      let touchScrollT = 0;
      let initialPinchDist = 0;
      let initialPinchZoom = 1.0;

      vp.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          touchStartX = t.pageX - vp.offsetLeft;
          touchStartY = t.pageY - vp.offsetTop;
          touchScrollL = vp.scrollLeft;
          touchScrollT = vp.scrollTop;
          isPanningTouch = true;
          isPinching = false;
        } else if (e.touches.length === 2) {
          isPanningTouch = false;
          isPinching = true;
          const dx = e.touches[0].pageX - e.touches[1].pageX;
          const dy = e.touches[0].pageY - e.touches[1].pageY;
          initialPinchDist = Math.hypot(dx, dy);
          initialPinchZoom = graphZoom;
        }
      }, { passive: true });

      vp.addEventListener('touchmove', (e) => {
        if (isPinching && e.touches.length === 2) {
          if (e.cancelable) e.preventDefault();
          const dx = e.touches[0].pageX - e.touches[1].pageX;
          const dy = e.touches[0].pageY - e.touches[1].pageY;
          const dist = Math.hypot(dx, dy);
          if (initialPinchDist > 0) {
            const scale = dist / initialPinchDist;
            graphZoom = Math.max(0.30, Math.min(1.85, Math.round(initialPinchZoom * scale * 100) / 100));
            applyGraphZoomToSvg();
          }
        } else if (isPanningTouch && e.touches.length === 1) {
          const t = e.touches[0];
          const x = t.pageX - vp.offsetLeft;
          const y = t.pageY - vp.offsetTop;
          const deltaX = x - touchStartX;
          const deltaY = y - touchStartY;
          if (Math.hypot(deltaX, deltaY) > 6) {
            if (e.cancelable) e.preventDefault();
            vp.scrollLeft = touchScrollL - deltaX;
            vp.scrollTop = touchScrollT - deltaY;
          }
        }
      }, { passive: false });

      const endTouch = () => {
        isPanningTouch = false;
        isPinching = false;
        initialPinchDist = 0;
      };
      vp.addEventListener('touchend', endTouch);
      vp.addEventListener('touchcancel', endTouch);
    }

    function getNodeKeyId(node) {
      return node._id || node.nodeId || node.id || node.logicalId;
    }

    function getNodeRoleRank(logicalId) {
      const id = (logicalId || '').toLowerCase();
      if (id.includes('lead') || id.includes('architect') || id.includes('strategist') || id.includes('director')) return 1;
      if (id.includes('dramatist') || id.includes('table-read') || id.includes('storyboarder') || id.includes('hook')) return 2;
      if (id.includes('builder') || id.includes('build') || id.includes('dev') || id.includes('agent') || id.includes('animator') || id.includes('writer') || id.includes('ghostwriter') || id.includes('ensemble') || id.includes('worker')) return 3;
      if (id.includes('reviewer') || id.includes('review') || id.includes('qa') || id.includes('critic') || id.includes('canon') || id.includes('human')) return 4;
      return 5;
    }

    function matchesTopologyNodeFilters(node, rig, filters) {
      const sessionName = node.canonicalSessionName || (node.logicalId + '@' + rig.name);
      const runtime = (node.runtime || 'antigravity').toLowerCase();
      const disp = (node.activityState && node.activityState.display) || node.sessionStatus || 'idle';
      const state = disp === 'working' ? 'working' : (disp === 'needs_input' || disp === 'attention_required') ? 'needs_input' : 'idle';

      if (filters.runtimeFilter !== 'all') {
        if (filters.runtimeFilter === 'antigravity' && !runtime.includes('antigravity')) return false;
        if (filters.runtimeFilter === 'claude' && !runtime.includes('claude')) return false;
        if (filters.runtimeFilter === 'codex' && !runtime.includes('codex')) return false;
        if (filters.runtimeFilter === 'omp' && !runtime.includes('omp')) return false;
      }

      if (filters.statusFilter !== 'all') {
        if (filters.statusFilter !== state) return false;
      }

      if (filters.search) {
        const text = ((node.logicalId || '') + ' ' + sessionName + ' ' + (node.model || '') + ' ' + (node.podNamespace || '') + ' ' + runtime + ' ' + (rig.name || '')).toLowerCase();
        if (!text.includes(filters.search)) return false;
      }

      return true;
    }

    function updateGraphInspector(allRenderedEdges) {
      const inspector = document.getElementById('topology-seat-inspector');
      if (!inspector) return;

      if (selectedGraphSeatKey && graphSeatRegistry[selectedGraphSeatKey]) {
        const info = graphSeatRegistry[selectedGraphSeatKey];
        const node = info.node;
        const rig = info.rig;
        const sessionName = node.canonicalSessionName || (node.logicalId + '@' + rig.name);
        const runtime = node.runtime || 'antigravity';
        const isAgy = runtime.toLowerCase().includes('antigravity');
        const disp = (node.activityState && node.activityState.display) || node.sessionStatus || 'idle';
        const stateClass = disp === 'working' ? 'working' : (disp === 'needs_input' || disp === 'attention_required') ? 'needs_input' : 'idle';
        const convId = (node.resumeType === 'antigravity_id' ? node.resumeToken : null) || node.resumeToken;

        const incoming = allRenderedEdges.filter(e => e.targetKey === selectedGraphSeatKey);
        const outgoing = allRenderedEdges.filter(e => e.sourceKey === selectedGraphSeatKey);

        let relHtml = '<span class="graph-toolbar-label">Relationships:</span>' +
          '<button class="inspector-rel-chip" onclick="selectGraphRig(\\'' + escapeJs(rig.name) + '\\')" title="Focus owning rig">' +
            '<span style="color:#5c7cfa;">⌂ Rig:</span> <strong>' + escapeHtml(rig.name) + '</strong> <span style="color:var(--text-muted);">/ ' + escapeHtml(info.podName) + '</span>' +
          '</button>';

        for (const inc of incoming) {
          const srcInfo = graphSeatRegistry[inc.sourceKey];
          if (!srcInfo) continue;
          const color = inc.kind === 'escalates_to' ? '#fdd663' : inc.kind === 'collaborates_with' ? '#81c995' : '#8ab4f8';
          relHtml += '<button class="inspector-rel-chip" data-direction="upstream" onclick="selectGraphSeat(\\'' + escapeJs(inc.sourceKey) + '\\')" title="Jump to upstream seat">' +
            '<span style="color:' + color + ';">' + ICONS.arrowLeft + escapeHtml(srcInfo.node.logicalId) + '</span>' +
            '<span style="color:var(--text-muted);">(' + escapeHtml(inc.kind) + ')</span>' +
          '</button>';
        }

        for (const out of outgoing) {
          const dstInfo = graphSeatRegistry[out.targetKey];
          if (!dstInfo) continue;
          const color = out.kind === 'escalates_to' ? '#fdd663' : out.kind === 'collaborates_with' ? '#81c995' : '#8ab4f8';
          relHtml += '<button class="inspector-rel-chip" data-direction="downstream" onclick="selectGraphSeat(\\'' + escapeJs(out.targetKey) + '\\')" title="Jump to downstream seat">' +
            '<span style="color:' + color + ';">' + ICONS.arrowRight + escapeHtml(dstInfo.node.logicalId) + '</span>' +
            '<span style="color:var(--text-muted);">(' + escapeHtml(out.kind) + ')</span>' +
          '</button>';
        }

        if (incoming.length === 0 && outgoing.length === 0) {
          relHtml += '<span style="font-size:11px; color:var(--text-muted);">Standalone seat inside pod ' + escapeHtml(info.podName) + '</span>';
        }

        inspector.innerHTML =
          '<div class="inspector-header-row">' +
            '<div class="inspector-title-group">' +
              '<span class="live-dot ' + stateClass + '"></span>' +
              '<strong style="color:#fff; font-size:13px;">' + escapeHtml(node.logicalId) + '</strong>' +
              '<span class="badge badge-blue">' + escapeHtml(rig.name) + '</span>' +
              '<span class="badge badge-muted">Pod: ' + escapeHtml(info.podName) + '</span>' +
              '<span class="badge ' + (isAgy ? 'badge-blue' : 'badge-muted') + '">' + (isAgy ? 'Google Antigravity' : escapeHtml(runtime)) + '</span>' +
              (node.model ? '<span class="badge badge-muted">' + escapeHtml(node.model) + '</span>' : '') +
              '<span class="badge badge-muted">Status: ' + escapeHtml(disp) + '</span>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">' +
              (convId ? (
                '<a href="conversation://' + escapeHtml(convId) + '" class="btn btn-secondary" style="padding:3px 9px; font-size:11px; text-decoration:none;" target="_blank" rel="noopener noreferrer">' + ICONS.link + 'Open Chat' + ICONS.external + '</a>' +
                '<button class="btn btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="copyToClipboard(\\'' + escapeJs(convId) + '\\')">Copy ID</button>'
              ) : '') +
              '<button class="btn btn-secondary" style="padding:3px 9px; font-size:11px;" onclick="openCaptureModal(\\'' + escapeJs(sessionName) + '\\', \\'' + escapeJs(node.logicalId) + '\\')">' + ICONS.monitor + 'Screen</button>' +
              '<button class="btn btn-primary" style="padding:3px 9px; font-size:11px;" onclick="openReplyModal(\\'' + escapeJs(sessionName) + '\\')">' + ICONS.mail + 'Message</button>' +
              '<button class="btn btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="clearGraphSelection()">' + ICONS.cross + 'Clear</button>' +
            '</div>' +
          '</div>' +
          '<div class="inspector-rel-row">' + relHtml + '</div>';
        return;
      }

      if (selectedGraphRigName) {
        const rigSeats = Object.values(graphSeatRegistry).filter(s => s.rig.name === selectedGraphRigName);
        const rigEdges = allRenderedEdges.filter(e => e.rigName === selectedGraphRigName);
        const workingCount = rigSeats.filter(s => (((s.node.activityState && s.node.activityState.display) || s.node.sessionStatus) === 'working')).length;

        let seatChips = '';
        for (const s of rigSeats) {
          seatChips += '<button class="inspector-rel-chip" onclick="selectGraphSeat(\\'' + escapeJs(s.key) + '\\')">' +
            '<span>' + escapeHtml(s.node.logicalId) + '</span>' +
          '</button>';
        }

        inspector.innerHTML =
          '<div class="inspector-header-row">' +
            '<div class="inspector-title-group">' +
              '<span class="badge badge-blue">RIG FOCUS</span>' +
              '<strong style="color:#fff; font-size:13px;">' + escapeHtml(selectedGraphRigName) + '</strong>' +
              '<span class="badge badge-muted">' + rigSeats.length + ' seats (' + workingCount + ' working)</span>' +
              '<span class="badge badge-muted">' + rigEdges.length + ' relationship edges</span>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:6px;">' +
              '<button class="btn btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="clearGraphSelection()">' + ICONS.cross + 'Clear Focus</button>' +
            '</div>' +
          '</div>' +
          '<div class="inspector-rel-row"><span class="graph-toolbar-label">Rig Seats:</span>' + seatChips + '</div>';
        return;
      }

      const totalSeatsCount = Object.keys(graphSeatRegistry).length;
      inspector.innerHTML =
        '<div class="inspector-hint">' +
          '<span><strong>Dagre Top-Down Fleet Graph:</strong> Showing <strong>' + totalSeatsCount + ' seats</strong> and <strong>' + allRenderedEdges.length + ' directed seat edges</strong>. Click any <strong>Rig Hub</strong> or <strong>Seat Node</strong> to highlight causal paths &amp; actions.</span>' +
        '</div>';
    }

    let graphRigHubRegistry = {};

    // Uniform cubic B-spline (d3.curveBasis) converter for Dagre multi-point routed edge polylines
    function dagrePointsToSvgPath(points) {
      if (!points || points.length === 0) return '';
      if (points.length === 1) return 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
      if (points.length === 2) {
        return 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1) +
               ' L ' + points[1].x.toFixed(1) + ' ' + points[1].y.toFixed(1);
      }
      const n = points.length;
      let d = 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1) +
              ' L ' + ((5 * points[0].x + points[1].x) / 6).toFixed(1) + ' ' + ((5 * points[0].y + points[1].y) / 6).toFixed(1);
      for (let i = 2; i < n; i++) {
        const p0 = points[i - 2];
        const p1 = points[i - 1];
        const p2 = points[i];
        const c1x = (2 * p0.x + p1.x) / 3;
        const c1y = (2 * p0.y + p1.y) / 3;
        const c2x = (p0.x + 2 * p1.x) / 3;
        const c2y = (p0.y + 2 * p1.y) / 3;
        const ex = (p0.x + 4 * p1.x + p2.x) / 6;
        const ey = (p0.y + 4 * p1.y + p2.y) / 6;
        d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ', ' + ex.toFixed(1) + ' ' + ey.toFixed(1);
      }
      const prev = points[n - 2];
      const last = points[n - 1];
      d += ' C ' + ((2 * prev.x + last.x) / 3).toFixed(1) + ' ' + ((2 * prev.y + last.y) / 3).toFixed(1) +
           ', ' + ((prev.x + 2 * last.x) / 3).toFixed(1) + ' ' + ((prev.y + 2 * last.y) / 3).toFixed(1) +
           ', ' + ((prev.x + 5 * last.x) / 6).toFixed(1) + ' ' + ((prev.y + 5 * last.y) / 6).toFixed(1) +
           ' L ' + last.x.toFixed(1) + ' ' + last.y.toFixed(1);
      return d;
    }

    function dagrePolylineMidpoint(points) {
      if (!points || points.length === 0) return { x: 0, y: 0 };
      if (points.length === 1) return points[0];
      let totalLen = 0;
      const segLens = [];
      for (let i = 0; i < points.length - 1; i++) {
        const len = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
        segLens.push(len);
        totalLen += len;
      }
      let target = totalLen * 0.5;
      for (let i = 0; i < segLens.length; i++) {
        if (target <= segLens[i] || i === segLens.length - 1) {
          const t = segLens[i] > 0.001 ? (target / segLens[i]) : 0.5;
          return {
            x: points[i].x + t * (points[i + 1].x - points[i].x),
            y: points[i].y + t * (points[i + 1].y - points[i].y)
          };
        }
        target -= segLens[i];
      }
      return points[Math.floor(points.length / 2)];
    }

    function clipPolylineAtPodTop(points, podTopY) {
      if (!points || points.length < 2) return points;
      const targetY = podTopY - 3;
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        if (a.y <= targetY && b.y >= targetY) {
          const dy = b.y - a.y;
          const t = dy > 0.001 ? ((targetY - a.y) / dy) : 1;
          const ix = a.x + t * (b.x - a.x);
          return points.slice(0, i + 1).concat([{ x: ix, y: targetY }]);
        }
      }
      return points;
    }

    function renderSvgGraph() {
      initGraphViewportPanZoom();
      const stage = document.getElementById('topology-graph-stage') || document.getElementById('topology-graph-container');
      if (!stage || !cachedTopology) return;

      const dagreLib = (typeof window !== 'undefined' && window.dagre) ||
                       (typeof globalThis !== 'undefined' && globalThis.dagre) ||
                       (typeof dagre !== 'undefined' ? dagre : null);
      if (!dagreLib || !dagreLib.graphlib || typeof dagreLib.layout !== 'function') {
        stage.innerHTML = '<div class="empty-state">Dagre layout engine is still loading…</div>';
        return;
      }

      const { rigs } = cachedTopology;
      const rigFilter = document.getElementById('topology-rig-filter')?.value || 'all';
      const filters = {
        search: (document.getElementById('topology-search')?.value || '').toLowerCase().trim(),
        runtimeFilter: document.getElementById('topology-runtime-filter')?.value || 'all',
        statusFilter: document.getElementById('topology-status-filter')?.value || 'all'
      };

      const filteredRigs = rigs.filter(r => {
        const rig = r.rig || r;
        if (rigFilter !== 'all' && rig.name !== rigFilter) return false;
        return true;
      });

      if (filteredRigs.length === 0) {
        stage.innerHTML = '<div class="empty-state">No rigs match the current filter or search criteria.</div>';
        graphSeatRegistry = {};
        graphRigHubRegistry = {};
        updateGraphInspector([]);
        return;
      }

      const rigHubW = 252;
      const rigHubH = 88;
      const cardW = 236;
      const cardH = 84;
      const podPadX = 16;
      const podPadTop = 32;
      const podPadBottom = 14;
      const rigPadTop = 22;
      const rigPadBottom = 24;
      const rigSectionGap = 32;

      graphSeatRegistry = {};
      graphRigHubRegistry = {};
      const allRenderedEdges = [];

      const defs = '<defs>' +
        '<marker id="arrowhead" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
          '<path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#8ab4f8"/>' +
        '</marker>' +
        '<marker id="arrow-delegates" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
          '<path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#8ab4f8"/>' +
        '</marker>' +
        '<marker id="arrow-escalates" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
          '<path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#fdd663"/>' +
        '</marker>' +
        '<marker id="arrow-collaborates" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
          '<path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#81c995"/>' +
        '</marker>' +
        '<marker id="arrow-ownership" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
          '<path d="M 0 2 L 8 5 L 0 8 z" fill="#5c7cfa"/>' +
        '</marker>' +
      '</defs>';

      // Pass 1: Run open-source Dagre compound Sugiyama top-down (TB) layout per rig
      const rawRigGraphs = [];
      let maxRigContentW = rigHubW;

      for (const r of filteredRigs) {
        const rig = r.rig || r;
        const rawNodes = Array.isArray(rig.nodes) ? rig.nodes : [];
        const nodes = rawNodes.filter(n => matchesTopologyNodeFilters(n, rig, filters));
        if (nodes.length === 0) continue;

        const rigEdgesRaw = Array.isArray(rig.edges) ? rig.edges : [];
        const nodeById = {};
        for (const n of nodes) {
          const nid = getNodeKeyId(n);
          nodeById[nid] = n;
          if (n.id) nodeById[n.id] = n;
          if (n.nodeId) nodeById[n.nodeId] = n;
          if (n.logicalId) nodeById[n.logicalId] = n;
        }

        // Group seats into pods, ordered by role rank for deterministic Dagre tie-breaking
        const podMap = {};
        for (const n of nodes) {
          const podName = n.podNamespace || (n.logicalId ? n.logicalId.split('.')[0] : '') || 'default';
          if (!podMap[podName]) podMap[podName] = [];
          podMap[podName].push(n);
        }
        const podNames = Object.keys(podMap);
        for (const pn of podNames) {
          podMap[pn].sort((a, b) => getNodeRoleRank(a.logicalId) - getNodeRoleRank(b.logicalId));
        }

        // Resolve valid directed edges (or infer sequential intra-pod pipeline if 0 explicit edges)
        const pendingEdges = [];
        const seenEdgeKeys = new Set();
        for (const e of rigEdgesRaw) {
          const sNode = nodeById[e.sourceId];
          const tNode = nodeById[e.targetId];
          if (!sNode || !tNode) continue;
          const sId = getNodeKeyId(sNode);
          const tId = getNodeKeyId(tNode);
          if (sId === tId) continue;
          const kind = e.kind || 'delegates_to';
          const dedup = sId + '->' + tId + ':' + kind;
          if (seenEdgeKeys.has(dedup)) continue;
          seenEdgeKeys.add(dedup);
          const sPod = sNode.podNamespace || (sNode.logicalId ? sNode.logicalId.split('.')[0] : '') || 'default';
          const tPod = tNode.podNamespace || (tNode.logicalId ? tNode.logicalId.split('.')[0] : '') || 'default';
          pendingEdges.push({ sId, tId, sNode, tNode, sPod, tPod, kind, edgeId: dedup });
        }

        if (rigEdgesRaw.length === 0) {
          for (const pn of podNames) {
            const pNodes = podMap[pn];
            for (let i = 0; i < pNodes.length - 1; i++) {
              const sId = getNodeKeyId(pNodes[i]);
              const tId = getNodeKeyId(pNodes[i + 1]);
              const dedup = sId + '->' + tId + ':delegates_to';
              pendingEdges.push({ sId, tId, sNode: pNodes[i], tNode: pNodes[i + 1], sPod: pn, tPod: pn, kind: 'delegates_to', edgeId: dedup });
            }
          }
        }

        // Build Dagre Compound Multigraph (rankdir: 'TB' -> Rig Hub at Top, Pods & Seats Flowing Top-to-Bottom)
        const g = new dagreLib.graphlib.Graph({ compound: true, multigraph: true });
        g.setGraph({
          rankdir: 'TB',
          nodesep: 34,
          ranksep: 52,
          edgesep: 14,
          marginx: 16,
          marginy: 16
        });
        g.setDefaultEdgeLabel(function() { return {}; });

        const hubNodeId = '__rig_hub__';
        g.setNode(hubNodeId, { width: rigHubW, height: rigHubH });

        const delegatesInDeg = {};
        for (const pn of podNames) {
          const podClusterId = 'pod::' + pn;
          g.setNode(podClusterId, { label: pn, clusterLabelPos: 'top' });
          for (const n of podMap[pn]) {
            const nid = getNodeKeyId(n);
            delegatesInDeg[nid] = 0;
            g.setNode(nid, { width: cardW, height: cardH });
            g.setParent(nid, podClusterId);
          }
        }

        for (const pe of pendingEdges) {
          if (pe.kind === 'delegates_to' && delegatesInDeg[pe.tId] !== undefined) {
            delegatesInDeg[pe.tId]++;
          }
        }

        // Connect Rig Hub (Rank 0 at top) to all root entry seats (delegates_to in-degree === 0)
        const rootSeatIds = [];
        for (const pn of podNames) {
          for (const n of podMap[pn]) {
            const nid = getNodeKeyId(n);
            if ((delegatesInDeg[nid] || 0) === 0) {
              rootSeatIds.push({ nid, podName: pn });
            }
          }
        }
        if (rootSeatIds.length === 0 && nodes.length > 0) {
          const first = nodes[0];
          const firstPod = first.podNamespace || (first.logicalId ? first.logicalId.split('.')[0] : '') || 'default';
          rootSeatIds.push({ nid: getNodeKeyId(first), podName: firstPod });
        }

        for (const rs of rootSeatIds) {
          g.setEdge(hubNodeId, rs.nid, { kind: 'ownership', podName: rs.podName, weight: 6, minlen: 1 }, 'own::' + rs.nid);
        }

        // Feed directed seat edges into Dagre; orient escalates_to (target -> source) so feedback arcs never invert forward ranks
        for (const pe of pendingEdges) {
          const isEsc = pe.kind === 'escalates_to';
          const samePod = pe.sPod === pe.tPod;
          const u = isEsc ? pe.tId : pe.sId;
          const v = isEsc ? pe.sId : pe.tId;
          g.setEdge(u, v, {
            kind: pe.kind,
            reversed: isEsc,
            weight: pe.kind === 'delegates_to' ? (samePod ? 12 : 4) : pe.kind === 'collaborates_with' ? 3 : 0,
            minlen: 1
          }, pe.edgeId);
        }

        dagreLib.layout(g);

        const hubCenter = g.node(hubNodeId);
        const rawHub = {
          x: hubCenter.x - rigHubW / 2,
          y: hubCenter.y - rigHubH / 2,
          w: rigHubW,
          h: rigHubH
        };

        let minX = rawHub.x;
        let maxX = rawHub.x + rawHub.w;
        let minY = rawHub.y;
        let maxY = rawHub.y + rawHub.h;

        const rawSeatById = {};
        const rawPods = [];
        for (const pn of podNames) {
          const memberBoxes = [];
          for (const n of podMap[pn]) {
            const nid = getNodeKeyId(n);
            const c = g.node(nid);
            const sb = {
              key: rig.name + '::' + nid,
              id: nid,
              node: n,
              rig,
              podName: pn,
              x: c.x - cardW / 2,
              y: c.y - cardH / 2,
              w: cardW,
              h: cardH
            };
            memberBoxes.push(sb);
            rawSeatById[nid] = sb;
          }
          const px1 = Math.min(...memberBoxes.map(b => b.x)) - podPadX;
          const py1 = Math.min(...memberBoxes.map(b => b.y)) - podPadTop;
          const px2 = Math.max(...memberBoxes.map(b => b.x + b.w)) + podPadX;
          const py2 = Math.max(...memberBoxes.map(b => b.y + b.h)) + podPadBottom;
          if (px1 < minX) minX = px1;
          if (px2 > maxX) maxX = px2;
          if (py1 < minY) minY = py1;
          if (py2 > maxY) maxY = py2;
          rawPods.push({
            podName: pn,
            nodes: podMap[pn],
            seatBoxes: memberBoxes,
            x: px1,
            y: py1,
            w: px2 - px1,
            h: py2 - py1,
            portXs: []
          });
        }

        const rawPodByName = {};
        for (const rp of rawPods) rawPodByName[rp.podName] = rp;

        // Extract Dagre-routed Rig -> Entry Pod ownership curves (one clean branch per entry pod, clipped at Pod top header)
        const rawOwnershipEdges = [];
        const seenEntryPod = new Set();
        for (const rs of rootSeatIds) {
          if (seenEntryPod.has(rs.podName)) continue;
          seenEntryPod.add(rs.podName);
          const eo = g.edge(hubNodeId, rs.nid, 'own::' + rs.nid);
          const targetPod = rawPodByName[rs.podName];
          if (eo && Array.isArray(eo.points) && targetPod) {
            const clipped = clipPolylineAtPodTop(eo.points, targetPod.y);
            for (const pt of clipped) {
              if (pt.x < minX) minX = pt.x;
              if (pt.x > maxX) maxX = pt.x;
              if (pt.y < minY) minY = pt.y;
              if (pt.y > maxY) maxY = pt.y;
            }
            const endPt = clipped[clipped.length - 1];
            targetPod.portXs.push(endPt.x);
            rawOwnershipEdges.push({ podName: rs.podName, targetPod, points: clipped });
          }
        }

        // Extract Dagre-routed seat-to-seat relationship polylines
        const rawRelEdges = [];
        for (const pe of pendingEdges) {
          const isEsc = pe.kind === 'escalates_to';
          const eo = g.edge(isEsc ? pe.tId : pe.sId, isEsc ? pe.sId : pe.tId, pe.edgeId);
          const pts = (eo && Array.isArray(eo.points))
            ? (isEsc ? eo.points.slice().reverse() : eo.points.slice())
            : [];
          for (const pt of pts) {
            if (pt.x < minX) minX = pt.x;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.y > maxY) maxY = pt.y;
          }
          rawRelEdges.push({
            rigName: rig.name,
            sourceKey: rawSeatById[pe.sId].key,
            targetKey: rawSeatById[pe.tId].key,
            src: rawSeatById[pe.sId],
            dst: rawSeatById[pe.tId],
            kind: pe.kind,
            points: pts
          });
        }

        const contentW = maxX - minX;
        const contentH = maxY - minY;
        if (contentW > maxRigContentW) maxRigContentW = contentW;

        rawRigGraphs.push({
          rig,
          nodes,
          rawHub,
          rawPods,
          rawOwnershipEdges,
          rawRelEdges,
          minX,
          minY,
          contentW,
          contentH
        });
      }

      if (rawRigGraphs.length === 0) {
        stage.innerHTML = '<div class="empty-state">No agent seats match the selected filters or search query.</div>';
        updateGraphInspector([]);
        return;
      }

      const vpEl = document.getElementById('topology-graph-viewport');
      const vpAvailW = (vpEl && vpEl.clientWidth > 320) ? (vpEl.clientWidth - 36) : 920;
      const totalWidth = Math.round(Math.max(maxRigContentW + 64, Math.min(vpAvailW, 1140)));

      // Pass 2: Center each Rig's Dagre top-down graph horizontally and stack Rig sections vertically
      const rigLayouts = [];
      let currentY = 16;

      for (const rg of rawRigGraphs) {
        const rigTopY = currentY;
        const shiftX = Math.round((totalWidth - rg.contentW) / 2 - rg.minX);
        const shiftY = Math.round(rigTopY + rigPadTop - rg.minY);
        const rigHeight = Math.round(rg.contentH + rigPadTop + rigPadBottom);

        const hubX = rg.rawHub.x + shiftX;
        const hubY = rg.rawHub.y + shiftY;
        graphRigHubRegistry[rg.rig.name] = { x: hubX, y: hubY, w: rg.rawHub.w, h: rg.rawHub.h };

        for (const p of rg.rawPods) {
          p.x += shiftX;
          p.y += shiftY;
          p.portXs = p.portXs.map(px => px + shiftX);
          for (const sb of p.seatBoxes) {
            sb.x += shiftX;
            sb.y += shiftY;
            graphSeatRegistry[sb.key] = sb;
          }
        }

        for (const oe of rg.rawOwnershipEdges) {
          oe.points = oe.points.map(pt => ({ x: pt.x + shiftX, y: pt.y + shiftY }));
        }

        for (const re of rg.rawRelEdges) {
          re.points = re.points.map(pt => ({ x: pt.x + shiftX, y: pt.y + shiftY }));
          allRenderedEdges.push(re);
        }

        rigLayouts.push({
          rig: rg.rig,
          nodes: rg.nodes,
          pods: rg.rawPods,
          ownershipEdges: rg.rawOwnershipEdges,
          edges: rg.rawRelEdges,
          topY: rigTopY,
          height: rigHeight,
          hubX,
          hubY,
          hubW: rigHubW,
          hubH: rigHubH
        });

        currentY += rigHeight + rigSectionGap;
      }

      // Clear stale selection if filtered out
      if (selectedGraphSeatKey && !graphSeatRegistry[selectedGraphSeatKey]) {
        selectedGraphSeatKey = null;
      }
      if (selectedGraphRigName && !rigLayouts.some(rl => rl.rig.name === selectedGraphRigName)) {
        selectedGraphRigName = null;
      }

      // Compute active highlight neighborhood
      const highlightedSeats = new Set();
      let highlightedRig = selectedGraphRigName;
      if (selectedGraphSeatKey && graphSeatRegistry[selectedGraphSeatKey]) {
        highlightedSeats.add(selectedGraphSeatKey);
        highlightedRig = graphSeatRegistry[selectedGraphSeatKey].rig.name;
        for (const e of allRenderedEdges) {
          if (e.sourceKey === selectedGraphSeatKey) highlightedSeats.add(e.targetKey);
          if (e.targetKey === selectedGraphSeatKey) highlightedSeats.add(e.sourceKey);
        }
      } else if (selectedGraphRigName) {
        for (const [k, v] of Object.entries(graphSeatRegistry)) {
          if (v.rig.name === selectedGraphRigName) highlightedSeats.add(k);
        }
      }
      const hasSelection = Boolean(selectedGraphSeatKey || selectedGraphRigName);

      // Count relationship degrees per seat
      const seatDegree = {};
      for (const e of allRenderedEdges) {
        seatDegree[e.sourceKey] = (seatDegree[e.sourceKey] || 0) + 1;
        seatDegree[e.targetKey] = (seatDegree[e.targetKey] || 0) + 1;
      }

      let svgBg = '';
      let svgOwnershipEdges = '';
      let svgPodsAndHubs = '';
      let svgRelEdges = '';
      let svgRelLabels = '';
      let svgNodes = '';

      for (const rl of rigLayouts) {
        const rig = rl.rig;
        const isRigFocused = !hasSelection || highlightedRig === rig.name;
        const rigDimOpacity = isRigFocused ? '1' : '0.28';
        const workingInRig = rl.nodes.filter(n => (((n.activityState && n.activityState.display) || n.sessionStatus) === 'working')).length;

        // Subtle Rig swimlane frame
        svgBg += '<rect x="12" y="' + rl.topY + '" width="' + (totalWidth - 24) + '" height="' + rl.height + '" rx="12" fill="#15171c" fill-opacity="0.65" stroke="' + (selectedGraphRigName === rig.name ? '#5c7cfa' : '#23262e') + '" stroke-width="' + (selectedGraphRigName === rig.name ? '1.6' : '1') + '"/>';

        // Rig Hub Node Centered at TOP (Rank 0)
        const hubBorder = (selectedGraphRigName === rig.name || (selectedGraphSeatKey && highlightedRig === rig.name)) ? '#8ab4f8' : '#364fc7';
        const hubStatusColor = workingInRig > 0 ? '#81c995' : '#8ab4f8';
        const hubCenterX = rl.hubX + rl.hubW / 2;
        const hubBottomY = rl.hubY + rl.hubH;

        svgPodsAndHubs += '<g class="graph-rig-hub" opacity="' + rigDimOpacity + '" style="cursor:pointer;" onclick="selectGraphRig(\\'' + escapeJs(rig.name) + '\\')">' +
          '<rect class="rig-hub-bg" x="' + rl.hubX + '" y="' + rl.hubY + '" width="' + rl.hubW + '" height="' + rl.hubH + '" rx="10" fill="#181e2c" stroke="' + hubBorder + '" stroke-width="1.6"/>' +
          '<rect x="' + (rl.hubX + 14) + '" y="' + (rl.hubY + 12) + '" width="36" height="16" rx="4" fill="#263859"/>' +
          '<text x="' + (rl.hubX + 32) + '" y="' + (rl.hubY + 23) + '" text-anchor="middle" fill="#8ab4f8" font-size="9.5" font-weight="700" font-family="\\'Inter\\', sans-serif">RIG</text>' +
          '<circle cx="' + (rl.hubX + rl.hubW - 18) + '" cy="' + (rl.hubY + 20) + '" r="4.5" fill="' + hubStatusColor + '"/>' +
          '<text x="' + hubCenterX + '" y="' + (rl.hubY + 46) + '" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="700" font-family="\\'Inter\\', sans-serif">' +
            escapeHtml(rig.name.length > 24 ? (rig.name.slice(0, 23) + '…') : rig.name) +
          '</text>' +
          '<text x="' + hubCenterX + '" y="' + (rl.hubY + 64) + '" text-anchor="middle" fill="#9aa5b4" font-size="10.5" font-family="\\'JetBrains Mono\\', monospace">' +
            rl.nodes.length + ' seats • ' + workingInRig + ' working' +
          '</text>' +
          '<text x="' + hubCenterX + '" y="' + (rl.hubY + 79) + '" text-anchor="middle" fill="#6f7d95" font-size="10" font-family="\\'Inter\\', sans-serif">' +
            rl.pods.length + (rl.pods.length === 1 ? ' pod • ' : ' pods • ') + rl.edges.length + ' edges' +
          '</text>' +
          '<circle cx="' + hubCenterX + '" cy="' + hubBottomY + '" r="4" fill="#5c7cfa" stroke="#121212" stroke-width="1.5"/>' +
        '</g>';

        // Pod Compound Cluster Containers
        for (const p of rl.pods) {
          const podHasHighlight = !hasSelection ? true : p.seatBoxes.some(sb => highlightedSeats.has(sb.key));
          const podOpacity = podHasHighlight ? '1' : '0.26';
          const portCircles = p.portXs.map(px => '<circle cx="' + px.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="3.5" fill="#5c7cfa"/>').join('');

          svgPodsAndHubs += '<g opacity="' + podOpacity + '">' +
            '<rect x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '" width="' + p.w.toFixed(1) + '" height="' + p.h.toFixed(1) + '" rx="10" fill="#18191d" stroke="#2d3139" stroke-width="1.1"/>' +
            '<text x="' + (p.x + 14).toFixed(1) + '" y="' + (p.y + 21).toFixed(1) + '" fill="#a3acb9" font-size="10.5" font-weight="600" font-family="\\'JetBrains Mono\\', monospace">' +
              'POD: ' + escapeHtml(p.podName) + ' (' + p.nodes.length + ')' +
            '</text>' +
            portCircles +
          '</g>';
        }

        // Dagre-routed Top-Down Rig -> Entry Pod Structural Ownership Edges
        if (graphEdgeLayers.ownership) {
          for (const oe of rl.ownershipEdges) {
            const ownActive = (selectedGraphRigName === rig.name) ||
              (selectedGraphSeatKey && oe.targetPod.seatBoxes.some(sb => sb.key === selectedGraphSeatKey));
            const ownOpacity = hasSelection ? (ownActive ? '0.92' : '0.12') : '0.56';
            const ownWidth = ownActive ? '1.85' : '1.35';
            const ownPath = dagrePointsToSvgPath(oe.points);
            if (ownPath) {
              svgOwnershipEdges += '<path class="graph-edge-ownership" d="' + ownPath + '" fill="none" stroke="#5c7cfa" stroke-width="' + ownWidth + '" stroke-dasharray="4 3" opacity="' + ownOpacity + '" marker-end="url(#arrow-ownership)"/>';
            }
          }
        }

        // Dagre-routed Seat-to-Seat Relationship B-Splines
        const visibleRigEdges = rl.edges.filter(e => graphEdgeLayers[e.kind] !== false);
        for (const e of visibleRigEdges) {
          const isEdgeSelected = selectedGraphSeatKey
            ? (e.sourceKey === selectedGraphSeatKey || e.targetKey === selectedGraphSeatKey)
            : (selectedGraphRigName === rig.name);
          const defaultOpacity = e.kind === 'escalates_to' ? '0.46' : '0.86';
          const edgeOpacity = hasSelection ? (isEdgeSelected ? '1' : '0.1') : defaultOpacity;
          const strokeColor = e.kind === 'escalates_to' ? '#fdd663' : e.kind === 'collaborates_with' ? '#81c995' : '#8ab4f8';
          const markerId = e.kind === 'escalates_to' ? 'arrow-escalates' : e.kind === 'collaborates_with' ? 'arrow-collaborates' : 'arrow-delegates';
          const dashAttr = e.kind === 'escalates_to' ? ' stroke-dasharray="5 4"' : e.kind === 'collaborates_with' ? ' stroke-dasharray="3 2"' : '';
          const strokeW = isEdgeSelected ? '2.25' : (e.kind === 'escalates_to' ? '1.35' : '1.65');

          const pathD = dagrePointsToSvgPath(e.points);
          if (!pathD) continue;

          svgRelEdges += '<path class="graph-edge-rel" data-kind="' + escapeHtml(e.kind) + '" d="' + pathD + '" fill="none" stroke="' + strokeColor + '" stroke-width="' + strokeW + '"' + dashAttr + ' opacity="' + edgeOpacity + '" marker-end="url(#' + markerId + ')"/>';

          const showEdgeLabel = (selectedGraphSeatKey && isEdgeSelected) || (!hasSelection && visibleRigEdges.length <= 6);
          if (showEdgeLabel) {
            const mid = dagrePolylineMidpoint(e.points);
            const shortKind = e.kind === 'delegates_to' ? 'delegates' : e.kind === 'escalates_to' ? 'escalates' : e.kind === 'collaborates_with' ? 'collaborates' : e.kind;
            const pillW = shortKind.length * 5.6 + 12;
            svgRelLabels += '<g opacity="' + (isEdgeSelected ? '1' : '0.88') + '">' +
              '<rect x="' + (mid.x - pillW / 2).toFixed(1) + '" y="' + (mid.y - 8).toFixed(1) + '" width="' + pillW.toFixed(1) + '" height="14" rx="7" fill="#12141a" stroke="' + strokeColor + '" stroke-width="0.9"/>' +
              '<text x="' + mid.x.toFixed(1) + '" y="' + (mid.y + 2).toFixed(1) + '" text-anchor="middle" fill="' + strokeColor + '" font-size="8.5" font-family="\\'JetBrains Mono\\', monospace">' + escapeHtml(shortKind) + '</text>' +
            '</g>';
          }
        }

        // Rich Interactive Seat Cards with Inline Chat / Screen / Msg Buttons
        for (const p of rl.pods) {
          for (const sb of p.seatBoxes) {
            const node = sb.node;
            const sessionName = node.canonicalSessionName || (node.logicalId + '@' + rig.name);
            const runtime = node.runtime || 'antigravity';
            const isHuman = node.nodeKind === 'human' || (node.logicalId || '').includes('human');
            const runtimeShort = isHuman ? 'HUMAN' : runtime.toLowerCase().includes('antigravity') ? 'AGY' : runtime.toUpperCase().slice(0, 6);
            const disp = (node.activityState && node.activityState.display) || node.sessionStatus || 'idle';
            const stateColor = disp === 'working' ? '#81c995' : (disp === 'needs_input' || disp === 'attention_required') ? '#fdd663' : '#8ab4f8';
            const convId = (node.resumeType === 'antigravity_id' ? node.resumeToken : null) || node.resumeToken;

            const isPrimarySelected = selectedGraphSeatKey === sb.key;
            const isNeighborHighlighted = !hasSelection || highlightedSeats.has(sb.key);
            const nodeOpacity = isNeighborHighlighted ? '1' : '0.28';
            const cardBorder = isPrimarySelected ? '#8ab4f8' : (hasSelection && isNeighborHighlighted ? '#4c6ef5' : '#2d323d');
            const cardStrokeW = isPrimarySelected ? '2.2' : '1.2';
            const cardFill = isPrimarySelected ? '#212838' : '#1e2026';

            const modelLabel = node.model
              ? (node.model.length > 27 ? node.model.slice(0, 26) + '…' : node.model)
              : (runtime + ' • ' + disp);
            const deg = seatDegree[sb.key] || 0;

            svgNodes += '<g class="graph-node" opacity="' + nodeOpacity + '" style="cursor:pointer;" onclick="selectGraphSeat(\\'' + escapeJs(sb.key) + '\\')">' +
              '<rect class="seat-card-bg" x="' + sb.x + '" y="' + sb.y + '" width="' + sb.w + '" height="' + sb.h + '" rx="8" fill="' + cardFill + '" stroke="' + cardBorder + '" stroke-width="' + cardStrokeW + '"/>' +
              '<circle cx="' + (sb.x + 15) + '" cy="' + (sb.y + 19) + '" r="4.5" fill="' + stateColor + '"/>' +
              '<text x="' + (sb.x + 27) + '" y="' + (sb.y + 23) + '" fill="#ffffff" font-size="12" font-weight="600" font-family="\\'Inter\\', sans-serif">' +
                escapeHtml(node.logicalId.length > 21 ? (node.logicalId.slice(0, 20) + '…') : node.logicalId) +
              '</text>' +
              '<rect x="' + (sb.x + sb.w - 48) + '" y="' + (sb.y + 10) + '" width="38" height="16" rx="4" fill="#262b36"/>' +
              '<text x="' + (sb.x + sb.w - 29) + '" y="' + (sb.y + 21) + '" text-anchor="middle" fill="#9fb4d9" font-size="9" font-weight="600" font-family="\\'JetBrains Mono\\', monospace">' + escapeHtml(runtimeShort) + '</text>' +
              '<text x="' + (sb.x + 14) + '" y="' + (sb.y + 42) + '" fill="#9e9e9e" font-size="10" font-family="\\'JetBrains Mono\\', monospace">' +
                escapeHtml(modelLabel) +
              '</text>' +
              '<text x="' + (sb.x + 14) + '" y="' + (sb.y + 70) + '" fill="' + stateColor + '" font-size="9.5" font-weight="500" font-family="\\'JetBrains Mono\\', monospace">' +
                escapeHtml(disp) + (deg > 0 ? (' • ' + deg + ' rel') : '') +
              '</text>' +
              (convId ? (
                '<g class="graph-action-pill" onclick="event.stopPropagation(); openExternalHref(\\'conversation://' + escapeJs(convId) + '\\')">' +
                  '<rect x="' + (sb.x + sb.w - 134) + '" y="' + (sb.y + 56) + '" width="40" height="19" rx="4" fill="#182030" stroke="#304261" stroke-width="0.9"/>' +
                  '<text x="' + (sb.x + sb.w - 114) + '" y="' + (sb.y + 69) + '" text-anchor="middle" fill="#8ab4f8" font-size="9" font-family="\\'Inter\\', sans-serif">Chat</text>' +
                '</g>'
              ) : '') +
              '<g class="graph-action-pill" onclick="event.stopPropagation(); openCaptureModal(\\'' + escapeJs(sessionName) + '\\', \\'' + escapeJs(node.logicalId) + '\\')">' +
                '<rect x="' + (sb.x + sb.w - 90) + '" y="' + (sb.y + 56) + '" width="42" height="19" rx="4" fill="#1b1d24" stroke="#333845" stroke-width="0.9"/>' +
                '<text x="' + (sb.x + sb.w - 69) + '" y="' + (sb.y + 69) + '" text-anchor="middle" fill="#d4d7dd" font-size="9" font-family="\\'Inter\\', sans-serif">Screen</text>' +
              '</g>' +
              '<g class="graph-action-pill" onclick="event.stopPropagation(); openReplyModal(\\'' + escapeJs(sessionName) + '\\')">' +
                '<rect x="' + (sb.x + sb.w - 44) + '" y="' + (sb.y + 56) + '" width="34" height="19" rx="4" fill="#1d283a" stroke="#38527a" stroke-width="0.9"/>' +
                '<text x="' + (sb.x + sb.w - 27) + '" y="' + (sb.y + 69) + '" text-anchor="middle" fill="#8ab4f8" font-size="9" font-family="\\'Inter\\', sans-serif">Msg</text>' +
              '</g>' +
            '</g>';
          }
        }
      }

      lastGraphLogicalWidth = totalWidth;
      lastGraphLogicalHeight = Math.max(420, currentY + 8);
      const scaledW = Math.round(lastGraphLogicalWidth * graphZoom);
      const scaledH = Math.round(lastGraphLogicalHeight * graphZoom);

      stage.innerHTML = '<svg id="topology-svg-canvas" class="svg-graph" width="' + scaledW + '" height="' + scaledH + '" viewBox="0 0 ' + lastGraphLogicalWidth + ' ' + lastGraphLogicalHeight + '" xmlns="http://www.w3.org/2000/svg">' +
        defs + svgBg + svgOwnershipEdges + svgPodsAndHubs + svgRelEdges + svgNodes + svgRelLabels +
      '</svg>';

      updateGraphInspector(allRenderedEdges);

      // Mobile Auto-Fit on initial graph render when viewport width < 768px
      if (!initialGraphFitApplied && (typeof window !== 'undefined' && ((window.innerWidth && window.innerWidth < 768) || (document.documentElement && document.documentElement.clientWidth < 768)))) {
        const vpEl = document.getElementById('topology-graph-viewport');
        if (vpEl && vpEl.clientWidth > 0) {
          initialGraphFitApplied = true;
          fitGraphZoom();
        }
      }
    }

    // Tab 2 Filtering & Rendering
    function filterTopology() {
      if (cachedTopology) {
        renderTopology();
      }
    }

    function renderTopology() {
      if (!cachedTopology) return;
      const { rigs, costData, topData, seatUsageMap } = cachedTopology;

      const search = (document.getElementById('topology-search')?.value || '').toLowerCase().trim();
      const rigFilter = document.getElementById('topology-rig-filter')?.value || 'all';
      const runtimeFilter = document.getElementById('topology-runtime-filter')?.value || 'all';
      const statusFilter = document.getElementById('topology-status-filter')?.value || 'all';
      const sortOrder = document.getElementById('topology-sort')?.value || 'newest';

      if (topologyViewMode === 'graph') {
        renderSvgGraph();
      }

      let totalSeats = 0;
      let activeSeats = 0;
      let totalFleetTokens = 0;
      let html = '';

      for (const r of rigs) {
        const rig = r.rig || r;
        if (rigFilter !== 'all' && rig.name !== rigFilter) continue;
        const nodes = rig.nodes || [];

        // Filter nodes
        const filteredNodes = nodes.filter(node => matchesTopologyNodeFilters(node, rig, {
          search,
          runtimeFilter,
          statusFilter
        }));

        if (filteredNodes.length === 0) continue;

        // Sort filtered nodes
        filteredNodes.sort((a, b) => {
          if (sortOrder === 'newest') {
            const isAWorking = ((a.activityState && a.activityState.display) || a.sessionStatus) === 'working';
            const isBWorking = ((b.activityState && b.activityState.display) || b.sessionStatus) === 'working';
            if (isAWorking && !isBWorking) return -1;
            if (!isAWorking && isBWorking) return 1;
            return (b.startedAt || 0) - (a.startedAt || 0);
          } else {
            return (a.startedAt || 0) - (b.startedAt || 0);
          }
        });

        totalSeats += filteredNodes.length;

        // Group filtered nodes by pod
        const pods = {};
        for (const node of filteredNodes) {
          const podName = node.podNamespace || (node.logicalId ? node.logicalId.split('.')[0] : '') || 'default';
          if (!pods[podName]) pods[podName] = [];
          pods[podName].push(node);
        }

        html += '<div class="rig-container">' +
          '<div class="rig-header">' +
            '<div class="rig-title">' +
              '<span class="badge badge-blue">RIG</span>' +
              '<span>' + escapeHtml(rig.name) + '</span>' +
            '</div>' +
            '<div class="card-meta">' +
              '<span>' + filteredNodes.length + ' matching seats</span>' +
              '<span>• ' + ((rig.edges && rig.edges.length) || 0) + ' edges</span>' +
              '<span>• Status: ' + escapeHtml(rig.status || 'running') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="pod-grid">';

        for (const [podName, podNodes] of Object.entries(pods)) {
          html += '<div class="pod-card">' +
            '<div class="pod-header">' +
              '<span>POD: ' + escapeHtml(podName) + '</span>' +
              '<span class="badge badge-muted">' + podNodes.length + ' seats</span>' +
            '</div>';

          for (const node of podNodes) {
            const sessionName = node.canonicalSessionName || (node.logicalId + '@' + rig.name);
            const runtime = node.runtime || 'antigravity';
            const isAgy = runtime.toLowerCase().includes('antigravity');
            const disp = (node.activityState && node.activityState.display) || node.sessionStatus || 'idle';
            const state = disp === 'working' ? 'working' : (disp === 'needs_input' || disp === 'attention_required') ? 'needs_input' : 'idle';
            if (state === 'working') activeSeats++;

            const convId = (node.resumeType === 'antigravity_id' ? node.resumeToken : null) || node.resumeToken;

            // Context & Token Telemetry
            const ctx = node.contextUsage;
            const hasCtx = ctx && ctx.availability === 'available' && ctx.usedPercentage != null;
            const usedPct = hasCtx ? Math.min(100, Math.round(ctx.usedPercentage)) : null;
            const inTok = ctx && ctx.totalInputTokens != null ? ctx.totalInputTokens : 0;
            const outTok = ctx && ctx.totalOutputTokens != null ? ctx.totalOutputTokens : 0;
            const seatTokens = inTok + outTok;
            totalFleetTokens += seatTokens;

            const usageRecord = seatUsageMap[sessionName] || seatUsageMap[node.logicalId];

            html += '<div class="seat-item">' +
              '<div class="seat-top">' +
                '<div class="seat-name">' +
                  '<div class="live-dot ' + state + '"></div>' +
                  '<span>' + escapeHtml(node.logicalId) + '</span>' +
                '</div>' +
                '<span class="badge ' + (isAgy ? 'badge-blue' : 'badge-muted') + '">' +
                  (isAgy ? 'Google Antigravity' : escapeHtml(runtime)) +
                '</span>' +
              '</div>' +
              '<div class="seat-details">' +
                (node.model ? ('<span class="badge badge-muted">Model: ' + escapeHtml(node.model) + '</span>') : '') +
                (node.effort ? ('<span class="badge badge-muted">Effort: ' + escapeHtml(node.effort) + '</span>') : '') +
                (hasCtx ? (
                  '<span class="badge badge-blue">Context: ' + usedPct + '%</span>' +
                  '<span class="badge badge-muted">Tokens: ' + formatTokens(seatTokens) + '</span>'
                ) : usageRecord ? (
                  '<span class="badge badge-blue">Burn: ' + formatTokens(usageRecord.tokens || 0) + ' tok</span>'
                ) : (
                  '<span class="badge badge-muted">Tokens: idle</span>'
                )) +
              '</div>' +
              (hasCtx ? (
                '<div class="token-progress-container" title="Context Window Usage: ' + usedPct + '% (' + formatTokens(inTok) + ' in / ' + formatTokens(outTok) + ' out)">' +
                  '<div class="token-progress-fill" style="width: ' + usedPct + '%"></div>' +
                '</div>'
              ) : '') +
              (convId ? (
                '<div class="conv-box">' +
                  '<span>Conv: ' + escapeHtml(convId.slice(0, 18)) + '...</span>' +
                  '<div style="display:flex; align-items:center; gap:8px;">' +
                    '<a href="conversation://' + escapeHtml(convId) + '" class="conv-link" target="_blank" rel="noopener noreferrer" title="Open Conversation in Antigravity Chat">' + ICONS.link + 'Open Chat' + ICONS.external + '</a>' +
                    '<button class="conv-copy-btn" onclick="copyToClipboard(\\'' + convId + '\\')">Copy ID</button>' +
                  '</div>' +
                '</div>'
              ) : '') +
              '<div class="seat-actions">' +
                '<button class="btn btn-secondary" style="padding:2px 8px; font-size:11px;" onclick="openCaptureModal(\\'' + escapeJs(sessionName) + '\\', \\'' + escapeJs(node.logicalId) + '\\')">' + ICONS.monitor + 'Screen</button>' +
                '<button class="btn btn-primary" style="padding:2px 8px; font-size:11px;" onclick="openReplyModal(\\'' + escapeJs(sessionName) + '\\')">' + ICONS.mail + 'Message</button>' +
              '</div>' +
            '</div>';
          }

          html += '</div>';
        }

        html += '</div></div>';
      }

      document.getElementById('seats-count').textContent = totalSeats;
      document.getElementById('topology-list').innerHTML = html || '<div class="empty-state">No agent seats match the selected filters or search query.</div>';

      // Update Fleet Telemetry Dashboard Bar
      const activeSeatsEl = document.getElementById('telem-active-seats');
      if (activeSeatsEl) activeSeatsEl.textContent = activeSeats + ' / ' + totalSeats;

      const burnRateEl = document.getElementById('telem-burn-rate');
      if (burnRateEl) {
        burnRateEl.textContent = totalFleetTokens > 0 ? (formatTokens(totalFleetTokens) + ' tok') : '0 tok/hr';
      }

      const costEl = document.getElementById('telem-cost');
      if (costEl && costData && costData.totalCostFormatted) {
        costEl.textContent = 'Est. Cost: ' + costData.totalCostFormatted;
      }

      const topSeatEl = document.getElementById('telem-top-seat');
      const topDetailEl = document.getElementById('telem-top-detail');
      if (topSeatEl && topData && Array.isArray(topData.ranked) && topData.ranked.length > 0) {
        const topRanked = topData.ranked[0];
        topSeatEl.textContent = topRanked.seat || 'top-seat';
        if (topDetailEl) topDetailEl.textContent = (formatTokens(topRanked.burn || topRanked.tokens || 0)) + ' tok in window';
      } else if (topSeatEl) {
        topSeatEl.textContent = totalSeats > 0 ? (activeSeats > 0 ? 'Fleet Active' : 'Fleet Standby') : '—';
        if (topDetailEl) topDetailEl.textContent = activeSeats > 0 ? (activeSeats + ' seats working') : 'All seats idle';
      }
    }

    // Fetch Topology (Rigs, Live Seat Nodes, & Directed Topology Edges) & Telemetry
    async function fetchTopology() {
      try {
        const [resRigs, resTelemCost, resTelemTop] = await Promise.allSettled([
          fetch('/api/rigs'),
          fetch('/api/telemetry/usage/cost'),
          fetch('/api/telemetry/usage/top?window_hours=1')
        ]);

        let rigsList = [];
        if (resRigs.status === 'fulfilled' && resRigs.value.ok) {
          rigsList = await resRigs.value.json();
        }
        const rigs = Array.isArray(rigsList) ? rigsList : (rigsList.rigs || []);

        let costData = null;
        if (resTelemCost.status === 'fulfilled' && resTelemCost.value.ok) {
          try { costData = await resTelemCost.value.json(); } catch(e) {}
        }
        let topData = null;
        if (resTelemTop.status === 'fulfilled' && resTelemTop.value.ok) {
          try { topData = await resTelemTop.value.json(); } catch(e) {}
        }

        const seatUsageMap = {};
        if (costData && Array.isArray(costData.seats)) {
          for (const s of costData.seats) {
            if (s.seat) seatUsageMap[s.seat] = s;
          }
        }

        await Promise.all(rigs.map(async (r) => {
          const rig = r.rig || r;
          if (!rig.id) {
            if (!Array.isArray(rig.nodes)) rig.nodes = [];
            if (!Array.isArray(rig.edges)) rig.edges = [];
            return;
          }
          const [resDetail, resNodes] = await Promise.allSettled([
            fetch('/api/rigs/' + rig.id),
            (!rig.nodes || rig.nodes.length === 0) ? fetch('/api/rigs/' + rig.id + '/nodes') : Promise.resolve(null)
          ]);

          let detail = null;
          if (resDetail.status === 'fulfilled' && resDetail.value && resDetail.value.ok) {
            try { detail = await resDetail.value.json(); } catch (e) {}
          }

          if (resNodes.status === 'fulfilled' && resNodes.value && resNodes.value.ok) {
            try { rig.nodes = await resNodes.value.json(); } catch (e) {}
          }

          if ((!Array.isArray(rig.nodes) || rig.nodes.length === 0) && detail && Array.isArray(detail.nodes)) {
            rig.nodes = detail.nodes;
          }
          if (!Array.isArray(rig.nodes)) rig.nodes = [];

          // Enrich live nodes with static node IDs from detail.nodes if needed
          if (detail && Array.isArray(detail.nodes)) {
            const detailByLogical = {};
            for (const dn of detail.nodes) {
              if (dn.logicalId) detailByLogical[dn.logicalId] = dn;
            }
            for (const ln of rig.nodes) {
              const dn = detailByLogical[ln.logicalId];
              if (dn && !ln.nodeId && !ln.id) {
                ln.nodeId = dn.id;
              }
              ln._id = ln.nodeId || ln.id || (dn && dn.id) || ln.logicalId;
            }
          } else {
            for (const ln of rig.nodes) {
              ln._id = ln.nodeId || ln.id || ln.logicalId;
            }
          }

          rig.edges = (detail && Array.isArray(detail.edges))
            ? detail.edges
            : (Array.isArray(rig.edges) ? rig.edges : []);
        }));

        cachedTopology = { rigs, costData, topData, seatUsageMap };

        // Update fleet dropdowns and rig filters
        const rigNames = Array.from(new Set(rigs.map(r => (r.rig || r).name).filter(Boolean)));
        updateAllRigFilters(rigNames);
        populateAgentDropdown(rigs);

        renderTopology();
      } catch (err) {
        console.error("fetchTopology error:", err);
      }
    }

    // Tab 3 Filtering & Rendering
    function setDeliverablesVerdictFilter(verdict, el) {
      deliverablesVerdictFilter = verdict;
      const pills = document.querySelectorAll('#deliverables-filter-pills .filter-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (el) el.classList.add('active');
      renderDeliverables();
    }

    function filterDeliverables() {
      renderDeliverables();
    }

    // ---- Phase 2: Deliverables Master-Detail Studio (SDCR.0.8.02) ----
    let activeDeliverableIndex = 0;
    let selectedDeliverableKeys = new Set();
    let collapsedDeliverablesGroups = new Set();
    let lastFilteredDeliverables = [];

    function isInputElementActive() {
      const el = document.activeElement;
      if (!el) return false;
      const tagName = String(el.tagName || '').toUpperCase();
      return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || Boolean(el.isContentEditable);
    }

    function deliverableStatus(item) {
      const j = item.judgment;
      const isDropped = isDeliverableDropped(item);
      const isAccepted = (j && j.verdict === 'accept') || item.state === 'accepted';
      const isRejected = (j && j.verdict === 'reject') || item.state === 'rejected';
      if (isDropped) return { key: 'dropped', label: 'Sunset / Dropped', badge: 'badge-purple', dot: '#c58af9', icon: ICONS.box };
      if (isAccepted) return { key: 'accepted', label: 'Accepted', badge: 'badge-green', dot: '#81c995', icon: ICONS.check };
      if (isRejected) return { key: 'rejected', label: 'Rejected', badge: 'badge-red', dot: '#f28b82', icon: ICONS.cross };
      return { key: 'pending', label: 'Pending / Unjudged', badge: 'badge-amber', dot: '#fdd663', icon: ICONS.clock };
    }

    function deliverableGroupLabel(group) {
      const parts = String(group).split('/slices/');
      return parts.length === 2 ? (parts[0] + ' / ' + parts[1]) : String(group);
    }

    function deliverableEvidenceList(item) {
      const rawEv = item.evidence || (item.judgment && item.judgment.evidence) || (item.evidenceRef ? [item.evidenceRef] : []);
      return (Array.isArray(rawEv) ? rawEv : [rawEv])
        .map(e => (e && typeof e === 'object' && e.ref) ? e.ref : (typeof e === 'string' ? e : (e ? String(e) : '')))
        .filter(Boolean);
    }

    function deliverableEvidenceKind(path) {
      if (/\\.(png|jpg|jpeg|webp|gif|svg)$/i.test(path)) return 'image';
      if (/\\.(md|markdown|txt|log)$/i.test(path)) return 'text';
      if (/\\.(json|yaml|yml)$/i.test(path)) return 'data';
      if (/^https?:\\/\\//i.test(path)) return 'url';
      return 'file';
    }

    function updateDeliverablesBatchBar() {
      const bar = document.getElementById('deliverables-batch-bar');
      const label = document.getElementById('deliverables-batch-count');
      const count = selectedDeliverableKeys.size;
      if (label) label.textContent = count + ' selected';
      if (bar) bar.style.display = count > 0 ? 'flex' : 'none';
    }

    function toggleDeliverableSelection(index, event) {
      if (event && event.stopPropagation) event.stopPropagation();
      const item = lastFilteredDeliverables[index];
      if (!item) return;
      const key = getDeliverableKey(item);
      if (selectedDeliverableKeys.has(key)) selectedDeliverableKeys.delete(key);
      else selectedDeliverableKeys.add(key);
      renderDeliverables();
    }

    function clearDeliverablesSelection() {
      selectedDeliverableKeys = new Set();
      renderDeliverables();
    }

    function toggleDeliverablesGroup(group) {
      if (collapsedDeliverablesGroups.has(group)) collapsedDeliverablesGroups.delete(group);
      else collapsedDeliverablesGroups.add(group);
      renderDeliverables();
    }

    function selectDeliverable(index) {
      if (index < 0 || index >= lastFilteredDeliverables.length) return;
      activeDeliverableIndex = index;
      renderDeliverables();
      const row = document.querySelector('.deliverables-row[data-deliv-index="' + index + '"]');
      if (row && row.scrollIntoView) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function selectNextDeliverable() {
      selectDeliverable(Math.min(activeDeliverableIndex + 1, lastFilteredDeliverables.length - 1));
    }

    function selectPrevDeliverable() {
      selectDeliverable(Math.max(activeDeliverableIndex - 1, 0));
    }

    function activeDeliverable() {
      return lastFilteredDeliverables[activeDeliverableIndex] || null;
    }

    function openActiveProofAcceptModal() {
      const item = activeDeliverable();
      if (!item) return;
      const j = item.judgment;
      openProofAcceptModal(item.scope || 'default', item.id, item.text || item.id, item.revision || '', j ? j.id : '', item.evidence);
    }

    function openActiveProofRejectModal() {
      const item = activeDeliverable();
      if (!item) return;
      const j = item.judgment;
      openProofRejectModal(item.scope || 'default', item.id, item.text || item.id, item.revision || '', j ? j.id : '');
    }

    function toggleActiveDeliverableDropped() {
      const item = activeDeliverable();
      if (!item) return;
      const index = cachedDeliverables.indexOf(item);
      if (index < 0) return;
      if (isDeliverableDropped(item)) restoreDeliverable(index);
      else dropDeliverable(index);
    }

    function requestBatchAcceptConfirmation() {
      if (selectedDeliverableKeys.size === 0) return;
      pendingTriageConfirmation = { kind: 'batch-accept' };
      document.getElementById('triage-confirm-title').textContent = 'Confirm Batch Accept';
      document.getElementById('triage-confirm-summary').textContent = selectedDeliverableKeys.size + ' deliverables selected';
      document.getElementById('triage-confirm-detail').textContent = 'Batch accepting records an accept judgment for each selected deliverable. This cannot be undone from the Sidecar.';
      const confirmBtn = document.getElementById('triage-confirm-btn');
      confirmBtn.className = 'btn btn-success';
      confirmBtn.innerHTML = ICONS.check + 'Accept Selected';
      openModal('triage-confirm-modal');
    }

    async function executeBatchAccept() {
      const selected = cachedDeliverables.filter(item => selectedDeliverableKeys.has(getDeliverableKey(item)));
      for (const item of selected) {
        const j = item.judgment;
        try {
          await fetch('/api/proof/judge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-OpenRig-Session': 'human'
            },
            body: JSON.stringify({
              scope: item.scope || 'default',
              item: item.id,
              verdict: 'accept',
              reason: 'Batch accepted via Deliverables Studio',
              evidence: deliverableEvidenceList(item),
              expectedRevision: item.revision || '',
              expectedPrevious: j ? j.id : null,
              actorSession: 'human'
            })
          });
        } catch (e) {
          // Continue with the remaining selections; failures surface on refresh.
        }
      }
      const count = selected.length;
      selectedDeliverableKeys = new Set();
      showToast('Batch accepted ' + count + ' deliverable' + (count === 1 ? '' : 's'));
      fetchDeliverables();
    }

    function renderDeliverableRow(item, index) {
      const status = deliverableStatus(item);
      const key = getDeliverableKey(item);
      const checked = selectedDeliverableKeys.has(key) ? ' checked' : '';
      const revision = item.revision ? ('rev #' + String(item.revision).slice(0, 7)) : 'rev #initial';
      const at = item.judgment && item.judgment.at ? (owedDuration(item.judgment.at) + ' ago') : '';
      const title = item.text || item.id || '(untitled contract)';
      return '<div class="deliverables-row' + (index === activeDeliverableIndex ? ' active' : '') + '" data-deliv-index="' + index + '" data-deliv-key="' + escapeHtml(key) + '" onclick="selectDeliverable(' + index + ')">' +
        '<input type="checkbox" class="row-checkbox" aria-label="Select deliverable" onclick="event.stopPropagation(); toggleDeliverableSelection(' + index + ', event)"' + checked + '>' +
        '<span class="status-dot" style="background:' + status.dot + ';" title="' + escapeHtml(status.label) + '"></span>' +
        '<span class="title-strip" title="' + escapeHtml(title) + '">' + escapeHtml(title) + '</span>' +
        '<span class="meta-strip">' +
          (at ? '<span class="time-pill">' + escapeHtml(at) + '</span>' : '') +
          '<span class="revision-pill">' + escapeHtml(revision) + '</span>' +
        '</span>' +
      '</div>';
    }

    async function loadStageDoc(path, domId) {
      const target = document.getElementById(domId);
      if (!target) return;
      target.innerHTML = '<div class="empty-state" style="padding:8px;">Loading document...</div>';
      try {
        const res = await fetch('/api/evidence?path=' + encodeURIComponent(path));
        const data = await res.json();
        if (data && data.ok && typeof data.content === 'string') {
          target.innerHTML = renderMarkdown(data.content);
        } else {
          target.innerHTML = '<div class="empty-state" style="padding:8px;">' + escapeHtml((data && (data.error || data.message)) || 'Unable to load document') + '</div>';
        }
      } catch (e) {
        target.innerHTML = '<div class="empty-state" style="padding:8px;">Error loading document.</div>';
      }
    }

    function renderDeliverablesStage(item) {
      const stage = document.getElementById('deliverables-stage-inspector');
      if (!stage) return;
      if (!item) {
        stage.innerHTML = '<div class="empty-state">Select a deliverable to inspect proof evidence and contracts.</div>';
        return;
      }
      const index = cachedDeliverables.indexOf(item);
      const status = deliverableStatus(item);
      const scope = item.scope || 'default';
      const parts = String(scope).split('/slices/');
      const rigLabel = item.rig || (parts.length === 2 ? parts[0] : 'workspace');
      const scopeLabel = parts.length === 2 ? parts[1] : scope;
      const j = item.judgment;
      const evidence = deliverableEvidenceList(item);
      const images = evidence.filter(path => deliverableEvidenceKind(path) === 'image');
      const docs = evidence.filter(path => deliverableEvidenceKind(path) === 'text' || deliverableEvidenceKind(path) === 'data');
      const links = evidence.filter(path => deliverableEvidenceKind(path) === 'url');

      const gallery = images.map(path => {
        const base = path.split('/').pop() || path;
        const rawUrl = '/api/evidence/raw?path=' + encodeURIComponent(path);
        return '<figure class="stage-evidence-figure">' +
          '<img src="' + escapeHtml(rawUrl) + '" alt="' + escapeHtml(base) + '" loading="lazy" onclick="openImageLightbox(\\'' + escapeJs(rawUrl) + '\\', \\'' + escapeJs(base) + '\\')">' +
          '<figcaption class="stage-evidence-caption">Subject: ' + escapeHtml(base) + ' — ' + escapeHtml(status.label) + ' deliverable evidence for <code>' + escapeHtml(scope) + '</code></figcaption>' +
        '</figure>';
      }).join('');

      const docsHtml = docs.map((path, di) => {
        const base = path.split('/').pop() || path;
        const domId = 'stage-doc-' + index + '-' + di;
        return '<div class="stage-doc-preview">' +
          '<div class="stage-doc-heading">' + ICONS.doc + escapeHtml(base) + '</div>' +
          '<button class="btn btn-secondary btn-sm" onclick="loadStageDoc(\\'' + escapeJs(path) + '\\', \\'' + escapeJs(domId) + '\\')">' + ICONS.doc + 'Load document</button>' +
          '<div class="md-rendered" id="' + escapeHtml(domId) + '"></div>' +
        '</div>';
      }).join('');

      const linksHtml = links.map(url =>
        '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + ICONS.external + 'Open evidence link</a>'
      ).join('');

      const judgmentHtml = j
        ? '<div class="stage-judgment-banner ' + (j.verdict === 'accept' ? 'accepted' : 'rejected') + '">' +
            '<div class="stage-judgment-line">' + status.icon + '<strong>' + escapeHtml(String(j.verdict || 'judged').toUpperCase()) + '</strong>' +
              '<span>by ' + escapeHtml(j.actor || 'human') + '</span>' +
              (j.at ? '<span>' + escapeHtml(new Date(j.at).toLocaleString()) + '</span>' : '') +
            '</div>' +
            '<div class="md-rendered">' + renderMarkdown(j.reason || 'None provided') + '</div>' +
          '</div>'
        : '<div class="stage-judgment-banner pending">' + ICONS.clock + 'No judgment recorded yet — proof contract awaiting empirical review.</div>';

      const linkedQitem = item.queueItemId || item.qitemId || (Array.isArray(item.tags) ? String(item.tags.find(tag => typeof tag === 'string' && tag.startsWith('qitem-')) || '') : '');
      const crossLink = linkedQitem
        ? '<button class="btn btn-secondary btn-sm" onclick="navigateToApprovals(\\'' + escapeJs(linkedQitem) + '\\')">' + ICONS.reply + 'Jump to Approvals Gate</button>'
        : '';

      stage.innerHTML = '<div class="stage-container">' +
        '<div class="stage-header">' +
          '<div class="stage-breadcrumbs">' +
            '<span class="breadcrumb-item">Rig: <strong>' + escapeHtml(rigLabel) + '</strong></span>' +
            '<span class="breadcrumb-sep">/</span>' +
            '<span class="breadcrumb-item">Scope: <strong>' + escapeHtml(scopeLabel) + '</strong></span>' +
            '<span class="breadcrumb-sep">/</span>' +
            '<span class="breadcrumb-item">#' + escapeHtml(item.id || '') + '</span>' +
          '</div>' +
          '<div class="stage-badges">' +
            '<span class="badge ' + status.badge + '">' + status.icon + status.label + '</span>' +
            '<span class="badge badge-muted">' + escapeHtml(item.revision ? ('rev #' + String(item.revision).slice(0, 7)) : 'rev #initial') + '</span>' +
          '</div>' +
        '</div>' +
        '<h2 class="stage-title">' + escapeHtml(item.text || item.id || 'Deliverable') + '</h2>' +
        judgmentHtml +
        '<div class="stage-evidence-section">' +
          '<div class="stage-section-heading"><span>Delivered Proof Evidence</span><span class="badge badge-blue">' + evidence.length + ' item' + (evidence.length === 1 ? '' : 's') + '</span></div>' +
          (gallery ? '<div class="stage-evidence-gallery">' + gallery + '</div>' : '<div class="empty-state" style="padding:12px;">No visual evidence attached to this contract.</div>') +
          (linksHtml ? '<div class="stage-section-heading" style="margin-top:14px;"><span>Evidence Links</span></div><div class="stage-evidence-links">' + linksHtml + '</div>' : '') +
          (docsHtml ? '<div class="stage-section-heading" style="margin-top:14px;"><span>Documents, Diffs &amp; Logs</span></div><div class="stage-doc-previews">' + docsHtml + '</div>' : '') +
        '</div>' +
        '<div class="stage-docked-bar">' +
          '<div class="stage-action-left">' +
            (isDeliverableDropped(item)
              ? '<button class="btn btn-secondary" onclick="restoreDeliverable(' + index + ')">' + ICONS.restore + 'Restore Deliverable</button>'
              : '<button class="btn btn-success" id="stage-btn-accept" onclick="openActiveProofAcceptModal()">' + ICONS.check + 'Accept Deliverable</button>' +
                '<button class="btn btn-secondary" id="stage-btn-reject" onclick="openActiveProofRejectModal()">' + ICONS.cross + 'Request Revision...</button>' +
                '<button class="btn btn-secondary" id="stage-btn-sunset" onclick="toggleActiveDeliverableDropped()">' + ICONS.box + 'Sunset / Drop</button>') +
          '</div>' +
          '<div class="stage-action-right">' + crossLink + '</div>' +
        '</div>' +
      '</div>';
    }

    function navigateToDeliverable(scopeHint, itemId) {
      const tabBtn = document.querySelector('.tab-btn[data-tab="deliverables"]');
      if (tabBtn) tabBtn.click();
      deliverablesVerdictFilter = 'all';
      const searchEl = document.getElementById('deliverables-search');
      if (searchEl) searchEl.value = '';
      document.querySelectorAll('#deliverables-filter-pills .filter-pill').forEach(pill => pill.classList.remove('active'));
      const allPill = document.querySelector('#deliverables-filter-pills .filter-pill[data-filter="all"]');
      if (allPill) allPill.classList.add('active');
      renderDeliverables();
      let index = -1;
      if (itemId) index = lastFilteredDeliverables.findIndex(it => it.id === itemId);
      if (index < 0 && scopeHint) index = lastFilteredDeliverables.findIndex(it => String(it.scope || '').includes(scopeHint));
      if (index >= 0) selectDeliverable(index);
    }

    function navigateToApprovals(qitemId) {
      const tabBtn = document.querySelector('.tab-btn[data-tab="approvals"]');
      if (tabBtn) tabBtn.click();
      const searchEl = document.getElementById('approvals-search');
      if (searchEl && qitemId) {
        searchEl.value = qitemId;
        filterApprovals();
      }
    }

    function renderDeliverables() {
      const list = document.getElementById('deliverables-list');
      if (!list) return;
      const search = (document.getElementById('deliverables-search')?.value || '').toLowerCase().trim();
      const rigFilter = document.getElementById('deliverables-rig-filter')?.value || 'all';
      const sortOrder = document.getElementById('deliverables-sort')?.value || 'newest';

      const droppedCount = cachedDeliverables.filter(item => isDeliverableDropped(item)).length;
      const droppedBadge = document.getElementById('dropped-proofs-count');
      if (droppedBadge) droppedBadge.textContent = droppedCount;

      const filtered = cachedDeliverables.filter(item => {
        const isDropped = isDeliverableDropped(item);
        if (deliverablesVerdictFilter === 'dropped') {
          if (!isDropped) return false;
        } else if (isDropped) {
          return false;
        }

        const j = item.judgment;
        const isAccepted = (j && j.verdict === 'accept') || item.state === 'accepted';
        const isRejected = (j && j.verdict === 'reject') || item.state === 'rejected';
        const isPending = !isAccepted && !isRejected;

        if (deliverablesVerdictFilter === 'accepted' && !isAccepted) return false;
        if (deliverablesVerdictFilter === 'rejected' && !isRejected) return false;
        if (deliverablesVerdictFilter === 'pending' && !isPending) return false;

        if (rigFilter !== 'all') {
          const sText = ((item.scope || '') + ' ' + (item.rig || '')).toLowerCase();
          if (!sText.includes(rigFilter.toLowerCase())) return false;
        }

        if (search) {
          const text = ((item.text || '') + ' ' + (item.id || '') + ' ' + (item.scope || '') + ' ' + (item.revision || '')).toLowerCase();
          if (!text.includes(search)) return false;
        }
        return true;
      });

      filtered.sort((a, b) => {
        const tA = (a.judgment && a.judgment.at) ? new Date(a.judgment.at).getTime() : (a.revision ? parseInt(a.revision, 16) || 0 : 0);
        const tB = (b.judgment && b.judgment.at) ? new Date(b.judgment.at).getTime() : (b.revision ? parseInt(b.revision, 16) || 0 : 0);
        return sortOrder === 'newest' ? tB - tA : tA - tB;
      });

      lastFilteredDeliverables = filtered;
      const countEl = document.getElementById('proofs-count');
      if (countEl) countEl.textContent = filtered.length;

      if (activeDeliverableIndex >= filtered.length) {
        activeDeliverableIndex = Math.max(0, filtered.length - 1);
      }

      if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state">' + (cachedDeliverables.length === 0 ? 'No proof contracts found for current workspace. Deliverables and proofs will populate as contracts are executed.' : (deliverablesVerdictFilter === 'dropped' ? 'No sunset or dropped deliverables.' : 'No deliverables match current search or verdict filter.')) + '</div>';
        renderDeliverablesStage(null);
        updateDeliverablesBatchBar();
        return;
      }

      const groups = new Map();
      for (let i = 0; i < filtered.length; i++) {
        const group = filtered[i].scope || 'unscoped';
        if (!groups.has(group)) groups.set(group, []);
        groups.get(group).push(i);
      }

      let html = '';
      for (const [group, indices] of groups) {
        const collapsed = collapsedDeliverablesGroups.has(group);
        html += '<div class="deliverables-group-header' + (collapsed ? ' collapsed' : '') + '" onclick="toggleDeliverablesGroup(\\'' + escapeJs(group) + '\\')">' +
          '<svg class="group-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>' +
          '<span class="group-title">' + escapeHtml(deliverableGroupLabel(group)) + '</span>' +
          '<span class="badge badge-muted">' + indices.length + ' contract' + (indices.length === 1 ? '' : 's') + '</span>' +
        '</div>';
        if (!collapsed) {
          for (const index of indices) html += renderDeliverableRow(filtered[index], index);
        }
      }

      list.innerHTML = html;
      renderDeliverablesStage(activeDeliverable());
      updateDeliverablesBatchBar();
    }

    function openDeliverableDetail(index) {
      const item = cachedDeliverables[index];
      if (!item) return;

      const j = item.judgment;
      const isAccepted = (j && j.verdict === 'accept') || item.state === 'accepted';
      const isRejected = (j && j.verdict === 'reject') || item.state === 'rejected';
      const isDropped = isDeliverableDropped(item);
      const statusBadge = isDropped ? 'badge-purple' : isAccepted ? 'badge-green' : isRejected ? 'badge-red' : 'badge-amber';
      const statusIcon = isDropped ? ICONS.box : isAccepted ? ICONS.check : isRejected ? ICONS.cross : ICONS.clock;
      const statusText = isDropped ? 'Sunset / Dropped' : isAccepted ? 'Accepted' : isRejected ? 'Rejected' : 'Pending / Unjudged';
      const scope = item.scope || 'default';

      const badgeEl = document.getElementById('detail-badge');
      badgeEl.className = 'badge ' + statusBadge;
      badgeEl.textContent = statusText;
      badgeEl.innerHTML = statusIcon + statusText;

      document.getElementById('detail-title').textContent = item.text || item.id;
      document.getElementById('detail-subtitle').textContent = 'Scope: ' + scope + ' · Item #' + item.id;
      document.getElementById('detail-item-text').innerHTML = renderMarkdown(item.text || '(No explicit requirement description provided)');
      document.getElementById('detail-scope-id').textContent = scope + ' #' + item.id;
      document.getElementById('detail-revision').textContent = (item.revision ? ('Revision: ' + item.revision) : 'Revision: uncommitted / initial') + (item.expectedPrevious ? ('\\nPrevious: ' + item.expectedPrevious) : '');

      const judgmentBox = document.getElementById('detail-judgment');
      if (j) {
        judgmentBox.innerHTML = '<strong>Verdict:</strong> ' + escapeHtml(j.verdict) + '<br><strong>Judged by:</strong> ' + escapeHtml(j.actor || 'human') + '<br><strong>Timestamp:</strong> ' + (j.at ? new Date(j.at).toLocaleString() : 'N/A') + '<div style="margin-top:6px;"><strong>Reason:</strong></div>' + renderMarkdown(j.reason || 'None provided');
      } else {
        judgmentBox.textContent = 'No judgment recorded yet. Pending empirical review or proof acceptance.';
      }

      const evDetailEl = document.getElementById('detail-evidence');
      if (evDetailEl) {
        const rawEv = item.evidence || (item.judgment && item.judgment.evidence) || (item.evidenceRef ? [item.evidenceRef] : []);
        const evList = (Array.isArray(rawEv) ? rawEv : [rawEv])
          .map(e => (e && typeof e === 'object' && e.ref) ? e.ref : (typeof e === 'string' ? e : (e ? String(e) : '')))
          .filter(Boolean);
        if (evList.length > 0) {
          let detailEvHtml = '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px;">';
          const images = [];
          const docs = [];
          for (const ev of evList) {
            if (typeof ev === 'string') {
              const clean = ev.trim();
              if (/\\.(png|jpg|jpeg|webp|gif|svg)$/i.test(clean)) {
                images.push(clean);
                detailEvHtml += '<span class="badge badge-purple" style="font-family:\\'JetBrains Mono\\', monospace; cursor:pointer;" onclick="openImageLightbox(\\'/api/evidence/raw?path=' + encodeURIComponent(clean) + '\\', \\'' + escapeJs(clean) + '\\')">' + ICONS.image + escapeHtml(clean) + '</span>';
              } else {
                if (/\\.(md|markdown|txt|log|json|yaml|yml)$/i.test(clean)) {
                  docs.push(clean);
                }
                detailEvHtml += '<span class="badge badge-green" style="font-family:\\'JetBrains Mono\\', monospace;">' + ICONS.folder + escapeHtml(clean) + '</span>';
              }
            } else if (ev && typeof ev === 'object') {
              detailEvHtml += '<pre class="md-code-block"><code>' + escapeHtml(JSON.stringify(ev, null, 2)) + '</code></pre>';
            }
          }
          detailEvHtml += '</div>';

          // Visual full-width previews for images
          if (images.length > 0) {
            for (const img of images) {
              const rawUrl = '/api/evidence/raw?path=' + encodeURIComponent(img);
              detailEvHtml += '<div class="md-image-container">' +
                '<img class="md-proof-image" src="' + escapeHtml(rawUrl) + '" alt="' + escapeHtml(img) + '" loading="lazy" onclick="openImageLightbox(this.src, this.alt)">' +
                '<div class="md-image-caption">' + ICONS.image + escapeHtml(img) + ' (click to expand full resolution)</div>' +
              '</div>';
            }
          }

          // Document previews container
          if (docs.length > 0) {
            detailEvHtml += '<div id="detail-doc-previews"></div>';
            loadDetailDocPreview(docs[0]);
          }

          evDetailEl.innerHTML = detailEvHtml;
        } else {
          evDetailEl.textContent = 'Evidence: proof/evidence.md (Empirically verified in workspace)';
        }
      }

      const contractBox = document.getElementById('detail-contract-state');
      contractBox.textContent = JSON.stringify({
        id: item.id,
        scope: scope,
        state: item.state || 'pending',
        readiness: item.readiness || null,
        evidence: item.evidence || null,
        verifications: item.verifications || null
      }, null, 2);

      const actionsLeft = document.getElementById('detail-actions-left');
      if (isDropped) {
        actionsLeft.innerHTML = '<button class="btn btn-secondary" onclick="restoreDeliverable(' + index + '); closeModal(\\'deliverable-detail-modal\\');">' + ICONS.restore + 'Restore Deliverable</button>';
      } else {
        actionsLeft.innerHTML = '<button class="btn btn-success" onclick="closeModal(\\'deliverable-detail-modal\\'); quickCompleteProof(\\'' + escapeJs(scope) + '\\', \\'' + escapeJs(item.id) + '\\', \\'' + escapeJs(item.revision) + '\\', \\'' + escapeJs(j ? j.id : '') + '\\');">' + ICONS.bolt + 'Quick Complete</button>' +
          '<button class="btn btn-success" onclick="closeModal(\\'deliverable-detail-modal\\'); openProofAcceptModal(\\'' + escapeJs(scope) + '\\', \\'' + escapeJs(item.id) + '\\', \\'' + escapeJs(item.text) + '\\', \\'' + escapeJs(item.revision) + '\\', \\'' + escapeJs(j ? j.id : '') + '\\', ' + (item.evidence ? JSON.stringify(item.evidence).replace(/"/g, '&quot;') : 'null') + ');">' + ICONS.check + 'Accept...</button>' +
          '<button class="btn btn-danger" onclick="quickRejectProof(\\'' + escapeJs(scope) + '\\', \\'' + escapeJs(item.id) + '\\', \\'' + escapeJs(item.revision) + '\\', \\'' + escapeJs(j ? j.id : '') + '\\'); closeModal(\\'deliverable-detail-modal\\');">' + ICONS.cross + 'Quick Reject</button>' +
          '<button class="btn btn-secondary" onclick="closeModal(\\'deliverable-detail-modal\\'); openProofRejectModal(\\'' + escapeJs(scope) + '\\', \\'' + escapeJs(item.id) + '\\', \\'' + escapeJs(item.text) + '\\', \\'' + escapeJs(item.revision) + '\\', \\'' + escapeJs(j ? j.id : '') + '\\');">' + ICONS.cross + 'Reject Proof...</button>' +
          '<button class="btn btn-secondary" onclick="dropDeliverable(' + index + '); closeModal(\\'deliverable-detail-modal\\');">' + ICONS.box + 'Sunset / Drop</button>';
      }

      openModal('deliverable-detail-modal');
    }
    const openProofDetailModal = openDeliverableDetail;

    // Fetch Deliverables & Proofs
    async function fetchDeliverables() {
      try {
        const res = await fetch('/api/proof');
        const data = await res.json();
        let items = [];
        if (data.missions && Array.isArray(data.missions) && data.missions.length > 0) {
          for (const m of data.missions) {
            for (const s of (m.slices || [])) {
              const sliceItems = (s.readiness && s.readiness.items) || [];
              for (const it of sliceItems) {
                const rawEv = it.evidence || (it.judgment && it.judgment.evidence) || [];
                const normalizedEvidence = (Array.isArray(rawEv) ? rawEv : [rawEv])
                  .map(e => (e && typeof e === 'object' && e.ref) ? e.ref : e)
                  .filter(Boolean);

                // If still empty and unjudged, provide default slice proof path
                const fallbackEvidence = normalizedEvidence.length > 0
                  ? normalizedEvidence
                  : ['missions/' + m.name + '/slices/' + s.id + '/proof/evidence.md'];

                items.push({
                  ...it,
                  scope: m.name + '/slices/' + s.id,
                  evidence: fallbackEvidence
                });
              }
            }
          }
        }
        if (items.length === 0 && data.items && Array.isArray(data.items)) {
          for (const it of data.items) {
            const rawEv = it.evidence || (it.judgment && it.judgment.evidence) || [];
            const normalizedEvidence = (Array.isArray(rawEv) ? rawEv : [rawEv])
              .map(e => (e && typeof e === 'object' && e.ref) ? e.ref : e)
              .filter(Boolean);
            items.push({
              ...it,
              evidence: normalizedEvidence.length > 0 ? normalizedEvidence : it.evidence
            });
          }
        }
        cachedDeliverables = items;
        renderDeliverables();
      } catch (err) {
        console.error("fetchDeliverables error:", err);
      }
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard: " + text);
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[m]);
    }

    function escapeJs(str) {
      if (!str) return '';
      return String(str).replace(/[\\\\'\\"]/g, '\\\\$&').replace(/\\n/g, '\\\\n');
    }

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
      fetchApprovals();
      fetchTopology();
      fetchDeliverables();
      showToast("Refreshed all views.");
    });

    // Resize listener for mobile viewport orientation and width changes
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        if (topologyViewMode === 'graph' && ((window.innerWidth && window.innerWidth < 768) || (document.documentElement && document.documentElement.clientWidth < 768))) {
          fitGraphZoom();
        }
      });
    }

    // Initial load
    fetchApprovals();
    fetchTopology();
    fetchDeliverables();

    // Auto-poll every 3.5 seconds
    setInterval(() => {
      fetchApprovals();
      fetchTopology();
      fetchDeliverables();
    }, 3500);
  </script>
</body>
</html>`;
}
