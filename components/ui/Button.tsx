"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-charcoal text-ivory hover:bg-charcoal/90 shadow-soft",
        secondary: "bg-gold text-charcoal hover:bg-gold-deep hover:text-ivory shadow-soft",
        outline: "border border-line bg-transparent text-charcoal hover:border-gold hover:text-gold-deep",
        ghost: "bg-transparent text-charcoal hover:bg-cream",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        whileHover={disabled || isLoading ? undefined : { scale: 1.02 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
