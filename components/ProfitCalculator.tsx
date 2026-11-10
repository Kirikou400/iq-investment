"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Coins,
  Percent,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { calculateReturn, formatEuro } from "@/data/plans";

interface ProfitCalculatorProps {
  initialAmount?: number;
}

export function ProfitCalculator({ initialAmount = 3500 }: ProfitCalculatorProps) {
  const [amountStr, setAmountStr] = useState(String(initialAmount));
  const numericAmount = Math.max(0, Number(amountStr) || 0);

  const result = calculateReturn(numericAmount);

  const presets = [
    { label: "€3,500 (Min)", value: 3500, tier: "t1" },
    { label: "€5,000", value: 5000, tier: "t1" },
    { label: "€7,500", value: 7500, tier: "t1" },
    { label: "€9,000 (T1 Max)", value: 9000, tier: "t1" },
    { label: "€10,000 (T2 Entry)", value: 10000, tier: "t2" },
    { label: "€12,500", value: 12500, tier: "t2" },
    { label: "€15,000", value: 15000, tier: "t2" },
    { label: "€15,500 (T2 Max)", value: 15500, tier: "t2" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      {/* Input Section */}
      <section className="glass rounded-[24px] border border-emerald-500/20 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <Coins className="text-amber-400" size={20} />
              Investment Return Calculator
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Calculate your projected returns matching the IQ Investment Tier schedule.
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-[#00E676]">
            EUR (€)
          </span>
        </div>

        <div className="mt-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="label text-xs uppercase tracking-wider text-slate-300" htmlFor="calc-amount">
              Investment Amount (€)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-amber-400">
                €
              </span>
              <input
                id="calc-amount"
                type="number"
                min="0"
                step="500"
                className="field pl-10 text-xl font-bold tracking-tight text-white"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="3500"
              />
            </div>
            {numericAmount < 3500 && numericAmount > 0 && (
              <p className="mt-2 text-xs text-amber-400 flex items-center gap-1.5">
                <span>⚠</span> Minimum recommended starting tier is €3,500.
              </p>
            )}
          </div>

          {/* Quick Select Presets */}
          <div>
            <span className="label text-xs uppercase tracking-wider text-slate-400">
              Popular Schedule Presets
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {presets.map((p) => {
                const isActive = numericAmount === p.value;
                const isT1 = p.tier === "t1";
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setAmountStr(String(p.value))}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left ${
                      isActive
                        ? isT1
                          ? "border-amber-400 bg-amber-400 text-slate-950 shadow-md font-extrabold"
                          : "border-emerald-400 bg-[#00E676] text-slate-950 shadow-md font-extrabold"
                        : "border-emerald-900/40 bg-[#08150f] text-slate-300 hover:border-emerald-500/50 hover:bg-[#0f241a]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier Overview Pill */}
          <div className="rounded-2xl border border-white/10 bg-[#07130d] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned Plan:</span>
              <span
                className={`font-black text-sm px-2.5 py-0.5 rounded-full ${
                  result.tierId === "tier-2"
                    ? "bg-emerald-500/20 text-[#00E676] border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {result.tier}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Multiplier Effect:</span>
              <span className="font-extrabold text-white text-sm">
                {result.multiplier}x Initial Capital
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Scheduled Profit:</span>
              <span className="font-extrabold text-[#00E676] text-sm">
                +{formatEuro(result.profit)} ({result.roiPercent}%)
              </span>
            </div>
            {result.isExact && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1 border-t border-emerald-900/40">
                <CheckCircle2 size={13} />
                <span>Exact match with IQ Investment published schedule</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projection Results Card */}
      <section
        className={`relative overflow-hidden rounded-[24px] border-2 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
          result.tierId === "tier-2"
            ? "border-emerald-500/50 bg-gradient-to-br from-[#0c2a1b] via-[#091e13] to-[#05110a] shadow-[0_0_35px_rgba(0,230,118,0.18)]"
            : "border-amber-400/50 bg-gradient-to-br from-[#241e0a] via-[#161306] to-[#07120b] shadow-[0_0_35px_rgba(255,184,0,0.18)]"
        }`}
      >
        <div className="relative">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                result.tierId === "tier-2"
                  ? "bg-emerald-500/20 text-[#00E676]"
                  : "bg-amber-400/20 text-amber-300"
              }`}
            >
              <Sparkles size={14} /> Total Projected Return
            </span>
            <span className="text-xs text-slate-400">Based on IQ Tier Matrix</span>
          </div>

          {/* Big Return Value */}
          <div className="mt-6">
            <div className="text-xs uppercase tracking-widest text-slate-300 font-bold">
              Guaranteed Payout Estimate
            </div>
            <div className="mt-1 text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_15px_rgba(0,230,118,0.3)]">
              {formatEuro(result.returnAmount)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-black text-[#00E676]">
                +{formatEuro(result.profit)} Net Gain
              </span>
              <span className="text-xs text-slate-400">· {result.multiplier}x Multiplier</span>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-6 space-y-2.5 rounded-xl border border-white/10 bg-black/30 p-4 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Starting Capital</span>
              <span className="font-bold text-white">{formatEuro(result.investment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Projected Growth</span>
              <span className="font-bold text-[#00E676]">+{formatEuro(result.profit)}</span>
            </div>
            <div className="h-px bg-white/10 my-1" />
            <div className="flex justify-between font-black text-sm">
              <span className="text-amber-400">Total Return</span>
              <span className="text-white">{formatEuro(result.returnAmount)}</span>
            </div>
          </div>

          {/* 10x Illustrative Milestone Notice */}
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-[#00E676] mb-1">
              <TrendingUp size={14} />
              <span>10x Compounding Horizon</span>
            </div>
            <p className="leading-relaxed">
              At €3,500 initial base, an illustrative 10x trajectory projects{" "}
              <strong className="text-white">€35,000</strong>. Small steps lead to bigger returns.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <Link
            href={`/deposit?amount=${result.investment}&plan=${result.tierId === "tier-2" ? "Tier2" : "Tier1"}`}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black uppercase tracking-wider transition shadow-lg ${
              result.tierId === "tier-2"
                ? "bg-[#00E676] text-slate-950 hover:bg-emerald-300"
                : "bg-amber-400 text-slate-950 hover:bg-yellow-300"
            }`}
          >
            Start With {formatEuro(result.investment)} <ArrowRight size={16} />
          </Link>
          <p className="mt-2 text-center text-[10px] text-slate-400">
            Illustrative calculations matching published IQ Investment schedule.
          </p>
        </div>
      </section>
    </div>
  );
}
