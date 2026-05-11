import { Router } from "express";
import {
  createTrip,
  deleteTrip,
  getTripById,
  getTrips,
  updateTrip
} from "../controllers/tripController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.route("/").get(asyncHandler(getTrips)).post(asyncHandler(createTrip));
router
  .route("/:id")
  .get(asyncHandler(getTripById))
  .put(asyncHandler(updateTrip))
  .delete(asyncHandler(deleteTrip));

export default router;
