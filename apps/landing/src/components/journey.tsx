"use client";

const steps = [
  {
    number: "01",
    phase: "Before",
    title: "Chaotic & Overwhelmed",
    description:
      "Juggling 5 apps. Scrolling endlessly. Missed posts. Lost DMs. Social media becomes a burden, not an asset.",
    visual: (
      <div className="relative flex justify-center">
        <div className="grid grid-cols-3 gap-2">
          {["📱", "📱", "📱", "📱", "📱", "📱"].map((phone, i) => (
            <div
              key={i}
              className="w-12 h-16 sm:w-14 sm:h-18 rounded-lg bg-muted/50 flex items-center justify-center text-xl transform"
              style={{
                transform: `rotate(${(i - 2) * 8}deg)`,
              }}
            >
              {phone}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "02",
    phase: "During",
    title: "Organized & Efficient",
    description:
      "Plan weekly content on a calendar. Set auto-post. Connect all platforms. You just approve — we handle the rest.",
    visual: (
      <div className="relative">
        <div className="bg-card rounded-xl border border-border p-4 space-y-2">
          {["Mon", "Wed", "Fri"].map((day) => (
            <div key={day} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-8">{day}</span>
              <div className="flex-1 h-6 bg-primary/10 rounded flex items-center justify-center text-xs text-primary">
                📝 Post
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "03",
    phase: "After",
    title: "Growing & Scaling",
    description:
      "Real-time dashboard. Analytics monitored. Audience growing. You focus on strategy — we handle execution. Social media finally becomes a competitive advantage.",
    visual: (
      <div className="relative">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-end justify-center gap-2 h-20">
            {[40, 55, 45, 70, 60, 85, 75, 90, 80, 100].map((height, i) => (
              <div
                key={i}
                className="w-4 bg-gradient-to-t from-primary to-accent rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs text-primary font-medium">📈 Growing!</span>
          </div>
        </div>
      </div>
    ),
  },
];

export function Journey() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-5xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Customer Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4 tracking-tight">
              The transformation you get
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From overwhelmed by social media to having full control
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 -translate-y-1/2 z-0" />

            <div className="grid lg:grid-cols-3 gap-8 relative z-10">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  {/* Step header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {step.phase}
                      </p>
                      <p className="font-semibold">{step.title}</p>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="mb-6">{step.visual}</div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
