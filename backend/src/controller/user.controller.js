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
// import path from 'path';

// Define __dirname in ES module





// app.use('/public', express.static(path.join(__dirname, 'public')));



// const accountSid = 'your_account_sid'; // Your Twilio Account SID
// const authToken = 'your_auth_token';   // Your Twilio Auth Token
// const twilioClient = twilio(accountSid, authToken);
// const twilioPhoneNumber = 'your_twilio_phone_number'; 


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const aadharNumber = req.body.aadharNumber;
        const dir = path.join('public/images',aadharNumber);
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
    { name: 'signature', maxCount: 1 }
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
            subDivision, section, sectionType, ifsc, district, pincode, bank ,accountno,consumerId,
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
        const user = await Register.create({
            name, fatherOrHusbandName, dob, aadharNumber, panNumber, mobileNumber,
            gender, maritalStatus, education, address, salaryBasis, email, division,
            subDivision, section, sectionType, ifsc, district, pincode, bank ,accountno,consumerId,
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
    const  userId  = req.params.id; // Assuming userId is passed as a parameter in the request
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

  try {
      // Find the user and update their status to 'Blocked'
      const user = await Register.findOneAndUpdate(
          { userId },
          { isBlocked: true, status: 'Blocked' },
          { new: true } // Return the updated document
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

  try {
      // Find the user and update their status to 'Approved'
      const user = await Register.findOneAndUpdate(
          { userId },
          { isBlocked: false, status: 'Approved' },
          { new: true } // Return the updated document
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


const approveUserRequest = asyncHandler(async (req, res) => {
    try {
        const customId = generateRandomId()
      // Find the user by ID and update the status to "approved" along with generating userId and password
      const updatedUser = await Register.findByIdAndUpdate(
        req.params.id,
        {
          status: 'Approved',
          userId: customId, // Generate a random userId
          password: generateRandomPassword(12), // Generate a random password
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
  


const rejectUserRequest = asyncHandler(async (req, res) => {
    try {
      // Find the user by ID and update the status to "rejected"
      const updatedUser = await Register.findByIdAndUpdate(
        req.params.id,
        { status: 'Rejected' }, // Set the status to "rejected"
        { new: true } // Return the updated document
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
    console.log(userId)
  
    try {
      // Find the user by ID
    //   const user = await Register.findById(userId); 
    const fundRequests = await FundRequest.find({ userId });
    console.log(fundRequests)
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      console.log("User ID: ", user.userId); // Log the userId from the Register collection
  
      // Find all fund requests related to this user
    //   const fundRequests = await FundRequest.find({ userId: userId }); // Query the FundRequest collection by userId
  
      // Check if any fund requests exist
      if (!fundRequests || fundRequests.length === 0) {
        return res.status(200).json({ success: false, message: 'No fund requests found for this user ID', fundRequest: [] });
      }
  
      console.log("Fund requests: ", fundRequests);
      return res.status(200).json({ success: true, fundRequest: fundRequests }); // Return the fund requests
  
    } catch (error) {
      console.error("Error fetching fund request:", error);
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
        // Find all users with status 'approved' from the database
        const fetchUser = await Register.find({ status: 'Approved' }).exec();

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
      // Find the fund request by ID and update the status to "approved"
      const updatedFundRequest = await FundRequest.findByIdAndUpdate(
        req.params.id,
        { status: 'approved' },
        { new: true }
      ).exec();
      // If the fund request is not found, return a 404 error
      if (!updatedFundRequest) {
        return res.status(404).json({ success: false, message: 'Fund request not found' });
      }
  
      // Retrieve the user's wallet associated with the fund request
      const userWallet = await Wallet.findOne({ uniqueId: updatedFundRequest.uniqueId });
  
      // If the wallet is not found, return a 404 error
      if (!userWallet) {
        return res.status(404).json({ success: false, message: 'Wallet not found' });
      }
  
      // Add the fund amount to the wallet balance
      userWallet.balance += updatedFundRequest.fundAmount;
  
      // Save the updated wallet
      await userWallet.save();
  
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




const reports = asyncHandler(async(req,res)  => {
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




const loginUser = asyncHandler(async (req, res) => {
   try {
    console.log(req.body)
     const {username,password} = req.body
 
     if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
      }
 
     const user = await Register.findOne({
        userId:username,
     })
    //      $or: [{username:usernameEmail},{email:usernameEmail}]
    //  })
     console.log(user)
     
 
     if (!user) {
        throw new ApiError(400, "User does not exist");
      }
        // console.log(user)
    //  const isPasswordValid = await bcrypt.compare(password, user.password);
    // const isPasswordValid = await user.isPasswordCorrect(password);

    if(user.status !== "Approved"){
        throw new ApiError(400, "Invalid User");
    }
     

    if (user.password !== password) {
        throw new ApiError(400, "Invalid User Credentials");
      } 
 
  


      const accessToken = jwt.sign(
        { _id: user._id, username: user.username, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

 
      return res.status(200).json(
        new ApiResponse(200, {
          success: true,
          message: "User Logged in Successfully",
          user: {
            id: user._id, 
            username: user.username,
            email: user.email, 
          },
          token: accessToken, 
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

    const user = asyncHandler(async(req,res) => {
        try {
            const {empnumber,email,password,status,role,name} = req.body

            // if(role === "admin"){
                const user = await User.create({
                    name,
                    empnumber,
                    email,
                    password,
                    status,
                    role
                })
            // }else{
        
        //     const user = await User.create({
        //         name,
        //         empnumber,
        //         email,
        //         status,
        //         role
        //     })
        // }
            return res.status(200).json(new ApiResponse(200,"Form Submitted Successfully"))
        } catch (error) {
            return res.status(500).json(new ApiError(500, "error", "Internal Server Error"));
        }
})

// const fetchData = asyncHandler(async(req,res)  => {
//     try {
//         const allUser = await User.find({})
//         // console.log(allUser);
//         console.log("Fetched users:", allUser);
//         return res.status(200).json({ success: true, data: allUser });
//         // return res.status(200).json(new ApiResponse(200,"Form Submitted Successfully"))
//         // return allUser;
//     }
//      catch (error) {
//         return res.status(500).json(new ApiError(500, "error", "Internal Server Error"));
//     }
// })

const fetchIdData = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const fetchedData = await User.findById(userId);
        return res.status(200).json(new ApiResponse(200, fetchedData, "ok"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "error", "internal server error"));
    }
});

const updateUser = asyncHandler(async(req,res) => {
    try {
        const userId = req.params.id;
        const {name,empnumber,email,role,status} = req.body
    
        const updatedUser = await User.findByIdAndUpdate( userId, {
            name,
            empnumber,
            email,
            role,
            status
        },{new:true})
    
        if(!updatedUser){
            throw new ApiError(404,"User not found")
        }
        return res.status(200).json(new ApiResponse(200,updateUser,"User updated Successfully"))
    } catch (error) {
        return res.status(500).json(new ApiError(500,"error","Internal Server Error"))
    }
})


const deleteUser = asyncHandler(async(req,res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId)
        if(!deletedUser){
            return res.status(404).json(new ApiError(404,"error","User not found"))
        }
        return res.status(200).json(new ApiResponse(200,deleteUser,"Deleted Successfully"))
    } catch (error) {
        return res.status(500).json(new ApiError(500,"error","Internal server error"))
    }
})


// Define the API endpoint using asyncHandler
const fetchUserById = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
  
    try {
      const user = await Register.findById(id); // Find the user by ID
  
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

export { registerUser, fetchWalletBalance, registerTransaction , loginUser , reports , user , fetchData , updateUser , fetchIdData , deleteUser , registeredUser , fundRequest , fetchData_reject , fetchFundRequest , fetchFundRequests , approveFundRequest , rejectFundRequest , fetchUserList , approveUserRequest , rejectUserRequest , fetchUserById , downloadUserImages , updateProfile , unblockUser , blockUser };

