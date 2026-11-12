import {
  createHash,
  randomBytes,
  randomUUID,
  timingSafeEqual,
  pbkdf2,
} from "crypto";
import { promisify } from "util";
import type { Collection } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

const pbkdf2Async = promisify(pbkdf2);
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  initials: string;
  memberSince: string;
  planTier: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface Session {
  userId: string;
  expiresAt: Date;
}

interface StoredSession {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}

let indexesEnsured = false;

async function ensureIndexes(
  users: Collection<StoredUser>,
  sessions: Collection<StoredSession>
) {
  if (indexesEnsured) return;
  indexesEnsured = true;

  try {
    await Promise.allSettled([
      users.createIndex({ email: 1 }, { unique: true }),
      sessions.createIndex({ tokenHash: 1 }, { unique: true }),
      sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]);
  } catch (error) {
    console.warn("Index creation notice (non-fatal):", error);
  }
}

async function getCollections() {
  const database = await getDatabase();
  const users = database.collection<StoredUser>("users");
  const sessions = database.collection<StoredSession>("sessions");

  // Run in background without blocking or failing user authentication requests
  void ensureIndexes(users, sessions);

  return { users, sessions };
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const hash = await pbkdf2Async(password, salt, 310_000, 64, "sha512");
  return hash.toString("hex");
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const { users } = await getCollections();
  return (await users.findOne({ email: email.toLowerCase().trim() })) ?? undefined;
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const { users } = await getCollections();
  return (await users.findOne({ id })) ?? undefined;
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  planTier: string
): Promise<StoredUser> {
  const { users } = await getCollections();
  const cleanEmail = email.toLowerCase().trim();

  const existing = await users.findOne({ email: cleanEmail });
  if (existing) {
    const error: any = new Error("An account with this email already exists.");
    error.code = 11000;
    throw error;
  }

  const salt = randomBytes(16).toString("hex");
  const cleanName = name.trim();
  const initials =
    cleanName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "IQ";

  const user: StoredUser = {
    id: randomUUID(),
    name: cleanName,
    email: cleanEmail,
    passwordHash: await hashPassword(password, salt),
    salt,
    initials,
    memberSince: new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date()),
    planTier,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };

  await users.insertOne(user);
  return user;
}

export async function verifyPassword(
  password: string,
  user: StoredUser
): Promise<boolean> {
  const actual = Buffer.from(await hashPassword(password, user.salt), "hex");
  const expected = Buffer.from(user.passwordHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function createSession(userId: string): Promise<string> {
  const { sessions } = await getCollections();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  await sessions.insertOne({
    tokenHash,
    userId,
    expiresAt: new Date(Date.now() + SESSION_LIFETIME_MS),
  });

  return token;
}

export async function getSession(token: string): Promise<Session | undefined> {
  const { sessions } = await getCollections();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const session = await sessions.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  return session
    ? { userId: session.userId, expiresAt: session.expiresAt }
    : undefined;
}

export async function deleteSession(token: string): Promise<void> {
  const { sessions } = await getCollections();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await sessions.deleteOne({ tokenHash });
}

export function sanitizeUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: user.initials,
    memberSince: user.memberSince,
    planTier: user.planTier,
    emailVerified: user.emailVerified,
  };
}

export function isDuplicateEmailError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as any).code === 11000
  );
}

export function formatAuthError(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    if (error.message.includes("MONGODB_URI")) {
      return "Database configuration missing: Please set MONGODB_URI in your Vercel project environment variables.";
    }
    if (
      error.name === "MongoServerSelectionError" ||
      error.message.includes("Server selection timed out") ||
      error.message.includes("ETIMEDOUT") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return "Database connection timed out. In MongoDB Atlas, ensure Network Access allows 0.0.0.0/0 (all IPs) for Vercel.";
    }
    if (
      error.name === "MongoTopologyClosedError" ||
      error.message.includes("Authentication failed") ||
      error.message.includes("bad auth")
    ) {
      return "Database authentication failed. Please verify your MongoDB connection string credentials in Vercel.";
    }
  }
  return fallbackMessage;
}
