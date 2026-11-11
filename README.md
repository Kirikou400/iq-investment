# IQ Investment

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `MONGODB_URI` to a MongoDB Atlas connection string, `MONGODB_DB` to the database name, and
   `ADMIN_EMAILS` to a comma-separated list of administrator account email addresses.
4. Start the app with `npm run dev`.

The HTTP smoke test expects a running server on port 3456 by default. Start it with
`npm run dev -- -p 3456`, then run `npm test` in another terminal. To use another port, set
`TEST_BASE_URL`.

The authentication API stores users and hashed session tokens in MongoDB. It creates a unique
email index and an expiring-session index on first use. Passwords are hashed with PBKDF2-SHA512;
session tokens are random, HTTP-only cookies, and only their SHA-256 hashes are stored.

## Vercel and MongoDB Atlas

Configure `MONGODB_URI`, `MONGODB_DB`, and `ADMIN_EMAILS` in the Vercel project’s server-side
environment variables. Do not expose database credentials with a `NEXT_PUBLIC_` prefix. Restrict
Atlas network access to the deployment environment and use a database user limited to the required
database.

The Mongo client is reused across warm Vercel function invocations. Its pool is capped at five
connections per function instance, with no minimum idle connections and a 30-second idle timeout.
These are conservative starting settings for a serverless deployment expecting roughly 10–50
concurrent users. Monitor Atlas `connections.current`, connection churn, and application latency;
investigate sustained pool saturation or checkout failures before increasing the cap. Each serverless
instance has its own pool, so size Atlas capacity for the maximum number of instances as well.

## Payments

The deposit page records self-reported payment method, EUR amount, and payment reference in
MongoDB. A record includes a snapshot of the authenticated user's ID, email, and name; status
(`pending`, `under_review`, `approved`, or `rejected`); private admin notes; and creation/update
timestamps. Users can submit records at `/deposit` and view only their own history at
`/deposit/history`.

When the deposit collection is first accessed, the app creates the query indexes and migrates
records from the earlier deposit field/status format (`verified` becomes `approved`). The legacy
reference uniqueness index is removed so each valid submission can be retained as its own record.

Set `ADMIN_EMAILS` to exact account email addresses separated by commas, for example
`ADMIN_EMAILS=me@example.com,secondadmin@example.com`. Those accounts can use the server-protected
admin dashboard at `/admin` and manage claims at `/admin/deposits`. Admin access is determined on
the server from the authenticated account email and this environment variable; client-side admin
state only controls navigation visibility. Admin APIs return 401 for unauthenticated requests and
403 for authenticated non-admin users. The `deposits` collection and its query indexes are created
on first use.

Admins can search by email, name, or reference; filter by exact user email or status; inspect
individual records; add private notes; and change status after an explicit confirmation. Approval
only changes the status field and update timestamp. The application does not move money, credit or
debit balances, trigger payments/transfers, allocate investments, or process withdrawals. Review
each self-reported claim against authoritative payment records. No proof uploads, payment processor,
investment ledger, or withdrawal flow is implemented. Confirm all displayed payment instructions
independently before sending funds.

### Manual deposit workflow checks

1. Configure `MONGODB_URI`, `MONGODB_DB`, and `ADMIN_EMAILS` in `.env.local`, then start the app.
2. Sign in as a regular user, submit a claim with a valid method, EUR amount, and reference, and
   check `/deposit/history` for its pending status and newest-first ordering.
3. Sign in as a second regular user and confirm their history does not show the first user's claim.
   Verify unauthenticated requests to `/api/deposits` receive 401.
4. Visit `/admin` as a regular user and confirm it redirects to `/dashboard`. As an address listed in
   `ADMIN_EMAILS`, open `/admin`, then `/admin/deposits`.
5. Search for the test claim, filter by its email/status, open its detail page, save an internal note,
   and confirm the note is not exposed on the user's history.
6. Change the status to `under_review`, then to `approved` or `rejected`; confirm the prompt and
   verify the new status and `updatedAt` are saved.
7. Confirm no balance or investment values change and no payment/transfer/withdrawal is initiated.
   Try invalid amounts, methods, and empty references and confirm each is rejected.

Existing records in `data/users.json` are not imported into MongoDB. Keep a secure backup and plan
any required account migration separately; never commit production user records or credentials.
