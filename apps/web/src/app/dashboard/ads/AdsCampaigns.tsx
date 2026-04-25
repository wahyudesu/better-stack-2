"use client";

import { useState } from "react";
import { Pause, Play, ChevronDown } from "lucide-react";
import { getCampaigns } from "@/lib/api/ads";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatNumber } from "@/lib/metrics";
import type { AdCampaign } from "@/lib/types/ads";

interface AdsCampaignsProps {
	platform: string;
	status: string;
}

export async function AdsCampaigns({ platform, status }: AdsCampaignsProps) {
	const params: Record<string, string | number> = { limit: 50 };
	if (platform !== "all") params.platform = platform;
	if (status !== "all") params.status = status;

	const campaigns = await getCampaigns(params);

	return (
		<div className="space-y-4">
			{/* Campaign count */}
			<div className="text-sm text-muted-foreground">
				{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
			</div>

			{/* Campaign list */}
			<div className="space-y-3">
				{campaigns.map((campaign) => (
					<CampaignRow key={campaign._id} campaign={campaign} />
				))}
			</div>

			{campaigns.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					No campaigns found matching your filters.
				</div>
			)}
		</div>
	);
}

function mapStatusToBadgeType(status: string): "published" | "draft" | "review" | "failed" | "scheduled" {
	switch (status) {
		case "active": return "published";
		case "paused": return "draft";
		case "pending_review": return "scheduled";
		case "rejected": return "failed";
		case "completed": return "draft";
		case "cancelled": return "draft";
		case "error": return "failed";
		default: return "draft";
	}
}

function CampaignRow({ campaign }: { campaign: AdCampaign }) {
	const [localStatus, setLocalStatus] = useState(campaign.status);

	const handleTogglePause = () => {
		setLocalStatus(localStatus === "paused" ? "active" : "paused");
	};

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-4">
					{/* Left: campaign info */}
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2 mb-1">
							<span className="font-medium truncate">{campaign.name}</span>
							<StatusBadge status={mapStatusToBadgeType(localStatus)} />
						</div>
						<div className="flex items-center gap-3 text-xs text-muted-foreground">
							<Badge variant="outline" className="text-xs capitalize">
								{campaign.platform}
							</Badge>
							<span>Objective: {campaign.objective.replace("_", " ")}</span>
							<span>
								{campaign.adCount} ad{campaign.adCount !== 1 ? "s" : ""}
							</span>
							<span>
								Budget:{" "}
								{campaign.budget
									? `${formatCurrency(campaign.budget.amount)}${campaign.budget.type === "daily" ? "/day" : " total"}`
									: "—"}
							</span>
						</div>
					</div>

					{/* Right: metrics + actions */}
					{campaign.metrics && (
						<div className="flex items-center gap-6 shrink-0">
							{/* Key metrics */}
							<div className="grid grid-cols-4 gap-4 text-center">
								<div>
									<div className="text-xs text-muted-foreground">Spend</div>
									<div className="text-sm font-medium">
										{formatCurrency(campaign.metrics.spend)}
									</div>
								</div>
								<div>
									<div className="text-xs text-muted-foreground">Impr.</div>
									<div className="text-sm font-medium">
										{formatNumber(campaign.metrics.impressions)}
									</div>
								</div>
								<div>
									<div className="text-xs text-muted-foreground">CTR</div>
									<div className="text-sm font-medium">
										{campaign.metrics.ctr.toFixed(2)}%
									</div>
								</div>
								<div>
									<div className="text-xs text-muted-foreground">ROAS</div>
									<div className="text-sm font-medium">
										{campaign.metrics.roas.toFixed(2)}x
									</div>
								</div>
							</div>

							{/* Actions */}
							<DropdownMenu>
								<DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center">
									<ChevronDown className="h-4 w-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={handleTogglePause}>
										{localStatus === "paused" ? (
											<>
												<Play className="h-4 w-4 mr-2" /> Resume
											</>
										) : (
											<>
												<Pause className="h-4 w-4 mr-2" /> Pause
											</>
										)}
									</DropdownMenuItem>
									<DropdownMenuItem>View Details</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
