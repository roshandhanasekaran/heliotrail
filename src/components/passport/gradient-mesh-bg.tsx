"use client";

export function GradientMeshBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle scan lines */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(76,175,80,0.3) 2px,
            rgba(76,175,80,0.3) 3px
          )`,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(76,175,80,0.4) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(76,175,80,0.4) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 left-0 w-48 h-48 opacity-[0.04]"
        style={{
          background: "linear-gradient(135deg, #4caf50 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-48 h-48 opacity-[0.04]"
        style={{
          background: "linear-gradient(315deg, #4caf50 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
