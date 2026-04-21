import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";

export type PlanTier = "free" | "starter" | "pro" | "enterprise";

export interface PlanInfo {
	tier: PlanTier;
	hasInboxAddon: boolean;
	inboxStatus: "available" | "blocked" | "unknown";
	blockedReason?: string;
	usage: {
		uploads: number;
		profiles: number;
	};
	limits: {
		uploads: number;
		profiles: number;
	};
	planName: string;
}

const INBOX_ADDON_PLANS = [
	"starter",
	"pro",
	"professional",
	"business",
	"enterprise",
];

function parsePlanTier(planName: string): PlanTier {
	const lower = planName.toLowerCase();
	if (lower.includes("enterprise")) return "enterprise";
	if (lower.includes("pro") || lower.includes("professional")) return "pro";
	if (lower.includes("starter")) return "starter";
	return "free";
}

export function usePlanGate() {
	return useQuery({
		queryKey: ["plan-gate"],
		queryFn: async (): Promise<PlanInfo> => {
			const { data, error } = await api.getUsageStats();

			if (error || !data) {
				return {
					tier: "free",
					hasInboxAddon: false,
					inboxStatus: "unknown",
					usage: { uploads: 0, profiles: 0 },
					limits: { uploads: 0, profiles: 0 },
					planName: "Unknown",
				};
			}

			const tier = parsePlanTier(data.planName);
			const hasInboxAddon = INBOX_ADDON_PLANS.some((p) =>
				data.planName.toLowerCase().includes(p),
			);

			return {
				tier,
				hasInboxAddon,
				inboxStatus: hasInboxAddon ? "available" : "blocked",
				blockedReason: hasInboxAddon
					? undefined
					: "Inbox requires Starter plan or higher",
				usage: data.usage,
				limits: data.limits,
				planName: data.planName,
			};
		},
		staleTime: 5 * 60 * 1000,
		enabled: true,
	});
}

export function useInboxAccess() {
	const { data: plan, isLoading } = usePlanGate();

	const canAccess =
		plan?.inboxStatus === "available" || plan?.inboxStatus === "unknown";

	return {
		canAccess,
		isLoading,
		plan,
	};
}
