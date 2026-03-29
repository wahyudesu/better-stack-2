"use client";

import { cva } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

export interface DepthMenuOption {
	value: string;
	label: string;
	icon?: ReactNode;
	description?: string;
}

// ============================================
// Depth Button Menu Styles
// ============================================

const depthMenuStyles = cva(
	[
		"inline-flex shrink-0 items-center justify-center gap-1.5 cursor-pointer select-none",
		"transition-all duration-150 font-medium text-sm outline-none",
		"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		// Depth effect - normal state (same as depth-buttons outline)
		"[box-shadow:0_3px_0_0_var(--border)]",
		// Depth effect - pressed/expanded state
		"aria-expanded:translate-y-1",
		"aria-expanded:[box-shadow:0_0px_0_0_var(--border)_/_0.25]",
		"aria-expanded:border-b-[0px]",
	],
	{
		variants: {
			size: {
				default: "h-8 px-3 gap-1.5 text-sm min-w-[120px]",
				sm: "h-7 px-2.5 gap-1 text-xs min-w-[100px]",
				lg: "h-9 px-3.5 gap-2 text-base min-w-[140px]",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
);

// ============================================
// DepthButtonMenu - Dropdown menu with depth style
// ============================================

export interface DepthButtonMenuProps {
	value: string;
	onChange: (value: string) => void;
	options: readonly DepthMenuOption[] | DepthMenuOption[];
	placeholder?: string;
	className?: string;
	panelClassName?: string;
	size?: "default" | "sm" | "lg";
	/** Align the dropdown content */
	align?: "start" | "center" | "end";
}

export function DepthButtonMenu({
	value,
	onChange,
	options,
	placeholder = "Select...",
	className,
	panelClassName,
	size = "default",
	align = "start",
}: DepthButtonMenuProps) {
	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger
				// Use SelectTrigger's outline variant as base
				variant="outline"
				size={size === "default" ? "sm" : "default"}
				className={cn(
					// Apply depth menu styles
					depthMenuStyles({ size }),
					// Override rounded-4xl to rounded-lg
					"rounded-lg",
					// Custom class override
					className
				)}
			>
				{selectedOption ? (
					<span className="flex items-center gap-1.5">
						{selectedOption.icon}
						<span>{selectedOption.label}</span>
					</span>
				) : (
					<span className="text-muted-foreground">{placeholder}</span>
				)}
			</SelectTrigger>
			<SelectContent
				className={cn("min-w-[160px] border border-border", panelClassName)}
				align={align}
				alignItemWithTrigger={false}
			>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						<span className="flex items-center gap-2 flex-1">
							{option.icon}
							<span className="flex-1 font-medium">{option.label}</span>
						</span>
						{option.description && (
							<span className="text-xs text-muted-foreground">{option.description}</span>
						)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

// ============================================
// DepthButtonGroup - Grouped dropdown menus
// ============================================

export interface DepthButtonGroupProps {
	children: ReactNode;
	className?: string;
}

export function DepthButtonGroup({ children, className }: DepthButtonGroupProps) {
	return (
		<div className={cn("inline-flex items-center gap-2", className)}>
			{children}
		</div>
	);
}

// ============================================
// Preset: Action Menu with icon
// ============================================

export interface ActionMenuOption {
	value: string;
	label: string;
	icon?: LucideIcon;
	description?: string;
}

export interface DepthActionMenuProps {
	value: string;
	onChange: (value: string) => void;
	options: ActionMenuOption[];
	placeholder?: string;
	className?: string;
	size?: "default" | "sm" | "lg";
	align?: "start" | "center" | "end";
}

export function DepthActionMenu({
	value,
	onChange,
	options,
	placeholder = "Actions...",
	className,
	size = "default",
	align = "end",
}: DepthActionMenuProps) {
	const selectedOption = options.find((opt) => opt.value === value);
	const Icon = selectedOption?.icon;

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger
				variant="outline"
				size={size === "default" ? "sm" : "default"}
				className={cn(
					depthMenuStyles({ size }),
					"rounded-lg min-w-[120px]",
					className
				)}
			>
				<span className="flex items-center gap-1.5">
					{Icon && <Icon className="size-4" />}
					<span>{selectedOption?.label || placeholder}</span>
				</span>
			</SelectTrigger>
			<SelectContent
				className={cn("min-w-[180px] border border-border", className)}
				align={align}
				alignItemWithTrigger={false}
			>
				{options.map((option) => {
					const OptIcon = option.icon;
					return (
						<SelectItem key={option.value} value={option.value}>
							<span className="flex items-center gap-2 flex-1">
								{OptIcon && <OptIcon className="size-4" />}
								<span className="flex-1">{option.label}</span>
							</span>
							{option.description && (
								<span className="text-xs text-muted-foreground">{option.description}</span>
							)}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}
