import mongoose from "mongoose";
import { Schema } from "mongoose";


const transactionHistorySchema = new Schema({
  transactionId: {
    type: String,
    required: true,
  },
  referenceNumber: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['Agent', 'Distributor', 'Master Distributor'],
    required: true,
  },
  lowerLevel: {
    type: String,
    required: true,
  },
  upperLevel: {
    type: String,
    required: true,
  },
  transactionDateTime: {
    type: Date,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  amountBeforeDueDate: {
    type: Number,
    required: true,
  },
  requestAmount: {
    type: Number,
    required: true,
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
  amountAfterDueDate: {
    type: Number,
    required: true,
  },
  actionOnAmount: {
    type: String,
    enum: ['Cr', 'Dr'],
    required: true,
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'Decline'],
    required: true,
  },
  finalBalanceAmount: {
    type: Number,
    required: true,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
  updateUser: {
    type: String,
  },
  updateRemark: {
    type: String,
  },
  serviceVendor: {
    type: String,
  },
  portalName: {
    type: String,
  },
  requestIpAddress: {
    type: String,
  },
  updateIpAddress: {
    type: String,
  },
  flag: {
    type: Number,
    default: 1,
  },
  mobileNo: {
    type: String,
  },
  accountNo: {
    type: String,
  },
});

export const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);

