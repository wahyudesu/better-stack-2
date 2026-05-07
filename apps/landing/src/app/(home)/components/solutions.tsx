"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const solutions = [
  {
    id: "agency",
    label: "Agency",
    description:
      "Manage multiple clients without multiplying tools. One dashboard to schedule, track, and deliver — while your clients see white-label reports with your brand on it.",
    features: [
      "Approval workflow — clients review without needing an account",
      "Schedule from one calendar across 15+ platforms",
      "White-label reports — your brand, your name",
      "Add unlimited clients, no plan upgrade needed",
    ],
  },
  {
    id: "brand",
    label: "Brand",
    description:
      "Show up consistently on every platform. Track what works, reply fast, and grow — all from one place.",
    features: [
      "One inbox for DMs, comments, mentions, reviews",
      "Real-time analytics across every platform",
      "AI insight — answers not more charts",
      "Boost top-performing posts into paid campaigns",
    ],
  },
  {
    id: "freelancer",
    label: "Freelancer",
    description:
      "Deliver results that look like a full agency — solo. No retained staff, no complex tools, just you and your clients.",
    features: [
      "Clients review and approve without an account",
      "Polished reports with your own branding",
      "Handle multiple clients from one dashboard",
      "Auto-reports, scheduling, and workflow automation",
    ],
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    description:
      "Your social channels are your storefront. Slow replies cost you customers. Every interaction is a chance to convert.",
    features: [
      "All product questions in one inbox",
      "Spot negative feedback before it goes viral",
      "Track engaged customers across platforms",
      "Boost top-performing posts directly into ads",
    ],
  },
  {
    id: "automation",
    label: "Automation",
    description:
      "Let the work run while you sleep. AI-powered replies, auto-scheduling, and workflow automation — so your social presence keeps growing.",
    features: [
      "AI-powered instant replies for DMs & comments",
      "Auto-generate captions tuned to your brand",
      "Publish at optimal times automatically",
      "Custom automation flows for your workflow",
    ],
  },
];

export function Solutions() {
  const [activeTab, setActiveTab] = useState("agency");
  const activeSolution =
    solutions.find((s) => s.id === activeTab) ?? solutions[0]!;

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