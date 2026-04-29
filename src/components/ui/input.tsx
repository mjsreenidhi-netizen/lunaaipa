import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-luna-border bg-luna-bg px-3 py-2 text-sm text-luna-text placeholder:text-luna-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luna-accent focus-visible:ring-offset-1 focus-visible:ring-offset-luna-surface",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
