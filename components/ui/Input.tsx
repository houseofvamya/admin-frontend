import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-11 w-full rounded-lg border border-line bg-ivory px-3.5 text-sm text-charcoal placeholder:text-charcoal-soft/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:border-gold disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-400 focus-visible:ring-red-400",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? `${inputId}-description` : undefined}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={`${inputId}-description`}
            className={cn("text-xs", error ? "text-red-600" : "text-charcoal-soft")}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
