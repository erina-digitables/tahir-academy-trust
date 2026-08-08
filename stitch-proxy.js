#!/usr/bin/env node
/**
 * stdio <-> HTTP proxy for Google's Stitch MCP server.
 *
 * Why this exists: the upstream `tools/list` response ships an `outputSchema`
 * for `upload_design_md` that references `#/$defs/ScreenInstance`, a definition
 * that is never declared. Strict JSON Schema clients refuse the whole tool list
 * with "can't resolve reference #/$defs/ScreenInstance from id #", so every
 * Stitch tool becomes unusable. This proxy speaks stdio to the client, forwards
 * each JSON-RPC message to the HTTP endpoint, and deletes `outputSchema` from
 * tool definitions on the way back.
 *
 * Remove this shim once Google fixes the published schema.
 */

const ENDPOINT = process.env.STITCH_MCP_URL || 'https://stitch.googleapis.com/mcp';
const API_KEY = process.env.STITCH_API_KEY;

if (!API_KEY) {
  console.error(
    '[stitch-proxy] STITCH_API_KEY is not set.\n' +
      '  Copy .env.example to .env and add your key, or export it in the shell.\n' +
      '  The key must never be committed to the repository.'
  );
  process.exit(1);
}

// Upstream reports itself as stateless, but honour a session id if it ever sends one.
let sessionId = null;

const log = (...args) => console.error('[stitch-proxy]', ...args);

function send(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

/** Recursively drop `outputSchema` keys from a tools/list result. */
function stripOutputSchemas(result) {
  if (!result || !Array.isArray(result.tools)) return result;
  let stripped = 0;
  for (const tool of result.tools) {
    if (tool && typeof tool === 'object' && 'outputSchema' in tool) {
      delete tool.outputSchema;
      stripped++;
    }
  }
  if (stripped) log(`stripped outputSchema from ${stripped} tool(s)`);
  return result;
}

/** Streamable HTTP replies are either plain JSON or an SSE stream. */
function parseBody(contentType, text) {
  if (!text.trim()) return null;
  if (contentType.includes('text/event-stream')) {
    const messages = [];
    for (const line of text.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      try {
        messages.push(JSON.parse(payload));
      } catch (err) {
        log('unparseable SSE frame:', payload.slice(0, 200));
      }
    }
    return messages.length === 1 ? messages[0] : messages;
  }
  return JSON.parse(text);
}

async function forward(request) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    'X-Goog-Api-Key': API_KEY,
  };
  if (sessionId) headers['Mcp-Session-Id'] = sessionId;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  const returnedSession = res.headers.get('mcp-session-id');
  if (returnedSession) sessionId = returnedSession;

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text.slice(0, 500)}`);
  }

  return parseBody(res.headers.get('content-type') || '', text);
}

async function handle(line) {
  let request;
  try {
    request = JSON.parse(line);
  } catch (err) {
    log('dropping malformed stdin line:', line.slice(0, 200));
    return;
  }

  const isNotification = request.id === undefined || request.id === null;

  try {
    const response = await forward(request);
    if (response === null) return; // notifications / 202 with empty body

    for (const message of Array.isArray(response) ? response : [response]) {
      if (request.method === 'tools/list' && message && message.result) {
        stripOutputSchemas(message.result);
      }
      send(message);
    }
  } catch (err) {
    log(`${request.method} failed:`, err.message);
    if (!isNotification) {
      send({
        jsonrpc: '2.0',
        id: request.id,
        error: { code: -32603, message: `stitch-proxy: ${err.message}` },
      });
    }
  }
}

// Serialize requests so responses cannot interleave mid-line on stdout.
let queue = Promise.resolve();
let buffer = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let index;
  while ((index = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, index).trim();
    buffer = buffer.slice(index + 1);
    if (line) queue = queue.then(() => handle(line));
  }
});

process.stdin.on('end', () => {
  queue.then(() => process.exit(0));
});

log(`proxying to ${ENDPOINT}`);
