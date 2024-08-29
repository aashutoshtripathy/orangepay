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
    { name: 'cheque', maxCount: 1 }
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
            subDivision, section, sectionType
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
            subDivision, section, sectionType,
            photograph: req.files['photograph'] ? req.files['photograph'][0].path : null,
            aadharCard: req.files['aadharCard'] ? req.files['aadharCard'][0].path : null,
            panCard: req.files['panCard'] ? req.files['panCard'][0].path : null,
            educationCertificate: req.files['educationCertificate'] ? req.files['educationCertificate'][0].path : null,
            cheque: req.files['cheque'] ? req.files['cheque'][0].path : null
        });
            console.log(req.files)
        // Send success response
        return res.status(201).json(
            new ApiResponse(201, user, "User Registered Successfully")
        );
    });
});



const generateRandomId = (name) => {
    const randomSuffix = Math.floor(Math.random() * 10000); // Generate a random 4-digit number
    const namePart = name ? name.substring(0, 4).toUpperCase() : 'USER'; // Take the first 4 letters of the name
    return `${namePart}${randomSuffix}`;
};

const generateRandomPassword = (length = 10) => {
    return crypto.randomBytes(length).toString('base64').slice(0, length); // Generate a random password of specified length
};





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
    // Destructure the fields from the request body
    const { userId, fundAmount, bankReference, paymentMethod } = req.body;

    try {
        // Validate required fields
        if (!userId || !fundAmount || !bankReference || !paymentMethod) {
            throw new Error('All fields are required');
        }

        // Create a new fund request
        const newFundRequest = new FundRequest({
            userId,
            fundAmount,
            bankReference,
            paymentMethod,
        });

        // Save the document to the database
        const savedFundRequest = await newFundRequest.save();

        // Return the created transaction
        return res.status(201).json(new ApiResponse(201, savedFundRequest, 'Fund request created successfully'));
    } catch (error) {
        // Catch any errors and send error response
        return res.status(400).json(new ApiError(400, error.message));
    }
});






const fetchFundRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate that the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log("Invalid userId format:", userId);
        return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    try {
        const fundRequest = await FundRequest.find({ userId }).exec();
        
        if (!fundRequest) {
            return res.status(404).json({ success: false, message: 'fund request not found from this id' });
        }

        console.log("fund request: ", fundRequest);

        return res.status(200).json({ success: true, fundRequest });
        
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


const fetchFundRequests = asyncHandler(async (req, res) => {
    try {
        // Find all fund requests from the database
        const fundRequests = await FundRequest.find({}).exec();

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
        // Find all fund requests from the database
        const fetchUser = await Registered.find({}).exec();

        console.log("Fund Requests: ", fetchUser);

        // If no fund requests are found, return a message indicating no requests
        if (fetchUser.length === 0) {
            return res.status(404).json({ success: false, message: 'No fund requests found' });
        }

        // Return the list of all fund requests
        return res.status(200).json({ success: true, fetchUser });
        
    } catch (error) {
        console.error("Error fetching fund requests:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



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
      const userWallet = await Wallet.findOne({ userId: updatedFundRequest.userId });
  
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
  






const rejectedUser = asyncHandler(async (req, res) => {
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


        
        await Register.findByIdAndDelete(id);

        return res.status(200).json(new ApiResponse(200, acceptedUser, "User Accepted and Moved to Registered Collection"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Server Error"));
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




const fetchData = asyncHandler(async(req,res)  => {
    try {
        const allUser = await Register.find({})
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
 
     const user = await Registered.findOne({
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
     

    if (user.password !== password) {
        throw new ApiError(400, "Invalid User Credentials");
      } 
 
    //  if(!isPasswordValid){
    //      throw new ApiError(400,"Invalid User Credential")
    //  }


      // Generate access token
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
            id: user._id, // Send the user ID here
            username: user.username,
            email: user.email, // Optional, send any other required user fields
          },
          token: accessToken, // Include the access token in the response
        })
      );
    } catch (error) {
        console.error("Error in loginUser function:", error); // Log the error for debugging
        if (error instanceof ApiError) {
          return res.status(error.statusCode).json(error); // Return custom API error
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

export { registerUser, fetchWalletBalance, registerTransaction , loginUser , reports , user , fetchData , updateUser , fetchIdData , deleteUser , registeredUser , fundRequest , fetchFundRequest , fetchFundRequests , approveFundRequest , rejectFundRequest , fetchUserList };

