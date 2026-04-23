"use client";

import {
	AtSign,
	Bot,
	Clock,
	Edit2,
	Hash,
	MessageSquare,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Platform } from "@/components/ui/PlatformIcon";
import { PlatformAvatarGroup } from "@/components/ui/platform-avatar-group";
import {
	PlatformFilterMulti,
	type PlatformMultiValue,
} from "@/components/ui/platform-filter";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/client";
import type { CommentAutomation } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface AutomationForm {
	name: string;
	accountId: string;
	keywords: string;
	platforms: PlatformMultiValue[];
	autoReply: string;
	assignTo: string;
}

const emptyForm: AutomationForm = {
	name: "",
	accountId: "",
	keywords: "",
	platforms: ["instagram"],
	autoReply: "",
	assignTo: "",
};

export function InboxAutomation() {
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
		mutationFn: async (body: Parameters<typeof api.createCommentAutomation>[0]) => {
			const res = await api.createCommentAutomation(body);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "comment-automations"] });
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
			autoReply?: string;
			assignTo?: string;
			isActive?: boolean;
		}) => {
			const res = await api.updateCommentAutomation(automationId, body);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "comment-automations"] });
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
			queryClient.invalidateQueries({ queryKey: ["inbox", "comment-automations"] });
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
			queryClient.invalidateQueries({ queryKey: ["inbox", "comment-automations"] });
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
			keywords: automation.keywords?.join(", ") || "",
			platforms: [], // Server doesn't track platforms per automation
			autoReply: automation.autoReply || "",
			assignTo: automation.assignTo || "",
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
				autoReply: form.autoReply,
				assignTo: form.assignTo,
			});
		} else {
			createMutation.mutate({
				name: form.name,
				accountId: form.accountId,
				keywords: keywordsArray,
				autoReply: form.autoReply,
				assignTo: form.assignTo,
			});
		}
	};

	const toggleAutomation = (automation: CommentAutomation) => {
		toggleMutation.mutate({
			automationId: automation._id,
			isActive: !automation.isActive,
		});
	};

	const deleteAutomation = (automationId: string) => {
		deleteMutation.mutate(automationId);
	};

	const activeCount = automationsData?.filter((a) => a.isActive).length ?? 0;

	const updateForm = (field: keyof AutomationForm, value: string | PlatformMultiValue[]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
						<Bot className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h2 className="font-display text-xl font-bold">Automation</h2>
						<p className="text-sm text-muted-foreground">
							{activeCount} active automation{activeCount !== 1 ? "s" : ""}
						</p>
					</div>
				</div>

				<Button onClick={openCreateDialog} className="gap-2">
					<Plus className="h-4 w-4" />
					New Rule
				</Button>
			</div>

			{/* Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{editingAutomation
								? "Edit Automation Rule"
								: "Create Automation Rule"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						{/* Name */}
						<div>
							<label
								htmlFor="automation-name"
								className="text-sm font-medium mb-2 block"
							>
								Rule Name
							</label>
							<Input
								id="automation-name"
								placeholder="e.g., Welcome DM, Thank you comment..."
								value={form.name}
								onChange={(e) => updateForm("name", e.target.value)}
								className="font-medium"
							/>
						</div>

						{/* Account ID (required for create) */}
						{!editingAutomation && (
							<div>
								<label
									htmlFor="automation-account"
									className="text-sm font-medium mb-2 block"
								>
									Account ID
								</label>
								<Input
									id="automation-account"
									placeholder="Account ID from connected accounts"
									value={form.accountId}
									onChange={(e) => updateForm("accountId", e.target.value)}
									className="font-medium"
								/>
							</div>
						)}

						{/* Keywords */}
						<div>
							<label
								htmlFor="automation-keywords"
								className="text-sm font-medium mb-2 block"
							>
								<Hash className="h-4 w-4 inline mr-1" />
								Keywords
							</label>
							<Input
								id="automation-keywords"
								placeholder="love, amazing, awesome, great"
								value={form.keywords}
								onChange={(e) => updateForm("keywords", e.target.value)}
								className="font-medium"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Separate keywords with commas. Leave empty to match all.
							</p>
						</div>

						{/* Auto Reply Message */}
						<div>
							<label
								htmlFor="automation-reply"
								className="text-sm font-medium mb-2 block"
							>
								<MessageSquare className="h-4 w-4 inline mr-1" />
								Auto Reply Message
							</label>
							<Textarea
								id="automation-reply"
								placeholder="Type your automated response here..."
								value={form.autoReply}
								onChange={(e) => updateForm("autoReply", e.target.value)}
								rows={4}
								className="resize-none font-medium"
							/>
						</div>

						{/* Assign To */}
						<div>
							<label
								htmlFor="automation-assign"
								className="text-sm font-medium mb-2 block"
							>
								<AtSign className="h-4 w-4 inline mr-1" />
								Assign To (Optional)
							</label>
							<Input
								id="automation-assign"
								placeholder="User or team to assign"
								value={form.assignTo}
								onChange={(e) => updateForm("assignTo", e.target.value)}
								className="font-medium"
							/>
						</div>

						{/* Actions */}
						<div className="flex gap-2 pt-2">
							<Button variant="outline" onClick={closeDialog} className="flex-1">
								Cancel
							</Button>
							<Button
								onClick={saveAutomation}
								className="flex-1"
								disabled={!form.name || (!form.accountId && !editingAutomation)}
							>
								{editingAutomation ? "Save Changes" : "Create Rule"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Rules List */}
			<div className="space-y-3">
				{isLoading ? (
					<Card className="p-8 text-center">
						<p className="text-muted-foreground">Loading automations...</p>
					</Card>
				) : !automationsData || automationsData.length === 0 ? (
					<Card className="p-8 text-center">
						<Bot className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
						<p className="text-muted-foreground">No automation rules yet</p>
						<p className="text-sm text-muted-foreground mt-1">
							Create your first rule to automate responses
						</p>
					</Card>
				) : (
					automationsData.map((automation) => (
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
										<h3 className="font-semibold truncate">{automation.name}</h3>
										<Badge
											variant={automation.isActive ? "default" : "secondary"}
											className="shrink-0 bg-blue-500/10 text-blue-500"
										>
											<MessageSquare className="h-3 w-3 mr-1" />
											Auto Comment
										</Badge>
										{!automation.isActive && (
											<Badge variant="outline" className="shrink-0">
												Disabled
											</Badge>
										)}
									</div>

									{automation.autoReply && (
										<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
											{automation.autoReply}
										</p>
									)}

									<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
										{/* Account */}
										<div className="flex items-center gap-1">
											<span>Account:</span>
											<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
												{automation.accountUsername || automation.accountId}
											</code>
										</div>

										{/* Keywords */}
										{automation.keywords && automation.keywords.length > 0 && (
											<div className="flex items-center gap-1">
												<Hash className="h-3 w-3" />
												<span>{automation.keywords.join(", ")}</span>
											</div>
										)}

										{/* Assign To */}
										{automation.assignTo && (
											<div className="flex items-center gap-1">
												<AtSign className="h-3 w-3" />
												<span>{automation.assignTo}</span>
											</div>
										)}

										{/* Created */}
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>{automation.createdAt}</span>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-2 shrink-0">
									<Switch
										checked={automation.isActive}
										onCheckedChange={() => toggleAutomation(automation)}
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
										onClick={() => deleteAutomation(automation._id)}
										className="text-destructive hover:text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</Card>
					))
				)}
			</div>
		</div>
	);
}