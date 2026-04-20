/**
 * Sequences routes
 * Automated sequence/automation campaigns
 */
export function createSequencesRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List sequences
     */
    list: (params?: { page?: number; limit?: number; status?: string }) => {
      return fetch<any>('/v1/sequences', { query: params })
    },

    /**
     * Create a sequence
     */
    create: (data: { name: string; steps: Array<{ delay?: number; action?: string; templateId?: string }> }) => {
      return fetch<any>('/v1/sequences', { method: 'POST', body: data })
    },

    /**
     * Get a sequence
     */
    get: (sequenceId: string) => {
      return fetch<any>(`/v1/sequences/${sequenceId}`)
    },

    /**
     * Update a sequence
     */
    update: (sequenceId: string, data: { name?: string; steps?: Array<{ delay?: number; action?: string; templateId?: string }> }) => {
      return fetch<any>(`/v1/sequences/${sequenceId}`, { method: 'PATCH', body: data })
    },

    /**
     * Delete a sequence
     */
    delete: (sequenceId: string) => {
      return fetch<any>(`/v1/sequences/${sequenceId}`, { method: 'DELETE' })
    },

    /**
     * Activate a sequence
     */
    activate: (sequenceId: string) => {
      return fetch<any>(`/v1/sequences/${sequenceId}/activate`, { method: 'POST' })
    },

    /**
     * Pause a sequence
     */
    pause: (sequenceId: string) => {
      return fetch<any>(`/v1/sequences/${sequenceId}/pause`, { method: 'POST' })
    },

    /**
     * Enroll contacts in a sequence
     */
    enroll: (sequenceId: string, data: { contactIds?: string[]; tag?: string }) => {
      return fetch<any>(`/v1/sequences/${sequenceId}/enroll`, { method: 'POST', body: data })
    },

    /**
     * Unenroll a contact from a sequence
     */
    unenroll: (sequenceId: string, contactId: string) => {
      return fetch<any>(`/v1/sequences/${sequenceId}/enroll/${contactId}`, { method: 'DELETE' })
    },

    /**
     * List enrollments in a sequence
     */
    listEnrollments: (sequenceId: string, params?: { page?: number; limit?: number; status?: string }) => {
      return fetch<any>(`/v1/sequences/${sequenceId}/enrollments`, { query: params })
    },
  }
}

export type SequencesRoutes = ReturnType<typeof createSequencesRoutes>