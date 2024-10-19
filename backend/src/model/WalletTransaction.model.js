import mongoose from "mongoose";
import { Schema } from "mongoose";

const WalletTransactionSchema = new Schema({
  userId: {
    type: String, // Store user ID as String
    required: false, // Changed to false to ensure userId is always provided
  },
  uniqueId: {
    type: String, // Store user ID as String
    required: false, // Changed to false to ensure userId is always provided
  },
  walletId: {
    type: String, // Store wallet ID as String
    required: false, // Changed to false to ensure walletId is always provided
  },
  transactions: [
    {
      transactionId: { // Adding transactionId field
        type: String,
        required: false, // Changed to false to ensure transactionId is provided
      },
      canumber: { // Adding canumber field
        type: String,
        required: false, // Changed to false to ensure canumber is provided
      },
      invoicenumber: { // Adding invoicenumber field
        type: String,
        required: false, // Changed to false to ensure invoicenumber is provided
      },
      billmonth: { // Adding billmonth field
        type: String,
        required: false, // Changed to false to ensure billmonth is provided
      },
      refrencenumber: { // Adding refrencenumber field
        type: String,
        required: false, // Changed to false to ensure refrencenumber is provided
      },
      bankid: { // Adding bankid field
        type: String,
        required: false, // Changed to false to ensure bankid is provided
      },
      paymentmode: { // Adding paymentmode field
        type: String,
        required: false, // Changed to false to ensure paymentmode is provided
      },
      paymentstatus: { // Adding paymentstatus field
        type: String,
        required: false, // Changed to false to ensure paymentstatus is provided
      },
      amount: {
        type: String,
        required: false, // Changed to false to ensure amount is always provided
        default: '0', // Use string '0' to match type
      },
      commission: {
        type: String,
        required: false, // Changed to false to ensure amount is always provided
        default: '0', // Use string '0' to match type
      },
      type: {
        type: String,
        enum: ['credit', 'Debit'], // Transaction type
        required: false, // Changed to false to ensure type is provided
      },
      date: {
        type: Date,
        default: Date.now, // Default to current date
      },
      description: {
        type: String,
        default: '', // Optional description
      },
      openingBalance: { // Add opening balance field
        type: String,
        required: false, // Changed to false to ensure openingBalance is provided
      },
      closingBalance: { // Add closing balance field
        type: String,
        required: false, // Changed to false to ensure closingBalance is provided
      }
    }
  ]
});

export const WalletTransaction = mongoose.model('WalletTransaction', WalletTransactionSchema);
