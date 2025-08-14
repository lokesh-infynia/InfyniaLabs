import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Mission() {
  return (
    <section id="mission" className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl mb-4">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="max-w-3xl text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Use AI to make a common person’s life easier. From <span className="font-semibold text-white">BeatMyEMI</span> (debt relief planning) to smart budgeting and a secure health vault with doctor-guided immunity support, we design AI that reduces complexity and turns intentions into daily wins.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
