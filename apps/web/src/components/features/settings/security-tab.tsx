/**
 * Security Settings Tab Component.
 */

"use client";

import { CheckCircle2, KeyRound, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";

export function SecurityTab() {
	const { apiKey, setApiKey, setUsageStats } = useAuthStore();
	const [loading, setLoading] = useState(false);

	const maskedKey = apiKey
		? `${apiKey.slice(0, 8)}${"•".repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}`
		: "";

	const handleDisconnect = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/user/api-key", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ apiKey: null }),
			});
			if (res.ok) {
				setApiKey(null);
				setUsageStats(null);
			}
		} catch (err) {
			console.error("[SecurityTab] disconnect failed:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-5">
			<Card>
				<CardContent className="space-y-3">
					<p className="text-sm font-semibold">Password</p>
					<div className="flex flex-col gap-3">
						<div className="space-y-2">
							<span className="text-sm">Current password</span>
						</div>
						<div className="space-y-2">
							<span className="text-sm">New password</span>
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
						<input type="checkbox" />
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

					{apiKey ? (
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
									disabled={loading}
								>
									<Trash2 className="size-4 mr-1" />
									Disconnect
								</Button>
							</div>
						</div>
					) : (
						<div className="flex items-center gap-2 p-3 rounded-md bg-muted border">
							<span className="text-sm text-muted-foreground">
								Not connected
							</span>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
