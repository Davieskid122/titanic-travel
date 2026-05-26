import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// Import all schema tables directly
import { flightsTable } from "./schema/flights";
import { bookingsTable, passengersTable } from "./schema/bookings";
import { usersTable } from "./schema/users";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Combine schema for drizzle
const schema = {
  flightsTable,
  bookingsTable,
  passengersTable,
  usersTable,
};

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Re-export schema types
export { flightsTable, bookingsTable, passengersTable, usersTable };
export * from "./schema/flights";
export * from "./schema/bookings";
export * from "./schema/users";