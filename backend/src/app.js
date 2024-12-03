import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import upload from "./middleware/filehandle.middleware.js";
import { registerUser } from "./controller/user.controller.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo"
import createProxyMiddleware from "http-proxy-middleware"
import cron from "node-cron";
import axios from "axios";




const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.options('*', cors());



app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ extended: true, limit: "16kb" }))
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
    sameSite: 'Strict', // Prevent CSRF attacks
    maxAge: 60 * 60 * 1000 // Set cookie expiration time to 1 hour (in milliseconds)
  }
}));


// app.use('/proxy-bill', createProxyMiddleware({
//   target: 'http://1.6.61.79/BiharService/BillInterface.asmx', // External SOAP service URL
//   changeOrigin: true, // Ensures that the origin of the request is changed to the target
//   pathRewrite: {
//     '^/proxy-bill': '', // Remove /proxy-bill prefix from the request URL
//   },
//   onProxyReq: (proxyReq, req, res) => {
//     // Modify the request if necessary (e.g., add headers, body, etc.)
//     if (req.body) {
//       proxyReq.setHeader('Content-Type', 'text/xml');
//       proxyReq.setHeader('SOAPAction', 'http://tempuri.org/BillDetails');
//     }
//   },
// }));


app.post('/fetch-bill', async (req, res) => {
  const { consumerId } = req.body;

  const soapPayload = `
  <?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <BillDetails xmlns="http://tempuri.org/">
        <strCANumber>${consumerId}</strCANumber>
        <strDivision></strDivision>
        <strSubDivision></strSubDivision>
        <strLegacyNo></strLegacyNo>
        <strMerchantCode>BSPDCL_RAPDRP_16</strMerchantCode>
        <strMerchantPassword>OR1f5pJeM9q@G26TR9nPY</strMerchantPassword>
      </BillDetails>
    </soap:Body>
  </soap:Envelope>`;

  try {
    const response = await axios.post('http://1.6.61.79/BiharService/BillInterface.asmx', soapPayload, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://tempuri.org/BillDetails',
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching bill', error: error.message });
  }
});




import userRouter from "./routes/user.routes.js"
import bodyParser from "body-parser";
import { Payment } from "./model/Payment.model.js";

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


cron.schedule('* * * * *', async () => {
  try {
    console.log('Scheduler running: Checking pending billpoststatus every 2 hours');

    // Fetch records where billpoststatus is 'pending'
    const pendingPayments = await Payment.find({ billpoststatus: 'Pending' }).exec();

    if (!pendingPayments || pendingPayments.length === 0) {
      console.log('No pending payments found');
      return;
    }

    console.log(`Found ${pendingPayments.length} pending payments`);

    // Process each pending payment
    for (const payment of pendingPayments) {
      try {
        console.log(`Processing payment ID: ${payment._id}`);
        const consumerId = payment.canumber;

        const MERCHANT_CODE = 'BSPDCL_RAPDRP_16';
        const MERCHANT_PASSWORD = 'OR1f5pJeM9q@G26TR9nPY';


        const soapRequest = (consumerId) => `
        <?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <BillDetails xmlns="http://tempuri.org/">
              <strCANumber>${consumerId}</strCANumber>
              <strMerchantCode>${MERCHANT_CODE}</strMerchantCode>
              <strMerchantPassword>${MERCHANT_PASSWORD}</strMerchantPassword>
            </BillDetails>
          </soap:Body>
        </soap:Envelope>
        `;


        const xmlPayload = soapRequest(consumerId); // Generate the SOAP XML payload
        console.log(xmlPayload)

        if (!xmlPayload) {
          console.error("Failed to generate XML payload due to missing CANumber.");
          return;
        }

        // Send SOAP request via Axios
        const response = await axios.post(`http://1.6.61.79/BiharService/BillInterface.asmx?op=BillDetails`, xmlPayload, {
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Accept': 'application/xml, text/xml, application/json',
          },
        });
        console.log("Response " , response)
        
        console.log("SOAP Response Status:", response.status);
        console.log("SOAP Response Headers:", response.headers);
        console.log("SOAP Response Body:", response.data);
        
        // Check the response for possible issues
        if (response.status !== 200) {
          console.error('Error: Received non-OK status code:', response.status);
        } else {
          // Continue parsing the XML response as needed
        }
        
      
        console.log("SOAP Response:", response.data);
        // Parse the XML response using DOMParser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const namespaceURI = "http://tempuri.org/";

        // Extract BillDetailsResult using the namespace
        const billDetails = xmlDoc.getElementsByTagNameNS(namespaceURI, "BillDetailsResult")[0];
        console.log(billDetails)

        if (billDetails) {
          const statusFlag = billDetails.getElementsByTagName("StatusFlag")[0].textContent;
          const message = billDetails.getElementsByTagName("Message")[0].textContent;

          console.log("StatusFlag:", statusFlag);
          console.log("Message:", message);

          if (statusFlag === '1') {
            console.log('Transaction successful');
          } else {
            console.error('Transaction failed:', message);
          }
        } else {
          console.error("BillDetailsResult not found in the response.");
        }

        // Hit the server API to verify/update the billpoststatus
        // const response = await axios.post('http://your-server-api-url.com/endpoint', {
        //   paymentId: payment._id,
        //   amount: payment.amount,
        //   otherDetails: payment.otherDetails, // Include other required fields
        // });

        if (response.data.success && response.data.updatedStatus === 'success') {
          console.log(`Payment ID ${payment._id} updated successfully`);

          // Update the status in the database
          // payment.billpoststatus = 'success';
          await payment.save();
        } else {
          console.log(
            `Payment ID ${payment._id} not updated. Server response: `,
            response.data
          );
        }
      } catch (apiError) {
        console.error(
          `Error updating payment ID ${payment._id}: `,
          apiError.message
        );
      }
    }
  } catch (error) {
    console.error('Error running scheduler:', error);
  }
});




app.use("/api/v1/users", userRouter)




export { app };