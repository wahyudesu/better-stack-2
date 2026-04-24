"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DepthButton } from "@/components/ui/depth-buttons";
import { useWaitlist } from "@clerk/nextjs";
import posthog from "posthog-js";

type UserType = "agency_owner" | "brand_owner";

const userTypeOptions: { value: UserType; label: string }[] = [
  { value: "agency_owner", label: "Agency Owner" },
  { value: "brand_owner", label: "Brand Owner" },
];

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WaitlistFormProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

function WaitlistForm({ email, onBack, onSuccess }: WaitlistFormProps) {
  const [selectedType, setSelectedType] = useState<UserType | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { waitlist, fetchStatus } = useWaitlist();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType) {
      setStatus("error");
      setErrorMsg("Please select your account type");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const { error } = await waitlist.join({ emailAddress: email });
      if (error) {
        throw new Error(error.longMessage || "Failed to join waitlist");
      }

      posthog.capture("waitlist_join_modal_success", {
        email,
        userType: selectedType,
      });

      onSuccess();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {userTypeOptions.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedType === opt.value
                ? "border-primary bg-primary/5"
                : "border-input hover:bg-muted"
            }`}
          >
            <input
              type="radio"
              name="userType"
              value={opt.value}
              checked={selectedType === opt.value}
              onChange={() => setSelectedType(opt.value)}
              className="accent-primary"
            />
            <span className="font-medium">{opt.label}</span>
          </label>
        ))}
      </div>

      {status === "error" && errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <div className="flex gap-3">
        <DepthButton
          type="button"
          variant="outline"
          className="flex-1 py-3"
          onClick={onBack}
        >
          Back
        </DepthButton>
        <DepthButton
          type="submit"
          variant="blue"
          className="flex-1 py-3"
          disabled={status === "loading" || fetchStatus === "fetching"}
        >
          {status === "loading" || fetchStatus === "fetching"
            ? "Joining..."
            : "Join Waitlist"}
        </DepthButton>
      </div>
    </form>
  );
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [step, setStep] = useState<"email" | "type">("email");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const { fetchStatus } = useWaitlist();

  function handleEmailSubmit() {
    if (!email.trim()) {
      setStatus("error");
      setMessage("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Invalid email format");
      return;
    }

    setStatus("idle");
    setStep("type");
  }

  function handleBack() {
    setStep("email");
  }

  function handleSuccess() {
    onOpenChange(false);
    setStep("email");
    setEmail("");
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setStep("email");
      setEmail("");
      setStatus("idle");
      setMessage("");
    }
    onOpenChange(newOpen);
  }

  if (step === "type") {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Account Type</DialogTitle>
            <DialogDescription>
              Choose the option that best describes you.
            </DialogDescription>
          </DialogHeader>
          <WaitlistForm email={email} onBack={handleBack} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Early Access</DialogTitle>
          <DialogDescription>
            Enter your email to join the waitlist.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter your email"
            disabled={status === "loading" || fetchStatus === "fetching"}
          />
          {status === "error" && message && (
            <p className="text-sm text-red-500">{message}</p>
          )}
          <DepthButton
            onClick={handleEmailSubmit}
            variant="blue"
            className="w-full py-3"
            disabled={status === "loading" || fetchStatus === "fetching"}
          >
            {status === "loading" || fetchStatus === "fetching"
              ? "Loading..."
              : "Continue"}
          </DepthButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}