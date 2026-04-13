/**
 * Social media platform icons as SVG components.
 * Replaces react-social-icons for better control and tree-shaking.
 */

import type { SVGProps } from "react";

export const Instagram = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect
			width="24"
			height="24"
			rx="6"
			fill="url(#instagram-gradient)"
		/>
		<path
			d="M7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12Z"
			stroke="white"
			strokeWidth="1.5"
		/>
		<path
			d="M17.5 6.5L17.51 6.5"
			stroke="white"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
		<defs>
			<linearGradient
				id="instagram-gradient"
				x1="0"
				y1="0"
				x2="24"
				y2="24"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#E1306C" />
				<stop offset="0.5" stopColor="#FD1D1D" />
				<stop offset="1" stopColor="#F56040" />
			</linearGradient>
		</defs>
	</svg>
);

export const Facebook = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#1877F2" />
		<path
			d="M16.5 12.5C16.5 10 15 9 13 9C11 9 10 10.5 10 12V16H8V9H10V10.5C10 10.5 10.5 9 12.5 9C15.5 9 16.5 11 16.5 12.5V16H14.5V12.5Z"
			fill="white"
		/>
	</svg>
);

export const LinkedIn = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#0077B5" />
		<path d="M8 10V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
		<path
			d="M8 8C8.82843 8 9.5 7.32843 9.5 6.5C9.5 5.67157 8.82843 5 8 5C7.17157 5 6.5 5.67157 6.5 6.5C6.5 7.32843 7.17157 8 8 8Z"
			fill="white"
		/>
		<path
			d="M16 16V13C16 11 15.5 10 14 10C12.5 10 12 11.5 12 12V16H10V10H12V11C12 11 12.5 10 14 10C16 10 17 11 17 13V16H16Z"
			fill="white"
		/>
	</svg>
);

export const TwitterX = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="black" />
		<path
			d="M17 7L10.5 13.5L13 17H11L8.5 13.5L5 17H4L11 9.5L8.5 6H11L13.5 9.5L17 6H17Z"
			fill="white"
		/>
	</svg>
);

export const TikTok = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="black" />
		<path
			d="M12 5V15C12 16.1 11.1 17 10 17C8.9 17 8 16.1 8 15C8 13.9 8.9 13 10 13C10.3 13 10.7 13.1 11 13.2V11.1C10.7 11 10.3 11 10 11C7.8 11 6 12.8 6 15C6 17.2 7.8 19 10 19C12.2 19 14 17.2 14 15V9H16V7H14V5H12Z"
			fill="white"
		/>
	</svg>
);

export const YouTube = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#FF0000" />
		<path
			d="M10 8.5L15.5 12L10 15.5V8.5Z"
			fill="white"
			stroke="white"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Pinterest = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#E60023" />
		<circle
			cx="12"
			cy="12"
			r="5"
			stroke="white"
			strokeWidth="1.5"
		/>
		<path
			d="M12 7V13C12 14.5 11 15 10 15C9 15 8 14 8 13"
			stroke="white"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);

export const WhatsApp = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#25D366" />
		<path
			d="M8 10.5C8 9.67 8.3 9 9 9C9.7 9 10 9.67 10 10.5C10 11.33 9.7 12 9 12C8.3 12 8 11.33 8 10.5Z"
			fill="white"
		/>
		<path
			d="M12 7C8.13 7 5 9.93 5 13.5C5 15.93 6.47 18.07 8.55 19.37L7.2 21.5L9.45 20.17C10.2 20.47 11 20.67 11.83 20.77L11 18C13.76 17.83 16 15.83 16 13C16 10.17 14.67 7.83 12 7ZM12 9.5C10.62 9.5 9.5 10.47 9.5 11.67C9.5 12.87 10.62 13.83 12 13.83C13.38 13.83 14.5 12.87 14.5 11.67C14.5 10.47 13.38 9.5 12 9.5Z"
			fill="white"
		/>
	</svg>
);

export const Reddit = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#FF4500" />
		<path
			d="M15 9.5C15 10.87 13.87 12 12.5 12C11.13 12 10 10.87 10 9.5C10 8.13 11.13 7 12.5 7C13.87 7 15 8.13 15 9.5Z"
			fill="white"
		/>
		<path
			d="M17.5 8C18.33 8 19 7.33 19 6.5C19 5.67 18.33 5 17.5 5C16.67 5 16 5.67 16 6.5C16 7.33 16.67 8 17.5 8Z"
			fill="white"
		/>
		<path
			d="M9 9C9 8.17 8.33 7.5 7.5 7.5C6.67 7.5 6 8.17 6 9C6 9.83 6.67 10.5 7.5 10.5C8.33 10.5 9 9.83 9 9Z"
			fill="white"
		/>
		<path
			d="M12 6C9.5 6 7.5 7.5 7.5 9C7.5 10.5 9 11.5 12 12C15 11.5 16.5 10.5 16.5 9C16.5 7.5 14.5 6 12 6Z"
			fill="white"
		/>
		<path
			d="M20.5 13.5C20.5 15.71 18.71 17.5 16.5 17.5C16.28 17.5 16.08 17.47 15.88 17.43C15.31 17.95 14.56 18.3 13.73 18.42C14.35 17.91 14.77 17.15 14.94 16.28C15.11 15.41 15 14.51 14.63 13.73C15.15 13.54 15.73 13.5 16.3 13.5C17.42 13.5 18.42 13.92 19.17 14.59C19.92 14.17 20.5 13.5 20.5 13.5Z"
			fill="white"
		/>
		<path
			d="M5.5 13.5C5.5 14.88 4.38 16 3 16C3.74 15.23 4 14.43 4 13.5C4 12.57 3.74 11.77 3 11C4.38 11 5.5 12.12 5.5 13.5Z"
			fill="white"
		/>
	</svg>
);

export const Bluesky = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#0085FF" />
		<path
			d="M12 5C7.5 5 4 8.5 4 13C4 17.5 7.5 21 12 21C16.5 21 20 17.5 20 13C20 8.5 16.5 5 12 5Z"
			stroke="white"
			strokeWidth="1.5"
		/>
		<path
			d="M8 13C8 10.5 10 9 12 9C14 9 16 10.5 16 13"
			stroke="white"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
		<path
			d="M9 17L12 14L15 17"
			stroke="white"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Telegram = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#0088cc" />
		<path
			d="M8 12L16 8L12 17L10 13L8 12Z"
			fill="white"
		/>
		<path
			d="M6 6L18 12L12 18L10 14L6 18V6Z"
			stroke="white"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Snapchat = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#FFFC00" />
		<circle
			cx="9"
			cy="10"
			r="2"
			fill="black"
		/>
		<circle
			cx="15"
			cy="10"
			r="2"
			fill="black"
		/>
		<path
			d="M7 15C8 18 11 20 12 20C13 20 16 18 17 15"
			stroke="black"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);

export const Google = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="#4285F4" />
		<path
			d="M12 8C10.67 8 9.5 8.67 8.67 9.33L6.33 7.67C7.67 6.33 9.67 5.5 12 5.5C14.33 5.5 16.33 6.33 17.67 7.67L15.33 9.33C14.5 8.67 13.33 8 12 8Z"
			fill="white"
		/>
		<path
			d="M12 10C13.67 10 15.17 10.67 16.17 11.67L18.5 9.34C17 7.67 14.67 6.5 12 6.5C9.33 6.5 7 7.67 5.5 9.34L8.17 11.34C9.17 10.67 10.5 10 12 10Z"
			fill="white"
		/>
		<path
			d="M17.5 14C18.33 14 19 14.67 19 15.5C19 16.33 18.33 17 17.5 17"
			fill="#FBBC05"
		/>
	</svg>
);

export const Threads = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="24" height="24" rx="6" fill="black" />
		<path
			d="M14 8C14 8.55 13.55 9 13 9C12.45 9 12 8.55 12 8C12 7.45 12.45 7 13 7C13.55 7 14 7.45 14 8Z"
			fill="white"
		/>
		<path
			d="M12 10C9.79 10 8 11.79 8 14C8 14.59 8.13 15.15 8.35 15.66L7 20L10.5 18.5C11 18.7 11.5 18.83 12 18.83C14.21 18.83 16 17.04 16 14.83C16 14.28 15.83 13.76 15.55 13.3L17.5 10C17.89 10 18.26 10.08 18.58 10.22L16.55 14.16C17.13 15.64 16.89 17.35 15.83 18.5C16.92 18.3 17.93 17.75 18.71 16.92L18.5 17L19.29 16.13C20.93 14.17 21.14 11.29 19.82 9C18.5 6.71 15.88 5.5 13.08 5.67C11.71 5.75 10.43 6.21 9.42 7C8.41 7.79 7.71 8.87 7.43 10.08L6 9.08C6.41 7.42 7.39 5.93 8.74 4.83C10.09 3.73 11.78 3.17 13.5 3.17C16.4 3.17 19.04 4.67 20.5 7.08C21.22 8.3 21.64 9.67 21.73 11.08L22 13.08L18.73 13.42C18.59 13.08 18.39 12.76 18.13 12.5C17.84 12.21 17.48 11.98 17.08 11.83L18 10C17.91 10.33 17.77 10.64 17.58 10.92C16.92 11.92 15.73 12.5 14.38 12.5C13.5 12.5 12.73 12.17 12.17 11.63C11.63 11.07 11.33 10.33 11.33 9.5C11.33 9.11 11.41 8.73 11.55 8.39C11.71 8 11.94 7.67 12.22 7.39C12.5 7.11 12.83 6.89 13.2 6.73C13.57 6.57 13.96 6.5 14.38 6.5C15.19 6.5 15.92 6.78 16.5 7.28C17.08 7.78 17.41 8.47 17.41 9.33C17.41 10.19 17.08 10.89 16.5 11.39C15.92 11.89 15.19 12.17 14.38 12.17C13.96 12.17 13.57 12.11 13.2 11.97C12.83 11.81 12.5 11.59 12.22 11.31C11.94 11.03 11.71 10.7 11.55 10.36C11.41 10 11.33 9.61 11.33 9.17L11.33 8L12.33 8L12.33 9.17C12.33 9.97 12.61 10.67 13.11 11.22C13.61 11.77 14.31 12.08 15.08 12.08C15.85 12.08 16.55 11.77 17.05 11.22C17.55 10.67 17.83 9.97 17.83 9.17C17.83 8.37 17.55 7.67 17.05 7.12C16.55 6.57 15.85 6.25 15.08 6.25C14.31 6.25 13.61 6.57 13.11 7.12L13 7.08L14 5.67L14 8Z"
			fill="white"
		/>
	</svg>
);