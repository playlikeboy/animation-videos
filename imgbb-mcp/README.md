# ImgBB Model Context Protocol (MCP) Server

Production-grade **Model Context Protocol (MCP)** server for **ImgBB** deployed on Cloudflare Workers edge network. Allows AI agents (Claude Desktop, Cursor, Windsurf, Cline, Roo Code, etc.) to upload, host, and embed images without requiring extra authentication.

---

## 🌐 Live Deployed Endpoints

- **Live URL**: `https://imgbb-mcp.shraj.workers.dev`
- **MCP SSE Endpoint**: `https://imgbb-mcp.shraj.workers.dev/sse?apikey=f17ca0bb7aec377dd84d30b752c8d6ba`
- **Zero-Auth SSE Endpoint** *(defaults to your API key automatically)*: `https://imgbb-mcp.shraj.workers.dev/sse`
- **Direct HTTP / JSON-RPC Endpoint**: `https://imgbb-mcp.shraj.workers.dev/mcp`
- **Direct REST API Endpoint**: `POST https://imgbb-mcp.shraj.workers.dev/api/upload`
- **Health Check**: `https://imgbb-mcp.shraj.workers.dev/health`

---

## ⚡ Quick Start: Connect to AI Agents

### 1. Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "imgbb": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://imgbb-mcp.shraj.workers.dev/sse?apikey=f17ca0bb7aec377dd84d30b752c8d6ba"
      ]
    }
  }
}
```

### 2. Cursor IDE (`~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "imgbb": {
      "url": "https://imgbb-mcp.shraj.workers.dev/sse?apikey=f17ca0bb7aec377dd84d30b752c8d6ba"
    }
  }
}
```

### 3. Cline / Roo Code (`mcpSettings.json`)
```json
{
  "mcpServers": {
    "imgbb": {
      "url": "https://imgbb-mcp.shraj.workers.dev/sse?apikey=f17ca0bb7aec377dd84d30b752c8d6ba",
      "transport": "sse"
    }
  }
}
```

### 4. Windsurf (`~/.codeium/windsurf/mcp_config.json`)
```json
{
  "mcpServers": {
    "imgbb": {
      "serverUrl": "https://imgbb-mcp.shraj.workers.dev/sse?apikey=f17ca0bb7aec377dd84d30b752c8d6ba"
    }
  }
}
```

---

## 🛠 Available MCP Tools

### 1. `upload_image`
Uploads an image to ImgBB from any source.
- **Parameters**:
  - `image` *(string, required)*: Public image URL, raw Base64 string, or Data URI (`data:image/...;base64,...`).
  - `name` *(string, optional)*: Desired filename.
  - `expiration` *(integer, optional)*: Expiration time in seconds (`60` to `15552000` / ~180 days). Defaults to permanent.
  - `apiKey` *(string, optional)*: Custom ImgBB API key to override the server default.
- **Output**:
  - Direct Image URL (CDN)
  - Viewer URL
  - Thumbnail URL
  - Deletion URL
  - Copy-paste Markdown embed (`![name](url)`)
  - HTML embed (`<img src="..." />`)
  - BBCode embed

### 2. `upload_image_from_url`
Dedicated tool for uploading images from public URLs with automatic remote fetch fallback if the target host blocks crawler downloads.

### 3. `upload_image_base64`
Uploads a Base64-encoded image directly.

### 4. `test_connection`
Pings ImgBB and validates that the API key is active.

---

## 📦 Project Structure

```
imgbb-mcp/
├── src/
│   ├── index.ts        # Hono router handling SSE, MCP JSON-RPC, REST API, & Web UI
│   ├── mcp.ts          # Model Context Protocol tools, resources, and prompts
│   ├── imgbb.ts        # ImgBB API client with smart remote fallback
│   ├── types.ts        # TypeScript definitions
│   └── ui.ts           # Interactive web tester & configuration UI
├── package.json
├── tsconfig.json
└── wrangler.jsonc      # Cloudflare Workers configuration
```

---

## 💻 Local Development & Redeployment

```bash
# Start local dev server
npm run dev

# Run TypeScript type check
npm run typecheck

# Deploy to Cloudflare Workers
npm run deploy
```
