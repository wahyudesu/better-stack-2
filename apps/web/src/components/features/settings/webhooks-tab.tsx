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
import { Switch } from "@/components/ui/switch";
import {
	useDeleteWebhook,
	useTestWebhook,
	useUpdateWebhook,
	useWebhookLogs,
	useWebhookSettings,
} from "@/hooks/use-webhooks";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";

const EVENT_OPTIONS = [
	{ value: "post.published", label: "Post Published" },
	{ value: "post.failed", label: "Post Failed" },
	{ value: "post.scheduled", label: "Post Scheduled" },
	{ value: "comment.new", label: "New Comment" },
	{ value: "message.new", label: "New Message" },
	{ value: "review.new", label: "New Review" },
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
	const apiKey = useAuthStore((s) => s.apiKey);
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

	const toggleEvent = (event: string) => {
		setEditEvents((prev) =>
			prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
		);
	};

	if (!apiKey) {
		return (
			<div className="flex flex-col gap-6">
				<Card>
					<CardContent className="text-center">
						<AlertCircle className="size-8 mx-auto mb-3 text-muted-foreground" />
						<p className="text-sm font-medium">API Key Not Connected</p>
						<p className="text-xs text-muted-foreground mt-1">
							Connect your API key in Settings &gt; Account to manage webhooks
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
										onClick={() => toggleEvent(opt.value)}
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
