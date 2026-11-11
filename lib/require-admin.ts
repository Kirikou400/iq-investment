import { redirect } from "next/navigation";
import { requireUser } from "@/lib/require-user";
import { isAdmin } from "@/lib/request-user";

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdmin(user)) {
    redirect("/dashboard");
  }
  return user;
}
