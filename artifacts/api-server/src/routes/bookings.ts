import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { bookingsTable, passengersTable, flightsTable } from "@workspace/db";
import { getAuth } from "@clerk/express";
import { requireAuth, getOrCreateUser, getClerkEmail } from "../lib/auth";
import { sendBookingConfirmation } from "../lib/email";
import {
  CreateBookingBody,
  GetMyBookingsResponse,
  GetBookingByReferenceParams,
  GetBookingByReferenceResponse,
  CancelBookingParams,
  CancelBookingResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateReference(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function getBookingWithDetails(bookingId: number) {
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, bookingId));
  if (!booking) return null;
  const [flight] = await db.select().from(flightsTable).where(eq(flightsTable.id, booking.flightId));
  const passengers = await db.select().from(passengersTable).where(eq(passengersTable.bookingId, bookingId));
  return {
    ...booking,
    totalPrice: parseFloat(booking.totalPrice),
    createdAt: booking.createdAt.toISOString(),
    flight: flight ? { ...flight, price: parseFloat(flight.price) } : null,
    passengers,
  };
}

router.get("/bookings", requireAuth, async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  const userBookings = await db.select().from(bookingsTable).where(eq(bookingsTable.userId, userId!));

  const result = await Promise.all(
    userBookings.map((b) => getBookingWithDetails(b.id))
  );

  res.json(GetMyBookingsResponse.parse(result.filter(Boolean)));
});

router.post("/bookings", requireAuth, async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { flightId, cabinClass, passengers } = parsed.data;

  const [flight] = await db.select().from(flightsTable).where(eq(flightsTable.id, flightId));
  if (!flight) {
    res.status(404).json({ error: "Flight not found" });
    return;
  }

  const totalPrice = parseFloat(flight.price) * passengers.length;
  const reference = generateReference();

  const [booking] = await db.insert(bookingsTable).values({
    reference,
    userId: userId!,
    flightId,
    status: "confirmed",
    cabinClass,
    totalPrice: totalPrice.toString(),
  }).returning();

  await db.insert(passengersTable).values(
    passengers.map((p) => ({
      bookingId: booking.id,
      firstName: p.firstName,
      lastName: p.lastName,
      title: p.title,
      type: p.type,
    }))
  );

  await db.update(flightsTable).set({ seatsAvailable: flight.seatsAvailable - passengers.length }).where(eq(flightsTable.id, flightId));

  const user = await getOrCreateUser(req);

  req.log.info({ reference, userId, flightId }, "Booking created");

  const full = await getBookingWithDetails(booking.id);
  res.status(201).json(full);

  if (user && full?.flight) {
    const clerkEmail = await getClerkEmail(userId!);
    const toEmail = clerkEmail ?? user.email;
    const toName = `${user.firstName} ${user.lastName}`.trim() || "Traveller";

    sendBookingConfirmation({
      toEmail,
      toName,
      reference: full.reference,
      cabinClass: full.cabinClass,
      totalPrice: full.totalPrice,
      flight: {
        flightNumber: full.flight.flightNumber,
        origin: full.flight.origin,
        originCode: full.flight.originCode,
        destination: full.flight.destination,
        destinationCode: full.flight.destinationCode,
        departDate: full.flight.departDate,
        departTime: full.flight.departTime,
        arriveTime: full.flight.arriveTime,
        duration: full.flight.duration,
        aircraft: full.flight.aircraft,
      },
      passengers: full.passengers.map((p) => ({
        title: p.title,
        firstName: p.firstName,
        lastName: p.lastName,
        type: p.type,
      })),
    }).catch((err) => req.log.error({ err }, "Failed to send booking email"));
  }
});

router.get("/bookings/:reference", async (req, res): Promise<void> => {
  const rawRef = Array.isArray(req.params.reference) ? req.params.reference[0] : req.params.reference;
  const params = GetBookingByReferenceParams.safeParse({ reference: rawRef });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.reference, params.data.reference));
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const full = await getBookingWithDetails(booking.id);
  res.json(GetBookingByReferenceResponse.parse(full));
});

router.patch("/bookings/:id/cancel", requireAuth, async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CancelBookingParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db.select().from(bookingsTable).where(and(
    eq(bookingsTable.id, params.data.id),
    eq(bookingsTable.userId, userId!)
  ));
  if (!existing) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const [updated] = await db.update(bookingsTable).set({ status: "cancelled" }).where(eq(bookingsTable.id, params.data.id)).returning();

  const full = await getBookingWithDetails(updated.id);
  res.json(CancelBookingResponse.parse(full));
});

export default router;