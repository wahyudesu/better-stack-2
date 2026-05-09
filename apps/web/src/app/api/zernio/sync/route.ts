import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export async function POST() {
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

	const [postsRes, accountsRes] = await Promise.all([
		fetch(`${SERVER_URL}/v1/sync/posts`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
		}),
		fetch(`${SERVER_URL}/v1/sync/accounts`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
		}),
	]);

	type SyncResponse = {
		posts?: unknown[];
		accounts?: unknown[];
		error?: string;
	};
	const [postsData, accountsData] = await Promise.all([
		postsRes.json() as Promise<SyncResponse>,
		accountsRes.json() as Promise<SyncResponse>,
	]);

	if (!postsRes.ok)
		return NextResponse.json(
			{ error: (postsData as SyncResponse).error || "Sync posts failed" },
			{ status: 502 },
		);
	if (!accountsRes.ok)
		return NextResponse.json(
			{ error: (accountsData as SyncResponse).error || "Sync accounts failed" },
			{ status: 502 },
		);

	const posts = (postsData as SyncResponse).posts || [];
	for (const post of posts) {
		const p = post as Record<string, unknown>;
		await supabase.from("posts").upsert(
			{
				user_id: user.id,
				external_post_id: String(p.id || p.external_id || ""),
				text: String(p.text || p.content || ""),
				platforms: (p.platforms as string[]) || [],
				status: String(p.status || "published"),
				scheduled_at: p.scheduled_at as number | undefined,
				published_at: p.published_at as number | undefined,
				media_urls: (p.media_urls as string[]) || [],
			},
			{ onConflict: "user_id,external_post_id" },
		);
	}

	const accounts = (accountsData as SyncResponse).accounts || [];
	for (const account of accounts) {
		const a = account as Record<string, unknown>;
		await supabase.from("social_accounts").upsert(
			{
				user_id: user.id,
				platform: String(a.platform || ""),
				account_id: String(a.account_id || a.id || ""),
				account_name: String(a.account_name || a.name || ""),
				avatar_url:
					(a.avatar_url as string) || (a.profile_image as string) || null,
				connected_at:
					(a.connected_at as number) || Math.floor(Date.now() / 1000),
				status: "active",
			},
			{ onConflict: "user_id,platform,account_id" },
		);
	}

	return NextResponse.json({ posts, accounts });
}
