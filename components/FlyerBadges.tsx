import React from "react";
import Link from "next/link";
import {
  Coins,
  ShieldCheck,
  TrendingUp,
  Target,
  Sprout,
  Handshake,
  Gem,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { BRAND_TAGLINES, HIGHLIGHT_CARDS } from "@/data/plans";

export function FlyerCoreFeatures() {
  const items = [
    {
      title: "HIGH RETURNS",
      subtitle: "Get more from your investment.",
      icon: TrendingUp,
      accent: "border-[#00E676]/40 text-[#00E676]",
    },
    {
      title: "SAFE & SECURE",
      subtitle: "Your funds are protected.",
      icon: ShieldCheck,
      accent: "border-[#00E676]/40 text-[#00E676]",
    },
    {
      title: "FLEXIBLE PLANS",
      subtitle: "Choose what works for you.",
      icon: Target,
      accent: "border-[#00E676]/40 text-[#00E676]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="group relative flex items-center gap-4 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-[#0b1d14] to-[#07130d] p-4 transition duration-300 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(0,230,118,0.2)]"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.25)]">
              <Icon size={24} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-wide text-white group-hover:text-[#00E676] transition-colors">
                {item.title}
              </h4>
              <p className="mt-0.5 text-xs text-slate-300">{item.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FlyerHighlightCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* STARTING AMOUNT CARD */}
      <div className="relative overflow-hidden rounded-[24px] border-2 border-amber-400/50 bg-gradient-to-br from-[#1b1c0e] via-[#12160d] to-[#080f0a] p-6 shadow-[0_0_30px_rgba(255,184,0,0.18)] transition duration-300 hover:border-amber-400">
        <div className="flex items-center gap-5">
          {/* Gold Coins Icon */}
          <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-amber-400/50 bg-gradient-to-br from-amber-400/20 to-yellow-500/10 text-amber-400 shadow-[0_0_20px_rgba(255,184,0,0.3)]">
            <Coins size={36} strokeWidth={1.8} />
          </div>

          <div>
            <span className="block text-xs font-black uppercase tracking-[0.16em] text-amber-300">
              {HIGHLIGHT_CARDS.startingAmount.label}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,184,0,0.3)]">
                {HIGHLIGHT_CARDS.startingAmount.amount}
              </span>
              <span className="text-xs font-bold text-amber-400">
                {HIGHLIGHT_CARDS.startingAmount.suffix}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {HIGHLIGHT_CARDS.startingAmount.note}
            </p>
          </div>
        </div>
      </div>

      {/* 10X ILLUSTRATIVE PROJECTION CARD */}
      <div className="relative overflow-hidden rounded-[24px] border-2 border-emerald-400/50 bg-gradient-to-br from-[#0c2417] via-[#091b11] to-[#050f09] p-6 shadow-[0_0_30px_rgba(0,230,118,0.18)] transition duration-300 hover:border-emerald-400">
        <div className="flex items-center gap-5">
          {/* Green Rising Chart Icon */}
          <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-emerald-400/50 bg-gradient-to-br from-emerald-400/20 to-green-500/10 text-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.3)]">
            <TrendingUp size={36} strokeWidth={2} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#00E676]">
              <Sparkles size={11} /> {HIGHLIGHT_CARDS.projection.badge}
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-white">
              <span className="text-amber-400">€3,500</span>{" "}
              <span className="text-[#00E676]">→</span>{" "}
              <span className="text-[#00E676] drop-shadow-[0_0_12px_rgba(0,230,118,0.4)]">
                €35,000
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {HIGHLIGHT_CARDS.projection.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlyerValuePillars() {
  const pillars = [
    { title: "GROW FASTER", icon: Sprout },
    { title: "BUILD WEALTH", icon: Handshake },
    { title: "TRUSTED SYSTEM", icon: Gem },
    { title: "INVEST SMART", icon: BarChart3 },
  ];

  return (
    <div className="rounded-[20px] border border-emerald-500/20 bg-gradient-to-r from-[#07150e] via-[#0c2217] to-[#07150e] p-3 sm:p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pillars.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`flex items-center justify-center gap-2.5 py-2 px-3 ${
                index !== 0 ? "sm:border-l sm:border-emerald-800/40" : ""
              }`}
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400/10 text-amber-400">
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <span className="text-xs font-black tracking-wider text-slate-100 uppercase">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FlyerBottomCapsule() {
  return (
    <div className="capsule-pill relative overflow-hidden rounded-full bg-gradient-to-r from-[#1c1809] via-[#241f0c] to-[#1c1809] px-6 py-4 text-center shadow-lg">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <span className="text-amber-400 text-sm font-black">✦</span>
        <p className="text-xs sm:text-sm font-black tracking-wide text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          {BRAND_TAGLINES.bottomPill}
        </p>
        <span className="text-amber-400 text-sm font-black">✦</span>
      </div>
    </div>
  );
}
