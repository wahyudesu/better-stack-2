import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";

const comparisons = [
  {
    manual: "Login ke 5+ apps satu per satu",
    better: "1 dashboard untuk semua platform",
    icon: "🔐",
  },
  {
    manual: "Scroll-scroll-scroll tiap app",
    better: "Auto analytics & reports",
    icon: "📊",
  },
  {
    manual: "Forgot to post? Terlambat publish!",
    better: "Auto-posting tepat waktu",
    icon: "⏰",
  },
  {
    manual: "Guess-gues-hasil social media",
    better: "Data-driven insights",
    icon: "🎯",
  },
  {
    manual: "Ribet collaboration bareng team",
    better: "Simple role-based access",
    icon: "👥",
  },
  {
    manual: "Report manual, satu-satu",
    better: "Auto generate reports",
    icon: "📑",
  },
  {
    manual: "Kelola banyak Kalendar terpisah",
    better: "Unified content calendar",
    icon: "📅",
  },
  {
    manual: "Respon DM satu per satu",
    better: "Unified social inbox",
    icon: "💬",
  },
];

const features = [
  {
    name: "Multi-Platform Support",
    better: true,
    manual: false,
    detail: "Instagram, TikTok, Facebook, Twitter, LinkedIn, YouTube",
  },
  {
    name: "AI Content Suggestions",
    better: true,
    manual: false,
    detail: "Powered by GPT-4 untuk caption & hashtag ideas",
  },
  {
    name: "Analytics Dashboard",
    better: true,
    manual: false,
    detail: "Real-time tracking semua platform dalam 1 view",
  },
  {
    name: "Auto Scheduling",
    better: true,
    manual: false,
    detail: "Best time recommendations berdasarkan engagement",
  },
  {
    name: "Team Collaboration",
    better: true,
    manual: false,
    detail: "Role-based access + approval workflow",
  },
  {
    name: "24/7 Support",
    better: true,
    manual: false,
    detail: "WhatsApp support + dedicated account manager",
  },
];

export default function ComparisonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Manual vs ZenPost
              </h1>
              <p className="text-xl text-secondary-foreground/70 mb-8">
                Lihat bedanya waktu kamu pakai ZenPost
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#waitlist">
                  <Button size="lg">Start Free Trial</Button>
                </a>
                <a href="/about">
                  <Button variant="outline" size="lg">Learn More</Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Time Savings */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12">
                <h2 className="text-5xl font-bold text-primary mb-4">
                  3-5 Jam
                </h2>
                <p className="text-xl text-muted-foreground">
                  Waktu yang kamu hemat setiap minggu dengan ZenPost
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Rows */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Masalah vs Solusi</h2>
                <p className="text-muted-foreground">
                  Bandingkan workflow lama (manual) dengan ZenPost
                </p>
              </div>

              <div className="space-y-4">
                {comparisons.map((item, index) => (
                  <div
                    key={index}
                    className={`grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center p-6 rounded-2xl ${
                      index % 2 === 0 ? "bg-secondary" : "bg-transparent"
                    }`}
                  >
                    {/* Manual */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <XIcon className="size-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Manual</p>
                        <p className="font-medium">{item.manual}</p>
                      </div>
                    </div>

                    {/* VS Badge */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-lg">VS</span>
                      </div>
                    </div>

                    {/* Better Stack */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <CheckIcon className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-primary/80 mb-1">ZenPost</p>
                        <p className="font-medium">{item.better}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison Table */}
        <section className="py-16 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Fitur Comparison</h2>
                <p className="text-secondary-foreground/70">
                  Fitur yang kamu dapat dengan ZenPost
                </p>
              </div>

              <div className="bg-card rounded-xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-muted/50 border-b border-border font-semibold">
                  <div>Fitur</div>
                  <div className="text-center">Manual</div>
                  <div className="text-center text-primary">ZenPost</div>
                </div>

                {/* Rows */}
                {features.map((feature, index) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-3 gap-4 p-6 ${
                      index !== features.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-muted-foreground">{feature.detail}</div>
                    </div>
                    <div className="flex items-center justify-center">
                      {feature.manual ? (
                        <CheckIcon className="size-5 text-muted-foreground" />
                      ) : (
                        <XIcon className="size-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      {feature.better && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckIcon className="size-5 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <p className="text-secondary-foreground/70 mb-6">
                  Mulai workflow baru kamu dengan ZenPost
                </p>
                <a href="#waitlist">
                  <Button size="lg">Get Started Free</Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 text-center">
                <div className="text-5xl mb-6">💬</div>
                <blockquote className="text-xl md:text-2xl font-medium mb-6">
                  &quot;Dulutim kami spend 4+ jam sehari untuk manage social media. Sekarang dengan ZenPost, kami cuma perlu 30 menit untuk scheduling dan analytics. Workflow kami jadi 10x lebih efficient!&quot;
                </blockquote>
                <div className="font-semibold">Rina Susanto</div>
                <div className="text-sm text-muted-foreground">Marketing Manager, Toko skincare lokal</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
