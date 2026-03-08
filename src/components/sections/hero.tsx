"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight, Mic, TrendingUp, Sparkles } from "lucide-react";

const stats = [
  { value: "500+", label: "Calls / Day", sub: "per deployment" },
  { value: "<400ms", label: "Avg Latency", sub: "speech-to-response" },
  { value: "99.9%", label: "Uptime SLA", sub: "enterprise grade" },
];

const pills = [
  { icon: Mic, label: "Voice Agents", color: "text-accent" },
  { icon: TrendingUp, label: "BeatMyEMI", color: "text-blue-400" },
  { icon: Sparkles, label: "Genkit AI", color: "text-purple-400" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-screen flex flex-col justify-center"
    >
      {/* Animated beam background */}
      <BackgroundBeams className="opacity-70" />

      {/* Spotlight on hover */}
      <Spotlight className="z-0" />

      {/* Background mesh gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 80% 60% at 50% -20%, hsl(187 100% 42% / 0.12), transparent)",
            "radial-gradient(ellipse 50% 40% at 100% 80%, hsl(205 100% 32% / 0.15), transparent)",
            "radial-gradient(ellipse 60% 50% at 0% 60%, hsl(270 60% 50% / 0.06), transparent)",
          ].join(", "),
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10 pt-8 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-base text-white/70">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Voice AI · Financial AI · Enterprise Ready
            </div>
          </motion.div>

          {/* Headline */}
          <div className="mb-8">
            <TextGenerateEffect
              words="Deploy AI Agents That Actually Work"
              className="font-headline text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05]"
              duration={0.4}
            />
          </div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-white/60 text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            From{" "}
            <span className="text-accent">intelligent voice agents</span> for enterprise to{" "}
            <span className="text-primary">AI-powered financial advisors</span> — built to deploy, built to scale.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-wrap justify-center gap-5 mb-14"
          >
            <Button
              size="lg"
              className="px-10 py-5 h-auto rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg shadow-[0_8px_40px_rgba(0,187,212,0.3)] hover:shadow-[0_8px_60px_rgba(0,187,212,0.5)] transition-all duration-300 hover:scale-105"
              onClick={() => document.getElementById("voice-demo")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Mic className="mr-2 w-5 h-5" />
              Try Voice Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-5 h-auto rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Products
            </Button>
          </motion.div>

          {/* Product pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {pills.map(({ icon: Icon, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-base"
                style={{ animation: `float ${10 + i * 2}s ease-in-out infinite` }}
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-white/70">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="grid grid-cols-3 gap-5 max-w-2xl mx-auto"
          >
            {stats.map(({ value, label, sub }) => (
              <div
                key={label}
                className="glass-card p-5 text-center"
              >
                <div className="font-headline text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {value}
                </div>
                <div className="text-white/80 text-sm font-medium mb-0.5">{label}</div>
                <div className="text-white/40 text-xs">{sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
