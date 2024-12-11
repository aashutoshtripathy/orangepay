import mongoose from "mongoose";
import { Schema } from "mongoose";


const cancellationDetailSchema = new Schema({
  userId: {
    type: String,
    required: false, // Assuming userId is a required field
  },
  uniqueId:{
    type: String,
    required: false,
  },
  netCommission:{
    type: String,
    required:false
  },
  transactionId: {
    type: String,
    required: false, // Assuming transactionId is a required field
  },
  remarks: {
    type: String,
    required: false, // Assuming transactionId is a required field
  },
  consumerNumber: {
    type: String,
    required: false, // Assuming consumerNumber is a required field
  },
  consumerName: {
    type: String,
    required: false, // Assuming consumerName is a required field
  },
  paymentMode: {
    type: String,
    required: false, // Assuming paymentMode is a required field
  },
  paymentAmount: {
    type: Number,
    required: false, // Assuming paymentAmount is a required field
  },
  paymentStatus: {
    type: String,
    required: false, // Assuming paymentStatus is a required field
  },
  createdOn: {
    type: Date,
    default: Date.now, // Set the default to current date
  },
  selectedOption: {
    type: String,
    required: false, // Assuming selectedOption is a required field
  },
  documents: {
    image1: { type: String, default: null },
    image2: { type: String, default: null },
    image3: { type: String, default: null },
  }
  });


  export const CancellationDetail = mongoose.model("CancellationDetail", cancellationDetailSchema);
