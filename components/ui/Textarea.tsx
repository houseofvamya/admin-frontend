import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full resize-y rounded-lg border border-line bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal-soft/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:border-gold disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-400 focus-visible:ring-red-400",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? `${textareaId}-description` : undefined}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={`${textareaId}-description`}
            className={cn("text-xs", error ? "text-red-600" : "text-charcoal-soft")}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
