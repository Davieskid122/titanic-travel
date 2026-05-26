# Workspace

## Overview

pnpm workspace monorepo using TypeScript. A premium travel booking site called **Titanic Travel** — modelled after Virgin Atlantic, with full backend, auth, and booking system.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Clerk (`@clerk/express` server, `@clerk/react` client)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, shadcn/ui

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Branding

- **Primary color**: `#A70D2E` (crimson red)
- **Secondary color**: `#5B056A` (deep purple)
- **Font**: Montserrat (Google Fonts)
- **Logo**: Text "TITANIC TRAVEL" + Anchor icon (lucide)
- **Images**: AI-generated, stored in `artifacts/titanic-travel/public/images/`

## Artifacts

### `artifacts/titanic-travel` (web, preview: `/`)

Full-featured airline booking frontend. Pages:
- `/` — Homepage (HeroBooking, Offers, Destinations grid, Cabin Classes, Flying Club, Footer)
- `/flights` — Real-time flight search with results from DB, "Select" leads to booking
- `/holidays` — Holiday packages placeholder
- `/destinations` — Destinations grid
- `/manage` — Lookup booking by reference (real API)
- `/sign-in`, `/sign-up` — Clerk authentication
- `/account` — My Bookings (cancel), Profile Settings, Flying Club tab (auth-gated)
- `/book/:flightId` — Passenger form + booking creation (auth-gated)
- `/booking/:reference` — Booking confirmation with full details

### `artifacts/api-server` (API, base: `/api`)

Express 5 server with Clerk auth middleware. Routes:
- `GET /api/healthz` — Health check
- `GET /api/flights/search` — Search flights by origin/destination/date/cabin
- `GET /api/flights/popular` — Popular routes with lowest prices
- `GET /api/flights/:id` — Single flight details
- `GET /api/bookings` — User's bookings (auth)
- `POST /api/bookings` — Create booking (auth)
- `GET /api/bookings/:reference` — Lookup by reference code
- `PATCH /api/bookings/:id/cancel` — Cancel booking (auth)
- `GET /api/users/profile` — User profile (auth, auto-creates on first call)
- `PATCH /api/users/profile` — Update profile (auth)

## Database Schema (`lib/db/src/schema/`)

- `flights` — Schedule, pricing, cabin class, seat count
- `bookings` — Reference code, user ID (Clerk), flight FK, status, total price
- `passengers` — Per booking: name, title, type (adult/child/infant)
- `users` — Clerk ID, name, email, phone, Flying Club number + miles

## Flight Data

13 seeded flights on startup (LHR → JFK, DXB, LAX, BGI, MIA, BOM, HKG, JNB) across Economy, Premium, and Upper Class cabins.
