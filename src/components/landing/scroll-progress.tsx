"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 right-0 z-50 h-0.5 origin-left bg-gradient-to-r from-primary via-fuchsia-500 to-primary"
      style={{ scaleX }}
    />
  );
}
