import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const researchAreas = {
    "Focus Areas": [
        "Retrieval quality, grounding, hallucination resistance",
        "Model compression, distillation, cost‑latency trade‑offs",
        "Time‑series forecasting for cashflow & operations",
        "Multimodal reasoning (text + tables + images + docs)",
    ],
    "What We Publish": [
        "Evaluation frameworks and task‑specific leaderboards",
        "Whitepapers, ablation studies, reproducible notebooks",
        "Open‑source utilities for RAG, data cleaning, and evals",
    ]
}

export default function Rnd() {
  return (
    <section id="rnd" className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <h2 className="font-headline text-3xl md:text-4xl mb-10">Research & Innovation</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(researchAreas).map(([title, items]) => (
            <Card key={title} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-white/80 list-disc ml-5 space-y-1">
                  {items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
