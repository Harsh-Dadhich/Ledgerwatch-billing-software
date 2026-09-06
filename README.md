# LedgerWatch

A multi-tenant billing and inventory management SaaS platform built for retail shop owners — manage products, generate bills, track inventory, and analyze sales in one place.

**Live app:** [ledgerwatch-billing-software.vercel.app](https://ledgerwatch-billing-software.vercel.app)

## Overview

LedgerWatch is a solo-built, production-deployed platform with a mobile-first, POS-style billing UI and a full inventory/audit-trail backend. Every product, bill, and inventory record is scoped to a specific store, supporting multiple independent shops on the same deployment.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios — deployed on Vercel
- **Backend:** FastAPI, Python, Pydantic, MongoEngine — deployed on Render
- **Database:** MongoDB (via MongoDB Atlas)
- **Cache / Sessions:** Redis (via Upstash) — JWT session storage, refresh-token rotation, idempotency keys

## Key Features

- **Billing engine** — atomic sequential invoicing, per-line and bill-level discounts, POS-style price overrides, Redis-backed idempotent bill creation to prevent duplicate charges on retry
- **Inventory management** — per-product stock tracking with atomic decrement/rollback to prevent overselling under concurrent access; inventory changes recorded as an auditable transaction log (purchase, sale, adjustment, damage, return)
- **Authentication** — JWT sessions in httpOnly cookies, bcrypt password hashing, Redis-backed token revocation, refresh-token rotation, role-based access control (store admins vs. sales staff)
- **Admin dashboard** — real-time sales aggregation via MongoDB pipelines, paginated transaction history, bill voiding with audit-trail preservation
- **Multi-tenant architecture** — same-origin proxy setup for secure cross-domain cookie handling across the Vercel frontend and Render backend

## Project Structure

```
├── Backend/     # FastAPI backend — see Backend/README.md
├── my-app/      # React frontend — see my-app/README.md
└── .env.example # Environment variable reference
```

See the README in each subdirectory for setup instructions specific to that part of the stack.

## Status

Actively developed and onboarding its first pilot shops for trial use.
