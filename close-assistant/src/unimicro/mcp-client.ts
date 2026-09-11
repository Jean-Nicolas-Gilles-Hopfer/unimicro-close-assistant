/**
 * Minimal MCP client (Streamable HTTP) for Unimicro's hosted MCP server.
 * We proxy to it for things it already does well (booking with confirmation, semantic account search, revision check).
 */
import { config } from "../config.js";
import { getAccessToken } from "./auth.js";

interface RpcResult { result?: unknown; error?: { code: number; message: string; data?: unknown } }

export interface ToolResult { content?: { type: string; text?: string }[]; structuredContent?: Record<string, unknown>; isError?: boolean }

export class UnimicroMcp {
  private id = 0;
  private session: string | null = null;
  private initialized = false;
  constructor(private url = config.mcpUrl) {}

  private async rpc(method: string, params: unknown, notify = false): Promise<unknown> {
    const body: Record<string, unknown> = { jsonrpc: "2.0", method, params };
    if (!notify) body.id = ++this.id;
    const headers: Record<string, string> = {
      "Content-Type": "application/json", Accept: "application/json, text/event-stream",
      Authorization: `Bearer ${await getAccessToken("mcp")}`,
    };
    if (this.session) headers["Mcp-Session-Id"] = this.session;
    const res = await fetch(this.url, { method: "POST", headers, body: JSON.stringify(body) });
    const sid = res.headers.get("mcp-session-id"); if (sid) this.session = sid;
    if (notify) return null;
    const text = await res.text();
    if (!res.ok) throw new Error(`MCP HTTP ${res.status}: ${text.slice(0, 300)}`);
    let msg: RpcResult | undefined;
    if ((res.headers.get("content-type") ?? "").includes("text/event-stream")) {
      for (const line of text.split("\n")) if (line.startsWith("data:")) { try { msg = JSON.parse(line.slice(5)); } catch { /* ignore */ } }
    } else if (text) msg = JSON.parse(text);
    if (msg?.error) throw new Error(`MCP error ${msg.error.code}: ${msg.error.message}`);
    return msg?.result;
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    await this.rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "unimicro-close-assistant", version: "0.1" } });
    await this.rpc("notifications/initialized", {}, true);
    this.initialized = true;
  }

  async listTools(): Promise<{ name: string; description?: string; inputSchema?: unknown }[]> {
    await this.init();
    return ((await this.rpc("tools/list", {})) as { tools: { name: string; description?: string; inputSchema?: unknown }[] }).tools;
  }

  async call(name: string, args: Record<string, unknown> = {}): Promise<ToolResult> {
    await this.init();
    return (await this.rpc("tools/call", { name, arguments: args })) as ToolResult;
  }

  /** Unwraps Unimicro's double-encoded structuredContent. */
  static payload(r: ToolResult): Record<string, unknown> {
    if (r.structuredContent) return r.structuredContent;
    const t = r.content?.find((c) => c.type === "text")?.text;
    if (!t) return {};
    try { const j = JSON.parse(t); return (j.structuredContent ?? j) as Record<string, unknown>; } catch { return { text: t }; }
  }
}
