import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserById, getSession } from "@/lib/auth-server";

export async function requireUser() {
  const token = cookies().get("iq_session")?.value;
  if (!token) {
    redirect("/signin");
  }

  const session = await getSession(token);
  if (!session) {
    redirect("/signin");
  }

  const user = await findUserById(session.userId);
  if (!user) {
    redirect("/signin");
  }

  return user;
}
