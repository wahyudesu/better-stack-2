import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ count: null }, { status: 200 });
  }

  try {
    let total = 0;
    let offset = 0;
    const limit = 500;

    while (true) {
      const res = await fetch(
        `https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Clerk API error: ${res.status}`);
      }

      const users = await res.json();
      if (!Array.isArray(users) || users.length === 0) break;

      total += users.length;
      if (users.length < limit) break;
      offset += limit;
    }

    return NextResponse.json({ count: total }, { status: 200 });
  } catch (error) {
    console.error("User count error:", error);
    return NextResponse.json({ count: null }, { status: 200 });
  }
}