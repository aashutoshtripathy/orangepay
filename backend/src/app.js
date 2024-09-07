import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import upload from "./middleware/filehandle.middleware.js";
import { registerUser } from "./controller/user.controller.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import  session  from "express-session";
import MongoStore from "connect-mongo"



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static())
app.use(cookieParser())
app.use(bodyParser.json())

app.use(session({
  name: 'sessionID', // Name of the session cookie
  secret: 'your-secret-key', // Secret key to sign the session ID cookie
  resave: false, // Do not save session if unmodified
  saveUninitialized: false, // Do not create a session until something is stored
  cookie: {
    httpOnly: true, // Prevent JavaScript access to session cookie
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'Strict' // Prevent CSRF attacks
  }
  }));


import userRouter from "./routes/user.routes.js"
import bodyParser from "body-parser";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// // Initialize Multer upload
// const multerUpload = multer({ storage: storage });

// // Serve the "uploads" folder statically
// app.use('/uploads', express.static('uploads'));

// // Define route to handle file upload
// app.post('/upload', multerUpload.single('photograph'), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         res.status(200).json({
//             message: 'File uploaded successfully',
//             file: req.file
//         });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });



app.use("/api/v1/users", userRouter)




export { app };