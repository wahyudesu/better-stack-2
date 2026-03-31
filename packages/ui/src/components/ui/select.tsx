"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@better-stack-2/ui/lib/utils";

const Select = SelectPrimitive.Root;

// Create a context to track highlighted item for animation
const SelectHighlightContext = React.createContext<{
	highlightedValue: string | null;
	setHighlightedValue: (value: string | null) => void;
} | null>(null);

function useSelectHighlight() {
	const context = React.useContext(SelectHighlightContext);
	if (!context) {
		throw new Error("useSelectHighlight must be used within SelectContent");
	}
	return context;
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
	return (
		<SelectPrimitive.Group
			data-slot="select-group"
			className={cn("scroll-my-1 p-1", className)}
			{...props}
		/>
	);
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
	return (
		<SelectPrimitive.Value
			data-slot="select-value"
			className={cn("flex flex-1 text-left", className)}
			{...props}
		/>
	);
}

type SelectVariant = "default" | "secondary" | "outline" | "ghost";

function SelectTrigger({
	className,
	size = "default",
	variant = "default",
	children,
	...props
}: SelectPrimitive.Trigger.Props & {
	size?: "sm" | "default";
	variant?: SelectVariant;
}) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			data-size={size}
			data-variant={variant}
			className={cn(
				"flex w-fit items-center justify-between gap-1.5 rounded-4xl px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				// Base styles - override per variant
				"rounded-4xl border",
				// Variant styles
				"data-[variant=default]:bg-input/30 data-[variant=default]:border-input data-[variant=default]:dark:hover:bg-input/50",
				"data-[variant=secondary]:bg-secondary data-[variant=secondary]:text-secondary-foreground data-[variant=secondary]:border-transparent data-[variant=secondary]:hover:bg-secondary/80 data-[variant=secondary]:aria-expanded:bg-secondary data-[variant=secondary]:aria-expanded:text-secondary-foreground",
				"data-[variant=outline]:bg-transparent data-[variant=outline]:border-input data-[variant=outline]:hover:bg-accent data-[variant=outline]:dark:hover:bg-accent/50",
				"data-[variant=ghost]:bg-transparent data-[variant=ghost]:border-transparent data-[variant=ghost]:hover:bg-accent data-[variant=ghost]:hover:text-accent-foreground data-[variant=ghost]:dark:hover:bg-accent/50",
				// Invalid state per variant
				"dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
				className,
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon
				render={
					<ChevronDownIcon className="pointer-events-none text-muted-foreground" />
				}
			/>
		</SelectPrimitive.Trigger>
	);
}

function SelectContent({
	className,
	children,
	side = "bottom",
	sideOffset = 4,
	align = "center",
	alignOffset = 0,
	alignItemWithTrigger = true,
	...props
}: SelectPrimitive.Popup.Props &
	Pick<
		SelectPrimitive.Positioner.Props,
		"align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
	>) {
	const [highlightedValue, setHighlightedValue] = React.useState<string | null>(
		null,
	);
	const [highlightBounds, setHighlightBounds] = React.useState<DOMRect | null>(
		null,
	);
	const containerRef = React.useRef<HTMLDivElement>(null);

	// Update highlight bounds when highlighted value changes
	React.useEffect(() => {
		if (!highlightedValue || !containerRef.current) {
			setHighlightBounds(null);
			return;
		}

		const item = containerRef.current.querySelector(
			`[data-value="${highlightedValue}"]`,
		) as HTMLElement | null;
		if (item && containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			const itemRect = item.getBoundingClientRect();
			setHighlightBounds({
				top: itemRect.top - containerRect.top,
				left: itemRect.left - containerRect.left,
				width: itemRect.width,
				height: itemRect.height,
				toJSON: () => "", // Add missing property
			} as DOMRect);
		}
	}, [highlightedValue]);

	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				alignItemWithTrigger={alignItemWithTrigger}
				className="isolate z-50"
			>
				<SelectPrimitive.Popup
					data-slot="select-content"
					data-align-trigger={alignItemWithTrigger}
					className={cn(
						"bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg shadow-md duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none",
						className,
					)}
					{...props}
				>
					<SelectScrollUpButton />
					<SelectHighlightContext.Provider
						value={{ highlightedValue, setHighlightedValue }}
					>
						<SelectPrimitive.List ref={containerRef} className="relative">
							<AnimatePresence initial={false}>
								{highlightBounds && (
									<motion.div
										layoutId="select-highlight"
										className="absolute rounded-xl bg-accent/80"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											type: "spring",
											stiffness: 6000,
											damping: 200,
										}}
										style={{
											top: highlightBounds.top,
											left: highlightBounds.left,
											width: highlightBounds.width,
											height: highlightBounds.height,
										}}
									/>
								)}
							</AnimatePresence>
							{children}
						</SelectPrimitive.List>
					</SelectHighlightContext.Provider>
					<SelectScrollDownButton />
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel({
	className,
	...props
}: SelectPrimitive.GroupLabel.Props) {
	return (
		<SelectPrimitive.GroupLabel
			data-slot="select-label"
			className={cn("px-3 py-2.5 text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
}

function SelectItem({
	className,
	children,
	...props
}: SelectPrimitive.Item.Props) {
	const { setHighlightedValue } = useSelectHighlight();
	const itemRef = React.useRef<HTMLDivElement>(null);

	// Get the value from props for data attribute
	const value = (props as any)?.value || "";

	return (
		<SelectPrimitive.Item
			ref={itemRef}
			data-slot="select-item"
			data-value={value}
			onMouseEnter={() => setHighlightedValue(value || null)}
			className={cn(
				"relative flex w-full cursor-default items-center gap-2.5 rounded-xl py-2 pr-8 pl-3 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				"z-10", // Ensure items are above the highlight
				className,
			)}
			{...props}
		>
			<SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2">
				{children}
			</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator
				render={
					<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
				}
			>
				<CheckIcon className="pointer-events-none" />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
}

function SelectSeparator({
	className,
	...props
}: SelectPrimitive.Separator.Props) {
	return (
		<SelectPrimitive.Separator
			data-slot="select-separator"
			className={cn(
				"pointer-events-none -mx-1 my-1 h-px bg-border/50",
				className,
			)}
			{...props}
		/>
	);
}

function SelectScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
	return (
		<SelectPrimitive.ScrollUpArrow
			data-slot="select-scroll-up-button"
			className={cn(
				"top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			<ChevronUpIcon />
		</SelectPrimitive.ScrollUpArrow>
	);
}

function SelectScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
	return (
		<SelectPrimitive.ScrollDownArrow
			data-slot="select-scroll-down-button"
			className={cn(
				"bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			<ChevronDownIcon />
		</SelectPrimitive.ScrollDownArrow>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
