"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
	extends Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		"onChange" | "value" | "defaultChecked"
	> {
	onCheckedChange?: (checked: boolean) => void;
	checked?: boolean;
	defaultChecked?: boolean;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
	({ className, onCheckedChange, checked, defaultChecked, ...props }, ref) => {
		const [isChecked, setIsChecked] = React.useState(
			defaultChecked ?? checked ?? false,
		);

		React.useEffect(() => {
			if (checked !== undefined) {
				setIsChecked(checked);
			}
		}, [checked]);

		const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newChecked = e.target.checked;
			setIsChecked(newChecked);
			onCheckedChange?.(newChecked);
		};

		return (
			<button
				ref={ref}
				type="button"
				role="switch"
				aria-checked={isChecked}
				className={cn(
					"peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
					isChecked ? "bg-primary" : "bg-input",
					className,
				)}
				onClick={() => {
					const newChecked = !isChecked;
					setIsChecked(newChecked);
					onCheckedChange?.(newChecked);
				}}
				{...props}
			>
				<span
					className={cn(
						"pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
						isChecked ? "translate-x-5" : "translate-x-0",
					)}
				/>
			</button>
		);
	},
);
Switch.displayName = "Switch";

export { Switch };
