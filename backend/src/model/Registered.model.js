import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema for the registration form
const registeredSchema = new Schema({
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
  userId:{type:String},
  password:{type:String},

}, {
  timestamps: true
});


// Create the model from the schema
export const Registered = mongoose.model('Registered', registeredSchema);
