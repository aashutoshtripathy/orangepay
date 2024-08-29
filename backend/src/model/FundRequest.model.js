import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema for fund requests
const fundRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Ensure you have a User model and reference it
  },
  fundAmount: {
    type: Number,
    required: true,
  },
  bankReference: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['bank-transfer', 'upi', 'card', 'paypal', 'net-banking'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }
}, { timestamps: true }); // Automatically manages createdAt and updatedAt

export const FundRequest = mongoose.model('FundRequest', fundRequestSchema);
