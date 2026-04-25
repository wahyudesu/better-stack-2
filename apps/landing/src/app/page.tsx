import { SimpleHeader } from "@/components/simple-header";
import { Hero } from "@/components/hero";
import { Comparison } from "@/components/comparison";
import { Journey } from "@/components/journey";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SimpleHeader />

      <main className="flex-1">
        <Hero />
        <Journey />
        <Comparison />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
