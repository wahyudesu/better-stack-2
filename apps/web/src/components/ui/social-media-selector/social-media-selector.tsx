"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { AddButton } from "./add-button";
import { Dropdown } from "./dropdown";
import type { SocialMediaSelectorProps } from "./types";

const SocialMediaSelector = React.forwardRef<
	HTMLDivElement,
	SocialMediaSelectorProps
>(
	(
		{ profiles, selected, onChange, max, maxVisible = 5, label, className },
		ref,
	) => {
		const [isOpen, setIsOpen] = React.useState(false);
		const [searchQuery, setSearchQuery] = React.useState("");
		const containerRef = React.useRef<HTMLDivElement>(null);

		React.useEffect(() => {
			function handleClickOutside(event: MouseEvent) {
				if (
					containerRef.current &&
					!containerRef.current.contains(event.target as Node)
				) {
					setIsOpen(false);
					setSearchQuery("");
				}
			}

			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		const sortedProfiles = React.useMemo(() => {
			return [...profiles].sort((a, b) => {
				const aSelected = selected.includes(a.id);
				const bSelected = selected.includes(b.id);
				if (aSelected && !bSelected) return -1;
				if (!aSelected && bSelected) return 1;
				return 0;
			});
		}, [profiles, selected]);

		const visibleProfiles = sortedProfiles.slice(0, maxVisible);

		const toggleProfile = (id: string) => {
			const isCurrentlySelected = selected.includes(id);

			if (isCurrentlySelected) {
				onChange(selected.filter((s) => s !== id));
			} else {
				if (max && selected.length >= max) return;
				onChange([...selected, id]);
			}
		};

		return (
			<div ref={ref} className={cn("relative", className)}>
				{label && (
					<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
						{label}
					</div>
				)}
				<div ref={containerRef} className="flex items-start gap-4 flex-wrap">
					<LayoutGroup>
						{visibleProfiles.map((profile) => (
							<ProfileAvatar
								key={profile.id}
								profile={profile}
								isSelected={selected.includes(profile.id)}
								onClick={() => toggleProfile(profile.id)}
							/>
						))}

						<div className="relative">
							<AddButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

							<AnimatePresence>
								{isOpen && (
									<Dropdown
										profiles={profiles}
										selected={selected}
										onSelect={toggleProfile}
										searchQuery={searchQuery}
										onSearchChange={setSearchQuery}
									/>
								)}
							</AnimatePresence>
						</div>
					</LayoutGroup>
				</div>
			</div>
		);
	},
);

SocialMediaSelector.displayName = "SocialMediaSelector";

export { SocialMediaSelector };

// Inner component for avatar display
interface ProfileAvatarProps {
	profile: {
		id: string;
		name: string;
		username: string;
		avatarUrl?: string;
		platform: string;
	};
	isSelected: boolean;
	onClick: () => void;
}

function ProfileAvatar({ profile, isSelected, onClick }: ProfileAvatarProps) {
	const initials = profile.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<motion.button
			layoutId={`profile-${profile.id}`}
			onClick={onClick}
			className="group relative flex flex-col items-center gap-1.5 outline-none cursor-pointer"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
		>
			<div
				className={cn(
					"relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200",
					"group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
					!isSelected && "opacity-50 hover:opacity-75",
				)}
			>
				{profile.avatarUrl ? (
					<img
						src={profile.avatarUrl}
						alt={profile.name}
						className={cn(
							"w-full h-full object-cover transition-all duration-200",
							!isSelected && "grayscale",
						)}
					/>
				) : (
					<div
						className={cn(
							"w-full h-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
							isSelected
								? "bg-primary/10 text-primary"
								: "bg-muted text-muted-foreground",
						)}
					>
						{initials}
					</div>
				)}
			</div>

			<AnimatePresence>
				{!isSelected && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ type: "spring", stiffness: 500, damping: 30 }}
						className="absolute bottom-5 right-0 w-4 h-4 rounded-full bg-foreground dark:bg-white flex items-center justify-center shadow-sm"
					>
						<Plus
							className="w-2.5 h-2.5 text-background dark:text-black"
							strokeWidth={2.5}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.span
				layoutId={`profile-name-${profile.id}`}
				className={cn(
					"text-xs font-medium truncate max-w-[60px] transition-colors duration-200",
					isSelected ? "text-foreground" : "text-muted-foreground",
				)}
			>
				{profile.name.split(" ")[0]}
			</motion.span>
		</motion.button>
	);
}
