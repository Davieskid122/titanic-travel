import { type Request, type Response, type NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export async function getOrCreateUser(req: Request) {
  const { userId } = getAuth(req);
  if (!userId) return null;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.clerkId, userId));
  if (existing) return existing;

  let email = `user_${userId}@titanictravel.com`;
  let firstName = "Traveller";
  let lastName = "";

  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );
    if (primaryEmail) email = primaryEmail.emailAddress;
    firstName = clerkUser.firstName ?? "Traveller";
    lastName = clerkUser.lastName ?? "";
  } catch {
    // fall back to placeholder values
  }

  const flyingClubNumber = `TT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const [newUser] = await db.insert(usersTable).values({
    clerkId: userId,
    firstName,
    lastName,
    email,
    flyingClubNumber,
    flyingClubMiles: 0,
  }).returning();

  return newUser;
}

export async function getClerkEmail(userId: string): Promise<string | null> {
  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );
    return primaryEmail?.emailAddress ?? null;
  } catch {
    return null;
  }
}