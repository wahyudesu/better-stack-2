import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json() as { emailAddress?: unknown };
    const emailAddress = body.emailAddress;

    if (!emailAddress || typeof emailAddress !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Use Clerk's waitlist API
    const client = await clerkClient();
    const result = await client.waitlist.join({ emailAddress });

    if (result.error) {
      console.error("Clerk waitlist error:", result.error);
      return NextResponse.json(
        { error: result.error.longMessage || "Failed to join waitlist" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
