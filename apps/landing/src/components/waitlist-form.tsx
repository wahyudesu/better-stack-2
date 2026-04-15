"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { DepthButton } from "@/components/ui/depth-buttons";
import posthog from "posthog-js";

interface WaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export function WaitlistForm() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Already signed in - check if already on waitlist via metadata
  if (isLoaded && isSignedIn) {
    const isWaitlist = user?.publicMetadata?.isWaitlist === true;
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500/10 text-green-600 rounded-full">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium">
          {isWaitlist
            ? "You're on the waitlist!"
            : "Welcome! Check your email to join waitlist."}
        </span>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Email is required");
      return;
    }

    posthog.capture("waitlist_signup_submitted", {
      email: email.trim(),
      distinct_id: posthog.get_distinct_id(),
    });

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-POSTHOG-DISTINCT-ID": posthog.get_distinct_id(),
          "X-POSTHOG-SESSION-ID": posthog.get_session_id() ?? "",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data: WaitlistResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      posthog.identify(email.trim(), { email: email.trim() });

      setStatus("success");
      setMessage(data.message || "You're on the waitlist!");
      setEmail("");
    } catch (err) {
      posthog.captureException(err);
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500/10 text-green-600 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            className="h-9"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === "loading"}
          />
          <DepthButton
            type="submit"
            variant="blue"
            className="px-6 py-3"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Joining...
              </span>
            ) : (
              "Join Waitlist"
            )}
          </DepthButton>
        </form>
      )}

      {status === "error" && message && (
        <p className="mt-2 text-sm text-red-500 text-center">{message}</p>
      )}
    </div>
  );
}
