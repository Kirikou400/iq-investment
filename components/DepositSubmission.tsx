"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const paymentMethods = [
  ["bank_transfer", "Bank transfer"],
  ["usdt_trc20", "USDT (TRC20)"],
  ["bitcoin", "Bitcoin"],
] as const;

export function DepositSubmission() {
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number][0]>("bank_transfer");
  const [amountEUR, setAmountEUR] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signedIn, setSignedIn] = useState(true);

  async function submitDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod, amountEUR, paymentReference }),
      });
      const data = await response.json();
      if (response.status === 401) {
        setSignedIn(false);
        return;
      }
      if (!response.ok) {
        throw new Error(data.error || "Could not submit deposit details.");
      }

      setAmountEUR("");
      setPaymentReference("");
      setMessage("Your self-reported deposit was submitted for review.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit deposit details."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="glass rounded-2xl p-5 sm:p-7">
      <h2 className="text-lg font-semibold text-white">Report a transfer</h2>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        Only report a transfer you have already made. This form records your claim for manual
        review; it does not initiate a payment, verify funds, or credit your balance.
      </p>

      {signedIn ? (
        <form onSubmit={submitDeposit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-300">
            Payment method
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value as typeof paymentMethod)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1b14] px-3 py-3 text-sm text-white"
            >
              {paymentMethods.map(([value, label]) => (
                <option value={value} key={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-300">
            Amount sent (EUR)
            <input
              type="number"
              min="0.01"
              max="9999999.99"
              step="0.01"
              required
              value={amountEUR}
              onChange={(event) => setAmountEUR(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1b14] px-3 py-3 text-sm text-white"
            />
          </label>
          <label className="text-xs font-medium text-slate-300 sm:col-span-2">
            Payment reference or transaction ID
            <input
              type="text"
              minLength={6}
              maxLength={120}
              required
              value={paymentReference}
              onChange={(event) => setPaymentReference(event.target.value)}
              autoComplete="off"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1b14] px-3 py-3 text-sm text-white"
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-300 sm:col-span-2">{error}</p>}
          {message && <p role="status" className="text-sm text-emerald-300 sm:col-span-2">{message}</p>}
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
            <Link href="/deposit/history" className="text-sm font-semibold text-amber-300 underline">
              View your deposit history
            </Link>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-300">
          <Link href="/signin" className="font-semibold text-amber-300 underline">Sign in</Link>
          {" "}to submit a deposit claim.
        </p>
      )}
    </section>
  );
}
