"use client";

import { useState } from "react";
import { User, FileText, LifeBuoy, MessageSquare, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface UserMenuProps {
	avatarSrc?: string;
}

const menuItems = [
	{ id: "account", label: "Account", icon: User, action: "userProfile" },
];
const secondaryItems = [
	{ id: "blog", label: "Blog", icon: FileText, href: "/blog" },
	{ id: "support", label: "Support", icon: LifeBuoy, href: "/support" },
	{ id: "contact", label: "Contact", icon: MessageSquare, href: "/contact" },
];

export function UserMenu({ avatarSrc = "https://i.pravatar.cc/150?u=admin" }: UserMenuProps) {
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
	const router = useRouter();
	const { openUserProfile, signOut: clerkSignOut } = useClerk();

	const handleLogout = () => {
		clerkSignOut(() => router.push("/"));
	};

	const handleMenuItemClick = (item: (typeof menuItems)[number] | (typeof secondaryItems)[number]) => {
		if ("action" in item && item.action === "userProfile") {
			openUserProfile();
		} else if ("href" in item) {
			router.push(item.href);
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="">
					<Avatar className="size-8">
						<AvatarImage src={avatarSrc} />
						<AvatarFallback>
							<User className="size-5" />
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

			<AlertDialog
				open={logoutDialogOpen}
				onOpenChange={setLogoutDialogOpen}
			>
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
