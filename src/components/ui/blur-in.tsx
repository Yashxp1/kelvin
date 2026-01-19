"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type BlurInProps = {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  duration?: number;
  delay?: number;
  y?: number;
  once?: boolean;
};

export const BlurIn = ({
  children,
  className,
  blur = 16,
  duration = 0.8,
  delay = 0,
  y = 12,
  once = true,
}: BlurInProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, filter: `blur(${blur}px)`, y }
      }
      animate={
        isInView
          ? shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, filter: "blur(0px)", y: 0 }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
