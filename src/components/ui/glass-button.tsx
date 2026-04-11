"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer font-semibold transition-all duration-150 ease-out bg-primary text-foreground hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
  {
    variants: {
      size: {
        default: "px-5 py-2.5 text-sm",
        sm: "px-3 py-1.5 text-sm",
        lg: "px-7 py-3 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, ...props }, ref) => {
    return (
      <button
        className={cn(glassButtonVariants({ size }), className)}
        ref={ref}
        {...props}
      >
        <span className={cn(contentClassName)}>{children}</span>
      </button>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
