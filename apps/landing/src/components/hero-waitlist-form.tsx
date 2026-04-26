"use client";

import { useState } from "react";
import { WaitlistModal } from "@/components/waitlist-modal";
import { Input } from "@/components/ui/input";
import { DepthButton } from "@/components/ui/depth-buttons";
import { isValidEmail } from "@/lib/utils";
import posthog from "posthog-js";

export function HeroWaitlistForm() {
  const [email, setEmail] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function handleGetWaitlist() {
    if (!email.trim()) {
      setStatus("error");
      setMessage("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Invalid email format");
      return;
    }

    setStatus("idle");
    setShowDialog(true);
    posthog.capture("waitlist_cta_clicked", { cta: "hero_form" });
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 text-green-600 rounded-full">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium">{message}</span>
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
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Enter your email"
          disabled={status === "loading"}
        />
        <DepthButton
          onClick={handleGetWaitlist}
          variant="blue"
          className="px-6 py-3"
          disabled={status === "loading"}
        >
          Join Waitlist
        </DepthButton>
      </div>
      {status === "error" && message && (
        <p className="mt-1 text-sm text-red-500 text-center">{message}</p>
      )}

      <WaitlistModal open={showDialog} onOpenChange={setShowDialog} initialEmail={email} />
    </>
  );
}