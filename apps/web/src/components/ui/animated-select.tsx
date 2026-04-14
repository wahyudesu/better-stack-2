"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@better-stack-2/ui/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

// ============================================================================
// Types
// ============================================================================

export interface SelectOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
	description?: string;
	badge?: string | number;
	disabled?: boolean;
}

type SelectVariant = "pill" | "filter" | "segment" | "minimal";
type SelectSize = "sm" | "md" | "lg";

export interface AnimatedSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: readonly SelectOption[] | SelectOption[];
	placeholder?: string;
	variant?: SelectVariant;
	size?: SelectSize;
	triggerClassName?: string;
	contentClassName?: string;
	align?: "start" | "center" | "end";
	showIcon?: boolean;
	showCheckmark?: boolean;
	emptyMessage?: string;
}

// ============================================================================
// Variant Configs
// ============================================================================

const variantStyles: Record<SelectVariant, { trigger: string; item: string }> =
	{
		pill: {
			trigger:
				"rounded-full border bg-background/50 backdrop-blur-sm data-[state=open]:bg-accent/50 hover:bg-accent/30 transition-all duration-200",
			item: "rounded-full data-[highlighted]:bg-accent/50 data-[selected]:bg-accent data-[selected]:font-medium",
		},
		filter: {
			trigger:
				"rounded-lg border-none bg-transparent shadow-none data-[state=open]:bg-muted/50 hover:bg-muted/30 transition-colors duration-150",
			item: "rounded-lg data-[highlighted]:bg-accent/50 data-[selected]:bg-accent/50",
		},
		segment: {
			trigger:
				"rounded-xl border bg-muted/30 data-[state=open]:bg-muted/50 hover:bg-muted/40 transition-colors duration-150",
			item: "rounded-xl data-[highlighted]:bg-accent/60 data-[selected]:bg-primary data-[selected]:text-primary-foreground",
		},
		minimal: {
			trigger:
				"rounded-none border-b border-transparent data-[state=open]:border-border hover:border-border/50 transition-colors duration-150",
			item: "rounded-none data-[highlighted]:bg-accent/30 data-[selected]:border-l-2 data-[selected]:border-primary",
		},
	};

const sizeStyles: Record<SelectSize, { trigger: string; item: string }> = {
	sm: { trigger: "h-8 px-3 py-1.5 text-xs", item: "py-1.5 px-2.5 text-xs" },
	md: { trigger: "h-9 px-4 py-2 text-sm", item: "py-2 px-3 text-sm" },
	lg: { trigger: "h-10 px-5 py-2.5 text-base", item: "py-2.5 px-4 text-base" },
};

// ============================================================================
// Animated Chevron
// ============================================================================

function AnimatedChevron({ isOpen }: { isOpen: boolean }) {
	return (
		<motion.div
			animate={{ rotate: isOpen ? 180 : 0 }}
			transition={{ duration: 0.2, ease: "easeInOut" }}
		>
			<ChevronDown className="size-4 text-muted-foreground" />
		</motion.div>
	);
}

// ============================================================================
// Select Item Component
// ============================================================================

interface SelectItemProps {
	option: SelectOption;
	isSelected: boolean;
	showCheckmark?: boolean;
}

function SelectItemComponent({
	option,
	isSelected,
	showCheckmark = true,
}: SelectItemProps) {
	return (
		<SelectPrimitive.Item
			value={option.value}
			disabled={option.disabled}
			className={cn(
				"relative flex cursor-pointer items-center gap-3 transition-colors",
				"focus-visible:outline-none",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				"py-2 px-3 text-sm",
				variantStyles.filter.item,
			)}
		>
			{option.icon && (
				<motion.span
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.15 }}
					className="shrink-0"
				>
					{option.icon}
				</motion.span>
			)}

			<SelectPrimitive.ItemText className="flex flex-1 flex-col gap-0.5">
				<span className="font-medium">{option.label}</span>
				{option.description && (
					<span className="text-xs text-muted-foreground">
						{option.description}
					</span>
				)}
			</SelectPrimitive.ItemText>

			{option.badge && (
				<motion.span
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
				>
					{option.badge}
				</motion.span>
			)}

			{showCheckmark && (
				<AnimatePresence initial={false}>
					{isSelected && (
						<motion.span
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0, opacity: 0 }}
							transition={{ type: "spring", stiffness: 500, damping: 25 }}
							className="absolute right-3"
						>
							<Check className="size-4 text-primary" />
						</motion.span>
					)}
				</AnimatePresence>
			)}
		</SelectPrimitive.Item>
	);
}

// ============================================================================
// Content Component
// ============================================================================

interface SelectContentProps {
	children: React.ReactNode;
	className?: string;
	align?: "start" | "center" | "end";
}

function SelectContentComponent({
	children,
	className,
	align = "start",
}: SelectContentProps) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner align={align} sideOffset={8} className="z-50">
				<SelectPrimitive.Popup
					className={cn(
						"min-w-[160px] max-w-[280px]",
						"border bg-popover/95 backdrop-blur-sm shadow-lg",
						"overflow-hidden rounded-lg",
						"data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
						"data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
						"duration-150",
						className,
					)}
				>
					<SelectPrimitive.List className="p-1">
						{children}
					</SelectPrimitive.List>
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

// ============================================================================
// Main Component
// ============================================================================

export function AnimatedSelect({
	value,
	onChange,
	options,
	placeholder = "Select...",
	variant = "filter",
	size = "md",
	triggerClassName,
	contentClassName,
	align = "start",
	showIcon = true,
	showCheckmark = true,
	emptyMessage = "No options available",
}: AnimatedSelectProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const selectedOption = options.find((opt) => opt.value === value);

	const variantStyle = variantStyles[variant];
	const sizeStyle = sizeStyles[size];

	return (
		<SelectPrimitive.Root
			value={value}
			onValueChange={(v) => onChange(v as string)}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<SelectPrimitive.Trigger
				className={cn(
					"inline-flex items-center justify-between gap-2 outline-none",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"data-[placeholder]:text-muted-foreground",
					variantStyle.trigger,
					sizeStyle.trigger,
					triggerClassName,
				)}
			>
				<div className="flex items-center gap-2">
					{showIcon && selectedOption?.icon && (
						<span className="shrink-0 size-4">{selectedOption.icon}</span>
					)}
					<SelectPrimitive.Value className="flex-1 truncate">
						{selectedOption?.label || placeholder}
					</SelectPrimitive.Value>
				</div>
				<SelectPrimitive.Icon render={<AnimatedChevron isOpen={isOpen} />} />
			</SelectPrimitive.Trigger>

			<SelectContentComponent align={align} className={contentClassName}>
				{options.length === 0 ? (
					<div className="py-6 text-center text-sm text-muted-foreground">
						{emptyMessage}
					</div>
				) : (
					options.map((option) => (
						<SelectItemComponent
							key={option.value}
							option={option}
							isSelected={value === option.value}
							showCheckmark={showCheckmark}
						/>
					))
				)}
			</SelectContentComponent>
		</SelectPrimitive.Root>
	);
}

// ============================================================================
// Preset: Time Range Select
// ============================================================================

export interface TimeRangeSelectProps
	extends Omit<AnimatedSelectProps, "options" | "triggerClassName"> {
	className?: string;
}

const timeRangeOptions: SelectOption[] = [
	{ value: "7d", label: "7 Days", description: "Past week" },
	{ value: "14d", label: "14 Days", description: "Past 2 weeks" },
	{ value: "30d", label: "30 Days", description: "Past month" },
	{ value: "90d", label: "90 Days", description: "Past 3 months" },
	{ value: "1y", label: "1 Year", description: "Past 12 months" },
	{ value: "custom", label: "Custom", description: "Select date range" },
];

export function TimeRangeSelect({ className, ...props }: TimeRangeSelectProps) {
	return (
		<AnimatedSelect
			{...props}
			options={timeRangeOptions}
			placeholder="Time range"
			variant="pill"
			size="sm"
			triggerClassName={cn("w-[140px]", className)}
			align="end"
		/>
	);
}

// ============================================================================
// Preset: Report Type Select
// ============================================================================

export interface ReportTypeSelectProps
	extends Omit<AnimatedSelectProps, "options" | "triggerClassName"> {
	className?: string;
}

const reportTypeOptions: SelectOption[] = [
	{ value: "overview", label: "Overview" },
	{ value: "engagement", label: "Engagement" },
	{ value: "reach", label: "Reach" },
	{ value: "impressions", label: "Impressions" },
];

export function ReportTypeSelect({
	className,
	...props
}: ReportTypeSelectProps) {
	return (
		<AnimatedSelect
			{...props}
			options={reportTypeOptions}
			placeholder="Type"
			variant="filter"
			size="sm"
			triggerClassName={cn("w-[130px]", className)}
			align="start"
		/>
	);
}

// ============================================================================
// Preset: Platform Select
// ============================================================================

export interface PlatformSelectProps
	extends Omit<AnimatedSelectProps, "options" | "triggerClassName"> {
	className?: string;
}

const platformOptions: SelectOption[] = [
	{ value: "all", label: "All Platforms" },
	{ value: "instagram", label: "Instagram" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "twitter", label: "Twitter" },
	{ value: "linkedin", label: "LinkedIn" },
];

export function PlatformSelect({ className, ...props }: PlatformSelectProps) {
	return (
		<AnimatedSelect
			{...props}
			options={platformOptions}
			placeholder="Platform"
			variant="segment"
			size="md"
			triggerClassName={cn("w-[160px]", className)}
			align="start"
		/>
	);
}

// ============================================================================
// Segmented Control (Tab-style variant)
// ============================================================================

export interface SegmentedControlOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
	badge?: string | number;
}

export interface SegmentedControlProps {
	value: string;
	onChange: (value: string) => void;
	options: readonly SegmentedControlOption[];
	className?: string;
	size?: SelectSize;
}

export function SegmentedControl({
	value,
	onChange,
	options,
	className,
	size = "sm",
}: SegmentedControlProps) {
	const sizeStyle = sizeStyles[size];

	return (
		<div
			className={cn(
				"inline-flex items-center rounded-lg bg-muted/30 p-1",
				className,
			)}
		>
			{options.map((option) => {
				const isSelected = value === option.value;
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => onChange(option.value)}
						className={cn(
							"relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
							sizeStyle.item,
							isSelected
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{option.icon && <span className="size-4">{option.icon}</span>}
						<span>{option.label}</span>
						{option.badge && (
							<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
								{option.badge}
							</span>
						)}
						{isSelected && (
							<motion.div
								layoutId="segmented-highlight"
								initial={false}
								className="absolute inset-0 rounded-md bg-background shadow-sm"
								transition={{ type: "spring", stiffness: 400, damping: 30 }}
							/>
						)}
					</button>
				);
			})}
		</div>
	);
}

// ============================================================================
// Compact Filter Bar Component
// ============================================================================

export interface FilterBarOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
}

export interface CompactFilterBarProps {
	filters: {
		key: string;
		value: string;
		options: readonly FilterBarOption[];
		onChange: (value: string) => void;
		placeholder?: string;
	}[];
	className?: string;
}

export function CompactFilterBar({
	filters,
	className,
}: CompactFilterBarProps) {
	return (
		<div className={cn("flex items-center gap-2 overflow-x-auto", className)}>
			{filters.map((filter) => {
				const selectedOption = filter.options.find(
					(opt) => opt.value === filter.value,
				);
				return (
					<AnimatedSelect
						key={filter.key}
						value={filter.value}
						onChange={filter.onChange}
						options={filter.options as SelectOption[]}
						placeholder={filter.placeholder}
						variant="pill"
						size="sm"
						triggerClassName="flex-shrink-0"
					/>
				);
			})}
		</div>
	);
}

export default AnimatedSelect;
