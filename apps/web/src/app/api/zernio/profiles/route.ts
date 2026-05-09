import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

async function getApiKey(
	supabase: ReturnType<typeof createServerSupabaseClient>,
	userId: string,
) {
	const { data: user } = await supabase
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (!user) return null;

	const { data: settings } = await supabase
		.from("user_settings")
		.select("api_key")
		.eq("user_id", user.id)
		.single();

	return { userId: user.id, apiKey: settings?.api_key || null };
}

export async function GET(request: NextRequest) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();
	const result = await getApiKey(supabase, userId);
	if (!result || !result.apiKey)
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const url = new URL(`${SERVER_URL}/v1/profiles`);
	request.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

	const res = await fetch(url.toString(), {
		headers: { Authorization: `Bearer ${result.apiKey}` },
	});
	const data = await res.json().catch(() => ({ error: "Invalid response" }));
	return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();
	const result = await getApiKey(supabase, userId);
	if (!result || !result.apiKey)
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const body = await request.text();
	const res = await fetch(`${SERVER_URL}/v1/profiles`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${result.apiKey}`,
			"Content-Type": "application/json",
		},
		body,
	});
	const data = await res.json().catch(() => ({ error: "Invalid response" }));
	return NextResponse.json(data, { status: res.status });
}
