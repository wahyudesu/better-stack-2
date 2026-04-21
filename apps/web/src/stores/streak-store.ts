import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StreakState {
	currentStreak: number;
	longestStreak: number;
	totalPosts: number;
	lastPostDate: string | null; // ISO date string (YYYY-MM-DD)
	streakStartDate: string | null; // ISO date string when streak began
	incrementStreak: () => void;
	resetStreak: () => void;
	getStreakMessage: () => string;
}

const getDateString = () => new Date().toISOString().split("T")[0];

export const useStreakStore = create<StreakState>()(
	persist(
		(set, get) => ({
			currentStreak: 0,
			longestStreak: 0,
			totalPosts: 0,
			lastPostDate: null,
			streakStartDate: null,
			incrementStreak: () => {
				const today = getDateString();
				const { lastPostDate, currentStreak, longestStreak } = get();

				// Already posted today
				if (lastPostDate === today) return;

				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);
				const yesterdayStr = yesterday.toISOString().split("T")[0];

				let newStreak = 1;
				let newStreakStart = today;

				// Continuing streak if posted yesterday
				if (lastPostDate === yesterdayStr) {
					newStreak = currentStreak + 1;
					newStreakStart = get().streakStartDate || today;
				}

				const newLongest = Math.max(longestStreak, newStreak);

				set({
					currentStreak: newStreak,
					longestStreak: newLongest,
					totalPosts: get().totalPosts + 1,
					lastPostDate: today,
					streakStartDate: newStreakStart,
				});
			},
			resetStreak: () =>
				set({
					currentStreak: 0,
					streakStartDate: null,
				}),
			getStreakMessage: () => {
				const { currentStreak, longestStreak } = get();
				if (currentStreak === 0) return "Start your streak today!";
				if (currentStreak >= longestStreak && currentStreak > 7)
					return "You're on fire! 🔥";
				if (currentStreak >= longestStreak) return "New personal best!";
				return `${currentStreak} day streak`;
			},
		}),
		{
			name: "betterstack-streak",
		},
	),
);
