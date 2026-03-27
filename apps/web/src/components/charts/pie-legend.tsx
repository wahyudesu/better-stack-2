"use client";

import { cn } from "@better-stack-2/ui/lib/utils";
import type { ReactNode } from "react";
import React from "react";

export interface LegendItem {
	label: string;
	value: number;
	color?: string;
}

export interface LegendProps {
	items: LegendItem[];
	hoveredIndex?: number | null;
	onHoverChange?: (index: number | null) => void;
	children: ReactNode;
	className?: string;
}

export function Legend({
	items,
	hoveredIndex,
	onHoverChange,
	children,
	className,
}: LegendProps) {
	return (
		<div className={cn("flex flex-wrap justify-center gap-4", className)}>
			{items.map((item, index) => (
				<div key={item.label}>
					{renderChildren(children, {
						index,
						item,
						hoveredIndex: hoveredIndex ?? null,
						onHoverChange,
					})}
				</div>
			))}
		</div>
	);
}

// Helper to render children with context
function renderChildren(
	children: ReactNode,
	context: {
		index: number;
		item: LegendItem;
		hoveredIndex: number | null;
		onHoverChange?: (index: number | null) => void;
		childIndex?: number;
	},
): ReactNode {
	if (Array.isArray(children)) {
		return children.map((child, idx) => (
			<React.Fragment
				key={context.childIndex !== undefined ? `${context.index}-${idx}` : idx}
			>
				{renderChild(child, { ...context, childIndex: idx })}
			</React.Fragment>
		));
	}
	return renderChild(children, context);
}

function renderChild(
	child: ReactNode,
	context: {
		index: number;
		item: LegendItem;
		hoveredIndex: number | null;
		onHoverChange?: (index: number | null) => void;
		childIndex?: number;
	},
): ReactNode {
	// Check if this is a component we need to inject props into
	if (child && typeof child === "object" && "type" in child) {
		const childType = child.type as { displayName?: string };
		const props = child.props as {
			children?: ReactNode;
			className?: string;
			showValue?: boolean;
			valueSuffix?: string;
		};

		if (childType?.displayName === "LegendItemComponent") {
			return (
				<LegendItemComponent
					index={context.index}
					item={context.item}
					hoveredIndex={context.hoveredIndex}
					onHoverChange={context.onHoverChange}
					className={props.className}
				>
					{renderChildren(props.children, context)}
				</LegendItemComponent>
			);
		}

		if (childType?.displayName === "LegendMarker") {
			return (
				<LegendMarker
					index={context.index}
					item={context.item}
					className={props.className}
				/>
			);
		}

		if (childType?.displayName === "LegendLabel") {
			return (
				<LegendLabel
					index={context.index}
					item={context.item}
					className={props.className}
					showValue={props.showValue}
					valueSuffix={props.valueSuffix}
				/>
			);
		}
	}
	return child;
}

Legend.displayName = "Legend";

export interface LegendItemComponentProps {
	index?: number;
	item?: LegendItem;
	hoveredIndex?: number | null;
	onHoverChange?: (index: number | null) => void;
	children?: ReactNode;
	className?: string;
}

export function LegendItemComponent({
	index = 0,
	item,
	hoveredIndex,
	onHoverChange,
	children,
	className,
}: LegendItemComponentProps) {
	if (!item) return null;

	const isHovered = hoveredIndex === index;
	const isFaded =
		hoveredIndex !== null && hoveredIndex !== undefined && !isHovered;

	return (
		<div
			className={cn(
				"flex items-center gap-2 transition-opacity duration-150 cursor-pointer",
				isFaded && "opacity-40",
				className,
			)}
			onMouseEnter={() => onHoverChange?.(index)}
			onMouseLeave={() => onHoverChange?.(null)}
		>
			{children}
		</div>
	);
}

LegendItemComponent.displayName = "LegendItemComponent";

export interface LegendMarkerProps {
	index?: number;
	item?: LegendItem;
	className?: string;
}

export function LegendMarker({ item, className }: LegendMarkerProps) {
	if (!item) return null;

	return (
		<div
			className={cn("w-3 h-3 rounded-full shrink-0", className)}
			style={{ backgroundColor: item.color }}
		/>
	);
}

LegendMarker.displayName = "LegendMarker";

export interface LegendLabelProps {
	index?: number;
	item?: LegendItem;
	className?: string;
	showValue?: boolean;
	valueSuffix?: string;
}

export function LegendLabel({
	item,
	className,
	showValue = true,
	valueSuffix = "%",
}: LegendLabelProps) {
	if (!item) return null;

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span className="text-sm text-muted-foreground">{item.label}</span>
			{showValue && (
				<span className="text-sm font-semibold">
					{item.value}
					{valueSuffix}
				</span>
			)}
		</div>
	);
}

LegendLabel.displayName = "LegendLabel";

export default Legend;
