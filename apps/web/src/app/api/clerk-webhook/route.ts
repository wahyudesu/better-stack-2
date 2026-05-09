import { createHmac } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

function verifyWebhook(body: string, sig: string): boolean {
	const expected = createHmac("sha256", WEBHOOK_SECRET)
		.update(body)
		.digest("hex");
	const expectedSig = `v1=${expected}`;
	try {
		const a = Buffer.from(expectedSig, "utf8");
		const b = Buffer.from(sig, "utf8");
		if (a.length !== b.length) return false;
		let mismatch = 0;
		for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
		return mismatch === 0;
	} catch {
		return false;
	}
}

export async function POST(req: NextRequest) {
	const body = await req.text();
	const sig = req.headers.get("svix-signature") ?? "";

	if (!verifyWebhook(body, sig)) {
		return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
	}

	const event = JSON.parse(body);
	const { type, data } = event as { type: string; data: any };

	switch (type) {
		case "organization.created":
		case "organization.updated":
		case "organization.deleted":
		case "organizationMembership.created":
		case "organizationMembership.deleted": {
			const serverResp = await fetch(
				`${process.env.SERVER_URL}/v1/clerk-webhook`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-api-key": process.env.SERVER_INTERNAL_KEY!,
					},
					body: JSON.stringify({ type, data }),
				},
			);
			if (!serverResp.ok) {
				console.error("Server sync failed:", await serverResp.text());
				return NextResponse.json({ error: "Sync failed" }, { status: 500 });
			}
			break;
		}
	}

	return NextResponse.json({ received: true });
}
