import { describe, it, expect, beforeEach, vi, beforeAll } from "vitest";
import { NextRequest } from "next/server";

// Mock PostHog server
vi.mock("@/lib/posthog-server", () => ({
  getPostHogClient: () => ({
    capture: vi.fn(),
    identify: vi.fn(),
  }),
}));

// Mock posthog-js
vi.mock("posthog-js", () => ({
  default: {
    capture: vi.fn(),
    identify: vi.fn(),
  },
}));

// Mock Supabase admin
const mockSelect = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockSingle = vi.fn();
const mockInsert = vi.fn();

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: vi.fn().mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
      insert: mockInsert,
    }),
  },
}));

describe("POST /api/waitlist", () => {
  let POST: typeof import("./route").POST;

  beforeAll(async () => {
    const module = await import("./route");
    POST = module.POST;
  });

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
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_SECRET_KEY", "test-secret-key");
  });

  it("returns 400 when email is missing", async () => {
    const req = createMockRequest('{"userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json() as { error?: string };
    expect(body.error).toBe("Email is required");
  });

  it("returns 400 when userType is missing", async () => {
    const req = createMockRequest('{"email":"test@example.com"}');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json() as { error?: string };
    expect(body.error).toBe("User type is required");
  });

  it("returns 400 when userType is invalid", async () => {
    const req = createMockRequest('{"email":"test@example.com","userType":"invalid"}');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json() as { error?: string };
    expect(body.error).toBe("User type is required");
  });

  it("returns 400 for invalid email format", async () => {
    const req = createMockRequest('{"email":"not-an-email","userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json() as { error?: string };
    expect(body.error).toBe("Invalid email format");
  });

  it("returns 409 when email already exists", async () => {
    mockSingle.mockResolvedValueOnce({ data: { id: "existing-id" }, error: null });

    const req = createMockRequest('{"email":"existing@example.com","userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json() as { error?: string };
    expect(body.error).toBe("Email already registered");
  });

  it("returns 201 on successful submission", async () => {
    // No existing email - first call to .single() for email check
    mockSingle.mockResolvedValueOnce({ data: null, error: null });
    // Second call to .single() for count query returns count
    mockSingle.mockResolvedValueOnce({ data: null, error: null, count: 0 });
    // Insert succeeds
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = createMockRequest('{"email":"test@example.com","userType":"agency_owner"}');
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json() as { success?: boolean; position?: number };
    expect(body.success).toBe(true);
    expect(body.position).toBe(1);
  });

  it("returns 201 for creator_freelance user type", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: null });
    mockSingle.mockResolvedValueOnce({ data: null, error: null, count: 0 });
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = createMockRequest('{"email":"creator@example.com","userType":"creator_freelance"}');
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});