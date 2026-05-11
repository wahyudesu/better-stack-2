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

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ conversationId: string }> },
) {
	try {
		const { conversationId } = await params;
		const body = (await request.json()) as {
			accountId: string;
			status?: "active" | "archived";
		};
		const { accountId, status } = body;

		if (!accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 },
			);
		}

		if (!status) {
			return NextResponse.json(
				{ error: "status is required" },
				{ status: 400 },
			);
		}

		const zernio = await getZernioClient();
		const response = await zernio.messages.updateInboxConversation({
			path: { conversationId },
			body: { accountId, status },
		});

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error updating inbox conversation:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
