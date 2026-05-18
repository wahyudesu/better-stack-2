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
	{ params }: { params: Promise<{ postId: string }> },
) {
	try {
		const { postId } = await params;
		const { searchParams } = new URL(request.url);
		const accountId = searchParams.get("accountId");

		if (!accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 },
			);
		}

		const zernio = await getZernioClient();

		const result = await zernio.comments.getInboxPostComments({
			path: { postId },
			query: { accountId },
		});

		const zernioData = result.data as {
			data?: Array<Record<string, unknown>>;
			pagination?: Record<string, unknown>;
		};

		return NextResponse.json({
			comments: zernioData?.data ?? [],
			pagination: zernioData?.pagination,
		});
	} catch (error) {
		console.error("Error getting post comments:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ postId: string }> },
) {
	try {
		const { postId } = await params;
		const body = (await request.json()) as {
			accountId: string;
			message: string;
			commentId?: string;
		};
		const { accountId, message, commentId } = body;

		if (!accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 },
			);
		}

		const zernio = await getZernioClient();

		// Reply to comment if commentId provided, otherwise reply to post
		const result = await zernio.comments.replyToInboxPost({
			path: { postId },
			body: {
				accountId,
				message,
				...(commentId && { commentId }),
			},
		});

		return NextResponse.json(result.data ?? { success: true });
	} catch (error) {
		console.error("Error replying to comment:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ postId: string }> },
) {
	try {
		const { postId } = await params;
		const { searchParams } = new URL(request.url);
		const accountId = searchParams.get("accountId");
		const commentId = searchParams.get("commentId");

		if (!accountId || !commentId) {
			return NextResponse.json(
				{ error: "accountId and commentId are required" },
				{ status: 400 },
			);
		}

		const zernio = await getZernioClient();

		const result = await zernio.comments.deleteInboxComment({
			path: { postId },
			query: { accountId, commentId },
		});

		return NextResponse.json(result.data ?? { success: true });
	} catch (error) {
		console.error("Error deleting comment:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
