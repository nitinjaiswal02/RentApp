import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createTenant, getTenants, deleteTenant } from "../controllers/tenant.controller.js";

const router = Router();

router.post("/", authenticateToken, createTenant);
router.get("/", authenticateToken, getTenants);
router.delete("/:id", authenticateToken, deleteTenant);

export default router;