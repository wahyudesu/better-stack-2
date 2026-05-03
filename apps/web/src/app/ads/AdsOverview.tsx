"use client";

import { TrendingUp } from "lucide-react";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdAccounts, getAds, getCampaigns } from "@/lib/api/ads";
import { formatCurrency, formatNumber } from "@/lib/metrics";

export function AdsOverview() {
	return (
		<Suspense
			fallback={
				<div className="space-y-6">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{[...Array(6)].map((_, i) => (
							<Card key={i}>
								<CardContent className="py-4">
									<div className="h-3 w-16 animate-pulse bg-muted rounded mb-2" />
									<div className="h-8 w-20 animate-pulse bg-muted rounded" />
								</CardContent>
							</Card>
						))}
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Platform Breakdown</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{[...Array(3)].map((_, i) => (
										<div key={i} className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="h-5 w-12 animate-pulse bg-muted rounded" />
												<div className="h-4 w-24 animate-pulse bg-muted rounded" />
											</div>
											<div className="h-4 w-20 animate-pulse bg-muted rounded" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Recent Campaigns</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{[...Array(5)].map((_, i) => (
										<div key={i} className="flex items-center justify-between">
											<div className="flex items-center gap-2 min-w-0">
												<div className="h-5 w-12 animate-pulse bg-muted rounded" />
												<div className="h-4 w-32 animate-pulse bg-muted rounded" />
											</div>
											<div className="flex items-center gap-3 shrink-0">
												<div className="h-5 w-16 animate-pulse bg-muted rounded" />
												<div className="h-4 w-12 animate-pulse bg-muted rounded" />
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			}
		>
			<AdsOverviewContent />
		</Suspense>
	);
}

async function AdsOverviewContent() {
	const [accounts, campaigns, ads] = await Promise.all([
		getAdAccounts(),
		getCampaigns({ limit: 5 }),
		getAds({ limit: 10 }),
	]);

	// Aggregate metrics
	const totalSpend = campaigns.reduce(
		(sum, c) => sum + (c.metrics?.spend ?? 0),
		0,
	);
	const totalImpressions = campaigns.reduce(
		(sum, c) => sum + (c.metrics?.impressions ?? 0),
		0,
	);
	const totalClicks = campaigns.reduce(
		(sum, c) => sum + (c.metrics?.clicks ?? 0),
		0,
	);
	const totalConversions = campaigns.reduce(
		(sum, c) => sum + (c.metrics?.conversions ?? 0),
		0,
	);

	const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
	const activeAds = ads.filter((a) => a.status === "active").length;

	return (
		<div className="space-y-6">
			{/* Stat cards */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
				<StatCard
					label="Total Spend"
					value={formatCurrency(totalSpend)}
					change="+12.4%"
				/>
				<StatCard
					label="Impressions"
					value={formatNumber(totalImpressions)}
					change="+8.2%"
				/>
				<StatCard
					label="Clicks"
					value={formatNumber(totalClicks)}
					change="+5.1%"
				/>
				<StatCard
					label="Conversions"
					value={formatNumber(totalConversions)}
					change="+18.7%"
				/>
				<StatCard
					label="Active Campaigns"
					value={`${activeCampaigns}/${campaigns.length}`}
				/>
				<StatCard label="Active Ads" value={`${activeAds}/${ads.length}`} />
			</div>

			{/* Platform breakdown + Recent campaigns */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Platform breakdown */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Platform Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{accounts.map((acc) => (
								<div
									key={acc._id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className="text-xs capitalize">
											{acc.platform}
										</Badge>
										<span className="text-sm">{acc.name}</span>
									</div>
									<span className="text-sm font-medium">
										{acc.dailyBudget
											? `${formatCurrency(acc.dailyBudget)}/day`
											: acc.lifetimeBudget
												? `${formatCurrency(acc.lifetimeBudget)} total`
												: "No budget"}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Recent campaigns */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Recent Campaigns</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{campaigns.slice(0, 5).map((camp) => (
								<div
									key={camp._id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-2 min-w-0">
										<Badge variant="outline" className="text-xs capitalize">
											{camp.platform}
										</Badge>
										<span className="text-sm truncate">{camp.name}</span>
									</div>
									<div className="flex items-center gap-3 shrink-0">
										<StatusBadge
											status={
												camp.status === "active"
													? "published"
													: camp.status === "paused"
														? "draft"
														: ("review" as any)
											}
										/>
										<span className="text-sm font-medium">
											{camp.metrics ? formatCurrency(camp.metrics.spend) : "—"}
										</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	change,
}: {
	label: string;
	value: string;
	change?: string;
}) {
	return (
		<Card className="py-4">
			<CardHeader className="pb-1">
				<CardTitle className="text-xs font-medium text-muted-foreground">
					{label}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="text-2xl font-bold">{value}</div>
				{change && (
					<div className="flex items-center gap-1 text-xs mt-1 text-green-600">
						<TrendingUp className="h-3 w-3" />
						{change}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
