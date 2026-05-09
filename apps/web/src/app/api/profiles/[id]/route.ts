import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();
	const { searchParams } = new URL(req.url);
	const profileId = searchParams.get("id");

	if (!profileId)
		return NextResponse.json({ error: "id required" }, { status: 400 });

	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", profileId)
		.eq("clerk_id", userId)
		.single();

	if (error) {
		const errorMessage = error.message || "Unknown error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
	return NextResponse.json(data);
}

export async function PATCH(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();
	const body = (await req.json()) as {
		id: string;
		name?: string;
		description?: string;
		is_default?: boolean;
	};

	if (!body.id)
		return NextResponse.json({ error: "id required" }, { status: 400 });

	// If setting as default, unset other defaults first
	if (body.is_default === true) {
		await supabase
			.from("profiles")
			.update({ is_default: false })
			.eq("clerk_id", userId);
	}

	const { data, error } = await supabase
		.from("profiles")
		.update({
			name: body.name,
			description: body.description,
			is_default: body.is_default,
			updated_at: Math.floor(Date.now() / 1000),
		})
		.eq("id", body.id)
		.eq("clerk_id", userId)
		.select()
		.single();

	if (error) {
		const errorMessage = error.message || "Unknown error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
	return NextResponse.json(data);
}

export async function DELETE(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();
	const { searchParams } = new URL(req.url);
	const profileId = searchParams.get("id");

	if (!profileId)
		return NextResponse.json({ error: "id required" }, { status: 400 });

	// Don't delete if it's the last profile
	const { data: count } = await supabase
		.from("profiles")
		.select("id", { count: "exact" })
		.eq("clerk_id", userId);

	if ((count?.length ?? 0) <= 1)
		return NextResponse.json(
			{ error: "Cannot delete last profile" },
			{ status: 400 },
		);

	// Unlink social accounts from this profile before deleting
	await supabase
		.from("social_accounts")
		.update({ profile_id: null })
		.eq("profile_id", profileId);

	const { error } = await supabase
		.from("profiles")
		.delete()
		.eq("id", profileId)
		.eq("clerk_id", userId);

	if (error) {
		const errorMessage = error.message || "Unknown error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
	return NextResponse.json({ success: true });
}
