import { Calculator } from "lucide-react";
import { ProfitCalculator } from "@/components/ProfitCalculator";
import {
  FlyerBottomCapsule,
  FlyerHighlightCards,
  FlyerValuePillars,
} from "@/components/FlyerBadges";

export default function CalculatorPage({
  searchParams,
}: {
  searchParams?: { amount?: string };
}) {
  const initialAmount = Number(searchParams?.amount) || 3500;

  return (
    <div className="page-enter space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#00E676]">
          <Calculator size={14} /> Interactive Estimator
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
          IQ Investment Return Calculator
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
          Simulate your returns against the official Tier 1 and Tier 2 matrix. Enter your capital or
          select a preset to see guaranteed return schedules and the 10x illustrative projection.
        </p>
      </div>

      {/* Main Interactive Calculator */}
      <ProfitCalculator initialAmount={initialAmount} />

      {/* 2 Highlight Cards from Flyer */}
      <FlyerHighlightCards />

      {/* 4 Value Pillars */}
      <FlyerValuePillars />

      {/* Flyer Slogan Capsule */}
      <FlyerBottomCapsule />
    </div>
  );
}
