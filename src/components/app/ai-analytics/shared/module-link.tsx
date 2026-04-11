"use client";

interface ModuleLinkProps {
  moduleId: string;
  onClick: (moduleId: string) => void;
  className?: string;
}

export function ModuleLink({ moduleId, onClick, className }: ModuleLinkProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(moduleId)}
      className={`font-mono text-xs text-foreground underline decoration-dashed underline-offset-2 hover:text-primary transition-colors cursor-pointer ${className ?? ""}`}
    >
      {moduleId}
    </button>
  );
}
