import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PostMedia, ProfilePlatform } from "@/lib/types/social";

type PublishMode = "now" | "schedule" | "queue" | "draft";

interface DraftState {
	content: string;
	media: PostMedia[];
	selectedAccountIds: string[];
	publishMode: PublishMode;
	scheduledDate: string;
	scheduledTime: string;
	timezone: string;
	showPreview: boolean;
	activePlatform: ProfilePlatform;
	maxChars: number;
	lastSavedAt: string | null;
	setContent: (content: string) => void;
	setMedia: (media: PostMedia[]) => void;
	setSelectedAccountIds: (ids: string[]) => void;
	setPublishMode: (mode: PublishMode) => void;
	setScheduledDate: (date: string) => void;
	setScheduledTime: (time: string) => void;
	setTimezone: (tz: string) => void;
	setShowPreview: (show: boolean) => void;
	setActivePlatform: (platform: ProfilePlatform) => void;
	setMaxChars: (chars: number) => void;
	clearDraft: () => void;
}

const initialState = {
	content: "",
	media: [] as PostMedia[],
	selectedAccountIds: [] as string[],
	publishMode: "now" as PublishMode,
	scheduledDate: "",
	scheduledTime: "",
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	showPreview: false,
	activePlatform: "instagram" as ProfilePlatform,
	maxChars: 2200,
	lastSavedAt: null,
};

export const useDraftStore = create<DraftState>()(
	persist(
		(set) => ({
			...initialState,
			setContent: (content) =>
				set({ content, lastSavedAt: new Date().toISOString() }),
			setMedia: (media) =>
				set({ media, lastSavedAt: new Date().toISOString() }),
			setSelectedAccountIds: (selectedAccountIds) =>
				set({ selectedAccountIds, lastSavedAt: new Date().toISOString() }),
			setPublishMode: (publishMode) => set({ publishMode }),
			setScheduledDate: (scheduledDate) => set({ scheduledDate }),
			setScheduledTime: (scheduledTime) => set({ scheduledTime }),
			setTimezone: (timezone) => set({ timezone }),
			setShowPreview: (showPreview) => set({ showPreview }),
			setActivePlatform: (activePlatform) => set({ activePlatform }),
			setMaxChars: (maxChars) => set({ maxChars }),
			clearDraft: () =>
				set({ ...initialState, lastSavedAt: new Date().toISOString() }),
		}),
		{
			name: "betterstack-draft",
			partialize: (state) => ({
				content: state.content,
				media: state.media,
				selectedAccountIds: state.selectedAccountIds,
				publishMode: state.publishMode,
				scheduledDate: state.scheduledDate,
				scheduledTime: state.scheduledTime,
				timezone: state.timezone,
				showPreview: state.showPreview,
				activePlatform: state.activePlatform,
				maxChars: state.maxChars,
				lastSavedAt: state.lastSavedAt,
			}),
		},
	),
);
