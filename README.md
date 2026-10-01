# RentNest

RentNest is a full-stack rental property and tenant management app for Indian owners and renters. It combines public property discovery with role-based workspaces for rental requests, tenancies, rent payments, and printable receipts.

## What’s included

- Owner and tenant registration with email/password authentication, bcrypt hashing, signed JWT sessions, protected routes, and server-side role checks
- Property CRUD with multi-step forms, local image uploads, facilities, availability, Indian currency formatting, and rich listing pages
- URL-synced property search by location, type, rent, bedrooms, furnishing, facilities, and sort order
- Rental requests with human-readable IDs, duplicate prevention, status timelines, withdrawal, approval, rejection, and server-enforced transitions
- Automatic tenancy creation, property occupancy, closure of competing requests, and tenancy ending
- Monthly payment recording with duplicate prevention, receipt IDs, printable receipts, searchable history, pagination, and paid/pending indicators
- Owner and tenant dashboards with KPIs, activity, collection charts, responsive navigation, command palette, dark mode, loading states, and empty states
- Due-date and grace-period settings, paid/upcoming/due/overdue status, automatic and manual reminders, WhatsApp reminder links, notification inbox, and rent calendar
- Transaction-safe property occupancy updates, affected-tenant notifications, and availability history
- Owner operations dashboard with occupancy KPIs, trend indicators, donut chart, property status board, rent attention queue, and inline request decisions
- Portfolio analytics with expected-versus-collected rent, collection rate, occupancy trend, payment/property/city breakdowns, sortable property metrics, and CSV exports
- Seeded data for 12 homes, twelve months of varied payments, ended tenancies, unread notifications, and demo workflows in every request status

## Run locally

Requirements: Node.js 20.19+ and pnpm 10+.

```bash
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To reset the local SQLite database and restore demo data:

```bash
pnpm db:reset
```

Prisma protects destructive reset commands when invoked by coding agents. When running the reset yourself, review that `DATABASE_URL` points to the local `dev.db` file before confirming it.

## Rent reminder sweep

Dashboards run the idempotent reminder sweep automatically. A scheduler can trigger the same sweep with:

```bash
curl -X POST http://localhost:3000/api/reminders/run \
  -H "Authorization: Bearer YOUR_REMINDER_CRON_SECRET"
```

Set `REMINDER_CRON_SECRET` in `.env`. SMTP variables are optional; without them RentNest still creates all in-app notifications. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` to also send tenant reminder emails.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Owner | `owner@demo.com` | `Demo@123` |
| Tenant | `tenant@demo.com` | `Demo@123` |

## Useful scripts

```bash
pnpm dev       # start the development server
pnpm build     # create a production build
pnpm lint      # run ESLint
pnpm test      # run Vitest unit tests
pnpm db:push   # sync the Prisma schema and generate the client
pnpm db:seed   # load realistic demo data
pnpm db:reset  # recreate and seed the database
```

Copy `.env.example` to `.env` for a fresh checkout and replace `JWT_SECRET` before production use. Uploaded files are written to `public/uploads`; the SQLite database is stored in `dev.db`.
