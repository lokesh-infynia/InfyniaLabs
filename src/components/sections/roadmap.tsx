import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const roadmapData = {
    "This Year": [
        "Private betas for Budgeting & Health Vault",
        "Evaluation reports & feedback loops",
        "Partner integrations",
    ],
    "Early Next Year": [
        "Public launch: Budgeting app",
        "Public launch: Health Vault & Immunity Support",
        "Model cards & public evals",
    ],
    "Beyond": [
        "Agentic workflows for finance & health ops",
        "On‑device personalization & privacy‑preserving training",
        "Internationalization and data residency options",
    ]
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <h2 className="font-headline text-3xl md:text-4xl mb-10">Roadmap</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(roadmapData).map(([title, items]) => (
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
