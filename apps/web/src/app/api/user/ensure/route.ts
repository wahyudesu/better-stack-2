import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST() {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const adminClient = createAdminClient();

	const { data: user, error: userError } = await adminClient
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (userError && userError.code !== "PGRST116") {
		console.error("[user/ensure] user lookup error:", userError);
		return NextResponse.json({ error: userError.message }, { status: 500 });
	}

	let uid = user?.id;

	if (!uid) {
		const { data: newUser, error: createError } = await adminClient
			.from("users")
			.insert({ clerk_id: userId })
			.select("id")
			.single();

		if (createError) {
			console.error("[user/ensure] create user error:", createError);
			return NextResponse.json({ error: createError.message }, { status: 500 });
		}
		uid = newUser.id;
	}

	const { error: settingsError } = await adminClient
		.from("user_settings")
		.upsert({ user_id: uid }, { onConflict: "user_id" });

	if (settingsError) {
		console.error("[user/ensure] upsert settings error:", settingsError);
		return NextResponse.json({ error: settingsError.message }, { status: 500 });
	}

	return NextResponse.json({ userId, created: true });
}
