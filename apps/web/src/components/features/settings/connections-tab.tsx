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

interface Connection {
	id: string;
	name: string;
	network: string;
	connected: boolean;
	handle: string | null;
	followers: string | null;
	posts: number | null;
}

const connections: Connection[] = [
	{ id: "instagram", name: "Instagram", network: "instagram", connected: true, handle: "@acme.studio", followers: "48.2K", posts: 342 },
	{ id: "tiktok", name: "TikTok", network: "tiktok", connected: true, handle: "@acmestudio", followers: "125.8K", posts: 89 },
	{ id: "whatsapp", name: "WhatsApp", network: "whatsapp", connected: false, handle: null, followers: null, posts: null },
	{ id: "facebook", name: "Facebook", network: "facebook", connected: true, handle: "Acme Corp", followers: "23.4K", posts: 156 },
	{ id: "youtube", name: "YouTube", network: "youtube", connected: true, handle: "Acme Studio", followers: "72.1K", posts: 128 },
	{ id: "linkedin", name: "LinkedIn", network: "linkedin", connected: false, handle: null, followers: null, posts: null },
	{ id: "twitter", name: "X (Twitter)", network: "x", connected: true, handle: "@AcmeStudio", followers: "31.4K", posts: 1204 },
	{ id: "threads", name: "Threads", network: "threads", connected: false, handle: null, followers: null, posts: null },
	{ id: "reddit", name: "Reddit", network: "reddit", connected: false, handle: null, followers: null, posts: null },
	{ id: "pinterest", name: "Pinterest", network: "pinterest", connected: false, handle: null, followers: null, posts: null },
	{ id: "google", name: "Google Business", network: "google", connected: false, handle: null, followers: null, posts: null },
	{ id: "telegram", name: "Telegram", network: "telegram", connected: false, handle: null, followers: null, posts: null },
	{ id: "snapchat", name: "Snapchat", network: "snapchat", connected: false, handle: null, followers: null, posts: null },
];

export function ConnectionsTab() {
	const [data, setData] = useState(connections);
	const [dialog, setDialog] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });

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
				return { ...c, connected: true, handle: `@${c.name.toLowerCase()}`, followers: `${Math.floor(Math.random() * 100 + 10)}K`, posts: Math.floor(Math.random() * 500 + 50) };
			}),
		);
	};

	const confirmDisconnect = () => {
		setData((prev) => prev.map((c) => c.id === dialog.id ? { ...c, connected: false, handle: null, followers: null, posts: null } : c));
		setDialog({ open: false, id: "", name: "" });
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<p className="font-display font-semibold text-sm">Connected</p>
					<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{connected.length}</span>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{connected.map((c) => (
						<div key={c.id} className="flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm">
							<div className="flex items-center gap-3">
								<SocialIcon network={c.network} style={{ height: 40, width: 40 }} />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold">{c.handle}</p>
								</div>
								<div className="text-right shrink-0">
									<p className="text-sm font-semibold">{c.followers}</p>
									<p className="text-xs text-muted-foreground">{c.posts} posts</p>
								</div>
							</div>
							<Button variant="outline" size="sm" onClick={() => toggle(c.id)} className="w-full rounded-lg">Disconnect</Button>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<p className="font-display font-semibold text-sm">Available</p>
					<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{available.length}</span>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{available.map((c) => (
						<div key={c.id} className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 shadow-sm text-center">
							<SocialIcon network={c.network} style={{ height: 40, width: 40 }} />
							<p className="text-sm font-semibold">{c.name}</p>
							<div className="flex flex-col gap-1 w-full">
								<Button variant="default" size="sm" onClick={() => toggle(c.id)} className="w-full rounded-lg">Connect</Button>
								<button type="button" className="text-xs font-medium text-primary hover:underline">Invite</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<AlertDialog open={dialog.open} onOpenChange={(open) => !open && setDialog({ open: false, id: "", name: "" })}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Disconnect {dialog.name}?</AlertDialogTitle>
						<AlertDialogDescription>This will stop posting to this platform.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDisconnect} className="bg-destructive hover:bg-destructive/90">Disconnect</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}