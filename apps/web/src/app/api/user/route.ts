import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const adminClient = createAdminClient();

	const { data: user } = await adminClient
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (!user) return NextResponse.json({ api_key: null, last_synced_at: null });

	const { data, error } = await adminClient
		.from("user_settings")
		.select("api_key, last_synced_at")
		.eq("user_id", user.id)
		.single();

	if (error && error.code !== "PGRST116") {
		return NextResponse.json({ error }, { status: 500 });
	}
	return NextResponse.json(data ?? { api_key: null, last_synced_at: null });
}
