import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { uploadMedia } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const formData = await req.formData();
	const file = formData.get("file") as File;
	if (!file)
		return NextResponse.json({ error: "No file provided" }, { status: 400 });

	const adminClient = createAdminClient();

	const { data: user } = await adminClient
		.from("users")
		.select("id")
		.eq("clerk_id", userId)
		.single();

	if (!user)
		return NextResponse.json({ error: "User not found" }, { status: 404 });

	const { storageId, url } = await uploadMedia(userId, file);

	const { data, error } = await adminClient
		.from("media")
		.insert({
			user_id: user.id,
			storage_id: storageId,
			filename: file.name,
			mime_type: file.type,
			url,
		})
		.select()
		.single();

	if (error) return NextResponse.json({ error }, { status: 500 });
	return NextResponse.json(data);
}
