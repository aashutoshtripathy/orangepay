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
    required: false,
    unique: true 
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
    type: String, 
    // required: false
    // enum: ['Cash', 'Upi', 'Card'], 

  },
  paymentstatus: {
    type: String, 
    // required: false
  },
  createdon: {
    type: Date, 
    default: Date.now
  },
  createdby: {
    type: String, 
    required: false
  },
  billpoststatus: {
    type: String,
    enum: ['Success', 'Pending', 'Failed'], 
    // required: false
  },
  paidamount: {
    type: String, 
    required: false
  },
  reciptno: {
    type: String,
    // enum: ['Success', 'Pending', 'Failed'], 
    required: false
  },
  billposton: {
    type: Date, 
    default: Date.now
  },
  getway: {
    type: String, 
    // required: false
    enum: ['wallet', 'ezetap', 'Upi-Qr'], 

  },
  cardtxntype: {
    type: String,
    required: false 
  },
  terminalid: {
    type: String, 
    required: false
  },
  mid: {
    type: String,
    // enum: ['cash', 'ezytap', 'ccard'], 
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
    type: String, 
    required: false
  },
  vpa: {
    type: String,
    required: false
  },
  billamount: {
    type: Number,
    required: false
  },
  paymentdate: {
    type: Date,
    default: Date.now(),
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  fetchtype: {
    type: String,
    required: false
  },
  consumermob: {
    type: String, 
    required: false
  },
  ltht: {
    type: String, 
    required: false
  },
  duedate: {
    type: String, 
    required: false
  },
  brandcode: {
    type: String,
    required: false
  },
  division: {
    type: String,
    required: false
  },
  subdivision: {
    type: String,
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
  },
  balanceAfterDeduction: { type: Number },
  balanceAfterCommission: { type: Number },
});


export const Payment = mongoose.model('Payment', paymentSchema);
