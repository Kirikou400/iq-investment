import { ArrowDownToLine, Bitcoin, Building2, Coins } from "lucide-react";
import { DepositSubmission } from "@/components/DepositSubmission";
import Link from "next/link";

export const runtime = "nodejs";

const paymentMethods = [
  {
    method: "Bank transfer",
    name: "Clear Junction Limited",
    icon: Building2,
    details: [
      ["Account name", "Emmanuel Bassey"],
      ["Account Number", "63658507"],
      ["BIC / SWIFT", "CLJUGB21XXX"],
      ["IBAN", "GB58CLJU04130763658507"],
    ],
  },
  {
    name: "USDT",
    network: "TRC20",
    icon: Coins,
    details: [["Wallet address", "THEo5YrgsZBmv6i2oLqdsaC1htPRHjYPJZ"]],
  },
  {
    name: "Bitcoin (BTC)",
    network: "Bitcoin network",
    icon: Bitcoin,
    details: [["Wallet address", "bc1q7gmu2hrev4mwt5ule6tnrnq5kjc7xhju5c2xsx"]],
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
          Read the payment instructions carefully, then report a transfer you have already made.
        </p>
      </div>

      <section className="rounded-2xl border border-amber-400/20 bg-amber-950/15 p-4 text-xs leading-5 text-amber-100/80">
        Confirm payment instructions with the organization through a trusted, independent channel
        before sending funds. A submitted record is only a self-reported claim and is not proof of
        payment, a promise of returns, or a balance credit.
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

      <DepositSubmission />
      <Link href="/deposit/history" className="inline-block text-sm font-semibold text-amber-300 underline">
        View your deposit history
      </Link>
    </div>
  );
}
