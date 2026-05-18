"use client";

import { cn } from "@zenpost/ui/lib/utils";
import {
	Circle,
	CommandIcon,
	Crosshair,
	Download,
	Inbox,
	Menu,
	MessageCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type TooltipItem = {
	icon: ReactNode;
	label: string;
	labelHasKeyword?: (string | ReactNode)[] | false;
	hasBadge?: boolean;
	active?: boolean;
	onSelect?: () => void;
};

interface TooltipNavbarProps {
	items: TooltipItem[];
	tooltipDelay?: number;
	className?: string;
}

const DEFAULT_ITEMS: TooltipItem[] = [
	{
		icon: <MessageCircle className="h-full w-full" />,
		label: "Comment",
		labelHasKeyword: ["C"],
		hasBadge: false,
	},
	{
		icon: <Inbox className="h-full w-full" />,
		label: "Inbox",
		labelHasKeyword: ["I"],
		hasBadge: true,
	},
	{
		icon: <Circle className="h-full w-full" />,
		label: "Record",
		labelHasKeyword: ["R"],
		hasBadge: false,
	},
	{
		icon: <Crosshair className="h-full w-full" />,
		label: "Focus Mode",
		labelHasKeyword: ["F"],
		hasBadge: false,
	},
	{
		icon: <Download className="h-full w-full" />,
		label: "Share",
		labelHasKeyword: ["S"],
		hasBadge: false,
	},
	{
		icon: <Menu className="h-full w-full" />,
		label: "Menu",
		labelHasKeyword: ["M"],
		hasBadge: false,
	},
];

export const TooltipNavbar = ({
	items = DEFAULT_ITEMS,
	tooltipDelay = 300,
	className,
}: TooltipNavbarProps) => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [coords, setCoords] = useState({ clipPath: "", translateX: 0 });
	const [isEntering, setIsEntering] = useState(true);

	const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const calculatePosition = (index: number) => {
		const activeLabel = measureRefs.current[index];
		const activeIcon = buttonRefs.current[index];

		if (!activeLabel || !activeIcon) return null;

		const labelLeft = activeLabel.offsetLeft;
		const labelWidth = activeLabel.offsetWidth;
		const labelCenter = labelLeft + labelWidth / 2;

		const iconLeft = activeIcon.offsetLeft;
		const iconWidth = activeIcon.offsetWidth;
		const iconCenter = iconLeft + iconWidth / 2;

		const totalWidth = measureRefs.current.reduce(
			(acc, el) => acc + (el?.offsetWidth || 0),
			0,
		);

		const cLeft = (labelLeft / totalWidth) * 100;
		const cRight = 100 - ((labelLeft + labelWidth) / totalWidth) * 100;

		return {
			clipPath: `inset(0 ${cRight}% 0 ${cLeft}% round 8px)`,
			translateX: iconCenter - labelCenter,
		};
	};

	const handleMouseEnter = (index: number) => {
		const newCoords = calculatePosition(index);
		if (!newCoords) return;

		if (activeIndex === null) {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			setIsEntering(true);

			timeoutRef.current = setTimeout(() => {
				setCoords(newCoords);
				setActiveIndex(index);
			}, tooltipDelay);
		} else {
			setCoords(newCoords);
			setActiveIndex(index);
		}
	};

	const handleMouseLeave = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setActiveIndex(null);
		setCoords({ clipPath: "", translateX: 0 });
		setIsEntering(true);
	};

	return (
		<div className={cn("relative", className)}>
			<div className="flex items-center justify-center">
				<div className="relative text-white" onMouseLeave={handleMouseLeave}>
					<AnimatePresence>
						{activeIndex !== null && coords.clipPath !== "" && (
							<motion.div
								className="absolute bottom-12 left-0"
								exit={{ opacity: 0 }}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									className="flex rounded-lg bg-black dark:bg-neutral-800"
									animate={{
										clipPath: coords.clipPath,
										x: coords.translateX,
									}}
									transition={{
										type: "spring",
										bounce: 0,
										duration: isEntering ? 0 : 0.4,
									}}
									onUpdate={() => {
										if (isEntering) {
											setIsEntering(false);
										}
									}}
								>
									<div className="inline-flex h-8 items-center justify-center">
										{items.map((item) => (
											<div
												key={`real-${item.label}`}
												className="flex items-center justify-center gap-1 whitespace-nowrap px-2 text-sm font-medium"
											>
												<span className="text-white">{item.label}</span>
												{item.hasBadge && (
													<div className="flex items-center gap-0.5 text-white/40">
														<span className="flex items-center justify-center rounded-sm border border-white/20 p-1">
															<CommandIcon className="size-3 text-neutral-500" />
														</span>
													</div>
												)}
												{item.labelHasKeyword && (
													<div className="flex items-center gap-0.5 text-white/40">
														{item.labelHasKeyword.map((key, index) => (
															<span
																key={`${item.label}-keyword-${index}`}
																className="flex items-center justify-center rounded-sm border border-white/20 px-1 tabular-nums"
															>
																{key}
															</span>
														))}
													</div>
												)}
											</div>
										))}
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>

					<div className="z-10 inline-flex items-center justify-center rounded-2xl border border-neutral-800 bg-black/95 p-1 dark:bg-neutral-800">
						{items.map((item, index) => (
							<button
								key={item.label}
								type="button"
								onClick={item.onSelect}
								onMouseEnter={() => handleMouseEnter(index)}
								ref={(el) => {
									buttonRefs.current[index] = el;
								}}
								className={cn(
									"flex cursor-pointer items-center justify-center rounded-xl p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white",
									item.active && "bg-indigo-600/20 text-white",
								)}
							>
								<div
									className={cn(
										"flex size-5 items-center justify-center",
										item.active ? "text-indigo-600" : "text-neutral-400",
									)}
								>
									{item.icon}
								</div>
								<span className="sr-only">{item.label}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="pointer-events-none absolute bottom-0 left-0 flex h-0 overflow-hidden whitespace-nowrap opacity-0">
				{items.map((item, index) => (
					<div
						key={`measure-${item.label}`}
						ref={(el) => {
							measureRefs.current[index] = el;
						}}
						className="flex items-center justify-center gap-1 whitespace-nowrap px-2 text-sm font-medium"
					>
						<span>{item.label}</span>
						{item.hasBadge && (
							<div className="flex items-center gap-0.5 text-white/40">
								<span className="flex items-center justify-center rounded-sm border border-white/20 p-1">
									<CommandIcon className="size-3 text-neutral-500" />
								</span>
							</div>
						)}
						{item.labelHasKeyword && (
							<div className="flex items-center gap-0.5 text-white/40">
								{item.labelHasKeyword.map((key, keywordIndex) => (
									<span
										key={`${item.label}-measure-keyword-${keywordIndex}`}
										className="flex items-center justify-center rounded-sm border border-white/20 px-1 tabular-nums"
									>
										{typeof key === "string" ? key : "⌘"}
									</span>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
