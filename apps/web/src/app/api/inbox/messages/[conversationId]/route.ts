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

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ conversationId: string }> },
) {
	try {
		const { conversationId } = await params;
		const { searchParams } = new URL(request.url);

		const accountId = searchParams.get("accountId");
		if (!accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 },
			);
		}

		const cursor = searchParams.get("cursor") ?? undefined;
		const limit = searchParams.get("limit")
			? parseInt(searchParams.get("limit")!, 10)
			: undefined;
		const sortOrder = searchParams.get("sortOrder") as
			| "asc"
			| "desc"
			| undefined;

		const zernio = await getZernioClient();
		const response = await zernio.messages.getInboxConversationMessages({
			path: { conversationId },
			query: { accountId, cursor, limit, sortOrder },
		});

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error listing inbox messages:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ conversationId: string }> },
) {
	try {
		const { conversationId } = await params;
		const body = (await request.json()) as {
			accountId: string;
			message?: string;
			attachmentUrl?: string;
		};
		const { accountId, message, attachmentUrl } = body;

		if (!accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 },
			);
		}

		if (!message && !attachmentUrl) {
			return NextResponse.json(
				{ error: "message or attachmentUrl is required" },
				{ status: 400 },
			);
		}

		const zernio = await getZernioClient();
		const response = await zernio.messages.sendInboxMessage({
			path: { conversationId },
			body: { accountId, message, attachmentUrl },
		});

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error sending inbox message:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
