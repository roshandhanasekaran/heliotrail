"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const COLORS = [
  [134, 239, 172], // #86EFAC - green-300
  [187, 247, 208], // #BBF7D0 - green-200
  [167, 243, 208], // #A7F3D0 - emerald-200
];

const DARK_COLORS = [
  [15, 60, 30],   // very dark green
  [10, 45, 22],   // darker green
  [20, 75, 40],   // slightly less dark
];

// Bright green for flicker highlights (#22C55E)
const FLICKER_COLOR = [34, 197, 94];

const COL_W = 14;
const GAP = 4;
const STEP = COL_W + GAP;
const HEIGHTS = [16, 22, 28, 36, 12, 20, 30];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  ci: number; // color index
  phase: number; // pulse phase offset
  freq: number; // pulse frequency
  colorSpeed: number;
  colorPhase: number;
  // Flicker properties
  flickerPhase: number; // offset so tiles don't flicker in sync
  flickerFreq: number; // how fast this tile flickers
  flickerIntensity: number; // max brightness of the flicker (0-1)
  flickerThreshold: number; // only flicker when sin > threshold (creates sparse bursts)
}

function buildBlocks(cols: number, maxH: number, seed: number): Block[] {
  const r = seeded(seed);
  const blocks: Block[] = [];
  for (let c = 0; c < cols; c++) {
    const x = c * STEP;
    let y = 0;
    while (y < maxH) {
      const h = HEIGHTS[Math.floor(r() * HEIGHTS.length)];
      if (y + h > maxH + 20) break;
      blocks.push({
        x,
        y,
        w: COL_W,
        h,
        ci: Math.floor(r() * COLORS.length),
        phase: r() * Math.PI * 2,
        freq: 0.015 + r() * 0.025,
        colorSpeed: 0.008 + r() * 0.012,
        colorPhase: r() * Math.PI * 2,
        // Flicker: staggered timing, varied intensity
        flickerPhase: r() * Math.PI * 2,
        flickerFreq: 0.3 + r() * 1.2, // different rates per tile
        flickerIntensity: 0.40 + r() * 0.40, // 0.40-0.80 max opacity
        flickerThreshold: 0.6 + r() * 0.3, // 0.6-0.9 — higher = rarer flickers
      });
      y += h + GAP;
    }
  }
  return blocks;
}

export function GreenMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<Block[]>([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = resolvedTheme === "dark";
    const activeColors = isDark ? DARK_COLORS : COLORS;

    const W = 1600;
    const H = 750;
    canvas.width = W;
    canvas.height = H;

    const cols = Math.ceil(W / STEP);
    blocksRef.current = buildBlocks(cols, H, 42);
    const blocks = blocksRef.current;

    // Precompute center for radial fade
    const cx = W / 2;
    const cy = H * 0.45;
    const rx = W * 0.3;
    const ry = H * 0.32;
    const maxDist = Math.sqrt(2); // max normalized distance for radial falloff

    let frame = 0;
    let animId: number;

    function draw() {
      frame++;
      const t = frame * 0.016; // ~60fps time approximation

      ctx!.clearRect(0, 0, W, H);

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];

        // Radial fade: blocks near center are more transparent
        const dx = (b.x + b.w / 2 - cx) / rx;
        const dy = (b.y + b.h / 2 - cy) / ry;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.6) continue; // skip blocks in the center
        const edgeFade = Math.min(1, (dist - 0.6) / 0.8);

        // Pulsing opacity — slightly higher base alpha in dark mode
        const pulse = Math.sin(t * b.freq + b.phase);
        const baseAlpha = isDark ? 0.5 : 0.3;
        const alpha = (baseAlpha + 0.55 * (pulse * 0.5 + 0.5)) * edgeFade;

        // Color cycling between two greens
        const colorBlend = Math.sin(t * b.colorSpeed + b.colorPhase) * 0.5 + 0.5;
        const c1 = activeColors[b.ci % activeColors.length];
        const c2 = activeColors[(b.ci + 1) % activeColors.length];
        const r = Math.round(c1[0] + (c2[0] - c1[0]) * colorBlend);
        const g = Math.round(c1[1] + (c2[1] - c1[1]) * colorBlend);
        const bl = Math.round(c1[2] + (c2[2] - c1[2]) * colorBlend);

        ctx!.fillStyle = `rgba(${r},${g},${bl},${alpha})`;
        ctx!.fillRect(b.x, b.y, b.w, b.h);

        // ---- Flicker overlay ----
        // Tiles closer to center flicker more frequently (inverted radial)
        const proximityBoost = Math.max(0, 1 - dist / maxDist);
        const flickerSin = Math.sin(t * b.flickerFreq + b.flickerPhase);
        // Only show flicker when sin exceeds threshold (creates sparse, random-looking bursts)
        if (flickerSin > b.flickerThreshold) {
          // Normalize the above-threshold portion to 0-1 for smooth fade in/out
          const flickerAmount =
            (flickerSin - b.flickerThreshold) / (1 - b.flickerThreshold);
          // In dark mode, flicker intensity is higher so bright green sparkles pop
          const intensityScale = isDark ? (0.5 + (flickerAmount) * 0.5) : b.flickerIntensity;
          // Quadratic ease for smoother pulse
          const flickerAlpha =
            flickerAmount *
            flickerAmount *
            intensityScale *
            edgeFade *
            (0.4 + 0.6 * proximityBoost); // center tiles get up to 100%, edges down to 40%
          ctx!.fillStyle = `rgba(${FLICKER_COLOR[0]},${FLICKER_COLOR[1]},${FLICKER_COLOR[2]},${flickerAlpha})`;
          ctx!.fillRect(b.x, b.y, b.w, b.h);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animId);
  }, [resolvedTheme]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-none"
          style={{ width: 1600, height: 750 }}
        />
      </div>
    </div>
  );
}
