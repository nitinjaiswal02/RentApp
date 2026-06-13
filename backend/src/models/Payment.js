import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const paymentSchema = new Schema({
  tenantId:   { 
    type: Types.ObjectId, ref: "Tenant", required: true 
},
  amountPaid: { 
    type: Number, required: true 
},
  date:       { 
    type: Date, required: true 
},
  userId:     { 
    type: String, required: true 
},
});

export const Payment = model("Payment", paymentSchema);