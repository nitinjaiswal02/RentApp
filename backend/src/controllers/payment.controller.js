import { Payment } from "../models/Payment.js";
import { Tenant } from "../models/Tenant.js";

export async function createPayment(req, res) {
  try {
    const { tenantId, amountPaid, date } = req.body;
    if (!tenantId || amountPaid == null || !date)
      return res.status(400).json({ error: "Missing required fields" });

    const tenant = await Tenant.findOne({ _id: tenantId, userId: req.user.uid });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const payment = new Payment({ tenantId, amountPaid, date: new Date(date), userId: req.user.uid });
    await payment.save();

    tenant.payments.push(payment._id);
    await tenant.save();

    res.status(201).json(payment);
  } catch (err) {
    console.error("Add payment error:", err);
    res.status(500).json({ error: "Failed to record payment" });
  }
}

export async function getPaymentsByTenant(req, res) {
  try {
    const { tenantId } = req.params;
    const tenant = await Tenant.findOne({ _id: tenantId, userId: req.user.uid });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const payments = await Payment.find({ tenantId, userId: req.user.uid })
      .select("amountPaid date")
      .sort({ date: -1 });

    res.json({ tenantId, payments });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
}

export async function getAllPayments(req, res) {
  try {
    const payments = await Payment.find({ userId: req.user.uid })
      .populate("tenantId", "name")
      .select("tenantId amountPaid date")
      .sort({ date: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
}