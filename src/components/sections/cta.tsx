"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendContactEmail } from "@/app/actions";
import { ShieldCheck, Globe, Clock, CheckCircle2, Loader2, Send } from "lucide-react";

const trustBadges = [
  { icon: ShieldCheck, label: "SOC 2 Ready" },
  { icon: Globe, label: "GDPR Compliant" },
  { icon: Clock, label: "99.9% SLA" },
];

type FormState = "idle" | "loading" | "success" | "error";

export default function CTA() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    const result = await sendContactEmail(form);
    if (result.success) {
      setState("success");
    } else {
      setState("error");
      setErrorMsg(result.message);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <AuroraBackground showRadialGradient={false} className="absolute inset-0" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">

          {/* Left: Heading + trust */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 md:pt-6"
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 border border-accent/20 text-accent mb-4">
                Contact Us
              </span>
              <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Ready to Deploy Your{" "}
                <span className="gradient-text">First AI Agent?</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Tell us about your use case. Our team responds within 24 hours.
              </p>
            </div>

            {/* What to expect */}
            <div className="space-y-4">
              {[
                { title: "Discovery Call", desc: "We learn your use case and goals" },
                { title: "Custom Demo", desc: "See a tailored voice agent in action" },
                { title: "Go Live in Days", desc: "Deploy, not months of integration" },
              ].map(({ title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-xs font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-white/90 font-medium text-sm">{title}</p>
                    <p className="text-white/50 text-xs">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/40 text-sm">
                  <Icon className="w-4 h-4 text-accent/60" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8">
              {state === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-headline text-xl font-bold text-white">Message Sent!</h3>
                  <p className="text-white/60 text-sm max-w-xs">
                    Thanks for reaching out. We&apos;ll get back to you at <span className="text-accent">{form.email}</span> within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-white/15 bg-white/5 hover:bg-white/10"
                    onClick={() => { setState("idle"); setForm({ name: "", email: "", company: "", message: "" }); }}
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-white/70 text-sm">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/30 rounded-xl h-11 focus-visible:ring-accent focus-visible:border-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-white/70 text-sm">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your company"
                        value={form.company}
                        onChange={handleChange}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/30 rounded-xl h-11 focus-visible:ring-accent focus-visible:border-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-white/70 text-sm">Work Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/30 rounded-xl h-11 focus-visible:ring-accent focus-visible:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-white/70 text-sm">How can we help? *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your use case — voice agent for sales, BeatMyEMI integration, custom AI build..."
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/30 rounded-xl resize-none focus-visible:ring-accent focus-visible:border-accent"
                    />
                  </div>

                  {state === "error" && (
                    <p className="text-red-400 text-sm">{errorMsg}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={state === "loading"}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_40px_rgba(0,187,212,0.35)] transition-shadow font-semibold"
                  >
                    {state === "loading" ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-white/30 text-xs text-center">
                    Replies sent to support@infynialabs.com · Typically within 24h
                  </p>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
