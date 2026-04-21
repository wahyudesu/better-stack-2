/**
 * WhatsApp routes
 * WhatsApp Business API for messages, templates, groups, phone numbers
 */
export function createWhatsAppRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List WhatsApp templates
     */
    listTemplates: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/whatsapp/templates`, { query: { accountId, ...params } })
    },

    /**
     * Get WhatsApp template
     */
    getTemplate: (accountId: string, templateName: string) => {
      return fetch<any>(`/v1/whatsapp/templates/${templateName}`, { query: { accountId } })
    },

    /**
     * Update WhatsApp template
     */
    updateTemplate: (accountId: string, templateName: string, data: any) => {
      return fetch<any>(`/v1/whatsapp/templates/${templateName}`, { method: 'PUT', body: { accountId, ...data } })
    },

    /**
     * Delete WhatsApp template
     */
    deleteTemplate: (accountId: string, templateName: string) => {
      return fetch<any>(`/v1/whatsapp/templates/${templateName}`, { method: 'DELETE', body: { accountId } })
    },

    /**
     * Get WhatsApp Business profile
     */
    getBusinessProfile: (accountId: string) => {
      return fetch<any>('/v1/whatsapp/business-profile', { query: { accountId } })
    },

    /**
     * Update WhatsApp Business profile
     */
    updateBusinessProfile: (accountId: string, data: { about?: string; vertical?: string; address?: string }) => {
      return fetch<any>('/v1/whatsapp/business-profile', { method: 'PUT', body: { accountId, ...data } })
    },

    /**
     * Upload WhatsApp Business profile photo
     */
    uploadBusinessProfilePhoto: (accountId: string, mediaUrl: string) => {
      return fetch<any>('/v1/whatsapp/business-profile/photo', { method: 'POST', body: { accountId, mediaUrl } })
    },

    /**
     * Get WhatsApp display name status
     */
    getDisplayNameStatus: (accountId: string) => {
      return fetch<any>('/v1/whatsapp/business-profile/display-name', { query: { accountId } })
    },

    /**
     * Request WhatsApp display name change
     */
    updateDisplayName: (accountId: string, data: { displayName: string;about?: string }) => {
      return fetch<any>('/v1/whatsapp/business-profile/display-name', { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * List WhatsApp phone numbers
     */
    listPhoneNumbers: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/whatsapp/phone-numbers', { query: { accountId, ...params } })
    },

    /**
     * Get WhatsApp phone number
     */
    getPhoneNumber: (accountId: string, phoneNumberId: string) => {
      return fetch<any>(`/v1/whatsapp/phone-numbers/${phoneNumberId}`, { query: { accountId } })
    },

    /**
     * Purchase WhatsApp phone number
     */
    purchasePhoneNumber: (accountId: string, data: { number?: string; category?: string }) => {
      return fetch<any>('/v1/whatsapp/phone-numbers/purchase', { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Release WhatsApp phone number
     */
    releasePhoneNumber: (accountId: string, phoneNumberId: string) => {
      return fetch<any>(`/v1/whatsapp/phone-numbers/${phoneNumberId}`, { method: 'DELETE', body: { accountId } })
    },

    /**
     * List WhatsApp groups
     */
    listGroups: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/whatsapp/wa-groups', { query: { accountId, ...params } })
    },

    /**
     * Get WhatsApp group
     */
    getGroup: (accountId: string, groupId: string) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}`, { query: { accountId } })
    },

    /**
     * Create WhatsApp group
     */
    createGroup: (accountId: string, data: { name: string; participants?: string[] }) => {
      return fetch<any>('/v1/whatsapp/wa-groups', { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Update WhatsApp group
     */
    updateGroup: (accountId: string, groupId: string, data: { name?: string }) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}`, { method: 'PUT', body: { accountId, ...data } })
    },

    /**
     * Delete WhatsApp group
     */
    deleteGroup: (accountId: string, groupId: string) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}`, { method: 'DELETE', body: { accountId } })
    },

    /**
     * Add participants to WhatsApp group
     */
    addParticipants: (accountId: string, groupId: string, data: { participants: string[] }) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}/participants`, { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Remove participants from WhatsApp group
     */
    removeParticipants: (accountId: string, groupId: string, data: { participants: string[] }) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}/participants`, { method: 'DELETE', body: { accountId, ...data } })
    },

    /**
     * Create WhatsApp group invite link
     */
    createInviteLink: (accountId: string, groupId: string) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}/invite-link`, { method: 'POST', body: { accountId } })
    },

    /**
     * List WhatsApp group join requests
     */
    listJoinRequests: (accountId: string, groupId: string) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}/join-requests`, { query: { accountId } })
    },

    /**
     * Approve WhatsApp group join requests
     */
    approveJoinRequests: (accountId: string, groupId: string, data: { requests: string[] }) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}/join-requests/approve`, { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Reject WhatsApp group join requests
     */
    rejectJoinRequests: (accountId: string, groupId: string, data: { requests: string[] }) => {
      return fetch<any>(`/v1/whatsapp/wa-groups/${groupId}/join-requests/reject`, { method: 'POST', body: { accountId, ...data } })
    },
  }
}

export type WhatsAppRoutes = ReturnType<typeof createWhatsAppRoutes>