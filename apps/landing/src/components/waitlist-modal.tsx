"use client";

import { useState, useEffect, useRef } from "react";
import { useWaitlist } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DepthButton } from "@/components/ui/depth-buttons";
import { BuildingIcon, StoreIcon, UserIcon, CheckIcon } from "lucide-react";
import { isValidEmail } from "@/lib/utils";
import posthog from "posthog-js";

type UserType = "agency_owner" | "brand_owner" | "creator_freelance";

const userTypeOptions: { value: UserType; label: string; description: string; Icon: typeof BuildingIcon }[] = [
  { value: "agency_owner", label: "Agency", description: "For managing multiple client accounts", Icon: BuildingIcon },
  { value: "brand_owner", label: "Brand", description: "For your company, product, or store", Icon: StoreIcon },
  { value: "creator_freelance", label: "Creator", description: "For personal content and audience growth", Icon: UserIcon },
];

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
  onSuccess?: () => void;
}

function WaitlistForm({ email, onSuccess, onEmailChange }: { email: string; onSuccess: () => void; onEmailChange: (email: string) => void }) {
  const { waitlist, errors, fetchStatus } = useWaitlist();
  const [selectedType, setSelectedType] = useState<UserType | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
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
      const { error } = await waitlist.join({ emailAddress: email });

      if (error) {
        const errorMessage = errors.fields.emailAddress?.longMessage || error.longMessage || "Failed to join waitlist";
        throw new Error(errorMessage);
      }

      posthog.capture("waitlist_join_success", {
        email,
        userType: selectedType,
      });

      setStatus("success");
      setTimeout(onSuccess, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success" || waitlist.id) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckIcon className="size-6 text-green-600" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg">You&apos;re on the list!</p>
          <p className="text-sm text-muted-foreground">We&apos;ll notify you when you&apos;re approved.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="bg-muted"
      />
      <p className="text-sm text-muted-foreground text-center">What best describes you?</p>
      <div className="flex flex-row gap-3 w-full">
        {userTypeOptions.map((opt) => (
          <label
            key={opt.value}
            className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-xl border cursor-pointer transition-all text-center ${
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
            <span className="text-xs text-muted-foreground">{opt.description}</span>
          </label>
        ))}
      </div>

      {status === "error" && errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      {errors.fields.emailAddress && (
        <p className="text-sm text-red-500">{errors.fields.emailAddress.longMessage}</p>
      )}

      <div className="flex justify-end">
        <DepthButton
          type="submit"
          variant="blue"
          className="py-3"
          disabled={status === "loading" || fetchStatus === "fetching"}
        >
          {status === "loading" || fetchStatus === "fetching" ? "Joining..." : "Join Waitlist"}
        </DepthButton>
      </div>
    </form>
  );
}

export function WaitlistModal({ open, onOpenChange, initialEmail, onSuccess }: WaitlistModalProps) {
  const [email, setEmail] = useState(initialEmail || "");
  const [step, setStep] = useState<"email" | "type">(initialEmail ? "type" : "email");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Sync when dialog opens with initialEmail
  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (open && !prevOpenRef.current && initialEmail) {
      setEmail(initialEmail);
      setStep("type");
    }
    prevOpenRef.current = open;
  }, [open, initialEmail]);

  function handleSuccess() {
    onOpenChange(false);
    setEmail("");
    setStep("email");
    setStatus("success");
    onSuccess?.();
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Join Waitlist</DialogTitle>
          <DialogDescription>
            Tell us a bit about how you plan to use the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 relative">
          {step === "type" ? (
            <WaitlistForm email={email} onSuccess={handleSuccess} onEmailChange={setEmail} />
          ) : (
            <>
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
              <div className="flex justify-end">
                <DepthButton
                  onClick={handleSubmit}
                  variant="blue"
                  className="py-3"
                  disabled={status === "loading"}
                >
                  Continue
                </DepthButton>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}