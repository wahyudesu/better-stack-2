"use client";

import {
	BarChart3,
	Megaphone,
	MessageSquare,
	Newspaper,
	Settings,
	Sparkles,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import {
	type TooltipItem,
	TooltipNavbar,
} from "@/components/ui/tooltip-navbar";

// Tooltip show delay in milliseconds
const TOOLTIP_SHOW_DELAY_MS = 400;

// Menu items definition
const MENU_ITEMS = [
	{ href: "/posts", icon: Newspaper, label: "Posts", shortcut: "⌃1", key: "1" },
	{
		href: "/dashboard",
		icon: BarChart3,
		label: "Dashboard",
		shortcut: "⌃2",
		key: "2",
	},
	{
		href: "/ads",
		icon: Megaphone,
		label: "Ads",
		shortcut: "⌃5",
		key: "5",
	},
	{
		href: "/inbox",
		icon: MessageSquare,
		label: "Inbox",
		shortcut: "⌃3",
		key: "3",
	},
	{ href: "/ai", icon: Sparkles, label: "AI", shortcut: "⌃4", key: "4" },
	{
		href: "/settings",
		icon: Settings,
		label: "Settings",
		shortcut: "⌃6",
		key: "6",
	},
];

// Key-to-item map for O(1) keyboard lookup (Ctrl+1 through Ctrl+6)
const KEY_TO_ITEM_MAP = new Map<string, (typeof MENU_ITEMS)[number]>();
for (const item of MENU_ITEMS) {
	if (item.key != null) {
		KEY_TO_ITEM_MAP.set(item.key, item);
	}
}

// Helper to check if keyboard input should be ignored
const shouldIgnoreKeyboard = (target: HTMLElement): boolean => {
	const ignoreTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);
	return (
		ignoreTags.has(target.tagName) ||
		target.isContentEditable ||
		target.closest("[contenteditable=true]") !== null
	);
};

export default function BottomMenu() {
	const pathname = usePathname();
	const router = useRouter();
	const pathnameRef = useRef(pathname);
	const routerRef = useRef(router);

	// Keep refs in sync for keyboard shortcuts
	pathnameRef.current = pathname;
	routerRef.current = router;

	const items = useMemo<TooltipItem[]>(
		() =>
			MENU_ITEMS.map((item) => ({
				icon: <item.icon className="h-full w-full" />,
				label: item.label,
				labelHasKeyword: [item.shortcut],
				active: pathname === item.href,
				onSelect: () => {
					if (pathname !== item.href) {
						router.push(item.href);
					}
				},
			})),
		[pathname, router],
	);

	// Keyboard shortcuts (Ctrl+1 through Ctrl+6, or Cmd+1 through Cmd+6 on Mac)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (shouldIgnoreKeyboard(e.target as HTMLElement)) return;

			// Check for Ctrl (Windows/Linux) or Cmd (Mac) modifier
			const hasModifier = e.ctrlKey || e.metaKey;
			if (!hasModifier) return;

			const key = e.key;
			const matchingItem = KEY_TO_ITEM_MAP.get(key);

			if (matchingItem && pathnameRef.current !== matchingItem.href) {
				e.preventDefault();
				routerRef.current.push(matchingItem.href);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="fixed bottom-4 left-4 z-50">
			<TooltipNavbar items={items} tooltipDelay={TOOLTIP_SHOW_DELAY_MS} />
		</div>
	);
}
