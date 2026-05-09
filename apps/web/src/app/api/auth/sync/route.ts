/**
 * Sync Clerk user to Supabase.
 * Creates users and user_settings if not exists.
 * Uses admin client to bypass RLS during setup.
 */
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST() {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createAdminClient();

	// Ensure users entry exists
	const { data: users, error: usersError } = await supabase
		.from("users")
		.select("id")
		.eq("clerk_id", userId);

	if (usersError) {
		console.error("[api/auth/sync] users query error:", usersError);
		return NextResponse.json({ error: usersError.message }, { status: 500 });
	}

	let userId2: string;
	if (!users || users.length === 0) {
		// Insert new user
		const { data: newUser, error: insertError } = await supabase
			.from("users")
			.insert({ clerk_id: userId })
			.select("id")
			.single();

		if (insertError || !newUser) {
			console.error("[api/auth/sync] user insert error:", insertError);
			return NextResponse.json(
				{ error: "Failed to create user" },
				{ status: 500 },
			);
		}
		userId2 = newUser.id;
	} else {
		userId2 = users[0].id;
	}

	// Upsert user_settings
	const { error } = await supabase
		.from("user_settings")
		.upsert({ user_id: userId2 }, { onConflict: "user_id" });

	if (error) {
		console.error("[api/auth/sync] user_settings upsert error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ ok: true, userId });
}
