"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores";

type CallbackStep = "processing" | "success" | "error";

function CallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const setApiKey = useAuthStore((s) => s.setApiKey);

	const [step, setStep] = useState<CallbackStep>("processing");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleCallback = async () => {
			try {
				const connected = searchParams?.get("connected");
				const errorParam = searchParams?.get("error");
				const apiKeyParam = searchParams?.get("apiKey");

				if (errorParam) {
					setError(errorParam);
					setStep("error");
					return;
				}

				// If Zernio returned an apiKey in the callback, store it
				if (apiKeyParam) {
					setApiKey(apiKeyParam);
					// Also persist to backend
					fetch("/api/user/api-key", {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ apiKey: apiKeyParam }),
					}).catch((e) => {
						console.warn("[callback] failed to persist apiKey:", e);
					});
				}

				if (connected) {
					// Store account via API call to server
					const profileId =
						searchParams?.get("localProfileId") ||
						searchParams?.get("profileId") ||
						"";
					const username = searchParams?.get("username") || "Connected Account";
					const avatarUrl = searchParams?.get("avatarUrl") || undefined;

					try {
						await fetch("/api/social-accounts", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								platform: connected,
								accountId: profileId,
								accountName: decodeURIComponent(username),
								avatarUrl,
								profileId, // local brand UUID
							}),
						});
					} catch (e) {
						console.warn("API not configured:", e);
					}
				}

				setStep("success");
				// Sync all accounts from Zernio to ensure consistency
				fetch("/api/social-accounts", { method: "POST" }).catch(console.warn);
				setTimeout(() => router.push("/settings"), 2000);
			} catch (err) {
				console.error("Callback error:", err);
				setError(
					err instanceof Error ? err.message : "Failed to process connection",
				);
				setStep("error");
			}
		};

		handleCallback();
	}, [router, searchParams, setApiKey]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle>
						{step === "processing" && "Connecting Account..."}
						{step === "success" && "Connected!"}
						{step === "error" && "Connection Failed"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{step === "processing" && (
						<div className="flex flex-col items-center gap-4 py-8">
							<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
							<p className="text-muted-foreground">Please wait...</p>
						</div>
					)}

					{step === "success" && (
						<div className="flex flex-col items-center gap-4 py-8">
							<div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
								<svg
									className="h-6 w-6 text-green-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<title>Success checkmark</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<p className="text-muted-foreground">
								Redirecting to accounts...
							</p>
						</div>
					)}

					{step === "error" && (
						<div className="flex flex-col items-center gap-4 py-8">
							<div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
								<svg
									className="h-6 w-6 text-red-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<title>Error X mark</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</div>
							<p className="text-center text-muted-foreground">{error}</p>
							<button
								type="button"
								onClick={() => router.push("/settings")}
								className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
							>
								Back to Settings
							</button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default function CallbackPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
				</div>
			}
		>
			<CallbackContent />
		</Suspense>
	);
}
