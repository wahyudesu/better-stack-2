"use client";

import { WaitlistForm } from "@/components/waitlist-form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FeaturesDetail } from "@/components/features-detail";

type TabId = "analytics" | "scheduler" | "ai";

const tabContent: Record<
  TabId,
  { title: string; description: string }
> = {
  analytics: {
    title: "Analytics terpusat",
    description:
      "Semua metrik di satu tempat: engagement, pertumbuhan followers, dan performa iklan secara real time.",
  },
  scheduler: {
    title: "Smart scheduler",
    description:
      "Rencanakan konten mingguan dengan alur yang jelas. Jadwalkan posting ke berbagai platform tanpa ketinggalan.",
  },
  ai: {
    title: "Asisten konten AI",
    description:
      "Capion, hashtag, dan ide konten siap pakai dalam hitungan detik—disesuaikan untuk audiens Indonesia.",
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[min(90vw,640px)] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl lg:right-[10%]" />
      </div>

      <div className="container mx-auto px-4 items-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-12">
          {/* Copy + waitlist */}
          <div className="w-full text-center">
            <div className="mb-5 flex justify-center">
              <Badge variant="secondary" className="gap-2 pl-2 pr-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Early access
              </Badge>
            </div>

            <div className="space-y-5 max-w-xl mx-auto text-center items-center">
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                Analytics first for social media and ads
              </h1>
              <p className="text-pretty text-lg text-muted-foreground mx-auto max-w-xl">
                Jadwalkan konten, pantau angka, dan dapatkan insight berbasis AI—dirancang untuk creator dan bisnis di Indonesia.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-md">
              <WaitlistForm />
            </div>
          </div>

          {/* Product preview tabs */}
          <div className="w-full pt-16">
            <Tabs defaultValue="analytics" className="w-full">
              <div className="flex justify-center">
                <TabsList className="">
                  <TabsTrigger value="analytics" className="p-3 rounded-full">Analytics</TabsTrigger>
                  <TabsTrigger value="scheduler" className="p-3 rounded-full">Scheduler</TabsTrigger>
                  <TabsTrigger value="ai" className="p-3 rounded-full">AI Assistant</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="analytics" className="mt-2">
                <div className="overflow-hidden rounded-2xl border border-border/80">
                  <img src="/okok.png" alt={tabContent.analytics.title} className="w-full h-auto" />
                </div>
              </TabsContent>

              <TabsContent value="scheduler" className="mt-2">
                <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
                  <img src="/okok.png" alt={tabContent.scheduler.title} className="w-full h-auto" />
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-2">
                <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
                  <img src="/okok.png" alt={tabContent.ai.title} className="w-full h-auto" />
                </div>
              </TabsContent>
            </Tabs>

          </div>
        </div>

        <div className="mt-16 pt-8">
          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12">
            <div className="flex-1 max-w-[280px] text-center">
              <p className="text-muted-foreground">Pantau semua metrik media sosial di satu tempat dengan visualisasi data yang mudah dipahami.</p>
            </div>
            <div className="flex-1 max-w-[280px] text-center">
              <p className="text-muted-foreground">Jadwalkan posting dengan waktu optimal untuk menjangkau audiens secara maksimal.</p>
            </div>
            <div className="flex-1 max-w-[280px] text-center">
              <p className="text-muted-foreground">Buat konten berkualitas tinggi dengan bantuan AI yang memahami tren dan preferensi audiens.</p>
            </div>
          </div>
        </div>

        <FeaturesDetail />
      </div>
    </section>
  );
}
