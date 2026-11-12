"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { IqLogo } from "@/components/IqLogo";

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tier, setTier] = useState<"TIER 1 Investor" | "TIER 2 Investor">("TIER 1 Investor");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Please agree to the terms before creating your account.");
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password, tier, agreeTerms);
    setLoading(false);

    if (result.success) {
      // Hard navigation ensures fresh session cookies are dispatched to Server Components
      window.location.href = "/dashboard";
      return;
    }

    setError(result.error || "Account registration failed. Please try again.");
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  return (
    <div className="page-enter mx-auto max-w-lg py-4 sm:py-8 space-y-6">
      {/* Main Sign Up Card */}
      <div className="glass rounded-[28px] border border-emerald-500/25 p-7 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="glow-ambient absolute -left-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 border-b border-emerald-900/40 pb-6">
          <div className="flex justify-center">
            <IqLogo size="md" />
          </div>
          <h1 className="text-2xl font-black text-white pt-2">Create Investor Account</h1>
          <p className="text-xs text-slate-400">
            Join IQ Investment and activate your Tier allocation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label text-xs uppercase tracking-wider text-slate-300" htmlFor="signup-name">
              Full Legal Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon size={16} />
              </span>
              <input
                id="signup-name"
                type="text"
                required
                placeholder="e.g. Jordan Davis"
                className="field pl-11 text-xs text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label text-xs uppercase tracking-wider text-slate-300" htmlFor="signup-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                id="signup-email"
                type="email"
                required
                placeholder="investor@example.com"
                className="field pl-11 text-xs text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label text-xs uppercase tracking-wider text-slate-300" htmlFor="signup-password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 8 characters"
                minLength={8}
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

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        step <= strength
                          ? strength >= 3
                            ? "bg-[#00E676]"
                            : strength === 2
                            ? "bg-amber-400"
                            : "bg-red-400"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Security strength</span>
                  <span className={strength >= 3 ? "text-[#00E676] font-bold" : "text-slate-400"}>
                    {strength <= 1 ? "Weak" : strength === 2 ? "Moderate" : "Strong"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Investment Tier Selection */}
          <div>
            <label className="label text-xs uppercase tracking-wider text-slate-300">
              Target Investment Tier
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTier("TIER 1 Investor")}
                className={`rounded-xl border p-3 text-left transition ${
                  tier === "TIER 1 Investor"
                    ? "border-amber-400 bg-amber-400/15"
                    : "border-emerald-900/40 bg-[#08150f] hover:border-emerald-700/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400">TIER 1</span>
                  <span className="text-[10px] text-slate-400">€3.5k - €9k</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">Entry Foundation</p>
              </button>

              <button
                type="button"
                onClick={() => setTier("TIER 2 Investor")}
                className={`rounded-xl border p-3 text-left transition ${
                  tier === "TIER 2 Investor"
                    ? "border-emerald-400 bg-emerald-500/15"
                    : "border-emerald-900/40 bg-[#08150f] hover:border-emerald-700/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#00E676]">TIER 2</span>
                  <span className="text-[10px] text-slate-400">€10k - €15.5k+</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">High Accelerator</p>
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-emerald-500/40 bg-[#08150f] text-emerald-500 focus:ring-0"
              />
              <span className="leading-relaxed">
                I agree to the applicable account terms and privacy policy.
              </span>
            </label>
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-400 font-medium bg-red-950/40 p-2.5 rounded-xl border border-red-800/40">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:from-emerald-400 hover:to-green-400 shadow-[0_0_20px_rgba(0,230,118,0.25)]"
          >
            {loading ? "Creating Account..." : "Register & Enter Dashboard"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 border-t border-emerald-900/40 pt-5 text-center text-xs text-slate-400">
          Already registered an investor account?{" "}
          <Link href="/signin" className="font-black text-amber-400 hover:text-yellow-300">
            Sign In Here ➔
          </Link>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-[#00E676]" />
        <span>Account sessions use secure, HTTP-only cookies.</span>
      </div>
    </div>
  );
}
