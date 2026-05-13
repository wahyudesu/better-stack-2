import { Footer } from "@/components/footer";
import { FAQ } from "@/app/(home)/components/faq";
import { ContactOptions } from "./contact-options";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ZenPost - Get in Touch",
  description:
    "Have questions about ZenPost? Contact us via docs, Telegram, or email. We read every message and are happy to help you get started with social media management.",
  alternates: {
    canonical: "https://zenpost.in/contact",
  },
  openGraph: {
    title: "Contact ZenPost",
    description:
      "Get in touch with the ZenPost team. Questions about setup, billing, or anything else? We respond within 24 hours.",
    url: "https://zenpost.in/contact",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZenPost - Social Media Dashboard",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact</h1>
              <p className="text-xl text-secondary-foreground/70 mb-8">
                Questions about setup, billing, privacy, or anything else? We&apos;re happy to help.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ContactOptions />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/*<Footer />*/}
    </div>
  );
}
