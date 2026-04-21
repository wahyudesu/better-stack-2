/**
 * Account Settings Tab Component.
 */

"use client";

import {
	AlertCircle,
	CheckCircle2,
	KeyRound,
	Loader2,
	Sparkles,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores";
import type { UsageStats } from "@/stores/auth-store";

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
	const {
		apiKey,
		setApiKey,
		setUsageStats,
		setIsValidating,
		isValidating,
		error,
		setError,
		hasHydrated,
	} = useAuthStore();
	const [apiKeyInput, setApiKeyInput] = useState("");
	const [showKey, setShowKey] = useState(false);

	const [fullName, setFullName] = useState(() => {
		if (mockUser.firstName && mockUser.lastName) {
			return `${mockUser.firstName} ${mockUser.lastName}`;
		}
		return mockUser.firstName || mockUser.email.split("@")[0] || "";
	});
	const [jobTitle, _setJobTitle] = useState("User");
	const [originalFullName] = useState(() => {
		if (mockUser.firstName && mockUser.lastName) {
			return `${mockUser.firstName} ${mockUser.lastName}`;
		}
		return mockUser.firstName || mockUser.email.split("@")[0] || "";
	});
	const [originalJobTitle] = useState("User");
	const [_avatarUrl, _setAvatarUrl] = useState(mockUser.imageUrl || "");
	const [email] = useState(mockUser.email || "");
	const [userId] = useState(mockUser.id || "");
	const [showPasswordForm, setShowPasswordForm] = useState(false);

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
				<CardContent className="flex flex-col gap-6">
					<div>
						<p className="font-display font-semibold text-base">Profile</p>
						<p className="text-sm text-muted-foreground">
							Manage your personal information.
						</p>
					</div>

					{/* Clickable Avatar */}
					<div className="flex items-center gap-4">
						<button
							type="button"
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

						{/* Password Change */}
						<div className="border-t pt-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Password</p>
									<p className="text-xs text-muted-foreground">
										Update your account password
									</p>
								</div>
								{!showPasswordForm && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowPasswordForm(true)}
									>
										Change Password
									</Button>
								)}
							</div>

							{showPasswordForm && (
								<div className="mt-4 space-y-4">
									<div className="space-y-2">
										<Label className="text-sm">Current password</Label>
										<Input
											type="password"
											placeholder="Enter current password"
											className="h-10"
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-sm">New password</Label>
										<Input
											type="password"
											placeholder="Enter new password"
											className="h-10"
										/>
										<p className="text-xs text-muted-foreground">
											At least 8 characters
										</p>
									</div>
									<div className="space-y-2">
										<Label className="text-sm">Confirm new password</Label>
										<Input
											type="password"
											placeholder="Re-enter new password"
											className="h-10"
										/>
									</div>
									<div className="flex gap-2 justify-end">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowPasswordForm(false)}
										>
											Cancel
										</Button>
										<Button size="sm">Change Password</Button>
									</div>
								</div>
							)}
						</div>
					</div>
					{hasChanges && !showPasswordForm && (
						<div className="flex justify-end pt-2">
							<Button onClick={handleSave}>Save Changes</Button>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardContent className="space-y-3">
					<div className="flex items-center gap-2">
						<KeyRound className="size-4 text-primary" />
						<p className="text-sm font-semibold">Zernio API Key</p>
					</div>

					{apiKey && hasHydrated ? (
						<div className="space-y-3">
							<div className="flex items-center gap-2 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20">
								<CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
								<span className="text-sm text-emerald-600 dark:text-emerald-400">
									Connected
								</span>
								<span className="text-sm text-muted-foreground font-mono ml-auto">
									{showKey
										? apiKey
										: `${apiKey.slice(0, 8)}${"•".repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}`}
								</span>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowKey(!showKey)}
								>
									{showKey ? "Hide" : "Show"} Key
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										navigator.clipboard.writeText(apiKey);
									}}
								>
									Copy
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => {
										setApiKey(null);
										setUsageStats(null);
										setError(null);
									}}
								>
									<Trash2 className="size-4 mr-1" />
									Disconnect
								</Button>
							</div>
						</div>
					) : (
						<div className="space-y-3">
							<p className="text-xs text-muted-foreground">
								Connect your Zernio account to access AI features and social
								media integrations.
							</p>
							<div className="space-y-2">
								<Label htmlFor="api-key">API Key</Label>
								<Input
									id="api-key"
									type="password"
									placeholder="sk_xxx"
									value={apiKeyInput}
									onChange={(e) => {
										setApiKeyInput(e.target.value);
										setError(null);
									}}
									disabled={isValidating}
								/>
							</div>

							{error && (
								<div className="flex items-center gap-2 text-sm text-destructive">
									<AlertCircle className="h-4 w-4" />
									{error}
								</div>
							)}

							<Button
								onClick={async () => {
									if (!apiKeyInput.trim()) {
										setError("API key is required");
										return;
									}

									if (!apiKeyInput.startsWith("sk_")) {
										setError("Invalid API key format");
										return;
									}

									setIsValidating(true);
									setError(null);

									try {
										const response = await fetch("/api/validate-key", {
											method: "POST",
											headers: { "Content-Type": "application/json" },
											body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
										});

										if (!response.ok) {
											const data = (await response
												.json()
												.catch(() => ({}))) as {
												error?: string;
											};
											throw new Error(data?.error || "Invalid API key");
										}

										const data = (await response.json()) as {
											data?: UsageStats;
										};
										setApiKey(apiKeyInput.trim());
										setUsageStats(data?.data ?? null);
										setApiKeyInput("");
									} catch (err) {
										setError(
											err instanceof Error
												? err.message
												: "Failed to validate API key",
										);
									} finally {
										setIsValidating(false);
									}
								}}
								disabled={isValidating || !apiKeyInput.trim()}
								size="sm"
							>
								{isValidating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Validating...
									</>
								) : (
									"Connect"
								)}
							</Button>

							<p className="text-xs text-muted-foreground">
								Don&apos;t have an API key?{" "}
								<a
									href="https://zernio.com/api-keys"
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-4 hover:text-primary"
								>
									Get one here
								</a>
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Card className="border-destructive/30">
				<CardContent className="">
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
		</div>
	);
}
