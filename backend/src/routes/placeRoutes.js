import { Router } from "express";
import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlaces,
  updatePlace
} from "../controllers/placeController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.route("/").get(asyncHandler(getPlaces)).post(asyncHandler(createPlace));
router
  .route("/:id")
  .get(asyncHandler(getPlaceById))
  .put(asyncHandler(updatePlace))
  .delete(asyncHandler(deletePlace));

export default router;
