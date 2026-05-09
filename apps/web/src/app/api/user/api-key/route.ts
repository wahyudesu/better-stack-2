import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function PATCH(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { apiKey } = (await req.json()) as { apiKey: string };

	const adminClient = createAdminClient();

	const { data: user } = await adminClient
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (!user)
		return NextResponse.json({ error: "User not found" }, { status: 404 });

	const { error } = await adminClient.from("user_settings").upsert(
		{
			user_id: user.id,
			api_key: apiKey,
			updated_at: Math.floor(Date.now() / 1000),
		},
		{ onConflict: "user_id" },
	);

	if (error) return NextResponse.json({ error }, { status: 500 });
	return NextResponse.json({ success: true });
}
