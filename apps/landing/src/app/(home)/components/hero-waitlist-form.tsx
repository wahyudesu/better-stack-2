"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { WaitlistModal } from "@/components/waitlist-modal";
import { Input } from "@/components/ui/input";
import { DepthButton } from "@/components/ui/depth-buttons";

export function HeroWaitlistForm() {
  const [email, setEmail] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 text-green-600 rounded-full">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium">{"You're on the waitlist!"}</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          className="h-9"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <DepthButton
          onClick={() => {
            posthog.capture("waitlist_cta_clicked", { location: "hero" });
            setShowDialog(true);
          }}
          variant="blue"
          className="px-6 py-3"
        >
          Join Waitlist
        </DepthButton>
      </div>

      <WaitlistModal
        open={showDialog}
        onOpenChange={setShowDialog}
        initialEmail={email}
        onSuccess={() => setStatus("success")}
      />
    </>
  );
}
