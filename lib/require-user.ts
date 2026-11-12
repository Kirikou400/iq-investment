import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserById, getSession } from "@/lib/auth-server";

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as any).digest === "string" &&
    (error as any).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function requireUser() {
  const token = cookies().get("iq_session")?.value;
  if (!token) {
    redirect("/signin");
  }

  try {
    const session = await getSession(token);
    if (!session) {
      redirect("/signin");
    }

    const user = await findUserById(session.userId);
    if (!user) {
      redirect("/signin");
    }

    return user;
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }
    console.error("requireUser failed:", error);
    redirect("/signin");
  }
}
