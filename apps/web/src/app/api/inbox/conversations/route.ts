import { auth } from "@clerk/nextjs/server";
import Zernio from "@zernio/node";
import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

async function getZernioClient() {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const adminClient = createAdminClient();

	const { data: user } = await adminClient
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (!user) throw new Error("User not found");

	const { data: settings } = await adminClient
		.from("user_settings")
		.select("api_key")
		.eq("user_id", user.id)
		.single();

	if (!settings?.api_key) throw new Error("API key not configured");

	return new Zernio({ apiKey: settings.api_key });
}

export async function GET(request: NextRequest) {
	try {
		const zernio = await getZernioClient();
		const { searchParams } = new URL(request.url);

		const accountId = searchParams.get("accountId") ?? undefined;
		const platform = searchParams.get("platform") as
			| "facebook"
			| "instagram"
			| "twitter"
			| "bluesky"
			| "reddit"
			| "telegram"
			| undefined;
		const profileId = searchParams.get("profileId") ?? undefined;
		const status = searchParams.get("status") as
			| "active"
			| "archived"
			| undefined;
		const limit = searchParams.get("limit")
			? parseInt(searchParams.get("limit")!, 10)
			: undefined;
		const cursor = searchParams.get("cursor") ?? undefined;
		const sortOrder = searchParams.get("sortOrder") as
			| "asc"
			| "desc"
			| undefined;

		const result = await zernio.messages.listInboxConversations({
			query: {
				accountId,
				platform,
				profileId,
				status,
				limit,
				cursor,
				sortOrder,
			},
		});

		// Zernio SDK: result.data contains { data: [...], pagination, meta }
		const zernioData = result.data as {
			data?: Array<Record<string, unknown>>;
			pagination?: Record<string, unknown>;
			meta?: Record<string, unknown>;
		};

		return NextResponse.json({
			conversations: zernioData?.data ?? [],
			pagination: zernioData?.pagination,
			meta: zernioData?.meta,
		});
	} catch (error) {
		console.error("Error listing inbox conversations:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
