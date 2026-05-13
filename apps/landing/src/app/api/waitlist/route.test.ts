import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// Mock PostHog server
vi.mock("@/lib/posthog-server", () => ({
  getPostHogClient: () => ({
    capture: vi.fn(),
    identify: vi.fn(),
  }),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("POST /api/waitlist", async () => {
  const { POST } = await import("./route");

  const createMockRequest = (body: string, headers: Record<string, string> = {}) => {
    const req = new NextRequest("http://localhost/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body,
    });
    return req;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("LOOPS_FORM_ID", "test-form-id");
  });

  it("returns 400 when email is missing", async () => {
    const req = createMockRequest("{}");
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email format is invalid", async () => {
    const req = createMockRequest('{"email":"not-an-email","userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json() as { error?: string };
    expect(body.error).toBe("Invalid email format");
  });

  it("returns 201 on successful submission", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("", { status: 201, statusText: "OK" })
    );

    const req = createMockRequest('{"email":"test@example.com","userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json() as { success?: boolean };
    expect(body.success).toBe(true);
  });

  it("returns 201 when Loop.so returns empty body", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("", { status: 200, statusText: "OK" })
    );

    const req = createMockRequest('{"email":"test@example.com","userType":"creator_freelance"}');
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 400 when Loop.so returns error JSON", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, message: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    );

    const req = createMockRequest('{"email":"bad@example.com","userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json() as { error?: string };
    expect(body.error).toBe("Invalid email");
  });

  it("returns 429 on rate limit", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("", { status: 429 })
    );

    const req = createMockRequest('{"email":"test@example.com","userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("returns 503 when LOOPS_FORM_ID is not configured", async () => {
    vi.stubEnv("LOOPS_FORM_ID", "");

    const req = createMockRequest('{"email":"test@example.com","userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(503);
  });
});