import { NextResponse } from "next/server";
import {
  createDeposit,
  getDepositsCollection,
  isDepositMethod,
  parseDepositAmount,
  serializeUserDeposit,
} from "@/lib/deposits";
import { getRequestUser } from "@/lib/request-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export async function GET(request: Request) {
  try {
    const user = await getRequestUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to view deposit records." }, { status: 401 });
    }

    const pageValue = new URL(request.url).searchParams.get("page") ?? "0";
    const page = Number(pageValue);
    if (!Number.isSafeInteger(page) || page < 0 || page > 10000) {
      return NextResponse.json({ error: "Invalid page number." }, { status: 400 });
    }

    const deposits = await getDepositsCollection();
    const records = await deposits
      .find({ userId: user.id })
      .sort({ createdAt: -1, id: -1 })
      .skip(page * PAGE_SIZE)
      .limit(PAGE_SIZE + 1)
      .toArray();
    const hasMore = records.length > PAGE_SIZE;
    if (hasMore) records.pop();

    return NextResponse.json({
      page,
      hasMore,
      deposits: records.map(serializeUserDeposit),
    });
  } catch (error: unknown) {
    console.error("Could not load deposit records:", error);
    return NextResponse.json(
      { error: "Deposit records are temporarily unavailable." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequestUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to submit a deposit record." }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Please submit valid JSON." }, { status: 400 });
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Please provide deposit details." }, { status: 400 });
    }

    const { paymentMethod, amountEUR, paymentReference } = body as Record<string, unknown>;
    if (!isDepositMethod(paymentMethod)) {
      return NextResponse.json({ error: "Choose a supported payment method." }, { status: 400 });
    }

    const normalizedAmount = parseDepositAmount(amountEUR);
    if (!normalizedAmount) {
      return NextResponse.json(
        { error: "Enter an amount greater than €0.00, up to €9,999,999.99." },
        { status: 400 }
      );
    }
    if (
      typeof paymentReference !== "string" ||
      paymentReference.trim().length < 6 ||
      paymentReference.trim().length > 120
    ) {
      return NextResponse.json(
        { error: "Enter a payment reference between 6 and 120 characters." },
        { status: 400 }
      );
    }

    const deposit = createDeposit(
      user,
      paymentMethod,
      normalizedAmount,
      paymentReference.trim()
    );
    await (await getDepositsCollection()).insertOne(deposit);

    return NextResponse.json(
      { deposit: serializeUserDeposit(deposit) },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Could not submit deposit record:", error);
    return NextResponse.json(
      { error: "Deposit submission is temporarily unavailable." },
      { status: 500 }
    );
  }
}
