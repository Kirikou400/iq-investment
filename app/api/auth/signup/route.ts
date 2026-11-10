import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSession,
  createUser,
  isDuplicateEmailError,
  sanitizeUser,
} from "@/lib/auth-server";

export const runtime = "nodejs";
const allowedTiers = new Set(["TIER 1 Investor", "TIER 2 Investor"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, planTier } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Please provide your full legal name." }, { status: 400 });
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 12) {
      return NextResponse.json(
        { error: "Password must be at least 12 characters long." },
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

    const cookieStore = cookies();
    cookieStore.set("iq_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error: unknown) {
    if (isDuplicateEmailError(error)) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    console.error("Account registration failed:", error);
    return NextResponse.json(
      { error: "Account registration is temporarily unavailable." },
      { status: 500 }
    );
  }
}
