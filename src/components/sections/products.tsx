"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MovingBorder } from "@/components/ui/moving-border";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import React from "react";
import { joinWaitlist, checkWaitlist } from "@/app/actions";
import { motion } from "framer-motion";
import { TrendingUp, Mic, CheckCircle, ArrowUpRight, Clock } from "lucide-react";

// ─── Waitlist Form (unchanged logic) ─────────────────────────────────────────

function WaitlistForm({ productName }: { productName: string }) {
  const { toast } = useToast();
  const { user, signInWithGoogle } = useAuth();
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkStatus = async () => {
      if (user?.email) {
        setIsLoading(true);
        const isOnWaitlist = await checkWaitlist({ email: user.email, product: productName });
        setSubmitted(isOnWaitlist);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [user, productName]);

  const handleJoinWaitlist = async () => {
    if (!user) {
      await signInWithGoogle();
    } else {
      setIsLoading(true);
      const result = await joinWaitlist({
        email: user.email!,
        name: user.displayName!,
        product: productName,
      });
      if (result.success) {
        setSubmitted(true);
        toast({ title: "Success!", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="text-sm text-white/70">Loading...</p>;
  if (submitted) return <p className="text-emerald-300 text-sm">Thanks! You&apos;re on the waitlist.</p>;

  return (
    <Button
      onClick={handleJoinWaitlist}
      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent shadow-[0_8px_32px_rgba(0,0,0,0.25)] h-auto"
      disabled={isLoading}
    >
      {user ? "Join Waitlist" : "Login to Join Waitlist"}
    </Button>
  );
}

// ─── BeatMyEMI Hero Card ──────────────────────────────────────────────────────

const emiFeatures = [
  "Payoff strategy engine (avalanche / snowball / hybrid)",
  "Prepayment simulations & tenure impact",
  "Alerts for dues, negotiation windows, milestones",
];

function BeatMyEMICard() {
  return (
    <MovingBorder duration={4000} containerClassName="rounded-3xl h-full" borderRadius="1.5rem">
      <div className="h-full bg-[hsl(220_43%_9%)] rounded-3xl p-8 flex flex-col">
        {/* Header visual */}
        <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-white/10 p-5 mb-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-accent uppercase tracking-wider">Live Product</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Loan ₹15L · 8.5% · 5yr</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-48">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <div className="text-sm text-accent font-mono font-bold">Saving ₹2.1L detected →</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-headline text-2xl font-bold text-white mb-2">BeatMyEMI</h3>
          <p className="text-white/60 text-sm mb-5">
            AI-powered debt freedom planner. Plan prepayments, simulate scenarios, and cut interest — intelligently.
          </p>
          <ul className="space-y-2 mb-6">
            {emiFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <Button
          asChild
          className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-[0_8px_40px_rgba(0,187,212,0.3)] transition-shadow group"
        >
          <a href="https://beatmyemi.com" target="_blank" rel="noopener noreferrer">
            Launch BeatMyEMI
            <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Button>
      </div>
    </MovingBorder>
  );
}

// ─── Voice Agents Hero Card ───────────────────────────────────────────────────

const voiceFeatures = [
  "Human-quality voice with <400ms latency",
  "Multi-language support across 8+ languages",
  "CRM integration and real-time analytics",
];

function VoiceAgentCard() {
  return (
    <MovingBorder duration={5000} containerClassName="rounded-3xl h-full" borderRadius="1.5rem">
      <div className="h-full bg-[hsl(220_43%_9%)] rounded-3xl p-8 flex flex-col">
        {/* Header visual */}
        <div className="relative rounded-2xl bg-gradient-to-br from-accent/15 to-primary/10 border border-white/10 p-5 mb-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-accent uppercase tracking-wider">Enterprise</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>
            {/* Waveform */}
            <div className="flex items-end gap-1 h-8">
              {[40, 70, 55, 90, 65, 80, 45, 75, 60, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-full"
                  style={{
                    height: `${h}%`,
                    animation: `waveform ${0.8 + i * 0.1}s ease-in-out infinite`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-headline text-2xl font-bold text-white mb-2">Voice Agents</h3>
          <p className="text-white/60 text-sm mb-5">
            Deploy intelligent voice AI agents for sales, support, and scheduling — at enterprise scale.
          </p>
          <ul className="space-y-2 mb-6">
            {voiceFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <Button
          className="w-full h-11 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 transition-colors"
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        >
          Request a Demo
        </Button>
      </div>
    </MovingBorder>
  );
}

// ─── Coming Soon Cards ────────────────────────────────────────────────────────

const comingSoon = [
  {
    status: "Early Next Year",
    name: "Budgeting",
    description: "Adaptive budgets, auto spend classification, cashflow forecasts, and safe-to-spend guidance.",
    cta: <WaitlistForm productName="budgeting" />,
  },
  {
    status: "Early Next Year",
    name: "Health Vault",
    description: "Secure health record vault with doctor-friendly summaries and lifestyle nudges.",
    cta: <WaitlistForm productName="health" />,
    disclaimer:
      "Disclaimer: Infynia apps do not provide medical advice. Always consult your healthcare professional.",
  },
  {
    status: "Live",
    name: "Brio Automation",
    description: "AI-embedded tool for dealers to eliminate repetitive typing. Save once, fill everywhere.",
    cta: (
      <Button asChild className="w-full bg-gradient-to-r from-primary to-accent rounded-xl">
        <Link href="/brio-privacy-policy">Privacy Policy</Link>
      </Button>
    ),
  },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Products() {
  return (
    <section id="products" className="w-full py-24 relative">
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 border border-accent/20 text-accent mb-4">
            Product Suite
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4">
            AI That Ships to{" "}
            <span className="gradient-text">Production</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Two live products, two in the pipeline. Every product built on responsible AI with enterprise reliability.
          </p>
        </motion.div>

        {/* Hero products: BeatMyEMI + Voice Agents */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-10"
        >
          <BeatMyEMICard />
          <VoiceAgentCard />
        </motion.div>

        {/* Coming soon + Brio */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-4 h-4 text-white/40" />
            <span className="text-white/40 text-sm uppercase tracking-wider font-medium">In the Pipeline</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {comingSoon.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <Card className="flex flex-col h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {product.status}
                    </div>
                    <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-0 mb-4">
                    <CardDescription className="text-white/60 text-sm">{product.description}</CardDescription>
                    {product.disclaimer && (
                      <p className="text-white/40 text-xs mt-3">{product.disclaimer}</p>
                    )}
                  </CardContent>
                  <CardFooter className="p-0 mt-auto">
                    {product.cta}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
