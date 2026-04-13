"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const baseStyles = cva(
	"rounded-lg inline-flex shrink-0 items-center justify-center cursor-pointer select-none active:translate-y-1 active:[box-shadow:0_0px_0_0_var(--depth-shadow-blue-active),0_0px_0_0_var(--depth-shadow-blue-active)_/_0.25] active:border-b-[0px] transition-all duration-150 text-white font-medium text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			size: {
				default: "h-8 px-3 gap-1.5 text-sm",
				sm: "h-7 px-2.5 gap-1 text-xs",
				lg: "h-9 px-3.5 gap-2 text-base",
				icon: "size-8",
				"icon-sm": "size-7",
			},
			variant: {
				outline:
					"bg-background hover:bg-muted text-foreground border-border border-1 dark:border-input dark:bg-background dark:hover:bg-input/50 [box-shadow:0_3px_0_0_var(--border)]",
				destructive:
					"bg-destructive/10 text-destructive hover:bg-destructive/20 border-1 border-destructive dark:bg-destructive/20 dark:hover:bg-destructive/30 [box-shadow:0_3px_0_0_var(--destructive)]",
				blue: "bg-blue-600 dark:bg-blue-800 border-blue-800 dark:border-blue-950 border-1 [box-shadow:0_3px_0_0_var(--depth-shadow-blue)]",
				orange: "bg-primary hover:bg-primary/90 text-white border-primary/90 [box-shadow:0_3px_0_0_var(--primary)]",
				white: "bg-white hover:bg-white/90 text-primary border-white [box-shadow:0_3px_0_0_var(--white)]",
			},
		},
		defaultVariants: {
			size: "default",
			variant: "outline",
		},
	},
);

interface DepthButtonProps
	extends React.ComponentProps<"button">,
		VariantProps<typeof baseStyles> {}

function DepthButton({
	className,
	size,
	variant,
	children,
	...props
}: DepthButtonProps) {
	return (
		<button
			type="button"
			className={cn(baseStyles({ size, variant }), className)}
			{...props}
		>
			{children}
		</button>
	);
}

/* ==================================================
   DEPTH BUTTON GROUP
   ================================================== */

interface DepthButtonGroupProps extends ComponentProps<"div"> {
	children: React.ReactNode;
}

function DepthButtonGroup({
	className,
	children,
	...props
}: DepthButtonGroupProps) {
	return (
		<div className={cn("inline-flex", className)} role="group" {...props}>
			{children}
		</div>
	);
}

/* ==================================================
   GROUPED BUTTON VARIANTS
   ================================================== */

const groupButtonStyles = cva(baseStyles, {
	variants: {
		size: {
			default: "h-8 px-3 gap-1.5 text-sm",
			sm: "h-7 px-2.5 gap-1 text-xs",
			lg: "h-9 px-3.5 gap-2 text-base",
			icon: "size-8",
			"icon-sm": "size-7",
		},
		variant: {
			outline:
				"bg-background hover:bg-muted text-foreground border-border border-1 dark:border-input dark:bg-background dark:hover:bg-input/50 [box-shadow:0_3px_0_0_var(--border)]",
			destructive:
				"bg-destructive/10 text-destructive hover:bg-destructive/20 border-1 border-destructive dark:bg-destructive/20 dark:hover:bg-destructive/30 [box-shadow:0_3px_0_0_var(--destructive)]",
			blue: "bg-blue-600 dark:bg-blue-800 border-blue-800 dark:border-blue-950 border-1 [box-shadow:0_3px_0_0_var(--depth-shadow-blue)]",
			orange: "bg-primary hover:bg-primary/90 text-white border-primary/90 [box-shadow:0_3px_0_0_var(--primary)]",
			white: "bg-white hover:bg-white/90 text-primary border-white [box-shadow:0_3px_0_0_var(--white)]",
		},
		position: {
			first: "rounded-r-none border-r-0 -mr-px z-10",
			middle: "rounded-none border-r-0 -mr-px",
			last: "rounded-l-none",
			single: "",
		},
	},
	defaultVariants: {
		size: "default",
		variant: "outline",
		position: "single",
	},
});

interface GroupedDepthButtonProps
	extends Omit<React.ComponentProps<"button">, "size">,
		Omit<VariantProps<typeof groupButtonStyles>, "position"> {
	size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
	variant?: "outline" | "destructive" | "blue" | "orange" | "white";
	position?: "first" | "middle" | "last" | "single";
}

function GroupedDepthButton({
	className,
	size,
	variant,
	position,
	children,
	...props
}: GroupedDepthButtonProps) {
	return (
		<button
			type="button"
			className={cn(groupButtonStyles({ size, variant, position }), className)}
			{...props}
		>
			{children}
		</button>
	);
}

export { DepthButton, DepthButtonGroup, GroupedDepthButton };
