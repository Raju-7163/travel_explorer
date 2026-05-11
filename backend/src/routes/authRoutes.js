import { Router } from "express";
import { getMe, login, logout, register, updateMe } from "../controllers/authController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/me", protect, asyncHandler(updateMe));

export default router;
