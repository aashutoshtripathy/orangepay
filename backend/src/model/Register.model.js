import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema for the registration form
const registerSchema = new Schema({
  name: { type: String, required: true },
  fatherOrHusbandName: { type: String, required: true },
  dob: { type: Date, required: true },
  aadharNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Other'], required: true },
  education: { type: [String], enum: ['Graduate & Above', 'Class 12th', 'Other'], required: true },
  address: { type: String, required: true },
  salaryBasis: { type: String, enum: ['Salary', 'Commission'], required: true },
  email: { type: String, required: true, unique: true },
  division: { type: String, required: true },
  subDivision: { type: String, required: true },
  section: { type: String, required: true },
  sectionType: { type: String, enum: ['Urban', 'Rural', 'Both'], required: true },
  
  // File references
  photograph: { type: String }, // Store URL or path
  aadharCard: { type: String }, // Store URL or path
  panCard: { type: String }, // Store URL or path
  educationCertificate: { type: String }, // Store URL or path
  cheque: { type: String }, // Store URL or path

}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the model from the schema
export const Register = mongoose.model('Register', registerSchema);
