import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export async function GET() {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();

	const { data: user } = await supabase
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (!user)
		return NextResponse.json({ error: "User not found" }, { status: 404 });

	const { data, error } = await supabase
		.from("posts")
		.select("*")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	if (error) return NextResponse.json({ error }, { status: 500 });
	return NextResponse.json(data);
}

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = (await req.json()) as {
		text: string;
		platforms: string[];
		scheduledAt?: number;
		mediaUrls?: string[];
		accountIds?: string[];
		profileId?: string;
	};
	const { text, platforms, scheduledAt, mediaUrls, accountIds, profileId } =
		body;

	const supabase = createServerSupabaseClient();

	const { data: user } = await supabase
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (!user)
		return NextResponse.json({ error: "User not found" }, { status: 404 });

	const { data: settings } = await supabase
		.from("user_settings")
		.select("api_key")
		.eq("user_id", user.id)
		.single();

	const apiKey = settings?.api_key;
	if (!apiKey)
		return NextResponse.json(
			{ error: "Not connected to Zernio" },
			{ status: 401 },
		);

	const zernioRes = await fetch(`${SERVER_URL}/v1/posts`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			text,
			platforms,
			scheduledAt,
			mediaUrls,
			accountIds,
			profileId,
		}),
	});

	if (!zernioRes.ok) {
		const errorData = (await zernioRes.json().catch(() => ({}))) as {
			error?: string;
		};
		return NextResponse.json(
			{ error: errorData.error || "Zernio API error" },
			{ status: 502 },
		);
	}

	const zernioPost = (await zernioRes.json()) as { externalId?: string };

	const { data, error } = await supabase
		.from("posts")
		.insert({
			user_id: user.id,
			text,
			platforms,
			status: scheduledAt ? "scheduled" : "draft",
			scheduled_at: scheduledAt,
			media_urls: mediaUrls ?? [],
			external_post_id: zernioPost.externalId,
		})
		.select()
		.single();

	if (error) return NextResponse.json({ error }, { status: 500 });
	return NextResponse.json({
		postId: data.id,
		externalId: zernioPost.externalId,
	});
}
