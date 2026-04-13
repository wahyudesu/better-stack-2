"use client";

const moreFeatures = [
  {
    tag: "Multi-Platform",
    title: "Satu Dashboard, Semua Platform",
    description:
      "Connect Instagram, TikTok, Twitter, Facebook, dan YouTube dalam satu tempat. Gak perlu lagi login-logout sana-sini. Semua dalam genggaman.",
    bullets: [
      "Auto-sync post dari semua platform",
      "Unified inbox untuk comments & DMs",
      "Single analytics untuk semua platform",
    ],
    visual: (
      <div className="relative">
        <div className="grid grid-cols-2 gap-4">
          {["IG", "TT", "TW", "FB", "YT", "📱"].map((icon, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-2xl font-bold text-muted-foreground/50"
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    tag: "Team Collaboration",
    title: "Kolaborasi Tim Tanpa Ribet",
    description:
      "Invite team members, assign roles, dan manage multiple accounts bareng-bareng. Perfect buat agencies dan brand yang punya banyak social media.",
    bullets: [
      "Multiple account access",
      "Role-based permissions (admin, editor, viewer)",
      "Activity log untuk semua perubahan",
    ],
    visual: (
      <div className="relative space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm">
              👤
            </div>
            <div className="flex-1">
              <div className="h-2 w-20 bg-muted rounded" />
              <div className="h-2 w-12 bg-muted/50 rounded mt-1" />
            </div>
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              {["Admin", "Editor", "Viewer"][i - 1]}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Real-time Updates",
    title: "Real-time Notifications",
    description:
      "Jangan sampai lost any engagement. Dapet notified untuk comments, DMs, mentions, dan trending话题 biar kamu bisa response cepet.",
    bullets: [
      "Unified notification inbox",
      "Keyword alerts untuk brand mentions",
      "Daily/weekly summary reports",
    ],
    visual: (
      <div className="relative space-y-3">
        {["💬", "❤️", "🔔", "📈"].map((icon, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              {icon}
            </div>
            <div className="flex-1 h-2 bg-muted rounded" />
            <div className="text-xs text-muted-foreground">Just now</div>
          </div>
        ))}
      </div>
    ),
  },
];

export function MoreFeatures() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-24">
          {moreFeatures.map((feature, index) => (
            <div
              key={feature.tag}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                  {feature.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div
                className={`bg-muted/30 rounded-2xl p-6 lg:p-8 ${
                  index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                }`}
              >
                {feature.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
