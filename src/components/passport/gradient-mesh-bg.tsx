"use client";

export function GradientMeshBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute -top-1/3 -right-1/4 h-[900px] w-[900px] rounded-full opacity-[0.05]"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 h-[700px] w-[700px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.02]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
