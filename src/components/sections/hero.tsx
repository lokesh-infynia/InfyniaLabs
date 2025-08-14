import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-background via-card to-background">
      <div className="container px-4 md:px-6 py-24 sm:py-32 lg:py-40">
        <div className="grid gap-6 lg:grid-cols-1 lg:gap-x-12 xl:gap-x-16">
          <div className="flex flex-col justify-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Pioneering the Future of Intelligence
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Infynia Labs is at the forefront of AI innovation, creating solutions that redefine industries and enhance human potential.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="#products">Explore Our Products</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-repeat [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
    </section>
  );
}
