"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  [217, 250, 218], // #D9FADA
  [245, 254, 246], // #F5FEF6
  [236, 253, 236], // #ECFDEC
];

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
      });
      y += h + GAP;
    }
  }
  return blocks;
}

export function GreenMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<Block[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

        // Pulsing opacity
        const pulse = Math.sin(t * b.freq + b.phase);
        const alpha = (0.3 + 0.55 * (pulse * 0.5 + 0.5)) * edgeFade;

        // Color cycling between two greens
        const colorBlend = Math.sin(t * b.colorSpeed + b.colorPhase) * 0.5 + 0.5;
        const c1 = COLORS[b.ci];
        const c2 = COLORS[(b.ci + 1) % COLORS.length];
        const r = Math.round(c1[0] + (c2[0] - c1[0]) * colorBlend);
        const g = Math.round(c1[1] + (c2[1] - c1[1]) * colorBlend);
        const bl = Math.round(c1[2] + (c2[2] - c1[2]) * colorBlend);

        ctx!.fillStyle = `rgba(${r},${g},${bl},${alpha})`;
        ctx!.fillRect(b.x, b.y, b.w, b.h);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animId);
  }, []);

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
