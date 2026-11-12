import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, findUserById, sanitizeUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/request-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("iq_session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }

    const session = await getSession(sessionCookie.value);
    if (!session) {
      const response = NextResponse.json({ user: null });
      response.cookies.delete("iq_session");
      try {
        cookieStore.delete("iq_session");
      } catch {}
      return response;
    }

    const user = await findUserById(session.userId);
    if (!user) {
      const response = NextResponse.json({ user: null });
      response.cookies.delete("iq_session");
      try {
        cookieStore.delete("iq_session");
      } catch {}
      return response;
    }

    return NextResponse.json({
      user: { ...sanitizeUser(user), isAdmin: isAdmin(user) },
    });
  } catch (error: unknown) {
    console.error("Session lookup failed:", error);
    return NextResponse.json({ user: null });
  }
}
