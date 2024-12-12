import express, { response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import upload from "./middleware/filehandle.middleware.js";
import { registerUser } from "./controller/user.controller.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo"
import { createProxyMiddleware } from "http-proxy-middleware";
import cron from "node-cron";
import axios from "axios";
import { parseStringPromise} from 'xml2js';
import xml2js from "xml2js"
import { crc32 } from "crc";




const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.options('*', cors());



app.use(express.json()); // Add this middleware before multer
app.use(express.urlencoded({ extended: true }));
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




app.use('/biharpayment', createProxyMiddleware({
  target: 'http://1.6.61.79/BiharService',
  changeOrigin: true,
  pathRewrite: {
    '^/biharpayment': '',
  },
  logLevel: 'debug', // Enables detailed logging
}));







// app.post('/fetch-bill', async (req, res) => {
//   const { consumerId } = req.body;

//   const soapPayload = `
//   <?xml version="1.0" encoding="utf-8"?>
//   <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//     <soap:Body>
//       <BillDetails xmlns="http://tempuri.org/">
//         <strCANumber>${consumerId}</strCANumber>
//         <strDivision></strDivision>
//         <strSubDivision></strSubDivision>
//         <strLegacyNo></strLegacyNo>
//         <strMerchantCode>BSPDCL_RAPDRP_16</strMerchantCode>
//         <strMerchantPassword>OR1f5pJeM9q@G26TR9nPY</strMerchantPassword>
//       </BillDetails>
//     </soap:Body>
//   </soap:Envelope>`;

//   try {
//     const response = await axios.post(`/api`, soapPayload, {
//       headers: {
//         'Content-Type': 'text/xml',
//         'SOAPAction': 'http://tempuri.org/BillDetails',
//       },
//     });
//     res.send(response.data);
//   } catch (error) {
//     res.status(500).send({ message: 'Error fetching bill', error: error.message });
//   }
// });




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



const formatDateTime = () => { const now = new Date(); const year = now.getFullYear(); const month = String(now.getMonth() + 1).padStart(2, '0'); const day = String(now.getDate()).padStart(2, '0'); const hours = String(now.getHours()).padStart(2, '0'); const minutes = String(now.getMinutes()).padStart(2, '0'); const seconds = String(now.getSeconds()).padStart(2, '0'); return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`; };



function generateChecksum(amount, privateKey) {
  if (typeof amount !== "string") {
    amount = amount.toString();
  }
  const data = amount + privateKey; // Concatenate the amount with the private key
  const checksum = crc32(data); // Generate CRC32 checksum
  return checksum.toString(10); // Return as a decimal string
}

const fetchBillDetails = async (consumerId) => {
  const MERCHANT_CODE = "BSPDCL_RAPDRP_16";
  const MERCHANT_PASSWORD = "OR1f5pJeM9q@G26TR9nPY";
  const xmlPayload = `
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


  // console.log(xmlPayload)

  try {
    const response = await axios.post(
      "http://1.6.61.79/BiharService/BillInterface.asmx?op=BillDetails",
      xmlPayload,
      {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
        },
      }
    );

    // console.log(response)

    const parsedResponse = await parseStringPromise(response.data);
    const billDetails =
      parsedResponse["soap:Envelope"]["soap:Body"][0]["BillDetailsResponse"][0][
        "BillDetailsResult"
      ][0];

    // Extract required details
    return {
      dueDate: billDetails["DueDate"]?.[0] || null,
      invoiceNumber: billDetails["InvoiceNO"]?.[0] || null,
      consumerName: billDetails["ConsumerName"]?.[0] || null,
      division: billDetails["Division"]?.[0] || null,
      subDivision: billDetails["SubDivision"]?.[0] || null,
      billMonth: billDetails["BillMonth"]?.[0] || null,
      amount: billDetails["Amount"]?.[0] || null,
      companyName: billDetails["CompanyName"]?.[0] || null,
    };
  } catch (error) {
    console.error("Error fetching bill details:", error.message);
    throw new Error("Failed to fetch bill details");
  }
};

// Process payment function
const processPayment = async (payment, billDetails, amount) => {
  const transactionId = payment.transactionId || `txn_${Date.now()}`;
  const checksum = generateChecksum(amount, "d8bKEaX1XEtB");
  const formattedDateTime = formatDateTime();

  const paymentXmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <PaymentDetails xmlns="http://tempuri.org/">
      <strCANumber>${payment.canumber}</strCANumber>
      <strInvoiceNo>${billDetails.invoiceNumber}</strInvoiceNo>
      <strDueDate>${billDetails.dueDate}</strDueDate>
      <strAmount>${payment.paidamount}</strAmount>
      <strCompanyCode>SBPDCL</strCompanyCode>
      <strTransactionId>${transactionId}</strTransactionId>
      <strTransactionDateTime>${formattedDateTime}</strTransactionDateTime>
      <strReceiptNo>${transactionId}</strReceiptNo>
      <strBankRefCode></strBankRefCode>
      <strBankId></strBankId>
      <strPaymentMode>${payment.paymentmode}</strPaymentMode>
      <strMerchantCode>BSPDCL_RAPDRP_16</strMerchantCode>
      <strMerchantPassword>OR1f5pJeM9q@G26TR9nPY</strMerchantPassword>
      <strCkeckSum>${checksum}</strCkeckSum>
    </PaymentDetails>
  </soap:Body>
</soap:Envelope>
  `;






  // console.log(paymentXmlPayload)

  try {
    const response = await axios.post(
      "http://1.6.61.79/BiharService/BillInterface.asmx?op=PaymentDetails",
      paymentXmlPayload,
      { headers: { "Content-Type": "text/xml; charset=utf-8" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error in processPayment:", error.response?.data || error.message);
    throw error;
  }
  
};




const processBill = async (transactionId) => {
  const MERCHANT_CODE = "BSPDCL_RAPDRP_16";
  const MERCHANT_PASSWORD = "OR1f5pJeM9q@G26TR9nPY";
 

  const billXmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <PaymentReceiptDetails xmlns="http://tempuri.org/">
      <strTransactionId>${transactionId}</strTransactionId>
      <strMerchantCode>${MERCHANT_CODE}</strMerchantCode>
      <strMerchantPassword>${MERCHANT_PASSWORD}</strMerchantPassword>
    </PaymentReceiptDetails>
  </soap:Body>
</soap:Envelope>
`.trim();







  console.log(billXmlPayload)

  try {
    const response = await axios.post(
      "http://1.6.61.79/BiharService/BillInterface.asmx?op=PaymentDetails",
      billXmlPayload,
      { headers: { "Content-Type": "text/xml; charset=utf-8" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error in processPayment:", error.response?.data || error.message);
    throw error;
  }


  
};





// Cron job for processing payments
const processPendingPayments = async () => {
  console.log("Scheduler running: Checking pending payments");

  const pendingPayments = await Payment.find({ billpoststatus: "Pending" }).exec();

  if (!pendingPayments.length) {
    console.log("No pending payments found");
    return;
  }

  for (const payment of pendingPayments) {
    try {
      const billDetails = await fetchBillDetails(payment.canumber);
      const result = await processPayment(payment, billDetails, payment.paidamount);

      xml2js.parseString(result, { trim: true }, async (err, parsedResult) => {
        if (err) {
          console.error(`Error parsing XML for payment ID ${payment._id}:`, err.message);
          return;
        }

        const statusFlag = parsedResult['soap:Envelope']['soap:Body'][0]['PaymentDetailsResponse'][0]['PaymentDetailsResult'][0]['StatusFlag'][0];

        if (statusFlag === "1") {
          const billData = await processBill(payment.transactionId);

          let bspdclReceiptNo = null;
          xml2js.parseString(billData, { trim: true }, (err, parsedBillData) => {
            if (err) {
              console.error(`Error parsing bill data for transaction ${payment.transactionId}:`, err.message);
              return;
            }

            console.log("Full billData response:", JSON.stringify(parsedBillData, null, 2));

            // Correct path to access BSPDCL_Receipt_No
            bspdclReceiptNo = parsedBillData?.['soap:Envelope']?.['soap:Body']?.[0]?.['PaymentReceiptDetailsResponse']?.[0]?.['PaymentReceiptDetailsResult']?.[0]?.['BSPDCL_Receipt_No']?.[0];

            if (bspdclReceiptNo) {
              console.log(`BSPDCL Receipt No: ${bspdclReceiptNo}`);
            } else {
              console.log("BSPDCL Receipt No not found in bill data.");
            }
          });

          const invoiceNumber = billDetails.invoiceNumber;
          const dueDate = billDetails.dueDate;
          let companyName = billDetails.companyName || null;

          if (companyName === "SOUTH BIHAR POWER DISTRIBUTION COMPANY LTD") {
            companyName = "SBPDCL";
          }
          const billMonth = billDetails.billMonth;

          console.log(`Invoice Number: ${invoiceNumber}`);
          console.log(`Due Date: ${dueDate}`);
          console.log(`Company Name: ${companyName}`);
          console.log(`Bill Month: ${billMonth}`);
          console.log(`BSPDCL Receipt No: ${bspdclReceiptNo}`);

          if (!billData) {
            throw new Error("Bill data not found");
          }

          // Log the entire billData to inspect its structure
          console.log("Full Bill Data:", JSON.stringify(billData, null, 2));
          payment.billpoststatus = "Success";
          payment.invoicenumber = invoiceNumber;
          payment.billmonth = billMonth;
          payment.brandcode = companyName;
          payment.duedate = dueDate;
          payment.reciptno = bspdclReceiptNo;
          await payment.save();
          console.log(`Payment ID ${payment._id} processed successfully`);
        } else {
          console.error(`Payment ID ${payment._id} failed`);
        }
      });
    } catch (error) {
      console.error(`Error processing payment ID ${payment._id}:`, error.message);
    }
  }
};

// Use the function in the cron job
let paymentScheduler = cron.schedule("0 */2 * * *", processPendingPayments);

// Optionally, call the function manually
app.post('/api/v1/users/start-scheduler', async (req, res) => {
  if (paymentScheduler.running) {
    return res.status(400).json({ message: 'Scheduler is already running.' });
  }

  try {
    console.log("Scheduler manually triggered");
    await processPendingPayments();
    res.status(200).json({ message: 'Scheduler manually triggered successfully.' });
  } catch (error) {
    console.error("Error during manual scheduler execution:", error.message);
    res.status(500).json({ message: 'Error during manual execution.', error: error.message });
  }
});





app.use("/api/v1/users", userRouter)




export { app };