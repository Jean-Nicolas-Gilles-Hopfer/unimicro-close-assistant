import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadDotEnv(): void {
  const p = join(ROOT, ".env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
loadDotEnv();

const trimSlash = (s: string) => s.replace(/\/+$/, "");

export const config = {
  baseUrl: trimSlash(process.env.UNIMICRO_BASE_URL ?? "https://test.unimicro.no/"),
  loginUrl: trimSlash(process.env.UNIMICRO_LOGIN_URL ?? "https://test-login.unimicro.no"),
  mcpUrl: process.env.UNIMICRO_MCP_URL ?? "https://test-mcp.unimicro.app/mcp",
  clientId: process.env.UNIMICRO_CLIENT_ID ?? "",
  scopes: process.env.UNIMICRO_SCOPES ?? "AppFramework openid profile offline_access",
  companyKey: process.env.UNIMICRO_COMPANY_KEY ?? "",
  tokenFile: join(ROOT, ".tokens.json"),
  restRedirectPort: 8766,
  mcpRedirectPort: 8765,
};
