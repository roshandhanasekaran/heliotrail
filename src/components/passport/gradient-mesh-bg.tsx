"use client";

export function GradientMeshBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/3 -left-1/4 h-[600px] w-[600px] rounded-full opacity-[0.03]"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
