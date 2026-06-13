// src/app.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { connectDB } from "./config/db.js";
import propertyRoutes from "./routes/property.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { authenticateToken } from "./middleware/auth.js";

connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ["https://rent-app-ecru-nine.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(bodyParser.json());

// Test auth route
app.get("/api/me", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      uid: req.user.uid,
      email: req.user.email || null,
      emailVerified: !!req.user.email_verified,
    },
  });
});

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/payments", paymentRoutes);

export default app;