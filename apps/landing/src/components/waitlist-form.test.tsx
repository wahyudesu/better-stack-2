import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WaitlistForm } from "./waitlist-form";

describe("WaitlistForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email input and submit button", () => {
    render(<WaitlistForm />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join Waitlist" })).toBeInTheDocument();
  });

  it("shows error when submitting empty email", async () => {
    render(<WaitlistForm />);
    fireEvent.click(screen.getByRole("button", { name: "Join Waitlist" }));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("calls POST /api/waitlist with email on submit", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, message: "You're on the waitlist!" }),
    });
    global.fetch = mockFetch;

    render(<WaitlistForm />);

    const input = screen.getByPlaceholderText("Enter your email");
    const button = screen.getByRole("button", { name: "Join Waitlist" });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      });
    });
  });

  it("shows loading state while submitting", async () => {
    let resolve: (value: unknown) => void;
    const mockFetch = new Promise((r) => { resolve = r; }).then(() => ({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    }));
    global.fetch = () => mockFetch as unknown as typeof fetch;

    render(<WaitlistForm />);

    const button = screen.getByRole("button", { name: "Join Waitlist" });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(button);

    expect(await screen.findByText(/Joining/)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("shows success dialog after successful submission", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, message: "You're on the waitlist!" }),
    });

    render(<WaitlistForm />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Join Waitlist" }));

    await waitFor(() => {
      expect(screen.getByText("You're on the waitlist!")).toBeInTheDocument();
    });
  });

  it("shows error message on API error", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ success: false, error: "Email already registered" }),
    });

    render(<WaitlistForm />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Join Waitlist" }));

    expect(await screen.findByText("Email already registered")).toBeInTheDocument();
  });

  it("disables input and button while loading", async () => {
    global.fetch = () => new Promise(() => {}) as unknown as typeof fetch;

    render(<WaitlistForm />);

    const input = screen.getByPlaceholderText("Enter your email") as HTMLInputElement;
    const button = screen.getByRole("button", { name: "Join Waitlist" });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});