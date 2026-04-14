"use client";

import { Button } from "@/components/ui/button";

type PublishMode = "draft" | "schedule" | "now";

interface PublishOptionsProps {
	value: PublishMode;
	onChange: (value: PublishMode) => void;
}

export function PublishOptions({ value, onChange }: PublishOptionsProps) {
	const options: { value: PublishMode; label: string }[] = [
		{ value: "now", label: "Publish now" },
		{ value: "schedule", label: "Schedule" },
		{ value: "draft", label: "Save as draft" },
	];

	return (
		<div className="space-y-3">
			<span className="text-sm font-medium">publishing</span>
			<div className="flex gap-2">
				{options.map((opt) => (
					<Button
						key={opt.value}
						type="button"
						variant={value === opt.value ? "default" : "outline"}
						size="sm"
						onClick={() => onChange(opt.value)}
					>
						{opt.label}
					</Button>
				))}
			</div>
		</div>
	);
}
