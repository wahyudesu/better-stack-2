import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { useAuthStore } from "@/stores";

export const mediaKeys = {
	all: ["media"] as const,
	detail: (mediaId: string) => ["media", "detail", mediaId] as const,
};

/**
 * Hook to get media by ID
 */
export function useMedia(mediaId: string) {
	return useQuery({
		queryKey: mediaKeys.detail(mediaId),
		queryFn: async () => {
			const { data, error } = await api.getMedia(mediaId);
			if (error) throw error;
			return data;
		},
		enabled: !!mediaId,
	});
}

/**
 * Hook to upload media with presigned URL
 */
export function useMediaUpload() {
	return useMutation({
		mutationFn: async ({
			file,
			filename,
			mimeType,
		}: {
			file: File | Blob;
			filename?: string;
			mimeType?: string;
		}) => {
			// Get presigned URL
			const { data: presignedData, error: presignError } =
				await api.getPresignedUrl({
					filename: filename || ("name" in file ? file.name : "upload"),
					contentType:
						mimeType || (file as File).type || "application/octet-stream",
				});

			if (presignError) throw new Error(presignError);
			if (!presignedData?.uploadUrl)
				throw new Error("Failed to get upload URL");

			// Upload to presigned URL
			const uploadResponse = await fetch(presignedData.uploadUrl, {
				method: "PUT",
				body: file,
				headers: {
					"Content-Type":
						mimeType || (file as File).type || "application/octet-stream",
				},
			});

			if (!uploadResponse.ok) {
				throw new Error("Upload failed");
			}

			return {
				url: presignedData.fileUrl,
				mediaId: presignedData.fileUrl.split("/").pop(),
			};
		},
	});
}

/**
 * Hook to upload media directly (simpler version)
 */
export function useMediaUploadDirect() {
	return useMutation({
		mutationFn: async ({
			accountId,
			file,
			filename,
			mimeType,
		}: {
			accountId: string;
			file: File | Blob;
			filename?: string;
			mimeType?: string;
		}) => {
			const formData = new FormData();
			formData.append("file", file, filename || "upload");
			formData.append("accountId", accountId);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/v1/media/upload-direct`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${useAuthStore.getState().clerkToken}`,
					},
					body: formData,
				},
			);

			if (!response.ok) {
				const err = (await response
					.json()
					.catch(() => ({ error: response.statusText }))) as { error?: string };
				throw new Error(err.error || "Upload failed");
			}

			return response.json();
		},
	});
}
