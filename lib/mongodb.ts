import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB;

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

export async function getDatabase() {
  if (!databaseName) {
    throw new Error("MONGODB_DB is not configured.");
  }
  const client = await getMongoClient();
  return client.db(databaseName);
}

export async function getMongoClient() {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }
  if (!databaseName) {
    throw new Error("MONGODB_DB is not configured.");
  }

  clientPromise ??=
    global.mongoClientPromise ??
    new MongoClient(uri, {
      // Vercel functions each have their own pool; cap per-instance connections
      // for the expected 10–50 concurrent launch users and scale using metrics.
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30_000,
    }).connect();

  if (process.env.NODE_ENV !== "production") {
    global.mongoClientPromise = clientPromise;
  }

  return clientPromise;
}
