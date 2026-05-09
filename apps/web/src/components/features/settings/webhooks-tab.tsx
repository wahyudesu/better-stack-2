/**
 * Webhooks Settings Tab Component.
 * Manage webhook integrations for real-time notifications.
 */

"use client";

import {
	AlertCircle,
	Bell,
	Loader2,
	Pencil,
	Plus,
	Trash2,
	Webhook,
	Zap,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
	useCreateWebhook,
	useDeleteWebhook,
	useTestWebhook,
	useUpdateWebhook,
	useWebhookLogs,
	useWebhookSettings,
} from "@/hooks/use-webhooks";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const EVENT_OPTIONS = [
	// Posts
	{ value: "post.scheduled", label: "Post Scheduled", group: "Posts" },
	{ value: "post.published", label: "Post Published", group: "Posts" },
	{ value: "post.failed", label: "Post Failed", group: "Posts" },
	{ value: "post.partial", label: "Post Partial", group: "Posts" },
	{ value: "post.recycled", label: "Post Recycled", group: "Posts" },
	// Accounts
	{ value: "account.connected", label: "Account Connected", group: "Accounts" },
	{
		value: "account.disconnected",
		label: "Account Disconnected",
		group: "Accounts",
	},
	{
		value: "account.ads.initial_sync_completed",
		label: "Ads Initial Sync Completed",
		group: "Accounts",
	},
	// Messages
	{ value: "message.received", label: "Message Received", group: "Messages" },
	{ value: "message.sent", label: "Message Sent", group: "Messages" },
	{ value: "message.edited", label: "Message Edited", group: "Messages" },
	{ value: "message.deleted", label: "Message Deleted", group: "Messages" },
	{ value: "message.delivered", label: "Message Delivered", group: "Messages" },
	{ value: "message.read", label: "Message Read", group: "Messages" },
	{ value: "message.failed", label: "Message Failed", group: "Messages" },
	// Comments
	{ value: "comment.received", label: "Comment Received", group: "Comments" },
	// Reviews
	{ value: "review.new", label: "New Review", group: "Reviews" },
	{ value: "review.updated", label: "Review Updated", group: "Reviews" },
	// Ads
	{ value: "ad.status_changed", label: "Ad Status Changed", group: "Ads" },
];

interface WebhookItem {
	_id: string;
	name: string;
	url: string;
	events: string[];
	isActive: boolean;
	createdAt: string;
}

export function WebhooksTab() {
	const clerkToken = useAuthStore((s) => s.clerkToken);
	const { data, isLoading, error } = useWebhookSettings();
	const updateWebhook = useUpdateWebhook();
	const deleteWebhook = useDeleteWebhook();
	const testWebhook = useTestWebhook();

	const [selectedWebhook, setSelectedWebhook] = useState<WebhookItem | null>(
		null,
	);
	const [logsOpen, setLogsOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [testingId, setTestingId] = useState<string | null>(null);

	// Edit form state
	const [editName, setEditName] = useState("");
	const [editUrl, setEditUrl] = useState("");
	const [editEvents, setEditEvents] = useState<string[]>([]);
	const [editActive, setEditActive] = useState(true);

	// Create form state
	const [createOpen, setCreateOpen] = useState(false);
	const [createName, setCreateName] = useState("");
	const [createUrl, setCreateUrl] = useState("");
	const [createSecret, setCreateSecret] = useState("");
	const [createEvents, setCreateEvents] = useState<string[]>([]);
	const [createHeaders, setCreateHeaders] = useState<
		{ key: string; value: string }[]
	>([]);
	const createWebhook = useCreateWebhook();

	const settings: WebhookItem[] = data?.settings || [];

	const openEdit = (wh: WebhookItem) => {
		setSelectedWebhook(wh);
		setEditName(wh.name);
		setEditUrl(wh.url);
		setEditEvents(wh.events);
		setEditActive(wh.isActive);
		setEditOpen(true);
	};

	const openDelete = (wh: WebhookItem) => {
		setSelectedWebhook(wh);
		setDeleteOpen(true);
	};

	const openLogs = (wh: WebhookItem) => {
		setSelectedWebhook(wh);
		setLogsOpen(true);
	};

	const handleSaveEdit = async () => {
		if (!selectedWebhook) return;
		await updateWebhook.mutateAsync({
			webhookId: selectedWebhook._id,
			name: editName,
			url: editUrl,
			events: editEvents,
			isActive: editActive,
		});
		setEditOpen(false);
	};

	const handleDelete = async () => {
		if (!selectedWebhook) return;
		await deleteWebhook.mutateAsync(selectedWebhook._id);
		setDeleteOpen(false);
	};

	const handleTest = async (webhookId: string) => {
		setTestingId(webhookId);
		try {
			await testWebhook.mutateAsync(webhookId);
		} finally {
			setTestingId(null);
		}
	};

	const toggleCreateEvent = (event: string) => {
		setCreateEvents((prev) =>
			prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
		);
	};

	const toggleEditEvent = (event: string) => {
		setEditEvents((prev) =>
			prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
		);
	};

	const addCustomHeader = () => {
		setCreateHeaders((prev) => [...prev, { key: "", value: "" }]);
	};

	const updateCustomHeader = (
		index: number,
		field: "key" | "value",
		val: string,
	) => {
		setCreateHeaders((prev) => {
			const next = [...prev];
			next[index][field] = val;
			return next;
		});
	};

	const removeCustomHeader = (index: number) => {
		setCreateHeaders((prev) => prev.filter((_, i) => i !== index));
	};

	const handleCreate = async () => {
		if (!createName || !createUrl || createEvents.length === 0) return;
		const customHeaders: Record<string, string> = {};
		createHeaders.forEach(({ key, value }) => {
			if (key) customHeaders[key] = value;
		});
		await createWebhook.mutateAsync({
			name: createName,
			url: createUrl,
			events: createEvents,
			secret: createSecret || undefined,
			customHeaders:
				Object.keys(customHeaders).length > 0 ? customHeaders : undefined,
		});
		setCreateOpen(false);
		setCreateName("");
		setCreateUrl("");
		setCreateSecret("");
		setCreateEvents([]);
		setCreateHeaders([]);
	};

	const handleCreateClose = (open: boolean) => {
		if (!open) {
			setCreateOpen(false);
			setCreateName("");
			setCreateUrl("");
			setCreateSecret("");
			setCreateEvents([]);
			setCreateHeaders([]);
		}
	};

	if (!clerkToken) {
		return (
			<div className="flex flex-col gap-6">
				<Card>
					<CardContent className="text-center">
						<AlertCircle className="size-8 mx-auto mb-3 text-muted-foreground" />
						<p className="text-sm font-medium">Not Signed In</p>
						<p className="text-xs text-muted-foreground mt-1">
							Sign in to manage webhooks
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col gap-6">
				<Card>
					<CardContent className="text-center">
						<AlertCircle className="size-8 mx-auto mb-3 text-destructive" />
						<p className="text-sm font-medium text-destructive">
							Failed to load webhooks
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{String(error)}
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<p className="font-display font-semibold text-base">Webhooks</p>
					<p className="text-sm text-muted-foreground">
						Receive real-time notifications for events
					</p>
				</div>
				<Sheet open={createOpen} onOpenChange={handleCreateClose}>
					<Button size="sm" onClick={() => setCreateOpen(true)}>
						<Plus className="size-4 mr-1" />
						New Webhook
					</Button>
					<SheetContent
						side="right"
						className="w-[480px] max-w-full overflow-y-auto"
					>
						<SheetHeader>
							<SheetTitle>New Webhook</SheetTitle>
							<p className="text-sm text-muted-foreground">
								Configure a new webhook endpoint
							</p>
						</SheetHeader>
						<div className="space-y-6 mt-6">
							<div className="space-y-2">
								<Label>Name</Label>
								<Input
									value={createName}
									onChange={(e) => setCreateName(e.target.value)}
									placeholder="My Webhook"
								/>
							</div>
							<div className="space-y-2">
								<Label>URL</Label>
								<Input
									value={createUrl}
									onChange={(e) => setCreateUrl(e.target.value)}
									placeholder="https://example.com/webhook"
								/>
							</div>
							<div className="space-y-2">
								<Label>Secret Key (Optional)</Label>
								<Input
									type="password"
									value={createSecret}
									onChange={(e) => setCreateSecret(e.target.value)}
									placeholder="••••••••••••••••"
								/>
								<p className="text-xs text-muted-foreground">
									Used to generate HMAC signature in X-Zernio-Signature header
								</p>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label>Custom Headers (Optional)</Label>
									<Button variant="ghost" size="sm" onClick={addCustomHeader}>
										Add Header
									</Button>
								</div>
								{createHeaders.map((header, i) => (
									<div key={i} className="flex gap-2">
										<Input
											placeholder="Key"
											value={header.key}
											onChange={(e) =>
												updateCustomHeader(i, "key", e.target.value)
											}
										/>
										<Input
											placeholder="Value"
											value={header.value}
											onChange={(e) =>
												updateCustomHeader(i, "value", e.target.value)
											}
										/>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeCustomHeader(i)}
										>
											✕
										</Button>
									</div>
								))}
							</div>
							<div className="space-y-3">
								<Label>Events</Label>
								{EVENT_OPTIONS.filter((g) => g.group === "Posts").length >
									0 && (
									<div className="space-y-2">
										<p className="text-xs font-medium text-muted-foreground uppercase">
											Posts
										</p>
										<div className="flex flex-wrap gap-2">
											{EVENT_OPTIONS.filter((o) => o.group === "Posts").map(
												(opt) => (
													<button
														type="button"
														key={opt.value}
														onClick={() => toggleCreateEvent(opt.value)}
														className={cn(
															"px-2 py-1 text-xs rounded border transition-colors",
															createEvents.includes(opt.value)
																? "bg-primary text-primary-foreground border-primary"
																: "border-border hover:border-primary",
														)}
													>
														{opt.label}
													</button>
												),
											)}
										</div>
									</div>
								)}
								{EVENT_OPTIONS.filter((g) => g.group === "Accounts").length >
									0 && (
									<div className="space-y-2">
										<p className="text-xs font-medium text-muted-foreground uppercase">
											Accounts
										</p>
										<div className="flex flex-wrap gap-2">
											{EVENT_OPTIONS.filter((o) => o.group === "Accounts").map(
												(opt) => (
													<button
														type="button"
														key={opt.value}
														onClick={() => toggleCreateEvent(opt.value)}
														className={cn(
															"px-2 py-1 text-xs rounded border transition-colors",
															createEvents.includes(opt.value)
																? "bg-primary text-primary-foreground border-primary"
																: "border-border hover:border-primary",
														)}
													>
														{opt.label}
													</button>
												),
											)}
										</div>
									</div>
								)}
								{EVENT_OPTIONS.filter((g) => g.group === "Messages").length >
									0 && (
									<div className="space-y-2">
										<p className="text-xs font-medium text-muted-foreground uppercase">
											Messages
										</p>
										<div className="flex flex-wrap gap-2">
											{EVENT_OPTIONS.filter((o) => o.group === "Messages").map(
												(opt) => (
													<button
														type="button"
														key={opt.value}
														onClick={() => toggleCreateEvent(opt.value)}
														className={cn(
															"px-2 py-1 text-xs rounded border transition-colors",
															createEvents.includes(opt.value)
																? "bg-primary text-primary-foreground border-primary"
																: "border-border hover:border-primary",
														)}
													>
														{opt.label}
													</button>
												),
											)}
										</div>
									</div>
								)}
								{EVENT_OPTIONS.filter((g) => g.group === "Comments").length >
									0 && (
									<div className="space-y-2">
										<p className="text-xs font-medium text-muted-foreground uppercase">
											Comments
										</p>
										<div className="flex flex-wrap gap-2">
											{EVENT_OPTIONS.filter((o) => o.group === "Comments").map(
												(opt) => (
													<button
														type="button"
														key={opt.value}
														onClick={() => toggleCreateEvent(opt.value)}
														className={cn(
															"px-2 py-1 text-xs rounded border transition-colors",
															createEvents.includes(opt.value)
																? "bg-primary text-primary-foreground border-primary"
																: "border-border hover:border-primary",
														)}
													>
														{opt.label}
													</button>
												),
											)}
										</div>
									</div>
								)}
								{EVENT_OPTIONS.filter((g) => g.group === "Reviews").length >
									0 && (
									<div className="space-y-2">
										<p className="text-xs font-medium text-muted-foreground uppercase">
											Reviews
										</p>
										<div className="flex flex-wrap gap-2">
											{EVENT_OPTIONS.filter((o) => o.group === "Reviews").map(
												(opt) => (
													<button
														type="button"
														key={opt.value}
														onClick={() => toggleCreateEvent(opt.value)}
														className={cn(
															"px-2 py-1 text-xs rounded border transition-colors",
															createEvents.includes(opt.value)
																? "bg-primary text-primary-foreground border-primary"
																: "border-border hover:border-primary",
														)}
													>
														{opt.label}
													</button>
												),
											)}
										</div>
									</div>
								)}
								{EVENT_OPTIONS.filter((g) => g.group === "Ads").length > 0 && (
									<div className="space-y-2">
										<p className="text-xs font-medium text-muted-foreground uppercase">
											Ads
										</p>
										<div className="flex flex-wrap gap-2">
											{EVENT_OPTIONS.filter((o) => o.group === "Ads").map(
												(opt) => (
													<button
														type="button"
														key={opt.value}
														onClick={() => toggleCreateEvent(opt.value)}
														className={cn(
															"px-2 py-1 text-xs rounded border transition-colors",
															createEvents.includes(opt.value)
																? "bg-primary text-primary-foreground border-primary"
																: "border-border hover:border-primary",
														)}
													>
														{opt.label}
													</button>
												),
											)}
										</div>
									</div>
								)}
							</div>
							<Button
								className="w-full"
								onClick={handleCreate}
								disabled={
									!createName ||
									!createUrl ||
									createEvents.length === 0 ||
									createWebhook.isPending
								}
							>
								{createWebhook.isPending ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									"Create Webhook"
								)}
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* Webhook List */}
			{settings.length === 0 ? (
				<Card>
					<CardContent className="text-center py-8">
						<Webhook className="size-8 mx-auto mb-3 text-muted-foreground" />
						<p className="text-sm font-medium">No webhooks configured</p>
						<p className="text-xs text-muted-foreground mt-1">
							Add a webhook to receive real-time notifications
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{settings.map((wh) => (
						<Card key={wh._id}>
							<CardContent className="flex items-center gap-4 p-4">
								<div
									className={cn(
										"w-2 h-2 rounded-full",
										wh.isActive ? "bg-green-500" : "bg-gray-300",
									)}
								/>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold truncate">{wh.name}</p>
									<p className="text-xs text-muted-foreground truncate">
										{wh.url}
									</p>
									<div className="flex gap-1 mt-1 flex-wrap">
										{wh.events.slice(0, 3).map((event) => (
											<span
												key={event}
												className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
											>
												{event}
											</span>
										))}
										{wh.events.length > 3 && (
											<span className="text-xs text-muted-foreground">
												+{wh.events.length - 3} more
											</span>
										)}
									</div>
								</div>
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleTest(wh._id)}
										disabled={testingId === wh._id}
										title="Test webhook"
									>
										{testingId === wh._id ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Zap className="size-4" />
										)}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => openLogs(wh)}
										title="View logs"
									>
										<Bell className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => openEdit(wh)}
										title="Edit"
									>
										<Pencil className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => openDelete(wh)}
										title="Delete"
										className="text-destructive hover:text-destructive"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Edit Dialog */}
			<AlertDialog
				open={editOpen}
				onOpenChange={(open) => !open && setEditOpen(false)}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle>Edit Webhook</AlertDialogTitle>
					</AlertDialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Name</Label>
							<Input
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								placeholder="My Webhook"
							/>
						</div>
						<div className="space-y-2">
							<Label>URL</Label>
							<Input
								value={editUrl}
								onChange={(e) => setEditUrl(e.target.value)}
								placeholder="https://example.com/webhook"
							/>
						</div>
						<div className="space-y-2">
							<Label>Events</Label>
							<div className="flex flex-wrap gap-2">
								{EVENT_OPTIONS.map((opt) => (
									<button
										type="button"
										key={opt.value}
										onClick={() => toggleEditEvent(opt.value)}
										className={cn(
											"px-2 py-1 text-xs rounded border transition-colors",
											editEvents.includes(opt.value)
												? "bg-primary text-primary-foreground border-primary"
												: "border-border hover:border-primary",
										)}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>
						<div className="flex items-center justify-between">
							<Label>Active</Label>
							<Switch checked={editActive} onCheckedChange={setEditActive} />
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleSaveEdit}
							disabled={updateWebhook.isPending}
						>
							{updateWebhook.isPending ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								"Save"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Dialog */}
			<AlertDialog
				open={deleteOpen}
				onOpenChange={(open) => !open && setDeleteOpen(false)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Webhook?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete &quot;{selectedWebhook?.name}&quot;
							and cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive hover:bg-destructive/90"
							disabled={deleteWebhook.isPending}
						>
							{deleteWebhook.isPending ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Logs Slide-over */}
			{logsOpen && selectedWebhook && (
				<WebhookLogsPanel
					webhookId={selectedWebhook._id}
					webhookName={selectedWebhook.name}
					onClose={() => setLogsOpen(false)}
				/>
			)}
		</div>
	);
}

function WebhookLogsPanel({
	webhookId,
	webhookName,
	onClose,
}: {
	webhookId: string;
	webhookName: string;
	onClose: () => void;
}) {
	const { data: logsData, isLoading } = useWebhookLogs({ webhookId });

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
			<div className="bg-background w-full max-w-md h-full overflow-y-auto shadow-xl animate-in slide-in-from-right duration-200">
				<div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between z-10">
					<div>
						<p className="font-semibold text-sm">Webhook Logs</p>
						<p className="text-xs text-muted-foreground">{webhookName}</p>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose}>
						✕
					</Button>
				</div>
				<div className="p-4">
					{isLoading ? (
						<div className="flex justify-center py-8">
							<Loader2 className="size-6 animate-spin text-muted-foreground" />
						</div>
					) : logsData?.logs?.length === 0 ? (
						<p className="text-center text-sm text-muted-foreground py-8">
							No logs yet
						</p>
					) : (
						<div className="space-y-3">
							{logsData?.logs?.map((log: any) => (
								<Card key={log._id}>
									<CardContent className="p-3 space-y-1">
										<div className="flex items-center justify-between">
											<span className="text-xs font-medium">{log.event}</span>
											<span
												className={cn(
													"text-xs px-1.5 py-0.5 rounded",
													log.status === "success"
														? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
														: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
												)}
											>
												{log.status}
											</span>
										</div>
										<p className="text-xs text-muted-foreground">
											{new Date(log.createdAt).toLocaleString()}
										</p>
										{log.errorMessage && (
											<p className="text-xs text-destructive">
												{log.errorMessage}
											</p>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
