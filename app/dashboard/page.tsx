import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, ChartNoAxesCombined, Clock3 } from "lucide-react";
import { requireUser } from "@/lib/require-user";
import { getDepositsCollection } from "@/lib/deposits";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const user = await requireUser();
  const deposits = await getDepositsCollection();
  const [approvedClaimCount, recentDeposits] = await Promise.all([
    deposits.countDocuments({ userId: user.id, status: "approved" }),
    deposits.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

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
            This summary counts self-reported claims that an administrator has marked approved.
          </p>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Claims approved",
            value: String(approvedClaimCount),
            icon: ArrowDownToLine,
            note: "Review status only; not an account balance",
          },
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
            <h2 className="text-sm font-semibold">No investment ledger is connected</h2>
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
          <h2 className="text-sm font-semibold">Recent reported deposits</h2>
        </div>
        {recentDeposits.length === 0 ? (
          <p className="px-5 py-5 text-xs text-slate-500">No deposit claims submitted.</p>
        ) : (
          <div className="divide-y divide-white/[.07] px-5">
            {recentDeposits.map((deposit) => (
              <div key={deposit.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {new Intl.NumberFormat("en-IE", {
                      style: "currency",
                      currency: "EUR",
                    }).format(Number(deposit.amountEUR))}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {deposit.paymentMethod.replaceAll("_", " ")} · {new Date(deposit.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs font-bold uppercase ${
                  deposit.status === "approved"
                    ? "text-emerald-300"
                    : deposit.status === "rejected"
                      ? "text-red-300"
                      : "text-amber-300"
                }`}>
                  {deposit.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
