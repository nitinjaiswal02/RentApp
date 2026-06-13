import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createProperty, getProperties } from "../controllers/property.controller.js";

const router = Router();

router.post("/", authenticateToken, createProperty);
router.get("/", authenticateToken, getProperties);

export default router;