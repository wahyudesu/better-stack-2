/**
 * Reusable animation utility classes based on Emil Kowalski's design engineering principles.
 *
 * Usage: Import and spread these classes into your className props.
 * Example: <button className={`${pressButton} hover:bg-muted`}>Click</button>
 */

// Press feedback - for buttons and small interactive elements
export const pressButton =
	"active:scale-[0.97] transition-transform duration-150 ease-out";

// Card press feedback - more subtle for cards and larger areas
export const pressCard =
	"active:scale-[0.99] transition-transform duration-150 ease-out";

// Morph transition - for combined transform + opacity changes
export const morph = "transition-all duration-200 ease-out";

// Fade transition - opacity only
export const fade = "transition-opacity duration-200 ease-out";

// Color transition - for colors, backgrounds, borders
export const colorChange = "transition-colors duration-150 ease-out";

// Hover guard - only apply on devices with proper hover
export const hoverOnly =
	"[@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted/50";

// Hover lift effect - only on proper hover devices
export const hoverLift =
	"[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-px transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:active:translate-y-0";

// Hover scale - only on proper hover devices
export const hoverScale =
	"[@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150 ease-out";

// Stagger animation delays (in ms)
export const staggerDelays = [
	0, 40, 80, 120, 160, 200, 240, 280, 320, 360,
] as const;

// Get stagger delay for an index
export function getStaggerDelay(index: number): string {
	return `${staggerDelays[index % staggerDelays.length]}ms`;
}

// Stagger animation class - use with inline style for delay
export const stagger = "animate-[slide-in_200ms_ease-out_both]";

// Fade in animation class
export const fadeIn = "animate-[fade-in_200ms_ease-out_both]";

// Slide in animation class
export const slideIn = "animate-[slide-in_200ms_ease-out_both]";

// Scale in animation class - for popovers/modals
export const scaleIn =
	"animate-[scale-in_200ms_cubic-bezier(0.23,1,0.32,1)_both]";
