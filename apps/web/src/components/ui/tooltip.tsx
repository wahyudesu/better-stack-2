"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import React from "react";

import { cn } from "@/lib/utils";

function TooltipProvider({
	delay = 0,
	...props
}: TooltipPrimitive.Provider.Props) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delay={delay}
			{...props}
		/>
	);
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
	return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
	children,
	...props
}: TooltipPrimitive.Trigger.Props) {
	return (
		<TooltipPrimitive.Trigger
			data-slot="tooltip-trigger"
			render={children as React.ReactElement}
			{...props}
		/>
	);
}

function TooltipContent({
	className,
	side = "top",
	sideOffset = 4,
	align = "center",
	alignOffset = 0,
	children,
	...props
}: TooltipPrimitive.Popup.Props &
	Pick<
		TooltipPrimitive.Positioner.Props,
		"align" | "alignOffset" | "side" | "sideOffset"
	>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50"
			>
				<TooltipPrimitive.Popup
					data-slot="tooltip-content"
					className={cn(
						"z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-2xl bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-4xl data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
						className,
					)}
					{...props}
				>
					{children}
					<TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:left-1 data-[side=inline-end]:translate-x-[1.5px] data-[side=inline-end]:translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:right-1 data-[side=inline-start]:translate-x-[-1.5px] data-[side=inline-start]:translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:right-1 data-[side=left]:translate-x-[1.5px] data-[side=right]:top-1/2! data-[side=right]:left-1 data-[side=right]:translate-y-1/2 data-[side=top]:bottom-2.5" />
				</TooltipPrimitive.Popup>
			</TooltipPrimitive.Positioner>
		</TooltipPrimitive.Portal>
	);
}

// Simple Tooltip - CSS-based tooltip for simple use cases
function SimpleTooltip({
	content,
	children,
}: {
	content: string;
	children: React.ReactNode;
}) {
	const [isVisible, setIsVisible] = React.useState(false);
	const [position, setPosition] = React.useState({ top: 0, left: 0 });
	const triggerRef = React.useRef<HTMLDivElement>(null);

	const handleMouseEnter = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setPosition({
				top: rect.top - 8, // 8px offset above
				left: rect.left + rect.width / 2,
			});
		}
		setIsVisible(true);
	};

	const handleMouseLeave = () => {
		setIsVisible(false);
	};

	return (
		<>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: Tooltip trigger wrapper */}
			<div
				ref={triggerRef}
				className="inline-flex"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{children}
			</div>
			{isVisible && (
				<div
					className="fixed -translate-x-1/2 -translate-y-full px-2.5 py-1.5 bg-foreground text-background text-xs rounded-lg whitespace-nowrap z-[9999] pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200"
					style={{
						top: `${position.top}px`,
						left: `${position.left}px`,
					}}
				>
					{content}
					<div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-foreground" />
				</div>
			)}
		</>
	);
}

export {
	SimpleTooltip,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
};
