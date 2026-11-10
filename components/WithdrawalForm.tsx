import { AlertCircle, Wallet } from "lucide-react";

export function WithdrawalForm() {
  return (
    <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
      <section className="glass rounded-2xl p-6 sm:p-7">
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
          <Wallet size={19} />
        </div>
        <h2 className="text-sm font-semibold">Balance unavailable</h2>
        <p className="mt-2 text-xs leading-6 text-slate-400">
          A verified account ledger has not been connected, so there is no withdrawable balance to
          display.
        </p>
      </section>
      <section className="glass rounded-2xl p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <AlertCircle size={19} className="mt-0.5 shrink-0 text-amber-300" />
          <div>
            <h2 className="text-sm font-semibold">Payouts are not available yet</h2>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              No withdrawal request or transfer can be submitted. A payout provider and ledger
              controls must be configured before this feature can accept withdrawal instructions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
