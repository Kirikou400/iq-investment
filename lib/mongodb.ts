import { MongoClient, MongoClientOptions } from "mongodb";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

/**
 * Resolves the database name:
 * 1. MONGODB_DB environment variable if set.
 * 2. Database name parsed from the pathname of MONGODB_URI (e.g. mongodb+srv://.../dbname?...)
 * 3. Default fallback to "cryptovest"
 */
export function getDatabaseName(): string {
  const envDb = process.env.MONGODB_DB?.trim();
  if (envDb) {
    return envDb;
  }

  const uri = process.env.MONGODB_URI?.trim() || "";
  try {
    const parsed = new URL(
      uri.replace(/^mongodb\+srv:\/\//i, "https://").replace(/^mongodb:\/\//i, "https://")
    );
    const pathname = parsed.pathname.replace(/^\//, "").split("?")[0];
    if (pathname) {
      return decodeURIComponent(pathname);
    }
  } catch {
    // Ignore URL parse error and fall back
  }

  return "cryptovest";
}

/**
 * Returns the sanitized MongoDB connection string.
 * Throws a clear and helpful error if MONGODB_URI is missing.
 */
export function getMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not configured. Please add MONGODB_URI in your Vercel project environment variables."
    );
  }
  return uri;
}

const clientOptions: MongoClientOptions = {
  // Connection pool size optimized for Vercel serverless functions
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 30_000,
  // Timeouts configured to fail gracefully before Vercel kills the lambda execution (10s limit)
  serverSelectionTimeoutMS: 8_000,
  connectTimeoutMS: 10_000,
};

export async function getMongoClient(): Promise<MongoClient> {
  const uri = getMongoUri();

  if (process.env.NODE_ENV !== "production") {
    if (!global.mongoClientPromise) {
      const client = new MongoClient(uri, clientOptions);
      global.mongoClientPromise = client.connect().catch((err) => {
        global.mongoClientPromise = undefined;
        throw err;
      });
    }
    return global.mongoClientPromise;
  }

  // In production / Vercel Serverless environment:
  // Reuse clientPromise across warm invocations; reset on failure so subsequent requests can retry.
  if (!clientPromise) {
    const client = new MongoClient(uri, clientOptions);
    clientPromise = client.connect().catch((err) => {
      clientPromise = undefined;
      throw err;
    });
  }

  return clientPromise;
}

export async function getDatabase() {
  const client = await getMongoClient();
  const dbName = getDatabaseName();
  return client.db(dbName);
}
