/**
 * Animation constants based on Emil Kowalski's design engineering principles.
 * All durations in milliseconds.
 */

// Easing curves - stronger than built-in CSS easings
export const easings = {
	// Strong ease-out for UI interactions (starts fast, feels responsive)
	out: "cubic-bezier(0.23, 1, 0.32, 1)",
	// Strong ease-in-out for on-screen movement
	inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
	// iOS-like drawer curve
	drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
	// Standard ease for color changes
	standard: "ease",
} as const;

// Animation durations - UI animations stay under 300ms
export const durations = {
	// Button press feedback - must be instant
	press: 150,
	// Tooltips and small popovers
	tooltip: 150,
	// Dropdowns and selects
	dropdown: 200,
	// Modals and drawers
	modal: 250,
	// Stagger delay between list items
	stagger: 40,
	// Slower, deliberate animations (hold-to-delete release)
	deliberate: 200,
} as const;

// Animation properties to use in transitions
export const transitions = {
	// Press feedback - transform only (GPU accelerated)
	press: `transform ${durations.press}ms ${easings.out}`,
	// Tooltip/Popover enter/exit
	tooltip: `transform ${durations.tooltip}ms ${easings.out}, opacity ${durations.tooltip}ms ${easings.out}`,
	// Dropdown menu
	dropdown: `transform ${durations.dropdown}ms ${easings.out}, opacity ${durations.dropdown}ms ${easings.out}`,
	// Color changes (can be slower, no GPU)
	color: `color ${durations.dropdown}ms ${easings.standard}, background-color ${durations.dropdown}ms ${easings.standard}, border-color ${durations.dropdown}ms ${easings.standard}`,
	// Opacity only
	fade: `opacity ${durations.dropdown}ms ${easings.out}`,
	// Combined transform + opacity
	morph: `transform ${durations.dropdown}ms ${easings.out}, opacity ${durations.dropdown}ms ${easings.out}`,
} as const;

// Scale values for different interaction types
export const scales = {
	// Button/card press - subtle but noticeable
	press: 0.97,
	// Card press (larger area)
	cardPress: 0.99,
	// Popover/tooltip entry - never from zero
	popoverEntry: 0.95,
	// Modal entry
	modalEntry: 0.97,
} as const;

// CSS class strings for common patterns
export const pressFeedback = `active:scale-[${scales.press}] transition-transform duration-${durations.press}`;
export const cardPressFeedback = `active:scale-[${scales.cardPress}] transition-transform duration-${durations.press}`;
export const hoverOnly =
	"hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150";

// Media query strings for conditional animations
export const hoverMedia = "@media (hover: hover) and (pointer: fine)";
export const reducedMotionMedia = "@media (prefers-reduced-motion: reduce)";

// Stagger delay generator for list items
export function getStaggerDelay(index: number): string {
	return `${durations.stagger * index}ms`;
}

// For use with animation property (keyframes)
export const animations = {
	// Fade in with slight upward movement
	fadeIn: "fadeIn 200ms ease-out",
	// Slide in from below
	slideIn: "slideIn 200ms ease-out",
	// Scale in for popovers
	scaleIn: "scaleIn 200ms cubic-bezier(0.23, 1, 0.32, 1)",
} as const;

// Keyframe definitions (add to global CSS)
export const keyframes = `
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(8px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.95);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
	*, *::before, *::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}
`;
