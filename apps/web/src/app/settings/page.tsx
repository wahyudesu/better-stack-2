/**
 * Settings Page.
 * Main settings page with tab navigation.
 * Tab components are extracted to components/features/settings/
 */

"use client";

import { useState } from "react";
import {
	AccountTab,
	BillingTab,
	ConnectionsTab,
	PreferencesTab,
	SettingsLayout,
	type TabId,
} from "@/components/features/settings";

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<TabId>("account");

	return (
		<SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
			{activeTab === "account" && <AccountTab />}
			{activeTab === "connections" && <ConnectionsTab />}
			{activeTab === "billing" && <BillingTab />}
			{activeTab === "preferences" && <PreferencesTab />}
		</SettingsLayout>
	);
}
