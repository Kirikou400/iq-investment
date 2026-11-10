import Link from "next/link";
import { ArrowUpRight, Check, Sparkles, TrendingUp } from "lucide-react";
import type { InvestmentPlan } from "@/types";
import { formatEuro } from "@/data/plans";

export function PlanCard({ plan }: { plan: InvestmentPlan }) {
  const isTier2 = plan.tierId === "tier-2";

  return (
    <article
      className={`glass group relative flex flex-col justify-between overflow-hidden rounded-[24px] p-6 transition duration-300 hover:-translate-y-1.5 ${
        isTier2
          ? "border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(0,230,118,0.25)]"
          : "border-amber-400/40 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(255,184,0,0.25)]"
      } ${plan.featured ? "ring-2 ring-[#00E676] bg-gradient-to-b from-[#0c2417] to-[#07130d]" : ""}`}
    >
      {plan.featured && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-[#00E676] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md">
          Featured Plan
        </div>
      )}

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${plan.accent} text-base font-black text-slate-950 shadow-lg`}
          >
            {isTier2 ? "T2" : "T1"}
          </div>
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                isTier2 ? "text-[#00E676]" : "text-amber-400"
              }`}
            >
              {isTier2 ? "Tier 2 Accelerator" : "Tier 1 Foundation"}
            </span>
            <h3 className="text-base font-black text-white">{plan.name}</h3>
          </div>
        </div>

        <p className="min-h-10 text-xs leading-relaxed text-slate-300">{plan.description}</p>

        <div className="my-5 border-y border-white/[.08] py-4 bg-black/20 -mx-6 px-6">
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Scheduled Payout</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black tracking-tight text-white">
              {formatEuro(plan.exampleReturn)}
            </span>
            <span className={`text-xs font-black ${isTier2 ? "text-[#00E676]" : "text-amber-400"}`}>
              +{plan.roi}% ROI
            </span>
          </div>
        </div>

        <ul className="mb-6 space-y-2.5 text-xs text-slate-300">
          <li className="flex items-center justify-between">
            <span className="text-slate-400">Entry capital</span>
            <b className="font-extrabold text-white">{formatEuro(plan.minDeposit)}</b>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-slate-400">Target multiplier</span>
            <b className={`font-extrabold ${isTier2 ? "text-[#00E676]" : "text-amber-400"}`}>
              {(plan.exampleReturn / plan.minDeposit).toFixed(2)}x
            </b>
          </li>
          <li className="flex items-center gap-2 text-slate-300 pt-1">
            <Check size={14} className="text-[#00E676] shrink-0" />
            <span>Structured scheduled returns</span>
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <Check size={14} className="text-[#00E676] shrink-0" />
            <span>Priority processing</span>
          </li>
        </ul>
      </div>

      <Link
        href={`/deposit?plan=${isTier2 ? "Tier2" : "Tier1"}&amount=${plan.minDeposit}`}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-wider transition shadow-md ${
          plan.featured
            ? "bg-[#00E676] text-slate-950 hover:bg-emerald-300"
            : isTier2
            ? "border border-emerald-400/50 bg-emerald-500/10 text-emerald-300 hover:bg-[#00E676] hover:text-slate-950"
            : "border border-amber-400/50 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-slate-950"
        }`}
      >
        Choose Plan <ArrowUpRight size={15} />
      </Link>
    </article>
  );
}
