"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "scheduler",
    label: "Scheduler",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "ai",
    label: "AI Assistant",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const content = {
  analytics: {
    title: "Analytics Terpusat",
    description: "Lihat semua metric dari satu tempat. Track engagement, followers, dan growth real-time.",
    image: "/dashboard-analytics.png",
  },
  scheduler: {
    title: "Smart Scheduler",
    description: "Plan konten mingguan dengan drag-drop. Auto-post ke semua platform tepat waktu.",
    image: "/dashboard-scheduler.png",
  },
  ai: {
    title: "AI Content Assistant",
    description: "Generate caption, hashtag, dan ide konten dengan AI dalam hitungan detik.",
    image: "/dashboard-ai.png",
  },
};

export function HeroTabs() {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="w-full max-w-5xl mx-auto mt-16">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-1 p-1 bg-muted rounded-full w-fit mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8 relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "transition-all duration-500",
              activeTab === tab.id ? "opacity-100 translate-y-0" : "opacity-0 absolute inset-0 translate-y-4 pointer-events-none"
            )}
          >
            <div className="bg-card rounded-2xl border border-border p-2 shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    {tab.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{content[tab.id as keyof typeof content].title}</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">{content[tab.id as keyof typeof content].description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
