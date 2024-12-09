import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema for the registration form with validation and status
const registerSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  fatherOrHusbandName: { 
    type: String, 
    trim: true 
  },
  dob: { 
    type: Date, 
    // required: [true, 'Date of Birth is required'] 
  },
  role:{
    type: String,
    trim: true
  },
  aadharNumber: {   
    type: String, 
    sparse: true,
    trim: true 
    // required: [true, "Aadhar Number is required"], 
    // unique: true, 
  },

  panNumber: { 
    type: String, 
    trim: true 
  },
  mobileNumber: { 
    type: String, 
    required: [true, 'Mobile Number is required'], 
    unique: true, 
    trim: true 
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'], 
  },
  maritalStatus: { 
    type: String, 
    enum: ['Single', 'Married', 'Divorced'] 
  },
  education: { 
    type: [String], 
    default: [] 
  },
  address: { 
    type: String, 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    trim: true, 
    lowercase: true, 
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] 
  },
  division: { 
    type: String, 
    trim: true 
  },
  remarks:{
    type: String
  },
  subDivision: { 
    type: String, 
    trim: true 
  },
  section: { 
    type: String, 
    trim: true 
  },
  consumerId: { 
    type: String, 
    trim: true 
  },
  sectionType: { 
    type: String, 
    trim: true 
  },
  district: { 
    type: String, 
    trim: true 
  },
  otp: { 
    type: String, 
    trim: true 
  },
  pincode: { 
    type: String, 
    trim: true 
  },
  bank: { 
    type: String, 
    trim: true 
  },
  accountno: { 
    type: String, 
    trim: true 
  },
  tpin: { 
    type: String, 
    trim: true 
  },
  ifsc: { 
    type: String, 
    trim: true 
  },
  
  // Store the file paths as strings
  photograph: { 
    type: String, 
    trim: true 
  }, // Path to the photograph
  aadharCard: { 
    type: String, 
    trim: true 
  }, // Path to the Aadhar card
  panCard: { 
    type: String, 
    trim: true 
  }, // Path to the PAN card
  educationCertificate: { 
    type: String, 
    trim: true 
  }, 
 
  cheque: { 
    type: String, 
    trim: true 
  }, // Path to the cheque
  signature: { 
    type: String, 
    trim: true 
  }, // Path to the cheque
  discom: { 
    type: String, 
    trim: true 
  }, // Path to the cheque
  // New fields
  userId: { 
    type: String, 
    trim: true ,
  },
  password: { 
    type: String, 
  },

  // Status field to track registration status
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Blocked' , 'Activated'], 
    default: 'Pending' 
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  },


  topup: {
    type: Boolean,
    default: true
  },
  billPayment: {
    type: Boolean,
    default: true
  },
  requestCancellation: {
    type: Boolean,
    default: true
  },
  getPrepaidBalance: {
    type: Boolean,
    default: true
  },
  fundRequest: {
    type: Boolean,
    default: true
  },
  bankTransfer: {
    type: Boolean,
    default: true
  },
  upi: {
    type: Boolean,
    default: true
  },
  cash: {
    type: Boolean,
    default: true
  },
  cdm: {
    type: Boolean,
    default: true
  },
  wallet: {
    type: Boolean,
    default: true
  },
  ezetap: {
    type: Boolean,
    default: true
  },
  upiQr: {
    type: Boolean,
    default: true
  },
  rrn: {
    type: Boolean,
    default: true
  },

  loggedOut: {
    type: Boolean,
    default: false // Default to false
  },
  margin:{
    type: Number,
    default: 0
  },
  

}, {
  timestamps: true
});


// Pre-update hook to set loggedOut to true conditionally
// registerSchema.pre(['findOneAndUpdate', 'updateOne'], function (next) {
//   const update = this.getUpdate();
  
//   // Handle $set, $unset, or direct updates
//   const setFields = update.$set || update;

//   // Check if any of the specific fields are included in the update
//   const shouldLogoutUser = ['topup', 'billPayment', 'requestCancellation', 'getPrepaidBalance', 'fundRequest'].some(field => {
//     return Object.keys(setFields).includes(field);
//   });

//   if (shouldLogoutUser) {
//     // Ensure that loggedOut is updated when any of these fields are modified
//     if (!update.$set) {
//       update.$set = {};
//     }
//     update.$set.loggedOut = true; // Set loggedOut to true
//   }

//   next();
// });


// Create the model from the schema
export const Register = mongoose.model('Register', registerSchema);
