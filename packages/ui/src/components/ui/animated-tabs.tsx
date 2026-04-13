"use client";

import { Slot } from "@radix-ui/react-slot";
import { Button } from "@better-stack-2/ui/components/button";
import { cn } from "@better-stack-2/ui/lib/utils";

export interface Tab {
	id: string;
	label: string;
	icon?: React.ReactNode;
}

interface AnimatedTabsProps {
	tabs: Tab[];
	activeTab: string;
	onChange: (value: string) => void;
	variant?: "segment" | "underline";
	iconOnly?: boolean;
	className?: string;
}

export function AnimatedTabs({
	tabs,
	activeTab,
	onChange,
	variant = "segment",
	iconOnly = false,
	className,
}: AnimatedTabsProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1 rounded-lg bg-muted p-1",
				className,
			)}
		>
			{tabs.map((tab) => (
				<Button
					key={tab.id}
					variant="ghost"
					size="sm"
					onClick={() => onChange(tab.id)}
					className={cn(
						"relative h-7 min-w-0 gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
						"data-[state=active]:bg-background data-[state=active]:shadow-sm",
						activeTab === tab.id
							? "bg-background shadow-sm"
							: "hover:bg-muted-foreground/10",
						iconOnly && "w-7 px-0",
					)}
					data-state={activeTab === tab.id ? "active" : "inactive"}
				>
					{tab.icon && <Slot className="h-3.5 w-3.5">{tab.icon}</Slot>}
					{!iconOnly && <span>{tab.label}</span>}
				</Button>
			))}
		</div>
	);
}
