"use client";

import { useState } from "react";
import { Briefcase, Megaphone, Users, LayoutDashboard } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
import { AdsOverview } from "./AdsOverview";
import { AdsCampaigns } from "./AdsCampaigns";
import { AdsList } from "./AdsList";
import { AdsAudiences } from "./AdsAudiences";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";

const tabs = [
	{ id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
	{ id: "campaigns", label: "Campaigns", icon: <Briefcase className="h-5 w-5" /> },
	{ id: "ads", label: "Ads", icon: <Megaphone className="h-5 w-5" /> },
	{ id: "audiences", label: "Audiences", icon: <Users className="h-5 w-5" /> },
];

const platformOptions = [
	{ value: "all", label: "All Platforms" },
	{ value: "facebook", label: "Facebook" },
	{ value: "instagram", label: "Instagram" },
	{ value: "google", label: "Google" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "pinterest", label: "Pinterest" },
	{ value: "twitter", label: "X (Twitter)" },
];

const statusOptions = [
	{ value: "all", label: "All Status" },
	{ value: "active", label: "Active" },
	{ value: "paused", label: "Paused" },
	{ value: "pending_review", label: "Pending Review" },
	{ value: "rejected", label: "Rejected" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
	{ value: "error", label: "Error" },
];

export function AdsContent() {
	const [activeTab, setActiveTab] = useState("overview");
	const [platformFilter, setPlatformFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			{/* Header */}
			<div className="mb-4">
				<h1 className="font-display text-2xl font-bold tracking-tight">Ads</h1>
				<p className="text-sm text-muted-foreground">
					Manage your ad campaigns and performance
				</p>
			</div>

			{/* Tabs */}
			<AnimatedTabs
				tabs={tabs}
				activeTab={activeTab}
				onChange={setActiveTab}
				variant="underline"
				className="mb-6"
			/>

			{/* Filter bar — shown on Campaigns, Ads tabs */}
			{(activeTab === "campaigns" || activeTab === "ads") && (
				<div className="flex items-center gap-2 mb-4">
					<DepthButtonMenu
						value={platformFilter}
						onChange={(v) => setPlatformFilter(v ?? "all")}
						options={platformOptions}
						placeholder="Platform"
						size="default"
					/>
					<DepthButtonMenu
						value={statusFilter}
						onChange={(v) => setStatusFilter(v ?? "all")}
						options={statusOptions}
						placeholder="Status"
						size="default"
					/>
				</div>
			)}

			{/* Tab content */}
			{activeTab === "overview" && <AdsOverview />}
			{activeTab === "campaigns" && (
				<AdsCampaigns platform={platformFilter} status={statusFilter} />
			)}
			{activeTab === "ads" && (
				<AdsList platform={platformFilter} status={statusFilter} />
			)}
			{activeTab === "audiences" && <AdsAudiences />}
		</div>
	);
}
