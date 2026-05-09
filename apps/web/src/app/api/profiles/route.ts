import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("clerk_id", userId)
		.order("is_default", { ascending: false })
		.order("created_at", { ascending: true });

	if (error) {
		const errorMessage = error.message || "Unknown error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
	return NextResponse.json(data);
}

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();
	const body = (await req.json()) as {
		name?: string;
		description?: string;
		zernio_profile_id?: string;
		is_default?: boolean;
	};

	// If no profiles exist for this user, make this one the default
	const { data: existing } = await supabase
		.from("profiles")
		.select("id")
		.eq("clerk_id", userId)
		.limit(1);

	const isDefault = !existing || body.is_default === true;

	const toInsert = {
		clerk_id: userId,
		name: body.name || "Default Profile",
		description: body.description || null,
		zernio_profile_id: body.zernio_profile_id || null,
		is_default: isDefault,
	};

	const { data, error } = await supabase
		.from("profiles")
		.insert(toInsert)
		.select()
		.single();

	if (error) {
		const errorMessage = error.message || "Unknown error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
	return NextResponse.json(data, { status: 201 });
}
