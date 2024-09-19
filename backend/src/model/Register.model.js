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
    required: [true, 'Date of Birth is required'] 
  },
  role:{
    type: String,
    trim: true
  },
  aadharNumber: { 
    type: String, 
    required: [true, 'Aadhar Number is required'], 
    unique: true, 
    trim: true 
  },
  panNumber: { 
    type: String, 
    required: [true, 'PAN Number is required'], 
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
    required: [true, 'Gender is required'] 
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
    required: [true, 'Address is required'], 
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
  }, // Path to the education certificate
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
    immutable: true
  },
  password: { 
    type: String, 
    immutable: true
  },

  // Status field to track registration status
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Blocked'], 
    default: 'Pending' 
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  }
  

}, {
  timestamps: true
});

// Create the model from the schema
export const Register = mongoose.model('Register', registerSchema);
