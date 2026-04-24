"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DepthButton } from "@/components/ui/depth-buttons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWaitlist } from "@clerk/nextjs";
import posthog from "posthog-js";

type UserType = "agency_owner" | "brand_owner";

const userTypeOptions: { value: UserType; label: string }[] = [
  { value: "agency_owner", label: "Agency Owner" },
  { value: "brand_owner", label: "Brand Owner" },
];

interface WaitlistModalFormProps {
  email: string;
  onSuccess: () => void;
}

function WaitlistModalForm({ email, onSuccess }: WaitlistModalFormProps) {
  const [selectedType, setSelectedType] = useState<UserType | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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

      posthog.capture("waitlist_join_success", {
        email,
        userType: selectedType,
      });

      setStatus("idle");
      onSuccess();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Select your account type to help us personalize your experience.
        </p>
        <div className="flex flex-col gap-2">
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
      </div>

      {status === "error" && errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <DepthButton
        type="submit"
        variant="blue"
        className="w-full py-3"
        disabled={status === "loading" || fetchStatus === "fetching"}
      >
        {status === "loading" || fetchStatus === "fetching"
          ? "Joining..."
          : "Join Waitlist"}
      </DepthButton>
    </form>
  );
}

export function HeroWaitlistForm() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function handleGetWaitlist() {
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
    setShowModal(true);
  }

  function handleSuccess() {
    setShowModal(false);
    setStatus("success");
    setMessage("You're on the waitlist!");
    setEmail("");
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
          Get Waitlist
        </DepthButton>
      </div>
      {status === "error" && message && (
        <p className="mt-1 text-sm text-red-500 text-center">{message}</p>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join the Waitlist</DialogTitle>
            <DialogDescription>
              Enter your email and select your account type to get early access.
            </DialogDescription>
          </DialogHeader>
          <WaitlistModalForm email={email} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}