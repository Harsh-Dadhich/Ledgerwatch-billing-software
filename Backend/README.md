# Ledgerwatch backend

FastAPI + MongoEngine backend for Ledgerwatch. Matches the architecture and
security decisions from planning: store-scoped multi-tenancy, JWT in
httpOnly cookies, RBAC (admin/sales), discount applied only at billing time,
no image fields, and every bill line item snapshots its product's name and
price so editing a product later never rewrites history.

## Quick start (Docker — recommended)

```bash
cp .env.example .env
# edit .env and set a real JWT_SECRET_KEY
docker compose up --build
```

API will be at `http://localhost:8000`, interactive docs at
`http://localhost:8000/docs`.

## Quick start (local Python)

```bash
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# edit .env: set MONGO_URI to a running MongoDB instance and a real JWT_SECRET_KEY
uvicorn app.main:app --reload
```

## Auth model — read this before wiring up the frontend

There is **no public "sign up as admin or sales" choice**. That was a
deliberate change from the earlier frontend mockup:

- `POST /auth/signup` is public and creates a **new Store + its first admin
  user**. This is "a business owner signs up for Ledgerwatch."
- `POST /auth/staff` is **admin-only** and creates a sales-staff account
  under the calling admin's own store. Staff never self-register.

Update the signup modal in the frontend to drop the role toggle for the
public flow, and add a separate "add staff" form inside the admin
dashboard that hits `/auth/staff`.

Tokens are issued as `access_token` (15 min) and `refresh_token` (7 days)
in httpOnly, sameSite=strict cookies — not returned in the JSON body, and
never intended to be stored in localStorage on the frontend.

## Known gaps to close before real production traffic

These are flagged rather than silently done "fully" so you know exactly
what's simplified for now:

1. **Refresh token revocation.** `/auth/refresh` currently trusts a
   still-valid access token rather than verifying the refresh_token cookie
   against a stored/hashed value with a revocation list. Add a Redis-backed
   `jti` blacklist (the token creation code already generates a `jti` for
   this) so logout and "revoke all sessions" actually work.
2. **Sequential bill numbering.** Bill numbers are currently
   date + random suffix, which is collision-safe but not sequential. If
   GST e-invoicing or a CA requires strictly sequential invoice numbers,
   swap this for a per-store atomic counter document.
3. **No automated tests yet.** Add pytest + an in-memory Mongo
   (mongomock or a test container) covering: signup, staff creation
   permission checks, bill total math, and store-scoping (a store A user
   must never be able to read store B's products/bills).
4. **No rate limiting on `/products` or `/bills` yet** — only login/signup
   are limited. Add limits before opening this to the public internet.
5. **CORS origins and cookie `secure` flag** are read from `.env` — make
   sure `ENVIRONMENT=production` and `CORS_ORIGINS` is your real frontend
   domain before deploying, or cookies won't be sent/accepted correctly.

## Project layout

```
app/
  core/       config, DB connection, JWT + password hashing, rate limiter
  models/     MongoEngine documents (Store, User, Product, Bill)
  schemas/    Pydantic request/response models
  auth/       signup, staff creation, login, refresh, logout, RBAC deps
  products/   product CRUD (admin writes, any authenticated role reads)
  bills/      bill creation — this is where qty × price and optional
              per-line discount are calculated server-side
  dashboard/  aggregation-pipeline based summary (today's sales, avg ticket)
```
