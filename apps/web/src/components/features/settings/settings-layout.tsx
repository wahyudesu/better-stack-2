/**
 * Settings Layout Component.
 * Provides tab navigation and content switching for the settings page.
 */

"use client";

import {
	CreditCard,
	type LucideIcon,
	Puzzle,
	Settings,
	Shield,
	User,
	Users,
} from "lucide-react";
import { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import type { TabId } from "./types";

export interface SettingsTab {
	id: TabId;
	label: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

export const settingsTabs: SettingsTab[] = [
	{
		id: "account",
		label: "Account",
		icon: User,
		title: "Account",
		description: "Manage your personal information",
	},
	{
		id: "connections",
		label: "Connections",
		icon: Puzzle,
		title: "Connections",
		description: "Manage your social media connections",
	},
	{
		id: "team",
		label: "Team",
		icon: Users,
		title: "Team Members",
		description: "Manage your team and permissions",
	},
	{
		id: "billing",
		label: "Billing",
		icon: CreditCard,
		title: "Billing",
		description: "Manage your subscription and payments",
	},
	{
		id: "preferences",
		label: "Preferences",
		icon: Settings,
		title: "Preferences",
		description: "Customize your app experience",
	},
	{
		id: "security",
		label: "Security",
		icon: Shield,
		title: "Security",
		description: "Manage your security settings",
	},
] as const;

export interface SettingsLayoutProps {
	activeTab: TabId;
	onTabChange: (tabId: TabId) => void;
	children: React.ReactNode;
}

export function SettingsLayout({
	activeTab,
	onTabChange,
	children,
}: SettingsLayoutProps) {
	const activeTabData = settingsTabs.find((tab) => tab.id === activeTab);

	return (
		<div className="mx-auto w-full max-w-[1024px] px-5 py-4 pb-24 space-y-6">
			<div className="text-center">
				<h1 className="font-display text-xl font-bold tracking-tight">
					{activeTabData?.title || "Settings"}
				</h1>
				<p className="text-xs text-muted-foreground">
					{activeTabData?.description || "Manage your settings"}
				</p>
			</div>

			<div className="flex gap-6">
				<nav className="w-[130px] shrink-0 space-y-0.5">
					{settingsTabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={cn(
								"flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
								activeTab === tab.id
									? "bg-muted font-semibold text-foreground"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
							)}
						>
							<tab.icon className="h-4 w-4" />
							{tab.label}
						</button>
					))}
				</nav>

				<div className="flex-1 min-w-0">
					<Suspense fallback={<SettingsTabSkeleton />}>{children}</Suspense>
				</div>
			</div>
		</div>
	);
}

function SettingsTabSkeleton() {
	return (
		<div className="space-y-4 animate-pulse">
			<div className="h-32 bg-muted/30 rounded-lg" />
			<div className="h-32 bg-muted/30 rounded-lg" />
		</div>
	);
}
