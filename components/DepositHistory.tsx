"use client";

import { useCallback, useEffect, useState } from "react";

type UserDeposit = {
  id: string;
  amountEUR: string;
  paymentMethod: string;
  paymentReference: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  createdAt: string;
};

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank transfer",
  usdt_trc20: "USDT (TRC20)",
  bitcoin: "Bitcoin",
};

const statusStyles: Record<UserDeposit["status"], string> = {
  pending: "text-amber-300",
  under_review: "text-sky-300",
  approved: "text-emerald-300",
  rejected: "text-red-300",
};

export function DepositHistory() {
  const [deposits, setDeposits] = useState<UserDeposit[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeposits = useCallback(async (pageToLoad: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/deposits?page=${pageToLoad}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load your deposit history.");
      setDeposits(data.deposits);
      setHasMore(data.hasMore);
      if (!data.deposits.length && pageToLoad > 0) setPage(pageToLoad - 1);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load your deposit history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDeposits(page);
  }, [loadDeposits, page]);

  return (
    <section className="glass rounded-2xl p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Your deposits</h2>
        <span className="text-xs text-slate-500">Most recent first</span>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
      {loading ? (
        <p className="mt-4 text-sm text-slate-400">Loading deposit history…</p>
      ) : deposits.length === 0 ? (
        <p className="mt-4 rounded-xl border border-white/[.07] p-5 text-sm text-slate-400">
          You have not submitted any deposit claims yet.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-white/[.07]">
          {deposits.map((deposit) => (
            <article key={deposit.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  €{deposit.amountEUR} · {methodLabels[deposit.paymentMethod] ?? deposit.paymentMethod}
                </p>
                <p className="mt-1 break-all text-xs text-slate-400">
                  Reference: {deposit.paymentReference}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Submitted {new Date(deposit.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`text-xs font-bold uppercase ${statusStyles[deposit.status]}`}>
                {deposit.status.replace("_", " ")}
              </span>
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
  );
}
