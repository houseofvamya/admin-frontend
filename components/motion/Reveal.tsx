"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DURATION, EASE_LUXURY } from "@/lib/motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

export function Reveal({ children, delay = 0, y = 24, ...props }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : DURATION.slow,
        delay: shouldReduceMotion ? 0 : delay,
        ease: EASE_LUXURY,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
