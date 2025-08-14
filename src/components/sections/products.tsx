import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  {
    name: "Synapse AI",
    description: "An advanced neural interface for seamless human-computer interaction.",
    image: "https://placehold.co/600x400.png",
    hint: "neural interface",
  },
  {
    name: "QuantumLeap",
    description: "A quantum computing cloud platform for complex simulations and data analysis.",
    image: "https://placehold.co/600x400.png",
    hint: "quantum computer",
  },
  {
    name: "Helios AutoML",
    description: "An automated machine learning tool that simplifies building and deploying AI models.",
    image: "https://placehold.co/600x400.png",
    hint: "data visualization",
  },
];

export default function Products() {
  return (
    <section id="products" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Our Innovations</h2>
            <p className="mx-auto max-w-[900px] text-foreground/80 md:text-xl/relaxed">
              Discover the products we've built to shape a smarter future.
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.name} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Image
                  alt={product.name}
                  className="aspect-video w-full overflow-hidden rounded-lg object-cover"
                  height={340}
                  src={product.image}
                  width={600}
                  data-ai-hint={product.hint}
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="font-headline text-2xl mb-2">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
