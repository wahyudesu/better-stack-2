"use client";

import { Button } from "@/components/ui/button";

type PublishMode = "now" | "schedule" | "queue" | "draft";

interface PublishOptionsProps {
	value: PublishMode;
	onChange: (value: PublishMode) => void;
}

export function PublishOptions({ value, onChange }: PublishOptionsProps) {
	const options: { value: PublishMode; label: string; description: string }[] =
		[
			{ value: "now", label: "Publish now", description: "immediately" },
			{ value: "schedule", label: "Schedule", description: "pick date & time" },
			{ value: "queue", label: "Queue", description: "add to queue" },
			{ value: "draft", label: "Save as draft", description: "publish later" },
		];

	return (
		<div className="space-y-3">
			<span className="text-sm font-medium">publishing</span>
			<div className="grid grid-cols-2 gap-2">
				{options.map((opt) => (
					<Button
						key={opt.value}
						type="button"
						variant={value === opt.value ? "default" : "outline"}
						size="sm"
						onClick={() => onChange(opt.value)}
						className="flex flex-col items-start h-auto py-2 px-3"
					>
						<span className="font-medium">{opt.label}</span>
						<span className="text-xs opacity-70 font-normal">
							{opt.description}
						</span>
					</Button>
				))}
			</div>
		</div>
	);
}
