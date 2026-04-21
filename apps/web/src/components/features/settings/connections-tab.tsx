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
import { useAuthStore } from "@/stores";
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
import { AlertCircle, Info, Loader2, X } from "lucide-react";
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
import type { SocialAccount } from "@/lib/client";

interface Connection {
	id: string;
	name: string;
	network: string;
	connected: boolean;
	handle: string | null;
	followers: string | null;
	posts: number | null;
	status?: "healthy" | "warning" | "error";
	tokenStatus?: "valid" | "expired" | "invalid";
	expiresAt?: string;
	permissions?: {
		canPost: boolean;
		analytics: boolean;
		required?: string[];
		analyticsPermissions?: string[];
		optional?: string[];
	};
}

const platformConfig: Record<string, { name: string; network: string }> = {
	instagram: { name: "Instagram", network: "instagram" },
	tiktok: { name: "TikTok", network: "tiktok" },
	twitter: { name: "X (Twitter)", network: "x" },
	youtube: { name: "YouTube", network: "youtube" },
	facebook: { name: "Facebook", network: "facebook" },
	linkedin: { name: "LinkedIn", network: "linkedin" },
	pinterest: { name: "Pinterest", network: "pinterest" },
	threads: { name: "Threads", network: "threads" },
	whatsapp: { name: "WhatsApp", network: "whatsapp" },
	reddit: { name: "Reddit", network: "reddit" },
	googlebusiness: { name: "Google Business", network: "google" },
	telegram: { name: "Telegram", network: "telegram" },
	snapchat: { name: "Snapchat", network: "snapchat" },
	discord: { name: "Discord", network: "discord" },
	bluesky: { name: "Bluesky", network: "bluesky" },
};

const availablePlatforms = Object.keys(platformConfig);

export function ConnectionsTab() {
	const profileId = useCurrentProfileId();
	const apiKey = useAuthStore((s) => s.apiKey);

	const {
		data: accountsData,
		isLoading: accountsLoading,
		error: accountsError,
	} = useAccounts();
	const { data: healthData } = useAccountsHealth();
	const connectAccount = useConnectAccount();
	const deleteAccount = useDeleteAccount();

	const [dialog, setDialog] = useState<{
		open: boolean;
		id: string;
		name: string;
	}>({ open: false, id: "", name: "" });
	const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
		null,
	);

	// Convert Zernio accounts to Connection format
	const connectedAccounts: Connection[] =
		accountsData?.accounts?.map((account: SocialAccount) => {
			const health = healthData?.find((h: any) => h.accountId === account._id);
			return {
				id: account.platform,
				name: platformConfig[account.platform]?.name || account.platform,
				network: platformConfig[account.platform]?.network || account.platform,
				connected: true,
				handle: account.username || null,
				followers: null, // Zernio doesn't return followers in accounts list
				posts: null,
				status: health?.isHealthy !== false ? "healthy" : "error",
				tokenStatus: "valid",
			};
		}) || [];

	// Available platforms not yet connected
	const connectedPlatforms = new Set(connectedAccounts.map((c) => c.id));
	const availableConnections: Connection[] = availablePlatforms
		.filter((p) => !connectedPlatforms.has(p))
		.map((platform) => ({
			id: platform,
			name: platformConfig[platform]?.name || platform,
			network: platformConfig[platform]?.network || platform,
			connected: false,
			handle: null,
			followers: null,
			posts: null,
		}));

	const handleConnect = async (platform: string) => {
		setConnectingPlatform(platform);
		try {
			const result = await connectAccount.mutateAsync({ platform });
			if (result?.url) {
				// Redirect to OAuth URL
				window.location.href = result.url;
			}
		} catch (error) {
			console.error("Failed to connect:", error);
		} finally {
			setConnectingPlatform(null);
		}
	};

	const handleDisconnect = async () => {
		if (!dialog.id) return;
		try {
			await deleteAccount.mutateAsync(dialog.id);
		} catch (error) {
			console.error("Failed to disconnect:", error);
		}
		setDialog({ open: false, id: "", name: "" });
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
								key={c.id}
								className="group relative flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm"
							>
								<div className="flex items-center gap-3">
									<div className="relative shrink-0">
										<div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
											<img
												src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${c.id}`}
												alt={c.handle ?? c.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white shadow-sm">
											<SocialIcon
												network={c.network}
												style={{ height: 14, width: 14 }}
											/>
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold truncate">
											{c.handle || c.name}
										</p>
									</div>
									<Popover>
										<PopoverTrigger className="rounded-full p-1 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
											<Info className="size-3.5 text-muted-foreground" />
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
														Account Health
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
											</div>
										</PopoverContent>
									</Popover>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-left">
										<p className="text-sm font-semibold">
											{c.followers || "—"}
										</p>
										<p className="text-xs text-muted-foreground">
											{c.posts ? `${c.posts} posts` : "No posts yet"}
										</p>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											setDialog({ open: true, id: c.id, name: c.name })
										}
										className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<X className="size-3 mr-1" />
										Disconnect
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Available Platforms */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<p className="font-display font-semibold text-sm">Available</p>
					<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
						{availableConnections.length}
					</span>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{availableConnections.map((c) => (
						<div
							key={c.id}
							className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 shadow-sm text-center"
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

			{/* Disconnect Dialog */}
			<AlertDialog
				open={dialog.open}
				onOpenChange={(open) =>
					!open && setDialog({ open: false, id: "", name: "" })
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
