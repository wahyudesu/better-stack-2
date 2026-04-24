"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DepthButton } from "@/components/ui/depth-buttons";

export function HeroWaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Email is required");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setStatus("success");
      setMessage("You're on the waitlist!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
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
        {status === "loading" ? "Joining..." : "Join Waitlist"}
      </DepthButton>
      {status === "error" && message && (
        <p className="mt-1 text-sm text-red-500 text-center">{message}</p>
      )}
    </form>
  );
}
