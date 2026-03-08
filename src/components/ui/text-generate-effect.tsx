"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) {
  const wordsArray = words.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: filter ? 10 : 0,
      filter: filter ? "blur(8px)" : "none",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      className={cn("font-bold", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {wordsArray.map((word, i) => (
        <motion.span key={i} variants={child} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
