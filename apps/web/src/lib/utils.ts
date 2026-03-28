import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Helper for Select onChange handlers.
 * Select components pass `string | null`, so we use null coalescing
 * to ensure we always return a string value.
 */
export function selectHandler<T extends string>(
	value: T | null,
	defaultValue: T,
	callback: (value: T) => void,
) {
	callback(value ?? defaultValue);
}
