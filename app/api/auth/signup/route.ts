import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSession,
  createUser,
  formatAuthError,
  isDuplicateEmailError,
  sanitizeUser,
} from "@/lib/auth-server";
import { isAdmin } from "@/lib/request-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTiers = new Set(["TIER 1 Investor", "TIER 2 Investor"]);

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

    const { name, email, password, planTier } = body ?? {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Please provide your full legal name." },
        { status: 400 }
      );
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }
    if (password.length > 128) {
      return NextResponse.json(
        { error: "Password must not exceed 128 characters." },
        { status: 400 }
      );
    }

    if (typeof body.agreeTerms !== "boolean" || !body.agreeTerms) {
      return NextResponse.json(
        { error: "Please confirm that you agree to the terms before registering." },
        { status: 400 }
      );
    }

    const normalizedTier =
      typeof planTier === "string" && allowedTiers.has(planTier)
        ? planTier
        : "TIER 1 Investor";
    const user = await createUser(name, email, password, normalizedTier);
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
      maxAge: 60 * 60 * 24 * 7,
    };

    response.cookies.set("iq_session", sessionId, cookieOptions);

    try {
      cookies().set("iq_session", sessionId, cookieOptions);
    } catch {
      // Ignore if already set on response
    }

    return response;
  } catch (error: unknown) {
    if (isDuplicateEmailError(error)) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    console.error("Account registration failed:", error);
    const message = formatAuthError(
      error,
      "Account registration is temporarily unavailable. Please try again."
    );
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
