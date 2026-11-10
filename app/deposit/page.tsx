import { ArrowDownToLine, Bitcoin, Building2, Coins } from "lucide-react";

export const runtime = "nodejs";

const paymentMethods = [
  {
    name: "Bank transfer",
    network: "Demo details only",
    icon: Building2,
    details: [
      ["Account name", "Demo Recipient"],
      ["IBAN", "PL00 0000 0000 0000 0000 0000 0000"],
      ["BIC / SWIFT", "DEMO PL XX"],
    ],
  },
  {
    name: "USDT",
    network: "TRC20 · demo address",
    icon: Coins,
    details: [["Wallet address", "TDEMO_USDT_ADDRESS_NOT_REAL"]],
  },
  {
    name: "Bitcoin (BTC)",
    network: "Bitcoin network · demo address",
    icon: Bitcoin,
    details: [["Wallet address", "bc1qdemoaddressnotreal"]],
  },
];

export default function DepositPage() {
  return (
    <div className="page-enter space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
          <ArrowDownToLine size={14} /> Official Deposit Desk
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
          Deposit Funds
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
          Choose a payment method to view its demo details.
        </p>
      </div>

      <section className="rounded-2xl border border-amber-400/20 bg-amber-950/15 p-4 text-xs leading-5 text-amber-100/80">
        Demo information only. No payments can be initiated or verified from this page. Replace
        these sample values with your own details when ready.
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {paymentMethods.map(({ name, network, icon: Icon, details }) => (
          <article key={name} className="glass rounded-[24px] border border-white/[.07] p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
                <Icon size={20} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">{name}</h2>
                <p className="mt-1 text-[10px] text-slate-500">{network}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {label}
                  </dt>
                  <dd className="mt-1 break-all rounded-lg border border-white/[.06] bg-black/10 px-3 py-2 font-mono text-xs text-slate-200">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
