"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
  className?: string;
  children: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoGridItemProps {
  className?: string;
  children: ReactNode;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

const colSpanMap = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-3",
};

const rowSpanMap = {
  1: "",
  2: "row-span-2",
};

export function BentoGridItem({
  className,
  children,
  colSpan = 1,
  rowSpan = 1,
}: BentoGridItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-6",
        "hover:border-white/20 hover:bg-white/[0.07] transition-colors duration-300",
        colSpanMap[colSpan],
        rowSpanMap[rowSpan],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
