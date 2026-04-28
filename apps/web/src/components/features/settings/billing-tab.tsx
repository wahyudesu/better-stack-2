/**
 * Billing Settings Tab Component.
 */

"use client";

import { CreditCard, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUsageStats } from "@/hooks/use-usage";

export function BillingTab() {
	const { data: usageData, isLoading } = useUsageStats();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="size-6 animate-spin text-muted-foreground" />
				</div>
			</div>
		);
	}

	const usage = usageData?.usage;
	const limits = usageData?.limits;
	const planName = usageData?.planName || "Pro Plan";

	// Calculate percentages
	const aiPercent =
		usage && limits ? Math.round((usage.uploads / limits.uploads) * 100) : 0;
	const postsPercent =
		usage && limits ? Math.round((usage.profiles / limits.profiles) * 100) : 0;

	return (
		<div className="flex flex-col gap-6">
			{/* Current Plan */}
			<Card>
				<CardContent className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<Sparkles className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="font-display font-semibold">{planName}</p>
								<p className="text-xs text-muted-foreground">
									Manage your subscription in the billing portal
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="sm">
								Change Plan
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-destructive hover:text-destructive"
							>
								Cancel
							</Button>
						</div>
					</div>

					{usage && limits && (
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="p-3 bg-muted/30 rounded-lg">
								<p className="text-xs text-muted-foreground">Media Uploads</p>
								<p className="text-sm font-medium">
									{usage.uploads.toLocaleString()} /{" "}
									{limits.uploads.toLocaleString()}
								</p>
								<Progress value={aiPercent} className="h-1 mt-1.5" />
							</div>
							<div className="p-3 bg-muted/30 rounded-lg">
								<p className="text-xs text-muted-foreground">Profiles</p>
								<p className="text-sm font-medium">
									{usage.profiles.toLocaleString()} /{" "}
									{limits.profiles.toLocaleString()}
								</p>
								<Progress value={postsPercent} className="h-1 mt-1.5" />
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Payment Method */}
			<Card>
				<CardContent className="space-y-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-display font-semibold text-sm">
								Payment Method
							</p>
							<p className="text-xs text-muted-foreground">
								Manage your payment details
							</p>
						</div>
						<Button variant="outline" size="sm">
							Update
						</Button>
					</div>
					<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
						<div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md">
							<CreditCard className="h-4 w-4 text-white" />
						</div>
						<div className="flex-1">
							<p className="text-sm font-medium">•••• •••• •••• 4242</p>
							<p className="text-xs text-muted-foreground">Expires 12/2025</p>
						</div>
						<span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
							Default
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Billing History */}
			<Card>
				<CardContent className="space-y-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-display font-semibold text-sm">
								Billing History
							</p>
							<p className="text-xs text-muted-foreground">
								Download past invoices
							</p>
						</div>
					</div>
					<div className="text-center py-4 text-muted-foreground text-sm">
						No billing history available
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
