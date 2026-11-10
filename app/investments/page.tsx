"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Coins, HelpCircle, Layers, Sparkles, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { TierTables } from "@/components/TierTables";
import { PlanCard } from "@/components/PlanCard";
import {
  FlyerBottomCapsule,
  FlyerCoreFeatures,
  FlyerHighlightCards,
  FlyerValuePillars,
} from "@/components/FlyerBadges";
import { plans, formatEuro, INVESTMENT_TIERS } from "@/data/plans";
import type { TierRow } from "@/types";

export default function InvestmentsPage() {
  const [selectedRow, setSelectedRow] = useState<TierRow | null>(null);
  const [selectedTierName, setSelectedTierName] = useState<string>("");

  const handleSelectRow = (row: TierRow, tierName: string) => {
    setSelectedRow(row);
    setSelectedTierName(tierName);
  };

  return (
    <div className="page-enter space-y-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#00E676]">
          <Layers size={14} /> Official Investment Schedule
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
          IQ Investment Tiers & Plans
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
          Review our structured Tier 1 and Tier 2 plans. Every entry is calibrated with transparent
          multiplier payouts directly from the IQ Investment matrix.
        </p>
      </div>

      {/* Selected Row Notification Banner */}
      {selectedRow && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-emerald-400 bg-emerald-950/80 p-5 shadow-[0_0_30px_rgba(0,230,118,0.3)] animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#00E676] text-slate-950 font-black">
              ✓
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-400">
                Selected: {selectedTierName}
              </span>
              <div className="text-lg font-black text-white">
                Deposit {formatEuro(selectedRow.investment)} ➔ Return of{" "}
                <span className="text-[#00E676]">{formatEuro(selectedRow.returnAmount)}</span>
              </div>
              <p className="text-xs text-slate-300">
                Net gain: +{formatEuro(selectedRow.profit)} ({selectedRow.multiplier}x return)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/calculator?amount=${selectedRow.investment}`}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              Analyze in Calculator
            </Link>
            <Link
              href={`/deposit?plan=${selectedTierName === "TIER 2" ? "Tier2" : "Tier1"}&amount=${selectedRow.investment}`}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md transition hover:from-yellow-300 hover:to-amber-400"
            >
              Deposit {formatEuro(selectedRow.investment)}
            </Link>
          </div>
        </div>
      )}

      {/* The 2 Flyer Highlight Cards */}
      <FlyerHighlightCards />

      {/* Side-by-Side Tables Direct from Flyer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Full Tier Payout Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any row to preview or initiate your investment.
            </p>
          </div>
          <span className="text-xs text-amber-400 font-bold hidden sm:inline">
            Click row to select
          </span>
        </div>

        <TierTables
          onSelectRow={handleSelectRow}
          selectedAmount={selectedRow?.investment}
          showActionButtons={true}
        />
      </section>

      {/* The 3 Core Features */}
      <section className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-widest text-[#00E676]">
            Guaranteed Standards
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Built Around Security & Predictability
          </h2>
        </div>
        <FlyerCoreFeatures />
      </section>

      {/* Curated Plan Cards */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">
            Quick Packages
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Popular Investment Packages
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pre-packaged entry tiers configured for swift allocation.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      {/* Tier Comparison Breakdown */}
      <section className="glass rounded-[28px] border border-emerald-500/20 p-6 sm:p-8">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <HelpCircle size={20} className="text-amber-400" />
          Comparing Tier 1 vs Tier 2
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-400/30 bg-[#16170d] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-amber-400">TIER 1 (Foundation)</h3>
              <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-black text-amber-300">
                €3,500 – €9,000
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ideal for new investors entering the IQ ecosystem. Low entry barrier, steady returns
              scaling from €9,000 up to €20,000.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-amber-400/20">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00E676]" />
                <span>Base entry: €3,500 yielding €9,000</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00E676]" />
                <span>Every +€500 adds +€1,000 in scheduled returns</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00E676]" />
                <span>Protected capital allocation with structured exits</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-[#0c2417] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#00E676]">TIER 2 (Accelerator)</h3>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-[#00E676]">
                €10,000 – €15,500+
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed for serious wealth building. High multiplier returns starting at €30,000 on a
              €10,000 investment up to €41,000+.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-emerald-500/20">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00E676]" />
                <span>Entry: €10,000 yielding €30,000 (3.0x multiplier)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00E676]" />
                <span>Every +€500 yields +€1,000 scaling to €41,000+</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00E676]" />
                <span>Priority withdrawal routing & dedicated advisor support</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4 Value Pillars */}
      <FlyerValuePillars />

      {/* Flyer Slogan Capsule */}
      <FlyerBottomCapsule />
    </div>
  );
}
