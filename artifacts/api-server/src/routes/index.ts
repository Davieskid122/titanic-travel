import { Router, type IRouter } from "express";
import healthRouter from "./health";
import flightsRouter from "./flights";
import bookingsRouter from "./bookings";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(flightsRouter);
router.use(bookingsRouter);
router.use(usersRouter);

export default router;
