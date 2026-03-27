"use client";

import { Check } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
	value: string;
	label: string;
}

interface FilterDropdownProps {
	value: string;
	onChange: (value: string) => void;
	options: readonly FilterOption[] | FilterOption[];
	placeholder?: string;
	className?: string;
	panelClassName?: string;
}

export function FilterDropdown({
	value,
	onChange,
	options,
	placeholder = "Select...",
	className,
	panelClassName,
}: FilterDropdownProps) {
	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger
				className={cn(
					"h-9 gap-2 px-4 text-sm font-medium bg-transparent hover:bg-muted/50 data-[state=open]:bg-muted/50 border-none shadow-none rounded-lg justify-start",
					className,
				)}
			>
				{selectedOption?.label || placeholder}
			</SelectTrigger>
			<SelectContent
				className={cn("w-40", panelClassName)}
				alignItemWithTrigger={false}
			>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						<span className="font-medium flex-1">{option.label}</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
