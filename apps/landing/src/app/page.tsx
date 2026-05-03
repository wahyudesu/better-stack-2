import { Hero } from "@/components/hero";
import { DemoSection } from "@/components/demo-section";
import { Solutions } from "@/components/solutions";
import { FeaturesGrid } from "@/components/features-grid";
import { Journey } from "@/components/journey";
import { Comparison } from "@/components/comparison";
import { FAQ } from "@/components/faq";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1">
        <Hero />
         {/*<DemoSection />*/}
        <Solutions />
        <FeaturesGrid />
        <Journey />
        <Comparison />
        <FAQ /> 
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
