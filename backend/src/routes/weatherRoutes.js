import { Router } from "express";
import { getCurrentWeather } from "../controllers/weatherController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.get("/current", asyncHandler(getCurrentWeather));

export default router;
