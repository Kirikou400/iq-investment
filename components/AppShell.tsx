"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Calculator,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Layers,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { IqLogo } from "@/components/IqLogo";
import { BRAND_TAGLINES } from "@/data/plans";
import { useAuth } from "@/context/AuthContext";

const navigation: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Investment Tiers", href: "/investments", icon: Layers },
  { label: "Profit Calculator", href: "/calculator", icon: Calculator },
  { label: "Deposit Funds", href: "/deposit", icon: ArrowDownToLine },
  { label: "Withdraw Returns", href: "/withdrawal", icon: ArrowUpFromLine },
  { label: "Investor Dashboard", href: "/dashboard", icon: Activity },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const visibleNavigation = [
    ...navigation,
    ...(isAuthenticated
      ? [{ label: "My Deposits", href: "/deposit/history", icon: ArrowDownToLine }]
      : []),
    ...(user?.isAdmin
      ? [{ label: "Admin Dashboard", href: "/admin", icon: ShieldCheck }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#060e0a]">
      {/* Mobile Backdrop */}
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-emerald-900/30 bg-[#08150f] px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <Link
          href="/"
          className="mb-8 flex items-center px-1 group"
          onClick={() => setOpen(false)}
        >
          <IqLogo size="sm" />
        </Link>

        {/* Small Steps Badge */}
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-[#071910] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#00E676]">
            <TrendingUp size={13} />
            <span>{BRAND_TAGLINES.badge}</span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-amber-400">
            {BRAND_TAGLINES.sub}
          </p>
        </div>

        <div className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          Navigation
        </div>

        <nav className="space-y-1.5">
          {visibleNavigation.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-emerald-500/20 to-amber-500/10 text-white border-l-4 border-[#00E676] shadow-sm"
                    : "text-slate-300 hover:bg-emerald-950/40 hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-[#00E676]" : "text-slate-400"}
                  strokeWidth={2}
                />
                <span>{label}</span>
                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Quick Links in Sidebar */}
        <div className="mt-4 pt-4 border-t border-emerald-900/30 space-y-1">
          <div className="px-3 mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Account Access
          </div>
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              pathname === "/signin"
                ? "bg-amber-400/20 text-amber-300 font-bold"
                : "text-slate-400 hover:bg-emerald-950/40 hover:text-white"
            }`}
          >
            <LogIn size={16} className="text-amber-400" />
            <span>Sign In</span>
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              pathname === "/signup"
                ? "bg-emerald-500/20 text-[#00E676] font-bold"
                : "text-slate-400 hover:bg-emerald-950/40 hover:text-white"
            }`}
          >
            <UserPlus size={16} className="text-[#00E676]" />
            <span>Create Account</span>
          </Link>
        </div>

        {/* User Account / Sign Out Section */}
        <div className="mt-auto space-y-3 pt-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex w-full items-center gap-3 rounded-xl border border-emerald-900/40 bg-[#0a1b14] p-3 text-left hover:border-emerald-500/40 transition"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-xs font-black text-slate-950 shadow-md">
                  {user.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-white">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium truncate block">
                    {user.planTier}
                  </span>
                </span>
                <ChevronDown size={15} className={`text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full mb-2 inset-x-0 rounded-2xl border border-emerald-500/30 bg-[#0c1e15] p-2 shadow-2xl z-50 space-y-1 text-xs">
                  <div className="p-2 border-b border-white/10 text-[11px] text-slate-400">
                    Signed in as: <br />
                    <strong className="text-white font-bold">{user.email}</strong>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-slate-300 hover:bg-emerald-950/50 hover:text-white"
                  >
                    <Activity size={14} className="text-[#00E676]" /> Investor Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-red-400 hover:bg-red-950/30 hover:text-red-300 transition text-left"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-amber-400/40 bg-amber-400/10 py-2.5 text-center text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-[#00E676] py-2.5 text-center text-xs font-black text-slate-950 hover:bg-emerald-300 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-h-screen lg:pl-[280px]">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-emerald-900/30 bg-[#060e0a]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              className="rounded-lg p-2 text-slate-300 hover:bg-emerald-900/30 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-300">
              <span>
                {isAuthenticated && user
                  ? `Welcome, ${user.name.split(" ")[0]}`
                  : "Welcome to IQ Investment"}
              </span>
              <span className="text-amber-400">✦</span>
              <span className="text-xs text-slate-400">{BRAND_TAGLINES.sub}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Small steps badge in header */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-black text-[#00E676] shadow-[0_0_12px_rgba(0,230,118,0.15)]">
              <TrendingUp size={14} />
              <span>{BRAND_TAGLINES.badge}</span>
            </div>

            {/* Quick Deposit Link */}
            <Link
              href="/deposit"
              className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-xs font-black text-slate-950 shadow-md transition hover:from-yellow-300 hover:to-amber-400"
            >
              Deposit €
            </Link>

            {/* User Profile / Auth Toggle */}
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User profile"
                className="grid h-9 w-9 place-items-center rounded-full border border-emerald-500/40 bg-[#0e2419] text-xs font-black text-[#00E676] hover:ring-2 hover:ring-[#00E676] transition"
              >
                {user.initials}
              </button>
            ) : (
              <Link
                href="/signin"
                className="rounded-xl border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/10 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-8 sm:py-9">
          {children}
        </main>
      </div>

      {/* Mobile Close Button */}
      {open && (
        <button
          aria-label="Close menu"
          className="fixed right-4 top-4 z-50 rounded-lg bg-[#08150f] p-2 text-white border border-emerald-500/40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
