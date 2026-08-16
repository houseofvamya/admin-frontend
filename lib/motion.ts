export const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
} as const;

export const STAGGER = 0.08;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_LUXURY },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER },
  },
};
