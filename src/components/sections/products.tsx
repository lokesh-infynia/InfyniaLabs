"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import React from "react";

const products = [
  {
    status: "Live",
    name: "BeatMyEMI — Debt Freedom Planner",
    description: "Plan prepayments, simulate scenarios, cut interest, and track your debt‑free countdown.",
    features: [
      "Payoff strategy engine (avalanche / snowball / hybrid)",
      "Prepayment simulations & impact on tenure",
      "Alerts for dues, negotiation windows, milestones",
    ],
    cta: <Button asChild className="w-full bg-gradient-to-r from-primary to-accent shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-xl"><a href="https://beatmyemi.com" target="_blank" rel="noopener noreferrer">Get BeatMyEMI</a></Button>,
  },
  {
    status: "In Development — Early Next Year",
    name: "Budgeting — Plan, Track, Improve",
    description: "Adaptive budgets, auto spend classification, cashflow forecasts, and safe‑to‑spend guidance.",
    cta: <WaitlistForm formId="budgetingForm" thanksId="budgetingThanks" storageKey="waitlist_budgeting" />,
  },
  {
    status: "In Development — Early Next Year",
    name: "Health Vault & Immunity Support",
    description: "A secure health record vault with doctor‑friendly summaries and lifestyle nudges to support immunity.",
    cta: <WaitlistForm formId="healthForm" thanksId="healthThanks" storageKey="waitlist_health" />,
    disclaimer: "Disclaimer: Infynia apps do not provide medical advice; they support clinical decision-making and personal record‑keeping. Always consult your healthcare professional.",
  },
];

function WaitlistForm({formId, thanksId, storageKey}: {formId: string, thanksId: string, storageKey: string}) {
    const { toast } = useToast();
    const { user, signInWithGoogle } = useAuth();
    const [submitted, setSubmitted] = React.useState(false);
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
        if (user && typeof window !== "undefined") {
            const list = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (list.some((item: any) => item.email === user.email)) {
                setSubmitted(true);
            }
        }
    }, [user, storageKey]);

    const handleJoinWaitlist = () => {
        if (!user) {
            signInWithGoogle();
        } else {
             // Already signed in, let's submit.
             handleWaitlistSubmit();
        }
    };
    
    const handleWaitlistSubmit = () => {
        if (user && typeof window !== "undefined") {
            const list = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const data = { name: user.displayName, email: user.email };
            list.push({ ...data, ts: new Date().toISOString() });
            localStorage.setItem(storageKey, JSON.stringify(list));
            setSubmitted(true);
            toast({
                title: "Success!",
                description: "Thanks! You’re on the waitlist.",
            });
        }
    }
    
    // If we've already submitted, show the thank you message
    if (isClient && submitted) {
      return <p id={thanksId} className="text-emerald-300 text-sm">Thanks! You’re on the waitlist.</p>
    }

    return (
        <div className="mt-4 space-y-3">
            <Button onClick={handleJoinWaitlist} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent shadow-[0_8px_32px_rgba(0,0,0,0.25)] h-auto">
                {user ? 'Join Waitlist' : 'Login to Join Waitlist'}
            </Button>
        </div>
    );
}

export default function Products() {
  return (
    <section id="products" className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start justify-center space-y-4 text-left mb-10">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl md:text-4xl">Our Products</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.name} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <CardHeader>
                    <div className="text-[10px] uppercase tracking-widest text-white/60 mb-3">{product.status}</div>
                    <CardTitle className="text-2xl font-semibold mb-2">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription className="text-white/80 mb-4">{product.description}</CardDescription>
                    {product.features && (
                        <ul className="text-white/70 text-sm list-disc ml-5 space-y-1 mb-6">
                            {product.features.map(feature => <li key={feature}>{feature}</li>)}
                        </ul>
                    )}
                </CardContent>
                <CardFooter className="flex-col items-start">
                    {product.cta}
                    {product.disclaimer && <p className="text-white/60 text-xs mt-3">{product.disclaimer}</p>}
                </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
