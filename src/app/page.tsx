import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import FeaturesBento from '@/components/sections/features-bento';
import VoiceDemo from '@/components/sections/voice-demo';
import Products from '@/components/sections/products';
import Rnd from '@/components/sections/rnd';
import CTA from '@/components/sections/cta';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeaturesBento />
        <VoiceDemo />
        <Products />
        <Rnd />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
