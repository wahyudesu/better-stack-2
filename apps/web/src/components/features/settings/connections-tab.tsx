/**
 * Connections/Integrations Settings Tab Component.
 * Shows connected social accounts and allows connecting new ones.
 */

"use client";

import { useState } from "react";
import { SocialIcon } from "react-social-icons/component";
import {
	useAccounts,
	useAccountsHealth,
	useConnectAccount,
	useDeleteAccount,
} from "@/hooks/use-accounts";
import { useCurrentProfileId } from "@/hooks/use-profiles";
import { useUserApiKey } from "@/hooks/use-user-api-key";
import "react-social-icons/instagram";
import "react-social-icons/tiktok";
import "react-social-icons/x";
import "react-social-icons/youtube";
import "react-social-icons/facebook";
import "react-social-icons/linkedin";
import "react-social-icons/pinterest";
import "react-social-icons/threads";
import "react-social-icons/whatsapp";
import "react-social-icons/reddit";
import "react-social-icons/google";
import "react-social-icons/telegram";
import "react-social-icons/snapchat";
import "react-social-icons/discord";
import "react-social-icons/bsky.app";
import { AlertCircle, Loader2, LogOut, Settings2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import type { SocialAccount } from "@/lib/client";

interface Connection {
	id: string;
	name: string;
	network: string;
	connected: boolean;
	handle: string | null;
	followers: string | null;
	status?: "healthy" | "warning" | "error";
	tokenStatus?: "valid" | "expired" | "invalid";
	expiresAt?: string;
	accountId?: string;
	profilePicture?: string;
	isOrganization?: boolean;
	permissions?: {
		canPost: boolean;
		analytics: boolean;
		required?: string[];
		analyticsPermissions?: string[];
		optional?: string[];
	};
}

// Platform categories
const platformCategories = {
	social: {
		name: "Social",
		platforms: [
			{ id: "instagram", name: "Instagram", network: "instagram" },
			{ id: "tiktok", name: "TikTok", network: "tiktok" },
			{ id: "facebook", name: "Facebook", network: "facebook" },
			{ id: "youtube", name: "YouTube", network: "youtube" },
			{ id: "linkedin", name: "LinkedIn", network: "linkedin" },
			{ id: "twitter", name: "X (Twitter)", network: "x" },
			{ id: "threads", name: "Threads", network: "threads" },
			{ id: "bluesky", name: "Bluesky", network: "bsky.app" },
			{ id: "pinterest", name: "Pinterest", network: "pinterest" },
			{ id: "reddit", name: "Reddit", network: "reddit" },
			{ id: "googlebusiness", name: "Google Business", network: "google" },
			{ id: "snapchat", name: "Snapchat", network: "snapchat" },
		],
	},
	communication: {
		name: "Communication",
		platforms: [
			{ id: "telegram", name: "Telegram", network: "telegram" },
			{ id: "discord", name: "Discord", network: "discord" },
			{ id: "whatsapp", name: "WhatsApp", network: "whatsapp" },
		],
	},
	ads: {
		name: "Ads",
		platforms: [
			{ id: "meta-ads", name: "Meta Ads", network: "facebook" },
			{ id: "linkedin-ads", name: "LinkedIn Ads", network: "linkedin" },
			{ id: "pinterest-ads", name: "Pinterest Ads", network: "pinterest" },
			{ id: "tiktok-ads", name: "TikTok Ads", network: "tiktok" },
			{ id: "google-ads", name: "Google Ads", network: "google" },
			{ id: "x-ads", name: "X Ads", network: "x" },
		],
	},
};

const allPlatformConfigs = [
	...platformCategories.social.platforms,
	...platformCategories.communication.platforms,
	...platformCategories.ads.platforms,
];

const getPlatformConfig = (platform: string) => {
	return allPlatformConfigs.find(
		(p) => p.id === platform || p.network === platform,
	);
};

export function ConnectionsTab() {
	const profileId = useCurrentProfileId();
	const { apiKey } = useUserApiKey();

	const {
		data: accountsData,
		isLoading: accountsLoading,
		error: accountsError,
	} = useAccounts();
	const { data: healthData } = useAccountsHealth();
	// Note: healthData always null - getAccountHealth is per-account, no bulk endpoint
	// Map stays empty, all accounts default to "healthy" status
	const _healthMap: Record<string, any> = {};
	const connectAccount = useConnectAccount();
	const deleteAccount = useDeleteAccount();

	const [dialog, setDialog] = useState<{
		open: boolean;
		id: string;
		name: string;
		accountId?: string;
	}>({ open: false, id: "", name: "" });
	const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
		null,
	);
	const [linkedinOrganization, setLinkedinOrganization] = useState<
		Record<string, boolean>
	>({});

	// Convert Zernio accounts to Connection format
	const connectedAccounts: Connection[] =
		accountsData?.accounts?.map((account: SocialAccount) => {
			const health = _healthMap[account._id];
			return {
				id: account.platform,
				name: getPlatformConfig(account.platform)?.name || account.platform,
				network:
					getPlatformConfig(account.platform)?.network || account.platform,
				connected: true,
				handle: account.username || account.displayName || null,
				followers: null,
				status: (health as any)?.isHealthy !== false ? "healthy" : "error",
				tokenStatus: "valid",
				accountId: account._id,
				profilePicture: account.profilePicture,
				isOrganization: linkedinOrganization[account._id] ?? false,
			};
		}) || [];

	// Available platforms not yet connected (grouped by category)
	const connectedPlatforms = new Set(connectedAccounts.map((c) => c.id));

	const getAvailableConnections = () => {
		const result: Record<string, Connection[]> = {};
		for (const [categoryKey, category] of Object.entries(platformCategories)) {
			result[categoryKey] = category.platforms
				.filter((p) => !connectedPlatforms.has(p.id))
				.map((platform) => ({
					id: platform.id,
					name: platform.name,
					network: platform.network,
					connected: false,
					handle: null,
					followers: null,
				}));
		}
		return result;
	};

	const availableConnections = getAvailableConnections();

	const handleConnect = async (platform: string) => {
		setConnectingPlatform(platform);
		try {
			const result = await connectAccount.mutateAsync({ platform });
			if (result?.authUrl) {
				window.location.href = result.authUrl;
			}
		} catch (error) {
			console.error("Failed to connect:", error);
		} finally {
			setConnectingPlatform(null);
		}
	};

	const handleDisconnect = async () => {
		if (!dialog.accountId) return;
		try {
			await deleteAccount.mutateAsync(dialog.accountId);
		} catch (error) {
			console.error("Failed to disconnect:", error);
		}
		setDialog({ open: false, id: "", name: "", accountId: undefined });
	};

	const toggleLinkedinOrganization = (accountId: string, value: boolean) => {
		setLinkedinOrganization((prev) => ({ ...prev, [accountId]: value }));
	};

	// Not authenticated
	if (!apiKey) {
		return (
			<div className="flex flex-col gap-6">
				<Card>
					<CardContent className="text-center">
						<AlertCircle className="size-8 mx-auto mb-3 text-muted-foreground" />
						<p className="text-sm font-medium">API Key Not Connected</p>
						<p className="text-xs text-muted-foreground mt-1">
							Connect your API key in Settings &gt; Security to view accounts
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Loading
	if (accountsLoading) {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="size-6 animate-spin text-muted-foreground" />
				</div>
			</div>
		);
	}

	// Error
	if (accountsError) {
		return (
			<div className="flex flex-col gap-6">
				<Card>
					<CardContent className="text-center">
						<AlertCircle className="size-8 mx-auto mb-3 text-destructive" />
						<p className="text-sm font-medium text-destructive">
							Failed to load accounts
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{accountsError.message}
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Connected Accounts */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<p className="font-display font-semibold text-sm">Connected</p>
					<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
						{connectedAccounts.length}
					</span>
				</div>
				{connectedAccounts.length === 0 ? (
					<Card>
						<CardContent className="text-center">
							<p className="text-sm text-muted-foreground">
								No accounts connected yet. Connect a platform below to get
								started.
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{connectedAccounts.map((c) => (
							<div
								key={c.accountId}
								className="group relative flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm"
							>
								<div className="flex items-center gap-3">
									<div className="relative shrink-0">
										<div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
											{c.profilePicture ? (
												<img
													src={c.profilePicture}
													alt={c.handle ?? c.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<SocialIcon
													network={c.network}
													style={{ height: 32, width: 32 }}
												/>
											)}
										</div>
										<div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-card shadow-sm p-0.5">
											<SocialIcon
												network={c.network}
												style={{ height: 12, width: 12 }}
											/>
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold truncate">
											{c.handle || c.name}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{c.network}
										</p>
									</div>
									<Popover>
										<PopoverTrigger className="rounded-full p-1.5 hover:bg-muted transition-colors cursor-pointer">
											<Settings2 className="size-4 text-muted-foreground" />
										</PopoverTrigger>
										<PopoverContent
											sideOffset={8}
											className="w-72 p-0 overflow-hidden"
										>
											<div className="bg-muted/50 px-3 py-2 border-b">
												<div className="flex items-center gap-2">
													<SocialIcon
														network={c.network}
														style={{ height: 16, width: 16 }}
													/>
													<span className="text-xs font-semibold">
														Account Settings
													</span>
												</div>
												<p className="text-xs text-muted-foreground mt-0.5">
													{c.handle} · {c.network}
												</p>
											</div>
											<div className="p-3 space-y-3">
												<div className="flex items-center justify-between">
													<span className="text-xs text-muted-foreground">
														Status
													</span>
													<span
														className={`text-xs font-medium ${c.status === "healthy" ? "text-green-600" : c.status === "warning" ? "text-yellow-600" : "text-red-600"}`}
													>
														{c.status ?? "unknown"}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-xs text-muted-foreground">
														Token Status
													</span>
													<div className="flex items-center gap-1">
														<span
															className={`size-1.5 rounded-full ${c.tokenStatus === "valid" ? "bg-green-500" : "bg-red-500"}`}
														/>
														<span className="text-xs font-medium">
															{c.tokenStatus === "valid" ? "Valid" : "Invalid"}
														</span>
													</div>
												</div>
												{c.id === "linkedin" && c.accountId && (
													<div className="flex items-center justify-between pt-2 border-t">
														<span className="text-xs text-muted-foreground">
															Post as Organization
														</span>
														<Switch
															checked={c.isOrganization}
															onCheckedChange={(v) =>
																toggleLinkedinOrganization(
																	c.accountId!,
																	v ?? false,
																)
															}
														/>
													</div>
												)}
											</div>
										</PopoverContent>
									</Popover>
								</div>
								<div className="flex items-center justify-end">
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											setDialog({
												open: true,
												id: c.id,
												name: c.name,
												accountId: c.accountId,
											})
										}
										className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
									>
										<LogOut className="size-3.5 mr-1" />
										Disconnect
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Available Platforms by Category */}
			{Object.entries(platformCategories).map(([categoryKey, category]) => {
				const platforms = availableConnections[categoryKey] || [];
				if (platforms.length === 0) return null;

				return (
					<div key={categoryKey} className="space-y-3">
						<div className="flex items-center gap-2">
							<p className="font-display font-semibold text-sm">
								{category.name}
							</p>
							<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
								{platforms.length}
							</span>
						</div>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{platforms.map((c) => (
								<div
									key={c.id}
									className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 shadow-sm text-center"
								>
									<SocialIcon
										network={c.network}
										style={{ height: 28, width: 28 }}
									/>
									<p className="text-sm font-semibold">{c.name}</p>
									<div className="flex flex-col gap-1 w-full">
										<Button
											variant="default"
											size="sm"
											onClick={() => handleConnect(c.id)}
											disabled={connectingPlatform !== null || !profileId}
											className="w-full rounded-lg"
										>
											{connectingPlatform === c.id ? (
												<Loader2 className="size-4 animate-spin" />
											) : (
												"Connect"
											)}
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				);
			})}

			{/* Disconnect Dialog */}
			<AlertDialog
				open={dialog.open}
				onOpenChange={(open) =>
					!open &&
					setDialog({ open: false, id: "", name: "", accountId: undefined })
				}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Disconnect {dialog.name}?</AlertDialogTitle>
						<AlertDialogDescription>
							This will stop posting to this platform. You can reconnect later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDisconnect}
							className="bg-destructive hover:bg-destructive/90"
							disabled={deleteAccount.isPending}
						>
							{deleteAccount.isPending ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								"Disconnect"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
