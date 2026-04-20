/**
 * Media routes
 * Upload and manage media files
 */
export function createMediaRoutes(baseUrl: string, apiKey: string) {
  return {
    /**
     * Get presigned URL for media upload
     */
    presign: (data: { filename: string; contentType: string }) => {
      return fetch('/v1/media/presign', { method: 'POST', body: JSON.stringify(data) })
    },

    /**
     * Upload media
     */
    upload: async (file: File | Blob, params?: { fileName?: string; mimeType?: string }) => {
      const formData = new FormData()
      formData.append('file', file, params?.fileName || 'upload')

      const response = await fetch(`${baseUrl}/v1/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }))
        const errorMessage = (error && typeof error === 'object' && 'error' in error)
          ? error.error
          : (error && typeof error === 'object' && 'message' in error)
            ? error.message
            : 'Upload failed'
        throw new Error(String(errorMessage))
      }

      return response.json()
    },

    /**
     * Get media by ID
     */
    get: async (mediaId: string) => {
      const response = await fetch(`${baseUrl}/v1/media/${mediaId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }))
        const errorMessage = (error && typeof error === 'object' && 'error' in error)
          ? error.error
          : (error && typeof error === 'object' && 'message' in error)
            ? error.message
            : 'Failed to fetch media'
        throw new Error(String(errorMessage))
      }

      return response.json()
    },

    /**
     * Upload media directly to an account (for inbox attachments)
     */
    uploadDirect: async (accountId: string, file: File | Blob, params?: { fileName?: string; mimeType?: string }) => {
      const formData = new FormData()
      formData.append('file', file, params?.fileName || 'upload')
      formData.append('accountId', accountId)

      const response = await fetch(`${baseUrl}/v1/media/upload-direct`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }))
        const errorMessage = (error && typeof error === 'object' && 'error' in error)
          ? error.error
          : (error && typeof error === 'object' && 'message' in error)
            ? error.message
            : 'Upload failed'
        throw new Error(String(errorMessage))
      }

      return response.json()
    },
  }
}

export type MediaRoutes = ReturnType<typeof createMediaRoutes>