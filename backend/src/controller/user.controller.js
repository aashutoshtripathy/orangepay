import { Register } from "../model/Register.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import upload from "../middleware/filehandle.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import crypto from 'crypto';
import twilio from 'twilio';
import fs from 'fs';
import { Registered } from "../model/Registered.model.js";
import { Transaction } from "../model/Transaction.model.js";
import { Wallet } from "../model/Wallet.model.js";
import { FundRequest } from "../model/FundRequest.model.js";
import archiver from "archiver";
import { fileURLToPath } from 'url';
import { isValidObjectId } from "mongoose";
import axios from "axios";
import { Invoice } from "../model/Invoice.model.js";
import { Payment } from "../model/Payment.model.js";
import { CancellationDetail } from "../model/CancellationDetail.model.js";
import { Sb } from "../model/Sb.Model.js";
import { Sbdata } from "../model/Sbdata.model.js";
import { WalletTransaction } from "../model/WalletTransaction.model.js";
// import path from 'path';

// Define __dirname in ES module



const sessionStore = new Map();




// app.use('/public', express.static(path.join(__dirname, 'public')));



// const accountSid = 'your_account_sid'; // Your Twilio Account SID
// const authToken = 'your_auth_token';   // Your Twilio Auth Token
// const twilioClient = twilio(accountSid, authToken);
// const twilioPhoneNumber = 'your_twilio_phone_number'; 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const aadharNumber = req.body.aadharNumber;
    const dir = path.join('public/images', aadharNumber);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Unique filename with timestamp
  }
});

// Initialize Multer upload middleware
const upload = multer({ storage }).fields([
  { name: 'photograph', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'educationCertificate', maxCount: 1 },
  { name: 'cheque', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  
]);

// User registration handler
const registerUser = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json(new ApiError(400, "File upload failed"));
    }

    const {
      name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
      gender, maritalStatus, education, address, salaryBasis, email, division,
      subDivision, section, sectionType, ifsc, district, pincode, bank, accountno, consumerId, role, discom,
    } = req.body;
    console.log(req.body)
    // Check for existing user
    // const existedUser = await Register.findOne({
    //     $or: [{ mobileNumber }, { aadharNumber }]
    // });

    // if (existedUser) {
    //     throw new ApiError(400, "Mobile number or Aadhar number already exists");
    // }

    // Create new user


    const existedUser = await Register.findOne({
      $or: [{ mobileNumber }, { aadharNumber }]
    });
    if (existedUser) {
      throw new ApiError(400, "Mobile number or Aadhar number already exists");
    }


    const user = await Register.create({
      name, fatherOrHusbandName, dob, role, aadharNumber, panNumber, mobileNumber,
      gender, maritalStatus, education, address, salaryBasis, email, division,
      subDivision, section, sectionType, ifsc, district, pincode, bank, accountno, discom, consumerId,
      photograph: req.files['photograph'] ? req.files['photograph'][0].path : null,
      aadharCard: req.files['aadharCard'] ? req.files['aadharCard'][0].path : null,
      panCard: req.files['panCard'] ? req.files['panCard'][0].path : null,
      educationCertificate: req.files['educationCertificate'] ? req.files['educationCertificate'][0].path : null,
      cheque: req.files['cheque'] ? req.files['cheque'][0].path : null,
      signature: req.files['signature'] ? req.files['signature'][0].path : null
    });
    console.log(req.files)
    // Send success response
    return res.status(201).json(
      new ApiResponse(201, user, "User Registered Successfully")
    );
  });
});





const registerSAdmin = asyncHandler(async (req, res) => {
  const { name, email, mnumber, password, role ,aadharNumber } = req.body;

  console.log(req.body);

  // Input validation
  if (!name || !email || !mnumber || !password || !aadharNumber) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required."));
  }

  try {
    // Check if a user with the same mobile number exists and has a status of "Activated"
    const existingUserByMobile = await Register.findOne({ 
      mobileNumber: mnumber, 
      status: "Activated" 
    });
    if (existingUserByMobile) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Mobile number is already registered with activated status."));
    }

    // Check if a user with the same email exists and has a status of "Activated"
    const existingUserByEmail = await Register.findOne({ 
      email: email, 
      status: "Activated" 
    });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email is already registered with activated status."));
    }

    // Check if a user with the same mobile number exists but has a different status
    const existingUserByMobileStatus = await Register.findOne({ 
      mobileNumber: mnumber 
    });
    if (existingUserByMobileStatus && existingUserByMobileStatus.status !== "Activated") {
      // Allow creation of new user even if the status is not "Activated"
      console.log("Mobile number found but status is not Activated. Creating new user.");
    }

    // Check if a user with the same email exists but has a different status
    const existingUserByEmailStatus = await Register.findOne({ 
      email: email 
    });
    if (existingUserByEmailStatus && existingUserByEmailStatus.status !== "Activated") {
      // Allow creation of new user even if the status is not "Activated"
      console.log("Email found but status is not Activated. Creating new user.");
    }

    // Create new user
    const user = await Register.create({
      name,
      role: role || "superadmin",
      mobileNumber: mnumber,
      email,
      password,
      aadharNumber,
      userId: mnumber, // Assuming mnumber as unique userId
      status: "Activated", // The new user will be activated
    });

    // Log files (if any)
    console.log(req.files);

    // Send success response
    return res.status(201).json(
      new ApiResponse(201, user, "User Registered Successfully")
    );
  } catch (error) {
    console.error("Error registering user:", error);

    // Send generic error response
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});









const generateRandomId = (name) => {
  const randomSuffix = Math.floor(Math.random() * 100000); // Generate a random 4-digit number
  const namePart = name ? name.substring(0, 4).toUpperCase() : 'USER'; // Take the first 4 letters of the name
  return `${99999}${randomSuffix}`;
};

const generateRandomPassword = (length = 10) => {
  return crypto.randomBytes(length).toString('base64').slice(0, length); // Generate a random password of specified length
};



const updateProfile = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    const userId = req.params.id; // Assuming userId is passed as a parameter in the request
    console.log(userId)


    if (err) {
      return res.status(400).json(new ApiError(400, "File upload failed"));
    }

    const {
      name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
      gender, maritalStatus, education, address, salaryBasis, email, division,
      subDivision, section, sectionType, ifsc, district, pincode, bank, accountno,
    } = req.body;
    console.log(req.body)


    try {
      // Find the existing user by ID
      const user = await Register.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // Update user fields
      user.name = name || user.name;
      user.fatherOrHusbandName = fatherOrHusbandName || user.fatherOrHusbandName;
      user.dob = dob || user.dob;
      user.aadharNumber = aadharNumber || user.aadharNumber;
      user.panNumber = panNumber || user.panNumber;
      user.mobileNumber = mobileNumber || user.mobileNumber;
      user.gender = gender || user.gender;
      user.maritalStatus = maritalStatus || user.maritalStatus;
      user.education = education || user.education;
      user.address = address || user.address;
      user.salaryBasis = salaryBasis || user.salaryBasis;
      user.email = email || user.email;
      user.division = division || user.division;
      user.subDivision = subDivision || user.subDivision;
      user.section = section || user.section;
      user.sectionType = sectionType || user.sectionType;
      user.ifsc = ifsc || user.ifsc;
      user.district = district || user.district;
      user.pincode = pincode || user.pincode;
      user.bank = bank || user.bank;
      user.accountno = accountno || user.accountno;


      // Save the updated user
      await user.save();

      // Send success response
      return res.status(200).json(
        new ApiResponse(200, user, "User updated successfully")
      );

    } catch (error) {
      // Handle errors
      return res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
  });
});






const registeredUser = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters

  try {
    // Find the user in the Register collection
    const user = await Register.findById(id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const generatedUserId = generateRandomId(user.name);
    const generatedPassword = generateRandomPassword(12);

    // Create a new entry in the Registered collection with the user's data
    const acceptedUser = await Registered.create({
      name: user.name,
      fatherOrHusbandName: user.fatherOrHusbandName,
      dob: user.dob,
      aadharNumber: user.aadharNumber,
      panNumber: user.panNumber,
      mobileNumber: user.mobileNumber,
      gender: user.gender,
      maritalStatus: user.maritalStatus,
      education: user.education,
      address: user.address,
      salaryBasis: user.salaryBasis,
      email: user.email,
      division: user.division,
      subDivision: user.subDivision,
      section: user.section,
      sectionType: user.sectionType,
      userId: generatedUserId,
      password: generatedPassword,

    });


    const wallet = new Wallet({
      userId: acceptedUser._id, // Use the ID of the newly created user
    });

    await wallet.save();


  


    // const smsMessage = `Your account has been created. User ID: ${generatedUserId}, Password: ${generatedPassword}`;

    // await twilioClient.messages.create({
    //     body: smsMessage,
    //     from: twilioPhoneNumber,
    //     to: user.mobileNumber, 
    // });

    // Delete the user from the Register collection
    await Register.findByIdAndDelete(id);

    // Send a success response
    return res.status(200).json(new ApiResponse(200, acceptedUser, "User Accepted and Moved to Registered Collection"));
  } catch (error) {
    // Handle errors
    return res.status(500).json(new ApiError(500, "Server Error"));
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Function to download user images
const downloadUserImages = asyncHandler(async (req, res) => {
  const aadharNumber = req.params.aadharNumber;

  // Corrected path to go up to the root directory
  const userDir = path.join(__dirname, '..', '..', 'public', 'images', aadharNumber);

  // Check if the directory exists
  if (!fs.existsSync(userDir)) {
    return res.status(404).json({ message: 'No images found for the provided Aadhar number.' });
  }

  // Corrected path for zip file
  const zipFileName = `images-${aadharNumber}.zip`;
  const zipFilePath = path.join(__dirname, '..', '..', 'public', zipFileName);

  // Create a writable stream for the zip file
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Maximum compression level
  });

  // Handle zip creation and download response
  output.on('close', () => {
    // Send the zip file as a response
    res.download(zipFilePath, (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        res.status(500).send('Error downloading the file');
      }

      // Delete the zip file after download
      fs.unlink(zipFilePath, (err) => {
        if (err) console.error('Error deleting the file:', err);
      });
    });
  });

  archive.on('error', (err) => {
    console.error('Error creating the archive:', err);
    res.status(500).send('Error creating the archive');
  });

  // Pipe the archive to the writable stream
  archive.pipe(output);

  // Append images in the user's directory to the archive
  archive.directory(userDir, false);

  // Finalize the archive
  archive.finalize();
});





const registerTransaction = asyncHandler(async (req, res) => {
  // Destructure the fields from the request body
  const {
    transaction_id, reference_number, lower_level, upper_level,
    transaction_datetime, service_name, amount_before_due_date, request_amount,
    total_service_charge, total_commission, net_amount, action_on_amount,
    status, final_bal_amount, update_date, portal_name, gst_charge
  } = req.body;

  try {
    // Create new transaction
    const transaction = await Transaction.create({
      transaction_id,
      reference_number,
      lower_level,
      upper_level,
      transaction_datetime,
      service_name,
      amount_before_due_date,
      request_amount,
      total_service_charge,
      total_commission,
      net_amount,
      action_on_amount,
      status,
      final_bal_amount,
      update_date,
      portal_name,
      gst_charge
    });

    // Return the created transaction
    return res.status(201).json(
      new ApiResponse(201, transaction, "Transaction created successfully")
    );
  } catch (error) {
    // Catch any errors and send error response
    return res.status(400).json(new ApiError(400, error.message));
  }
});



// Function to block a user
const blockUser = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Assuming user ID is sent in the request body
  console.log("id", userId)

  try {
    // Find the user and update their status to 'Blocked'
    const user = await Register.findOneAndUpdate(
      { _id: userId },
      { $set: { isBlocked: true, status: 'Blocked' } },
      { new: true }
    );

    // If user not found
    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Return a successful response
    return res.status(200).json(
      new ApiResponse(200, user, "User blocked successfully")
    );
  } catch (error) {
    // Handle errors and send a structured error response
    return res.status(400).json(
      new ApiError(400, error.message)
    );
  }
});

// Function to unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Assuming user ID is sent in the request body
  console.log("id", userId)


  try {
    // Find the user and update their status to 'Approved'
    const user = await Register.findOneAndUpdate(
      { _id: userId },
      { $set: { isBlocked: false, status: 'Approved' } },
      { new: true }
    );

    // If user not found
    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Return a successful response
    return res.status(200).json(
      new ApiResponse(200, user, "User unblocked successfully")
    );
  } catch (error) {
    // Handle errors and send a structured error response
    return res.status(400).json(
      new ApiError(400, error.message)
    );
  }
});





const fetchWalletBalance = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate that the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log("Invalid userId format:", userId);
    return res.status(400).json({ success: false, message: 'Invalid userId' });
  }

  try {
    const wallet = await Wallet.findOne({ userId }).exec();

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    console.log("Fetched wallet balance:", wallet.balance);

    return res.status(200).json({ success: true, balance: wallet.balance });

  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});







const fundRequest = asyncHandler(async (req, res) => {
  const { userId, fundAmount, bankReference, paymentMethod, datePayment, bankName } = req.body;

  try {
    // Validate required fields
    if (!userId || !fundAmount || !paymentMethod) {
      throw new Error('All fields are required');
    }

    // Validate that the user exists in the Register table
    const user = await Register.findById(userId); // Use findById to find the user by _id
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create a new fund request
    const newFundRequest = new FundRequest({
      // userId: user.userId, // Correctly set userId from the fetched user document
      userId: user._id,
      uniqueId: user.userId,
      txnId: `OP${Date.now()}`,
      fundAmount,
      bankReference,
      paymentMethod,
      bankName,
      datePayment,
    });

    // Save the document to the database
    const savedFundRequest = await newFundRequest.save();

    // Return the created transaction
    return res.status(201).json({ success: true, data: savedFundRequest, message: 'Fund request created successfully' });
  } catch (error) {
    // Catch any errors and send error response
    return res.status(400).json({ success: false, message: error.message });
  }
});


// const fundRequest = asyncHandler(async (req, res) => {
//     // Destructure the fields from the request body
//     const { userId, fundAmount, bankReference, paymentMethod, bankName } = req.body;

//     try {
//         // Validate required fields
//         if (!userId || !fundAmount || !bankReference || !paymentMethod) {
//             throw new Error('All fields are required');
//         }

//         // Create a new fund request
//         const newFundRequest = new FundRequest({
//             userId,
//             fundAmount,
//             bankReference,
//             paymentMethod,
//             bankName,
//         });

//         // Save the document to the database
//         const savedFundRequest = await newFundRequest.save();

//         // Return the created transaction
//         return res.status(201).json(new ApiResponse(201, savedFundRequest, 'Fund request created successfully'));
//     } catch (error) {
//         // Catch any errors and send error response
//         return res.status(400).json(new ApiError(400, error.message));
//     }
// });


const generateRandomPin = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a number between 1000 and 9999
};


const approveUserRequest = asyncHandler(async (req, res) => {
  try {
    const customId = generateRandomId()
    const pin = generateRandomPin(); 
    // Find the user by ID and update the status to "approved" along with generating userId and password
    const updatedUser = await Register.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        userId: customId, // Generate a random userId
        password: generateRandomPassword(12), // Generate a random password
        tpin: pin, // Store the generated PIN

      },
      { new: true } // Return the updated document
    ).exec();

    // If the user request is not found, return a 404 error
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User request not found' });
    }

    // Create a wallet for the approved user
    const wallet = new Wallet({
      userId: updatedUser._id, // Use the ID of the updated user
      uniqueId: customId
    });

    // Save the new wallet
    await wallet.save();
    

    const smsMessage = `Welcome to ORANGEPAY Thank You for registration. Your login details username:${customId}, Password: ${updatedUser.password}/${pin} `;
    const mobileNumber = updatedUser.mobileNumber;
    const senderName = 'OrgPay'; 
    const apiKey =  'e7d09e93-0dd3-4a00-9cfc-2c53854033f2'; 

    const smsUrl = `http://login.aquasms.com/sendSMS?username=7004142281&message=${smsMessage}&sendername=${senderName}&smstype=TRANS&numbers=${mobileNumber}&apikey=e7d09e93-0dd3-4a00-9cfc-2c53854033f2`;
    
    console.log("Sending SMS to URL:", smsUrl); // Log the complete URL

    const smsResponse = await axios.get(smsUrl);
    console.log("SMS API Response:", smsResponse.data);
    console.log("Sending to mobile number:", mobileNumber);
    
    // Check for successful SMS sending based on responseCode
    if (Array.isArray(smsResponse.data) && smsResponse.data.length > 0) {
      const responseCode = smsResponse.data[0].responseCode;
      
      if (responseCode === 'Message SuccessFully Submitted') {
        console.log("SMS sent successfully.");
      } else {
        console.error("Failed to send SMS:", smsResponse.data);
      }
    } else {
      console.error("Unexpected SMS API response format:", smsResponse.data);
    }
    
    // Add additional error handling/logging
    if (smsResponse.status !== 200) {
      console.error("Failed to communicate with SMS API:", smsResponse.statusText);
    }
    
    
    // Optionally, send an SMS or email with the new credentials
    // const smsMessage = `Your account has been approved. User ID: ${updatedUser.userId}, Password: ${updatedUser.password}`;
    // await twilioClient.messages.create({
    //     body: smsMessage,
    //     from: twilioPhoneNumber,
    //     to: updatedUser.mobileNumber,
    // });

    // Return the updated user and wallet creation confirmation
    return res.status(200).json({
      success: true,
      message: 'User approved successfully',
      user: {
        id: updatedUser._id,
        userId: updatedUser.userId,
        password: updatedUser.password,
      },
      wallet,
    });
  } catch (error) {
    console.error("Error approving user request:", error.message);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
});


const changePassword = asyncHandler(async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body; // Accepting userId in the request body

  try {
    // Find the user by ID
    const user = await Register.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the current password is correct
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Update the password
    user.password = newPassword; // You should ideally hash the new password before saving

    // Save the user with the new password
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while changing the password.' });
  }
});




const changeTpin = asyncHandler(async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body; // Accepting userId in the request body

  try {
    // Find the user by ID
    const user = await Register.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the current password is correct
    if (user.tpin !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Update the password
    user.tpin = newPassword; // You should ideally hash the new password before saving

    // Save the user with the new password
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while changing the password.' });
  }
});


const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

const verifyAadhaar = asyncHandler(async (req, res) => {
  const { aadhaarLastFour } = req.body;

  // Input validation
  if (!aadhaarLastFour || aadhaarLastFour.length !== 4) {
    return res.status(400).json({ success: false, message: 'Last four digits of Aadhar are required.' });
  }

  try {
    // Find users whose Aadhaar last four digits match and status is active
    const matchedUser = await Register.findOne({
      status: { $in: ['Approved', 'Activated'] },
      aadharNumber: { $regex: `${aadhaarLastFour}$` } // Use regex to match last four digits
    });

    if (!matchedUser) {
      return res.status(401).json({ success: false, message: 'Aadhaar verification failed or user is not active.' });
    }

    // Generate a 4-digit OTP and set an expiration time (5 minutes from now)
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Save OTP and expiration time to the user document
    matchedUser.otp = otp;
    matchedUser.otpExpiresAt = otpExpiresAt;
    await matchedUser.save();

    if (matchedUser) {
      return res.status(200).json({ success: true, message: 'Aadhar verification successful.', userId: matchedUser._id });
    } else {
      return res.status(401).json({ success: false, message: 'Aadhar verification failed or user is not active.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'An error occurred during Aadhar verification.' });
  }
});




const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  try {
    // Find the user by ID and check if OTP matches and is still valid
    const user = await Register.findById(userId);

    if (!user || !user.otp || user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'OTP verification successful.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'An error occurred during OTP verification.' });
  }
});






const rejectUserRequest = asyncHandler(async (req, res) => {
  try {
    const { remarks } = req.body;
    // Find the user by ID and update the status to "rejected"
    const updatedUser = await Register.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Rejected',
        remarks: remarks
      }, 
      { new: true }, 
    ).exec();

    // If the user request is not found, return a 404 error
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User request not found' });
    }

    // Optionally, send an SMS or email notifying the user of rejection (code commented out)
    // const smsMessage = `Your account request has been rejected.`;
    // await twilioClient.messages.create({
    //     body: smsMessage,
    //     from: twilioPhoneNumber,
    //     to: updatedUser.mobileNumber,
    // });

    // Send a success response
    return res.status(200).json({
      success: true,
      message: 'User rejected successfully',
      user: {
        id: updatedUser._id,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Error rejecting user request:", error.message); // Log the error for debugging
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
});






//   const fundRequest = asyncHandler(async (req, res) => {
//     const { userId, fundAmount, bankReference, paymentMethod, bankName } = req.body;

//     try {
//         // Validate required fields
//         if (!userId || !fundAmount || !bankReference || !paymentMethod) {
//             throw new Error('All fields are required');
//         }

//         // Validate that the user exists in the Register table
//         const user = await Register.findById(userId); // Use findById to find the user by _id
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Create a new fund request
//         const newFundRequest = new FundRequest({
//             userId: user.userId, // Correctly set userId from the fetched user document
//             fundAmount,
//             bankReference,
//             paymentMethod,
//             bankName,
//         });

//         // Save the document to the database
//         const savedFundRequest = await newFundRequest.save();

//         // Return the created transaction
//         return res.status(201).json({ success: true, data: savedFundRequest, message: 'Fund request created successfully' });
//     } catch (error) {
//         // Catch any errors and send error response
//         return res.status(400).json({ success: false, message: error.message });
//     }
// });


const fetchFundRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get the user ID from the request parameters
  console.log('User ID from params:', userId);

  try {
    // Check if the user exists in the Register collection
    const user = await Register.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    console.log('User ID found:', user._id); // Log the user ID from the Register collection

    // Find all fund requests related to this user
    const fundRequests = await FundRequest.find({ userId });
    console.log('Fetched Fund Requests:', fundRequests);

    // Check if any fund requests exist
    if (!fundRequests || fundRequests.length === 0) {
      console.log('No fund requests found for user ID:', userId);
      return res.status(200).json({ success: false, message: 'No fund requests found for this user ID', fundRequest: [] });
    }

    // Return the fund requests
    return res.status(200).json({ success: true, fundRequest: fundRequests });

  } catch (error) {
    console.error('Error fetching fund request:', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




const fetchFundRequestsById = asyncHandler(async (req, res) => {
  const { id } = req.body; // Get the user ID from the request parameters
  console.log('User ID from params:', id);

  try {
    // Check if the user exists in the Register collection
    // const user = await Register.findById(_id);
    // if (!user) {
    //   console.log('User not found for ID:', _id);
    //   return res.status(404).json({ success: false, message: 'User not found.' });
    // }

    // console.log('User ID found:', user._id); // Log the user ID from the Register collection

    // Find all fund requests related to this user
    const fundRequests = await FundRequest.find({ _id: id });
    console.log('Fetched Fund Requests:', fundRequests);

    // Check if any fund requests exist
    if (!fundRequests || fundRequests.length === 0) {
      console.log('No fund requests found for user ID:', id);
      return res.status(200).json({ success: false, message: 'No fund requests found for this user ID', fundRequest: [] });
    }

    // Return the fund requests
    return res.status(200).json({ success: true, fundRequest: fundRequests });

  } catch (error) {
    console.error('Error fetching fund request:', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});








const fetchFundRequests = asyncHandler(async (req, res) => {
  try {
    // Find all fund requests from the database
    const fundRequests = await FundRequest.find({});

    console.log("Fund Requests: ", fundRequests);

    // If no fund requests are found, return a message indicating no requests
    if (fundRequests.length === 0) {
      return res.status(404).json({ success: false, message: 'No fund requests found' });
    }

    // Return the list of all fund requests
    return res.status(200).json({ success: true, fundRequests });

  } catch (error) {
    console.error("Error fetching fund requests:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


const fetchUserList = asyncHandler(async (req, res) => {
  try {
    // Find all users, excluding those with status 'activated'
    const fetchUser = await Register.find({ status: { $ne: 'Activated' } }).exec();

    console.log("Users (excluding 'activated' status): ", fetchUser);

    // If no users are found, return a message indicating no users found
    if (fetchUser.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }

    // Return the list of users
    return res.status(200).json({ success: true, fetchUser });

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});





const fetchUserListbyId = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Extract userId from request params

  try {
    // Find the user with the given userId
    const fetchUser = await Register.findOne({ _id: userId }).exec(); // Use findOne to get a single user by userId

    // If no user is found, return a message indicating user not found
    if (!fetchUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user details
    return res.status(200).json({ success: true, fetchUser });

  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



const blockUserList = asyncHandler(async (req, res) => {
  try {
    // Find all users with status 'approved' from the database
    const fetchUser = await Register.find({ status: 'Blocked' }).exec();

    console.log("Approved Users: ", fetchUser);

    // If no approved users are found, return a message indicating no users found
    if (fetchUser.length === 0) {
      return res.status(404).json({ success: false, message: 'No approved users found' });
    }

    // Return the list of approved users
    return res.status(200).json({ success: true, fetchUser });

  } catch (error) {
    console.error("Error fetching approved users:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




// const approveFundRequest = asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ success: false, message: 'Invalid fund request ID' });
//     }

//     try {
//         const updatedFundRequest = await FundRequest.findByIdAndUpdate(
//             id,
//             { status: 'approved' },
//             { new: true }
//         ).exec();

//         if (!updatedFundRequest) {
//             return res.status(404).json({ success: false, message: 'Fund request not found' });
//         }

//         const userWallet = await Wallet.findOne({ userId: updatedFundRequest.userId });

//         if (!userWallet) {
//             return res.status(404).json({ success: false, message: 'Wallet not found' });
//         }

//         userWallet.balance += updatedFundRequest.fundAmount;

//         await userWallet.save();

//         return res.status(200).json({
//             success: true,
//             message: 'Fund request approved and wallet updated',
//             fundRequest: updatedFundRequest,
//             wallet: userWallet
//         });

//     } catch (error) {
//         console.error("Error approving fund request:", error);

//         // Log detailed error information
//         console.error("Detailed Error: ", {
//             message: error.message,
//             name: error.name,
//             stack: error.stack,
//             cause: error.cause
//         });

//         return res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
//     }
// });




const approveFundRequest = asyncHandler(async (req, res) => {
  try {
    const updatedFundRequest = await FundRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).exec();
    if (!updatedFundRequest) {
      return res.status(404).json({ success: false, message: 'Fund request not found' });
    }

    const userWallet = await Wallet.findOne({ uniqueId: updatedFundRequest.uniqueId });

    if (!userWallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }




    const openingBalance = userWallet.balance;





    userWallet.balance += updatedFundRequest.fundAmount;

    // Save the updated wallet
    await userWallet.save();


   


    const transaction = new WalletTransaction({
      userId: userWallet.userId,
      uniqueId: userWallet.uniqueId,
      walletId: userWallet._id,
      transactions: [ 
        {
          transactionId: updatedFundRequest.txnId, 
          // canumber: 'exampleCanumber', 
          refrencenumber: 'exampleReferenceNumber', 
          bankid: 'exampleBankId', 
          paymentmode: 'examplePaymentMode', 
          paymentstatus: 'Success', 
          commission:"0",
          amount: updatedFundRequest.fundAmount, 
          type: 'credit', 
          date: new Date(), 
          description: 'Fund request approved',
          openingBalance: openingBalance, // Add the opening balance here
          closingBalance: userWallet.balance // Add the closing balance here
        }
      ]
    });

    await transaction.save();


    // Return the updated fund request and wallet balance
    return res.status(200).json({
      success: true,
      message: 'Fund request approved and wallet updated',
      fundRequest: updatedFundRequest,
      wallet: userWallet
    });

  } catch (error) {
    console.error("Error approving fund request:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});





const rejectFundRequest = asyncHandler(async (req, res) => {
  try {
    // Find the fund request by ID and update the status to "rejected"
    const updatedFundRequest = await FundRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).exec();

    // If the fund request is not found, return a 404 error
    if (!updatedFundRequest) {
      return res.status(404).json({ success: false, message: 'Fund request not found' });
    }

    // Return the updated fund request
    return res.status(200).json({ success: true, fundRequest: updatedFundRequest });

  } catch (error) {
    console.error("Error rejecting fund request:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});






// app.get('/download/:aadharNumber', (req, res) => {
//     const { aadharNumber } = req.params;
//     const filePath = path.join(__dirname, 'public/images', aadharNumber);

//     // Check if file exists
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//             return res.status(404).json(new ApiError(404, 'File not found'));
//         }

//         // Send the file to the client for download
//         res.download(filePath, filename, (err) => {
//             if (err) {
//                 return res.status(500).json(new ApiError(500, 'File download failed'));
//             }
//         });
//     });
// });




const fetchData = asyncHandler(async (req, res) => {
  try {
    // Fetch only the users where the status is 'pending'
    const pendingUsers = await Register.find({ status: 'Pending' });
    console.log("Fetched users with pending status:", pendingUsers);

    // Return the filtered data
    return res.status(200).json({ success: true, data: pendingUsers });
  } catch (error) {
    return res.status(500).json(new ApiError(500, "error", "Internal Server Error"));
  }
});



const images = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the request parameters
    const imageFileName = req.params.imageFileName; // Get the image filename from the request parameters (e.g., 'aadharCard')

    console.log('User ID:', userId);
    console.log('Image File Name:', imageFileName);

    // Construct the path to the image
    const imagePath = path.join(__dirname, "../../public/images/", `${userId}/${imageFileName}`); // Adjust the pattern if needed
    console.log('Image path:', imagePath);

    // Use fs to check if the file exists before sending
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File not found:', err);
        return res.status(404).send('Image not found'); // Respond with 404 if file doesn't exist
      }

      // Send the image file
      res.sendFile(imagePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(err.status || 500).end(); // Ensure a valid status code is used
        }
      });
    });
  } catch (error) {
    console.error('Error sending image:', error);
    res.status(500).send('Internal Server Error');
  }
});





const fetchDataa = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    // Fetch users where the userId matches (this returns an array)
    const pendingUsers = await Register.find({ _id: userId });

    // Check if pendingUsers is an array and has items
    if (!pendingUsers || pendingUsers.length === 0) {
      return res.status(404).json(new ApiError(404, "No users found"));
    }

    const userWithImage = pendingUsers.map(user => {
      const aadharNumber = user.aadharNumber;
      const imageBaseUrl = `/images/${aadharNumber}/`;

      return {
        ...user.toObject(),
        photograph: user.photograph ? `${imageBaseUrl}${path.basename(user.photograph)}` : null,
        aadharCard: user.aadharCard ? `${imageBaseUrl}${path.basename(user.aadharCard)}` : null,
        panCard: user.panCard ? `${imageBaseUrl}${path.basename(user.panCard)}` : null,
        educationCertificate: user.educationCertificate ? `${imageBaseUrl}${path.basename(user.educationCertificate)}` : null,
        cheque: user.cheque ? `${imageBaseUrl}${path.basename(user.cheque)}` : null,
        signature: user.signature ? `${imageBaseUrl}${path.basename(user.signature)}` : null,
      };
    });

    // Return the filtered data
    return res.status(200).json({ success: true, data: userWithImage });

  } catch (error) {
    console.error("Error fetching pending users:", error);
    return res.status(500).json(new ApiError(500, "error", "Internal Server Error"));
  }
});





const fetchData_reject = asyncHandler(async (req, res) => {
  try {
    // Fetch only the users where the status is 'pending'
    const pendingUsers = await Register.find({ status: 'Rejected' });
    console.log("Fetched users with pending status:", pendingUsers);

    // Return the filtered data
    return res.status(200).json({ success: true, data: pendingUsers });
  } catch (error) {
    return res.status(500).json(new ApiError(500, "error", "Internal Server Error"));
  }
});




const reports = asyncHandler(async (req, res) => {
  try {
    const allUser = await Transaction.find({})
    // console.log(allUser);
    console.log("Fetched users:", allUser);
    return res.status(200).json({ success: true, data: allUser });
    // return res.status(200).json(new ApiResponse(200,"Form Submitted Successfully"))
    // return allUser;
  }
  catch (error) {
    return res.status(500).json(new ApiError(500, "error", "Internal Server Error"));
  }
})





// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/images');
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// const upload 

// const registerUser = asyncHandler(async (req, res) => {


//     const {
//         name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
//         gender, maritalStatus, education, address, salaryBasis, email, division,
//         subDivision, section, sectionType, photograph, aadharCard, panCard,
//         educationCertificate, cheque
//     } = req.body;
//     console.log(req.body)

//     // Check for existing user
//     // const existedUser = await Register.findOne({
//     //     $or: [{ mobileNumber }, { aadharNumber }]
//     // });

//     // if (existedUser) {
//     //     throw new ApiError(400, "Mobile number or Aadhar number already exists");
//     // }

//     // Create new user
//     const user = await Register.create({
//         name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
//         gender, maritalStatus, education, address, salaryBasis, email, division,
//         subDivision, section, sectionType, photograph, aadharCard, panCard,
//         educationCertificate, cheque
//     });

//     // Send success response
//     return res.status(201).json(
//         new ApiResponse(201, user, "User Registered Successfully")
//     );
// });


// const registerUser = asyncHandler(async (req, res) => {
// Single file uploads for each field


// app.post('/api/v1/users', upload.fields([
//     { name: 'photograph', maxCount: 1 },
//     { name: 'aadharCard', maxCount: 1 },
//     { name: 'panCard', maxCount: 1 },
//     { name: 'educationCertificate', maxCount: 1 },
//     { name: 'cheque', maxCount: 1 }
//   ]), registerUser);



// upload.fields([
//   { name: 'photograph', maxCount: 1 },
//   { name: 'aadharCard', maxCount: 1 },
//   { name: 'panCard', maxCount: 1 },
//   { name: 'educationCertificate', maxCount: 1 },
//   { name: 'cheque', maxCount: 1 }
// ])(req, res, async (err) => {
//   if (err) {
//     return res.status(400).json({ message: err });
//   }

//       const {
//         name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
//         gender, maritalStatus, education, address, salaryBasis, email, division,
//         subDivision, section, sectionType
//       } = req.body;

//       const user = await Register.create({
//         name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
//         gender, maritalStatus, education, address, salaryBasis, email, division,
//         subDivision, section, sectionType,
//         photograph: req.files['photograph'] ? req.files['photograph'][0].path : null,
//         aadharCard: req.files['aadharCard'] ? req.files['aadharCard'][0].path : null,
//         panCard: req.files['panCard'] ? req.files['panCard'][0].path : null,
//         educationCertificate: req.files['educationCertificate'] ? req.files['educationCertificate'][0].path : null,
//         cheque: req.files['cheque'] ? req.files['cheque'][0].path : null
//       });
//       console.log(req.files)

//       return res.status(201).json(
//         new ApiResponse(201, user, "User Registered Successfully")
//       );
//     }
// );
//   });



// const registerUser = asyncHandler(async (req, res) => {
//     console.log('Files received:', req.files);
//     console.log('Body received:', req.body);

//     const {
//         name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
//         gender, maritalStatus, education, address, salaryBasis, email, division,
//         subDivision, section, sectionType
//     } = req.body;

//     // Check if files are present
//     const photograph = req.files['photograph'] ? req.files['photograph'][0].path : null;
//     const aadharCard = req.files['aadharCard'] ? req.files['aadharCard'][0].path : null;
//     const panCard = req.files['panCard'] ? req.files['panCard'][0].path : null;
//     const educationCertificate = req.files['educationCertificate'] ? req.files['educationCertificate'][0].path : null;
//     const cheque = req.files['cheque'] ? req.files['cheque'][0].path : null;

//     const user = await Register.create({
//         name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
//         gender, maritalStatus, education, address, salaryBasis, email, division,
//         subDivision, section, sectionType,
//         photograph, aadharCard, panCard, educationCertificate, cheque
//     });

//     return res.status(201).json(
//         new ApiResponse(201, user, "User Registered Successfully")
//     );
// });





// Encryption key and IV setup
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32); // 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size for IV

// Encrypt function
function encryptData(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  };
}

// Decrypt function
function decryptData(encrypted) {
  const iv = Buffer.from(encrypted.iv, "hex");
  const encryptedText = Buffer.from(encrypted.encryptedData, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}

// Updated loginUser function
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, "Username and password are required");
    }

    const user = await Register.findOne({ userId: username });

    if (!user) {
      throw new ApiError(400, "User does not exist");
    }

    if (user.status !== "Approved" && user.status !== "Activated" || user.isBlocked) {
      throw new ApiError(400, "User account is Temporarily Blocked");
    }

    // Check password - Assuming plain text comparison here
    if (user.password !== password) {
      throw new ApiError(400, "Invalid User Credentials");
    }

    await Register.findByIdAndUpdate(user._id, { loggedOut: false });

    // Save session details
    const sessionData = { id: user._id, username: user.username, email: user.email };
    req.session.user = sessionData;
    console.log('Session ID:', req.sessionID);

    // Encrypt session ID and user data
    const encryptedSession = encryptData({ sessionID: req.sessionID });
    const encryptedUser = encryptData(sessionData);

    // Generate JWT token
    const accessToken = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    // Set cookies with encrypted session and token
    res.cookie('sessionData', JSON.stringify(encryptedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
    });

    // Respond with success and encrypted user data
    return res.status(200).json(
      new ApiResponse(200, {
        success: true,
        message: "User Logged in Successfully",
        encryptedUser, // Send encrypted user details
        user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    status: user.status
                  },
        token: accessToken,
        encryptedSession, // Send encrypted session ID
      })
    );
  } catch (error) {
    console.error("Error in loginUser function:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    } else {
      return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
  }
});




// const loginUser = asyncHandler(async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       throw new ApiError(400, "Username and password are required");
//     }

//     const user = await Register.findOne({ userId: username });

//     if (!user) {
//       throw new ApiError(400, "User does not exist");
//     }

//     if (user.status !== "Approved" && user.status !== "Activated" || user.isBlocked) {
//       throw new ApiError(400, "User account is Temporarily Blocked");
//     }

//     // Check password - Assuming plain text comparison here
//     if (user.password !== password) {
//       throw new ApiError(400, "Invalid User Credentials");
//     }



//     await Register.findByIdAndUpdate(user._id, { loggedOut: false });




//     // Save session details
//     req.session.user = { id: user._id, username: user.username, email: user.email };
//     console.log('Session ID:', req.sessionID);

//     // Generate JWT token
//     const accessToken = jwt.sign(
//       { _id: user._id, username: user.username, email: user.email },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
//     );

//     // Set cookies
//     res.cookie('sessionID', req.sessionID, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//       path: '/' // Ensure the path is correct
//     });

//     res.cookie('accessToken', accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//       path: '/' // Ensure the path is correct
//     });

//     // Respond with success
//     return res.status(200).json(
//       new ApiResponse(200, {
//         success: true,
//         message: "User Logged in Successfully",
//         user: {
//           id: user._id,
//           username: user.username,
//           email: user.email,
//           status: user.status
//         },
//         token: accessToken,
//         session: req.sessionID
//       })
//     );
//   } catch (error) {
//     console.error("Error in loginUser function:", error);
//     if (error instanceof ApiError) {
//       return res.status(error.statusCode).json(error);
//     } else {
//       return res.status(500).json(new ApiError(500, "Internal Server Error"));
//     }
//   }
// });




const statuss = asyncHandler(async (req, res) => {
  try {
    // Extract userId from the URL parameters
    const { userId } = req.params;

    // Find the user in the database
    const user = await Register.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is logged out
    const hasChanged = user.loggedOut;

    return res.status(200).json({ hasChanged });
  } catch (error) {
    console.error("Error checking user status:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});




const fetchIdData = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const fetchedData = await User.findById(userId);
    return res.status(200).json(new ApiResponse(200, fetchedData, "ok"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "error", "internal server error"));
  }
});



const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Log the current session details for debugging
    console.log('Current session before destroy:', req.sessionID, req.session);

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Error logging out', error: err.message });
      }

      // Clear the session cookie
      res.clearCookie('sessionID', {
        path: '/', // Ensure this path matches the cookie path
        httpOnly: true, // Match the httpOnly flag used when setting the cookie
        secure: process.env.NODE_ENV === 'production', // Ensure this matches the secure flag used when setting the cookie
        sameSite: 'Strict' // Ensure this matches the sameSite flag used when setting the cookie
      });
      // Optionally clear other cookies
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });

      console.log('Session and cookies cleared successfully');

      // Send success response
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'An error occurred while logging out', error: error.message });
  }
});










const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, empnumber, email, role, status } = req.body

    const updatedUser = await User.findByIdAndUpdate(userId, {
      name,
      empnumber,
      email,
      role,
      status
    }, { new: true })

    if (!updatedUser) {
      throw new ApiError(404, "User not found")
    }
    return res.status(200).json(new ApiResponse(200, updateUser, "User updated Successfully"))
  } catch (error) {
    return res.status(500).json(new ApiError(500, "error", "Internal Server Error"))
  }
})


const updateUserPermissions = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { topup, billPayment, requestCancellation, getPrepaidBalance, fundRequest,
    bankTransfer,
    upi,
    cash,
    cdm,
    wallet,
    ezetap,
    upiQr,
    rrn } = req.body;
  console.log(userId)
  console.log("user details:",req.body)

  try {
    const updatedUser = await Register.findByIdAndUpdate(
      userId,
      {
        topup,
        billPayment,
        requestCancellation,
        getPrepaidBalance,
        fundRequest,
        bankTransfer,
        upi,
        cash,
        cdm,
        wallet,
        ezetap,
        upiQr,
        rrn,
        loggedOut: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



const updateUserCommission = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { commission } = req.body;
  console.log(userId)
  console.log(commission)

  try {
    const updatedUser = await Register.findByIdAndUpdate(
      userId,
      {
        margin: commission
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



const getCancellation = asyncHandler(async (req, res) => {
  const { consumerId, userId } = req.body; 

  if (!consumerId || !userId) {
      return res.status(400).json({ message: 'Both Consumer ID and User ID are required' });
  }

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  console.log('Consumer ID:', consumerId);
  console.log('User ID:', userId);
  console.log('Start Date:', startDate);

  try {
      const cancellation = await Payment.find({
        canumber: consumerId,
          id: userId, 
          createdon: { $gte: startDate }
      });

      console.log('Cancellation Results:', cancellation);

      if (cancellation.length === 0) {
          return res.status(404).json({ message: 'No records found.' });
      }

      res.status(200).json(cancellation);
  } catch (error) {
      console.error('Error fetching cancellation:', error);
      res.status(500).json({ message: 'Server error' });
  }
});





const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) {
      return res.status(404).json(new ApiError(404, "error", "User not found"))
    }
    return res.status(200).json(new ApiResponse(200, deleteUser, "Deleted Successfully"))
  } catch (error) {
    return res.status(500).json(new ApiError(500, "error", "Internal server error"))
  }
})


const fetchUserById = asyncHandler(async (req, res) => {
  const { id } = req.params; 

  try {
    const user = await Register.findById(id); 

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log("User found: ", user); 

    res.status(200).json({ success: true, user }); 

  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




const storagee = multer.diskStorage({
  destination: function (req, file, cb) {
    // const aadharNumber = req.body.aadharNumber;
    const dir = path.join('public/images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Unique filename with timestamp
  }
});

// Initialize Multer upload middleware
const uploads = multer({ storagee }).fields([
  
  { name: 'input1', maxCount: 1 },
  { name: 'input2', maxCount: 1 },
  { name: 'input3', maxCount: 1 },
]);


const cancellationDetails = asyncHandler(async (req, res) => {
  uploads(req, res, async (err) => {
    if (err) {
      return res.status(400).json(new ApiError(400, "File upload failed"));
    }

    const {
      userId,
      id,
      transactionId,
      consumerNumber,
      consumerName,
      paymentMode,
      paymentAmount,
      paymentStatus,
      createdOn,
      selectedOption,
      tds,
      netCommission,
    } = req.body;

    console.log(userId);
    console.log(req.body);

    try {
      const files = {
        input1: req.files['input1'] ? req.files['input1'][0].path : null,
        input2: req.files['input2'] ? req.files['input2'][0].path : null,
        input3: req.files['input3'] ? req.files['input3'][0].path : null,
      };
      console.log(files);

      // Create cancellation detail with initial status "Pending"
      const cancellationDetail = new CancellationDetail({
        userId,
        uniqueId: id,
        transactionId,
        consumerNumber,
        consumerName,
        paymentMode,
        netCommission,
        paymentAmount,
        paymentStatus: "Pending", // Set initial status to "Pending"
        createdOn,
        selectedOption,
        files,
      });

      await cancellationDetail.save();

      // Only update wallet balance if paymentStatus is "Accepted"
      if (paymentStatus === "Completed") {
        const amountToAdd = parseFloat(paymentAmount); // Use parseFloat for amounts with decimals
        const tdsAmount = parseFloat(tds); // Ensure TDS can be in paise
        const commissionAmount = parseFloat(netCommission); // Ensure commission can be in paise

        // Ensure paymentAmount is a number
        const finalAmountToAdd = amountToAdd - (tdsAmount + commissionAmount);
        if (finalAmountToAdd < 0) {
          return res.status(400).json({ message: "Amount to add cannot be negative after deductions" });
        }

        const wallet = await Wallet.findOne({ uniqueId: userId });
        if (!wallet) {
          return res.status(404).json({ message: "Wallet not found for the consumer" });
        }

        // Add the paymentAmount back to the wallet
        wallet.balance += finalAmountToAdd;

        // Save the updated wallet balance
        await wallet.save();
      }

      const paymentRecord = await Payment.findOneAndDelete({ transactionId });
      if (!paymentRecord) {
        return res.status(404).json({ message: "Payment record not found for the transaction" });
      }

      res.status(201).json({
        message: 'Cancellation details saved successfully' + (paymentStatus === "Accepted" ? ', and money added back to the wallet' : ''),
        data: {
          cancellationDetail,
          walletBalance: paymentStatus === "Accepted" ? (await Wallet.findOne({ uniqueId: userId })).balance : null,
          deletedPayment: paymentRecord,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error saving cancellation details', error: error.message });
    }
  });
});



const cancelAccept = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log('Cancellation ID:', id);

  try {
    // Find the cancellation request by its ID
    const cancellationRequest = await CancellationDetail.findById(id);
    if (!cancellationRequest) {
      return res.status(404).json({ message: 'Fund cancellation request not found' });
    }

    console.log('Cancellation Request:', cancellationRequest);

    // Parse the amounts safely by checking their type first
    let cancelAmount = cancellationRequest.paymentAmount;
    let comission = cancellationRequest.netCommission;

    if (typeof cancelAmount === 'string') {
      cancelAmount = parseFloat(cancelAmount.replace(/[^0-9.-]+/g, ''));
    } else if (typeof cancelAmount !== 'number') {
      return res.status(400).json({ message: 'Invalid cancellation amount' });
    }

    if (typeof comission === 'string') {
      comission = parseFloat(comission.replace(/[^0-9.-]+/g, ''));
    } else if (typeof comission !== 'number') {
      return res.status(400).json({ message: 'Invalid commission amount' });
    }

    console.log('Cancel Amount:', cancelAmount);
    console.log('Commission:', comission);

    if (isNaN(cancelAmount) || isNaN(comission)) {
      return res.status(400).json({ message: 'Invalid cancellation amount or commission' });
    }

    // Find the user's wallet
    const wallet = await Wallet.findOne({ uniqueId: cancellationRequest.userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for the user' });
    }

    // Parse wallet balance safely
    const openingBalance = parseFloat(wallet.balance);
    if (isNaN(openingBalance)) {
      return res.status(400).json({ message: 'Invalid wallet balance' });
    }

    // Calculate new balance
    const newBalance = openingBalance + (cancelAmount - comission);
    console.log('New Balance:', newBalance);

    if (isNaN(newBalance)) {
      return res.status(400).json({ message: 'Invalid new balance calculation' });
    }

    // Update wallet balance
    wallet.balance = newBalance;
    await wallet.save();
    console.log('Wallet updated with new balance:', wallet.balance);

    // Create a new wallet transaction
    const transaction = new WalletTransaction({
      userId: cancellationRequest.uniqueId,
      uniqueId: cancellationRequest.userId,
      transactions: [
        {
          transactionId: cancellationRequest.transactionId,
          canumber: cancellationRequest.canumber,
          refrencenumber: 'exampleReferenceNumber',
          bankid: 'exampleBankId',
          paymentmode: cancellationRequest.paymentMode,
          paymentstatus: 'Success',
          commission: cancellationRequest.netCommission,
          amount: cancellationRequest.paymentAmount,
          type: 'credit',
          date: new Date(),
          description: 'Cancellation approved',
          openingBalance: openingBalance,
          closingBalance: newBalance
        }
      ]
    });

    await transaction.save();
    console.log('Transaction saved:', transaction);

    // Update the payment status
    const updatedRequest = await CancellationDetail.findByIdAndUpdate(
      id,
      { paymentStatus: 'Completed' },
      { new: true }
    );

    res.status(200).json({
      message: 'Fund cancellation request approved successfully, wallet updated',
      updatedRequest,
      newBalance: wallet.balance
    });
  } catch (error) {
    console.error('Error approving cancellation request:', error);
    res.status(500).json({
      message: 'Error approving fund cancellation request and updating wallet',
      error: error.message
    });
  }
});









// Controller function to reject a fund cancellation request
const cancelReject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body; // Capture remarks from the request body

  try {
    // Find the request by its ID and update the status to 'Rejected' with optional remarks
    const updatedRequest = await CancellationDetail.findByIdAndUpdate(
      id,
      { paymentStatus: 'Rejected', remarks: remarks || 'No remarks provided' }, // Update status to 'Rejected' and set remarks
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Fund request not found' });
    }

    res.status(200).json({
      message: 'Fund cancellation request rejected successfully',
      updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error rejecting fund cancellation request',
      error: error.message,
    });
  }
});




const cancellationHistory = asyncHandler(async (req, res) => {
  // Use req.query to get username from query parameters
  const { userId } = req.params;


  console.log(userId)
  try {
    // Fetch cancellation details where userId matches the username
    const history = await CancellationDetail.find({ uniqueId: userId }); 

    if (!history || history.length === 0) {
      return res.status(404).json({ message: 'No cancellation history found for this user.' });
    }

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching cancellation history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Unable to retrieve cancellation history.',
    });
  }
});


const resendCredential = asyncHandler(async (req, res) => {
  const { userId } = req.body;


  console.log(userId)

  const user = await Register.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const smsMessage = `Welcome to ORANGEPAY Thank You for registration.  Your login details username:${user.userId}, Password: ${user.password}/${user.tpin} `;
  const mobileNumber = user.mobileNumber;
  const senderName = 'OrgPay';
  const apiKey = 'e7d09e93-0dd3-4a00-9cfc-2c53854033f2';

  const smsUrl = `http://login.aquasms.com/sendSMS?username=7004142281&message=${encodeURIComponent(smsMessage)}&sendername=${senderName}&smstype=TRANS&numbers=${mobileNumber}&apikey=${apiKey}`;
  
  try {
    console.log("Sending SMS to URL:", smsUrl); // Log the complete URL for debugging
    const smsResponse = await axios.get(smsUrl);
    
    // Check if the SMS was successfully sent
    if (smsResponse.status === 200) {
      return res.status(200).json({ message: 'Credentials resent successfully via SMS!' });
    } else {
      return res.status(500).json({ message: 'Failed to send SMS' });
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return res.status(500).json({ message: 'An error occurred while sending SMS' });
  }
});
 



const cancellationHistoryy = asyncHandler(async (req, res) => {
  try {
    const history = await CancellationDetail.find({}); 
    console.log('Fetched history:', history); // Add this line to log the retrieved data

    if (!history || history.length === 0) {
      return res.status(404).json({ message: 'No cancellation history found.' });
    }

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching cancellation history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Unable to retrieve cancellation history.',
    });
  }
});




const sbData = asyncHandler(async (req, res) => {
  try {
    const history = await Sbdata.find({}); 
    console.log('Fetched history:', history);

    if (!history || history.length === 0) {
      return res.status(404).json({ message: 'No cancellation history found.' });
    }

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching cancellation history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Unable to retrieve cancellation history.',
    });
  }
});


const validateTpin = asyncHandler(async (req, res) => {
  const { userId, tpin } = req.body; // Destructure userId and Tpin from request body

  // Check if both userId and Tpin are provided
  if (!userId || !tpin) {
    return res.status(400).json({ success: false, message: 'User ID and Tpin are required' });
  }

  try {
    // Retrieve user from database by userId
    const user = await Register.findById(userId);

    // Check if user exists and if the provided Tpin matches the stored Tpin
    if (user && user.tpin === tpin) {
      return res.json({ success: true, message: 'Tpin is valid' });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect Tpin' });
    }
  } catch (error) {
    console.error('Error validating Tpin:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});




// const WalletTransaction = asyncHandler(async(req,res) => {

// })


// Define the API endpoint using asyncHandler
const fetchUserByIdd = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
    const user = await FundRequest.findById({_id:id}); // Find the user by ID

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log("User found: ", user); // Log the user object

    res.status(200).json({ success: true, user }); // Return the user data

  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export { registerUser,cancellationHistoryy,registerSAdmin,resendCredential, validateTpin,changeTpin,sbData,cancelAccept,cancelReject,verifyOtp, fetchWalletBalance,cancellationDetails,cancellationHistory, getCancellation, updateUserCommission, verifyAadhaar, changePassword, fetchUserByIdd, fetchFundRequestsById, blockUserList, statuss, updateUserPermissions, fetchUserListbyId, fetchDataa, images, registerTransaction, loginUser, reports, fetchData, updateUser, fetchIdData, deleteUser, registeredUser, fundRequest, fetchData_reject, fetchFundRequest, fetchFundRequests, approveFundRequest, rejectFundRequest, fetchUserList, approveUserRequest, rejectUserRequest, fetchUserById, downloadUserImages, updateProfile, unblockUser, blockUser, logoutUser };

