import { Puzzle, Settings, Shield, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";

const tabs = [
	{ id: "general", label: "General", icon: Settings },
	{ id: "account", label: "Account", icon: User },
	{ id: "integrations", label: "Integrations", icon: Puzzle },
	{ id: "security", label: "Security", icon: Shield },
] as const;

type TabId = (typeof tabs)[number]["id"];

function GeneralTab() {
	return (
		<div className="space-y-5">
			<Card className="border-border/50">
				<CardContent className="p-5 space-y-3">
					<p className="text-sm font-semibold">Project name</p>
					<Input defaultValue="Acme Corp" />
					<div className="flex justify-end">
						<Button size="sm">Save</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="border-border/50">
				<CardContent className="p-5 space-y-3">
					<p className="text-sm font-semibold">Public stats</p>
					<p className="text-xs text-muted-foreground">
						Share your project statistics publicly.
					</p>
					<div className="flex items-center gap-3">
						<Switch />
						<span className="text-sm text-muted-foreground">Private</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function AccountTab() {
	return (
		<div className="space-y-5">
			<Card className="border-border/50">
				<CardContent className="p-5 space-y-4">
					<p className="text-sm font-semibold">Profile</p>
					<div className="flex items-center gap-4">
						<Avatar className="h-14 w-14">
							<AvatarImage src="https://i.pravatar.cc/150?u=me" />
							<AvatarFallback>ME</AvatarFallback>
						</Avatar>
						<Button variant="outline" size="sm">
							Change avatar
						</Button>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label>Name</Label>
							<Input defaultValue="Raka Pratama" />
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<Input defaultValue="raka@acme.com" type="email" />
						</div>
					</div>
					<div className="flex justify-end">
						<Button size="sm">Save</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="border-border/50">
				<CardContent className="p-5 space-y-3">
					<p className="text-sm font-semibold">Notifications</p>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-sm">Email notifications</p>
							<Switch />
						</div>
						<Separator />
						<div className="flex items-center justify-between">
							<p className="text-sm">Push notifications</p>
							<Switch defaultChecked />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function IntegrationsTab() {
	const integrations = [
		{ name: "Instagram", connected: true, icon: "📸" },
		{ name: "TikTok", connected: true, icon: "🎵" },
		{ name: "Twitter/X", connected: false, icon: "𝕏" },
		{ name: "YouTube", connected: true, icon: "▶️" },
	];

	return (
		<div className="space-y-3">
			{integrations.map((i) => (
				<Card key={i.name} className="border-border/50">
					<CardContent className="flex items-center justify-between p-4">
						<div className="flex items-center gap-3">
							<span className="text-lg">{i.icon}</span>
							<p className="text-sm font-medium">{i.name}</p>
						</div>
						<Button variant={i.connected ? "outline" : "default"} size="sm">
							{i.connected ? "Connected" : "Connect"}
						</Button>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

function SecurityTab() {
	return (
		<div className="space-y-5">
			<Card className="border-border/50">
				<CardContent className="p-5 space-y-3">
					<p className="text-sm font-semibold">Password</p>
					<div className="space-y-3">
						<div className="space-y-2">
							<Label>Current password</Label>
							<Input type="password" />
						</div>
						<div className="space-y-2">
							<Label>New password</Label>
							<Input type="password" />
						</div>
					</div>
					<div className="flex justify-end">
						<Button size="sm">Update</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="border-border/50">
				<CardContent className="p-5 space-y-3">
					<p className="text-sm font-semibold">Two-factor authentication</p>
					<div className="flex items-center gap-3">
						<Switch />
						<span className="text-sm text-muted-foreground">Disabled</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<TabId>("general");

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Settings</h1>
				<p className="text-sm text-muted-foreground">Manage your project.</p>
			</div>

			<div className="flex gap-8">
				<nav className="w-[160px] shrink-0 space-y-0.5">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
								activeTab === tab.id
									? "bg-muted font-medium text-foreground"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
							)}
						>
							<tab.icon className="h-4 w-4" />
							{tab.label}
						</button>
					))}
				</nav>

				<div className="flex-1 min-w-0">
					{activeTab === "general" && <GeneralTab />}
					{activeTab === "account" && <AccountTab />}
					{activeTab === "integrations" && <IntegrationsTab />}
					{activeTab === "security" && <SecurityTab />}
				</div>
			</div>
		</div>
	);
}
