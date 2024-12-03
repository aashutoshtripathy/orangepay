import mongoose from "mongoose";
import { Schema } from "mongoose";

const fundRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uniqueId: { type: String, required: true },
    fundAmount: {
      type: Number,
      required: true,
      min: [0, "Fund amount cannot be negative"],
    },
    datePayment: {
      type: String,
      required: true,
      trim: true,
    },
    bankReference: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["bank-transfer","cdm", "upi", "card", "paypal", "cash"],
      required: true,
    },
    txnId:{
      type:String,
      required: false
    },
    bankName: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    photograph:{
      type: String,
    },
  },
  { timestamps: true }
);

export const FundRequest = mongoose.model("FundRequest", fundRequestSchema);
