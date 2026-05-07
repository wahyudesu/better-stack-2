"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	AtSign,
	Bot,
	Calendar,
	Clock,
	Edit2,
	Hash,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Send,
	Plus,
	Trash2,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CommentAutomation } from "@/lib/client";
import { api } from "@/lib/client";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

interface Broadcast {
	_id: string;
	name: string;
	status: "draft" | "scheduled" | "sending" | "sent" | "cancelled";
	accountId: string;
	accountUsername?: string;
	recipientCount?: number;
	scheduledAt?: string;
	sentAt?: string;
	createdAt: string;
}

interface Sequence {
	_id: string;
	name: string;
	status: "draft" | "active" | "paused" | "completed";
	steps: Array<{
		delay?: number;
		action?: string;
		templateId?: string;
	}>;
	enrolledCount?: number;
	completedCount?: number;
	createdAt: string;
}

interface AutomationForm {
	name: string;
	accountId: string;
	platformPostId: string;
	keywords: string;
	matchMode: "contains" | "exact";
	dmMessage: string;
	commentReply: string;
	assignTo: string;
}

const emptyForm: AutomationForm = {
	name: "",
	accountId: "",
	platformPostId: "",
	keywords: "",
	matchMode: "contains",
	dmMessage: "",
	commentReply: "",
	assignTo: "",
};

// ============================================================================
// BROADCASTS TAB
// ============================================================================

function BroadcastsTab() {
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingBroadcast, setEditingBroadcast] = useState<Broadcast | null>(
		null,
	);

	// Fetch broadcasts
	const { data: broadcastsData, isLoading } = useQuery({
		queryKey: ["inbox", "broadcasts"],
		queryFn: async () => {
			const res = await api.listBroadcasts({});
			if (res.error) throw new Error(res.error);
			return (res.data?.broadcasts ?? []) as Broadcast[];
		},
	});

	// Create mutation
	const createMutation = useMutation({
		mutationFn: async (body: {
			profileId: string;
			accountId: string;
			platform: string;
			name: string;
			description?: string;
			message?: object;
		}) => {
			const res = await api.createBroadcast(body);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
			setIsDialogOpen(false);
		},
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: async (broadcastId: string) => {
			const res = await api.deleteBroadcast(broadcastId);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
		},
	});

	const openCreateDialog = () => {
		setEditingBroadcast(null);
		setIsDialogOpen(true);
	};

	const statusBadge = (status: Broadcast["status"]) => {
		const config: Record<string, { label: string; className: string }> = {
			draft: { label: "Draft", className: "bg-gray-500/10 text-gray-500" },
			scheduled: {
				label: "Scheduled",
				className: "bg-blue-500/10 text-blue-500",
			},
			sending: {
				label: "Sending",
				className: "bg-yellow-500/10 text-yellow-500",
			},
			sent: { label: "Sent", className: "bg-green-500/10 text-green-500" },
			cancelled: {
				label: "Cancelled",
				className: "bg-red-500/10 text-red-500",
			},
		};
		return (
			<Badge className={cn("text-xs", config[status]?.className)}>
				{config[status]?.label}
			</Badge>
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{broadcastsData?.length ?? 0} broadcast
					{broadcastsData?.length !== 1 ? "s" : ""}
				</p>
				<Button onClick={openCreateDialog} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					New Broadcast
				</Button>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Create Broadcast</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block">
								Broadcast Name
							</label>
							<Input placeholder="e.g., Summer Sale Announcement" />
						</div>
						<div>
							<label className="text-sm font-medium mb-2 block">Account</label>
							<Input placeholder="Account ID" />
						</div>
						<div className="flex gap-2 pt-2">
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button className="flex-1">Create Broadcast</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{isLoading ? (
				<Card className="p-8 text-center">
					<p className="text-muted-foreground">Loading broadcasts...</p>
				</Card>
			) : !broadcastsData || broadcastsData.length === 0 ? (
				<Card className="p-8 text-center">
					<Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
					<p className="text-muted-foreground">No broadcasts yet</p>
					<p className="text-sm text-muted-foreground mt-1">
						Create your first broadcast to send messages to contacts
					</p>
				</Card>
			) : (
				<div className="space-y-3">
					{broadcastsData.map((broadcast) => (
						<Card key={broadcast._id} className="p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<Mail className="h-5 w-5 text-primary" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold">{broadcast.name}</h3>
											{statusBadge(broadcast.status)}
										</div>
										<div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
											{broadcast.recipientCount !== undefined && (
												<span className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													{broadcast.recipientCount} recipients
												</span>
											)}
											{broadcast.scheduledAt && (
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{new Date(broadcast.scheduledAt).toLocaleString()}
												</span>
											)}
										</div>
									</div>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Button variant="ghost" size="icon">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem>
											<Edit2 className="h-4 w-4 mr-2" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive"
											onClick={() => deleteMutation.mutate(broadcast._id)}
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

// ============================================================================
// SEQUENCES TAB
// ============================================================================

function SequencesTab() {
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);

	// Fetch sequences
	const { data: sequencesData, isLoading } = useQuery({
		queryKey: ["inbox", "sequences"],
		queryFn: async () => {
			const res = await api.listSequences();
			if (res.error) throw new Error(res.error);
			return (res.data?.sequences ?? []) as Sequence[];
		},
	});

	// Create mutation
	const createMutation = useMutation({
		mutationFn: async (body: {
			profileId: string;
			accountId: string;
			platform: string;
			name: string;
			description?: string;
			steps: Array<{
				order: number;
				delayMinutes: number;
				message?: object;
				template?: object;
			}>;
		}) => {
			const res = await api.createSequence(body);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "sequences"] });
			setIsDialogOpen(false);
		},
	});

	// Activate/Pause mutation
	const toggleMutation = useMutation({
		mutationFn: async ({
			sequenceId,
			action,
		}: {
			sequenceId: string;
			action: "activate" | "pause";
		}) => {
			const res =
				action === "activate"
					? await api.activateSequence(sequenceId)
					: await api.pauseSequence(sequenceId);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "sequences"] });
		},
	});

	const openCreateDialog = () => {
		setEditingSequence(null);
		setIsDialogOpen(true);
	};

	const statusBadge = (status: Sequence["status"]) => {
		const config: Record<string, { label: string; className: string }> = {
			draft: { label: "Draft", className: "bg-gray-500/10 text-gray-500" },
			active: { label: "Active", className: "bg-green-500/10 text-green-500" },
			paused: {
				label: "Paused",
				className: "bg-yellow-500/10 text-yellow-500",
			},
			completed: {
				label: "Completed",
				className: "bg-blue-500/10 text-blue-500",
			},
		};
		return (
			<Badge className={cn("text-xs", config[status]?.className)}>
				{config[status]?.label}
			</Badge>
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{sequencesData?.length ?? 0} sequence
					{sequencesData?.length !== 1 ? "s" : ""}
				</p>
				<Button onClick={openCreateDialog} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					New Sequence
				</Button>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Create Sequence</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block">
								Sequence Name
							</label>
							<Input placeholder="e.g., Welcome Series" />
						</div>
						<div className="flex gap-2 pt-2">
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button className="flex-1">Create Sequence</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{isLoading ? (
				<Card className="p-8 text-center">
					<p className="text-muted-foreground">Loading sequences...</p>
				</Card>
			) : !sequencesData || sequencesData.length === 0 ? (
				<Card className="p-8 text-center">
					<Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
					<p className="text-muted-foreground">No sequences yet</p>
					<p className="text-sm text-muted-foreground mt-1">
						Create drip campaigns to engage contacts over time
					</p>
				</Card>
			) : (
				<div className="space-y-3">
					{sequencesData.map((sequence) => (
						<Card key={sequence._id} className="p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<Calendar className="h-5 w-5 text-primary" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold">{sequence.name}</h3>
											{statusBadge(sequence.status)}
										</div>
										<div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
											<span className="flex items-center gap-1">
												<Hash className="h-3 w-3" />
												{sequence.steps.length} step
												{sequence.steps.length !== 1 ? "s" : ""}
											</span>
											{sequence.enrolledCount !== undefined && (
												<span className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													{sequence.enrolledCount} enrolled
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{(sequence.status === "draft" ||
										sequence.status === "paused") && (
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												toggleMutation.mutate({
													sequenceId: sequence._id,
													action: "activate",
												})
											}
										>
											Activate
										</Button>
									)}
									{sequence.status === "active" && (
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												toggleMutation.mutate({
													sequenceId: sequence._id,
													action: "pause",
												})
											}
										>
											Pause
										</Button>
									)}
									<DropdownMenu>
										<DropdownMenuTrigger>
											<Button variant="ghost" size="icon">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<Edit2 className="h-4 w-4 mr-2" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem className="text-destructive">
												<Trash2 className="h-4 w-4 mr-2" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

// ============================================================================
// COMMENT-TO-DM TAB (formerly Automation)
// ============================================================================

function CommentToDmTab() {
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingAutomation, setEditingAutomation] =
		useState<CommentAutomation | null>(null);
	const [form, setForm] = useState<AutomationForm>(emptyForm);

	// Fetch automations
	const { data: automationsData, isLoading } = useQuery({
		queryKey: ["inbox", "comment-automations"],
		queryFn: async () => {
			const res = await api.listCommentAutomations();
			if (res.error) throw new Error(res.error);
			return (res.data?.automations ?? []) as CommentAutomation[];
		},
	});

	// Create mutation
	const createMutation = useMutation({
		mutationFn: async (
			body: Parameters<typeof api.createCommentAutomation>[0],
		) => {
			const res = await api.createCommentAutomation(body);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["inbox", "comment-automations"],
			});
			closeDialog();
		},
	});

	// Update mutation
	const updateMutation = useMutation({
		mutationFn: async ({
			automationId,
			...body
		}: {
			automationId: string;
			name?: string;
			keywords?: string[];
			matchMode?: "contains" | "exact";
			dmMessage?: string;
			commentReply?: string;
			assignTo?: string;
			isActive?: boolean;
		}) => {
			const res = await api.updateCommentAutomation(automationId, body);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["inbox", "comment-automations"],
			});
			closeDialog();
		},
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: async (automationId: string) => {
			const res = await api.deleteCommentAutomation(automationId);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["inbox", "comment-automations"],
			});
		},
	});

	// Toggle active mutation
	const toggleMutation = useMutation({
		mutationFn: async ({
			automationId,
			isActive,
		}: {
			automationId: string;
			isActive: boolean;
		}) => {
			const res = await api.updateCommentAutomation(automationId, { isActive });
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["inbox", "comment-automations"],
			});
		},
	});

	const openCreateDialog = () => {
		setEditingAutomation(null);
		setForm({ ...emptyForm });
		setIsDialogOpen(true);
	};

	const openEditDialog = (automation: CommentAutomation) => {
		setEditingAutomation(automation);
		setForm({
			name: automation.name,
			accountId: automation.accountId,
			platformPostId: automation.platformPostId || "",
			keywords: automation.keywords?.join(", ") || "",
			matchMode: automation.matchMode || "contains",
			dmMessage: automation.dmMessage || "",
			commentReply: automation.commentReply || "",
			assignTo: (automation as any).assignTo || "",
		});
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setEditingAutomation(null);
		setForm({ ...emptyForm });
	};

	const saveAutomation = () => {
		const keywordsArray = form.keywords
			.split(",")
			.map((k) => k.trim().toLowerCase())
			.filter(Boolean);

		if (editingAutomation) {
			updateMutation.mutate({
				automationId: editingAutomation._id,
				name: form.name,
				keywords: keywordsArray,
				matchMode: form.matchMode,
				dmMessage: form.dmMessage,
				commentReply: form.commentReply,
				assignTo: form.assignTo,
			});
		} else {
			createMutation.mutate({
				name: form.name,
				accountId: form.accountId,
				platformPostId: form.platformPostId || undefined,
				keywords: keywordsArray,
				matchMode: form.matchMode,
				dmMessage: form.dmMessage,
				commentReply: form.commentReply || undefined,
			});
		}
	};

	const updateForm = (field: keyof AutomationForm, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const activeCount = automationsData?.filter((a) => a.isActive).length ?? 0;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{activeCount} active rule{activeCount !== 1 ? "s" : ""}
				</p>
				<Button onClick={openCreateDialog} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					New Rule
				</Button>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{editingAutomation ? "Edit Rule" : "Create Comment-to-DM Rule"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block">
								Rule Name
							</label>
							<Input
								placeholder="e.g., Welcome DM, Thank you comment..."
								value={form.name}
								onChange={(e) => updateForm("name", e.target.value)}
								className="font-medium"
							/>
						</div>

						{!editingAutomation && (
							<div>
								<label className="text-sm font-medium mb-2 block">
									Account ID
								</label>
								<Input
									placeholder="Instagram or Facebook account ID"
									value={form.accountId}
									onChange={(e) => updateForm("accountId", e.target.value)}
									className="font-medium"
								/>
							</div>
						)}

						{!editingAutomation && (
							<div>
								<label className="text-sm font-medium mb-2 block">
									Post ID (Optional)
								</label>
								<Input
									placeholder="Leave empty for account-wide automation"
									value={form.platformPostId}
									onChange={(e) => updateForm("platformPostId", e.target.value)}
									className="font-medium"
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Scope this rule to a specific post. Omit for all posts.
								</p>
							</div>
						)}

						<div>
							<label className="text-sm font-medium mb-2 block">
								<Hash className="h-4 w-4 inline mr-1" />
								Keywords
							</label>
							<Input
								placeholder="love, amazing, awesome, great"
								value={form.keywords}
								onChange={(e) => updateForm("keywords", e.target.value)}
								className="font-medium"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Separate keywords with commas. Leave empty to match all.
							</p>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">
								Match Mode
							</label>
							<Select
								value={form.matchMode}
								onValueChange={(v) => updateForm("matchMode", v ?? "contains")}
							>
								<SelectTrigger className="font-medium">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="contains">Contains (default)</SelectItem>
									<SelectItem value="exact">Exact Match</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">
								<MessageSquare className="h-4 w-4 inline mr-1" />
								DM Message
							</label>
							<Textarea
								placeholder="Type the automatic DM to send..."
								value={form.dmMessage}
								onChange={(e) => updateForm("dmMessage", e.target.value)}
								rows={3}
								className="resize-none font-medium"
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">
								<MessageSquare className="h-4 w-4 inline mr-1" />
								Comment Reply (Optional)
							</label>
							<Textarea
								placeholder="Optional public reply to the comment..."
								value={form.commentReply}
								onChange={(e) => updateForm("commentReply", e.target.value)}
								rows={2}
								className="resize-none font-medium"
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">
								<AtSign className="h-4 w-4 inline mr-1" />
								Assign To (Optional)
							</label>
							<Input
								placeholder="User or team to assign"
								value={form.assignTo}
								onChange={(e) => updateForm("assignTo", e.target.value)}
								className="font-medium"
							/>
						</div>

						<div className="flex gap-2 pt-2">
							<Button
								variant="outline"
								className="flex-1"
								onClick={closeDialog}
							>
								Cancel
							</Button>
							<Button
								className="flex-1"
								disabled={
									!form.name ||
									(!form.accountId && !editingAutomation) ||
									!form.dmMessage
								}
								onClick={saveAutomation}
							>
								{editingAutomation ? "Save Changes" : "Create Rule"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{isLoading ? (
				<Card className="p-8 text-center">
					<p className="text-muted-foreground">Loading rules...</p>
				</Card>
			) : !automationsData || automationsData.length === 0 ? (
				<Card className="p-8 text-center">
					<Bot className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
					<p className="text-muted-foreground">No comment-to-DM rules yet</p>
					<p className="text-sm text-muted-foreground mt-1">
						Create rules to automatically send DMs based on comment keywords
					</p>
				</Card>
			) : (
				<div className="space-y-3">
					{automationsData.map((automation) => (
						<Card
							key={automation._id}
							className={cn(
								"p-4 transition-all",
								!automation.isActive && "opacity-60",
							)}
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="font-semibold truncate">
											{automation.name}
										</h3>
										<Badge className="shrink-0 bg-blue-500/10 text-blue-500">
											<MessageSquare className="h-3 w-3 mr-1" />
											Comment to DM
										</Badge>
										{!automation.isActive && (
											<Badge variant="outline" className="shrink-0">
												Disabled
											</Badge>
										)}
									</div>

									{automation.dmMessage && (
										<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
											{automation.dmMessage}
										</p>
									)}

									<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
										<div className="flex items-center gap-1">
											<span>Account:</span>
											<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
												{automation.accountUsername || automation.accountId}
											</code>
										</div>

										{automation.keywords && automation.keywords.length > 0 && (
											<div className="flex items-center gap-1">
												<Hash className="h-3 w-3" />
												<span>{automation.keywords.join(", ")}</span>
											</div>
										)}

										{automation.matchMode && (
											<div className="flex items-center gap-1">
												<span>Match:</span>
												<span>{automation.matchMode}</span>
											</div>
										)}

										{(automation as any).assignTo && (
											<div className="flex items-center gap-1">
												<AtSign className="h-3 w-3" />
												<span>{(automation as any).assignTo}</span>
											</div>
										)}

										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>{automation.createdAt}</span>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2 shrink-0">
									<Switch
										checked={automation.isActive}
										onCheckedChange={() =>
											toggleMutation.mutate({
												automationId: automation._id,
												isActive: !automation.isActive,
											})
										}
									/>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => openEditDialog(automation)}
									>
										<Edit2 className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteMutation.mutate(automation._id)}
										className="text-destructive hover:text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function InboxCampaigns() {
	const [activeTab, setActiveTab] = useState("broadcasts");

	const tabs = [
		{
			id: "broadcasts",
			label: "Broadcasts",
			icon: <Mail className="h-5 w-5" />,
		},
		{
			id: "sequences",
			label: "Sequences",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			id: "comment-to-dm",
			label: "Comment-to-DM",
			icon: <Bot className="h-5 w-5" />,
		},
	];

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			{/* Header */}
			<div className="flex items-start justify-between mb-6">
				<div>
					<h1 className="font-display text-2xl font-bold tracking-tight">
						Campaigns
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage broadcasts, sequences, and automations
					</p>
				</div>
			</div>

			{/* Tabs */}
			<AnimatedTabs
				tabs={tabs}
				activeTab={activeTab}
				onChange={setActiveTab}
				variant="underline"
			/>

			{/* Tab Content */}
			<div className="mt-6">
				{activeTab === "broadcasts" && <BroadcastsTab />}
				{activeTab === "sequences" && <SequencesTab />}
				{activeTab === "comment-to-dm" && <CommentToDmTab />}
			</div>
		</div>
	);
}
