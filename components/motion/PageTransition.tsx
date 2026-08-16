"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE_LUXURY } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : DURATION.base, ease: EASE_LUXURY }}
    >
      {children}
    </motion.div>
  );
}
