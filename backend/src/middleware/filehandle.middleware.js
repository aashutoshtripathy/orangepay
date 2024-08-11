// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from "url";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__dirname);

// // Ensure the 'uploads' directory exists
// const uploadDirectory = path.join(__dirname, '/upload');
// console.log(uploadDirectory);
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory, { recursive: true });
// }

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDirectory); // Use the full path to the 'uploads/' directory
//   },
//   filename: function (req, file, cb) {
//     // Use backticks for template literals
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// // Initialize upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5000000 }, // 5MB file size limit
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// });

// // Check File Type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png/; // Allowed extensions
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// export default upload;
