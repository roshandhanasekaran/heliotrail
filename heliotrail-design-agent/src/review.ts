#!/usr/bin/env npx tsx
/**
 * HelioTrail Design Review — standalone design critique mode.
 *
 * Takes screenshots of the running app and provides detailed critique
 * with actionable fixes.
 *
 * Usage:
 *   npm run review -- "Review the landing page"
 *   npm run review -- "Audit the passport viewer for accessibility"
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import type { McpServerConfig } from "@anthropic-ai/claude-agent-sdk";
import { DESIGN_REVIEW_PROMPT } from "./prompts.js";
import { designToolsServer } from "./tools.js";

const HELIOTRAIL_ROOT = process.env.HELIOTRAIL_ROOT ?? "..";

const mcpServers: Record<string, McpServerConfig> = {
  "design-tools": designToolsServer,
  playwright: {
    command: "npx",
    args: ["@playwright/mcp@latest"],
  },
};

async function main(): Promise<void> {
  const target =
    process.argv.slice(2).join(" ") ||
    "Review the HelioTrail landing page and provide detailed design critique.";

  console.log("=".repeat(60));
  console.log(" HelioTrail Design Review");
  console.log("=".repeat(60));
  console.log(`\nTarget: ${target}\n`);

  for await (const message of query({
    prompt: `${target}\n\nFollow the review methodology in your system prompt. Be thorough and specific.`,
    options: {
      cwd: HELIOTRAIL_ROOT,
      systemPrompt: DESIGN_REVIEW_PROMPT,
      allowedTools: ["Read", "Glob", "Grep", "WebSearch", "WebFetch"],
      mcpServers,
      permissionMode: "plan",
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
      console.log(` Review complete — Cost: $${message.total_cost_usd?.toFixed(4) ?? "?"}`);
      console.log("=".repeat(60));
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
