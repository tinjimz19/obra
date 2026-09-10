import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-white/12 bg-white/[0.03] px-3.5 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground/70",
        "transition-colors duration-200 hover:border-white/20",
        "focus-visible:border-brand/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-11 w-full appearance-none rounded-md border border-white/12 bg-white/[0.03] px-3.5 py-2 text-sm text-foreground",
        "transition-colors duration-200 hover:border-white/20",
        "focus-visible:border-brand/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&>option]:bg-steel-900 [&>option]:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export { Input, Select };
