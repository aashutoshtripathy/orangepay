import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define location schema (if required)
// const locationSchema = new Schema({
//   latitude: {
//     type: Number,
//     required: true,
//   },
//   longitude: {
//     type: Number,
//     required: true,
//   },
// });

const invoiceSchema = new Schema({
  CANumber: {
    type: String,
    required: true,
  },
  InvoiceNO: {
    type: String,
    required: true,
  },
  BillMonth: {
    type: String,
    // required: true,
  },
  TxnId: {
    type: String,
    required: true,
  },
  BankReferenceCode: {
    type: String,
  },
  BankID: {
    type: String,
  },
  PaymentMode: {
    type: String,
    enum: ['CASH', 'UPI', 'CARD', 'WALLET'],
    required: true,
  },
  PaymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    required: true,
  },
  CreatedOn: {
    type: Date,
    default: Date.now,
  },
  CreatedBy: {
    type: String,
    required: true,
  },
  BillPostStatus: {
    type: String,
    enum: ['Pending', 'Posted'],
    required: true,
  },
  PaidAmount: {
    type: Number,
    // required: true,
  },
  ReceiptNo: {
    type: String,
  },
  BillPostOn: {
    type: Date,
  },
  Gateway: {
    type: String,
  },
  cardTxnTypeDesc: {
    type: String,
  },
  TerminalID: {
    type: String,
  },
  MId: {
    type: String,
  },
  nameOnCard: {
    type: String,
  },
  Remarks: {
    type: String,
  },
  LoginId: {
    type: String,
    required: true,
  },
  RRN: {
    type: String,
  },
  VPA: {
    type: String,
  },
  // latitude: {
  //   type: Number,
  //   // required: true,
  // },
  // longitude: {
  //   type: Number,
  //   // required: true,
  // },
  BillAmount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
  },
  // Correct location field by referring to the locationSchema
  // location: {
  //   type: locationSchema,
  //   // required: true,
  // },
  FetchType: {
    type: String,
  },
  ConsumerMobileNo: {
    type: String,
    // required: true,
  },
  LT_HT: {
    type: String,
  },
  DueDate: {
    type: Date,
  },
  BrandCode: {
    type: String,
  },
  Division: {
    type: String,
  },
  SubDiv: {
    type: String,
  },
});

export const Invoice = mongoose.model("Invoice", invoiceSchema);
