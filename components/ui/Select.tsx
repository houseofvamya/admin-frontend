import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, label, error, helperText, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "h-11 w-full appearance-none rounded-lg border border-line bg-ivory px-3.5 pr-9 text-sm text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:border-gold disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-400 focus-visible:ring-red-400",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error || helperText ? `${selectId}-description` : undefined}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-charcoal-soft" />
        </div>
        {(error || helperText) && (
          <p
            id={`${selectId}-description`}
            className={cn("text-xs", error ? "text-red-600" : "text-charcoal-soft")}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
