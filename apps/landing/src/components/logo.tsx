import type React from "react";

export const LogoIcon = (props: React.ComponentProps<"svg">) => (
	<svg
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="32" height="32" rx="8" fill="currentColor" />
		<path
			d="M8 12L16 20L24 12"
			stroke="white"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M8 20L16 12L24 20"
			stroke="white"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			opacity="0.5"
		/>
	</svg>
);

export const Logo = (props: React.ComponentProps<"svg">) => (
	<svg
		viewBox="0 0 88 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="currentColor" />
		<path
			d="M6 9L12 15L18 9"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M6 15L12 9L18 15"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			opacity="0.5"
		/>
		<text
			x="30"
			y="16"
			fontFamily="system-ui, -apple-system, sans-serif"
			fontSize="15"
			fontWeight="600"
			fill="currentColor"
			letterSpacing="-0.5"
		>
			ZenPost
		</text>
	</svg>
);
