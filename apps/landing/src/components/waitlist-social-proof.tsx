"use client";

import { useEffect, useState } from "react";

interface WaitlistCountResponse {
  count: number | null;
}

// TODO: Replace with real count once Loop.so exposes a count endpoint
const PLACEHOLDER_COUNT = 247;

export function WaitlistSocialProof() {
  const [count, setCount] = useState<number>(PLACEHOLDER_COUNT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchCount() {
      try {
        const res = await fetch("/api/waitlist");
        const data: WaitlistCountResponse = await res.json();
        // Fallback to placeholder until Loop.so provides a count API
        setCount(data.count ?? PLACEHOLDER_COUNT);
      } catch {
        // Silently fail - use placeholder
        setCount(PLACEHOLDER_COUNT);
      }
    }
    fetchCount();
  }, []);

  if (!mounted) return null;

  return (
    <p className="text-sm text-muted-foreground text-center mb-3">
      <span className="font-semibold text-foreground">{count.toLocaleString()}</span> people already on the waitlist
    </p>
  );
}
