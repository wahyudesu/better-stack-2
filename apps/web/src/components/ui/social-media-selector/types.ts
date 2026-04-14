import type { SocialMediaProfile } from "@/lib/types/social";

export interface SocialMediaSelectorProps {
	profiles: SocialMediaProfile[];
	selected: string[];
	onChange: (selected: string[]) => void;
	max?: number;
	maxVisible?: number;
	label?: string;
	className?: string;
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export type { SocialMediaProfile };
