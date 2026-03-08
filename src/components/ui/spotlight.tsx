"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = "hsl(187 100% 42% / 0.08)" }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setOpacity(1);
    };

    const handleMouseLeave = () => setOpacity(0);

    const el = divRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={divRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute transition-opacity duration-300"
        style={{
          opacity,
          left: position.x - 300,
          top: position.y - 300,
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${fill}, transparent 70%)`,
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
