export function renderDashboardHtml(hostUrl: string, defaultKey: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ImgBB MCP Server - Cloudflare Edge</title>
  <meta name="description" content="Production-ready Model Context Protocol (MCP) server for ImgBB running on Cloudflare Workers. Connect Claude, Cursor, Windsurf, or any AI agent.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0c10;
      --bg-card: #131722;
      --bg-card-subtle: #1c2233;
      --border-color: rgba(255, 255, 255, 0.08);
      --accent-primary: #3b82f6;
      --accent-gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --success: #10b981;
      --radius-lg: 16px;
      --radius-md: 10px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.6;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 25%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
      background-attachment: fixed;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }

    header {
      text-align: center;
      margin-bottom: 48px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #60a5fa;
      margin-bottom: 20px;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--success);
      box-shadow: 0 0 10px var(--success);
    }

    h1 {
      font-size: 3rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 36px;
    }

    @media (max-width: 860px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
      h1 { font-size: 2.2rem; }
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 28px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
    }

    .card h2 {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-desc {
      color: var(--text-muted);
      font-size: 0.92rem;
      margin-bottom: 20px;
    }

    .endpoint-box {
      background: #0d1117;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 14px 16px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .endpoint-info {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .endpoint-type {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #93c5fd;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .endpoint-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.88rem;
      color: #e2e8f0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    button.copy-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--text-main);
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 600;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    button.copy-btn:hover {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: #fff;
    }

    /* Form Styles */
    .form-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    input[type="text"], input[type="number"], select, textarea {
      width: 100%;
      background: #0d1117;
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--accent-primary);
    }

    .dropzone {
      border: 2px dashed rgba(255, 255, 255, 0.18);
      border-radius: var(--radius-md);
      padding: 24px;
      text-align: center;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.02);
      transition: all 0.2s;
      margin-bottom: 16px;
    }

    .dropzone:hover, .dropzone.dragover {
      border-color: var(--accent-primary);
      background: rgba(59, 130, 246, 0.05);
    }

    .primary-btn {
      width: 100%;
      background: var(--accent-gradient);
      color: #fff;
      border: none;
      padding: 14px 20px;
      border-radius: var(--radius-md);
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
    }

    .primary-btn:hover {
      opacity: 0.92;
    }

    .primary-btn:active {
      transform: scale(0.99);
    }

    .tabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 20px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-weight: 600;
      font-size: 0.92rem;
      padding: 10px 16px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .tab-btn.active {
      color: #60a5fa;
      border-bottom-color: #60a5fa;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    pre {
      background: #080a0f;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #cbd5e1;
      position: relative;
    }

    .pre-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .result-preview {
      margin-top: 20px;
      padding: 16px;
      background: #0d1117;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      display: none;
    }

    .result-preview img {
      max-width: 100%;
      max-height: 240px;
      border-radius: 8px;
      display: block;
      margin: 0 auto 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    .badge-pill.status-active {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.3);
      color: #34d399;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge-pill status-active">
        <span class="badge-dot"></span> Cloudflare Edge &bull; Online &bull; No Auth Needed
      </div>
      <h1>ImgBB MCP Server</h1>
      <p class="subtitle">Production Model Context Protocol (MCP) server for Claude, Cursor, Windsurf, and custom AI agents to upload, host, and embed images instantly.</p>
    </header>

    <div class="grid-2">
      <!-- MCP Connection Details -->
      <div class="card">
        <h2>⚡ MCP Connection Endpoints</h2>
        <p class="card-desc">Use either standard SSE or modern direct JSON-RPC HTTP transport in your AI client:</p>
        
        <div class="endpoint-box">
          <div class="endpoint-info">
            <div class="endpoint-type">SSE Protocol (Claude Desktop / Cursor / Cline)</div>
            <div class="endpoint-url" id="sse-url">${hostUrl}/sse?apikey=${defaultKey}</div>
          </div>
          <button class="copy-btn" onclick="copyText('sse-url')">Copy</button>
        </div>

        <div class="endpoint-box">
          <div class="endpoint-info">
            <div class="endpoint-type">Direct MCP HTTP / JSON-RPC (Modern Agents)</div>
            <div class="endpoint-url" id="http-url">${hostUrl}/mcp</div>
          </div>
          <button class="copy-btn" onclick="copyText('http-url')">Copy</button>
        </div>

        <div class="endpoint-box">
          <div class="endpoint-info">
            <div class="endpoint-type">Zero-Config SSE (Uses Server Default Key)</div>
            <div class="endpoint-url" id="zero-url">${hostUrl}/sse</div>
          </div>
          <button class="copy-btn" onclick="copyText('zero-url')">Copy</button>
        </div>

        <div style="margin-top: 24px;">
          <h3 style="font-size: 1.05rem; margin-bottom: 12px;">🛠 Supported AI Agent Tools:</h3>
          <ul style="padding-left: 20px; font-size: 0.9rem; color: var(--text-muted);">
            <li><code style="color: #60a5fa;">upload_image</code>: Upload by URL, base64, or data URI.</li>
            <li><code style="color: #60a5fa;">upload_image_from_url</code>: Smart fallback for protected URLs.</li>
            <li><code style="color: #60a5fa;">upload_image_base64</code>: Direct base64 payloads.</li>
            <li><code style="color: #60a5fa;">test_connection</code>: Diagnostic ping & key verification.</li>
          </ul>
        </div>
      </div>

      <!-- Quick Interactive Upload Tester -->
      <div class="card">
        <h2>🧪 Live Upload Tester</h2>
        <p class="card-desc">Test uploading directly through the Cloudflare Worker right now:</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('file-input').click()">
          <input type="file" id="file-input" style="display:none;" accept="image/*">
          <p id="dropzone-text">📁 Drop an image here or click to browse</p>
        </div>

        <div class="form-group">
          <label>Or Image URL</label>
          <input type="text" id="test-url" placeholder="https://example.com/photo.png">
        </div>

        <div class="form-group">
          <label>Expiration (Optional)</label>
          <select id="test-expiration">
            <option value="0">Permanent (No Expiration)</option>
            <option value="600">10 Minutes</option>
            <option value="86400">24 Hours (1 Day)</option>
            <option value="604800">7 Days</option>
            <option value="2592000">30 Days</option>
          </select>
        </div>

        <button class="primary-btn" id="upload-btn" onclick="testUpload()">Upload to ImgBB</button>

        <div class="result-preview" id="result-box">
          <img id="result-img" src="" alt="Uploaded">
          <div style="font-size: 0.85rem; font-family: monospace;" id="result-links"></div>
        </div>
      </div>
    </div>

    <!-- Client Configs -->
    <div class="card">
      <h2>🚀 One-Click Client Configurations</h2>
      <p class="card-desc">Add ImgBB MCP to your favorite agent or code editor in seconds:</p>

      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab('tab-claude', this)">Claude Desktop</button>
        <button class="tab-btn" onclick="switchTab('tab-cursor', this)">Cursor IDE</button>
        <button class="tab-btn" onclick="switchTab('tab-cline', this)">Cline / Roo Code</button>
        <button class="tab-btn" onclick="switchTab('tab-windsurf', this)">Windsurf</button>
      </div>

      <div id="tab-claude" class="tab-content active">
        <div class="pre-header">
          <span style="font-size: 0.85rem; color: var(--text-dim);">Add to claude_desktop_config.json:</span>
          <button class="copy-btn" onclick="copySnippet('code-claude')">Copy Config</button>
        </div>
        <pre><code id="code-claude">{
  "mcpServers": {
    "imgbb": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${hostUrl}/sse?apikey=${defaultKey}"
      ]
    }
  }
}</code></pre>
      </div>

      <div id="tab-cursor" class="tab-content">
        <div class="pre-header">
          <span style="font-size: 0.85rem; color: var(--text-dim);">Add to Cursor MCP Settings (~/.cursor/mcp.json):</span>
          <button class="copy-btn" onclick="copySnippet('code-cursor')">Copy Config</button>
        </div>
        <pre><code id="code-cursor">{
  "mcpServers": {
    "imgbb": {
      "url": "${hostUrl}/sse?apikey=${defaultKey}"
    }
  }
}</code></pre>
      </div>

      <div id="tab-cline" class="tab-content">
        <div class="pre-header">
          <span style="font-size: 0.85rem; color: var(--text-dim);">Add to Cline / Roo Code settings:</span>
          <button class="copy-btn" onclick="copySnippet('code-cline')">Copy Config</button>
        </div>
        <pre><code id="code-cline">{
  "mcpServers": {
    "imgbb": {
      "url": "${hostUrl}/sse?apikey=${defaultKey}",
      "transport": "sse"
    }
  }
}</code></pre>
      </div>

      <div id="tab-windsurf" class="tab-content">
        <div class="pre-header">
          <span style="font-size: 0.85rem; color: var(--text-dim);">Add to ~/.codeium/windsurf/mcp_config.json:</span>
          <button class="copy-btn" onclick="copySnippet('code-windsurf')">Copy Config</button>
        </div>
        <pre><code id="code-windsurf">{
  "mcpServers": {
    "imgbb": {
      "serverUrl": "${hostUrl}/sse?apikey=${defaultKey}"
    }
  }
}</code></pre>
      </div>
    </div>
  </div>

  <script>
    function copyText(elementId) {
      const text = document.getElementById(elementId).innerText;
      navigator.clipboard.writeText(text);
      event.target.innerText = 'Copied!';
      setTimeout(() => { event.target.innerText = 'Copy'; }, 2000);
    }

    function copySnippet(elementId) {
      const text = document.getElementById(elementId).innerText;
      navigator.clipboard.writeText(text);
      event.target.innerText = 'Copied!';
      setTimeout(() => { event.target.innerText = 'Copy Config'; }, 2000);
    }

    function switchTab(tabId, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    }

    let selectedBase64 = null;
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const dropzoneText = document.getElementById('dropzone-text');

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        dropzoneText.innerText = '📄 ' + file.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
          selectedBase64 = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file) {
        dropzoneText.innerText = '📄 ' + file.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
          selectedBase64 = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    async function testUpload() {
      const btn = document.getElementById('upload-btn');
      const urlInput = document.getElementById('test-url').value.trim();
      const expiration = parseInt(document.getElementById('test-expiration').value, 10);
      const resultBox = document.getElementById('result-box');
      const resultImg = document.getElementById('result-img');
      const resultLinks = document.getElementById('result-links');

      const imagePayload = selectedBase64 || urlInput;
      if (!imagePayload) {
        alert('Please choose a file or enter an image URL.');
        return;
      }

      btn.disabled = true;
      btn.innerText = 'Uploading to ImgBB...';

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: imagePayload,
            expiration: expiration > 0 ? expiration : undefined
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          alert('Upload failed: ' + (data.error?.message || data.error || 'Unknown error'));
        } else {
          resultBox.style.display = 'block';
          resultImg.src = data.data.display_url || data.data.url;
          resultLinks.innerHTML = \`
            <div style="margin-top: 8px;"><b>Direct URL:</b> <a href="\${data.data.url}" target="_blank" style="color: #60a5fa;">\${data.data.url}</a></div>
            <div style="margin-top: 4px;"><b>Viewer:</b> <a href="\${data.data.url_viewer}" target="_blank" style="color: #60a5fa;">\${data.data.url_viewer}</a></div>
            <div style="margin-top: 4px;"><b>Markdown:</b> <code>![image](\${data.data.url})</code></div>
            <div style="margin-top: 4px;"><b>Delete:</b> <a href="\${data.data.delete_url}" target="_blank" style="color: #f87171;">Delete Image</a></div>
          \`;
        }
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.innerText = 'Upload to ImgBB';
      }
    }
  </script>
</body>
</html>`;
}
