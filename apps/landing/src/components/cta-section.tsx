"use client";

import { WaitlistForm } from "@/components/waitlist-form";

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Content */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Siap leveling up
            <br />
            social media game kamu?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join 2,847+ creator dan bisnis yang udah lebih efficient dengan Better Stack 2.
            Early bird pricing ends soon!
          </p>

          {/* Waitlist Form */}
          <WaitlistForm />

          {/* Urgency badge */}
          <div className="inline-flex items-center gap-2 mt-8 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            ⚡ Early bird pricing ends soon — limited spots left
          </div>
        </div>
      </div>
    </section>
  );
}