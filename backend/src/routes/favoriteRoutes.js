import { Router } from "express";
import {
  getFavoriteStatus,
  getFavorites,
  removeFavorite,
  saveFavorite
} from "../controllers/favoriteController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", asyncHandler(getFavorites));
router.post("/", asyncHandler(saveFavorite));
router.get("/:placeId/status", asyncHandler(getFavoriteStatus));
router.delete("/:placeId", asyncHandler(removeFavorite));

export default router;
