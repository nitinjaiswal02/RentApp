import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const propertySchema = new Schema({
  name:       { type: String, required: true },
  address:    { type: String, required: true },
  rentAmount: { type: Number, required: true },
  type:       { type: String, required: true },
  tenants:    [{ type: Types.ObjectId, ref: "Tenant" }],
  userId:     { type: String, required: true },
});

export const Property = model("Property", propertySchema);