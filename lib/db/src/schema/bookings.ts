import { pgTable, text, serial, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { flightsTable } from "./flights";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  userId: text("user_id").notNull(),
  flightId: integer("flight_id").notNull().references(() => flightsTable.id),
  status: text("status").notNull().default("confirmed"),
  cabinClass: text("cabin_class").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const passengersTable = pgTable("passengers", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookingsTable.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull().default("adult"),
  seatNumber: text("seat_number"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPassengerSchema = createInsertSchema(passengersTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertPassenger = z.infer<typeof insertPassengerSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
export type Passenger = typeof passengersTable.$inferSelect;
