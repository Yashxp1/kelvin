"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Brand = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div
      className="flex bg-[#F0EDED] justify-center w-full overflow-hidden"
      ref={ref}
    >
      <motion.h1
        className="font-manrope text-[400px] font-bold text-[#564F4B] bg-[#F0EDED] w-full text-center leading-[0.8] -mb-[0.08em] tracking-tighter"
        style={{ scale, opacity }}
      >
        Kelvin.
      </motion.h1>
    </div>
  );
};

export default Brand;
