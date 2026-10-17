import { Hono, Context } from 'hono';
import { cors } from 'hono/cors';
import { streamSSE } from 'hono/streaming';
import { Env, JsonRpcRequest } from './types';
import { handleMcpRequest } from './mcp';
import { uploadToImgBB, testImgBBConnection } from './imgbb';
import { renderDashboardHtml } from './ui';

const FALLBACK_DEFAULT_KEY = 'f17ca0bb7aec377dd84d30b752c8d6ba';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all origins, methods, and headers
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['*'],
    exposeHeaders: ['*'],
  })
);

// Map of in-memory SSE sessions (for streaming events to active connections)
const sessionStreams = new Map<string, (dataStr: string) => Promise<void>>();

/**
 * Extracts effective ImgBB API key from query param, headers, or server default
 */
function getEffectiveApiKey(c: Context<{ Bindings: Env }>): string {
  const queryKey = c.req.query('apikey') || c.req.query('key');
  if (queryKey && queryKey.trim()) {
    return queryKey.trim();
  }

  const headerKey = c.req.header('x-api-key');
  if (headerKey && headerKey.trim()) {
    return headerKey.trim();
  }

  const authHeader = c.req.header('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }

  return c.env?.DEFAULT_IMGBB_API_KEY || FALLBACK_DEFAULT_KEY;
}

/**
 * Helper to convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, len)));
  }
  return btoa(binary);
}

// ==========================================
// 1. Health & Status
// ==========================================
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'imgbb-mcp',
    version: '1.0.0',
    edge: true,
    protocolVersion: '2024-11-05',
    defaultKeyConfigured: Boolean(getEffectiveApiKey(c)),
  });
});

// ==========================================
// 2. Browser Dashboard & Landing Page
// ==========================================
app.get('/', (c) => {
  const accept = c.req.header('accept') || '';
  // If client specifically requested SSE on root, handle SSE
  if (accept.includes('text/event-stream') || c.req.query('transport') === 'sse') {
    return handleSseEndpoint(c);
  }

  const hostUrl = new URL(c.req.url).origin;
  const apiKey = getEffectiveApiKey(c);
  return c.html(renderDashboardHtml(hostUrl, apiKey));
});

// ==========================================
// 3. Model Context Protocol (MCP) - SSE Transport
// ==========================================
function handleSseEndpoint(c: Context<{ Bindings: Env }>) {
  const sessionId = crypto.randomUUID();
  const apiKey = getEffectiveApiKey(c);
  const origin = new URL(c.req.url).origin;
  const endpointUrl = `${origin}/message?sessionId=${sessionId}&apikey=${encodeURIComponent(apiKey)}`;

  return streamSSE(c, async (stream) => {
    sessionStreams.set(sessionId, async (dataStr: string) => {
      try {
        await stream.writeSSE({
          event: 'message',
          data: dataStr,
        });
      } catch (err) {
        console.error('Error writing to SSE session stream:', err);
      }
    });

    stream.onAbort(() => {
      sessionStreams.delete(sessionId);
    });

    // Send the MCP endpoint event specifying where the client sends messages
    await stream.writeSSE({
      event: 'endpoint',
      data: endpointUrl,
    });

    // Keep SSE connection alive
    try {
      while (!stream.aborted && !stream.closed) {
        await stream.sleep(25000);
        await stream.write(': keepalive\n\n');
      }
    } finally {
      sessionStreams.delete(sessionId);
    }
  });
}

app.get('/sse', (c) => handleSseEndpoint(c));

// ==========================================
// 4. Model Context Protocol (MCP) - SSE Message Receiver
// ==========================================
app.post('/message', async (c) => {
  const sessionId = c.req.query('sessionId');
  const apiKey = getEffectiveApiKey(c);

  let body: JsonRpcRequest;
  try {
    body = await c.req.json<JsonRpcRequest>();
  } catch {
    return c.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error: Invalid JSON' },
      },
      400
    );
  }

  const response = await handleMcpRequest(body, apiKey);

  // If this isolate has the active SSE session stream, send it via SSE event
  if (sessionId && sessionStreams.has(sessionId) && response) {
    const sender = sessionStreams.get(sessionId);
    if (sender) {
      await sender(JSON.stringify(response));
    }
  }

  // Also return in direct response body for universal client compatibility
  if (response) {
    return c.json(response);
  }
  return c.text('Accepted', 202);
});

// Also support plural /messages
app.post('/messages', async (c) => {
  return app.fetch(
    new Request(c.req.url.replace('/messages', '/message'), {
      method: 'POST',
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    }),
    c.env,
    c.executionCtx
  );
});

// ==========================================
// 5. Model Context Protocol (MCP) - Direct HTTP JSON-RPC Transport
// ==========================================
async function handleDirectMcp(c: Context<{ Bindings: Env }>) {
  const apiKey = getEffectiveApiKey(c);

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error: Invalid JSON' },
      },
      400
    );
  }

  // Support batch requests
  if (Array.isArray(body)) {
    const responses = await Promise.all(
      body.map((item: JsonRpcRequest) => handleMcpRequest(item, apiKey))
    );
    const filtered = responses.filter(Boolean);
    return c.json(filtered);
  }

  const response = await handleMcpRequest(body, apiKey);
  if (response) {
    return c.json(response);
  }
  return c.text('Accepted', 202);
}

app.post('/mcp', handleDirectMcp);
app.post('/', handleDirectMcp);

// ==========================================
// 6. Direct REST API Upload Endpoint
// ==========================================
app.post('/api/upload', async (c) => {
  const apiKey = getEffectiveApiKey(c);
  const contentType = c.req.header('content-type') || '';

  try {
    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await c.req.formData();
      const imageField = formData.get('image');
      const name = (formData.get('name') as string) || undefined;
      const expStr = formData.get('expiration') as string;
      const expiration = expStr ? parseInt(expStr, 10) : undefined;
      const customKey = (formData.get('key') as string) || (formData.get('apiKey') as string) || apiKey;

      let imagePayload = '';
      if (typeof imageField === 'object' && imageField !== null && 'arrayBuffer' in imageField) {
        const buffer = await (imageField as File).arrayBuffer();
        imagePayload = arrayBufferToBase64(buffer);
      } else if (typeof imageField === 'string') {
        imagePayload = imageField;
      } else {
        return c.json({ success: false, error: 'Missing "image" field in form data' }, 400);
      }

      const result = await uploadToImgBB(
        {
          image: imagePayload,
          name,
          expiration,
          apiKey: customKey,
        },
        customKey
      );

      return c.json({ success: true, data: result });
    }

    // JSON upload
    const jsonBody = await c.req.json<any>();
    if (!jsonBody.image || typeof jsonBody.image !== 'string') {
      return c.json({ success: false, error: 'Missing or invalid "image" in JSON payload' }, 400);
    }

    const result = await uploadToImgBB(
      {
        image: jsonBody.image,
        name: jsonBody.name,
        expiration: jsonBody.expiration,
        apiKey: jsonBody.apiKey || apiKey,
      },
      apiKey
    );

    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Upload failed' }, 400);
  }
});

// ==========================================
// 7. Connection Diagnostic
// ==========================================
app.get('/api/test', async (c) => {
  const apiKey = getEffectiveApiKey(c);
  const testRes = await testImgBBConnection(apiKey);
  return c.json(testRes, testRes.success ? 200 : 400);
});

export default app;
