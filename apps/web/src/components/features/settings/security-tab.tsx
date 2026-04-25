/**
 * Security Settings Tab Component.
 */

"use client";

import {
	AlertCircle,
	CheckCircle2,
	KeyRound,
	Loader2,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserApiKey } from "@/hooks/use-user-api-key";
import { useAuthStore } from "@/stores";
import type { UsageStats } from "@/stores/auth-store";

export function SecurityTab() {
	const { setUsageStats, setIsValidating, isValidating } = useAuthStore();
	const [apiKeyInput, setApiKeyInput] = useState("");
	const [error, setLocalError] = useState<string | null>(null);

	const { apiKey, isLoading } = useUserApiKey();
	const upsertApiKeyMutation = useMutation((api as any).users.upsertApiKey);

	const maskedKey =
		typeof apiKey === "string" && apiKey.length > 0
			? `${apiKey.slice(0, 8)}${"•".repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}`
			: "";

	const handleConnect = async () => {
		if (!apiKeyInput.trim()) {
			setLocalError("API key is required");
			return;
		}

		if (!apiKeyInput.startsWith("sk_")) {
			setLocalError("Invalid API key format");
			return;
		}

		setIsValidating(true);
		setLocalError(null);

		try {
			const response = await fetch("/api/validate-key", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
			});

			if (!response.ok) {
				const data = (await response.json().catch(() => ({}))) as {
					error?: string;
				};
				throw new Error(data?.error || "Invalid API key");
			}

			const data = (await response.json()) as { data?: UsageStats };
			setUsageStats(data?.data ?? null);

			await upsertApiKeyMutation({ apiKey: apiKeyInput.trim() });
			setApiKeyInput("");
		} catch (err) {
			setLocalError(
				err instanceof Error ? err.message : "Failed to validate API key",
			);
		} finally {
			setIsValidating(false);
		}
	};

	const handleDisconnect = async () => {
		await upsertApiKeyMutation({ apiKey: null });
		setUsageStats(null);
		setLocalError(null);
	};

	return (
		<div className="space-y-5">
			<Card>
				<CardContent className="space-y-3">
					<p className="text-sm font-semibold">Password</p>
					<div className="flex flex-col gap-3">
						<div className="space-y-2">
							<Label>Current password</Label>
							<Input type="password" />
						</div>
						<div className="space-y-2">
							<Label>New password</Label>
							<Input type="password" />
						</div>
					</div>
					<div className="flex justify-end">
						<Button size="sm">Update</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="space-y-3">
					<p className="text-sm font-semibold">Two-factor authentication</p>
					<div className="flex items-center gap-3">
						<Switch />
						<span className="text-sm text-muted-foreground">Disabled</span>
					</div>
				</CardContent>
			</Card>

			<Card className="">
				<CardContent className="">
					<div className="flex items-center gap-2">
						<KeyRound className="size-4 text-primary" />
						<p className="text-sm font-semibold">Zernio API Key</p>
					</div>

					{isLoading ? (
						<div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
							<Loader2 className="h-4 w-4 animate-spin" />
							Loading...
						</div>
					) : typeof apiKey === "string" && apiKey.length > 0 ? (
						<div className="space-y-3">
							<div className="flex items-center gap-2 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20">
								<CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
								<span className="text-sm text-emerald-600 dark:text-emerald-400">
									Connected
								</span>
								<span className="text-sm text-muted-foreground font-mono ml-auto">
									{maskedKey}
								</span>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										navigator.clipboard.writeText(apiKey);
									}}
								>
									Copy
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={handleDisconnect}
								>
									<Trash2 className="size-4 mr-1" />
									Disconnect
								</Button>
							</div>
						</div>
					) : (
						<div className="space-y-3">
							<p className="text-xs text-muted-foreground">
								Connect your Zernio account to access AI features and social
								media integrations.
							</p>
							<div className="space-y-2">
								<Label htmlFor="api-key">API Key</Label>
								<Input
									id="api-key"
									type="password"
									placeholder="sk_xxx"
									value={apiKeyInput}
									onChange={(e) => {
										setApiKeyInput(e.target.value);
										setLocalError(null);
									}}
									disabled={isValidating}
								/>
							</div>

							{error && (
								<div className="flex items-center gap-2 text-sm text-destructive">
									<AlertCircle className="h-4 w-4" />
									{error}
								</div>
							)}

							<Button
								onClick={handleConnect}
								disabled={isValidating || !apiKeyInput.trim()}
								size="sm"
							>
								{isValidating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Validating...
									</>
								) : (
									"Connect"
								)}
							</Button>

							<p className="text-xs text-muted-foreground">
								Don&apos;t have an API key?{" "}
								<a
									href="https://zernio.com/api-keys"
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-4 hover:text-primary"
								>
									Get one here
								</a>
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
