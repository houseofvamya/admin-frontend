"use client";

import { cn } from "@/lib/utils";

export interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

function ToggleSwitch({ checked, onCheckedChange, disabled, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "border-transparent bg-gold" : "border-line bg-cream",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block size-4 translate-x-1 transform rounded-full bg-ivory shadow-soft transition-transform",
          checked && "translate-x-6",
        )}
      />
    </button>
  );
}

export { ToggleSwitch };
