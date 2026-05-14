"use client";

import { useWaitlist } from "@clerk/nextjs";
import { useState } from "react";

export default function WaitlistPage() {
  const { waitlist, errors, fetchStatus } = useWaitlist();
  const [joined, setJoined] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailAddress = formData.get("emailAddress") as string;

    const { error } = await waitlist.join({ emailAddress });
    if (error) {
      console.error("Failed to join waitlist:", error);
    } else {
      setJoined(true);
    }
  };

  if (waitlist.id || joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Successfully joined the waitlist!</h1>
        <p className="text-muted-foreground">We&apos;ll notify you when you&apos;re approved.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Join the Waitlist</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <label htmlFor="email" className="text-sm font-medium">
          Email address
        </label>
        <input
          id="email"
          name="emailAddress"
          type="email"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.fields.emailAddress && (
          <p className="text-sm text-red-500">{errors.fields.emailAddress.longMessage}</p>
        )}
        <button
          type="submit"
          disabled={fetchStatus === "fetching"}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {fetchStatus === "fetching" ? "Submitting..." : "Join Waitlist"}
        </button>
      </form>
    </div>
  );
}