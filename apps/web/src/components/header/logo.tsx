"use client";

import { LogoZenpostCompact } from "@/components/logo-mwheh";

interface LogoProps {
	className?: string;
}

export function Logo({ className = "size-8" }: LogoProps) {
	return (
		<div className="flex items-center gap-2">
			<LogoZenpostCompact className={className} />
			<span className="text-lg font-bold">Zenpost</span>
		</div>
	);
}
