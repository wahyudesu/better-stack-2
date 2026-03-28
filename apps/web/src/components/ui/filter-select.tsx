"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

export type FilterSelectVariant = "ghost" | "outline" | "secondary" | "default";
export type FilterSelectSize = "sm" | "default";

export interface FilterOption {
	value: string;
	label: string;
	icon?: ReactNode;
}

// ============================================
// FilterSelect - Unified filter component
// ============================================

interface FilterSelectProps<T extends string = string> {
	value: T;
	onChange: (value: T) => void;
	options: readonly FilterOption[] | FilterOption[];
	placeholder?: string;
	className?: string;
	panelClassName?: string;
	variant?: FilterSelectVariant;
	size?: FilterSelectSize;
	/** Hide the dropdown arrow icon */
	hideIcon?: boolean;
}

export function FilterSelect<T extends string = string>({
	value,
	onChange,
	options,
	placeholder = "Select...",
	className,
	panelClassName,
	variant = "ghost",
	size = "default",
	hideIcon = false,
}: FilterSelectProps<T>) {
	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<Select
			value={value}
			onValueChange={(v) => onChange((v ?? options[0]?.value ?? "") as T)}
		>
			<SelectTrigger
				variant={variant}
				size={size}
				className={cn(
					// Override rounded-4xl to rounded-lg like FilterDropdown
					"rounded-lg",
					// Force minimal styling for ghost variant (FilterDropdown baseline)
					variant === "ghost" &&
						"border-none shadow-none bg-transparent hover:bg-muted/50 data-[state=open]:bg-muted/50 justify-start",
					className,
				)}
			>
				{selectedOption ? (
					<span className="flex items-center gap-1.5">
						{selectedOption.icon}
						{selectedOption.label}
					</span>
				) : (
					<SelectValue placeholder={placeholder} />
				)}
				{!hideIcon && (
					<ChevronDownIcon className="ml-auto text-muted-foreground" />
				)}
			</SelectTrigger>
			<SelectContent
				className={cn("w-40", panelClassName)}
				alignItemWithTrigger={false}
			>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						<span className="flex items-center gap-2.5 flex-1">
							{option.icon}
							<span className="font-medium">{option.label}</span>
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

// ============================================
// Preset: Status Filter
// ============================================

export const STATUS_OPTIONS = [
	{ value: "all", label: "All Status" },
	{ value: "draft", label: "Draft" },
	{ value: "scheduled", label: "Scheduled" },
	{ value: "published", label: "Published" },
] as const;

interface StatusFilterProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

export function StatusFilter({
	value,
	onChange,
	className,
}: StatusFilterProps) {
	return (
		<FilterSelect
			value={value}
			onChange={onChange}
			options={STATUS_OPTIONS}
			placeholder="Status..."
			className={className}
		/>
	);
}

// ============================================
// Preset: Platform Filter (with icons)
// ============================================

export const PLATFORM_OPTIONS = [
	{ value: "all", label: "All Platforms" },
	{
		value: "instagram",
		label: "Instagram",
		icon: <PlatformIcon platform="instagram" size={18} />,
	},
	{
		value: "tiktok",
		label: "TikTok",
		icon: <PlatformIcon platform="tiktok" size={18} />,
	},
	{
		value: "twitter",
		label: "X / Twitter",
		icon: <PlatformIcon platform="twitter" size={18} />,
	},
	{
		value: "youtube",
		label: "YouTube",
		icon: <PlatformIcon platform="youtube" size={18} />,
	},
	{
		value: "facebook",
		label: "Facebook",
		icon: <PlatformIcon platform="facebook" size={18} />,
	},
	{
		value: "linkedin",
		label: "LinkedIn",
		icon: <PlatformIcon platform="linkedin" size={18} />,
	},
	{
		value: "pinterest",
		label: "Pinterest",
		icon: <PlatformIcon platform="pinterest" size={18} />,
	},
	{
		value: "threads",
		label: "Threads",
		icon: <PlatformIcon platform="threads" size={18} />,
	},
] as const;

export type PlatformFilterValue = (typeof PLATFORM_OPTIONS)[number]["value"];

interface PlatformFilterProps {
	value: PlatformFilterValue;
	onChange: (value: PlatformFilterValue) => void;
	className?: string;
	variant?: FilterSelectVariant;
}

export function PlatformFilter({
	value,
	onChange,
	className,
	variant = "ghost",
}: PlatformFilterProps) {
	return (
		<FilterSelect
			value={value}
			onChange={onChange}
			options={PLATFORM_OPTIONS}
			placeholder="Platform..."
			className={className}
			variant={variant}
		/>
	);
}
