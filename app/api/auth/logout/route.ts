import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/auth-server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("iq_session");

    if (sessionCookie?.value) {
      await deleteSession(sessionCookie.value);
    }

    cookieStore.delete("iq_session");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Sign out failed:", error);
    return NextResponse.json(
      { success: false, error: "Could not sign out. Please try again." },
      { status: 500 }
    );
  }
}
