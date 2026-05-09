import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const supabase = createServerSupabaseClient();
	const { data, error } = await supabase
		.from("organizations")
		.select("*")
		.eq("clerk_id", userId)
		.order("created_at", { ascending: false });

	if (error) return NextResponse.json({ error }, { status: 500 });
	return NextResponse.json(data);
}

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { orgName, orgLogo } = (await req.json()) as {
		orgName: string;
		orgLogo?: string;
	};

	const supabase = createServerSupabaseClient();
	const { data, error } = await supabase
		.from("organizations")
		.insert({ clerk_id: userId, name: orgName, logo_url: orgLogo })
		.select()
		.single();

	if (error) return NextResponse.json({ error }, { status: 500 });
	return NextResponse.json({ orgId: data.id });
}
