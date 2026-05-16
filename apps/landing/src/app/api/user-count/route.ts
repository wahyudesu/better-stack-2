import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 60;

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Waitlist count error:", error);
      return NextResponse.json({ count: null }, { status: 200 });
    }

    return NextResponse.json({ count: count ?? 0 }, { status: 200 });
  } catch (error) {
    console.error("User count error:", error);
    return NextResponse.json({ count: null }, { status: 200 });
  }
}