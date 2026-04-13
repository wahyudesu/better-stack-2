"use client";

import { cn } from "@/lib/utils";

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
];

export function Comparison() {
  return (
    <section className="py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Manual vs Better Stack 2
            </h2>
            <p className="text-secondary-foreground/70">
              Lihat bedanya waktu kamu pakai Better Stack 2
            </p>
          </div>

          {/* Comparison rows */}
          <div className="space-y-4">
            {comparisons.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center p-6 rounded-2xl",
                  index % 2 === 0 ? "bg-secondary-foreground/5" : "bg-transparent"
                )}
              >
                {/* Manual */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✗</span>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-foreground/60 mb-1">Manual</p>
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
                    <span className="text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-primary/80 mb-1">Better Stack 2</p>
                    <p className="font-medium">{item.better}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="text-center mt-12">
            <p className="text-secondary-foreground/60 text-sm">
              Avg. waktu hemat: <span className="text-primary font-bold">3-5 jam/minggu</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
