"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const solutions = [
  {
    id: "agency",
    label: "Agency",
    headline: "Run 20 clients like you run 2.",
    description:
      "Managing multiple clients means managing multiple tools, multiple logins, multiple reports — and somehow still delivering on time. zenpost.in brings it all under one roof.",
    features: [
      "Built-in approval workflow — no more back-and-forth",
      "Schedule content from one calendar, not ten",
      "White-label reports — your brand, not ours",
      "Add new clients without adding headcount",
    ],
  },
  {
    id: "brand",
    label: "Brand",
    headline: "Know what's growing your brand.",
    description:
      "From scheduling to performance tracking — everything your brand needs to show up consistently and grow with confidence.",
    features: [
      "Real-time analytics across every platform",
      "All DMs, comments, mentions — one inbox",
      "AI insight — answers not more charts",
      "Turn top posts into paid campaigns",
    ],
  },
  {
    id: "freelancer",
    label: "Freelancer",
    headline: "Enterprise tools without the enterprise price.",
    description:
      "One person. Multiple clients. Zero chaos. Deliver results that look like a full agency — solo.",
    features: [
      "Polished reports with your own branding",
      "Clients review without needing an account",
      "Handle multiple clients from one dashboard",
      "Scheduling, auto-reports, workflow automation",
    ],
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    headline: "Every reply = a potential sale.",
    description:
      "Social media is your storefront. Slow replies cost you customers. zenpost.in keeps you on top of every interaction.",
    features: [
      "All product questions in one inbox",
      "Spot negative feedback before it goes viral",
      "Track engaged customers across platforms",
      "Boost top-performing posts directly",
    ],
  },
  {
    id: "automation",
    label: "Automation",
    headline: "Set it once. Let it run forever.",
    description:
      "Automate the stuff you do over and over — so your social presence keeps growing while you focus on work that matters.",
    features: [
      "AI-powered instant replies for DMs & comments",
      "Custom automation flows",
      "Publish at optimal times automatically",
      "Auto-generate captions tuned to your brand",
    ],
  },
];

export function Solutions() {
  const [activeTab, setActiveTab] = useState("agency");
  const activeSolution =
    solutions.find((s) => s.id === activeTab) ?? solutions[0];

  return (
    <section className="py-24 overflow-hidden" id="solutions">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-3 tracking-tight">
              Built for every kind of social team
            </h2>
            <p className="text-muted-foreground">
              Agency, brand, freelancer, e-commerce — ZenPost has the tools you need.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-1 bg-muted rounded-lg p-[3px] overflow-x-auto max-w-full">
              {solutions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={cn(
                    "shrink-0 h-9 px-4 rounded-md font-medium text-sm transition-all whitespace-nowrap",
                    activeTab === s.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              {activeSolution.headline}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              {activeSolution.description}
            </p>
          </div>

          {/* Feature list */}
          <div className="grid sm:grid-cols-2 gap-3">
            {activeSolution.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}