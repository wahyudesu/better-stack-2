"use client";

import { WaitlistForm } from "@/components/waitlist-form";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Early Access
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Kelola Semua Social Media{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                dari Satu Dashboard
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule, analytics, dan AI-powered insights untuk creator dan bisnis Indonesia.
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto pt-6">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}