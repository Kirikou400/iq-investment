import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("iq_session");

    if (sessionCookie?.value) {
      await deleteSession(sessionCookie.value).catch(() => {});
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("iq_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    try {
      cookieStore.delete("iq_session");
    } catch {}

    return response;
  } catch (error: unknown) {
    console.error("Sign out failed:", error);
    const response = NextResponse.json({ success: true });
    response.cookies.set("iq_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}
