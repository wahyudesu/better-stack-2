"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenpost/ui/components/avatar";
import {
	Download,
	Instagram,
	MessageSquare,
	MoreVertical,
	Music,
	Search,
	Twitter,
	Users,
	Youtube,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
import {
	DepthButtonGroup,
	GroupedDepthButton,
} from "@/components/ui/depth-buttons";
import { Input } from "@/components/ui/input";
import { mockContacts } from "@/data/inbox-mock";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Contact {
	id: string;
	name: string;
	email: string;
	company: string;
	avatarUrl: string;
	tags: string[];
	notes: string;
	platform: string;
	isSubscribed: boolean;
	lastMessageSentAt: string | null;
	messagesSentCount: number;
}

const platformConfig: Record<
	string,
	{ icon: React.ElementType; color: string; bg: string; name: string }
> = {
	instagram: {
		icon: Instagram,
		color: "text-pink-500",
		bg: "bg-pink-500/10",
		name: "Instagram",
	},
	tiktok: {
		icon: Music,
		color: "text-gray-100",
		bg: "bg-gray-100/10 dark:bg-gray-800/50",
		name: "TikTok",
	},
	twitter: {
		icon: Twitter,
		color: "text-blue-400",
		bg: "bg-blue-500/10",
		name: "Twitter",
	},
	youtube: {
		icon: Youtube,
		color: "text-red-500",
		bg: "bg-red-500/10",
		name: "YouTube",
	},
	facebook: {
		icon: Users,
		color: "text-blue-600",
		bg: "bg-blue-500/10",
		name: "Facebook",
	},
	telegram: {
		icon: MessageSquare,
		color: "text-blue-400",
		bg: "bg-blue-400/10",
		name: "Telegram",
	},
	whatsapp: {
		icon: MessageSquare,
		color: "text-green-500",
		bg: "bg-green-500/10",
		name: "WhatsApp",
	},
};

function getPlatformConfig(platform: string) {
	return (
		platformConfig[platform] ?? {
			icon: MessageSquare,
			color: "text-muted-foreground",
			bg: "bg-muted",
			name: platform,
		}
	);
}

// Export to CSV function
function exportToCSV(contacts: Contact[]) {
	const headers = [
		"Name",
		"Email",
		"Company",
		"Platform",
		"Tags",
		"Notes",
		"Subscribed",
		"Messages Sent",
		"Last Message At",
	];
	const csvRows = [
		headers.join(","),
		...contacts.map((c) =>
			[
				`"${c.name}"`,
				`"${c.email}"`,
				`"${c.company}"`,
				`"${c.platform}"`,
				`"${c.tags.join("; ")}"`,
				`"${c.notes.replace(/"/g, '""')}"`,
				c.isSubscribed ? "Yes" : "No",
				c.messagesSentCount,
				c.lastMessageSentAt ? `"${c.lastMessageSentAt}"` : "",
			].join(","),
		),
	];

	const csvContent = csvRows.join("\n");
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `contacts_export_${new Date().toISOString().split("T")[0]}.csv`;
	link.click();
	URL.revokeObjectURL(url);
}

export function ContactsContent() {
	const [contacts, setContacts] = useState<Contact[]>(
		mockContacts as unknown as Contact[],
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [tagFilter, setTagFilter] = useState<string | null>(null);
	const [platformFilter, setPlatformFilter] = useState<string>("all");
	const [editingContact, setEditingContact] = useState<Contact | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState<Partial<Contact>>({});

	const allTags = useMemo(() => {
		const tags = new Set<string>();
		contacts.forEach((c) => c.tags.forEach((t) => tags.add(t)));
		return Array.from(tags).sort();
	}, [contacts]);

	const allPlatforms = useMemo(() => {
		return ["all", ...new Set(contacts.map((c) => c.platform))];
	}, [contacts]);

	const filteredContacts = contacts.filter((c) => {
		const matchesSearch =
			searchQuery === "" ||
			c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.company.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesTag = !tagFilter || c.tags.includes(tagFilter);
		const matchesPlatform =
			platformFilter === "all" || c.platform === platformFilter;
		return matchesSearch && matchesTag && matchesPlatform;
	});

	const handleSave = () => {
		if (!formData.name) return;

		if (editingContact) {
			setContacts((prev) =>
				prev.map((c) =>
					c.id === editingContact.id ? ({ ...c, ...formData } as Contact) : c,
				),
			);
		} else {
			const newContact: Contact = {
				id: `contact_${Date.now()}`,
				name: formData.name || "",
				email: formData.email || "",
				company: formData.company || "",
				avatarUrl:
					formData.avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`,
				tags: formData.tags || [],
				notes: formData.notes || "",
				platform: formData.platform || "instagram",
				isSubscribed: true,
				lastMessageSentAt: null,
				messagesSentCount: 0,
			};
			setContacts((prev) => [newContact, ...prev]);
		}
		setShowForm(false);
		setEditingContact(null);
		setFormData({});
	};

	const handleEdit = (contact: Contact) => {
		setEditingContact(contact);
		setFormData(contact);
		setShowForm(true);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Delete this contact?")) return;
		setContacts((prev) => prev.filter((c) => c.id !== id));
	};

	const handleExport = () => {
		exportToCSV(filteredContacts);
	};

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			{/* Header */}
			<div className="flex items-start justify-between mb-6">
				<div>
					<h1 className="font-display text-2xl font-bold tracking-tight">
						Contacts
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your contacts and customer relationships
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleExport}
						disabled={filteredContacts.length === 0}
					>
						<Download className="h-4 w-4 mr-2" />
						Export CSV ({filteredContacts.length})
					</Button>
					<Button onClick={() => setShowForm(!showForm)} size="sm">
						{showForm ? "Close" : "+ Add Contact"}
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="flex items-center gap-2 flex-wrap mb-4">
				<div className="relative flex-1 min-w-[200px]">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by name, email, company..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-9"
					/>
				</div>

				<DepthButtonMenu
					value={platformFilter}
					onChange={(v) => setPlatformFilter(v || "all")}
					options={allPlatforms.map((p) => ({
						value: p,
						label: p === "all" ? "All Platforms" : getPlatformConfig(p).name,
					}))}
					placeholder="Platform"
					size="sm"
				/>

				<DepthButtonGroup>
					<GroupedDepthButton
						position="first"
						size="sm"
						variant={!tagFilter ? "blue" : "outline"}
						onClick={() => setTagFilter(null)}
					>
						All
					</GroupedDepthButton>
					{allTags.slice(0, 3).map((tag, idx) => (
						<GroupedDepthButton
							key={tag}
							position={
								idx === Math.min(2, allTags.length - 1) ? "last" : "middle"
							}
							size="sm"
							variant={tagFilter === tag ? "blue" : "outline"}
							onClick={() => setTagFilter(tag)}
						>
							{tag}
						</GroupedDepthButton>
					))}
				</DepthButtonGroup>
			</div>

			{/* Contact Form */}
			{showForm && (
				<Card className="mb-4">
					<CardContent className="p-4 space-y-3">
						<h3 className="font-semibold">
							{editingContact ? "Edit Contact" : "New Contact"}
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<Input
								placeholder="Name *"
								value={formData.name || ""}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
							<Input
								placeholder="Email"
								type="email"
								value={formData.email || ""}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
							<Input
								placeholder="Company"
								value={formData.company || ""}
								onChange={(e) =>
									setFormData({ ...formData, company: e.target.value })
								}
							/>
							<DepthButtonMenu
								value={formData.platform || "instagram"}
								onChange={(v) =>
									setFormData({ ...formData, platform: v || "instagram" })
								}
								options={[
									{ value: "instagram", label: "Instagram" },
									{ value: "twitter", label: "Twitter" },
									{ value: "facebook", label: "Facebook" },
									{ value: "telegram", label: "Telegram" },
									{ value: "whatsapp", label: "WhatsApp" },
								]}
								placeholder="Platform"
								size="default"
							/>
						</div>
						<Input
							placeholder="Tags (comma separated)"
							value={formData.tags?.join(", ") || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									tags: e.target.value
										.split(",")
										.map((t) => t.trim())
										.filter(Boolean),
								})
							}
						/>
						<Input
							placeholder="Notes"
							value={formData.notes || ""}
							onChange={(e) =>
								setFormData({ ...formData, notes: e.target.value })
							}
						/>
						<div className="flex gap-2">
							<Button onClick={handleSave}>
								{editingContact ? "Save Changes" : "Create Contact"}
							</Button>
							<Button
								variant="outline"
								onClick={() => {
									setShowForm(false);
									setEditingContact(null);
									setFormData({});
								}}
							>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Stats Summary */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
				<Card>
					<CardContent className="p-3 text-center">
						<p className="text-2xl font-bold">{contacts.length}</p>
						<p className="text-xs text-muted-foreground">Total Contacts</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-3 text-center">
						<p className="text-2xl font-bold">
							{contacts.filter((c) => c.isSubscribed).length}
						</p>
						<p className="text-xs text-muted-foreground">Subscribed</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-3 text-center">
						<p className="text-2xl font-bold">
							{contacts.reduce((sum, c) => sum + c.messagesSentCount, 0)}
						</p>
						<p className="text-xs text-muted-foreground">Messages Sent</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-3 text-center">
						<p className="text-2xl font-bold">{allTags.length}</p>
						<p className="text-xs text-muted-foreground">Tags Used</p>
					</CardContent>
				</Card>
			</div>

			{/* Contacts Grid */}
			{filteredContacts.length === 0 ? (
				<Card className="border-border/50 p-8 text-center">
					<Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
					<p className="text-muted-foreground">
						{contacts.length === 0
							? "No contacts yet. Add your first contact to get started."
							: "No contacts match your search criteria."}
					</p>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{filteredContacts.map((contact) => {
						const config = getPlatformConfig(contact.platform);
						const Icon = config.icon;
						return (
							<Card
								key={contact.id}
								className="border-border/50 p-4 hover:bg-muted/30 transition-colors"
							>
								<div className="flex items-start gap-3">
									<Avatar className="h-12 w-12">
										<AvatarImage src={contact.avatarUrl} />
										<AvatarFallback>
											{contact.name[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-semibold text-sm">
												{contact.name}
											</span>
											<div className={cn("flex items-center", config.color)}>
												<Icon className="h-3 w-3" />
											</div>
										</div>
										<p className="text-xs text-muted-foreground">
											{contact.email}
										</p>
										{contact.company && (
											<p className="text-xs text-muted-foreground">
												{contact.company}
											</p>
										)}
										<div className="flex items-center gap-1 mt-2 flex-wrap">
											{contact.tags.map((tag) => (
												<Badge
													key={tag}
													variant="outline"
													className="text-[10px] px-1.5 py-0 h-4"
												>
													{tag}
												</Badge>
											))}
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7 shrink-0"
										onClick={() => handleEdit(contact)}
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</div>
								{contact.notes && (
									<p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-muted/50 rounded px-2 py-1">
										{contact.notes}
									</p>
								)}
								<div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											className="h-6 text-[10px]"
											onClick={() => handleEdit(contact)}
										>
											Edit
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-6 text-[10px] text-destructive"
											onClick={() => handleDelete(contact.id)}
										>
											Delete
										</Button>
									</div>
									{contact.lastMessageSentAt && (
										<span className="text-[10px] text-muted-foreground">
											{formatRelativeTime(contact.lastMessageSentAt)}
										</span>
									)}
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
