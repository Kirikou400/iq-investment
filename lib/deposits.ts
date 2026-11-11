import { randomUUID } from "crypto";
import type { Collection } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export const DEPOSIT_METHODS = [
  "bank_transfer",
  "usdt_trc20",
  "bitcoin",
] as const;

export const DEPOSIT_STATUSES = [
  "pending",
  "under_review",
  "approved",
  "rejected",
] as const;

export type DepositMethod = (typeof DEPOSIT_METHODS)[number];
export type DepositStatus = (typeof DEPOSIT_STATUSES)[number];

export interface Deposit {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  paymentMethod: DepositMethod;
  amountEUR: string;
  paymentReference: string;
  status: DepositStatus;
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

let indexesPromise: Promise<void> | undefined;

export async function getDepositsCollection(): Promise<Collection<Deposit>> {
  const database = await getDatabase();
  const collection = database.collection<Deposit>("deposits");
  indexesPromise ??= initializeDeposits(collection, database);

  try {
    await indexesPromise;
  } catch (error) {
    indexesPromise = undefined;
    throw error;
  }

  return collection;
}

async function initializeDeposits(
  collection: Collection<Deposit>,
  database: Awaited<ReturnType<typeof getDatabase>>
): Promise<void> {
  const oldUniqueIndex = "userId_1_method_1_referenceKey_1";
  let indexNames: string[] = [];
  try {
    indexNames = (await collection.listIndexes().toArray()).map((index) => index.name);
  } catch (error: unknown) {
    if (
      typeof error !== "object" ||
      error === null ||
      !("code" in error) ||
      error.code !== 26
    ) {
      throw error;
    }
  }
  if (indexNames.includes(oldUniqueIndex)) {
    await collection.dropIndex(oldUniqueIndex);
  }

  const users = database.collection<{ id: string; email: string; name?: string }>("users");
  while (true) {
    const records = await collection
      .find({ paymentMethod: { $exists: false } })
      .limit(500)
      .toArray();
    if (!records.length) break;

    const legacy = records as unknown as Array<{
      _id: (typeof records)[number]["_id"];
      id: string;
      userId: string;
      userEmail?: string;
      userFullName?: string;
      paymentMethod?: unknown;
      paymentReference?: unknown;
      amountEUR?: unknown;
      status?: string;
      adminNotes?: string;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      method?: unknown;
      amountCents?: unknown;
      reference?: unknown;
      reviewedAt?: Date | string;
      reviewedBy?: string;
      reviewNote?: string;
    }>;
    const userIds = Array.from(new Set(legacy.map((record) => record.userId)));
    const userRecords = await users
      .find({ id: { $in: userIds } }, { projection: { id: 1, email: 1, name: 1 } })
      .toArray();
    const usersById = new Map(userRecords.map((user) => [user.id, user]));

    await collection.bulkWrite(
      legacy.map((record) => {
        const method = record.paymentMethod ?? record.method;
        const reference = record.paymentReference ?? record.reference;
        if (!isDepositMethod(method) || typeof reference !== "string") {
          throw new Error(`Legacy deposit ${record.id} has invalid method or reference data.`);
        }

        const amountEUR =
          typeof record.amountEUR === "string"
            ? parseDepositAmount(record.amountEUR)
            : typeof record.amountCents === "number" &&
                Number.isSafeInteger(record.amountCents) &&
                record.amountCents > 0
              ? `${Math.floor(record.amountCents / 100)}.${String(record.amountCents % 100).padStart(2, "0")}`
              : undefined;
        if (!amountEUR) {
          throw new Error(`Legacy deposit ${record.id} has invalid amount data.`);
        }

        const status =
          record.status === "verified"
            ? "approved"
            : isDepositStatus(record.status)
              ? record.status
              : "pending";
        const owner = usersById.get(record.userId);
        const createdAt = new Date(record.createdAt ?? new Date());
        const reviewedAt = record.reviewedAt
          ? new Date(record.reviewedAt)
          : undefined;

        return {
          updateOne: {
            filter: { _id: record._id, paymentMethod: { $exists: false } },
            update: {
              $set: {
                userEmail: record.userEmail || owner?.email || "",
                userFullName: record.userFullName || owner?.name || "",
                paymentMethod: method,
                amountEUR,
                paymentReference: reference,
                status,
                adminNotes: record.adminNotes || record.reviewNote || "",
                createdAt,
                updatedAt: record.updatedAt
                  ? new Date(record.updatedAt)
                  : reviewedAt ?? createdAt,
              },
              $unset: {
                method: "",
                amountCents: "",
                reference: "",
                referenceKey: "",
                reviewedAt: "",
                reviewedBy: "",
                reviewNote: "",
              },
            },
          },
        };
      }),
      { ordered: false }
    );
  }

  await Promise.all([
    collection.createIndex({ userId: 1, createdAt: -1 }),
    collection.createIndex({ status: 1, createdAt: -1 }),
    collection.createIndex({ userEmail: 1, createdAt: -1 }),
    collection.createIndex({ paymentReference: 1, createdAt: -1 }),
  ]);
}

export function parseDepositAmount(value: unknown): string | undefined {
  if (
    typeof value !== "string" ||
    !/^(?:0|[1-9]\d{0,6})(?:\.\d{1,2})?$/.test(value)
  ) {
    return undefined;
  }

  const [whole, fraction = ""] = value.split(".");
  const amountCents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    return undefined;
  }

  return `${whole}.${fraction.padEnd(2, "0")}`;
}

export function isDepositMethod(value: unknown): value is DepositMethod {
  return (
    typeof value === "string" &&
    DEPOSIT_METHODS.includes(value as DepositMethod)
  );
}

export function isDepositStatus(value: unknown): value is DepositStatus {
  return (
    typeof value === "string" &&
    DEPOSIT_STATUSES.includes(value as DepositStatus)
  );
}

export function createDeposit(
  user: { id: string; email: string; name?: string },
  paymentMethod: DepositMethod,
  amountEUR: string,
  paymentReference: string
): Deposit {
  const now = new Date();
  return {
    id: randomUUID(),
    userId: user.id,
    userEmail: user.email,
    userFullName: user.name?.trim() ?? "",
    paymentMethod,
    amountEUR,
    paymentReference,
    status: "pending",
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function serializeUserDeposit(deposit: Deposit) {
  return {
    id: deposit.id,
    amountEUR: deposit.amountEUR,
    paymentMethod: deposit.paymentMethod,
    paymentReference: deposit.paymentReference,
    status: deposit.status,
    createdAt: deposit.createdAt.toISOString(),
  };
}

export function serializeAdminDeposit(deposit: Deposit) {
  return {
    ...serializeUserDeposit(deposit),
    userId: deposit.userId,
    userEmail: deposit.userEmail,
    userFullName: deposit.userFullName,
    adminNotes: deposit.adminNotes,
    updatedAt: deposit.updatedAt.toISOString(),
  };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
