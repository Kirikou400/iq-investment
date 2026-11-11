import Link from "next/link";
import { DepositHistory } from "@/components/DepositHistory";
import { requireUser } from "@/lib/require-user";

export const runtime = "nodejs";

export default async function DepositHistoryPage() {
  await requireUser();

  return (
    <div className="page-enter space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-400">
          Account activity
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Deposit history</h1>
        <p className="mt-2 text-sm text-slate-400">
          These are self-reported claims and their review statuses, not credited funds or balances.
        </p>
      </header>
      <DepositHistory />
      <Link href="/deposit" className="inline-block text-sm font-semibold text-amber-300 underline">
        Report another transfer
      </Link>
    </div>
  );
}
