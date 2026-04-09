#!/usr/bin/env npx tsx
/**
 * HelioTrail Design Agent — Elite UI/UX frontend agent.
 *
 * Runs a full design cycle: research inspiration, study the codebase,
 * architect components, implement high-fidelity UI, screenshot & critique,
 * iterate until the quality bar is met, then ship production-ready code.
 *
 * Usage:
 *   npm start -- "Redesign the battery passport detail page"
 *   npm run design -- "Create a new analytics dashboard"
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import type { McpServerConfig } from "@anthropic-ai/claude-agent-sdk";
import { DESIGN_AGENT_SYSTEM_PROMPT } from "./prompts.js";
import { designAgents } from "./agents.js";
import { designToolsServer } from "./tools.js";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const HELIOTRAIL_ROOT = process.env.HELIOTRAIL_ROOT ?? "..";

/** MCP servers that give the agent superpowers */
const mcpServers: Record<string, McpServerConfig> = {
  // In-process design tools (token extraction, component inventory, checkpoints)
  "design-tools": designToolsServer,

  // Browser automation — screenshots, visual inspection, navigation
  playwright: {
    command: "npx",
    args: ["@playwright/mcp@latest"],
  },

  // Web scraping — design inspiration, competitive analysis
  firecrawl: {
    command: "npx",
    args: ["-y", "firecrawl-mcp"],
  },

  // Documentation lookup — React, Tailwind, shadcn/ui, Next.js latest docs
  context7: {
    command: "npx",
    args: ["-y", "@upstash/context7-mcp@latest"],
  },
};

// ---------------------------------------------------------------------------
// Prompt assembly
// ---------------------------------------------------------------------------

function buildPrompt(userRequest: string): string {
  return `# Design Task

${userRequest}

# Instructions

Follow your design process loop:

1. **Research** — Read the HelioTrail codebase to understand existing patterns. Use the design-researcher agent to gather inspiration from the web. Take screenshots of reference sites. Use extract_design_tokens to ground yourself in the project's design system. Use component_inventory to see what already exists.

2. **Architect** — Plan the component tree, layout grid, and information hierarchy. Use the component-architect agent if the task involves new or complex components.

3. **Implement** — Write production-ready React + TypeScript + Tailwind code. Use shadcn/ui components. Follow the project's existing patterns. Make it pixel-perfect.

4. **Critique** — Use Playwright to screenshot what you built. Use the design-critic agent to evaluate the result. Run the accessibility-auditor agent. Log a design_checkpoint.

5. **Iterate** — If any critique dimension scores below 8/10, fix the issues and re-screenshot. Repeat until quality bar is met.

6. **Ship** — Log a final design_checkpoint with phase "done". Present the finished work.

Work in the HelioTrail project root: ${HELIOTRAIL_ROOT}

Always study the existing codebase FIRST before making changes. Never create components that duplicate existing ones.`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const userRequest =
    process.argv.slice(2).join(" ") ||
    "Analyze the current HelioTrail UI and suggest three high-impact design improvements with mockup implementations.";

  console.log("=".repeat(60));
  console.log(" HelioTrail Design Agent");
  console.log(" Elite UI/UX Frontend Agent");
  console.log("=".repeat(60));
  console.log(`\nTask: ${userRequest}\n`);

  const prompt = buildPrompt(userRequest);

  for await (const message of query({
    prompt,
    options: {
      cwd: HELIOTRAIL_ROOT,
      systemPrompt: DESIGN_AGENT_SYSTEM_PROMPT,

      // Tools: full Claude Code preset + our custom MCP tools + subagents
      allowedTools: [
        "Read",
        "Write",
        "Edit",
        "Bash",
        "Glob",
        "Grep",
        "WebSearch",
        "WebFetch",
        "Agent",
      ],

      // MCP servers for browser, scraping, docs, and custom design tools
      mcpServers,

      // Subagents for specialized design tasks
      agents: designAgents,

      // Allow edits to the codebase
      permissionMode: "acceptEdits",

      // Adaptive thinking for complex design decisions
      thinking: { type: "adaptive" },
      effort: "high",

      // Load project-level settings (CLAUDE.md, skills, commands)
      settingSources: ["project"],

      // Higher turn limit for iterative design cycles
      maxTurns: 40,
    },
  })) {
    // ---- Route messages to the console ------------------------------------
    switch (message.type) {
      case "system":
        if (message.subtype === "init") {
          console.log("[init] Session started\n");
        }
        break;

      case "assistant":
        for (const block of message.message.content) {
          if (block.type === "text") {
            console.log(block.text);
          }
        }
        break;

      case "result":
        console.log("\n" + "=".repeat(60));
        if (message.subtype === "success") {
          console.log(" Design cycle complete");
          console.log(` Cost: $${message.total_cost_usd?.toFixed(4) ?? "?"}`);
          console.log(` Turns: ${message.num_turns ?? "?"}`);
          if (message.result) {
            console.log("\n" + message.result);
          }
        } else {
          console.error(" Design cycle failed");
          if ("errors" in message) {
            console.error(message.errors);
          }
        }
        console.log("=".repeat(60));
        break;
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
