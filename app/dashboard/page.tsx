import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, ChartNoAxesCombined, Clock3 } from "lucide-react";
import { requireUser } from "@/lib/require-user";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="page-enter space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-emerald-400">
            Investor portfolio
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
            Welcome, {user.name}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            This summary includes only deposits an administrator has verified and recorded.
          </p>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Confirmed deposits", value: "Not available", icon: ArrowDownToLine, note: "Deposit API is not connected" },
          { label: "Active investments", value: "Not available", icon: ChartNoAxesCombined, note: "Investment activation is not connected" },
          { label: "Total profit", value: "Not available", icon: Clock3, note: "No profit ledger is connected" },
          { label: "Available balance", value: "Not available", icon: ArrowUpFromLine, note: "Payout ledger is not connected" },
        ].map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{label}</span>
              <Icon size={17} className="text-slate-500" />
            </div>
            <div className="mt-4 text-xl font-semibold text-slate-200">{value}</div>
            <p className="mt-1 text-[10px] text-slate-500">{note}</p>
          </div>
        ))}
      </section>

      {user.emailVerified === false && (
        <section className="rounded-2xl border border-amber-400/20 bg-amber-950/15 p-4 text-xs leading-5 text-amber-100/80">
          Your email address has not been verified.
        </section>
      )}

      <section className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Clock3 size={19} className="mt-0.5 shrink-0 text-amber-300" />
          <div>
            <h2 className="text-sm font-semibold">No verified portfolio activity</h2>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-400">
              Deposits, investment allocations, profit, and withdrawal balances are not yet
              connected to a verified transaction ledger. No sample transactions or balances are
              shown as account activity.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/deposit"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-amber-300/30"
              >
                <ArrowDownToLine size={15} /> Deposit status
              </Link>
              <Link
                href="/withdrawal"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-amber-300/30"
              >
                <ArrowUpFromLine size={15} /> Withdrawal status
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="glass overflow-hidden rounded-2xl">
        <div className="border-b border-white/[.07] px-5 py-4">
          <h2 className="text-sm font-semibold">Recent activity</h2>
        </div>
        <p className="px-5 py-5 text-xs text-slate-500">No transaction API is connected.</p>
      </section>
    </div>
  );
}
