import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusTimelineStep {
  status: string;
  label: string;
  timestamp?: string;
  completed: boolean;
}

export interface StatusTimelineProps {
  steps: StatusTimelineStep[];
  className?: string;
}

function StatusTimeline({ steps, className }: StatusTimelineProps) {
  return (
    <ol
      className={cn(
        "flex flex-col gap-0 lg:flex-row lg:items-start lg:gap-0",
        className,
      )}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <li key={step.status} className="relative flex flex-1 gap-3 pb-8 lg:flex-col lg:gap-2 lg:pb-0 lg:pr-4">
            <div className="flex flex-col items-center lg:flex-row lg:w-full">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  step.completed
                    ? "border-gold bg-gold text-charcoal"
                    : "border-line bg-ivory text-charcoal-soft",
                )}
              >
                {step.completed ? <Check className="size-3.5" /> : index + 1}
              </span>
              {!isLast && (
                <span
                  className={cn(
                    "w-0.5 flex-1 lg:h-0.5 lg:w-full",
                    step.completed ? "bg-gold" : "bg-line",
                  )}
                  aria-hidden
                />
              )}
            </div>

            <div className="flex flex-col gap-0.5 pt-0.5 lg:pt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  step.completed ? "text-charcoal" : "text-charcoal-soft",
                )}
              >
                {step.label}
              </span>
              {step.timestamp && <span className="text-xs text-charcoal-soft">{step.timestamp}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { StatusTimeline };
