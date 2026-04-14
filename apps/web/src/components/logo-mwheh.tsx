export function LogoZenpost({ className = "" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 100 100"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Background blob */}
			<path
				d="M50 10C30 10 15 25 15 50C15 75 30 90 50 90C70 90 85 75 85 50C85 25 70 10 50 10Z"
				fill="url(#gradient1)"
			/>
			{/* "z" letter - stylized */}
			<path
				d="M25 35H75L25 65H75"
				stroke="white"
				strokeWidth="6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* "p" letter - stylized */}
			<path
				d="M60 35V65M60 35C72 35 80 42 80 52C80 62 72 70 60 70"
				stroke="white"
				strokeWidth="6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* Gradient definition */}
			<defs>
				<linearGradient
					id="gradient1"
					x1="15"
					y1="10"
					x2="85"
					y2="90"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#8B5CF6" />
					<stop offset="100%" stopColor="#EC4899" />
				</linearGradient>
			</defs>
		</svg>
	);
}

// Compact version for small sizes
export function LogoZenpostCompact({ className = "" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 40 40"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="40" height="40" rx="10" fill="url(#grad2)" />
			{/* Z */}
			<path
				d="M10 14H30L10 26H30"
				stroke="white"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* P */}
			<path
				d="M25 14V26M25 14C30 14 33 18 33 21C33 24 30 26 25 26"
				stroke="white"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<defs>
				<linearGradient
					id="grad2"
					x1="0"
					y1="0"
					x2="40"
					y2="40"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#8B5CF6" />
					<stop offset="100%" stopColor="#EC4899" />
				</linearGradient>
			</defs>
		</svg>
	);
}
