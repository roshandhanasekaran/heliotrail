"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    // When pathname changes, fade out then swap content
    setTransitioning(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitioning(false);
    }, 150); // match the CSS exit duration

    return () => clearTimeout(timeout);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // On first render or when children update without route change
  useEffect(() => {
    if (!transitioning) {
      setDisplayChildren(children);
    }
  }, [children, transitioning]);

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning
          ? "translateY(8px)"
          : "translateY(0)",
      }}
    >
      {displayChildren}
    </div>
  );
}
