const http = require("http");

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3456";
let passed = 0;
let failed = 0;

function assert(condition, name, detail) {
  if (condition) {
    console.log(`  PASS: ${name}`);
    passed++;
  } else {
    console.error(`  FAIL: ${name}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function request(path, method = "GET", payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const body = payload === undefined ? "" : JSON.stringify(payload);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: url.pathname + url.search,
        method,
        headers: body
          ? {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(body),
            }
          : {},
      },
      (res) => {
        let responseBody = "";
        res.on("data", (chunk) => (responseBody += chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body: responseBody,
          })
        );
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`Checking ${baseUrl}\n`);

  for (const [path, title] of [
    ["/", "Home"],
    ["/investments", "Investment plans"],
    ["/calculator", "Calculator"],
    ["/deposit", "Deposit page"],
    ["/signin", "Sign-in"],
    ["/signup", "Sign-up"],
  ]) {
    try {
      const response = await request(path);
      assert(response.status === 200, `${title} page returns 200`, `HTTP ${response.status}`);
    } catch (error) {
      assert(false, `${title} page is reachable`, error.message);
    }
  }

  for (const path of [
    "/dashboard",
    "/withdrawal",
    "/deposit/history",
    "/admin",
    "/admin/deposits",
    "/admin/deposits/test-id",
  ]) {
    try {
      const response = await request(path);
      assert(
        response.status === 307 && String(response.headers.location).includes("/signin"),
        `${path} requires authentication`,
        `HTTP ${response.status}`
      );
    } catch (error) {
      assert(false, `${path} authentication guard responds`, error.message);
    }
  }

  try {
    const signin = await request("/signin");
    assert(!signin.body.includes("Quick Demo"), "Sign-in page has no demo login");
    const signup = await request("/signup");
    assert(
      !signup.body.includes("Prototype Registration") &&
        !signup.body.includes("demonstration environment"),
      "Sign-up page has no prototype/demo notice"
    );
  } catch (error) {
    assert(false, "Authentication pages render", error.message);
  }

  try {
    const me = await request("/api/auth/me");
    assert(me.status === 200 && JSON.parse(me.body).user === null, "Unauthenticated session check returns no user");

    const deposits = await request("/api/deposits");
    assert(
      deposits.status === 401 && JSON.parse(deposits.body).error,
      "Deposit API requires authentication"
    );
    const submitDeposit = await request("/api/deposits", "POST", {
      paymentMethod: "bank_transfer",
      amountEUR: "100.00",
      paymentReference: "test-reference",
    });
    assert(submitDeposit.status === 401, "Deposit submission requires authentication");

    const adminQueue = await request("/api/admin/deposits");
    assert(
      adminQueue.status === 401 && JSON.parse(adminQueue.body).error,
      "Admin deposit API requires authentication"
    );
    const filteredAdminQueue = await request("/api/admin/deposits?status=invalid");
    assert(filteredAdminQueue.status === 401, "Filtered admin deposit API requires authentication");

    const review = await request("/api/admin/deposits/test-id", "PATCH", { status: "verified" });
    assert(review.status === 401, "Deposit review API requires authentication");
    const adminDetails = await request("/api/admin/deposits/test-id");
    assert(adminDetails.status === 401, "Admin deposit details require authentication");

    const invalidSignup = await request("/api/auth/signup", "POST", {});
    assert(invalidSignup.status === 400, "Invalid signup input is rejected before database access");

    const logout = await request("/api/auth/logout", "POST", {});
    assert(logout.status === 200, "Logout endpoint responds successfully without a session");
  } catch (error) {
    assert(false, "Authentication API smoke checks run", error.message);
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  process.exitCode = failed === 0 ? 0 : 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
