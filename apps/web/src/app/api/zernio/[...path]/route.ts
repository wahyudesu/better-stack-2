import { type NextRequest, NextResponse } from "next/server";
import { useAuthStore } from "@/stores";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

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
	const apiKey = useAuthStore.getState().apiKey;

	if (!apiKey) {
		return NextResponse.json(
			{ error: "Not authenticated or API key not set" },
			{ status: 401 },
		);
	}

	const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
	const targetPath = path.join("/");
	const targetUrl = new URL(targetPath, base);

	// Forward query params
	request.nextUrl.searchParams.forEach((value, key) => {
		targetUrl.searchParams.set(key, value);
	});

	try {
		const body = ["POST", "PUT", "PATCH"].includes(request.method)
			? await request.text()
			: undefined;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(body && { "Content-Length": String(body.length) }),
		};

		// Forward API key
		headers["X-API-Key"] = apiKey;

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
