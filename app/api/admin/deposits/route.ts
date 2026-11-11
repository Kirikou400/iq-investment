import type { Filter } from "mongodb";
import { NextResponse } from "next/server";
import {
  escapeRegex,
  getDepositsCollection,
  isDepositStatus,
  serializeAdminDeposit,
  type Deposit,
} from "@/lib/deposits";
import { getRequestUser, isAdmin } from "@/lib/request-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export async function GET(request: Request) {
  try {
    const user = await getRequestUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (!isAdmin(user)) {
      return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
    }

    const searchParams = new URL(request.url).searchParams;
    const page = Number(searchParams.get("page") ?? "0");
    const status = searchParams.get("status") ?? "all";
    const email = (searchParams.get("email") ?? "").trim().toLowerCase();
    const search = (searchParams.get("search") ?? "").trim();

    if (!Number.isSafeInteger(page) || page < 0 || page > 10000) {
      return NextResponse.json({ error: "Invalid page number." }, { status: 400 });
    }
    if (status !== "all" && !isDepositStatus(status)) {
      return NextResponse.json({ error: "Invalid deposit status." }, { status: 400 });
    }
    if (email.length > 254 || search.length > 120) {
      return NextResponse.json({ error: "Search filter is too long." }, { status: 400 });
    }

    const filters: Filter<Deposit>[] = [];
    if (status !== "all") filters.push({ status });
    if (email) filters.push({ userEmail: { $regex: `^${escapeRegex(email)}$`, $options: "i" } });
    if (search) {
      const query = { $regex: escapeRegex(search), $options: "i" };
      filters.push({
        $or: [
          { userEmail: query },
          { userFullName: query },
          { paymentReference: query },
        ],
      });
    }
    const filter: Filter<Deposit> = filters.length ? { $and: filters } : {};

    const deposits = await getDepositsCollection();
    const [records, total] = await Promise.all([
      deposits
        .find(filter)
        .sort({ createdAt: -1, id: -1 })
        .skip(page * PAGE_SIZE)
        .limit(PAGE_SIZE + 1)
        .toArray(),
      deposits.countDocuments(filter),
    ]);
    const hasMore = records.length > PAGE_SIZE;
    if (hasMore) records.pop();

    return NextResponse.json({
      page,
      pageSize: PAGE_SIZE,
      total,
      hasMore,
      deposits: records.map(serializeAdminDeposit),
    });
  } catch (error: unknown) {
    console.error("Could not load admin deposit records:", error);
    return NextResponse.json(
      { error: "Deposit records are temporarily unavailable." },
      { status: 500 }
    );
  }
}
