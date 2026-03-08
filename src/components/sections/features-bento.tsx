"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";
import { Mic, Zap, TrendingUp, Shield, Globe, BarChart3 } from "lucide-react";

const WaveformVisual = () => (
  <div className="flex items-end gap-1 h-12">
    {[40, 70, 55, 90, 65, 80, 45, 75, 60, 85, 50, 70].map((h, i) => (
      <div
        key={i}
        className="w-2 rounded-full bg-gradient-to-t from-primary to-accent"
        style={{
          height: `${h}%`,
          animation: `waveform ${0.8 + i * 0.1}s ease-in-out infinite`,
          animationDelay: `${i * 0.08}s`,
        }}
      />
    ))}
  </div>
);

const LatencyMeter = () => (
  <div className="space-y-2">
    {[
      { label: "STT Latency", value: 85, color: "from-accent to-cyan-400" },
      { label: "LLM Inference", value: 72, color: "from-primary to-blue-400" },
      { label: "TTS Render", value: 90, color: "from-accent to-primary" },
    ].map((item) => (
      <div key={item.label}>
        <div className="flex justify-between text-xs text-white/50 mb-1">
          <span>{item.label}</span>
          <span className="text-white/80">{Math.round((100 - item.value) * 4)}ms</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${item.value}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    ))}
  </div>
);

const LoanCalcVisual = () => (
  <div className="space-y-2 text-sm">
    <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl">
      <span className="text-white/60">Loan Amount</span>
      <span className="font-mono text-accent">₹15,00,000</span>
    </div>
    <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl">
      <span className="text-white/60">EMI/month</span>
      <span className="font-mono text-white">₹32,450</span>
    </div>
    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl border border-accent/20">
      <span className="text-white/80">Savings found</span>
      <span className="font-mono text-accent font-bold">₹2,10,000</span>
    </div>
  </div>
);

const AnalyticsVisual = () => (
  <div className="flex items-end gap-2 h-16">
    {[30, 55, 42, 70, 58, 85, 65, 90, 72, 95, 80, 100].map((h, i) => (
      <motion.div
        key={i}
        className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/60 to-accent/80"
        initial={{ height: 0 }}
        animate={{ height: `${h}%` }}
        transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
      />
    ))}
  </div>
);

const PulseShield = () => (
  <div className="relative flex items-center justify-center w-16 h-16">
    <div className="absolute inset-0 rounded-full border border-accent/30 animate-pulse-ring" />
    <div className="absolute inset-2 rounded-full border border-accent/20 animate-pulse-ring [animation-delay:0.5s]" />
    <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-accent/30 flex items-center justify-center">
      <Shield className="w-5 h-5 text-accent" />
    </div>
  </div>
);

const LanguageRotator = () => {
  const langs = ["EN", "HI", "ES", "DE", "ZH", "FR", "PT", "JA"];
  return (
    <div className="flex flex-wrap gap-2">
      {langs.map((lang, i) => (
        <motion.span
          key={lang}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="px-2 py-1 text-xs rounded-lg bg-white/10 border border-white/10 text-white/70 font-mono"
        >
          {lang}
        </motion.span>
      ))}
    </div>
  );
};

export default function FeaturesBento() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-mesh-primary opacity-50 pointer-events-none" />
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 border border-accent/20 text-accent mb-4">
            Platform Capabilities
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Deploy AI at Scale</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            From sub-400ms voice agents to intelligent financial advisors — built for enterprise reliability.
          </p>
        </motion.div>

        <BentoGrid className="auto-rows-[180px]">
          {/* Card 1: Voice Agents — col-span-2 */}
          <BentoGridItem colSpan={2} rowSpan={1} className="flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">Live</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-white mb-1">Voice Agents for Business</h3>
                <p className="text-white/50 text-sm">Human-quality conversations at machine scale</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent font-mono">&lt;400ms</div>
                <div className="text-xs text-white/40">avg latency</div>
              </div>
            </div>
            <WaveformVisual />
          </BentoGridItem>

          {/* Card 2: Real-time Processing — col-span-1 */}
          <BentoGridItem colSpan={1} rowSpan={1} className="flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-white text-sm">Real-time Processing</h3>
            </div>
            <LatencyMeter />
          </BentoGridItem>

          {/* Card 3: Financial Intelligence */}
          <BentoGridItem colSpan={1} rowSpan={1} className="flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/30 to-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-semibold text-white text-sm">Financial Intelligence</h3>
            </div>
            <LoanCalcVisual />
          </BentoGridItem>

          {/* Card 4: Enterprise Security */}
          <BentoGridItem colSpan={1} rowSpan={1} className="flex flex-col items-start gap-3">
            <PulseShield />
            <div>
              <h3 className="font-semibold text-white text-sm mb-1">Enterprise Security</h3>
              <p className="text-white/50 text-xs">SOC 2 ready · End-to-end encrypted · Zero data retention</p>
            </div>
          </BentoGridItem>

          {/* Card 5: Multi-language */}
          <BentoGridItem colSpan={1} rowSpan={1} className="flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-accent/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">Multi-language</h3>
            </div>
            <LanguageRotator />
          </BentoGridItem>

          {/* Card 6: Live Analytics — col-span-2 */}
          <BentoGridItem colSpan={2} rowSpan={1} className="flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  <h3 className="font-headline font-bold text-white">Live Analytics Dashboard</h3>
                </div>
                <p className="text-white/50 text-sm">Real-time call metrics, conversion tracking, and AI performance</p>
              </div>
              <div className="flex gap-3 text-right">
                <div>
                  <div className="text-lg font-bold text-white font-mono">98.7%</div>
                  <div className="text-xs text-white/40">Resolution</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent font-mono">4.9★</div>
                  <div className="text-xs text-white/40">CSAT</div>
                </div>
              </div>
            </div>
            <AnalyticsVisual />
          </BentoGridItem>
        </BentoGrid>
      </div>
    </section>
  );
}
