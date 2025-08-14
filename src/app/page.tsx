import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import Mission from '@/components/sections/mission';
import Activities from '@/components/sections/activities';
import Products from '@/components/sections/products';
import Rnd from '@/components/sections/rnd';
import WhyInfynia from '@/components/sections/why-infynia';
import Feedback from '@/components/sections/feedback';
import SmartContact from '@/components/smart-contact';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Mission />
        <Activities />
        <Products />
        <Rnd />
        <WhyInfynia />
        <Feedback />
      </main>
      <SmartContact />
      <Footer />
    </div>
  );
}
