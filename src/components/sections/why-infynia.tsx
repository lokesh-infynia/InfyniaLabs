import { BrainCircuit, Rocket, Scaling, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "Cutting-Edge Technology",
    description: "We leverage the latest advancements in AI to build powerful and efficient solutions.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Ethical & Responsible",
    description: "Our commitment to ethical AI ensures our technology is fair, transparent, and accountable.",
  },
  {
    icon: <Scaling className="h-8 w-8 text-primary" />,
    title: "Scalable Solutions",
    description: "From startups to enterprise-level corporations, our products are designed to scale with your needs.",
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: "Future-Focused Innovation",
    description: "We are constantly exploring new frontiers to deliver next-generation AI capabilities.",
  },
];

export default function WhyInfynia() {
  return (
    <section id="why-infynia" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Infynia?</h2>
            <p className="mx-auto max-w-[900px] text-foreground/80 md:text-xl/relaxed">
              We are more than just a technology company. We are your partners in innovation.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center p-4">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-headline text-xl font-bold">{feature.title}</h3>
              <p className="text-foreground/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
