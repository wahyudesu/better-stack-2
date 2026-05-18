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
	Plus,
	Trash2,
	Users,
} from "lucide-react";
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
import { PlatformFilterDropdown } from "@/components/ui/platform-filter";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useZernio } from "@/hooks/use-zernio";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import type { ProfilePlatform } from "@/lib/types/social";
import { cn } from "@/lib/utils";
import { getZernioErrorMessage } from "@/lib/zernio-error";

// ============================================================================
// TYPES (aligned with Zernio SDK types)
// ============================================================================

interface Broadcast {
	_id: string;
	id?: string;
	name: string;
	description?: string;
	platform?: string;
	accountId?: string;
	accountName?: string;
	status:
		| "draft"
		| "scheduled"
		| "sending"
		| "completed"
		| "failed"
		| "cancelled";
	messagePreview?: string;
	scheduledAt?: string;
	startedAt?: string;
	completedAt?: string;
	recipientCount?: number;
	sentCount?: number;
	deliveredCount?: number;
	readCount?: number;
	failedCount?: number;
	createdAt: string;
}

interface Sequence {
	_id: string;
	id?: string;
	name: string;
	description?: string;
	platform?: string;
	accountId?: string;
	accountName?: string;
	status: "draft" | "active" | "paused";
	messagePreview?: string;
	stepsCount?: number;
	exitOnReply?: boolean;
	exitOnUnsubscribe?: boolean;
	totalEnrolled?: number;
	totalCompleted?: number;
	totalExited?: number;
	createdAt: string;
}

interface CommentAutomation {
	_id: string;
	id?: string;
	profileId?: string;
	name: string;
	platform?: "instagram" | "facebook";
	accountId?: string;
	accountName?: string;
	platformPostId?: string;
	postId?: string;
	postTitle?: string;
	keywords?: string[];
	matchMode?: "exact" | "contains";
	dmMessage?: string;
	buttons?: Array<{
		type: "url" | "phone";
		text: string;
		url?: string;
		phone?: string;
	}>;
	commentReply?: string;
	isActive: boolean;
	stats?: {
		triggered?: number;
		dmsSent?: number;
		dmsFailed?: number;
		uniqueContacts?: number;
	};
	createdAt: string;
}

interface AutomationForm {
	name: string;
	accountId: string;
	platform: ProfilePlatform;
	profileId: string;
	platformPostId: string;
	keywords: string;
	matchMode: "contains" | "exact";
	dmMessage: string;
	commentReply: string;
}

const emptyForm: AutomationForm = {
	name: "",
	accountId: "",
	platform: "instagram",
	profileId: "",
	platformPostId: "",
	keywords: "",
	matchMode: "contains",
	dmMessage: "",
	commentReply: "",
};

// ============================================================================
// BROADCASTS TAB
// ============================================================================

function BroadcastsTab() {
	const { zernio, loading: zernioLoading } = useZernio();
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingBroadcast, setEditingBroadcast] = useState<Broadcast | null>(
		null,
	);
	const [form, setForm] = useState({
		name: "",
		accountId: "",
		platform: "instagram" as ProfilePlatform,
		profileId: "",
		description: "",
		message: "",
	});

	// Fetch broadcasts
	const { data: broadcastsData, isLoading } = useQuery({
		queryKey: ["inbox", "broadcasts"],
		queryFn: async () => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.broadcasts.listBroadcasts({});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return (res.data?.broadcasts ?? []) as Broadcast[];
		},
		enabled: !!zernio,
	});

	// Create mutation
	const createMutation = useMutation({
		mutationFn: async (body: {
			profileId: string;
			accountId: string;
			platform: ProfilePlatform;
			name: string;
			description?: string;
			message?: { text?: string };
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.broadcasts.createBroadcast({ body });
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
			closeDialog();
		},
	});

	// Update mutation
	const updateMutation = useMutation({
		mutationFn: async ({
			broadcastId,
			...body
		}: {
			broadcastId: string;
			name?: string;
			description?: string;
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.broadcasts.updateBroadcast({
				path: { broadcastId },
				body,
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
			closeDialog();
		},
	});

	// Send now mutation
	const sendMutation = useMutation({
		mutationFn: async (broadcastId: string) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.broadcasts.sendBroadcast({
				path: { broadcastId },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
		},
	});

	// Schedule mutation
	const scheduleMutation = useMutation({
		mutationFn: async ({
			broadcastId,
			scheduledAt,
		}: {
			broadcastId: string;
			scheduledAt: string;
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.broadcasts.scheduleBroadcast({
				path: { broadcastId },
				body: { scheduledAt },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
		},
	});

	// Cancel mutation
	const cancelMutation = useMutation({
		mutationFn: async (broadcastId: string) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.broadcasts.cancelBroadcast({
				path: { broadcastId },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
		},
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: async (broadcastId: string) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.broadcasts.deleteBroadcast({
				path: { broadcastId },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
		},
	});

	const openCreateDialog = () => {
		setEditingBroadcast(null);
		setForm({
			name: "",
			accountId: "",
			platform: "instagram",
			profileId: "",
			description: "",
			message: "",
		});
		setIsDialogOpen(true);
	};

	const openEditDialog = (broadcast: Broadcast) => {
		setEditingBroadcast(broadcast);
		setForm({
			name: broadcast.name,
			accountId: broadcast.accountId || "",
			platform: (broadcast.platform as ProfilePlatform) || "instagram",
			profileId: "",
			description: broadcast.description || "",
			message: broadcast.messagePreview || "",
		});
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setEditingBroadcast(null);
	};

	const saveBroadcast = () => {
		if (editingBroadcast) {
			updateMutation.mutate({
				broadcastId: editingBroadcast._id,
				name: form.name,
				description: form.description || undefined,
			});
		} else {
			createMutation.mutate({
				profileId: form.profileId || "",
				accountId: form.accountId,
				platform: form.platform,
				name: form.name,
				description: form.description || undefined,
				message: form.message ? { text: form.message } : undefined,
			});
		}
	};

	const updateForm = (field: string, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
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
			completed: {
				label: "Completed",
				className: "bg-green-500/10 text-green-500",
			},
			failed: {
				label: "Failed",
				className: "bg-red-500/10 text-red-500",
			},
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

	if (zernioLoading) {
		return (
			<Card className="p-8 text-center">
				<p className="text-muted-foreground">Loading...</p>
			</Card>
		);
	}

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
						<DialogTitle>
							{editingBroadcast ? "Edit Broadcast" : "Create Broadcast"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block">
								Broadcast Name
							</label>
							<Input
								placeholder="e.g., Summer Sale Announcement"
								value={form.name}
								onChange={(e) => updateForm("name", e.target.value)}
							/>
						</div>
						{!editingBroadcast && (
							<>
								<div>
									<label className="text-sm font-medium mb-2 block">
										Platform
									</label>
									<Select
										value={form.platform}
										onValueChange={(v) =>
											updateForm("platform", v ?? "instagram")
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="instagram">Instagram</SelectItem>
											<SelectItem value="facebook">Facebook</SelectItem>
											<SelectItem value="telegram">Telegram</SelectItem>
											<SelectItem value="twitter">X (Twitter)</SelectItem>
											<SelectItem value="bluesky">Bluesky</SelectItem>
											<SelectItem value="reddit">Reddit</SelectItem>
											<SelectItem value="whatsapp">WhatsApp</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">
										Account ID
									</label>
									<Input
										placeholder="Account ID"
										value={form.accountId}
										onChange={(e) => updateForm("accountId", e.target.value)}
									/>
								</div>
							</>
						)}
						<div>
							<label className="text-sm font-medium mb-2 block">
								Description (optional)
							</label>
							<Input
								placeholder="Description"
								value={form.description}
								onChange={(e) => updateForm("description", e.target.value)}
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
								disabled={!form.name || (!editingBroadcast && !form.accountId)}
								onClick={saveBroadcast}
							>
								{editingBroadcast ? "Save Changes" : "Create Broadcast"}
							</Button>
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
											{broadcast.platform && (
												<span className="uppercase">{broadcast.platform}</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{broadcast.status === "draft" && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => sendMutation.mutate(broadcast._id)}
											disabled={sendMutation.isPending}
										>
											Send Now
										</Button>
									)}
									{(broadcast.status === "scheduled" ||
										broadcast.status === "sending") && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => cancelMutation.mutate(broadcast._id)}
											disabled={cancelMutation.isPending}
										>
											Cancel
										</Button>
									)}
									<DropdownMenu>
										<DropdownMenuTrigger>
											<Button variant="ghost" size="icon">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => openEditDialog(broadcast)}
											>
												<Edit2 className="h-4 w-4 mr-2" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="text-destructive"
												onClick={() => deleteMutation.mutate(broadcast._id)}
												disabled={deleteMutation.isPending}
											>
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
// SEQUENCES TAB
// ============================================================================

function SequencesTab() {
	const { zernio, loading: zernioLoading } = useZernio();
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);
	const [form, setForm] = useState({
		name: "",
		accountId: "",
		platform: "instagram" as ProfilePlatform,
		profileId: "",
		description: "",
		steps: [{ message: "", delayMinutes: 60 }],
	});

	// Fetch sequences
	const { data: sequencesData, isLoading } = useQuery({
		queryKey: ["inbox", "sequences"],
		queryFn: async () => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.sequences.listSequences({});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return (res.data?.sequences ?? []) as Sequence[];
		},
		enabled: !!zernio,
	});

	// Create mutation
	const createMutation = useMutation({
		mutationFn: async (body: {
			profileId: string;
			accountId: string;
			platform: ProfilePlatform;
			name: string;
			description?: string;
			steps?: Array<{
				order: number;
				delayMinutes: number;
				message?: { text?: string };
			}>;
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.sequences.createSequence({ body });
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "sequences"] });
			closeDialog();
		},
	});

	// Update mutation
	const updateMutation = useMutation({
		mutationFn: async ({
			sequenceId,
			...body
		}: {
			sequenceId: string;
			name?: string;
			description?: string;
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.sequences.updateSequence({
				path: { sequenceId },
				body,
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "sequences"] });
			closeDialog();
		},
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: async (sequenceId: string) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.sequences.deleteSequence({
				path: { sequenceId },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "sequences"] });
		},
	});

	// Activate mutation
	const activateMutation = useMutation({
		mutationFn: async (sequenceId: string) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.sequences.activateSequence({
				path: { sequenceId },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "sequences"] });
		},
	});

	// Pause mutation
	const pauseMutation = useMutation({
		mutationFn: async (sequenceId: string) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.sequences.pauseSequence({
				path: { sequenceId },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "sequences"] });
		},
	});

	const openCreateDialog = () => {
		setEditingSequence(null);
		setForm({
			name: "",
			accountId: "",
			platform: "instagram",
			profileId: "",
			description: "",
			steps: [{ message: "", delayMinutes: 60 }],
		});
		setIsDialogOpen(true);
	};

	const openEditDialog = (sequence: Sequence) => {
		setEditingSequence(sequence);
		setForm({
			name: sequence.name,
			accountId: sequence.accountId || "",
			platform: (sequence.platform as ProfilePlatform) || "instagram",
			profileId: "",
			description: sequence.description || "",
			steps: [{ message: sequence.messagePreview || "", delayMinutes: 60 }],
		});
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setEditingSequence(null);
	};

	const saveSequence = () => {
		const steps = form.steps
			.filter((s) => s.message)
			.map((s, i) => ({
				order: i + 1,
				delayMinutes: s.delayMinutes,
				message: { text: s.message },
			}));

		if (editingSequence) {
			updateMutation.mutate({
				sequenceId: editingSequence._id,
				name: form.name,
				description: form.description || undefined,
			});
		} else {
			createMutation.mutate({
				profileId: form.profileId || "",
				accountId: form.accountId,
				platform: form.platform,
				name: form.name,
				description: form.description || undefined,
				steps,
			});
		}
	};

	const updateForm = (field: string, value: string | number) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const statusBadge = (status: Sequence["status"]) => {
		const config: Record<string, { label: string; className: string }> = {
			draft: { label: "Draft", className: "bg-gray-500/10 text-gray-500" },
			active: { label: "Active", className: "bg-green-500/10 text-green-500" },
			paused: {
				label: "Paused",
				className: "bg-yellow-500/10 text-yellow-500",
			},
		};
		return (
			<Badge className={cn("text-xs", config[status]?.className)}>
				{config[status]?.label}
			</Badge>
		);
	};

	if (zernioLoading) {
		return (
			<Card className="p-8 text-center">
				<p className="text-muted-foreground">Loading...</p>
			</Card>
		);
	}

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
						<DialogTitle>
							{editingSequence ? "Edit Sequence" : "Create Sequence"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block">
								Sequence Name
							</label>
							<Input
								placeholder="e.g., Welcome Series"
								value={form.name}
								onChange={(e) => updateForm("name", e.target.value)}
							/>
						</div>
						{!editingSequence && (
							<>
								<div>
									<label className="text-sm font-medium mb-2 block">
										Platform
									</label>
									<Select
										value={form.platform}
										onValueChange={(v) =>
											updateForm("platform", v ?? "instagram")
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="instagram">Instagram</SelectItem>
											<SelectItem value="facebook">Facebook</SelectItem>
											<SelectItem value="telegram">Telegram</SelectItem>
											<SelectItem value="twitter">X (Twitter)</SelectItem>
											<SelectItem value="bluesky">Bluesky</SelectItem>
											<SelectItem value="reddit">Reddit</SelectItem>
											<SelectItem value="whatsapp">WhatsApp</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">
										Account ID
									</label>
									<Input
										placeholder="Account ID"
										value={form.accountId}
										onChange={(e) => updateForm("accountId", e.target.value)}
									/>
								</div>
							</>
						)}
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
								disabled={!form.name || (!editingSequence && !form.accountId)}
								onClick={saveSequence}
							>
								{editingSequence ? "Save Changes" : "Create Sequence"}
							</Button>
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
												{sequence.stepsCount ?? 0} step
												{sequence.stepsCount !== 1 ? "s" : ""}
											</span>
											{sequence.totalEnrolled !== undefined && (
												<span className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													{sequence.totalEnrolled} enrolled
												</span>
											)}
											{sequence.platform && (
												<span className="uppercase">{sequence.platform}</span>
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
											onClick={() => activateMutation.mutate(sequence._id)}
											disabled={activateMutation.isPending}
										>
											Activate
										</Button>
									)}
									{sequence.status === "active" && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => pauseMutation.mutate(sequence._id)}
											disabled={pauseMutation.isPending}
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
											<DropdownMenuItem
												onClick={() => openEditDialog(sequence)}
											>
												<Edit2 className="h-4 w-4 mr-2" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="text-destructive"
												onClick={() => deleteMutation.mutate(sequence._id)}
												disabled={deleteMutation.isPending}
											>
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
// COMMENT-TO-DM TAB
// ============================================================================

function CommentToDmTab() {
	const { zernio, loading: zernioLoading } = useZernio();
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingAutomation, setEditingAutomation] =
		useState<CommentAutomation | null>(null);
	const [form, setForm] = useState<AutomationForm>(emptyForm);
	const [platformFilter, setPlatformFilter] = useState<
		"all" | "instagram" | "facebook"
	>("all");

	// Fetch automations
	const { data: automationsData, isLoading } = useQuery({
		queryKey: ["inbox", "comment-automations", { platform: platformFilter }],
		queryFn: async () => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.commentautomations.listCommentAutomations({
				query: platformFilter !== "all" ? { platform: platformFilter } : {},
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
			return (res.data?.automations ?? []) as CommentAutomation[];
		},
		enabled: !!zernio,
	});

	// Create mutation
	const createMutation = useMutation({
		mutationFn: async (body: {
			profileId: string;
			accountId: string;
			platformPostId?: string;
			postId?: string;
			postTitle?: string;
			name: string;
			keywords?: string[];
			matchMode?: "exact" | "contains";
			dmMessage: string;
			buttons?: Array<{
				type: "url" | "phone";
				text: string;
				url?: string;
				phone?: string;
			}>;
			commentReply?: string;
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.commentautomations.createCommentAutomation({
				body,
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
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
			matchMode?: "exact" | "contains";
			dmMessage?: string;
			commentReply?: string;
			isActive?: boolean;
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.commentautomations.updateCommentAutomation({
				path: { automationId },
				body,
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
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
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.commentautomations.deleteCommentAutomation({
				path: { automationId },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
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
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.commentautomations.updateCommentAutomation({
				path: { automationId },
				body: { isActive },
			});
			if (res.error) throw new Error(getZernioErrorMessage(res.error));
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
			accountId: automation.accountId || "",
			platform: automation.platform || "instagram",
			profileId: automation.profileId || "",
			platformPostId: automation.platformPostId || "",
			keywords: automation.keywords?.join(", ") || "",
			matchMode: automation.matchMode || "contains",
			dmMessage: automation.dmMessage || "",
			commentReply: automation.commentReply || "",
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
				commentReply: form.commentReply || undefined,
			});
		} else {
			createMutation.mutate({
				profileId: form.profileId || "",
				accountId: form.accountId,
				platformPostId: form.platformPostId || undefined,
				name: form.name,
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

	if (zernioLoading) {
		return (
			<Card className="p-8 text-center">
				<p className="text-muted-foreground">Loading...</p>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<p className="text-sm text-muted-foreground">
						{activeCount} active rule{activeCount !== 1 ? "s" : ""}
					</p>
					<Select
						value={platformFilter}
						onValueChange={(v) =>
							setPlatformFilter(v as "all" | "instagram" | "facebook")
						}
					>
						<SelectTrigger className="w-[140px] h-8">
							<SelectValue placeholder="Platform" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Platforms</SelectItem>
							<SelectItem value="instagram">Instagram</SelectItem>
							<SelectItem value="facebook">Facebook</SelectItem>
						</SelectContent>
					</Select>
				</div>
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
							/>
						</div>

						{!editingAutomation && (
							<>
								<div>
									<label className="text-sm font-medium mb-2 block">
										Platform
									</label>
									<Select
										value={form.platform}
										onValueChange={(v) =>
											updateForm("platform", v as ProfilePlatform)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="instagram">Instagram</SelectItem>
											<SelectItem value="facebook">Facebook</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">
										Account ID
									</label>
									<Input
										placeholder="Instagram or Facebook account ID"
										value={form.accountId}
										onChange={(e) => updateForm("accountId", e.target.value)}
									/>
								</div>
							</>
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
								<SelectTrigger>
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
								className="resize-none"
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
								className="resize-none"
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
										{automation.platform && (
											<Badge variant="outline" className="shrink-0 uppercase">
												{automation.platform}
											</Badge>
										)}
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
												{automation.accountId}
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

										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>{automation.createdAt}</span>
										</div>
									</div>

									{automation.stats && (
										<div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
											{automation.stats.triggered !== undefined && (
												<span>Triggered: {automation.stats.triggered}</span>
											)}
											{automation.stats.dmsSent !== undefined && (
												<span>Sent: {automation.stats.dmsSent}</span>
											)}
											{automation.stats.dmsFailed !== undefined && (
												<span>Failed: {automation.stats.dmsFailed}</span>
											)}
										</div>
									)}
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
