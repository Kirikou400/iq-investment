"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Sparkles, TrendingUp, Zap } from "lucide-react";
import { TIER_1_ROWS, TIER_2_ROWS, formatEuro } from "@/data/plans";
import type { TierRow } from "@/types";

interface TierTablesProps {
  onSelectRow?: (row: TierRow, tierName: string) => void;
  selectedAmount?: number;
  showActionButtons?: boolean;
}

export function TierTables({
  onSelectRow,
  selectedAmount,
  showActionButtons = true,
}: TierTablesProps) {
  const [activeTab, setActiveTab] = useState<"all" | "tier1" | "tier2">("all");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* Mobile Tab Switcher */}
      <div className="flex justify-center md:hidden">
        <div className="inline-flex rounded-xl border border-white/10 bg-[#091510] p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-4 py-2 font-semibold transition ${
              activeTab === "all"
                ? "bg-gold text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Both Tiers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tier1")}
            className={`rounded-lg px-4 py-2 font-semibold transition ${
              activeTab === "tier1"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            TIER 1 (€3.5k - €9k)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tier2")}
            className={`rounded-lg px-4 py-2 font-semibold transition ${
              activeTab === "tier2"
                ? "bg-emerald-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            TIER 2 (€10k - €15.5k)
          </button>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* TIER 1 TABLE (GOLD/YELLOW ACCENT) */}
        {(activeTab === "all" || activeTab === "tier1") && (
          <div className="tier1-frame relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#0e1d15] to-[#07130d] p-3 sm:p-5 shadow-2xl transition duration-300 hover:border-amber-400">
            {/* Top Badge: TIER 1 */}
            <div className="mb-4 text-center">
              <div className="inline-block rounded-full border-2 border-[#FFB800] bg-gradient-to-r from-[#173022] via-[#21432f] to-[#173022] px-8 py-2 shadow-[0_0_20px_rgba(255,184,0,0.35)]">
                <span className="text-2xl font-black tracking-wider text-white sm:text-3xl">
                  TIER 1
                </span>
              </div>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-widest text-[#FFB800]">
                Accessible Entry · Consistent Multiplication
              </p>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-[#091510]">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FFB800] via-[#FFC72C] to-[#E5A500] text-slate-950">
                    <th className="py-3 px-3 text-xs sm:text-sm font-black tracking-wide border-r border-amber-600/30">
                      INVESTMENT (€)
                    </th>
                    <th className="py-3 px-3 text-xs sm:text-sm font-black tracking-wide">
                      RETURN (€)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/30 text-xs sm:text-sm font-bold">
                  {TIER_1_ROWS.map((row, idx) => {
                    const isSelected = selectedAmount === row.investment;
                    const isHovered = hoveredRow === row.investment;
                    return (
                      <tr
                        key={row.investment}
                        onMouseEnter={() => setHoveredRow(row.investment)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => onSelectRow?.(row, "TIER 1")}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? "bg-amber-500/25 text-white ring-1 ring-amber-400"
                            : idx % 2 === 0
                            ? "bg-[#0c1c14] text-slate-100 hover:bg-[#152e20]"
                            : "bg-[#08150f] text-slate-200 hover:bg-[#152e20]"
                        }`}
                      >
                        <td className="py-2.5 px-3 font-extrabold text-[#00E676] border-r border-emerald-900/40">
                          {formatEuro(row.investment)}
                        </td>
                        <td className="py-2.5 px-3 font-black text-white">
                          <div className="flex items-center justify-center gap-2">
                            <span>{formatEuro(row.returnAmount)}</span>
                            {isHovered && (
                              <span className="hidden rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-[#00E676] sm:inline">
                                +{formatEuro(row.profit)}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Tier 1 Quick Actions */}
            {showActionButtons && (
              <div className="mt-4 flex items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-400">
                  Entry: <span className="font-bold text-amber-400">€3,500</span> · Up to{" "}
                  <span className="font-bold text-white">€20,000</span>
                </div>
                <Link
                  href="/deposit?plan=Tier1"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FFB800] to-yellow-500 px-4 py-2 text-xs font-black text-slate-950 transition hover:from-yellow-300 hover:to-amber-400 shadow-md"
                >
                  Invest Tier 1 <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TIER 2 TABLE (GREEN ACCENT) */}
        {(activeTab === "all" || activeTab === "tier2") && (
          <div className="tier2-frame relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#0b2417] to-[#05130b] p-3 sm:p-5 shadow-2xl transition duration-300 hover:border-emerald-400">
            {/* Top Badge: TIER 2 */}
            <div className="mb-4 text-center">
              <div className="inline-block rounded-full border-2 border-[#00E676] bg-gradient-to-r from-[#123923] via-[#1b5032] to-[#123923] px-8 py-2 shadow-[0_0_20px_rgba(0,230,118,0.35)]">
                <span className="text-2xl font-black tracking-wider text-white sm:text-3xl">
                  TIER 2
                </span>
              </div>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-widest text-[#00E676]">
                Premier High Growth · Up to 3.0x Return
              </p>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-xl border border-emerald-500/30 bg-[#091510]">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#00E676] via-[#10B981] to-[#00C853] text-slate-950">
                    <th className="py-3 px-3 text-xs sm:text-sm font-black tracking-wide border-r border-emerald-700/30">
                      INVESTMENT (€)
                    </th>
                    <th className="py-3 px-3 text-xs sm:text-sm font-black tracking-wide">
                      RETURN (€)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/30 text-xs sm:text-sm font-bold">
                  {TIER_2_ROWS.map((row, idx) => {
                    const isSelected = selectedAmount === row.investment;
                    const isHovered = hoveredRow === row.investment;
                    return (
                      <tr
                        key={row.investment}
                        onMouseEnter={() => setHoveredRow(row.investment)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => onSelectRow?.(row, "TIER 2")}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? "bg-emerald-500/25 text-white ring-1 ring-emerald-400"
                            : idx % 2 === 0
                            ? "bg-[#0d2217] text-slate-100 hover:bg-[#163a27]"
                            : "bg-[#091710] text-slate-200 hover:bg-[#163a27]"
                        }`}
                      >
                        <td className="py-2.5 px-3 font-extrabold text-[#00E676] border-r border-emerald-900/40">
                          {formatEuro(row.investment)}
                        </td>
                        <td className="py-2.5 px-3 font-black text-white">
                          <div className="flex items-center justify-center gap-2">
                            <span>{formatEuro(row.returnAmount)}</span>
                            {isHovered && (
                              <span className="hidden rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-[#00E676] sm:inline">
                                +{formatEuro(row.profit)}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Tier 2 Quick Actions */}
            {showActionButtons && (
              <div className="mt-4 flex items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-400">
                  Entry: <span className="font-bold text-[#00E676]">€10,000</span> · Up to{" "}
                  <span className="font-bold text-white">€41,000+</span>
                </div>
                <Link
                  href="/deposit?plan=Tier2"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00E676] to-emerald-500 px-4 py-2 text-xs font-black text-slate-950 transition hover:from-emerald-300 hover:to-emerald-400 shadow-md"
                >
                  Invest Tier 2 <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
