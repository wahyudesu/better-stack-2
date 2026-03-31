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
