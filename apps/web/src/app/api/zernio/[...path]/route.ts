import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

type RouteContext = {
	params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
	return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
	return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
	return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
	return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
	return proxyRequest(request, context);
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
	const { path } = await context.params;

	// Authenticate via Clerk session (server-side)
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Fetch user's internal user_id from Clerk userId, then get api_key
	const supabase = createServerSupabaseClient();

	// Single RPC call instead of 2 sequential queries (async-parallel fix)
	const { data: apiKey, error: rpcError } = await supabase.rpc(
		"get_api_key_by_clerk_id",
		{ p_clerk_id: userId },
	);

	if (rpcError || !apiKey) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const base = SERVER_URL.endsWith("/") ? SERVER_URL : `${SERVER_URL}/`;
	const targetPath = path.join("/");
	const targetUrl = new URL(`v1/${targetPath}`, base);

	// For /v1/connect routes — platform must be a path segment, not query param
	// e.g. /api/zernio/connect?platform=youtube → /v1/connect/youtube
	if (path[0] === "connect") {
		const platform = request.nextUrl.searchParams.get("platform");
		if (platform) {
			targetUrl.pathname = `/v1/connect/${platform}`;
			// Remove platform from query params to avoid duplication
			request.nextUrl.searchParams.delete("platform");
		}
	}

	// Forward remaining query params
	request.nextUrl.searchParams.forEach((value, key) => {
		targetUrl.searchParams.set(key, value);
	});

	try {
		const body = ["POST", "PUT", "PATCH"].includes(request.method)
			? await request.text()
			: undefined;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
			...(body && { "Content-Length": String(body.length) }),
		};

		const response = await fetch(targetUrl.toString(), {
			method: request.method,
			headers,
			body,
		});

		const data = await response.json().catch(() => ({
			error: "Invalid response from server",
			status: response.status,
		}));

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error("[zernio proxy]", error);
		return NextResponse.json(
			{
				error: "Proxy error",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
