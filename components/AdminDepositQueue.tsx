"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

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

type Filters = { search: string; email: string; status: string };
type StatusChange = { id: string; status: AdminDeposit["status"] };

const paymentMethods: Record<string, string> = {
  bank_transfer: "Bank transfer",
  usdt_trc20: "USDT (TRC20)",
  bitcoin: "Bitcoin",
};

const statuses: AdminDeposit["status"][] = [
  "pending",
  "under_review",
  "approved",
  "rejected",
];

export function AdminDepositQueue() {
  const [deposits, setDeposits] = useState<AdminDeposit[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<Filters>({ search: "", email: "", status: "all" });
  const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusChange, setStatusChange] = useState<StatusChange | null>(null);

  const loadDeposits = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        status: appliedFilters.status,
        email: appliedFilters.email,
        search: appliedFilters.search,
      });
      const response = await fetch(`/api/admin/deposits?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load deposit records.");
      setDeposits(data.deposits);
      setHasMore(data.hasMore);
      setTotal(data.total);
      setNotes((current) => {
        const next = { ...current };
        for (const deposit of data.deposits as AdminDeposit[]) {
          next[deposit.id] = deposit.adminNotes;
        }
        return next;
      });
      if (!data.deposits.length && page > 0) setPage(page - 1);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load deposit records.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page]);

  useEffect(() => {
    void loadDeposits();
  }, [loadDeposits]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(0);
    setAppliedFilters(filters);
  }

  async function saveNotes(id: string) {
    setError("");
    setMessage("");
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/deposits/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: notes[id] ?? "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save admin notes.");
      setDeposits((current) => current.map((deposit) =>
        deposit.id === id ? data.deposit : deposit
      ));
      setMessage("Internal note saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save admin notes.");
    } finally {
      setBusyId("");
    }
  }

  async function confirmStatusChange() {
    if (!statusChange) return;
    setError("");
    setMessage("");
    setBusyId(statusChange.id);
    try {
      const response = await fetch(
        `/api/admin/deposits/${encodeURIComponent(statusChange.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusChange.status }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not change deposit status.");
      setStatusChange(null);
      setMessage("Deposit status updated. No funds or account balances were changed.");
      await loadDeposits();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not change deposit status.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <>
      <section className="glass rounded-2xl p-5 sm:p-7">
        <div className="mb-5 rounded-xl border border-amber-400/20 bg-amber-950/15 p-4 text-xs leading-5 text-amber-100/80">
          Deposits are self-reported claims. Review authoritative payment records before approval.
          Changing a status or note never moves money or changes balances.
        </div>

        <form onSubmit={applyFilters} className="grid gap-3 md:grid-cols-4">
          <label className="text-xs text-slate-400 md:col-span-2">
            Search reference, name, or email
            <input
              type="search"
              maxLength={120}
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-[#0a1b14] px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Filter by exact user email
            <input
              type="email"
              maxLength={254}
              value={filters.email}
              onChange={(event) => setFilters({ ...filters, email: event.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-[#0a1b14] px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Status
            <select
              value={filters.status}
              onChange={(event) => setFilters({ ...filters, status: event.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-[#0a1b14] px-3 py-2.5 text-sm text-white"
            >
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status.replace("_", " ")}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-2 md:col-span-4">
            <button type="submit" className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950">
              Apply filters
            </button>
            <button
              type="button"
              onClick={() => {
                const cleared = { search: "", email: "", status: "all" };
                setFilters(cleared);
                setAppliedFilters(cleared);
                setPage(0);
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300"
            >
              Clear
            </button>
            <span className="self-center text-xs text-slate-500">{total} records</span>
          </div>
        </form>

        {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
        {message && <p role="status" className="mt-4 text-sm text-emerald-300">{message}</p>}
        {loading ? (
          <p className="mt-5 text-sm text-slate-400">Loading deposit records…</p>
        ) : deposits.length === 0 ? (
          <p className="mt-5 rounded-xl border border-white/[.07] p-5 text-sm text-slate-400">
            No deposits match these filters.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-white/[.07]">
            {deposits.map((deposit) => (
              <article key={deposit.id} className="py-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-white">
                      €{deposit.amountEUR} · {paymentMethods[deposit.paymentMethod] ?? deposit.paymentMethod}
                    </p>
                    <p className="text-xs text-slate-300">
                      {deposit.userFullName || "Name unavailable"} · {deposit.userEmail}
                    </p>
                    <p className="break-all text-xs text-slate-400">Reference: {deposit.paymentReference}</p>
                    <p className="text-[11px] text-slate-500">
                      Submitted {new Date(deposit.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs font-bold uppercase text-amber-300">
                      {deposit.status.replace("_", " ")}
                    </p>
                    <Link
                      href={`/admin/deposits/${encodeURIComponent(deposit.id)}`}
                      className="inline-block pt-1 text-xs font-semibold text-amber-300 underline"
                    >
                      View details
                    </Link>
                  </div>
                  <div className="w-full space-y-2 lg:max-w-sm">
                    <label className="block text-xs text-slate-400">
                      Internal admin notes
                      <textarea
                        rows={3}
                        maxLength={2000}
                        value={notes[deposit.id] ?? ""}
                        onChange={(event) => setNotes({ ...notes, [deposit.id]: event.target.value })}
                        className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-[#0a1b14] px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busyId === deposit.id}
                        onClick={() => void saveNotes(deposit.id)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 disabled:opacity-50"
                      >
                        Save note
                      </button>
                      <label className="sr-only" htmlFor={`status-${deposit.id}`}>New status</label>
                      <select
                        id={`status-${deposit.id}`}
                        value={deposit.status}
                        onChange={(event) => setStatusChange({
                          id: deposit.id,
                          status: event.target.value as AdminDeposit["status"],
                        })}
                        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0a1b14] px-2 py-2 text-xs text-white"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status.replace("_", " ")}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && (
          <div className="mt-5 flex items-center justify-between border-t border-white/[.07] pt-4">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">Page {page + 1}</span>
            <button
              type="button"
              disabled={!hasMore}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {statusChange && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="status-confirm-title"
            aria-describedby="status-confirm-description"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1912] p-6 shadow-2xl"
          >
            <h2 id="status-confirm-title" className="text-lg font-bold text-white">
              Confirm status change
            </h2>
            <p id="status-confirm-description" className="mt-3 text-sm leading-6 text-slate-300">
              Change this deposit claim to <strong>{statusChange.status.replace("_", " ")}</strong>?
              This only updates its status; it will not move money or change any balance.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={busyId === statusChange.id}
                onClick={() => setStatusChange(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === statusChange.id}
                onClick={() => void confirmStatusChange()}
                className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"
              >
                {busyId === statusChange.id ? "Updating…" : "Confirm status"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
