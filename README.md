# IQ Investment

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `MONGODB_URI` to a MongoDB Atlas connection string and `MONGODB_DB` to the database name.
4. Start the app with `npm run dev`.

The HTTP smoke test expects a running server on port 3456 by default. Start it with
`npm run dev -- -p 3456`, then run `npm test` in another terminal. To use another port, set
`TEST_BASE_URL`.

The authentication API stores users and hashed session tokens in MongoDB. It creates a unique
email index and an expiring-session index on first use. Passwords are hashed with PBKDF2-SHA512;
session tokens are random, HTTP-only cookies, and only their SHA-256 hashes are stored.

## Vercel and MongoDB Atlas

Configure `MONGODB_URI` and `MONGODB_DB` in the Vercel project’s server-side environment variables.
Do not expose database credentials with a `NEXT_PUBLIC_` prefix. Restrict Atlas network access to
the deployment environment and use a database user limited to the required database.

The Mongo client is reused across warm Vercel function invocations. Its pool is capped at five
connections per function instance, with no minimum idle connections and a 30-second idle timeout.
These are conservative starting settings for a serverless deployment expecting roughly 10–50
concurrent users. Monitor Atlas `connections.current`, connection churn, and application latency;
investigate sustained pool saturation or checkout failures before increasing the cap. Each serverless
instance has its own pool, so size Atlas capacity for the maximum number of instances as well.

## Payments

Payment and deposit APIs are not included. The deposit page is a placeholder for your own
implementation; withdrawals remain unavailable.

Existing records in `data/users.json` are not imported into MongoDB. Keep a secure backup and plan
any required account migration separately; never commit production user records or credentials.
