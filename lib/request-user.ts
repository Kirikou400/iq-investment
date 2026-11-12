import { cookies } from "next/headers";
import { findUserById, getSession, type StoredUser } from "@/lib/auth-server";

export async function getRequestUser(): Promise<StoredUser | null> {
  try {
    const token = cookies().get("iq_session")?.value;
    if (!token) {
      return null;
    }

    const session = await getSession(token);
    if (!session) {
      return null;
    }

    return (await findUserById(session.userId)) ?? null;
  } catch (error) {
    console.error("getRequestUser failed:", error);
    return null;
  }
}

export function isAdmin(user: StoredUser | null | undefined): boolean {
  if (!user?.email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(user.email.toLowerCase());
}
