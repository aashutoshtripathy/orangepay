import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the Payment Schema with extended fields
const paymentSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  referenceNumber: {
    type: String,
    required: true,
  },
  lowerLevel: {
    type: String,
  },
  upperLevel: {
    type: String,
  },
  transactionDateTime: {
    type: Date,
    required: true,
  },
  serviceName: {
    type: String,
    enum: ['Bill Payment', 'Recharge', 'Other Services'], 
    required: true,
  },
  consumerId: {
    type: String,
    trim: true,
  },
  meterId: {
    type: String,
    trim: true,
  },
  amountBeforeDueDate: {
    type: Number,
  },
  requestAmount: {
    type: Number,
  },
  totalServiceCharge: {
    type: Number,
    default: 0,
  },
  totalCommission: {
    type: Number,
    default: 0,
  },
  netAmount: {
    type: Number,
    required: true,
  },
  actionOnAmount: {
    type: String,
    enum: ['Dr', 'Cr'],
  },
  status: {
    type: String,
    enum: ['Success', 'Pending', 'Failed'],
    required: true,
  },
  finalBalAmount: {
    type: Number,
  },
  updateDate: {
    type: Date,
  },
  portalName: {
    type: String,
  },
  gstCharge: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'ezytap', 'ccard'],
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  }
});

export const Payment = mongoose.model('Payment', paymentSchema);
