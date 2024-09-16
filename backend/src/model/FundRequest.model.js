import mongoose from "mongoose";
import { Schema } from "mongoose";

// // Define the schema for fund requests
// const fundRequestSchema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId, // Use ObjectId for referencing
//     required: true,
//     ref: 'Register', // Reference to the Register model
//   },
//   fundAmount: {
//     type: Number,
//     required: true,
//   },
//   bankReference: {
//     type: String,
//     required: true,
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['bank-transfer', 'upi', 'card', 'paypal', 'net-banking'],
//     required: true,
//   },
//   bankName: {
//     type: String,
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending',
//   }
// }, { timestamps: true }); // Automatically manages createdAt and updatedAt

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
      enum: ["bank-transfer", "upi", "card", "paypal", "cash"],
      required: true,
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
  },
  { timestamps: true }
);

export const FundRequest = mongoose.model("FundRequest", fundRequestSchema);
