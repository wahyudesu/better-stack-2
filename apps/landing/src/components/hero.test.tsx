import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Hero } from "./hero";

describe("Hero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders headline and subheadline", () => {
    render(<Hero />);
    expect(screen.getByText("Analytics first for social media and ads")).toBeInTheDocument();
    expect(screen.getByText(/Jadwalkan konten/)).toBeInTheDocument();
  });

  it("renders early access badge", () => {
    render(<Hero />);
    expect(screen.getByText("Early access")).toBeInTheDocument();
  });

  it("renders WaitlistForm component", () => {
    render(<Hero />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  it("renders all three tabs", () => {
    render(<Hero />);
    expect(screen.getByRole("tab", { name: "Analytics" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Scheduler" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "AI Assistant" })).toBeInTheDocument();
  });

  it("renders feature descriptions below tabs", () => {
    render(<Hero />);
    expect(screen.getByText(/Pantau semua metrik/)).toBeInTheDocument();
    expect(screen.getByText(/Jadwalkan posting/)).toBeInTheDocument();
    expect(screen.getByText(/Buat konten berkualitas/)).toBeInTheDocument();
  });
});