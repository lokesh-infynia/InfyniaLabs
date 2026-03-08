"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  as?: React.ElementType;
}

export function MovingBorder({
  children,
  duration = 3000,
  className,
  containerClassName,
  borderRadius = "1.5rem",
  as: Component = "div",
}: MovingBorderProps) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength?.();
    if (length) {
      const pct = (time % duration) / duration;
      progress.set(pct * length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.x ?? 0);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.y ?? 0);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <Component
      className={cn("relative overflow-hidden p-[1px]", containerClassName)}
      style={{ borderRadius }}
    >
      {/* Animated border SVG */}
      <div className="absolute inset-0" style={{ borderRadius }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          width="100%"
          height="100%"
        >
          <rect
            fill="none"
            width="100%"
            height="100%"
            rx={borderRadius}
            ry={borderRadius}
            ref={pathRef}
          />
        </svg>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "inline-block",
            transform,
          }}
        >
          <div
            className="h-20 w-20 opacity-[0.8] blur-[10px]"
            style={{
              background:
                "radial-gradient(ellipse at center, hsl(187 100% 42%), hsl(205 100% 32%), transparent 70%)",
            }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <div
        className={cn("relative", className)}
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </div>
    </Component>
  );
}
