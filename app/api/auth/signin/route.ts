import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  findUserByEmail,
  verifyPassword,
  createSession,
  formatAuthError,
  sanitizeUser,
} from "@/lib/auth-server";
import { isAdmin } from "@/lib/request-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { email, password } = body ?? {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password ||
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
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const sessionId = await createSession(user.id);
    const response = NextResponse.json({
      success: true,
      user: { ...sanitizeUser(user), isAdmin: isAdmin(user) },
    });

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax" as const,
      path: "/",
      ...(body.rememberMe === false ? {} : { maxAge: 60 * 60 * 24 * 7 }),
    };

    response.cookies.set("iq_session", sessionId, cookieOptions);

    try {
      cookies().set("iq_session", sessionId, cookieOptions);
    } catch {
      // Ignore if already set on response
    }

    return response;
  } catch (error: unknown) {
    console.error("Sign in failed:", error);
    const message = formatAuthError(
      error,
      "Sign in is temporarily unavailable. Please try again."
    );
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
