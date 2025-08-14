"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const InfinityLogo = () => (
    <svg className="w-8 h-8 glow" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,50 C25,30 45,20 60,20 C80,20 100,40 100,50 C100,60 120,80 140,80 C160,80 175,65 175,50 C175,35 160,20 140,20 C120,20 100,40 100,50 C100,60 80,80 60,80 C40,80 25,70 25,50 Z" stroke="url(#g)" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
        <linearGradient id="g" x1="25" y1="50" x2="175" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(var(--primary))"/>
            <stop offset="100%" stopColor="hsl(var(--accent))"/>
        </linearGradient>
        </defs>
    </svg>
)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  
  const navLinks = [
    { href: "#mission", label: "Mission" },
    { href: "#activities", label: "What We Do" },
    { href: "#products", label: "Products" },
    { href: "#rnd", label: "Research" },
    { href: "#roadmap", label: "Roadmap" },
  ];

  const handleTalkToUsClick = () => {
    if (user) {
      const contactTrigger = document.getElementById('contact-trigger');
      if(contactTrigger) contactTrigger.click();
    } else {
      signInWithGoogle();
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3">
            <InfinityLogo />
            <span className="font-headline text-xl tracking-tight">Infynia Labs</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-white/80">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
            <Button onClick={handleTalkToUsClick} className="hidden md:inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                Talk to Us
            </Button>
            <div className="md:hidden">
                <Button onClick={() => setMenuOpen(!menuOpen)} variant="ghost" size="icon" className="p-2 rounded-lg border border-white/10">
                    <Menu />
                </Button>
            </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
            <div className="grid gap-2 text-white/90">
                {navLinks.map(link => (
                    <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-2 border-b border-white/10">{link.label}</a>
                ))}
                 <a href="#contact" onClick={() => { setMenuOpen(false); handleTalkToUsClick(); }} className="py-2">Talk to Us</a>
            </div>
        </div>
      )}
    </header>
  );
}