"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showShortcutHint?: boolean;
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, showShortcutHint = true, placeholder = "Search...", ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-charcoal-soft" />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-full border border-line bg-ivory pl-10 text-sm text-charcoal placeholder:text-charcoal-soft/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:border-gold",
            showShortcutHint ? "pr-14" : "pr-4",
            className,
          )}
          {...props}
        />
        {showShortcutHint && (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-line bg-cream px-1.5 py-0.5 text-[11px] font-medium text-charcoal-soft">
            ⌘K
          </span>
        )}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
