import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Clerk
const mockCreateUser = vi.fn();
const mockClerkClient = {
  users: {
    createUser: mockCreateUser,
  },
};

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: vi.fn(() => mockClerkClient),
}));

// Mock PostHog
vi.mock("@/lib/posthog-server", () => ({
  getPostHogClient: () => ({
    capture: vi.fn(),
    identify: vi.fn(),
  }),
}));

describe("POST /api/waitlist", async () => {
  const { POST } = await import("./route");

  const createMockRequest = (body: string, headers: Record<string, string> = {}) =>
    ({
      json: () => Promise.resolve(JSON.parse(body)),
      headers: {
        get: (name: string) => headers[name] || null,
      },
    }) as unknown as Request;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when email is missing", async () => {
    const req = createMockRequest("{}");
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email format is invalid", async () => {
    const req = createMockRequest('{"email":"not-an-email"}');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid email format");
  });

  it("returns 201 on successful user creation", async () => {
    mockCreateUser.mockResolvedValueOnce({ id: "user_123" });

    const req = createMockRequest('{"email":"test@example.com"}', {
      "X-POSTHOG-DISTINCT-ID": "test-id",
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.userId).toBe("user_123");
  });

  it("returns 409 when user already exists", async () => {
    mockCreateUser.mockRejectedValueOnce({
      errors: [{ code: "user_exists" }],
    });

    const req = createMockRequest('{"email":"existing@example.com"}');
    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("Email already registered");
  });

  it("returns 500 on Clerk error", async () => {
    mockCreateUser.mockRejectedValueOnce(new Error("Clerk error"));

    const req = createMockRequest('{"email":"test@example.com"}');
    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});