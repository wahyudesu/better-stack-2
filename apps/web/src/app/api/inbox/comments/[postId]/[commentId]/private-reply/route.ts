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

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ postId: string; commentId: string }> },
) {
	try {
		const { postId, commentId } = await params;
		const body = (await request.json()) as {
			accountId: string;
			message: string;
			quickReplies?: string[];
			buttons?: Array<{
				type: string;
				text: string;
				url?: string;
				phone?: string;
			}>;
		};
		const { accountId, message, quickReplies, buttons } = body;

		if (!accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 },
			);
		}

		if (!message) {
			return NextResponse.json(
				{ error: "message is required" },
				{ status: 400 },
			);
		}

		const zernio = await getZernioClient();

		const result = await zernio.comments.sendPrivateReplyToComment({
			path: { postId, commentId },
			body: {
				accountId,
				message,
				...(quickReplies && { quickReplies }),
				...(buttons && { buttons }),
			},
		});

		return NextResponse.json(result.data ?? { success: true });
	} catch (error) {
		console.error("Error sending private reply:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
