import { Router, type IRouter } from "express";
import { eq, and, or, ilike } from "drizzle-orm";
import { db } from "@workspace/db";
import { flightsTable } from "@workspace/db";
import {
  SearchFlightsQueryParams,
  SearchFlightsResponse,
  GetFlightParams,
  GetFlightResponse,
  GetPopularRoutesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/flights/popular", async (_req, res): Promise<void> => {
  const flights = await db.select().from(flightsTable).where(eq(flightsTable.cabinClass, "economy"));
  const routeMap = new Map<string, typeof flights[0]>();
  for (const f of flights) {
    const key = `${f.originCode}-${f.destinationCode}`;
    if (!routeMap.has(key)) routeMap.set(key, f);
  }
  const routes = Array.from(routeMap.values()).map((f) => ({
    origin: f.origin,
    originCode: f.originCode,
    destination: f.destination,
    destinationCode: f.destinationCode,
    fromPrice: parseFloat(f.price),
    imageUrl: f.imageUrl ?? "/images/hero-bg.png",
  }));
  res.json(GetPopularRoutesResponse.parse(routes));
});

router.get("/flights/search", async (req, res): Promise<void> => {
  const parsed = SearchFlightsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { origin, destination, departDate, cabinClass } = parsed.data;

  const conditions = [];

  if (origin) {
    conditions.push(
      or(
        ilike(flightsTable.originCode, `%${origin}%`),
        ilike(flightsTable.origin, `%${origin}%`),
      )!,
    );
  }

  if (destination) {
    conditions.push(
      or(
        ilike(flightsTable.destinationCode, `%${destination}%`),
        ilike(flightsTable.destination, `%${destination}%`),
      )!,
    );
  }

  if (departDate) conditions.push(eq(flightsTable.departDate, departDate));
  if (cabinClass && cabinClass !== "any") conditions.push(eq(flightsTable.cabinClass, cabinClass));

  const flights = conditions.length > 0
    ? await db.select().from(flightsTable).where(and(...conditions))
    : await db.select().from(flightsTable);

  const result = flights.map((f) => ({
    ...f,
    price: parseFloat(f.price),
  }));

  res.json(SearchFlightsResponse.parse(result));
});

router.get("/flights/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetFlightParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [flight] = await db.select().from(flightsTable).where(eq(flightsTable.id, params.data.id));
  if (!flight) {
    res.status(404).json({ error: "Flight not found" });
    return;
  }

  res.json(GetFlightResponse.parse({ ...flight, price: parseFloat(flight.price) }));
});

export default router;