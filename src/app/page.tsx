import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import Mission from '@/components/sections/mission';
import Activities from '@/components/sections/activities';
import Products from '@/components/sections/products';
import Rnd from '@/components/sections/rnd';
import Roadmap from '@/components/sections/roadmap';
import SmartContact from '@/components/smart-contact';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Mission />
        <Activities />
        <Products />
        <Rnd />
        <Roadmap />
        <section id="contact" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <Card className="text-center bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-3xl p-8 md:p-12">
              <CardHeader>
                <CardTitle className="font-headline text-3xl md:text-4xl">Ready to try AI that actually helps — every day?</CardTitle>
                <CardDescription className="text-white/80 mt-3">
                  Talk to an architect, request a demo, or join our betas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                    <a href="#products">Get BeatMyEMI</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="px-6 py-3 rounded-xl border border-white/15 backdrop-blur-md bg-white/5">
                    <a href="#products">Join Waitlists</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SmartContact />
      <Footer />
    </div>
  );
}
