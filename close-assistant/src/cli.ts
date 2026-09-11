/** Developer CLI: login and call the same tool implementations without an MCP host. */
import { loginRest, loginMcp } from "./unimicro/auth.js";
import { registerTools } from "./tools/register.js";
import { UnimicroRest } from "./unimicro/rest.js";
import { UnimicroMcp } from "./unimicro/mcp-client.js";
import { config } from "./config.js";

const [cmd, ...rest] = process.argv.slice(2);

async function callTool(name: string, args: Record<string, unknown>) {
  const tools = registerTools();
  const t = tools[name];
  if (!t) throw new Error(`unknown tool ${name}. Available: ${Object.keys(tools).join(", ")}`);
  return t(args);
}

try {
  switch (cmd) {
    case "login": {
      const kind = rest[0] ?? "rest";
      const t = kind === "mcp" ? await loginMcp() : await loginRest();
      console.log(`${kind} token saved (expires_in=${t.expires_in}s, refresh=${t.refresh_token ? "yes" : "no"}, scope=${t.scope})`);
      break;
    }
    case "companies": console.log(JSON.stringify(await new UnimicroRest().companies(), null, 2)); break;
    case "biz": console.log(JSON.stringify(await new UnimicroRest().biz(rest[0], Object.fromEntries(rest.slice(1).map((kv) => kv.split("=", 2) as [string, string]))), null, 2)); break;
    case "stats": console.log(JSON.stringify(await new UnimicroRest().statistics(Object.fromEntries(rest.map((kv) => kv.split("=", 2) as [string, string])) as { model: string; select: string }), null, 2)); break;
    case "umcp": console.log(JSON.stringify(UnimicroMcp.payload(await new UnimicroMcp().call(rest[0], { companyKey: config.companyKey, ...(rest[1] ? JSON.parse(rest[1]) : {}) })), null, 2)); break;
    case "tool": console.log(JSON.stringify(await callTool(rest[0], rest[1] ? JSON.parse(rest[1]) : {}), null, 2)); break;
    default:
      console.log("usage:\n  cli login [rest|mcp]\n  cli companies\n  cli biz <entity> [filter=..] [select=..] [expand=..] [top=..]\n  cli stats model=.. select=.. [filter=..] [expand=..]\n  cli umcp <unimicroTool> [jsonArgs]\n  cli tool <closeAssistantTool> [jsonArgs]");
  }
} catch (e) { console.error("ERROR:", e instanceof Error ? e.message : e); process.exit(1); }
