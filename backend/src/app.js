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
import http from "http";
import {Server} from "socket.io";





const app = express();
const server = http.createServer(app);
// const io = new Server(server);

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






const io = new Server(server, {
  cors: {
      origin: '*', // Replace with your frontend URL
      methods: ['GET', 'POST'],
  },
});




let dbMode = 'online'; // Default mode

// REST API to update database mode
app.post('/update-db-mode', (req, res) => {
    const { mode } = req.body;

    if (!['online', 'offline'].includes(mode)) {
        return res.status(400).json({ message: 'Invalid mode' });
    }

    dbMode = mode;
    console.log(`Database mode updated to: ${dbMode}`);

    // Notify all connected clients
    io.emit('dbModeUpdated', dbMode);

    res.json({ message: 'Database mode updated successfully', dbMode });
});

// REST API to get the current database mode
app.get('/db-mode', (req, res) => {
    res.json({ dbMode });
});

// Handle client connection
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Send the current mode to the newly connected client
    socket.emit('dbModeUpdated', dbMode);

    socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
    });
});




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
      caNumber: billDetails["CANumber"]?.[0] || null,
      dueDate: billDetails["DueDate"]?.[0] || null,
      mobileNumber: billDetails["MobileNumber"]?.[0] || null,
      invoiceNumber: billDetails["InvoiceNO"]?.[0] || null,
      consumerName: billDetails["ConsumerName"]?.[0] || null,
      division: billDetails["Division"]?.[0] || null,
      subDivision: billDetails["SubDivision"]?.[0] || null,
      billMonth: billDetails["BillMonth"]?.[0] || null,
      amount: billDetails["Amount"]?.[0] || null,
      address: billDetails["Address"]?.[0] || null,
      companyName: billDetails["CompanyName"]?.[0] || null,
    };
  } catch (error) {
    console.error("Error fetching bill details:", error.message);
    throw new Error("Failed to fetch bill details");
  }
};


// Process payment function
const processPayments = async (paymentMethod, billDetails, amount) => {
  // const transactionId = payment.transactionId || `txn_${Date.now()}`;
  const checksum = generateChecksum(amount, "d8bKEaX1XEtB");
  const formattedDateTime = formatDateTime();

  const paymentXmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <PaymentDetails xmlns="http://tempuri.org/">
      <strCANumber>${String(billDetails.caNumber)}</strCANumber>
      <strInvoiceNo>${billDetails.invoiceNumber}</strInvoiceNo>
      <strDueDate>${billDetails.dueDate}</strDueDate>
      <strAmount>${amount}</strAmount>
      <strCompanyCode>SBPDCL</strCompanyCode>
      <strTransactionId>${billDetails.transactionId}</strTransactionId>
      <strTransactionDateTime>${formattedDateTime}</strTransactionDateTime>
      <strReceiptNo>${billDetails.transactionId}</strReceiptNo>
      <strBankRefCode></strBankRefCode>
      <strBankId></strBankId>
      <strPaymentMode>${paymentMethod}</strPaymentMode>
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




app.post('/api/v1/users/bill-details', async (req, res) => {
  const { consumerId } = req.body;
  try {
    const billDetails = await fetchBillDetails(consumerId);
    res.status(200).json(billDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/v1/users/process-payment', async (req, res) => {
  const { paymentMethod, billDetails, amount } = req.body;

  // Validate input parameters
  if (!billDetails || !amount) {
    return res.status(400).json({ error: "Missing required fields: billDetails, amount" });
  }

  try {
    // Call the processPayment function
    const result = await processPayments(paymentMethod, billDetails, amount);

    if (!result) {
      return res.status(500).json({ error: "No response data from payment processing" });
    }

    console.log("Raw response data:", result);  // Log the raw response data

    // Parse the XML response using promise-based API
    const parsedResult = await xml2js.parseStringPromise(result, { trim: true, explicitArray: false });

    // Log the parsed result to verify structure
    console.log("Parsed XML Result:", parsedResult);

    // Safely access the properties using optional chaining
    const statusFlag = parsedResult?.['soap:Envelope']?.['soap:Body']?.['PaymentDetailsResponse']?.['PaymentDetailsResult']?.StatusFlag;
    const message = parsedResult?.['soap:Envelope']?.['soap:Body']?.['PaymentDetailsResponse']?.['PaymentDetailsResult']?.Message;

    if (!statusFlag) {
      console.error("StatusFlag is missing");
      return res.status(500).json({ error: "Missing StatusFlag in response" });
    }

    if (!message) {
      console.error("Message is missing");
      return res.status(500).json({ error: "Missing Message in response" });
    }

    console.log("Status Flag:", statusFlag);  // Log Status Flag
    console.log("Message:", message);  // Log Message

    const transactionId = billDetails.transactionId;

    if (statusFlag === "1") {
      const transactionUpdate = await Payment.findOne({ transactionId });

      if (!transactionUpdate) {
        return res.status(404).json({ error: "Transaction ID not found in the Payment table" });
      }

      // Update the receiptNo field
      transactionUpdate.billpoststatus = "Success";

      // Save the updated document back to the database
      await transactionUpdate.save();

      // Successful payment
      return res.status(200).json({
        success: true,
        transactionId: transactionId,
        message: "Payment processed successfully",
        data: parsedResult,
      });
    } else {
      // Failed payment
      return res.status(400).json({
        success: false,
        message: message || "Payment failed",
        data: parsedResult,
      });
    }
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return res.status(500).json({ error: error.message });
  }
});



app.post('/api/v1/users/process-bill', async (req, res) => {
  const { transactionId } = req.body;

  // Validate that transactionId is provided
  if (!transactionId) {
    return res.status(400).json({ error: "Missing required field: transactionId" });
  }

  try {
    console.log("Received transaction ID:", transactionId);

    // Call the processBill function
    const result = await processBill(transactionId);

    console.log("Raw XML Response:", result);

    // Parse the XML response
    xml2js.parseString(result, { trim: true }, async (err, parsedResult) => {
      if (err) {
        console.error("Error parsing XML response:", err.message);
        return res.status(500).json({ error: "Failed to parse bill response" });
      }

      console.log("Parsed XML Response:", JSON.stringify(parsedResult, null, 2));

      // Extract the relevant fields from the parsed XML response
      const paymentResult = parsedResult?.['soap:Envelope']?.['soap:Body']?.[0]?.['PaymentReceiptDetailsResponse']?.[0]?.['PaymentReceiptDetailsResult']?.[0];
      
      if (!paymentResult) {
        return res.status(500).json({ error: "Invalid response structure" });
      }

      // Extract specific fields from the response
      const receiptNo = paymentResult['BSPDCL_Receipt_No']?.[0];
      const consumerName = paymentResult['ConsumerName']?.[0];
      const billNo = paymentResult['BillNo']?.[0];
      const billDueDate = paymentResult['BillDueDate']?.[0];
      const modePayment = paymentResult['ModePayment']?.[0];
      const paymentDateTime = paymentResult['PaymentDateTime']?.[0];
      const consumerId = paymentResult['CANumber']?.[0];
      const amountPaid = paymentResult['AmountPaid']?.[0];
      const errorMessage = paymentResult['ErrorMessage']?.[0] || ""; // Default to an empty string if undefined

      if (errorMessage === "") {
        console.log("Bill processed successfully. Updating database...");

        // Update the transaction with receiptNo in the Payment table
        const transactionUpdate = await Payment.findOne({ transactionId });

        if (!transactionUpdate) {
          return res.status(404).json({ error: "Transaction ID not found in the Payment table" });
        }
        
        // Update the receiptNo field
        transactionUpdate.reciptno = receiptNo;
        
        // Save the updated document back to the database
        await transactionUpdate.save();
        
        console.log("Transaction updated successfully:", transactionUpdate);

        if (transactionUpdate.modifiedCount === 0) {
          console.warn("Transaction ID not found in the database.");
          return res.status(404).json({ error: "Transaction ID not found in the Payment table" });
        }

        // Send a success response
        return res.status(200).json({
          success: true,
          message: "Bill processed successfully",
          data: {
            consumerId,
            receiptNo,
            transactionId,
            consumerName,
            amountPaid,
            billNo,
            billDueDate,
            modePayment,
            paymentDateTime,
          },
        });
      } else {
        console.error("Error in bill processing:", errorMessage);
        return res.status(400).json({
          success: false,
          message: errorMessage,
          data: {
            receiptNo,
            transactionId,
            consumerName,
            amountPaid,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error processing bill:", error.message);
    return res.status(500).json({ error: error.message });
  }
});







const fetchConsumerBalanceDetails = async (consumerId) => {
  const USERNAME = "SMOR";
  const PASSWORD = "Op#4321@$M";
  const xmlPayload = `
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Header>
        <UserCredentials xmlns="http://bsphcl.co.in/">
          <username>${USERNAME}</username>
          <password>${PASSWORD}</password>
        </UserCredentials>
      </soap12:Header>
      <soap12:Body>
        <GetConsumerBalanceDetails xmlns="http://bsphcl.co.in/">
          <StrCANumber>${consumerId}</StrCANumber>
        </GetConsumerBalanceDetails>
      </soap12:Body>
    </soap12:Envelope>
  `;

  try {
    const response = await axios.post(
      "http://hargharbijli.bsphcl.co.in/WebServiceExternal/WebServiceOPSM.asmx?op=GetConsumerBalanceDetails",
      xmlPayload,
      {
        headers: {
          "Content-Type": "application/soap+xml; charset=utf-8",
        },
      }
    );

    console.log("Raw SOAP Response:", response.data);

    const parsedResponse = await parseStringPromise(response.data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    console.log("Parsed Response:", JSON.stringify(parsedResponse, null, 2));

    // Accessing the correct nodes
    const balanceDetailsJson =
      parsedResponse["soap:Envelope"]?.["soap:Body"]?.["GetConsumerBalanceDetailsResponse"]?.["GetConsumerBalanceDetailsResult"];

    if (!balanceDetailsJson) {
      throw new Error("Invalid SOAP Response: Missing Balance Details");
    }

    // Parsing the embedded JSON string
    const balanceDetails = JSON.parse(balanceDetailsJson);

    console.log("Extracted Balance Details:", balanceDetails);

    // Extract the required details
    return {
      balance: balanceDetails.Balance || null,
      consumerNumber: balanceDetails.Consumer_number || null,
      responseDateTime: balanceDetails.responseDateTime || null,
      status: balanceDetails.status || null,
      meterNumber: balanceDetails.MeterNumber || null,
      connectionStatus: balanceDetails.ConnectionStatus || null,
      lastPaymentDate: balanceDetails.LastPayDt || null,
      lastPaymentAmount: balanceDetails.LastPayAmt || null,
    };
  } catch (error) {
    console.error("Error fetching consumer balance details:", error.message);
    throw new Error("Failed to fetch consumer balance details");
  }
};







app.post('/api/v1/users/consumer-balance-details', async (req, res) => {
  const { consumerId } = req.body;
  try {
    const balanceDetails = await fetchConsumerBalanceDetails(consumerId);
    res.status(200).json(balanceDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





app.post('/api/v1/users/generate-qr', async (req, res) => {
  const { amount, customerMobileNumber, customerName } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const externalRefNumber = `OP${Date.now()}`; // Unique reference number
  const requestBody = {
    amount: parseFloat(amount),
    appKey: '74820c5e-7ed9-401c-bfcd-9bd47d525ae6',
    customerMobileNumber,
    customerName,
    externalRefNumber,
    username: 9810698100,
    checksum: generateChecksume(amount), // Attach checksum
  };

  try {
    const response = await axios.post(
      'https://demo.ezetap.com/api/2.0/merchant/upi/qrcode/generate',
      requestBody
    );

    if (response.data && response.data.qrCodeUri) {
      return res.status(200).json({
        qrCodeUri: response.data.qrCodeUri,
        externalRefNumber,
      });
    } else {
      return res.status(500).json({ message: 'Failed to generate QR code' });
    }
  } catch (error) {
    console.error('Error generating QR code:', error.message);
    return res.status(500).json({
      message: error.response?.data?.message || 'An error occurred',
    });
  }
});

// Checksum generation logic (adapt as per Ezetap's documentation)
const generateChecksume = (amount) => {
  const secretKey = process.env.EZETAP_SECRET_KEY || 'base64';
  const payload = `${amount}${secretKey}`; // Example payload
  return crypto.createHash('sha256').update(payload).digest('hex');
};






app.use("/api/v1/users", userRouter)




export { app };