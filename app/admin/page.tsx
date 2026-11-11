import Link from "next/link";
import { getDepositsCollection, DEPOSIT_STATUSES } from "@/lib/deposits";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

const statusLabels = {
  pending: "Pending",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
} as const;

export default async function AdminDashboardPage() {
  await requireAdmin();
  const deposits = await getDepositsCollection();
  const counts = await Promise.all(
    DEPOSIT_STATUSES.map(async (status) => [
      status,
      await deposits.countDocuments({ status }),
    ] as const)
  );
  const countByStatus = new Map(counts);

  return (
    <div className="page-enter space-y-7">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber-300">
          Administrator tools
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Admin dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage self-reported deposit claims. Status changes do not perform financial transactions.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {DEPOSIT_STATUSES.map((status) => (
          <div key={status} className="glass rounded-2xl p-5">
            <p className="text-xs text-slate-400">{statusLabels[status]}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{countByStatus.get(status) ?? 0}</p>
          </div>
        ))}
      </section>

      <Link
        href="/admin/deposits"
        className="inline-flex rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950"
      >
        Manage deposit submissions
      </Link>
    </div>
  );
}
