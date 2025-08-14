import Image from "next/image";

export default function Rnd() {
  return (
    <section id="rnd" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
            Research & Development
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Innovating for Tomorrow
          </h2>
          <p className="max-w-[600px] text-card-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our R&D department is the lifeblood of Infynia Labs. We are dedicated to exploring the uncharted territories of AI, from developing new learning algorithms to pioneering ethical AI frameworks. Our research ensures we stay ahead of the curve, turning bold ideas into reality.
          </p>
        </div>
        <div className="flex justify-center">
            <Image
                alt="R&D"
                className="overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="450"
                width="800"
                src="https://placehold.co/800x450.png"
                data-ai-hint="research lab"
            />
        </div>
      </div>
    </section>
  );
}
