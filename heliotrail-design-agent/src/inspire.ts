#!/usr/bin/env npx tsx
/**
 * HelioTrail Inspiration Research — design reference gathering.
 *
 * Searches the web for best-in-class UI examples, takes screenshots,
 * and synthesizes actionable design direction.
 *
 * Usage:
 *   npm run inspire -- "Dashboard layouts for battery analytics"
 *   npm run inspire -- "Data table designs with filtering and sorting"
 *   npm run inspire -- "Pricing page designs for B2B SaaS"
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import type { McpServerConfig } from "@anthropic-ai/claude-agent-sdk";
import { INSPIRATION_RESEARCH_PROMPT } from "./prompts.js";

const mcpServers: Record<string, McpServerConfig> = {
  playwright: {
    command: "npx",
    args: ["@playwright/mcp@latest"],
  },
  firecrawl: {
    command: "npx",
    args: ["-y", "firecrawl-mcp"],
  },
};

async function main(): Promise<void> {
  const topic =
    process.argv.slice(2).join(" ") ||
    "Enterprise SaaS dashboard designs with data visualization for battery compliance data.";

  console.log("=".repeat(60));
  console.log(" HelioTrail Inspiration Research");
  console.log("=".repeat(60));
  console.log(`\nTopic: ${topic}\n`);

  for await (const message of query({
    prompt: `Research design inspiration for: ${topic}\n\nFollow your research methodology. Provide specific, actionable findings.`,
    options: {
      systemPrompt: INSPIRATION_RESEARCH_PROMPT,
      allowedTools: ["WebSearch", "WebFetch", "Read"],
      mcpServers,
      thinking: { type: "adaptive" },
      maxTurns: 15,
    },
  })) {
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "text") {
          console.log(block.text);
        }
      }
    } else if (message.type === "result" && message.subtype === "success") {
      console.log("\n" + "=".repeat(60));
      console.log(` Research complete — Cost: $${message.total_cost_usd?.toFixed(4) ?? "?"}`);
      console.log("=".repeat(60));
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
