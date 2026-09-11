/** Close Assistant MCP server (stdio). Add to Claude Desktop / Claude Code as a local server. */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/register.js";

const server = new McpServer({ name: "unimicro-close-assistant", version: "0.1.0" });
registerTools(server);
await server.connect(new StdioServerTransport());
console.error("unimicro-close-assistant MCP server ready (stdio)");
