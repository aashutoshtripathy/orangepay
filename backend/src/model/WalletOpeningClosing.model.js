import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema for Opening and Closing Balance
const WalletOpeningClosingSchema = new Schema({
  userId: {
    type: String,
    required: false
  },
  uniqueId: {
    type: String,
    required: false,
  },
  openingBalance: {
    type: String, // Opening balance
    required: false,
    min: 0
  },
  closingBalance: {
    type: String, // Closing balance
    required: false,
    min: 0
  },
  date: {
    type: Date, // Date for which the balance is recorded
    default: Date.now,
    required: false
  }
});




export const WalletOpeningClosing = mongoose.model('WalletOpeningClosing', WalletOpeningClosingSchema);
