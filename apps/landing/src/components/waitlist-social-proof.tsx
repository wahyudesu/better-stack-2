"use client";

import { useEffect, useState } from "react";

interface WaitlistCountResponse {
  count: number | null;
}

export function WaitlistSocialProof() {
  const [count, setCount] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchCount() {
      try {
        const res = await fetch("/api/waitlist");
        const data: WaitlistCountResponse = await res.json();
        if (data.count !== null) {
          setCount(data.count);
        }
      } catch {
        // Silently fail - social proof is non-critical
      }
    }
    fetchCount();
  }, []);

  if (!mounted) return null;

  return (
    <p className="text-sm text-muted-foreground text-center mb-3">
      {count !== null ? (
        <>
          <span className="font-semibold text-foreground">{count.toLocaleString()}</span> people already on the waitlist
        </>
      ) : (
        "Join early adopters"
      )}
    </p>
  );
}
