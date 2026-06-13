import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createPayment, getPaymentsByTenant, getAllPayments } from "../controllers/payment.controller.js";

const router = Router();

router.post("/", authenticateToken, createPayment);
router.get("/", authenticateToken, getAllPayments);
router.get("/:tenantId", authenticateToken, getPaymentsByTenant);

export default router;