"use client";

import { useState } from "react";
import { WaitlistModal } from "@/components/waitlist-modal";

export default function WaitlistPage() {
  const [open, setOpen] = useState(true);

  return (
    <WaitlistModal
      open={open}
      onOpenChange={setOpen}
      onSuccess={() => {
        window.location.href = "/";
      }}
    />
  );
}