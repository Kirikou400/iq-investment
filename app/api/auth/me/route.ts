import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, findUserById, sanitizeUser } from "@/lib/auth-server";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("iq_session");

  if (!sessionCookie?.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const session = await getSession(sessionCookie.value);
    if (!session) {
      cookieStore.delete("iq_session");
      return NextResponse.json({ user: null });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      cookieStore.delete("iq_session");
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: sanitizeUser(user),
    });
  } catch (error: unknown) {
    console.error("Session lookup failed:", error);
    return NextResponse.json(
      { error: "Could not verify the current session." },
      { status: 500 }
    );
  }
}
