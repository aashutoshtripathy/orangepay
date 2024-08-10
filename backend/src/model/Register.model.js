import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema for the registration form
const registerSchema = new Schema({
  name: { type: String, required:true },
  fatherOrHusbandName: { type: String, required: false },
  dob: { type: Date, required: false },
  aadharNumber: { type: String, required: false },
  panNumber: { type: String, required: false },
  mobileNumber: { type: String, required: false },
  gender: { type: String, required: false },
  maritalStatus: { type: String, required: false },
  education: { type: [String],  required: false },
  address: { type: String, required: false },
  salaryBasis: { type: String, required: false },
  email: { type: String, required: false },
  division: { type: String, required: false },
  subDivision: { type: String, required: false },
  section: { type: String, required: false },
  sectionType: { type: String, required: false },
  
  // File references
  photograph: { type: Object }, // Store URL or path
  aadharCard: { type: Object }, // Store URL or path
  panCard: { type: Object }, // Store URL or path
  educationCertificate: { type: Object }, // Store URL or path
  cheque: { type: Object }, // Store URL or path

}, {
  timestamps: false // Automatically add createdAt and updatedAt fields
});

// Create the model from the schema
export const Register = mongoose.model('Register', registerSchema);
