"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DURATION, EASE_LUXURY, STAGGER } from "@/lib/motion";

export function StaggerGroup({ children, ...props }: HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: shouldReduceMotion ? 0 : STAGGER },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION.base, ease: EASE_LUXURY },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
