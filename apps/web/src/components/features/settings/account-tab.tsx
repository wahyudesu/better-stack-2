/**
 * Account Settings Tab Component.
 */

"use client";

import { Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Mock user data (replace with actual auth when ClerkProvider is set up)
const mockUser = {
	id: "user_2xyz123abc",
	firstName: "John",
	lastName: "Doe",
	email: "john.doe@example.com",
	imageUrl: "",
	createdAt: new Date("2024-01-15"),
	lastSignInAt: new Date("2024-03-19"),
	emailVerified: true,
	twoFactorEnabled: false,
};

export function AccountTab() {
	const [fullName, setFullName] = useState(() => {
		if (mockUser.firstName && mockUser.lastName) {
			return `${mockUser.firstName} ${mockUser.lastName}`;
		}
		return mockUser.firstName || mockUser.email.split("@")[0] || "";
	});
	const [jobTitle, setJobTitle] = useState("User");
	const [originalFullName] = useState(() => {
		if (mockUser.firstName && mockUser.lastName) {
			return `${mockUser.firstName} ${mockUser.lastName}`;
		}
		return mockUser.firstName || mockUser.email.split("@")[0] || "";
	});
	const [originalJobTitle] = useState("User");
	const [avatarUrl, setAvatarUrl] = useState(mockUser.imageUrl || "");
	const [email] = useState(mockUser.email || "");
	const [userId] = useState(mockUser.id || "");

	const hasChanges =
		fullName !== originalFullName || jobTitle !== originalJobTitle;

	const handleAvatarClick = () => {
		// Would trigger Clerk's avatar upload in production
		console.log("Open avatar upload");
	};

	const handleSave = async () => {
		// Update user profile
		console.log("Profile updated:", fullName);
	};

	// Get user initials for fallback
	const getInitials = () => {
		if (mockUser.firstName && mockUser.lastName) {
			return `${mockUser.firstName[0]}${mockUser.lastName[0]}`.toUpperCase();
		}
		if (mockUser.firstName) {
			return mockUser.firstName[0].toUpperCase();
		}
		if (mockUser.email) {
			return mockUser.email[0].toUpperCase();
		}
		return "U";
	};

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardContent className="p-6 flex flex-col gap-6">
					<div>
						<p className="font-display font-semibold text-base">Profile</p>
						<p className="text-sm text-muted-foreground">
							Manage your personal information.
						</p>
					</div>

					{/* Clickable Avatar */}
					<div className="flex items-center gap-4">
						<button
							onClick={handleAvatarClick}
							className="relative group cursor-pointer"
						>
							<Avatar className="size-16 ring-2 ring-border group-hover:ring-primary transition-all">
								<AvatarImage src={mockUser.imageUrl} />
								<AvatarFallback>{getInitials()}</AvatarFallback>
							</Avatar>
							<div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<span className="text-white text-xs font-medium">Change</span>
							</div>
						</button>
						<div>
							<p className="text-sm font-medium">Profile Photo</p>
							<p className="text-xs text-muted-foreground">
								Upload a profile photo
							</p>
						</div>
					</div>

					{/* Form Fields */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label className="text-sm">First Name</Label>
							<Input
								value={mockUser.firstName || ""}
								onChange={(e) => setFullName(e.target.value)}
								className="h-10 font-medium"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="text-sm">Last Name</Label>
							<Input
								value={mockUser.lastName || ""}
								className="h-10 font-medium"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-sm">Email</Label>
						<Input
							value={email}
							type="email"
							className="h-10 bg-muted/50 cursor-not-allowed font-medium"
							disabled
						/>
						<p className="text-xs text-muted-foreground">
							Email cannot be changed
						</p>
					</div>

					{/* Account Info */}
					<div className="space-y-2">
						<Label className="text-sm">Account ID</Label>
						<div className="flex items-center gap-2">
							<Input
								value={userId}
								readOnly
								className="h-10 bg-muted/50 font-mono text-xs"
							/>
							<Button
								variant="ghost"
								size="icon"
								className="shrink-0"
								onClick={() => {
									navigator.clipboard.writeText(userId);
								}}
							>
								<Sparkles className="size-4" />
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Your unique account identifier
						</p>
					</div>

					{/* Save Button - Only show when there are changes */}
					{hasChanges && (
						<div className="flex justify-end pt-2">
							<Button onClick={handleSave}>Save Changes</Button>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-4 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Zap className="size-4 text-amber-500" />
							<div>
								<p className="font-display font-semibold text-sm">Plan Usage</p>
								<p className="text-xs text-muted-foreground">
									Pro Plan • Resets monthly
								</p>
							</div>
						</div>
						<Button variant="outline" size="sm">
							Upgrade
						</Button>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">AI Generations</span>
								<span className="font-medium">847 / 1,000</span>
							</div>
							<Progress value={84.7} className="h-2" />
						</div>

						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">Scheduled Posts</span>
								<span className="font-medium">23 / 50</span>
							</div>
							<Progress value={46} className="h-2" />
						</div>

						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">
									Connected Accounts
								</span>
								<span className="font-medium">5 / 10</span>
							</div>
							<Progress value={50} className="h-2" />
						</div>

						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">Storage Used</span>
								<span className="font-medium">2.3 GB / 5 GB</span>
							</div>
							<Progress value={46} className="h-2" />
						</div>

						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">Team Members</span>
								<span className="font-medium">3 / 5</span>
							</div>
							<Progress value={60} className="h-2" />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-4 space-y-3">
					<div>
						<p className="font-display font-semibold text-sm">Notifications</p>
						<p className="text-xs text-muted-foreground">
							Configure how you receive notifications.
						</p>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between py-1">
							<div>
								<p className="text-sm font-medium">Email Notifications</p>
								<p className="text-xs text-muted-foreground">
									Receive daily digest of activity
								</p>
							</div>
							<Switch />
						</div>
						<div className="flex items-center justify-between py-1">
							<div>
								<p className="text-sm font-medium">Push Notifications</p>
								<p className="text-xs text-muted-foreground">
									Browser push notifications
								</p>
							</div>
							<Switch defaultChecked />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="border-destructive/30">
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-display font-semibold text-sm text-destructive">
								Danger Zone
							</p>
							<p className="text-xs text-muted-foreground">
								Irreversible and destructive actions.
							</p>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => console.log("Delete account")}
						>
							Manage Account
						</Button>
					</div>
					<p className="text-xs text-muted-foreground mt-2">
						Contact support to delete your account
					</p>
				</CardContent>
			</Card>

			{/* Account Info Card */}
			<Card>
				<CardContent className="p-4 space-y-3">
					<div>
						<p className="font-display font-semibold text-sm">
							Account Information
						</p>
						<p className="text-xs text-muted-foreground">
							Your account details
						</p>
					</div>
					<div className="flex flex-col gap-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Account Created</span>
							<span className="font-medium">
								{mockUser.createdAt
									? new Date(mockUser.createdAt).toLocaleDateString()
									: "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Last Sign In</span>
							<span className="font-medium">
								{mockUser.lastSignInAt
									? new Date(mockUser.lastSignInAt).toLocaleDateString()
									: "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Email Verified</span>
							<span
								className={cn(
									"font-medium",
									mockUser.emailVerified ? "text-success" : "text-warning",
								)}
							>
								{mockUser.emailVerified ? "✓ Verified" : "Pending"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">2FA Enabled</span>
							<span className="font-medium">
								{mockUser.twoFactorEnabled ? "Yes" : "No"}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
