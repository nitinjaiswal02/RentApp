import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const tenantSchema = new Schema({
  name:        { type: String, required: true },
  contact:     { type: String, required: true },
  propertyId:  { type: Types.ObjectId, ref: "Property", required: true },
  rentDueDate: { type: Date, required: true },
  payments:    [{ type: Types.ObjectId, ref: "Payment" }],
  userId:      { type: String, required: true },
});

export const Tenant = model("Tenant", tenantSchema);