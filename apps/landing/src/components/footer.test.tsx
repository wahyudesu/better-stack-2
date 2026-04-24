import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders brand name and tagline", () => {
    render(<Footer />);
    expect(screen.getByText("ZenPost")).toBeInTheDocument();
    expect(screen.getByText(/Social media management dashboard/)).toBeInTheDocument();
  });

  it("renders product links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Tools" })).toHaveAttribute("href", "/tools");
    expect(screen.getByRole("link", { name: "Comparison" })).toHaveAttribute("href", "/comparison");
  });

  it("renders company links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });

  it("renders tool links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Content Script Engine" })).toHaveAttribute(
      "href",
      "/tools/script-engine"
    );
    expect(screen.getByRole("link", { name: "Personal Branding Builder" })).toHaveAttribute(
      "href",
      "/tools/branding"
    );
  });

  it("renders social media links with labels", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Twitter" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "TikTok" })).toBeInTheDocument();
  });

  it("renders copyright", () => {
    render(<Footer />);
    expect(screen.getByText("© 2026 ZenPost. All rights reserved.")).toBeInTheDocument();
    expect(screen.getByText(/Made with ❤️ untuk creator Indonesia/)).toBeInTheDocument();
  });
});