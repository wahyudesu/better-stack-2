/**
 * Queue routes
 * Manage scheduling queue with time slots
 */
export function createQueueRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List queue schedules
     */
    listSlots: (params: { profileId?: string; queueId?: string; all?: string }) => {
      return fetch<any>('/v1/queue/slots', { query: params })
    },

    /**
     * Get a queue slot
     */
    getSlot: (slotId: string) => {
      return fetch<any>(`/v1/queue/slots/${slotId}`)
    },

    /**
     * Create or update a queue schedule (uses PUT as per API spec)
     */
    createSlot: (data: {
      profileId: string
      name: string
      timezone: string
      slots: Array<{ dayOfWeek: number; time: string }>
      active?: boolean
      queueId?: string
      setAsDefault?: boolean
      reshuffleExisting?: boolean
    }) => {
      return fetch<any>('/v1/queue/slots', { method: 'PUT', body: data })
    },

    /**
     * Update a queue schedule
     */
    updateSlot: (data: {
      profileId: string
      name?: string
      timezone?: string
      slots?: Array<{ dayOfWeek: number; time: string }>
      active?: boolean
      queueId?: string
      setAsDefault?: boolean
      reshuffleExisting?: boolean
    }) => {
      return fetch<any>('/v1/queue/slots', { method: 'PUT', body: data })
    },

    /**
     * Delete a queue
     */
    deleteSlot: (params: { profileId?: string; queueId?: string }) => {
      return fetch<any>('/v1/queue/slots', { method: 'DELETE', query: params })
    },

    /**
     * Preview upcoming slots
     */
    preview: (params: { profileId?: string; queueId?: string; count?: number }) => {
      return fetch<any>('/v1/queue/preview', { query: params })
    },

    /**
     * Get next available slot
     */
    nextSlot: (params: { profileId?: string; queueId?: string }) => {
      return fetch<any>('/v1/queue/next-slot', { query: params })
    },
  }
}

export type QueueRoutes = ReturnType<typeof createQueueRoutes>