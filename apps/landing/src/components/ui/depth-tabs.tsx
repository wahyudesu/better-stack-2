"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@better-stack-2/ui/lib/utils";

/* ==================================================
   DEPTH TABS STYLES
   ================================================== */

const depthTabStyles = cva(
	[
		"relative inline-flex shrink-0 items-center justify-center cursor-pointer select-none rounded-lg",
		"transition-all duration-150 font-medium text-sm outline-none text-white",
		"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		// Depth effect - normal state (3D raised)
		"[box-shadow:0_3px_0_0_var(--depth-shadow-blue)] border border-blue-800 dark:border-blue-950",
		// Depth effect - active/selected state (pressed in)
		"data-[selected]:[box-shadow:0_0px_0_0_var(--depth-shadow-blue-active)] data-[selected]:translate-y-[3px] data-[selected]:border-b-[0px]",
		// Hover - subtle lift (matching depth-buttons active pattern but for hover)
		"",
	],
	{
		variants: {
			size: {
				default: "h-8 px-3 gap-1.5 text-sm",
				sm: "h-7 px-2.5 gap-1 text-xs",
				lg: "h-9 px-3.5 gap-2 text-base",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
);

const depthTabsListStyles = cva("inline-flex items-center gap-1", {
	variants: {
		variant: {
			default: "bg-transparent",
			outline:
				"bg-background dark:bg-card rounded-lg p-[3px] [box-shadow:0_3px_0_0_var(--border)] border border-input",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

/* ==================================================
   TYPES
   ================================================== */

export interface DepthTabsProps
	extends Omit<TabsPrimitive.Root.Props, "className"> {
	className?: string;
}

export interface DepthTabsListProps
	extends Omit<TabsPrimitive.List.Props, "className">,
		VariantProps<typeof depthTabsListStyles> {
	className?: string;
	variant?: "default" | "outline";
}

export interface DepthTabsTriggerProps
	extends Omit<TabsPrimitive.Tab.Props, "className">,
		VariantProps<typeof depthTabStyles> {
	className?: string;
	size?: "default" | "sm" | "lg";
}

export interface DepthTabsPanelProps
	extends Omit<TabsPrimitive.Panel.Props, "className"> {
	className?: string;
}

/* ==================================================
   DEPTH TABS
   ================================================== */

function DepthTabs({
	className,
	orientation = "horizontal",
	...props
}: DepthTabsProps) {
	return (
		<TabsPrimitive.Root
			data-slot="depth-tabs"
			data-orientation={orientation}
			className={cn("group/depth-tabs flex gap-2", className)}
			{...props}
		/>
	);
}

function DepthTabsList({
	className,
	variant = "default",
	...props
}: DepthTabsListProps) {
	return (
		<TabsPrimitive.List
			data-slot="depth-tabs-list"
			data-variant={variant}
			className={cn(depthTabsListStyles({ variant }), className)}
			{...props}
		/>
	);
}

function DepthTabsTrigger({
	className,
	size = "default",
	...props
}: DepthTabsTriggerProps) {
	return (
		<TabsPrimitive.Tab
			data-slot="depth-tabs-trigger"
			className={cn(
				depthTabStyles({ size }),
				"bg-blue-600 dark:bg-blue-800 data-[selected]:bg-blue-700 dark:data-[selected]:bg-blue-900 data-[selected]:text-white",
				className
			)}
			{...props}
		/>
	);
}

function DepthTabsPanel({
	className,
	...props
}: DepthTabsPanelProps) {
	return (
		<TabsPrimitive.Panel
			data-slot="depth-tabs-panel"
			className={cn("flex-1 text-sm outline-none", className)}
			{...props}
		/>
	);
}

export {
	DepthTabs,
	DepthTabsList,
	DepthTabsTrigger,
	DepthTabsPanel,
	DepthTabsPanel as DepthTabsContent,
};
