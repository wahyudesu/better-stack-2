"use client";

import { useEffect, useRef } from "react";
import { useClerk } from "@clerk/nextjs";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const { openWaitlist } = useClerk();
  const calledRef = useRef(false);

  useEffect(() => {
    if (open && !calledRef.current) {
      calledRef.current = true;
      openWaitlist();
      onOpenChange(false);
    }
    if (!open) {
      calledRef.current = false;
    }
  }, [open, openWaitlist, onOpenChange]);

  return null;
}
