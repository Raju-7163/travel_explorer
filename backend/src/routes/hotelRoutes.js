import { Router } from "express";
import { getNearbyHotels } from "../controllers/hotelController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.get("/nearby", asyncHandler(getNearbyHotels));

export default router;
