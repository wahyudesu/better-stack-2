import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FAQ } from "@/components/faq";
import { Button } from "@/components/ui/button";
import { Mail, FileText, MessageCircle } from "lucide-react";

const contactOptions = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Docs",
    description: "Read it first, it's helpful.",
    href: "#",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Telegram",
    description: "Message the founder directly.",
    href: "#",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    description: "We read them all, we promise.",
    href: "mailto:hello@zenpost.id",
    color: "bg-green-500/10 text-green-500",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact</h1>
              <p className="text-xl text-secondary-foreground/70 mb-8">
                Questions about setup, billing, privacy, or anything else? We&apos;re happy to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {contactOptions.map((option) => (
                  <a
                    key={option.title}
                    href={option.href}
                    className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all hover:border-primary/30"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center mb-4`}
                    >
                      {option.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
