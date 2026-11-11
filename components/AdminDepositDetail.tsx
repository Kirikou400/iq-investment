"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminDeposit = {
  id: string;
  amountEUR: string;
  paymentMethod: string;
  paymentReference: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  userEmail: string;
  userFullName: string;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
};

const statuses: AdminDeposit["status"][] = [
  "pending",
  "under_review",
  "approved",
  "rejected",
];

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank transfer",
  usdt_trc20: "USDT (TRC20)",
  bitcoin: "Bitcoin",
};

export function AdminDepositDetail({ depositId }: { depositId: string }) {
  const [deposit, setDeposit] = useState<AdminDeposit | null>(null);
  const [status, setStatus] = useState<AdminDeposit["status"]>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function loadDeposit() {
      try {
        const response = await fetch(`/api/admin/deposits/${encodeURIComponent(depositId)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load deposit details.");
        if (active) {
          setDeposit(data.deposit);
          setStatus(data.deposit.status);
          setAdminNotes(data.deposit.adminNotes);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load deposit details.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadDeposit();
    return () => { active = false; };
  }, [depositId]);

  async function saveChanges(includeStatus: boolean) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/deposits/${encodeURIComponent(depositId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes,
          ...(includeStatus ? { status } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save deposit changes.");
      setDeposit(data.deposit);
      setStatus(data.deposit.status);
      setAdminNotes(data.deposit.adminNotes);
      setConfirmStatus(false);
      setMessage(includeStatus
        ? "Status updated. No money or balances were changed."
        : "Internal notes saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save deposit changes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Link href="/admin/deposits" className="text-sm font-semibold text-amber-300 underline">
        Back to deposit management
      </Link>
      {error && <p role="alert" className="rounded-xl border border-red-500/20 p-4 text-sm text-red-300">{error}</p>}
      {message && <p role="status" className="rounded-xl border border-emerald-500/20 p-4 text-sm text-emerald-300">{message}</p>}
      {loading ? (
        <section className="glass rounded-2xl p-6 text-sm text-slate-400">Loading deposit details…</section>
      ) : !deposit ? (
        <section className="glass rounded-2xl p-6 text-sm text-slate-400">Deposit record not found.</section>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <section className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Reported payment details</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Amount (EUR)</dt>
                <dd className="mt-1 text-sm font-semibold text-white">€{deposit.amountEUR}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Payment method</dt>
                <dd className="mt-1 text-sm text-white">{methodLabels[deposit.paymentMethod] ?? deposit.paymentMethod}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500">Payment reference</dt>
                <dd className="mt-1 break-all font-mono text-sm text-white">{deposit.paymentReference}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">User full name</dt>
                <dd className="mt-1 text-sm text-white">{deposit.userFullName || "Not available"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">User email</dt>
                <dd className="mt-1 break-all text-sm text-white">{deposit.userEmail}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Created</dt>
                <dd className="mt-1 text-sm text-white">{new Date(deposit.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Last updated</dt>
                <dd className="mt-1 text-sm text-white">{new Date(deposit.updatedAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Current status</dt>
                <dd className="mt-1 text-sm font-bold uppercase text-amber-300">{deposit.status.replace("_", " ")}</dd>
              </div>
            </dl>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Admin review</h2>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Notes are internal and are not shown to the user. Confirm payment independently.
              Status changes do not perform financial transactions.
            </p>
            <label className="mt-5 block text-xs font-medium text-slate-300">
              Internal notes
              <textarea
                rows={7}
                maxLength={2000}
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#0a1b14] px-3 py-3 text-sm text-white"
              />
              <span className="mt-1 block text-right text-[11px] text-slate-500">{adminNotes.length}/2000</span>
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={() => void saveChanges(false)}
              className="mt-3 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-50"
            >
              Save internal note
            </button>
            <label className="mt-6 block text-xs font-medium text-slate-300">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as AdminDeposit["status"])}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1b14] px-3 py-3 text-sm text-white"
              >
                {statuses.map((value) => (
                  <option key={value} value={value}>{value.replace("_", " ")}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={busy || status === deposit.status}
              onClick={() => setConfirmStatus(true)}
              className="mt-3 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Change status
            </button>
          </section>
        </div>
      )}

      {confirmStatus && deposit && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="detail-confirm-title"
            aria-describedby="detail-confirm-description"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1912] p-6 shadow-2xl"
          >
            <h2 id="detail-confirm-title" className="text-lg font-bold text-white">Confirm status change</h2>
            <p id="detail-confirm-description" className="mt-3 text-sm leading-6 text-slate-300">
              Change this claim from <strong>{deposit.status.replace("_", " ")}</strong> to{" "}
              <strong>{status.replace("_", " ")}</strong>? This changes only the claim status and
              never moves money or changes any balance.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmStatus(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void saveChanges(true)}
                className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"
              >
                {busy ? "Updating…" : "Confirm status"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
