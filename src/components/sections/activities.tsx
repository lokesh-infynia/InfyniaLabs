import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const activities = [
  {
    title: "AI-Powered Consumer Apps",
    description: "Friendly, secure apps that turn complex tasks into clear steps and helpful nudges.",
  },
  {
    title: "Purpose-Built Models",
    description: "Finance & health models: payoff optimization, spend prediction, document understanding, personal insights.",
  },
  {
    title: "Responsible MLOps",
    description: "Evaluation suites, monitoring, explainability, model cards, human-in-the-loop review, privacy by design.",
  },
];

export default function Activities() {
  return (
    <section id="activities" className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start justify-center space-y-4 text-left mb-10">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">What We Do</h2>
          </div>
        </div>
        <div className="mx-auto grid items-start gap-6 sm:max-w-4xl md:grid-cols-3 lg:max-w-none">
          {activities.map((activity, index) => (
            <Card key={index} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-2">{activity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80">{activity.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
