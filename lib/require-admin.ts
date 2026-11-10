import { notFound } from "next/navigation";
import { requireUser } from "@/lib/require-user";
import { isAdmin } from "@/lib/request-user";

export async function requireAdmin() {
  const user = await requireUser();
  if (!process.env.ADMIN_EMAILS || !isAdmin(user)) {
    notFound();
  }
  return user;
}
