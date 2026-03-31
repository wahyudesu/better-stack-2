// Tremor BarList [v1.0.0]

import React from "react";

import { cn, focusRing } from "@/lib/utils";

type Bar<T> = T & {
	key?: string;
	href?: string;
	value: number;
	name: string;
};

interface BarListProps<T = unknown>
	extends React.HTMLAttributes<HTMLDivElement> {
	data: Bar<T>[];
	valueFormatter?: (value: number) => string;
	showAnimation?: boolean;
	onValueChange?: (payload: Bar<T>) => void;
	sortOrder?: "ascending" | "descending" | "none";
	selectedKey?: string | null;
}

function BarListInner<T>(
	{
		data = [],
		valueFormatter = (value) => value.toString(),
		showAnimation = false,
		onValueChange,
		sortOrder = "descending",
		selectedKey = null,
		className,
		...props
	}: BarListProps<T>,
	forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
	// biome-ignore lint/correctness/useHookAtTopLevel: Used in forwardRef component pattern
	const sortedData = React.useMemo(() => {
		if (sortOrder === "none") {
			return data;
		}
		return [...data].sort((a, b) => {
			return sortOrder === "ascending" ? a.value - b.value : b.value - a.value;
		});
	}, [data, sortOrder]);

	// biome-ignore lint/correctness/useHookAtTopLevel: Used in forwardRef component pattern
	const widths = React.useMemo(() => {
		const maxValue = Math.max(...sortedData.map((item) => item.value), 0);
		return sortedData.map((item) =>
			item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2),
		);
	}, [sortedData]);

	const Component = onValueChange ? "button" : "div";
	const rowHeight = "h-8";

	return (
		<div
			ref={forwardedRef}
			className={cn("flex justify-between space-x-6", className)}
			tremor-id="tremor-raw"
			{...props}
		>
			<div className="relative w-full space-y-1.5">
				{sortedData.map((item, index) => {
					const isSelected = (item.key ?? item.name) === selectedKey;
					return (
						<Component
							key={item.key ?? item.name}
							onClick={() => {
								onValueChange?.(item);
							}}
							className={cn(
								// base
								"group w-full rounded-sm",
								// focus
								focusRing,
								onValueChange
									? [
											"-m-0! cursor-pointer",
											// hover
											!isSelected && "hover:bg-gray-50 dark:hover:bg-gray-900",
											// selected
											isSelected && "bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-200 dark:ring-blue-800",
										]
									: "",
							)}
						>
							<div
								className={cn(
									// base
									"flex items-center rounded-sm transition-all",
									rowHeight,
									// background color
									"bg-blue-200 dark:bg-blue-900",
									onValueChange
										? isSelected
											? "bg-blue-500 dark:bg-blue-600"
											: "group-hover:bg-blue-300 dark:group-hover:bg-blue-800"
										: "",
									// margin and duration
									{
										"mb-0": index === sortedData.length - 1,
										"duration-800": showAnimation,
									},
								)}
								style={{ width: `${widths[index]}%` }}
							>
								<div className={cn("absolute left-2 flex max-w-full pr-2")}>
									{item.href ? (
										<a
											href={item.href}
											className={cn(
												// base
												"truncate whitespace-nowrap rounded-sm text-sm",
												// text color
												"text-gray-900 dark:text-gray-50",
												// hover
												"hover:underline hover:underline-offset-2",
												// focus
												focusRing,
											)}
											target="_blank"
											rel="noreferrer"
											onClick={(event) => event.stopPropagation()}
										>
											{item.name}
										</a>
									) : (
										<p
											className={cn(
												// base
												"truncate whitespace-nowrap text-sm",
												// text color
												"text-gray-900 dark:text-gray-50",
												// selected
												isSelected && "font-medium",
											)}
										>
											{item.name}
										</p>
									)}
								</div>
							</div>
						</Component>
					);
				})}
			</div>
			<div>
				{sortedData.map((item, index) => {
					const isSelected = (item.key ?? item.name) === selectedKey;
					return (
						<div
							key={item.key ?? item.name}
							className={cn(
								"flex items-center justify-end",
								rowHeight,
								index === sortedData.length - 1 ? "mb-0" : "mb-1.5",
							)}
						>
							<p
								className={cn(
									// base
									"truncate whitespace-nowrap text-sm leading-none",
									// text color
									"text-gray-900 dark:text-gray-50",
									// selected
									isSelected && "font-semibold",
								)}
							>
								{valueFormatter(item.value)}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}

BarListInner.displayName = "BarList";

const BarList = React.forwardRef(BarListInner) as <T>(
	p: BarListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof BarListInner>;

export { BarList, type BarListProps };
