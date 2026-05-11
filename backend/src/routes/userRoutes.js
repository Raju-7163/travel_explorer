import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser
} from "../controllers/userController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.route("/").get(asyncHandler(getUsers)).post(asyncHandler(createUser));
router
  .route("/:id")
  .get(asyncHandler(getUserById))
  .put(asyncHandler(updateUser))
  .delete(asyncHandler(deleteUser));

export default router;
