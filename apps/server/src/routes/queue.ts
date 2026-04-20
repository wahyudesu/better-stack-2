/**
 * Queue routes
 * Manage scheduling queue with time slots
 */
export function createQueueRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List queue slots
     */
    listSlots: (profileId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/queue/slots', { query: { profileId, ...params } })
    },

    /**
     * Get a queue slot
     */
    getSlot: (slotId: string) => {
      return fetch<any>(`/v1/queue/slots/${slotId}`)
    },

    /**
     * Create a queue slot
     */
    createSlot: (data: { profileId: string; dayOfWeek?: number; time?: string; repeatEnabled?: boolean }) => {
      return fetch<any>('/v1/queue/slots', { method: 'POST', body: data })
    },

    /**
     * Update a queue slot
     */
    updateSlot: (slotId: string, data: { dayOfWeek?: number; time?: string; repeatEnabled?: boolean }) => {
      return fetch<any>(`/v1/queue/slots/${slotId}`, { method: 'PATCH', body: data })
    },

    /**
     * Delete a queue slot
     */
    deleteSlot: (slotId: string) => {
      return fetch<any>(`/v1/queue/slots/${slotId}`, { method: 'DELETE' })
    },

    /**
     * Preview queue
     */
    preview: (profileId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/queue/preview', { query: { profileId, ...params } })
    },

    /**
     * Get next available slot
     */
    nextSlot: (profileId: string) => {
      return fetch<any>('/v1/queue/next-slot', { query: { profileId } })
    },
  }
}

export type QueueRoutes = ReturnType<typeof createQueueRoutes>