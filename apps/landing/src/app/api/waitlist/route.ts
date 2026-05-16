import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getResendClient } from "@/lib/resend";
import { getWaitlistConfirmationEmail } from "@/emails/waitlist-confirmation";
import posthog from "posthog-js";

interface WaitlistBody {
  email?: string;
  userType?: "agency_owner" | "brand_owner" | "creator_freelance";
}

const VALID_USER_TYPES = ["agency_owner", "brand_owner", "creator_freelance"];

export async function GET() {
  return NextResponse.json({ count: null }, { status: 200 });
}

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { success: false, error: "Service unavailable" },
      { status: 503 }
    );
  }

  const distinctId = req.headers.get("X-POSTHOG-DISTINCT-ID") ?? "anonymous";
  const sessionId = req.headers.get("X-POSTHOG-SESSION-ID") ?? undefined;

  try {
    const body: WaitlistBody = await req.json();
    const email = body.email?.trim().toLowerCase();
    const userType = body.userType;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!userType || !VALID_USER_TYPES.includes(userType)) {
      return NextResponse.json(
        { success: false, error: "User type is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from("waitlist")
      .select("id, email")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    // Get current count for position
    const { count } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    const position = (count ?? 0) + 1;

    // Insert new waitlist entry
    const { error: insertError } = await supabaseAdmin
      .from("waitlist")
      .insert({
        email,
        user_type: userType,
        position,
      });

    if (insertError) {
      console.error("Waitlist insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to join waitlist" },
        { status: 500 }
      );
    }

    posthog.identify(distinctId, { email, userType });
    posthog.capture("waitlist_signup_success", {
      email,
      userType,
      position,
      ...(sessionId ? { $session_id: sessionId } : {}),
    });

    // Send confirmation email via Resend (non-blocking)
    const resend = getResendClient();
    if (resend) {
      const { subject, html } = getWaitlistConfirmationEmail({ position });
      const { error: emailError } = await resend.emails.send({
        from: "Better Stack 2 <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      });
      if (emailError) {
        console.error("[Resend] Failed to send waitlist confirmation email:", emailError);
      }
    } else {
      console.warn("[Resend] Skipping email - RESEND_API_KEY not configured");
    }

    return NextResponse.json(
      {
        success: true,
        message: "You're on the waitlist!",
        position,
      },
      { status: 201 }
    );
  } catch (error) {
    posthog.capture("waitlist_signup_error", {
      error: "internal_server_error",
    });
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}