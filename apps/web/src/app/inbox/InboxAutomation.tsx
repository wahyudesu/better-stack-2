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
	PLATFORM_MULTI_OPTIONS,
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
import type {
	AutomationRule,
	AutomationType,
	TriggerType,
} from "@/lib/types/inbox-automation";
import { cn } from "@/lib/utils";

const mockRules: AutomationRule[] = [
	{
		id: "1",
		type: "auto-reply",
		name: "Welcome DM",
		enabled: true,
		trigger: "all",
		platforms: ["instagram", "tiktok"],
		response:
			"Hey! Thanks for reaching out! 👋 I'll get back to you as soon as possible. In the meantime, feel free to check out my latest content!",
		delaySeconds: 30,
		createdAt: "2025-03-15",
	},
	{
		id: "2",
		type: "auto-comment",
		name: "Thank you for support",
		enabled: true,
		trigger: "keyword",
		keywords: ["love", "amazing", "awesome", "great", "fire"],
		platforms: ["instagram", "tiktok", "twitter"],
		response: "Thank you so much for your support! 🙏💜",
		delaySeconds: 60,
		createdAt: "2025-03-10",
	},
	{
		id: "3",
		type: "auto-comment",
		name: "Collaboration inquiry",
		enabled: false,
		trigger: "keyword",
		keywords: ["collab", "collaborate", "partnership", "sponsor"],
		platforms: ["instagram", "linkedin"],
		response:
			"Thanks for your interest in collaborating! Please send us a DM with more details about your proposal.",
		delaySeconds: 120,
		createdAt: "2025-03-08",
	},
];

interface AutomationRuleForm {
	name: string;
	type: AutomationType;
	trigger: TriggerType;
	keywords: string;
	platforms: PlatformMultiValue[];
	response: string;
	delaySeconds: number;
}

const emptyForm: AutomationRuleForm = {
	name: "",
	type: "auto-reply",
	trigger: "all",
	keywords: "",
	platforms: ["instagram"],
	response: "",
	delaySeconds: 30,
};

export function InboxAutomation() {
	const [rules, setRules] = useState<AutomationRule[]>(mockRules);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
	const [form, setForm] = useState<AutomationRuleForm>(emptyForm);

	const openCreateDialog = () => {
		setEditingRule(null);
		setForm({ ...emptyForm });
		setIsDialogOpen(true);
	};

	const openEditDialog = (rule: AutomationRule) => {
		setEditingRule(rule);
		setForm({
			name: rule.name,
			type: rule.type,
			trigger: rule.trigger,
			keywords: rule.keywords?.join(", ") || "",
			platforms: rule.platforms as PlatformMultiValue[],
			response: rule.response,
			delaySeconds: rule.delaySeconds,
		});
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setEditingRule(null);
		setForm({ ...emptyForm });
	};

	const saveRule = () => {
		const keywordsArray = form.keywords
			.split(",")
			.map((k) => k.trim().toLowerCase())
			.filter(Boolean);

		if (editingRule) {
			setRules(
				rules.map((r) =>
					r.id === editingRule.id
						? {
								...r,
								name: form.name,
								type: form.type,
								trigger: form.trigger,
								keywords: keywordsArray,
								platforms: form.platforms,
								response: form.response,
								delaySeconds: form.delaySeconds,
							}
						: r,
				),
			);
		} else {
			const newRule: AutomationRule = {
				id: `rule-${Date.now()}`,
				name: form.name,
				type: form.type,
				trigger: form.trigger,
				keywords: keywordsArray,
				platforms: form.platforms,
				response: form.response,
				delaySeconds: form.delaySeconds,
				enabled: true,
				createdAt: new Date().toISOString().split("T")[0],
			};
			setRules([...rules, newRule]);
		}
		closeDialog();
	};

	const toggleRule = (id: string) => {
		setRules(
			rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
		);
	};

	const deleteRule = (id: string) => {
		setRules(rules.filter((r) => r.id !== id));
	};

	const updateForm = (field: keyof AutomationRuleForm, value: any) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const activeRules = rules.filter((r) => r.enabled).length;

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
							{activeRules} active automation{activeRules !== 1 ? "s" : ""}
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
							{editingRule ? "Edit Automation Rule" : "Create Automation Rule"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						{/* Name */}
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

						{/* Type */}
						<div>
							<label className="text-sm font-medium mb-2 block">
								Automation Type
							</label>
							<Select
								value={form.type}
								onValueChange={(v) => updateForm("type", v as AutomationType)}
							>
								<SelectTrigger className="font-medium">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="auto-reply">
										<div className="flex items-center gap-2">
											<MessageSquare className="h-4 w-4" />
											Auto Reply (DMs)
										</div>
									</SelectItem>
									<SelectItem value="auto-comment">
										<div className="flex items-center gap-2">
											<AtSign className="h-4 w-4" />
											Auto Comment
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Trigger */}
						<div>
							<label className="text-sm font-medium mb-2 block">Trigger</label>
							<Select
								value={form.trigger}
								onValueChange={(v) => updateForm("trigger", v as TriggerType)}
							>
								<SelectTrigger className="font-medium">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										<span>All incoming messages/comments</span>
									</SelectItem>
									<SelectItem value="keyword">
										<span>Contains specific keywords</span>
									</SelectItem>
									<SelectItem value="followers-only">
										<span>Followers only</span>
									</SelectItem>
									<SelectItem value="verified-only">
										<span>Verified users only</span>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Keywords (only show when trigger is keyword) */}
						{form.trigger === "keyword" && (
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
									Separate keywords with commas
								</p>
							</div>
						)}

						{/* Platforms */}
						<PlatformFilterMulti
							values={form.platforms}
							onChange={(values) => updateForm("platforms", values)}
							label="Platforms"
						/>

						{/* Response */}
						<div>
							<label className="text-sm font-medium mb-2 block">
								Response Message
							</label>
							<Textarea
								placeholder="Type your automated response here..."
								value={form.response}
								onChange={(e) => updateForm("response", e.target.value)}
								rows={4}
								className="resize-none font-medium"
							/>
						</div>

						{/* Delay */}
						<div>
							<label className="text-sm font-medium mb-2 block">
								<Clock className="h-4 w-4 inline mr-1" />
								Delay before sending
							</label>
							<div className="flex items-center gap-3">
								<Input
									type="number"
									min={0}
									max={3600}
									value={form.delaySeconds}
									onChange={(e) =>
										updateForm("delaySeconds", parseInt(e.target.value) || 0)
									}
									className="w-24 font-medium"
								/>
								<span className="text-sm text-muted-foreground">seconds</span>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2 pt-2">
							<Button
								variant="outline"
								onClick={closeDialog}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								onClick={saveRule}
								className="flex-1"
								disabled={!form.name || !form.response}
							>
								{editingRule ? "Save Changes" : "Create Rule"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Rules List */}
			<div className="space-y-3">
				{rules.length === 0 ? (
					<Card className="p-8 text-center">
						<Bot className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
						<p className="text-muted-foreground">No automation rules yet</p>
						<p className="text-sm text-muted-foreground mt-1">
							Create your first rule to automate responses
						</p>
					</Card>
				) : (
					rules.map((rule) => (
						<Card
							key={rule.id}
							className={cn(
								"p-4 transition-all",
								!rule.enabled && "opacity-60",
							)}
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="font-semibold truncate">{rule.name}</h3>
										<Badge
											variant={rule.enabled ? "default" : "secondary"}
											className={cn(
												"shrink-0",
												rule.type === "auto-reply" &&
													"bg-blue-500/10 text-blue-500",
											)}
										>
											{rule.type === "auto-reply" ? (
												<>
													<MessageSquare className="h-3 w-3 mr-1" />
													Auto Reply
												</>
											) : (
												<>
													<AtSign className="h-3 w-3 mr-1" />
													Auto Comment
												</>
											)}
										</Badge>
										{!rule.enabled && (
											<Badge variant="outline" className="shrink-0">
												Disabled
											</Badge>
										)}
									</div>

									<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
										{rule.response}
									</p>

									<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
										{/* Platforms */}
										<div className="flex items-center gap-1">
											<span>Platforms:</span>
											<PlatformAvatarGroup
												platforms={rule.platforms as Platform[]}
												maxVisible={3}
												size={16}
											/>
										</div>

										{/* Trigger */}
										<div className="flex items-center gap-1">
											<span>Trigger:</span>
											<span className="font-medium capitalize">
												{rule.trigger === "keyword"
													? "Keywords"
													: rule.trigger.replace("-", " ")}
											</span>
										</div>

										{/* Keywords */}
										{rule.keywords && rule.keywords.length > 0 && (
											<div className="flex items-center gap-1">
												<Hash className="h-3 w-3" />
												<span>{rule.keywords.join(", ")}</span>
											</div>
										)}

										{/* Delay */}
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>{rule.delaySeconds}s delay</span>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-2 shrink-0">
									<Switch
										checked={rule.enabled}
										onCheckedChange={() => toggleRule(rule.id)}
									/>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => openEditDialog(rule)}
									>
										<Edit2 className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteRule(rule.id)}
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
