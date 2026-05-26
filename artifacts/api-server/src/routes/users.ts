import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { getAuth } from "@clerk/express";
import { requireAuth, getOrCreateUser } from "../lib/auth";
import {
  UpdateUserProfileBody,
  GetUserProfileResponse,
  UpdateUserProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/users/profile", requireAuth, async (req, res): Promise<void> => {
  const user = await getOrCreateUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json(GetUserProfileResponse.parse({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
});

router.patch("/users/profile", requireAuth, async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  const parsed = UpdateUserProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.clerkId, userId!));
  if (!existing) {
    const user = await getOrCreateUser(req);
    if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  }

  const [updated] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.clerkId, userId!)).returning();

  res.json(UpdateUserProfileResponse.parse({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  }));
});

export default router;
