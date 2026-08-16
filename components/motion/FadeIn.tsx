"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DURATION, EASE_LUXURY } from "@/lib/motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function FadeIn({ children, delay = 0, ...props }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : DURATION.base,
        delay: shouldReduceMotion ? 0 : delay,
        ease: EASE_LUXURY,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
