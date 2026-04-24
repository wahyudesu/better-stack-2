import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: null,
    isSignedIn: false,
    isLoaded: true,
  }),
}));

// Mock PostHog
vi.mock("posthog-js", () => ({
  capture: vi.fn(),
  captureException: vi.fn(),
  identify: vi.fn(),
  get_distinct_id: () => "test-distinct-id",
  get_session_id: () => "test-session-id",
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:3000",
  },
  writable: true,
});