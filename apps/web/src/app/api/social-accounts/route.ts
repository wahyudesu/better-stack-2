import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export async function GET(req: Request) {
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

	const { searchParams } = new URL(req.url);
	const profileId = searchParams.get("profileId");

	let query = supabase
		.from("social_accounts")
		.select("*")
		.eq("user_id", user.id)
		.order("connected_at", { ascending: false });

	if (profileId) {
		query = query.eq("profile_id", profileId);
	}

	const { data, error } = await query;

	if (error) return NextResponse.json({ error }, { status: 500 });
	return NextResponse.json(data);
}

// POST has two modes:
// - POST /api/social-accounts (no body) → sync all accounts from Zernio
// - POST /api/social-accounts (with JSON body) → add single account from OAuth callback
export async function POST(req: Request) {
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

	const contentType = req.headers.get("content-type") || "";
	const isDirectAdd = contentType.includes("application/json");

	// Mode 1: Direct add from OAuth callback
	if (isDirectAdd) {
		const body = (await req.json()) as {
			platform?: string;
			accountId?: string;
			accountName?: string;
			avatarUrl?: string;
			profileId?: string;
		};

		if (body.platform && body.accountId) {
			// Get profile_id if not provided
			let profileId = body.profileId;
			if (!profileId) {
				const { data: defaultProfile } = await supabase
					.from("profiles")
					.select("id")
					.eq("clerk_id", userId)
					.eq("is_default", true)
					.limit(1)
					.single();
				profileId = defaultProfile?.id || null;
			}

			const { error } = await supabase.from("social_accounts").upsert(
				{
					user_id: user.id,
					clerk_id: userId,
					platform: body.platform,
					account_id: body.accountId,
					account_name: body.accountName || "Connected Account",
					avatar_url: body.avatarUrl || null,
					profile_id: profileId || null,
					connected_at: Math.floor(Date.now() / 1000),
					status: "active",
				},
				{ onConflict: "user_id,platform,account_id" },
			);
			if (error) return NextResponse.json({ error }, { status: 500 });
			return NextResponse.json({ success: true });
		}
	}

	// Mode 2: Sync all accounts from Zernio
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

	const res = await fetch(`${SERVER_URL}/v1/sync/accounts`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
	});

	type SyncAccountsResponse = { accounts?: unknown[]; error?: string };
	const data = (await res.json()) as SyncAccountsResponse;

	if (!res.ok) {
		return NextResponse.json(
			{ error: data.error || "Sync failed" },
			{ status: 502 },
		);
	}

	const accounts = (data.accounts || []) as Array<{
		platform: string;
		account_id: string;
		account_name: string;
		avatar_url?: string;
		connected_at: number;
		tokens?: string;
	}>;

	for (const account of accounts) {
		// Get default profile for this user
		const { data: defaultProfile } = await supabase
			.from("profiles")
			.select("id")
			.eq("clerk_id", userId)
			.eq("is_default", true)
			.limit(1)
			.single();

		await supabase.from("social_accounts").upsert(
			{
				user_id: user.id,
				clerk_id: userId,
				platform: account.platform,
				account_id: account.account_id,
				account_name: account.account_name,
				avatar_url: account.avatar_url,
				profile_id: defaultProfile?.id || null,
				connected_at: account.connected_at,
				tokens: account.tokens,
				status: "active",
			},
			{ onConflict: "user_id,platform,account_id" },
		);
	}

	return NextResponse.json({ accounts: data.accounts || [] });
}

export async function DELETE(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { accountId } = (await req.json()) as { accountId: string };

	const supabase = createServerSupabaseClient();

	const { data: user } = await supabase
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (!user)
		return NextResponse.json({ error: "User not found" }, { status: 404 });

	const { error } = await supabase
		.from("social_accounts")
		.delete()
		.eq("id", accountId)
		.eq("user_id", user.id);

	if (error) return NextResponse.json({ error }, { status: 500 });
	return NextResponse.json({ success: true });
}
