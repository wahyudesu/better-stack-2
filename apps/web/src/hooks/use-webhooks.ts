import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/client";

export const webhookKeys = {
	all: ["webhooks"] as const,
	settings: ["webhooks", "settings"] as const,
	logs: (webhookId?: string) => ["webhooks", "logs", webhookId] as const,
};

export interface WebhookSetting {
	_id: string;
	name: string;
	url: string;
	events: string[];
	isActive: boolean;
	secret?: string;
	customHeaders?: Record<string, string>;
	createdAt: string;
	updatedAt: string;
}

export interface WebhookLog {
	_id: string;
	webhookId: string;
	event: string;
	status: "success" | "failed";
	statusCode: number;
	requestBody: string;
	responseBody?: string;
	errorMessage?: string;
	createdAt: string;
}

export interface CreateWebhookInput {
	name: string;
	url: string;
	events: string[];
	secret?: string;
	customHeaders?: Record<string, string>;
}

export interface UpdateWebhookInput {
	name?: string;
	url?: string;
	events?: string[];
	isActive?: boolean;
	customHeaders?: Record<string, string>;
}

/**
 * Hook to fetch webhook settings
 */
export function useWebhookSettings() {
	return useQuery({
		queryKey: webhookKeys.settings,
		queryFn: async () => {
			const { data, error } = await api.getWebhookSettings();
			if (error) throw error;
			return data;
		},
		enabled: true,
	});
}

/**
 * Hook to fetch webhook logs
 */
export function useWebhookLogs(params?: {
	webhookId?: string;
	event?: string;
	status?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: webhookKeys.logs(params?.webhookId),
		queryFn: async () => {
			const { data, error } = await api.getWebhookLogs(params);
			if (error) throw error;
			return data;
		},
		enabled: true,
	});
}

/**
 * Hook to create a webhook
 */
export function useCreateWebhook() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateWebhookInput) => {
			const { data, error } = await api.createWebhook(input);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: webhookKeys.all });
		},
	});
}

/**
 * Hook to update a webhook
 */
export function useUpdateWebhook() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			webhookId,
			...input
		}: UpdateWebhookInput & { webhookId: string }) => {
			const { data, error } = await api.updateWebhook(webhookId, input);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: webhookKeys.all });
		},
	});
}

/**
 * Hook to delete a webhook
 */
export function useDeleteWebhook() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (webhookId: string) => {
			const { error } = await api.deleteWebhook(webhookId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: webhookKeys.all });
		},
	});
}

/**
 * Hook to test a webhook
 */
export function useTestWebhook() {
	return useMutation({
		mutationFn: async (webhookId: string) => {
			const { data, error } = await api.testWebhook(webhookId);
			if (error) throw error;
			return data;
		},
	});
}
