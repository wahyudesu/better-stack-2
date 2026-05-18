import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
	timezone: string;
	firstDayOfWeek: "sunday" | "monday";
	timeFormat: "12h" | "24h";
	defaultProfileId: string | null;
	sidebarOpen: boolean;
	currentOrgId: string | null;
	setTimezone: (timezone: string) => void;
	setFirstDayOfWeek: (day: "sunday" | "monday") => void;
	setTimeFormat: (format: "12h" | "24h") => void;
	setDefaultProfileId: (profileId: string | null) => void;
	setSidebarOpen: (open: boolean) => void;
	toggleSidebar: () => void;
	setCurrentOrgId: (orgId: string | null) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			firstDayOfWeek: "monday",
			timeFormat: "24h",
			defaultProfileId: null,
			sidebarOpen: true,
			currentOrgId: null,
			setTimezone: (timezone) => set({ timezone }),
			setFirstDayOfWeek: (firstDayOfWeek) => set({ firstDayOfWeek }),
			setTimeFormat: (timeFormat) => set({ timeFormat }),
			setDefaultProfileId: (profileId) => set({ defaultProfileId: profileId }),
			setSidebarOpen: (open) => set({ sidebarOpen: open }),
			toggleSidebar: () =>
				set((state) => ({ sidebarOpen: !state.sidebarOpen })),
			setCurrentOrgId: (orgId) => set({ currentOrgId: orgId }),
		}),
		{
			name: "betterstack-app",
			partialize: (state) => ({
				timezone: state.timezone,
				firstDayOfWeek: state.firstDayOfWeek,
				timeFormat: state.timeFormat,
				defaultProfileId: state.defaultProfileId,
				currentOrgId: state.currentOrgId,
			}),
		},
	),
);
