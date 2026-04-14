/**
 * Connections/Integrations Settings Tab Component.
 */

"use client";

import { useState } from "react";
import { SocialIcon } from "react-social-icons/component";
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
import { Info, X } from "lucide-react";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

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

const connections: Connection[] = [
	{
		id: "instagram",
		name: "Instagram",
		network: "instagram",
		connected: true,
		handle: "@acme.studio",
		followers: "48.2K",
		posts: 342,
		status: "healthy",
		tokenStatus: "valid",
		expiresAt: "5/13/2026",
		permissions: {
			canPost: true,
			analytics: true,
			required: ["instagram_basic", "instagram_content_publish"],
			analyticsPermissions: ["instagram_manage_insights"],
			optional: ["instagram_read_replies", "instagram_manage_replies"],
		},
	},
	{
		id: "tiktok",
		name: "TikTok",
		network: "tiktok",
		connected: true,
		handle: "@acmestudio",
		followers: "125.8K",
		posts: 89,
		status: "healthy",
		tokenStatus: "valid",
		expiresAt: "5/13/2026",
		permissions: { canPost: true, analytics: true },
	},
	{
		id: "whatsapp",
		name: "WhatsApp",
		network: "whatsapp",
		connected: false,
		handle: null,
		followers: null,
		posts: null,
	},
	{
		id: "facebook",
		name: "Facebook",
		network: "facebook",
		connected: true,
		handle: "Acme Corp",
		followers: "23.4K",
		posts: 156,
		status: "warning",
		tokenStatus: "valid",
		expiresAt: "4/20/2026",
		permissions: { canPost: true, analytics: false },
	},
	{
		id: "youtube",
		name: "YouTube",
		network: "youtube",
		connected: true,
		handle: "Acme Studio",
		followers: "72.1K",
		posts: 128,
		status: "healthy",
		tokenStatus: "valid",
		expiresAt: "5/13/2026",
		permissions: { canPost: true, analytics: true },
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		network: "linkedin",
		connected: false,
		handle: null,
		followers: null,
		posts: null,
	},
	{
		id: "twitter",
		name: "X (Twitter)",
		network: "x",
		connected: true,
		handle: "@AcmeStudio",
		followers: "31.4K",
		posts: 1204,
		status: "healthy",
		tokenStatus: "valid",
		expiresAt: "5/13/2026",
		permissions: { canPost: true, analytics: true },
	},
	{
		id: "threads",
		name: "Threads",
		network: "threads",
		connected: false,
		handle: null,
		followers: null,
		posts: null,
	},
	{
		id: "reddit",
		name: "Reddit",
		network: "reddit",
		connected: false,
		handle: null,
		followers: null,
		posts: null,
	},
	{
		id: "pinterest",
		name: "Pinterest",
		network: "pinterest",
		connected: false,
		handle: null,
		followers: null,
		posts: null,
	},
	{
		id: "google",
		name: "Google Business",
		network: "google",
		connected: false,
		handle: null,
		followers: null,
		posts: null,
	},
	{
		id: "telegram",
		name: "Telegram",
		network: "telegram",
		connected: false,
		handle: null,
		followers: null,
		posts: null,
	},
	{
		id: "snapchat",
		name: "Snapchat",
		network: "snapchat",
		connected: false,
		handle: null,
		followers: null,
		posts: null,
	},
];

export function ConnectionsTab() {
	const [data, setData] = useState(connections);
	const [dialog, setDialog] = useState<{
		open: boolean;
		id: string;
		name: string;
	}>({ open: false, id: "", name: "" });

	const connected = data.filter((c) => c.connected);
	const available = data.filter((c) => !c.connected);

	const toggle = (id: string) => {
		setData((prev) =>
			prev.map((c) => {
				if (c.id !== id) return c;
				if (c.connected) {
					setDialog({ open: true, id, name: c.name });
					return c;
				}
				return {
					...c,
					connected: true,
					handle: `@${c.name.toLowerCase()}`,
					followers: `${Math.floor(Math.random() * 100 + 10)}K`,
					posts: Math.floor(Math.random() * 500 + 50),
				};
			}),
		);
	};

	const confirmDisconnect = () => {
		setData((prev) =>
			prev.map((c) =>
				c.id === dialog.id
					? {
							...c,
							connected: false,
							handle: null,
							followers: null,
							posts: null,
						}
					: c,
			),
		);
		setDialog({ open: false, id: "", name: "" });
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<p className="font-display font-semibold text-sm">Connected</p>
					<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
						{connected.length}
					</span>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{connected.map((c) => (
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
									<p className="text-sm font-semibold truncate">{c.handle}</p>
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
											{c.expiresAt && (
												<div className="flex items-center justify-between">
													<span className="text-xs text-muted-foreground">
														Expires at
													</span>
													<span className="text-xs font-medium">
														{c.expiresAt}
													</span>
												</div>
											)}
											{c.permissions && (
												<div className="space-y-1.5 pt-1 border-t">
													<span className="text-xs font-medium">
														Permissions
													</span>
													<div className="space-y-1">
														<div className="flex items-center gap-1.5">
															{c.permissions.canPost ? (
																<span className="text-green-600">✓</span>
															) : (
																<span className="text-red-600">✗</span>
															)}
															<span className="text-xs">Can Post</span>
														</div>
														<div className="flex items-center gap-1.5">
															{c.permissions.analytics ? (
																<span className="text-green-600">✓</span>
															) : (
																<span className="text-red-600">✗</span>
															)}
															<span className="text-xs">Analytics</span>
														</div>
													</div>
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>
							</div>
							<div className="flex items-center justify-between">
								<div className="text-left">
									<p className="text-sm font-semibold">{c.followers}</p>
									<p className="text-xs text-muted-foreground">
										{c.posts} posts
									</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => toggle(c.id)}
									className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<X className="size-3 mr-1" />
									Disconnect
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<p className="font-display font-semibold text-sm">Available</p>
					<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
						{available.length}
					</span>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{available.map((c) => (
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
									onClick={() => toggle(c.id)}
									className="w-full rounded-lg"
								>
									Connect
								</Button>
								<button
									type="button"
									className="text-xs font-medium text-primary hover:underline"
								>
									Invite
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

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
							This will stop posting to this platform.
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
