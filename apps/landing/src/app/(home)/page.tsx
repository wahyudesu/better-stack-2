import { Hero } from "@/app/(home)/components/hero";
import { Solutions } from "@/app/(home)/components/solutions";
import { FeaturesGrid } from "@/app/(home)/components/features-grid";
import { Journey } from "@/app/(home)/components/journey";
import { Comparison } from "@/app/(home)/components/comparison";
import { FAQ } from "@/app/(home)/components/faq";
import { CtaSection } from "@/app/(home)/components/cta-section";

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
    </div>
  );
}
