/**
 * Connections/Integrations Settings Tab Component.
 */

"use client";

import { useState } from "react";
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
import { IntegrationCard } from "@/components/ui/IntegrationCard";
import type { Platform } from "@/components/ui/PlatformIcon";

interface Connection {
	id: string;
	name: string;
	platform: Platform;
	connected: boolean;
	handle: string | null;
	followers: string | null;
	posts: number | null;
	color: string;
}

const initialConnections: Connection[] = [
	{
		id: "instagram",
		name: "Instagram",
		platform: "instagram" as Platform,
		connected: true,
		handle: "@acme.studio",
		followers: "48.2K",
		posts: 342,
		color: "bg-pink-500/10",
	},
	{
		id: "tiktok",
		name: "TikTok",
		platform: "tiktok" as Platform,
		connected: true,
		handle: "@acmestudio",
		followers: "125.8K",
		posts: 89,
		color: "bg-gray-900/10",
	},
	{
		id: "whatsapp",
		name: "WhatsApp",
		platform: "whatsapp" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-green-500/10",
	},
	{
		id: "facebook",
		name: "Facebook",
		platform: "facebook" as Platform,
		connected: true,
		handle: "Acme Corp",
		followers: "23.4K",
		posts: 156,
		color: "bg-blue-600/10",
	},
	{
		id: "youtube",
		name: "YouTube",
		platform: "youtube" as Platform,
		connected: true,
		handle: "Acme Studio",
		followers: "72.1K",
		posts: 128,
		color: "bg-red-600/10",
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		platform: "linkedin" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-blue-700/10",
	},
	{
		id: "twitter",
		name: "X (Twitter)",
		platform: "twitter" as Platform,
		connected: true,
		handle: "@AcmeStudio",
		followers: "31.4K",
		posts: 1204,
		color: "bg-black/10",
	},
	{
		id: "threads",
		name: "Threads",
		platform: "threads" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-black/10",
	},
	{
		id: "reddit",
		name: "Reddit",
		platform: "reddit" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-orange-600/10",
	},
	{
		id: "pinterest",
		name: "Pinterest",
		platform: "pinterest" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-red-700/10",
	},
	{
		id: "bluesky",
		name: "Bluesky",
		platform: "bluesky" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-blue-400/10",
	},
	{
		id: "google",
		name: "Google Business",
		platform: "google" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-blue-500/10",
	},
	{
		id: "telegram",
		name: "Telegram",
		platform: "telegram" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-blue-500/10",
	},
	{
		id: "snapchat",
		name: "Snapchat",
		platform: "snapchat" as Platform,
		connected: false,
		handle: null,
		followers: null,
		posts: null,
		color: "bg-yellow-400/10",
	},
];

export function ConnectionsTab() {
	const [connections, setConnections] = useState<Connection[]>(initialConnections);
	const [disconnectDialog, setDisconnectDialog] = useState<{
		open: boolean;
		platformId: string;
		platformName: string;
	}>({
		open: false,
		platformId: "",
		platformName: "",
	});

	const connectedPlatforms = connections.filter((c) => c.connected);
	const availablePlatforms = connections.filter((c) => !c.connected);

	const toggleConnection = (id: string) => {
		setConnections((prev) =>
			prev.map((conn) => {
				if (conn.id === id) {
					if (conn.connected) {
						const platform = connections.find((c) => c.id === id);
						setDisconnectDialog({
							open: true,
							platformId: id,
							platformName: platform?.name || "",
						});
						return conn;
					} else {
						return {
							...conn,
							connected: true,
							handle: `@${conn.name.toLowerCase()}`,
							followers: `${Math.floor(Math.random() * 100 + 10)}K`,
							posts: Math.floor(Math.random() * 500 + 50),
						};
					}
				}
				return conn;
			}),
		);
	};

	const confirmDisconnect = () => {
		setConnections((prev) =>
			prev.map((conn) => {
				if (conn.id === disconnectDialog.platformId) {
					return {
						...conn,
						connected: false,
						handle: null,
						followers: null,
						posts: null,
					};
				}
				return conn;
			}),
		);
		setDisconnectDialog({ open: false, platformId: "", platformName: "" });
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Connected Platforms */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<p className="font-display font-semibold text-sm">Connected</p>
					<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
						{connectedPlatforms.length}
					</span>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{connectedPlatforms.map((conn) => (
						<IntegrationCard
							key={conn.id}
							{...conn}
							onToggle={toggleConnection}
						/>
					))}
				</div>
			</div>

			{/* Available Platforms */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<p className="font-display font-semibold text-sm">Available</p>
					<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
						{availablePlatforms.length}
					</span>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{availablePlatforms.map((conn) => (
						<IntegrationCard
							key={conn.id}
							{...conn}
							onToggle={toggleConnection}
						/>
					))}
				</div>
			</div>

			<AlertDialog
				open={disconnectDialog.open}
				onOpenChange={(open) =>
					setDisconnectDialog({ ...disconnectDialog, open })
				}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Disconnect {disconnectDialog.platformName}?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to disconnect your{" "}
							{disconnectDialog.platformName} account? This will stop posting to
							this platform.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDisconnect}
							className="bg-destructive hover:bg-destructive/90"
						>
							Disconnect
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
