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
import { BuildingIcon, StoreIcon } from "lucide-react";
import { isValidEmail } from "@/lib/utils";
import posthog from "posthog-js";

type UserType = "agency_owner" | "brand_owner";

const userTypeOptions: { value: UserType; label: string; Icon: typeof BuildingIcon }[] = [
  { value: "agency_owner", label: "Agency Owner", Icon: BuildingIcon },
  { value: "brand_owner", label: "Brand Owner", Icon: StoreIcon },
];

interface WaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
}

function WaitlistForm({ email, onSuccess }: { email: string; onSuccess: () => void }) {
  const [selectedType, setSelectedType] = useState<UserType | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType: selectedType }),
      });

      const data: WaitlistResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to join waitlist");
      }

      posthog.capture("waitlist_join_success", {
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
      <p className="text-sm text-muted-foreground text-center">Pilih tipe akun yang cocok</p>
      <div className="flex flex-row gap-3 w-full">
        {userTypeOptions.map((opt) => (
          <label
            key={opt.value}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all text-center ${
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
              className="accent-primary sr-only"
            />
            <opt.Icon className="size-6" />
            <span className="font-medium">{opt.label}</span>
          </label>
        ))}
      </div>

      {status === "error" && errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <DepthButton
        type="submit"
        variant="blue"
        className="w-full py-3"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Joining..." : "Join Waitlist"}
      </DepthButton>
    </form>
  );
}

export function WaitlistModal({ open, onOpenChange, initialEmail }: WaitlistModalProps) {
  const [email, setEmail] = useState(initialEmail || "");
  const [step, setStep] = useState<"email" | "type">(initialEmail ? "type" : "email");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSuccess() {
    onOpenChange(false);
    setEmail("");
    setStep("email");
    setStatus("success");
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setEmail(initialEmail || "");
      setStep(initialEmail ? "type" : "email");
      setStatus("idle");
      setErrorMsg("");
    }
    onOpenChange(newOpen);
  }

  function handleSubmit() {
    if (!email.trim()) {
      setStatus("error");
      setErrorMsg("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMsg("Invalid email format");
      return;
    }

    setStatus("idle");
    setStep("type");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Waitlist</DialogTitle>
          <DialogDescription>
            Kami ingin tahu kamu siapa. Pilih tipe akun yang paling cocok.
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
            disabled={status === "loading"}
          />
          {status === "error" && errorMsg && (
            <p className="text-sm text-red-500">{errorMsg}</p>
          )}
          {step === "type" ? (
            <WaitlistForm email={email} onSuccess={handleSuccess} />
          ) : (
            <DepthButton
              onClick={handleSubmit}
              variant="blue"
              className="w-full py-3"
              disabled={status === "loading"}
            >
              Continue
            </DepthButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}