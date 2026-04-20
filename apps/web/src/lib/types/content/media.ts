/**
 * Post media types.
 */

export type MediaType = "image" | "video" | "audio" | "document";

export interface PostMedia {
	id?: string;
	url: string;
	type: MediaType;
	/** Alt text for accessibility */
	alt?: string;
	/** Thumbnail URL (for videos/audio) */
	thumbnailUrl?: string;
	/** File size in bytes */
	fileSize?: number;
	/** MIME type */
	mimeType?: string;
	/** Width (for images/videos) */
	width?: number;
	/** Height (for images/videos) */
	height?: number;
	/** Duration in seconds (for audio/video) */
	duration?: number;
	/** Order in carousel */
	order?: number;
}

/**
 * Check if media is a video.
 */
export function isVideo(media: PostMedia): boolean {
	return media.type === "video";
}

/**
 * Check if media is an image.
 */
export function isImage(media: PostMedia): boolean {
	return media.type === "image";
}

/**
 * Check if media is audio.
 */
export function isAudio(media: PostMedia): boolean {
	return media.type === "audio";
}
