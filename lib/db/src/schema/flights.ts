import { pgTable, text, serial, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const flightsTable = pgTable("flights", {
  id: serial("id").primaryKey(),
  flightNumber: text("flight_number").notNull(),
  origin: text("origin").notNull(),
  originCode: text("origin_code").notNull(),
  destination: text("destination").notNull(),
  destinationCode: text("destination_code").notNull(),
  departDate: text("depart_date").notNull(),
  departTime: text("depart_time").notNull(),
  arriveTime: text("arrive_time").notNull(),
  duration: text("duration").notNull(),
  cabinClass: text("cabin_class").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  seatsAvailable: integer("seats_available").notNull().default(50),
  aircraft: text("aircraft").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFlightSchema = createInsertSchema(flightsTable).omit({ id: true, createdAt: true });
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flightsTable.$inferSelect;
