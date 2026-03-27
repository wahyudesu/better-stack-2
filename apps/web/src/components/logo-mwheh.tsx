export function LogoMwheh({ className = "" }: { className?: string }) {
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
			{/* "m" letter - stylized */}
			<path
				d="M28 35V65M28 35L40 50L52 35M52 35V65"
				stroke="white"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* "w" letter - stylized */}
			<path
				d="M58 35L66 50L74 35M74 35L82 50L90 35"
				stroke="white"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* "h" letter - small, playful */}
			<path
				d="M95 55V65M95 55C95 55 98 52 100 52"
				stroke="white"
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* Eyes for personality */}
			<circle cx="35" cy="42" r="3" fill="white" />
			<circle cx="45" cy="42" r="3" fill="white" />
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
export function LogoMwhehCompact({ className = "" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 40 40"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="40" height="40" rx="10" fill="url(#grad2)" />
			{/* M */}
			<path
				d="M10 14V26M10 14L16 20L22 14M22 14V26"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* W */}
			<path
				d="M25 14L29 20L33 14"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* Eyes */}
			<circle cx="13" cy="17" r="1.5" fill="white" />
			<circle cx="19" cy="17" r="1.5" fill="white" />
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
