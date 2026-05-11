import { Router } from "express";
import { getApiStatus, getDatabaseStatus } from "../controllers/testController.js";

const router = Router();

router.get("/status", getApiStatus);
router.get("/db", getDatabaseStatus);

export default router;
