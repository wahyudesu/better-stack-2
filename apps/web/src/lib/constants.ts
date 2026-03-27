// Platform colors - HSL format for Tailwind compatibility
export const platformColors: Record<string, string> = {
	instagram: "328 70% 55%",
	tiktok: "349 70% 56%",
	twitter: "203 89% 53%",
	youtube: "0 72% 51%",
	facebook: "221 83% 53%",
	linkedin: "215 100% 50%",
	pinterest: "0 100% 50%",
	threads: "0 0% 9%",
	whatsapp: "142 76% 36%",
	reddit: "16 100% 50%",
	bluesky: "205 100% 50%",
	google: "38 100% 50%",
	telegram: "196 100% 40%",
	snapchat: "48 100% 50%",
};

// Platform background colors with opacity
export function getPlatformBgColor(platform: string): string {
	const color = platformColors[platform] || "0 0% 50%";
	return `hsl(${color} / 0.15)`;
}

// Platform foreground colors
export function getPlatformColor(platform: string): string {
	const color = platformColors[platform] || "0 0% 50%";
	return `hsl(${color})`;
}

// Status badge styles
export const statusStyles: Record<string, { bg: string; text: string }> = {
	published: { bg: "hsl(142 76% 36% / 0.15)", text: "hsl(142 76% 36%)" },
	scheduled: { bg: "hsl(var(--primary) / 0.15)", text: "hsl(var(--primary))" },
	draft: { bg: "hsl(var(--muted))", text: "hsl(var(--muted-foreground))" },
	pending: { bg: "hsl(38 92% 50% / 0.15)", text: "hsl(38 92% 50%)" },
};

// Day names for calendar header
export const DAY_NAMES = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
] as const;

// Calendar utility functions
export function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
	return new Date(year, month, 1).getDay();
}
