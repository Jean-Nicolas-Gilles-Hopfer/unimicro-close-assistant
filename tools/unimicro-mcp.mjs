#!/usr/bin/env node
// Minimal standalone MCP client for the Unimicro test MCP server (Streamable HTTP + OAuth/PKCE).
// Usage:
//   node tools/unimicro-mcp.mjs login            -> prints a URL; open it, sign in; token saved to .unimicro-token.json
//   node tools/unimicro-mcp.mjs list             -> lists tools
//   node tools/unimicro-mcp.mjs call <tool> '<json-args>'
import { createServer } from "node:http";
import { randomBytes, createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN_FILE = join(ROOT, ".unimicro-token.json");
const MCP_URL = "https://test-mcp.unimicro.app/mcp";
const AS = "https://test-mcp.unimicro.app";
const PORT = 8765;
const REDIRECT = `http://localhost:${PORT}/callback`;

const b64url = (buf) => buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function login() {
  const meta = await (await fetch(`${AS}/.well-known/oauth-authorization-server`)).json();
  let saved = existsSync(TOKEN_FILE) ? JSON.parse(readFileSync(TOKEN_FILE, "utf8")) : {};
  let clientId = saved.client_id;
  if (!clientId) {
    const reg = await fetch(meta.registration_endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: "Unimicro Hackathon local client",
        redirect_uris: [REDIRECT],
        grant_types: ["authorization_code"],
        response_types: ["code"],
        token_endpoint_auth_method: "none",
        scope: "openid McpUniMicro.All",
      }),
    });
    const regJson = await reg.json();
    if (!reg.ok) throw new Error("registration failed: " + JSON.stringify(regJson));
    clientId = regJson.client_id;
    console.error("registered client_id", clientId);
  }
  const verifier = b64url(randomBytes(48));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const state = b64url(randomBytes(16));
  const url = new URL(meta.authorization_endpoint);
  url.search = new URLSearchParams({
    response_type: "code", client_id: clientId, redirect_uri: REDIRECT,
    scope: "openid McpUniMicro.All", state, code_challenge: challenge, code_challenge_method: "S256",
    resource: MCP_URL,
  }).toString();
  console.log("OPEN THIS URL:\n" + url.toString() + "\n");

  const code = await new Promise((resolve, reject) => {
    const srv = createServer((req, res) => {
      const u = new URL(req.url, `http://localhost:${PORT}`);
      if (u.pathname !== "/callback") { res.writeHead(404).end(); return; }
      if (u.searchParams.get("state") !== state) { res.writeHead(400).end("bad state"); reject(new Error("state mismatch")); return; }
      const err = u.searchParams.get("error");
      if (err) { res.writeHead(400).end("error: " + err); reject(new Error(err + " " + u.searchParams.get("error_description"))); return; }
      res.writeHead(200, { "Content-Type": "text/html" }).end("<h2>Unimicro MCP connected. You can close this tab.</h2>");
      srv.close(); resolve(u.searchParams.get("code"));
    }).listen(PORT, () => console.error(`waiting for callback on ${REDIRECT} ...`));
    setTimeout(() => { srv.close(); reject(new Error("timeout waiting for login")); }, 10 * 60 * 1000);
  });

  const tok = await fetch(meta.token_endpoint, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT, client_id: clientId, code_verifier: verifier, resource: MCP_URL }),
  });
  const tokJson = await tok.json();
  if (!tok.ok) throw new Error("token exchange failed: " + JSON.stringify(tokJson));
  writeFileSync(TOKEN_FILE, JSON.stringify({ client_id: clientId, ...tokJson, obtained_at: Date.now() }, null, 2));
  console.log(`token saved to ${TOKEN_FILE} (expires_in=${tokJson.expires_in}s, scope=${tokJson.scope})`);
}

function token() {
  if (!existsSync(TOKEN_FILE)) throw new Error("no token; run: node tools/unimicro-mcp.mjs login");
  const t = JSON.parse(readFileSync(TOKEN_FILE, "utf8"));
  if (t.expires_in && Date.now() > t.obtained_at + t.expires_in * 1000) throw new Error("token expired; run login again");
  return t.access_token;
}

async function parseBody(res) {
  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  if (ct.includes("text/event-stream")) {
    const msgs = [];
    for (const line of text.split("\n")) if (line.startsWith("data:")) { try { msgs.push(JSON.parse(line.slice(5).trim())); } catch {} }
    return msgs.length === 1 ? msgs[0] : msgs;
  }
  return text ? JSON.parse(text) : null;
}

class Client {
  constructor() { this.id = 0; this.session = null; }
  async rpc(method, params, notify = false) {
    const body = { jsonrpc: "2.0", method, params };
    if (!notify) body.id = ++this.id;
    const headers = { "Content-Type": "application/json", Accept: "application/json, text/event-stream", Authorization: `Bearer ${token()}` };
    if (this.session) headers["Mcp-Session-Id"] = this.session;
    const res = await fetch(MCP_URL, { method: "POST", headers, body: JSON.stringify(body) });
    const sid = res.headers.get("mcp-session-id"); if (sid) this.session = sid;
    if (notify) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
    const msg = await parseBody(res);
    if (msg?.error) throw new Error("RPC error: " + JSON.stringify(msg.error));
    return msg?.result;
  }
  async init() {
    const r = await this.rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "unimicro-hackathon-cli", version: "0.1" } });
    await this.rpc("notifications/initialized", {}, true);
    return r;
  }
}

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === "login") await login();
  else if (cmd === "list") {
    const c = new Client(); const info = await c.init();
    console.error("server:", JSON.stringify(info?.serverInfo));
    const r = await c.rpc("tools/list", {});
    for (const t of r.tools) console.log(`\n## ${t.name}\n${t.description || ""}\n${JSON.stringify(t.inputSchema?.properties || {}, null, 1)}`);
  } else if (cmd === "call") {
    const c = new Client(); await c.init();
    const r = await c.rpc("tools/call", { name: rest[0], arguments: rest[1] ? JSON.parse(rest[1]) : {} });
    console.log(JSON.stringify(r, null, 2));
  } else { console.log("commands: login | list | call <tool> <json>"); }
} catch (e) { console.error("ERROR:", e.message); process.exit(1); }
