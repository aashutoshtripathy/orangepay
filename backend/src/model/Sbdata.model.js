import mongoose from "mongoose";
import { Schema } from "mongoose";


const SbdataSchema = new Schema({
  ConsumerId: {
      type: String,  // Use Number for Int32
      required: true,
      unique: true,
    },
    ConsumerName: {
      type: String,  // Use String for text fields
      required: true,
    },
    Address: {
      type: String,
    },
    MobileNo: {
      type: Number,  // Use Number for Int64 (Mobile Numbers)
    },
    DivisionName: {
      type: String,
    },
    SubDivision: {
      type: String,
    },
    PostCode: {
      type: String,
    },
    EmailId: {
      type: String,
    },
    Traiff: {
      type: String,
    },
    Section: {
      type: String,
    },
    SancLoad: {
      type: String,
    },
    ContractDemand: {
      type: String,
    },
    Phase: {
      type: String,
    },
    ConnectionType: {
      type: String,
    },
    MeterNumber: {
      type: String,
    },
    ConnectionDate: {
      type: String,  // You might want to store dates in Date format
    },
    RuralUrban: {
      type: String,
    },
    companyName:{
      type: String,
    },
      billMonth:{
        type: String,
      },
      amount:{
        type:String,
      },
      dueDate:{
        type: String,
      },
      invoiceNo:{
        type: String,
      },
    ActNo: {
      type: String,
    },
    CreatedOn: {
      type: Date,  // Use Date for storing date information
      default: Date.now,
    },
  },

);
  
  // Create the model
  export const Sbdata = mongoose.model('Sbdata', SbdataSchema);
