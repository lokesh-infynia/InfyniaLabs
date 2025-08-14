import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, FlaskConical, Orbit } from "lucide-react";

const activities = [
  {
    icon: <Cpu className="h-10 w-10 text-accent" />,
    title: "Advanced AI Research",
    description: "Pushing the boundaries of artificial intelligence through foundational research in machine learning, neural networks, and cognitive computing.",
  },
  {
    icon: <Orbit className="h-10 w-10 text-accent" />,
    title: "Product Development",
    description: "Transforming cutting-edge research into tangible products that provide real-world value across various sectors, from healthcare to finance.",
  },
  {
    icon: <FlaskConical className="h-10 w-10 text-accent" />,
    title: "Strategic Partnerships",
    description: "Collaborating with industry leaders and academic institutions to accelerate innovation and apply AI to solve global challenges.",
  },
];

export default function Activities() {
  return (
    <section id="activities" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">What We Do</h2>
            <p className="mx-auto max-w-[900px] text-card-foreground/80 md:text-xl/relaxed">
              Our work spans from fundamental research to the development of market-ready AI solutions.
            </p>
          </div>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          {activities.map((activity, index) => (
            <Card key={index} className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center text-center gap-4">
                {activity.icon}
                <div className="grid gap-1">
                  <CardTitle className="font-headline text-xl">{activity.title}</CardTitle>
                  <CardDescription className="text-foreground/80">{activity.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
