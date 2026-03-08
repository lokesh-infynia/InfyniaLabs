"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Aurora layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 80% 50% at 20% -20%, hsl(187 100% 42% / 0.25), transparent)",
            "radial-gradient(ellipse 60% 40% at 80% 120%, hsl(205 100% 32% / 0.3), transparent)",
            "radial-gradient(ellipse 40% 60% at 50% -10%, hsl(270 60% 50% / 0.1), transparent)",
          ].join(", "),
        }}
      />
      {/* Animated aurora blob */}
      <div
        className="absolute inset-0 pointer-events-none animate-aurora opacity-60"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 70% 40% at 30% 80%, hsl(187 100% 42% / 0.15), transparent)",
            "radial-gradient(ellipse 50% 30% at 70% 20%, hsl(205 100% 45% / 0.12), transparent)",
          ].join(", "),
          backgroundSize: "200% 200%",
        }}
      />
      {/* Radial gradient mask for edge fade */}
      {showRadialGradient && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, hsl(var(--background)) 100%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
