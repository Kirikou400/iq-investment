import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  findUserByEmail,
  verifyPassword,
  createSession,
  sanitizeUser,
} from "@/lib/auth-server";
import { isAdmin } from "@/lib/request-user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const sessionId = await createSession(user.id);
    const cookieStore = cookies();
    cookieStore.set("iq_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(body.rememberMe === false ? {} : { maxAge: 60 * 60 * 24 * 7 }),
    });

    return NextResponse.json({
      success: true,
      user: { ...sanitizeUser(user), isAdmin: isAdmin(user) },
    });
  } catch (error: unknown) {
    console.error("Sign in failed:", error);
    return NextResponse.json(
      { error: "Sign in is temporarily unavailable." },
      { status: 500 }
    );
  }
}
