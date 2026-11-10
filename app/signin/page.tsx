"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { IqLogo } from "@/components/IqLogo";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setForgotMsg("");
    setLoading(true);

    const res = await login(email, password, rememberMe);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Authentication failed. Check your credentials.");
    }
  };

  const handleForgot = () => {
    setForgotMsg("Password reset is not configured. Please contact support.");
  };

  return (
    <div className="page-enter mx-auto max-w-lg py-4 sm:py-8 space-y-6">
      {/* Main Sign In Card */}
      <div className="glass rounded-[28px] border border-emerald-500/25 p-7 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="glow-ambient absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 border-b border-emerald-900/40 pb-6">
          <div className="flex justify-center">
            <IqLogo size="md" />
          </div>
          <h1 className="text-2xl font-black text-white pt-2">Investor Portal Sign In</h1>
          <p className="text-xs text-slate-400">
            Access your active Tier 1 & Tier 2 investment portfolio
          </p>
        </div>
        {/* Or Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-emerald-900/40" />
          </div>
          <span className="relative bg-[#091510] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Or Sign In With Custom Details
          </span>
        </div>

        {/* Custom Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-xs uppercase tracking-wider text-slate-300" htmlFor="signin-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                id="signin-email"
                type="email"
                required
                placeholder="name@example.com"
                className="field pl-11 text-xs text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label text-xs uppercase tracking-wider text-slate-300" htmlFor="signin-password">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgot}
                className="text-[11px] font-bold text-amber-400 hover:text-yellow-300"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="field pl-11 pr-11 text-xs text-white font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-emerald-500/40 bg-[#08150f] text-emerald-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <span className="text-[11px] text-emerald-400 font-bold">256-bit Encrypted</span>
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-400 font-medium bg-red-950/40 p-2.5 rounded-xl border border-red-800/40">
              {error}
            </p>
          )}

          {forgotMsg && (
            <p role="status" className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40 leading-relaxed">
              {forgotMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:from-yellow-300 hover:to-amber-400 shadow-[0_0_20px_rgba(255,184,0,0.25)]"
          >
            {loading ? "Authenticating..." : "Sign In to Account"} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Link to Sign Up */}
        <div className="mt-8 border-t border-emerald-900/40 pt-5 text-center text-xs text-slate-400">
          Don&apos;t have an investment account yet?{" "}
          <Link href="/signup" className="font-black text-amber-400 hover:text-yellow-300">
            Create an Account ➔
          </Link>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-[#00E676]" />
        <span>Protected by IQ Multi-Tier Security Protocol</span>
      </div>
    </div>
  );
}
