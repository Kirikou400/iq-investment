import { NextResponse } from "next/server";
import {
  getDepositsCollection,
  isDepositStatus,
  serializeAdminDeposit,
  type Deposit,
} from "@/lib/deposits";
import { getRequestUser, isAdmin } from "@/lib/request-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

async function authorizeAdmin() {
  const user = await getRequestUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Sign in required." }, { status: 401 }),
    };
  }
  if (!isAdmin(user)) {
    return {
      user: null,
      response: NextResponse.json({ error: "Administrator access required." }, { status: 403 }),
    };
  }
  return { user, response: null };
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const auth = await authorizeAdmin();
    if (auth.response) return auth.response;

    const deposit = await (await getDepositsCollection()).findOne({ id: params.id });
    if (!deposit) {
      return NextResponse.json({ error: "Deposit record not found." }, { status: 404 });
    }

    return NextResponse.json({ deposit: serializeAdminDeposit(deposit) });
  } catch (error: unknown) {
    console.error("Could not load admin deposit details:", error);
    return NextResponse.json(
      { error: "Deposit details are temporarily unavailable." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const auth = await authorizeAdmin();
    if (auth.response) return auth.response;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Please submit valid JSON." }, { status: 400 });
    }
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Please provide review changes." }, { status: 400 });
    }

    const { status, adminNotes } = body as Record<string, unknown>;
    if (status === undefined && adminNotes === undefined) {
      return NextResponse.json({ error: "No review changes were provided." }, { status: 400 });
    }
    if (status !== undefined && !isDepositStatus(status)) {
      return NextResponse.json({ error: "Choose a valid deposit status." }, { status: 400 });
    }
    if (
      adminNotes !== undefined &&
      (typeof adminNotes !== "string" || adminNotes.length > 2000)
    ) {
      return NextResponse.json(
        { error: "Admin notes must be 2,000 characters or fewer." },
        { status: 400 }
      );
    }

    const changes: Partial<Deposit> = { updatedAt: new Date() };
    if (isDepositStatus(status)) changes.status = status;
    if (typeof adminNotes === "string") changes.adminNotes = adminNotes.trim();

    const deposits = await getDepositsCollection();
    const result = await deposits.updateOne(
      { id: params.id },
      { $set: changes }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Deposit record not found." }, { status: 404 });
    }

    const deposit = await deposits.findOne({ id: params.id });
    if (!deposit) {
      return NextResponse.json({ error: "Deposit record not found." }, { status: 404 });
    }
    return NextResponse.json({ deposit: serializeAdminDeposit(deposit) });
  } catch (error: unknown) {
    console.error("Could not update admin deposit record:", error);
    return NextResponse.json(
      { error: "Deposit review is temporarily unavailable." },
      { status: 500 }
    );
  }
}
