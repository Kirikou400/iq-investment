import { AdminDepositQueue } from "@/components/AdminDepositQueue";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export default async function AdminDepositsPage() {
  await requireAdmin();

  return (
    <div className="page-enter space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber-300">
          Administrator tools
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          Deposit review
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Review user-reported transfer claims. Decisions do not alter account balances.
        </p>
      </div>
      <AdminDepositQueue />
    </div>
  );
}
