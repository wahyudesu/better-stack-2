import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";

// Tools keys
export const toolsKeys = {
	all: ["tools"] as const,
	youtubeFormats: (url: string) =>
		["tools", "youtube", "formats", url] as const,
	youtubeTranscript: (url: string) =>
		["tools", "youtube", "transcript", url] as const,
	instagramHashtags: (hashtags: string[]) =>
		["tools", "instagram", "hashtags", hashtags] as const,
};

/**
 * Hook to get YouTube download formats
 */
export function useYouTubeFormats(url: string) {
	return useQuery({
		queryKey: toolsKeys.youtubeFormats(url),
		queryFn: async () => {
			const { data, error } = await api.youtubeDownload({
				url,
				action: "formats",
			});
			if (error) throw error;
			return data;
		},
		enabled: !!url,
	});
}

/**
 * Hook to get YouTube transcript
 */
export function useYouTubeTranscript(url: string, lang?: string) {
	return useQuery({
		queryKey: toolsKeys.youtubeTranscript(url),
		queryFn: async () => {
			const { data, error } = await api.youtubeTranscript({ url, lang });
			if (error) throw error;
			return data;
		},
		enabled: !!url,
	});
}

/**
 * Hook to download YouTube video
 */
export function useYouTubeDownload() {
	return useMutation({
		mutationFn: async ({
			url,
			format,
			quality,
		}: {
			url: string;
			format?: "video" | "audio";
			quality?: "hd" | "sd";
		}) => {
			const { data, error } = await api.youtubeDownload({
				url,
				action: "download",
				format,
				quality,
			});
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to download Instagram media
 */
export function useInstagramDownload() {
	return useMutation({
		mutationFn: async ({ url }: { url: string }) => {
			const { data, error } = await api.instagramDownload({ url });
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to check Instagram hashtag availability
 */
export function useInstagramHashtagChecker() {
	return useMutation({
		mutationFn: async (hashtags: string[]) => {
			const { data, error } = await api.instagramHashtagChecker(hashtags);
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to download TikTok video
 */
export function useTikTokDownload() {
	return useMutation({
		mutationFn: async ({
			url,
			formatId,
		}: {
			url: string;
			formatId?: string;
		}) => {
			const { data, error } = await api.tiktokDownload({
				url,
				action: "download",
				formatId,
			});
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to download Twitter/X media
 */
export function useTwitterDownload() {
	return useMutation({
		mutationFn: async ({
			url,
			formatId,
		}: {
			url: string;
			formatId?: string;
		}) => {
			const { data, error } = await api.twitterDownload({
				url,
				action: "download",
				formatId,
			});
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to download Facebook video
 */
export function useFacebookDownload() {
	return useMutation({
		mutationFn: async ({ url }: { url: string }) => {
			const { data, error } = await api.facebookDownload({ url });
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to download LinkedIn video
 */
export function useLinkedInDownload() {
	return useMutation({
		mutationFn: async ({ url }: { url: string }) => {
			const { data, error } = await api.linkedinDownload({ url });
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to download Bluesky media
 */
export function useBlueskyDownload() {
	return useMutation({
		mutationFn: async ({ url }: { url: string }) => {
			const { data, error } = await api.blueskyDownload({ url });
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to validate post length
 */
export function useValidatePostLength() {
	return useMutation({
		mutationFn: async (text: string) => {
			const { data, error } = await api.validatePostLength(text);
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to validate post content per platform
 */
export function useValidatePost() {
	return useMutation({
		mutationFn: async (data: {
			content?: string;
			platforms: Array<{ platform: string; customContent?: string }>;
		}) => {
			const { data: result, error } = await api.validatePost(data);
			if (error) throw error;
			return result;
		},
	});
}

/**
 * Hook to validate media URL
 */
export function useValidateMedia() {
	return useMutation({
		mutationFn: async (data: { url: string; type?: string }) => {
			const { data: result, error } = await api.validateMedia(data);
			if (error) throw error;
			return result;
		},
	});
}

/**
 * Hook to validate subreddit existence
 */
export function useValidateSubreddit() {
	return useMutation({
		mutationFn: async (data: { subreddit: string }) => {
			const { data: result, error } = await api.validateSubreddit(data);
			if (error) throw error;
			return result;
		},
	});
}
