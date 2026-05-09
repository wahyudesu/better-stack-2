/**
 * Settings Page.
 * Main settings page with tab navigation.
 * Tab state persisted in URL query param.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
	AccountTab,
	BillingTab,
	ConnectionsTab,
	SettingsLayout,
	type TabId,
	TeamsTab,
	WebhooksTab,
} from "@/components/features/settings";

const VALID_TABS: TabId[] = [
	"account",
	"connections",
	"billing",
	"teams",
	"webhooks",
];

function SettingsContent() {
	const searchParams = useSearchParams() ?? new URLSearchParams();
	const router = useRouter();

	// Initialize tab from URL or default to "account"
	const [activeTab, setActiveTabState] = useState<TabId>(() => {
		const tab = searchParams.get("tab");
		return VALID_TABS.includes(tab as TabId) ? (tab as TabId) : "account";
	});

	const setActiveTab = useCallback(
		(tab: TabId) => {
			setActiveTabState(tab);
			// Update URL without adding to history
			const url = new URL(window.location.href);
			url.searchParams.set("tab", tab);
			router.replace(`${url.pathname}?${url.searchParams.toString()}`);
		},
		[router],
	);

	// Sync tab from URL if it changes externally (e.g., back/forward navigation)
	useEffect(() => {
		const tab = searchParams.get("tab");
		if (tab && VALID_TABS.includes(tab as TabId) && tab !== activeTab) {
			setActiveTabState(tab as TabId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, activeTab]);

	return (
		<SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
			{activeTab === "account" && <AccountTab />}
			{activeTab === "connections" && <ConnectionsTab />}
			{activeTab === "billing" && <BillingTab />}
			{activeTab === "teams" && <TeamsTab />}
			{activeTab === "webhooks" && <WebhooksTab />}
		</SettingsLayout>
	);
}

export default function SettingsPage() {
	return (
		<Suspense
			fallback={<div className="p-8 text-center">Loading settings...</div>}
		>
			<SettingsContent />
		</Suspense>
	);
}
