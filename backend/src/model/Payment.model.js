import mongoose from "mongoose";
import { Schema } from "mongoose";

const paymentSchema = new Schema({
  userId: {
    type: String,
    required: false
  },
  id: {
    type: String,
    // unique: false,
    required: false
  },
  canumber: {
    type: String,
    required: false
  },
  invoicenumber: {
    type: String,
    required: false
  },
  billmonth: {
    type: String,
    required: false
  },
  transactionId: {
    type: String,
    required: true,
    unique: true // Ensure this is set to enforce uniqueness
  },
  refrencenumber: {
    type: String,
    required: false
  },
  bankid: {
    type: String,
    trim: false,
    required: false
  },
  paymentmode: {
    type: String, // Payment mode could be an enum if more clarity is needed
    // required: false
    // enum: ['Cash', 'Upi', 'Card'], // Enum for predefined statuses

  },
  paymentstatus: {
    type: String, // Typically an enum for payment status, such as (0 - Failed, 1 - Success, etc.)
    // required: false
  },
  createdon: {
    type: Date, // Use Date type for timestamps
    default: Date.now
  },
  createdby: {
    type: String, // Store the creator's ID or name as String
    required: false
  },
  billpoststatus: {
    type: String,
    enum: ['Success', 'Pending', 'Failed'], // Enum for predefined statuses
    // required: false
  },
  paidamount: {
    type: String, // Typically you'd want to store paid amount as a number (Decimal128)
    required: false
  },
  reciptno: {
    type: String,
    enum: ['Success', 'Pending', 'Failed'], // Enum for receipt statuses
    required: false
  },
  billposton: {
    type: Date, // Date when the bill was posted
    default: Date.now
  },
  getway: {
    type: String, // Payment gateway, usually stored as a string (e.g., gateway name)
    // required: false
    enum: ['wallet', 'ezetap', 'Upi-Qr'], // Enum for predefined statuses

  },
  cardtxntype: {
    type: String,
    required: false // Optional field, could be null if not using card
  },
  terminalid: {
    type: String, // Store as String in case of terminal-specific information
    required: false
  },
  mid: {
    type: String,
    // enum: ['cash', 'ezytap', 'ccard'], // Enum for modes of transaction
    required: false
  },
  nameoncard: {
    type: String,
    required: false
  },
  remarks: {
    type: String,
    required: false
  },
  loginid: {
    type: String,
    required: false
  },
  rrn: {
    type: String, // RRN (Reference Retrieval Number) as a string
    required: false
  },
  vpa: {
    type: String, // VPA (Virtual Payment Address) for UPI transactions
    required: false
  },
  billamount: {
    type: Number, // Bill amount should be stored as a number
    required: false
  },
  paymentdate: {
    type: Date,
    default: Date.now
  },
  latitude: {
    type: Number, // Geolocation coordinates as Number
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  fetchtype: {
    type: String, // How the data was fetched, e.g., 'Manual', 'API'
    required: false
  },
  consumermob: {
    type: String, // Consumer mobile number
    required: false
  },
  ltht: {
    type: String, // Low Tension (LT) or High Tension (HT) customer type
    required: false
  },
  duedate: {
    type: String, // Bill due date
    required: false
  },
  brandcode: {
    type: String, // Brand-specific code, if applicable
    required: false
  },
  division: {
    type: String, // Division details
    required: false
  },
  subdivision: {
    type: String, // Sub-division details
    required: false
  },
  consumerName: {
    type: String,
    required: false
  },
  commission: {
    type: String,
    required: false
  },
  tds: {
    type: String,
    required: false
  },
  netCommission: {
    type: String,
    required: false
  }
});

// Export the model
export const Payment = mongoose.model('Payment', paymentSchema);
