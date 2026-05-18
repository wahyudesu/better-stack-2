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
		const { searchParams } = new URL(request.url);
		const accountId = searchParams.get("accountId");

		if (!accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 },
			);
		}

		const zernio = await getZernioClient();

		const result = await zernio.comments.likeInboxComment({
			path: { postId, commentId },
			query: { accountId },
		});

		return NextResponse.json(result.data ?? { success: true });
	} catch (error) {
		console.error("Error liking comment:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ postId: string; commentId: string }> },
) {
	try {
		const { postId, commentId } = await params;
		const { searchParams } = new URL(request.url);
		const accountId = searchParams.get("accountId");

		if (!accountId) {
			return NextResponse.json(
				{ error: "accountId is required" },
				{ status: 400 },
			);
		}

		const zernio = await getZernioClient();

		const result = await zernio.comments.unlikeInboxComment({
			path: { postId, commentId },
			query: { accountId },
		});

		return NextResponse.json(result.data ?? { success: true });
	} catch (error) {
		console.error("Error unliking comment:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
