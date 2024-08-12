import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema for the registration form
const registerSchema = new Schema({
  name: { type: String, required: true },
  fatherOrHusbandName: { type: String },
  dob: { type: Date },
  aadharNumber: { type: String },
  panNumber: { type: String },
  mobileNumber: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  education: { type: [String] },
  address: { type: String },
  salaryBasis: { type: String },
  email: { type: String },
  division: { type: String },
  subDivision: { type: String },
  section: { type: String },
  sectionType: { type: String },
  
  // Store the file paths as strings
  photograph: { type: String }, // Path to the photograph
  aadharCard: { type: String }, // Path to the Aadhar card
  panCard: { type: String }, // Path to the PAN card
  educationCertificate: { type: String }, // Path to the education certificate
  cheque: { type: String }, // Path to the cheque

}, {
  timestamps: true
});


// Create the model from the schema
export const Register = mongoose.model('Register', registerSchema);
