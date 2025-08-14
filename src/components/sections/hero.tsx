import { Button } from "@/components/ui/button";

const InfinityGraphic = () => (
    <svg className="w-full h-56 md:h-72 glow" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,50 C25,30 45,20 60,20 C80,20 100,40 100,50 C100,60 120,80 140,80 C160,80 175,65 175,50 C175,35 160,20 140,20 C120,20 100,40 100,50 C100,60 80,80 60,80 C40,80 25,70 25,50 Z" stroke="url(#g2)" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
        <linearGradient id="g2" x1="25" y1="50" x2="175" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(var(--primary))"/>
            <stop offset="100%" stopColor="hsl(var(--accent))"/>
        </linearGradient>
        </defs>
    </svg>
)

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="container px-4 md:px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col justify-center space-y-6 text-left">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl md:text-6xl leading-tight">
                Engineering <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Infinite Intelligence</span>
              </h1>
              <p className="max-w-xl text-white/80 md:text-xl">
                We build AI that helps people get out of debt, master their budgets, and manage health records—securely and responsibly.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                <a href="#products">Get BeatMyEMI</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-6 py-3 rounded-xl border border-white/15 backdrop-blur-md bg-white/5">
                <a href="#products">Explore Products</a>
              </Button>
            </div>
          </div>
           <div className="relative">
             <InfinityGraphic />
            <div className="absolute inset-0 -z-10 rounded-[40px] bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
