"use client";

import type { Ad, AdCampaign, AdAudience, AdAccount, AdMetrics } from "@/lib/types/ads";

// Re-export types for convenience
export type { Ad, AdCampaign, AdAudience, AdAccount, AdMetrics };

// ============================================================
// Mock mode check
// ============================================================

function shouldUseMock(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_ADS !== "false" && true; // default true for now
}

// ============================================================
// API functions (mock for now, real integration later)
// ============================================================

export async function getAdAccounts(): Promise<AdAccount[]> {
  if (shouldUseMock()) {
    const { mockAdAccounts } = await import("@/data/ads-mock");
    return mockAdAccounts;
  }
  const res = await fetch(`/api/v1/ads/accounts`);
  const data = await res.json();
  return data?.accounts ?? [];
}

export async function getCampaigns(params?: {
  platform?: string;
  status?: string;
  accountId?: string;
  limit?: number;
}): Promise<AdCampaign[]> {
  if (shouldUseMock()) {
    const { mockAdCampaigns } = await import("@/data/ads-mock");
    let results = [...mockAdCampaigns];
    if (params?.platform) {
      results = results.filter((c) => c.platform === params.platform);
    }
    if (params?.status) {
      results = results.filter((c) => c.status === params.status);
    }
    return results;
  }
  const searchParams = new URLSearchParams();
  if (params?.platform) searchParams.set("platform", params.platform);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.accountId) searchParams.set("accountId", params.accountId);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const res = await fetch(`/api/v1/ads/campaigns?${searchParams}`);
  const data = await res.json();
  return data?.campaigns ?? [];
}

export async function getAds(params?: {
  platform?: string;
  status?: string;
  accountId?: string;
  campaignId?: string;
  limit?: number;
}): Promise<Ad[]> {
  if (shouldUseMock()) {
    const { mockAds } = await import("@/data/ads-mock");
    let results = [...mockAds];
    if (params?.platform) {
      results = results.filter((a) => a.platform === params.platform);
    }
    if (params?.status) {
      results = results.filter((a) => a.status === params.status);
    }
    if (params?.campaignId) {
      results = results.filter((a) => a.platformCampaignId === params.campaignId);
    }
    return results;
  }
  const searchParams = new URLSearchParams();
  if (params?.platform) searchParams.set("platform", params.platform);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.accountId) searchParams.set("accountId", params.accountId);
  if (params?.campaignId) searchParams.set("campaignId", params.campaignId);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const res = await fetch(`/api/v1/ads?${searchParams}`);
  const data = await res.json();
  return data?.ads ?? [];
}

export async function getAudiences(params?: {
  accountId?: string;
}): Promise<AdAudience[]> {
  if (shouldUseMock()) {
    const { mockAdAudiences } = await import("@/data/ads-mock");
    return mockAdAudiences;
  }
  const searchParams = new URLSearchParams();
  if (params?.accountId) searchParams.set("accountId", params.accountId);
  const res = await fetch(`/api/v1/ads/audiences?${searchParams}`);
  const data = await res.json();
  return data?.audiences ?? [];
}

export async function updateCampaignStatus(
  campaignId: string,
  status: "active" | "paused",
): Promise<void> {
  if (shouldUseMock()) {
    return;
  }
  await fetch(`/api/v1/ads/campaigns/${campaignId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function updateAdStatus(
  adId: string,
  status: "active" | "paused",
): Promise<void> {
  if (shouldUseMock()) {
    return;
  }
  await fetch(`/api/v1/ads/${adId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
