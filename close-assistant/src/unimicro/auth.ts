/**
 * OAuth 2.0 authorization-code + PKCE for public clients, with a local loopback redirect.
 * Used for both the Unimicro identity server (REST API) and the MCP broker.
 */
import { createServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { config } from "../config.js";

export interface TokenSet {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  obtained_at: number;
  client_id: string;
  token_endpoint: string;
}

export type TokenKind = "rest" | "mcp";

const b64url = (b: Buffer) => b.toString("base64url");

interface PkceOptions {
  authorizeUrl: string;
  tokenUrl: string;
  clientId: string;
  scope: string;
  redirectPort: number;
  extraAuthParams?: Record<string, string>;
  extraTokenParams?: Record<string, string>;
  /** Called with the URL the user must open. Default: print to stderr. */
  onAuthUrl?: (url: string) => void;
  timeoutMs?: number;
}

export async function pkceLogin(o: PkceOptions): Promise<TokenSet> {
  const redirect = `http://localhost:${o.redirectPort}/callback`;
  const verifier = b64url(randomBytes(48));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const state = b64url(randomBytes(16));
  const url = new URL(o.authorizeUrl);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: o.clientId,
    redirect_uri: redirect,
    scope: o.scope,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    ...(o.extraAuthParams ?? {}),
  }).toString();
  (o.onAuthUrl ?? ((u) => console.error(`OPEN THIS URL:\n${u}\n`)))(url.toString());

  const code = await new Promise<string>((resolve, reject) => {
    const srv = createServer((req, res) => {
      const u = new URL(req.url ?? "/", `http://localhost:${o.redirectPort}`);
      if (u.pathname !== "/callback") { res.writeHead(404).end(); return; }
      if (u.searchParams.get("state") !== state) { res.writeHead(400).end("state mismatch"); return; }
      const err = u.searchParams.get("error");
      if (err) {
        res.writeHead(400).end(`error: ${err}`);
        srv.close(); reject(new Error(`${err}: ${u.searchParams.get("error_description") ?? ""}`)); return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        .end("<h2>Connected. You can close this tab.</h2>");
      srv.close(); resolve(u.searchParams.get("code") ?? "");
    }).listen(o.redirectPort, () => console.error(`waiting for callback on ${redirect} ...`));
    setTimeout(() => { srv.close(); reject(new Error("timed out waiting for login")); }, o.timeoutMs ?? 60 * 60_000).unref();
  });

  const res = await fetch(o.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code", code, redirect_uri: redirect,
      client_id: o.clientId, code_verifier: verifier, ...(o.extraTokenParams ?? {}),
    }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new Error(`token exchange failed: ${JSON.stringify(json)}`);
  return {
    ...(json as Omit<TokenSet, "obtained_at" | "client_id" | "token_endpoint">),
    obtained_at: Date.now(), client_id: o.clientId, token_endpoint: o.tokenUrl,
  };
}

/** RFC 7591 dynamic client registration (used by the MCP broker). */
export async function registerClient(registrationEndpoint: string, redirectPort: number, scope: string): Promise<string> {
  const res = await fetch(registrationEndpoint, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "Unimicro Close Assistant",
      redirect_uris: [`http://localhost:${redirectPort}/callback`],
      grant_types: ["authorization_code"], response_types: ["code"],
      token_endpoint_auth_method: "none", scope,
    }),
  });
  const json = (await res.json()) as { client_id?: string };
  if (!res.ok || !json.client_id) throw new Error(`registration failed: ${JSON.stringify(json)}`);
  return json.client_id;
}

// ---- token store -----------------------------------------------------------

type Store = Partial<Record<TokenKind, TokenSet>>;

function readStore(): Store {
  return existsSync(config.tokenFile) ? (JSON.parse(readFileSync(config.tokenFile, "utf8")) as Store) : {};
}
export function saveToken(kind: TokenKind, t: TokenSet): void {
  const s = readStore(); s[kind] = t; writeFileSync(config.tokenFile, JSON.stringify(s, null, 2));
}
export function getStoredToken(kind: TokenKind): TokenSet | undefined { return readStore()[kind]; }

export function isExpired(t: TokenSet, skewSec = 60): boolean {
  if (!t.expires_in) return false;
  return Date.now() > t.obtained_at + (t.expires_in - skewSec) * 1000;
}

async function refresh(kind: TokenKind, t: TokenSet): Promise<TokenSet> {
  const res = await fetch(t.token_endpoint, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: t.refresh_token!, client_id: t.client_id }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new Error(`refresh failed: ${JSON.stringify(json)}`);
  const nt: TokenSet = { ...t, ...(json as Partial<TokenSet>), obtained_at: Date.now() };
  saveToken(kind, nt);
  return nt;
}

/**
 * Returns a usable access token or throws a NeedsLoginError.
 * The token issued by the MCP broker carries AppFramework/Accounting/Sales scopes and is accepted by the
 * REST API too (verified 2026-09-08), so "rest" falls back to the "mcp" token when no dedicated one exists.
 */
export async function getAccessToken(kind: TokenKind): Promise<string> {
  const candidates: TokenKind[] = kind === "rest" ? ["rest", "mcp"] : [kind];
  let lastError: NeedsLoginError = new NeedsLoginError(kind);
  for (const k of candidates) {
    const t = getStoredToken(k);
    if (!t) continue;
    if (!isExpired(t)) return t.access_token;
    if (t.refresh_token) { try { return (await refresh(k, t)).access_token; } catch { /* fall through */ } }
    lastError = new NeedsLoginError(k, "token expired");
  }
  throw lastError;
}

export class NeedsLoginError extends Error {
  constructor(public kind: TokenKind, detail = "no token") {
    super(`Unimicro ${kind.toUpperCase()} login required (${detail}). Run: npm run cli -- login ${kind}`);
  }
}

// ---- high-level login helpers ---------------------------------------------

export async function loginRest(onAuthUrl?: (u: string) => void): Promise<TokenSet> {
  if (!config.clientId) throw new Error("UNIMICRO_CLIENT_ID is not set (register a PKCE client in the developer portal)");
  const t = await pkceLogin({
    authorizeUrl: `${config.loginUrl}/connect/authorize`,
    tokenUrl: `${config.loginUrl}/connect/token`,
    clientId: config.clientId, scope: config.scopes, redirectPort: config.restRedirectPort,
    extraAuthParams: { prompt: "login" }, onAuthUrl,
  });
  saveToken("rest", t); return t;
}

export async function loginMcp(onAuthUrl?: (u: string) => void): Promise<TokenSet> {
  const as = new URL(config.mcpUrl).origin;
  const meta = (await (await fetch(`${as}/.well-known/oauth-authorization-server`)).json()) as
    { authorization_endpoint: string; token_endpoint: string; registration_endpoint: string };
  const scope = "openid McpUniMicro.All";
  const clientId = getStoredToken("mcp")?.client_id ?? (await registerClient(meta.registration_endpoint, config.mcpRedirectPort, scope));
  const t = await pkceLogin({
    authorizeUrl: meta.authorization_endpoint, tokenUrl: meta.token_endpoint, clientId, scope,
    redirectPort: config.mcpRedirectPort,
    extraAuthParams: { resource: config.mcpUrl }, extraTokenParams: { resource: config.mcpUrl }, onAuthUrl,
  });
  saveToken("mcp", t); return t;
}
