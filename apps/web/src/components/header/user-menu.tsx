"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import {
	FileText,
	LifeBuoy,
	LogOut,
	MessageSquare,
	Monitor,
	Moon,
	Sun,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
	avatarSrc?: string;
	isLoaded?: boolean;
	isSignedIn?: boolean;
}

const menuItems = [
	{ id: "account", label: "Account", icon: User, action: "userProfile" },
];
const secondaryItems = [
	{ id: "blog", label: "Blog", icon: FileText, href: "/blog" },
	{ id: "support", label: "Support", icon: LifeBuoy, href: "/support" },
	{ id: "contact", label: "Contact", icon: MessageSquare, href: "/contact" },
];

export function UserMenu({ avatarSrc, isLoaded, isSignedIn }: UserMenuProps) {
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
	const router = useRouter();
	const { user } = useUser();
	const { openUserProfile, signOut: clerkSignOut } = useClerk();
	const { theme, setTheme } = useTheme();

	// Use passed props first, fallback to hook data
	const isUserLoaded = isLoaded ?? !!user;
	const isUserSignedIn = isSignedIn ?? !!user;
	const avatarUrl = user?.imageUrl ?? avatarSrc;

	const handleLogout = () => {
		clerkSignOut(() => router.push("/"));
	};

	const handleMenuItemClick = (
		item: (typeof menuItems)[number] | (typeof secondaryItems)[number],
	) => {
		if ("action" in item && item.action === "userProfile") {
			openUserProfile();
		} else if ("href" in item) {
			router.push(item.href);
		}
	};

	// Get initials for fallback avatar
	const getInitials = () => {
		if (user?.firstName) return user.firstName[0].toUpperCase();
		const email = user?.emailAddresses?.[0]?.emailAddress;
		if (email) return email[0].toUpperCase();
		return "U";
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="">
					<Avatar className="size-8">
						<AvatarImage src={isUserLoaded ? avatarUrl : undefined} />
						<AvatarFallback>
							{isUserLoaded ? (
								user ? (
									getInitials()
								) : (
									<User className="size-5" />
								)
							) : (
								<div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
							)}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					{menuItems.map((item) => (
						<DropdownMenuItem
							key={item.id}
							onClick={() => handleMenuItemClick(item)}
						>
							<span>{item.label}</span>
							<item.icon className="ml-auto size-4 text-muted-foreground" />
						</DropdownMenuItem>
					))}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Monitor className="mr-2 size-4" />
							<span>Theme</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem onClick={() => setTheme("light")}>
									<Sun className="mr-2 size-4" />
									<span>Light</span>
									{theme === "light" && (
										<span className="ml-auto text-xs text-muted-foreground">
											✓
										</span>
									)}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("dark")}>
									<Moon className="mr-2 size-4" />
									<span>Dark</span>
									{theme === "dark" && (
										<span className="ml-auto text-xs text-muted-foreground">
											✓
										</span>
									)}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme("system")}>
									<Monitor className="mr-2 size-4" />
									<span>System</span>
									{theme === "system" && (
										<span className="ml-auto text-xs text-muted-foreground">
											✓
										</span>
									)}
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					{secondaryItems.map((item) => (
						<DropdownMenuItem
							key={item.id}
							onClick={() => handleMenuItemClick(item)}
						>
							<span>{item.label}</span>
							<item.icon className="ml-auto size-4 text-muted-foreground" />
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive cursor-pointer"
						onClick={() => setLogoutDialogOpen(true)}
					>
						<span>Logout</span>
						<LogOut className="ml-auto size-4" />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Logout?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to sign out?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleLogout}
							className="bg-destructive hover:bg-destructive/90"
						>
							Logout
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
