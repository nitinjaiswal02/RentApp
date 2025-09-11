import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

// Property Schema
const propertySchema = new Schema({
  name: { type: String, required: true }, 
  address: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  type: { type: String, required: true },
  tenants: [{ type: Types.ObjectId, ref: "Tenant" }],
  userId: { type: String, required: true }, // Firebase UID
});
export const Property = model("Property", propertySchema);

// Tenant Schema
const tenantSchema = new Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  propertyId: { type: Types.ObjectId, ref: "Property", required: true },
  rentDueDate: { type: Date, required: true },
  payments: [{ type: Types.ObjectId, ref: "Payment" }],
  userId: { type: String, required: true }, // Firebase UID
});
export const Tenant = model("Tenant", tenantSchema);

// Payment Schema (simplified: only amountPaid + date)
const paymentSchema = new Schema({
  tenantId: { type: Types.ObjectId, ref: "Tenant", required: true },
  amountPaid: { type: Number, required: true },
  date: { type: Date, required: true },
  userId: { type: String, required: true }, // Firebase UID
});
export const Payment = model("Payment", paymentSchema);


