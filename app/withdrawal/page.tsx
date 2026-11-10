import { ArrowUpFromLine } from "lucide-react";
import { WithdrawalForm } from "@/components/WithdrawalForm";
import { requireUser } from "@/lib/require-user";

export const runtime = "nodejs";

export default async function WithdrawalPage() {
  await requireUser();

  return (
    <div className="page-enter space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#00E676]">
          <ArrowUpFromLine size={14} /> Payout & Capital Release
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
          Withdraw Funds
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
          Payout requests will be available once a verified balance ledger and payout provider are
          configured.
        </p>
      </div>

      <WithdrawalForm />
    </div>
  );
}
