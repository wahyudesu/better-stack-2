"use client";

import { cn } from "@better-stack-2/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	MessageSquare,
	Newspaper,
	Settings,
	Sparkles,
	SquareStack,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

// Shared animation constant
const SPRING_TRANSITION = {
	type: "spring" as const,
	stiffness: 6000,
	damping: 200,
};

// Tooltip show delay in milliseconds
const TOOLTIP_SHOW_DELAY_MS = 400;

// Key-to-item map for O(1) keyboard lookup (Ctrl+1 through Ctrl+6)
const KEY_TO_ITEM_MAP = new Map(
	[
		{
			href: "/posts",
			icon: Newspaper,
			label: "Posts",
			shortcut: "⌃1",
			key: "1",
		},
		{
			href: "/dashboard",
			icon: BarChart3,
			label: "Dashboard",
			shortcut: "⌃2",
			key: "2",
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
			href: "/tools",
			icon: SquareStack,
			label: "Tools",
			shortcut: "⌃5",
			key: "5",
		},
		{
			href: "/settings",
			icon: Settings,
			label: "Settings",
			shortcut: "⌃6",
			key: "6",
		},
	]
		.filter((item) => item.key)
		.map((item) => [item.key!, item]),
);

const menuItems: Array<{
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	shortcut?: string;
	key?: string;
}> = [
	{ href: "/posts", icon: Newspaper, label: "Posts", shortcut: "⌃1", key: "1" },
	{
		href: "/dashboard",
		icon: BarChart3,
		label: "Dashboard",
		shortcut: "⌃2",
		key: "2",
	},
	{
		href: "/inbox",
		icon: MessageSquare,
		label: "Inbox",
		shortcut: "⌃3",
		key: "3",
	},
	{ href: "/ai", icon: Sparkles, label: "AI", shortcut: "⌃4", key: "4" },
	{ href: "/tools", icon: SquareStack, label: "Tools", shortcut: "⌃5", key: "5" },
	{
		href: "/settings",
		icon: Settings,
		label: "Settings",
		shortcut: "⌃6",
		key: "6",
	},
];

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
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [showTooltip, setShowTooltip] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
	const pathnameRef = useRef(pathname);
	const routerRef = useRef(router);
	const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Keep refs in sync
	pathnameRef.current = pathname;
	routerRef.current = router;

	// Memoized hoveredItem - only recalculates when hoveredIndex changes
	const hoveredItem = useMemo(
		() => (hoveredIndex !== null ? menuItems[hoveredIndex] : null),
		[hoveredIndex],
	);

	// Clear tooltip timer on unmount
	useEffect(() => {
		return () => {
			if (tooltipTimerRef.current) {
				clearTimeout(tooltipTimerRef.current);
			}
		};
	}, []);

	// Debounced tooltip show
	const handleMouseEnter = (index: number) => {
		setHoveredIndex(index);

		// Clear existing timer
		if (tooltipTimerRef.current) {
			clearTimeout(tooltipTimerRef.current);
		}

		// If tooltip already visible, keep it visible (no delay when switching)
		if (showTooltip) {
			return;
		}

		// Show tooltip after delay
		tooltipTimerRef.current = setTimeout(() => {
			setShowTooltip(true);
		}, TOOLTIP_SHOW_DELAY_MS);
	};

	const handleMouseLeave = () => {
		setHoveredIndex(null);

		// Clear timer and hide tooltip immediately
		if (tooltipTimerRef.current) {
			clearTimeout(tooltipTimerRef.current);
			tooltipTimerRef.current = null;
		}
		setShowTooltip(false);
	};

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
				routerRef.current.push(matchingItem.href as any);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Memoized tooltip position - only recalculates when hoveredIndex changes
	const tooltipPos = useMemo(() => {
		if (hoveredIndex === null || !containerRef.current) return { x: 0 };

		const item = itemRefs.current[hoveredIndex];
		if (!item) return { x: 0 };

		const containerRect = containerRef.current.getBoundingClientRect();
		const itemRect = item.getBoundingClientRect();

		return {
			x: itemRect.left - containerRect.left + itemRect.width / 2,
		};
	}, [hoveredIndex]);

	return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
			<div
				ref={containerRef}
				className="relative border rounded-3xl p-1.5 overflow-visible"
				style={{
					backgroundColor: "#0a0a0a",
					borderColor: "#262626",
					boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
				}}
			>
				<nav className="flex items-center gap-1">
					{menuItems.map((item, index) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								ref={(el) => {
									itemRefs.current[index] = el;
								}}
								href={item.href as any}
								className={cn(
									"relative flex items-center justify-center p-2.5 rounded-2xl transition-all duration-200",
									isActive
										? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
										: "text-neutral-400 hover:text-white hover:bg-neutral-800/80",
								)}
								onMouseEnter={() => handleMouseEnter(index)}
								onMouseLeave={handleMouseLeave}
							>
								<item.icon className="size-5" />
							</Link>
						);
					})}
				</nav>

				{/* Tooltip popup above menu items */}
				<AnimatePresence>
					{showTooltip && hoveredItem?.shortcut && (
						<motion.div
							key="tooltip"
							className="absolute -top-12 left-0 flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none overflow-hidden"
							initial={{
								opacity: 0,
								y: 10,
								scale: 0.95,
								x: tooltipPos.x,
								translateX: "-50%",
							}}
							animate={{
								opacity: 1,
								y: 0,
								scale: 1,
								x: tooltipPos.x,
								translateX: "-50%",
							}}
							exit={{
								opacity: 0,
								y: 10,
								scale: 0.95,
								transition: { duration: 0.15 },
							}}
							transition={SPRING_TRANSITION}
						>
							<AnimatePresence mode="popLayout" initial={false}>
								<motion.div
									key={hoveredItem.href}
									className="flex items-center gap-2"
									initial="initial"
									animate="animate"
									exit="exit"
									transition={SPRING_TRANSITION}
								>
									<span className="text-sm font-medium text-white">
										{hoveredItem.label}
									</span>
									<span className="text-xs font-medium text-white bg-neutral-700 px-2 py-0.5 rounded">
										{hoveredItem.shortcut}
									</span>
								</motion.div>
							</AnimatePresence>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
