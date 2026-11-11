import { AdminDepositDetail } from "@/components/AdminDepositDetail";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export default async function AdminDepositDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  return (
    <div className="page-enter space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber-300">
          Administrator tools
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Deposit details</h1>
      </div>
      <AdminDepositDetail depositId={params.id} />
    </div>
  );
}
