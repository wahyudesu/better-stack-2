"use client";

import { ClerkProvider as CP } from "@clerk/nextjs";
import { Toaster } from "@better-stack-2/ui/components/sonner";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <CP>
      {children}
      <Toaster richColors />
    </CP>
  );
}