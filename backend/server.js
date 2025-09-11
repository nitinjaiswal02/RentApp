// server.js  (REPLACE CONTENTS)
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Property, Tenant, Payment } from "./db.js"; 
import cors from "cors";
import { authenticateToken } from "./auth.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// CORS (so that frontend can call )
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(bodyParser.json());

//  MongoDB connection
const MONGODB_URI = process.env.MONGO_URI ;
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Auth: Firebase protected "who am I"
app.get("/api/me", authenticateToken, (req, res) => {
  // req.user is the decoded Firebase token
  res.json({
    success: true,
    user: {
      uid: req.user.uid,
      email: req.user.email || null,
      emailVerified: !!req.user.email_verified,
    },
  });
});

// PROPERTIES 
app.post("/api/properties", authenticateToken, async (req, res) => {
  try {
    const { name, address, rentAmount, type } = req.body;
    if (!name || !address || !rentAmount || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const property = new Property({
      name,
      address,
      rentAmount,
      type,
      tenants: [],
      userId: req.user.uid, // tie to Firebase user
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: "Failed to create property" });
  }
});

app.get("/api/properties", authenticateToken, async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.uid }).populate({
      path: "tenants",
      select: "name contact rentDueDate",
    });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// ========== TENANTS ==========
app.post("/api/tenants", authenticateToken, async (req, res) => {
  try {
    const { name, contact, propertyId, rentDueDate } = req.body;
    if (!name || !contact || !propertyId || !rentDueDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate property belongs to this user
    const property = await Property.findOne({ _id: propertyId, userId: req.user.uid });
    if (!property) return res.status(404).json({ error: "Property not found" });

    const tenant = new Tenant({
      name,
      contact,
      propertyId,
      rentDueDate: new Date(rentDueDate),
      payments: [],
      userId: req.user.uid,
    });
    await tenant.save();

    property.tenants.push(tenant._id);
    await property.save();

    res.status(201).json(tenant);
  } catch (err) {
    res.status(500).json({ error: "Failed to create tenant" });
  }
});

app.get("/api/tenants", authenticateToken, async (req, res) => {
  try {
    const tenants = await Tenant.find({ userId: req.user.uid })
      .populate({ path: "propertyId", select: "name address rentAmount type" })
      .populate({ path: "payments", select: "amountPaid date" });

    // just return data
    const result = tenants.map((t) => ({
      _id: t._id,
      name: t.name,
      contact: t.contact,
      rentDueDate: t.rentDueDate,
      property: t.propertyId,
      payments: t.payments,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
});

// ========== PAYMENTS (amountPaid + date)
app.post("/api/payments", authenticateToken, async (req, res) => {
  try {
    const { tenantId, amountPaid, date } = req.body;
    if (!tenantId || amountPaid == null || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure tenant belongs to this user
    const tenant = await Tenant.findOne({ _id: tenantId, userId: req.user.uid });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const payment = new Payment({
      tenantId,
      amountPaid,
      date: new Date(date),
      userId: req.user.uid,
    });

    await payment.save();
    // maintain relation if your schema uses refs
    if (tenant.payments) {
      tenant.payments.push(payment._id);
      await tenant.save();
    }

    res.status(201).json(payment);
  } catch (err) {
    console.error("Add payment error:", err);
    res.status(500).json({ error: "Failed to record payment" });
  }
});

// list payments for a tenant (no summaries)
app.get("/api/payments/:tenantId", authenticateToken, async (req, res) => {
  try {
    const { tenantId } = req.params;

    // verify tenant belongs to user
    const tenant = await Tenant.findOne({ _id: tenantId, userId: req.user.uid });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const payments = await Payment.find({ tenantId, userId: req.user.uid })
      .select("amountPaid date")
      .sort({ date: -1 });

    res.json({ tenantId, payments });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// list all payments for current user
app.get("/api/payments", authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.uid })
      .populate("tenantId", "name")
      .select("tenantId amountPaid date")
      .sort({ date: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});


// now logic to delete tenant from database
app.delete("/api/tenants/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
