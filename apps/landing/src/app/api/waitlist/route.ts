import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

interface WaitlistBody {
  email?: string;
  userType?: string;
}

export async function GET() {
  // Loop.so doesn't provide a count API, so return null
  // The social proof component will handle the fallback gracefully
  return NextResponse.json({ count: null }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const distinctId = req.headers.get("X-POSTHOG-DISTINCT-ID") ?? "anonymous";
  const sessionId = req.headers.get("X-POSTHOG-SESSION-ID") ?? undefined;
  const posthog = getPostHogClient();

  try {
    const body: WaitlistBody = await req.json();
    const email = body.email;
    const userType = body.userType;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!userType || typeof userType !== "string") {
      return NextResponse.json(
        { success: false, error: "User type is required" },
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

    const formId = process.env.LOOPS_FORM_ID;
    if (!formId) {
      console.error("LOOPS_FORM_ID not configured");
      return NextResponse.json(
        { success: false, error: "Waitlist not configured" },
        { status: 503 }
      );
    }

    // Submit to Loop.so
    const formBody = new URLSearchParams({
      email,
      classifyUser: userType,
    });

    const response = await fetch(
      `https://app.loops.so/api/newsletter-form/${formId}`,
      {
        method: "POST",
        body: formBody.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 429) {
      return NextResponse.json(
        { success: false, error: "Too many signups, please try again later" },
        { status: 429 }
      );
    }

    const data: { success: boolean; message?: string } = await response.json();

    if (!data.success) {
      posthog.capture({
        distinctId,
        event: "waitlist_signup_error",
        properties: {
          error: data.message || "loop_error",
          email,
          ...(sessionId ? { $session_id: sessionId } : {}),
        },
      });
      return NextResponse.json(
        { success: false, error: data.message || "Failed to join waitlist" },
        { status: 400 }
      );
    }

    posthog.identify({
      distinctId,
      properties: { email, userType },
    });
    posthog.capture({
      distinctId,
      event: "waitlist_signup_success",
      properties: {
        email,
        userType,
        ...(sessionId ? { $session_id: sessionId } : {}),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "You're on the waitlist!",
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
