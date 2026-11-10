import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { IqLogo } from "@/components/IqLogo";
import { TierTables } from "@/components/TierTables";
import {
  FlyerBottomCapsule,
  FlyerCoreFeatures,
  FlyerHighlightCards,
  FlyerValuePillars,
} from "@/components/FlyerBadges";
import { ProfitCalculator } from "@/components/ProfitCalculator";
import { BRAND_TAGLINES, HIGHLIGHT_CARDS, formatEuro } from "@/data/plans";

const stats = [
  {
    label: "Total Capital Managed",
    value: "€42.8M",
    change: "+18.4%",
    icon: Coins,
  },
  {
    label: "Active Plan Investors",
    value: "14,820+",
    change: "+12.2%",
    icon: Wallet,
  },
  {
    label: "Scheduled Returns Paid",
    value: "€98.4M",
    change: "+29.5%",
    icon: TrendingUp,
  },
];

export default function HomePage() {
  return (
    <div className="page-enter space-y-12 sm:space-y-16">
      {/* HERO SECTION MATCHING FLYER IDENTITY */}
      <section className="relative overflow-hidden rounded-[32px] border-2 border-emerald-500/25 bg-gradient-to-br from-[#0c2217] via-[#07160f] to-[#040d08] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* Ambient Glowing Orbs */}
        <div className="glow-ambient absolute -right-20 -top-20 h-96 w-96 rounded-full bg-amber-400/[0.12] blur-[100px]" />
        <div className="glow-ambient absolute -bottom-20 left-10 h-80 w-80 rounded-full bg-[#00E676]/[0.12] blur-[100px]" />

        <div className="relative">
          {/* Top Header Row with Logo & Small Steps Badge */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-900/40 pb-8">
            <IqLogo size="lg" showTagline={false} />

            <div className="flex items-center gap-3">
              {/* Flyer Top-Right Badge: SMALL STEPS, BIGGER RETURNS */}
              <div className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-r from-emerald-950/70 to-[#082014] px-4 py-2.5 shadow-[0_0_20px_rgba(0,230,118,0.25)]">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#00E676] text-slate-950 font-black">
                  <TrendingUp size={18} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-white">
                    SMALL STEPS,
                  </span>
                  <span className="block text-xs font-black uppercase tracking-wider text-[#00E676]">
                    BIGGER RETURNS!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
                <Sparkles size={14} className="text-amber-400" />
                <span>{BRAND_TAGLINES.sub}</span>
              </div>

              <h1 className="text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
                Grow Your Wealth With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_2px_12px_rgba(255,184,0,0.3)]">
                  IQ Investment Plans.
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300">
                Start with as little as{" "}
                <strong className="text-amber-400 font-extrabold">€3,500</strong> and unlock
                structured, transparent returns up to{" "}
                <strong className="text-[#00E676] font-extrabold">€41,000+</strong> across Tier 1
                and Tier 2 schedules.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link
                  href="/deposit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:from-yellow-300 hover:to-amber-400 shadow-[0_0_20px_rgba(255,184,0,0.3)]"
                >
                  Start Investing (€3,500+) <ArrowRight size={16} />
                </Link>
                <Link
                  href="/calculator"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-950/30 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-900/40 hover:border-emerald-400 transition"
                >
                  Calculate Your Return <ArrowUpRight size={16} className="text-[#00E676]" />
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck size={18} className="text-[#00E676]" />
                <span>Protected capital allocation · Verified scheduled returns</span>
              </div>
            </div>

            {/* Quick Hero Floating Flyer Preview Card */}
            <div className="relative mx-auto hidden w-full max-w-[380px] lg:block">
              <div className="float relative rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#0e271a] to-[#07150e] p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      Tier 1 Highlights
                    </span>
                    <div className="text-2xl font-black text-white">€3,500 ➔ €9,000</div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-[#00E676]">
                    <Zap size={22} />
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Tier 2 Accelerator</span>
                    <strong className="text-[#00E676]">€10,000 ➔ €30,000</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>10x Compounding Horizon</span>
                    <strong className="text-amber-400">€3,500 ➔ €35,000</strong>
                  </div>
                </div>

                {/* SVG Visual Sparkline */}
                <svg
                  className="mt-5 h-24 w-full"
                  viewBox="0 0 320 100"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-label="IQ Investment Growth Path"
                >
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00E676" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#00E676" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 80C30 75 50 68 80 50C110 32 140 45 170 30C200 15 230 25 260 12C290 -1 305 6 320 2V100H0V80Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M0 80C30 75 50 68 80 50C110 32 140 45 170 30C200 15 230 25 260 12C290 -1 305 6 320 2"
                    stroke="#00E676"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="mt-4 text-center">
                  <Link
                    href="/investments"
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 hover:text-yellow-300"
                  >
                    View Full Flyer Schedule ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS OVERVIEW IN EUR */}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <div
            key={label}
            className="glass flex items-center gap-4 rounded-2xl border border-emerald-500/20 p-5 shadow-lg"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-400/10 text-amber-400">
              <Icon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{value}</span>
                <span className="text-xs font-bold text-[#00E676]">{change}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CORE 3 FEATURE BADGES FROM THE FLYER */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#00E676]">
            Why Investors Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Proven Performance & Reliability
          </h2>
        </div>
        <FlyerCoreFeatures />
      </section>

      {/* THE 2 HIGHLIGHT CARDS FROM THE FLYER */}
      <section>
        <FlyerHighlightCards />
      </section>

      {/* THE OFFICIAL TIER 1 & TIER 2 FLYER SCHEDULE TABLES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
              <Sparkles size={14} /> Official Payout Schedule
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Explore TIER 1 & TIER 2 Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Transparent, guaranteed return milestones directly matching the IQ Investment
              published plan. Click any row to calculate or invest.
            </p>
          </div>

          <Link
            href="/calculator"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-yellow-300"
          >
            Open Interactive Calculator <ArrowRight size={14} />
          </Link>
        </div>

        {/* Both Tables Side-by-Side */}
        <TierTables showActionButtons={true} />
      </section>

      {/* INTERACTIVE PROFIT CALCULATOR SECTION */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#00E676]">
            Simulation & Projections
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Calculate Your IQ Investment Payout
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Type any amount or choose a preset to check exact tier returns.
          </p>
        </div>
        <ProfitCalculator initialAmount={3500} />
      </section>

      {/* 4 VALUE PILLARS (GROW FASTER, BUILD WEALTH, TRUSTED SYSTEM, INVEST SMART) */}
      <section>
        <FlyerValuePillars />
      </section>

      {/* BOTTOM SLOGAN CAPSULE FROM THE FLYER */}
      <section>
        <FlyerBottomCapsule />
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col justify-between gap-4 border-t border-emerald-900/30 py-8 text-xs text-slate-400 sm:flex-row">
        <div className="flex items-center gap-2">
          <IqLogo size="sm" />
          <span>© 2026 IQ Investment. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span>Invest Today, Grow Tomorrow!</span>
          <span>·</span>
          <span>Capital involves market risk. Terms apply.</span>
        </div>
      </footer>
    </div>
  );
}
