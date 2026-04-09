/**
 * Custom MCP tools for the HelioTrail Design Agent.
 *
 * These tools give the agent domain-specific capabilities beyond the built-in
 * file/bash/web tools — design token extraction, component inventory, and
 * design-cycle state management.
 */

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Tool: extract_design_tokens
// ---------------------------------------------------------------------------
const extractDesignTokens = tool(
  "extract_design_tokens",
  "Extract design tokens (colors, spacing, typography, radii, shadows) from the HelioTrail tailwind.config or CSS variables. Returns structured token data the agent can reference while designing.",
  {
    tokenType: z
      .enum(["colors", "spacing", "typography", "radii", "shadows", "all"])
      .describe("Which token category to extract"),
  },
  async ({ tokenType }) => {
    const summary = [
      `Design token extraction requested: ${tokenType}`,
      "",
      "The agent should read the project's tailwind.config.ts and globals.css",
      "to extract the actual token values. This tool serves as a reminder to",
      "always ground designs in the project's real design system.",
      "",
      "Key files to check:",
      "- tailwind.config.ts (theme.extend)",
      "- src/app/globals.css (CSS custom properties)",
      "- components.json (shadcn/ui configuration)",
    ].join("\n");

    return {
      content: [{ type: "text" as const, text: summary }],
    };
  },
  {
    annotations: {
      readOnlyHint: true,
      openWorldHint: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Tool: component_inventory
// ---------------------------------------------------------------------------
const componentInventory = tool(
  "component_inventory",
  "List all UI components in the HelioTrail codebase with their locations and usage patterns. Helps avoid creating duplicate components.",
  {
    category: z
      .enum(["ui", "layout", "features", "all"])
      .describe("Component category to inventory"),
  },
  async ({ category }) => {
    const directories: Record<string, string[]> = {
      ui: ["src/components/ui/"],
      layout: ["src/components/layout/", "src/app/**/layout.tsx"],
      features: ["src/components/", "src/app/**/page.tsx"],
      all: [
        "src/components/",
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
      ],
    };

    const paths = directories[category] ?? directories.all;

    return {
      content: [
        {
          type: "text" as const,
          text: [
            `Component inventory requested: ${category}`,
            "",
            "Scan these directories with Glob and Read:",
            ...paths.map((p) => `  - ${p}`),
            "",
            "For each component found, note:",
            "  - Name and file path",
            "  - Props interface",
            "  - Usage count (grep for imports)",
            "  - Visual variants",
          ].join("\n"),
        },
      ],
    };
  },
  {
    annotations: {
      readOnlyHint: true,
      openWorldHint: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Tool: design_checkpoint
// ---------------------------------------------------------------------------
const designCheckpoint = tool(
  "design_checkpoint",
  "Record a design iteration checkpoint. Logs the current state of the design cycle so the agent can track its progress through research -> wireframe -> implementation -> critique phases.",
  {
    phase: z
      .enum(["research", "architecture", "implementation", "critique", "done"])
      .describe("Current design phase"),
    summary: z.string().describe("Brief summary of what was accomplished"),
    confidence: z
      .number()
      .min(1)
      .max(10)
      .describe("Confidence level 1-10 that this phase is complete"),
    nextAction: z.string().describe("What to do next"),
  },
  async ({ phase, summary, confidence, nextAction }) => {
    const shouldIterate = confidence < 8;
    const timestamp = new Date().toISOString();

    return {
      content: [
        {
          type: "text" as const,
          text: [
            `=== Design Checkpoint [${timestamp}] ===`,
            `Phase: ${phase}`,
            `Summary: ${summary}`,
            `Confidence: ${confidence}/10`,
            `Next: ${nextAction}`,
            "",
            shouldIterate
              ? "ITERATE: Confidence below 8 — revisit this phase before moving on."
              : "PROCEED: Quality bar met — move to next phase.",
          ].join("\n"),
        },
      ],
    };
  },
  {
    annotations: {
      readOnlyHint: true,
      openWorldHint: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Bundle into an in-process MCP server
// ---------------------------------------------------------------------------
export const designToolsServer = createSdkMcpServer({
  name: "heliotrail-design-tools",
  version: "1.0.0",
  tools: [extractDesignTokens, componentInventory, designCheckpoint],
});
