"use client";

import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@zenpost/ui/components/dropdown-menu";
import { cn } from "@zenpost/ui/lib/utils";

// ============================================
// Types
// ============================================

export interface DepthMenuOption {
	value: string;
	label: string;
	icon?: ReactNode;
	description?: string;
}

export type DepthMenuMode = "radio" | "checkbox";

// ============================================
// Depth Button Menu Styles
// ============================================

const depthMenuStyles = cva(
	[
		"inline-flex shrink-0 items-center justify-between gap-1.5 cursor-pointer select-none",
		"transition-all duration-150 font-medium text-sm outline-none",
		"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		// Depth effect - normal state
		"[box-shadow:0_3px_0_0_var(--border)]",
		// Depth effect - pressed state (when clicking/open)
		"active:translate-y-[3px] active:[box-shadow:0_0px_0_0_var(--border)] active:border-b-[0px]",
		// Depth effect - open state (dropdown visible)
		"data-[state=open]:translate-y-[3px] data-[state=open]:[box-shadow:0_0px_0_0_var(--border)] data-[state=open]:border-b-[0px]",
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
	},
);

// ============================================
// DepthButtonMenu - Dropdown menu with depth style
// ============================================

export interface DepthButtonMenuProps {
	value?: string;
	values?: string[];
	onChange?: (value: string) => void;
	onValuesChange?: (values: string[]) => void;
	options: readonly DepthMenuOption[] | DepthMenuOption[];
	placeholder?: string;
	className?: string;
	panelClassName?: string;
	size?: "default" | "sm" | "lg";
	align?: "start" | "center" | "end";
	mode?: DepthMenuMode;
	/** Keep dropdown open after selection (default: false) */
	keepOpen?: boolean;
}

export function DepthButtonMenu({
	value,
	values,
	onChange,
	onValuesChange,
	options,
	placeholder = "Select...",
	className,
	panelClassName,
	size = "default",
	align = "start",
	mode = "radio",
	keepOpen = false,
}: DepthButtonMenuProps) {
	const [open, setOpen] = useState(false);
	const isCheckbox = mode === "checkbox";
	const selectedValues = isCheckbox ? (values ?? []) : value ? [value] : [];
	const selectedOptions = options.filter((opt) =>
		selectedValues.includes(opt.value),
	);

	const handleRadioChange = (newValue: string) => {
		onChange?.(newValue);
		if (!keepOpen) setOpen(false);
	};

	const handleCheckboxChange = (optValue: string, checked: boolean) => {
		if (!onValuesChange) return;
		const currentValues = values ?? [];
		const newValues = checked
			? [...currentValues, optValue]
			: currentValues.filter((v) => v !== optValue);
		onValuesChange(newValues);
		if (!keepOpen) setOpen(false);
	};

	// Build styles with open state for immediate animation feedback
	const triggerStyles = cn(
		depthMenuStyles({ size }),
		"rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground",
		// Depth effect - apply immediately when open state changes
		open && "[box-shadow:0_0px_0_0_var(--border)]",
		open && "translate-y-[3px] border-b-[0px]",
		className,
	);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger className={triggerStyles}>
				<span className="flex items-center gap-1.5 truncate">
					{isCheckbox ? (
						<>
							{selectedOptions.length > 0 ? (
								<span className="flex items-center gap-1.5">
									<span className="flex items-center justify-center size-5 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
										{selectedOptions.length}
									</span>
									<span className="truncate">
										{selectedOptions.length === 1
											? selectedOptions[0]?.label
											: `${selectedOptions.length} selected`}
									</span>
								</span>
							) : (
								<span className="text-muted-foreground">{placeholder}</span>
							)}
						</>
					) : (
						<>
							{selectedOptions[0] ? (
								<span className="flex items-center gap-1.5">
									{selectedOptions[0]?.icon}
									<span>{selectedOptions[0]?.label}</span>
								</span>
							) : (
								<span className="text-muted-foreground">{placeholder}</span>
							)}
						</>
					)}
				</span>
				<ChevronDownIcon
					className={cn(
						"size-4 shrink-0 transition-transform duration-200",
						open && "rotate-180",
					)}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className={cn("min-w-[160px] border border-border", panelClassName)}
				align={align}
			>
				{isCheckbox ? (
					// Checkbox mode (multiple select)
					<>
						{options.map((option) => (
							<DropdownMenuCheckboxItem
								key={option.value}
								checked={selectedValues.includes(option.value)}
								onCheckedChange={(checked) =>
									handleCheckboxChange(option.value, checked === true)
								}
							>
								<span className="flex items-center gap-2 flex-1">
									{option.icon}
									<span className="flex-1 font-medium">{option.label}</span>
								</span>
								{option.description && (
									<span className="text-xs text-muted-foreground">
										{option.description}
									</span>
								)}
							</DropdownMenuCheckboxItem>
						))}
					</>
				) : (
					// Radio mode (single select)
					<DropdownMenuRadioGroup
						value={value ?? ""}
						onValueChange={handleRadioChange}
					>
						{options.map((option) => (
							<DropdownMenuRadioItem key={option.value} value={option.value}>
								<span className="flex items-center gap-2 flex-1">
									{option.icon}
									<span className="flex-1 font-medium">{option.label}</span>
								</span>
								{option.description && (
									<span className="text-xs text-muted-foreground">
										{option.description}
									</span>
								)}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// ============================================
// DepthButtonGroup - Grouped dropdown menus
// ============================================

export interface DepthButtonGroupProps {
	children: ReactNode;
	className?: string;
}

export function DepthButtonGroup({
	children,
	className,
}: DepthButtonGroupProps) {
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
	icon?: ReactNode;
	description?: string;
}

export interface DepthActionMenuProps {
	value?: string;
	values?: string[];
	onChange?: (value: string) => void;
	onValuesChange?: (values: string[]) => void;
	options: ActionMenuOption[];
	placeholder?: string;
	className?: string;
	size?: "default" | "sm" | "lg";
	align?: "start" | "center" | "end";
	mode?: DepthMenuMode;
	keepOpen?: boolean;
}

export function DepthActionMenu({
	value,
	values,
	onChange,
	onValuesChange,
	options,
	placeholder = "Actions...",
	className,
	size = "default",
	align = "end",
	mode = "radio",
	keepOpen = false,
}: DepthActionMenuProps) {
	const [open, setOpen] = useState(false);
	const isCheckbox = mode === "checkbox";
	const selectedValues = isCheckbox ? (values ?? []) : value ? [value] : [];
	const selectedOptions = options.filter((opt) =>
		selectedValues.includes(opt.value),
	);

	const handleRadioChange = (newValue: string) => {
		onChange?.(newValue);
		if (!keepOpen) setOpen(false);
	};

	const handleCheckboxChange = (optValue: string, checked: boolean) => {
		if (!onValuesChange) return;
		const currentValues = values ?? [];
		const newValues = checked
			? [...currentValues, optValue]
			: currentValues.filter((v) => v !== optValue);
		onValuesChange(newValues);
		if (!keepOpen) setOpen(false);
	};

	const triggerStyles = cn(
		depthMenuStyles({ size }),
		"rounded-lg min-w-[120px] border border-input bg-background hover:bg-accent hover:text-accent-foreground",
		open && "[box-shadow:0_0px_0_0_var(--border)]",
		open && "translate-y-[3px] border-b-[0px]",
		className,
	);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger className={triggerStyles}>
				<span className="flex items-center gap-1.5 truncate">
					{isCheckbox ? (
						<>
							{selectedOptions.length > 0 ? (
								<span className="flex items-center gap-1.5">
									<span className="flex items-center justify-center size-5 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
										{selectedOptions.length}
									</span>
									<span className="truncate">
										{selectedOptions.length === 1
											? selectedOptions[0]?.label
											: `${selectedOptions.length} selected`}
									</span>
								</span>
							) : (
								<span className="text-muted-foreground">{placeholder}</span>
							)}
						</>
					) : (
						<>
							{selectedOptions[0] ? (
								<span className="flex items-center gap-1.5">
									{selectedOptions[0]?.icon}
									<span>{selectedOptions[0]?.label}</span>
								</span>
							) : (
								<span className="text-muted-foreground">{placeholder}</span>
							)}
						</>
					)}
				</span>
				<ChevronDownIcon
					className={cn(
						"size-4 shrink-0 transition-transform duration-200",
						open && "rotate-180",
					)}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className={cn("min-w-[180px] border border-border", className)}
				align={align}
			>
				{isCheckbox ? (
					<>
						{options.map((option) => (
							<DropdownMenuCheckboxItem
								key={option.value}
								checked={selectedValues.includes(option.value)}
								onCheckedChange={(checked) =>
									handleCheckboxChange(option.value, checked === true)
								}
							>
								<span className="flex items-center gap-2 flex-1">
									{option.icon}
									<span className="flex-1">{option.label}</span>
								</span>
								{option.description && (
									<span className="text-xs text-muted-foreground">
										{option.description}
									</span>
								)}
							</DropdownMenuCheckboxItem>
						))}
					</>
				) : (
					<DropdownMenuRadioGroup
						value={value ?? ""}
						onValueChange={handleRadioChange}
					>
						{options.map((option) => (
							<DropdownMenuRadioItem key={option.value} value={option.value}>
								<span className="flex items-center gap-2 flex-1">
									{option.icon}
									<span className="flex-1">{option.label}</span>
								</span>
								{option.description && (
									<span className="text-xs text-muted-foreground">
										{option.description}
									</span>
								)}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
