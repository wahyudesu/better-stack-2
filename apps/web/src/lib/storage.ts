import { createClient } from "@supabase/supabase-js";

const BUCKET = "media";

function getSupabaseAdmin() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SECRET_KEY!,
	);
}

export async function uploadMedia(userId: string, file: File) {
	const supabase = getSupabaseAdmin();
	const ext = file.name.split(".").pop() ?? "bin";
	const path = `${userId}/${Date.now()}.${ext}`;

	const { data, error } = await supabase.storage
		.from(BUCKET)
		.upload(path, file, { contentType: file.type });

	if (error) throw new Error(`Storage upload failed: ${error.message}`);

	const {
		data: { publicUrl },
	} = supabase.storage.from(BUCKET).getPublicUrl(path);

	return { storageId: path, url: publicUrl };
}
