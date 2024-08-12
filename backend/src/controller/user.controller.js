import { Register } from "../model/Register.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import upload from "../middleware/filehandle.middleware.js";
import bcrypt from "bcrypt"
import multer from "multer";
import path from "path";

import fs from 'fs';

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
     const {usernameEmail,password} = req.body
 
     if(!usernameEmail){
         throw new ApiError(400,"username email is required")
     }
 
     const user = await Signup.findOne({
         $or: [{username:usernameEmail},{email:usernameEmail}]
     })
     console.log(user)
     
 
     if(!user){
         throw new ApiError(400,"user does not exist")
     }
        // console.log(user)
    //  const isPasswordValid = await bcrypt.compare(password, user.password);
    // const isPasswordValid = await user.isPasswordCorrect(password);
     

    if (user.password !== password) {
        throw new ApiError(400, "Invalid User Credentials")
    }   
 
    //  if(!isPasswordValid){
    //      throw new ApiError(400,"Invalid User Credential")
    //  }


      // Generate access token
    //   const accessToken = jwt.sign(
    //     { _id: user._id, username: user.username, email: user.email },
    //     process.env.ACCESS_TOKEN_SECRET,
    //     { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    // );

 
     return res.status(200).json(
         new ApiResponse(200,{success: true,message: "User Logged in Successfully"})
     )
   } catch (error) {
    console.error("Error in sending the response",error)
    return res.status(500).json(new ApiError(500,"error","Internal Server Error"))
   }
})

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

export { registerUser, loginUser , user , fetchData , updateUser , fetchIdData , deleteUser };

