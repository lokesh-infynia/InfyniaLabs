"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BackgroundBeamsProps {
  className?: string;
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const beams = Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      speed: 0.0004 + Math.random() * 0.0003,
      length: 0.4 + Math.random() * 0.4,
      width: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.35;
      const maxLen = Math.max(canvas.width, canvas.height) * 1.2;

      for (const beam of beams) {
        const opacity = (Math.sin(time * beam.speed * 1000 + beam.phase) + 1) / 2;
        const angle = beam.angle + time * beam.speed;
        const endX = cx + Math.cos(angle) * maxLen * beam.length;
        const endY = cy + Math.sin(angle) * maxLen * beam.length;

        const gradient = ctx.createLinearGradient(cx, cy, endX, endY);
        gradient.addColorStop(0, `rgba(0, 187, 212, ${opacity * 0.15})`);
        gradient.addColorStop(0.5, `rgba(0, 89, 165, ${opacity * 0.08})`);
        gradient.addColorStop(1, `rgba(0, 89, 165, 0)`);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = beam.width;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
    />
  );
}
