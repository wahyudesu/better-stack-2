"use client";

import {
	DepthButtonMenu,
	type DepthMenuOption,
} from "@/components/ui/depth-button-menu";
import { type Platform, PlatformIcon } from "@/components/ui/PlatformIcon";

// Platform configuration
export const PLATFORM_OPTIONS = [
	{ value: "all" as const, label: "All Platforms" },
	{ value: "instagram", label: "Instagram" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "twitter", label: "X / Twitter" },
	{ value: "youtube", label: "YouTube" },
	{ value: "facebook", label: "Facebook" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "pinterest", label: "Pinterest" },
	{ value: "threads", label: "Threads" },
	{ value: "whatsapp", label: "WhatsApp" },
	{ value: "reddit", label: "Reddit" },
	{ value: "bluesky", label: "Bluesky" },
	{ value: "telegram", label: "Telegram" },
	{ value: "snapchat", label: "Snapchat" },
] as const;

export const PLATFORM_OPTIONS_NO_ALL = [
	{ value: "instagram", label: "Instagram" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "twitter", label: "X / Twitter" },
	{ value: "youtube", label: "YouTube" },
	{ value: "facebook", label: "Facebook" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "pinterest", label: "Pinterest" },
	{ value: "threads", label: "Threads" },
	{ value: "whatsapp", label: "WhatsApp" },
	{ value: "reddit", label: "Reddit" },
	{ value: "bluesky", label: "Bluesky" },
	{ value: "telegram", label: "Telegram" },
	{ value: "snapchat", label: "Snapchat" },
] as const;

export const PLATFORM_MULTI_OPTIONS = [
	{ value: "instagram", label: "Instagram" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "twitter", label: "Twitter" },
	{ value: "youtube", label: "YouTube" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "facebook", label: "Facebook" },
	{ value: "threads", label: "Threads" },
] as const;

export type PlatformFilterValue = Platform | "all";
export type PlatformMultiValue =
	(typeof PLATFORM_MULTI_OPTIONS)[number]["value"];

// ============================================
// Helpers
// ============================================

export function getPlatformLabel(platform: PlatformFilterValue): string {
	return PLATFORM_OPTIONS.find((p) => p.value === platform)?.label || platform;
}

export function getPlatformOptions(
	includeAll: boolean = true,
): DepthMenuOption[] {
	const baseOptions = includeAll ? PLATFORM_OPTIONS : PLATFORM_OPTIONS_NO_ALL;
	return baseOptions.map((p) => ({
		value: p.value,
		label: p.label,
		icon:
			p.value !== "all" ? (
				<PlatformIcon platform={p.value} size={16} />
			) : undefined,
	}));
}

// ============================================
// Types
// ============================================

export interface PlatformOption {
	value: string;
	label: string;
}

// ============================================
// PlatformFilterDropdown - Single select with depth style
// ============================================

export type PlatformFilterVariant =
	| "default"
	| "secondary"
	| "outline"
	| "ghost";

export interface PlatformFilterDropdownProps {
	value: PlatformFilterValue;
	onChange: (value: PlatformFilterValue) => void;
	className?: string;
	size?: "default" | "sm" | "lg";
	align?: "start" | "center" | "end";
	includeAllOption?: boolean;
}

export function PlatformFilterDropdown({
	value,
	onChange,
	className,
	size = "default",
	align = "start",
	includeAllOption = true,
}: PlatformFilterDropdownProps) {
	return (
		<DepthButtonMenu
			mode="radio"
			value={value}
			onChange={onChange}
			options={getPlatformOptions(includeAllOption)}
			placeholder="All Platforms"
			className={className}
			size={size}
			align={align}
		/>
	);
}

// ============================================
// PlatformFilterMulti - Multi select with depth style
// ============================================

export interface PlatformFilterMultiProps {
	values: PlatformMultiValue[];
	onChange: (values: PlatformMultiValue[]) => void;
	label?: string;
	className?: string;
	size?: "default" | "sm" | "lg";
	align?: "start" | "center" | "end";
	keepOpen?: boolean;
}

export function PlatformFilterMulti({
	values,
	onChange,
	label = "Platforms",
	className,
	size = "default",
	align = "start",
	keepOpen = true, // default true for multi-select UX
}: PlatformFilterMultiProps) {
	const multiOptions: DepthMenuOption[] = PLATFORM_MULTI_OPTIONS.map((p) => ({
		value: p.value,
		label: p.label,
		icon: <PlatformIcon platform={p.value} size={16} />,
	}));

	return (
		<DepthButtonMenu
			mode="checkbox"
			values={values}
			onValuesChange={(newValues) =>
				onChange(newValues as PlatformMultiValue[])
			}
			options={multiOptions}
			placeholder={label}
			className={className}
			size={size}
			align={align}
			keepOpen={keepOpen}
		/>
	);
}

// ============================================
// PlatformFilterPills - Horizontal scrollable pills
// ============================================

export interface PlatformFilterPillsProps {
	value: PlatformFilterValue;
	onChange: (value: PlatformFilterValue) => void;
	options?: typeof PLATFORM_OPTIONS;
	className?: string;
}

export function PlatformFilterPills({
	value,
	onChange,
	options = PLATFORM_OPTIONS,
	className,
}: PlatformFilterPillsProps) {
	return (
		<div
			className={
				"flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide " +
				className
			}
		>
			{options.map((platform) => (
				<button
					key={platform.value}
					type="button"
					onClick={() => onChange(platform.value)}
					className={
						"cursor-pointer shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all " +
						(value === platform.value
							? "bg-primary text-primary-foreground"
							: "bg-muted text-muted-foreground hover:bg-muted/70")
					}
				>
					{platform.value !== "all" && (
						<PlatformIcon platform={platform.value} size={14} />
					)}
					{platform.label}
				</button>
			))}
		</div>
	);
}

// ============================================
// PlatformFilterSelect - Simple select (alias for dropdown)
// ============================================

export interface PlatformFilterSelectProps {
	value: Platform;
	onChange: (value: Platform) => void;
	placeholder?: string;
	className?: string;
	size?: "default" | "sm" | "lg";
}

export function PlatformFilterSelect({
	value,
	onChange,
	placeholder = "Select platform",
	className,
	size = "default",
}: PlatformFilterSelectProps) {
	return (
		<DepthButtonMenu
			mode="radio"
			value={value}
			onChange={onChange}
			options={getPlatformOptions(false)}
			placeholder={placeholder}
			className={className}
			size={size}
		/>
	);
}
