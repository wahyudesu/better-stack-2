import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

interface WaitlistBody {
  email?: string;
}

export async function POST(req: NextRequest) {
  const distinctId = req.headers.get("X-POSTHOG-DISTINCT-ID") ?? "anonymous";
  const sessionId = req.headers.get("X-POSTHOG-SESSION-ID") ?? undefined;
  const posthog = getPostHogClient();

  try {
    const body: WaitlistBody = await req.json();
    const email = body.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create Clerk user with waitlist metadata
    const clerk = await clerkClient();

    // Check if user already exists with this email
    // Clerk doesn't have a direct "find by email" API, so we try to create
    // and catch the conflict error
    let user;
    try {
      user = await clerk.users.createUser({
        emailAddress: [email],
        publicMetadata: {
          isWaitlist: true,
          joinedAt: new Date().toISOString(),
        },
        // Don't require email verification immediately for waitlist
        // User can verify later when they want to sign in
      });
    } catch (err: unknown) {
      // Check if it's a "user already exists" error
      if (
        err &&
        typeof err === "object" &&
        "errors" in err &&
        Array.isArray((err as { errors: unknown }).errors) &&
        ((err as { errors: { code?: string }[] }).errors)[0]?.code === "user_exists"
      ) {
        posthog.capture({
          distinctId,
          event: "waitlist_signup_error",
          properties: {
            error: "email_already_registered",
            email,
            ...(sessionId ? { $session_id: sessionId } : {}),
          },
        });
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 409 }
        );
      }
      throw err;
    }

    posthog.identify({
      distinctId,
      properties: { email },
    });
    posthog.capture({
      distinctId,
      event: "waitlist_signup_success",
      properties: {
        email,
        userId: user.id,
        ...(sessionId ? { $session_id: sessionId } : {}),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "You're on the waitlist!",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    posthog.capture({
      distinctId,
      event: "waitlist_signup_error",
      properties: {
        error: "internal_server_error",
      },
    });
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
